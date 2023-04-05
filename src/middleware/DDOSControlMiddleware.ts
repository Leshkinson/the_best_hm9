import {NextFunction, Request, Response} from "express";
import {apiControlRepository} from "../repositories/api-control-repository";
import {ApiRequestControlType} from "../types/types";
import {HTTP_STATUSES} from "../http_statuses";
import moment from "moment";

enum CONTROL_SETTINGS {
    AMOUNT_TRY = 5,
    TIME_FOR_NEXT_TRY = 10
}


const isCheckLastDate = (date: Date) => {
    const currentDate = moment(new Date());
    const checkDate = moment(date);
    const seconds = currentDate.diff(checkDate, 'seconds');
    return seconds < CONTROL_SETTINGS.TIME_FOR_NEXT_TRY
}


export const DDOSControlMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const isHaveRecord = await apiControlRepository.getRecordByFilter({api: req.ip})

    if (!isHaveRecord) {
        const newRecord: ApiRequestControlType = {
            api: req.ip,
            requestControl: [{
                endpoint: req.originalUrl,
                amountTry: 1,
                lastEntryDate: new Date()
            }]
        }
        await apiControlRepository.createRecord(newRecord)
        return next()
    }

    const isHaveEndpoint = isHaveRecord.requestControl.find(el => el.endpoint === req.originalUrl)

    if (!isHaveEndpoint) {
        isHaveRecord.requestControl.push({
            endpoint: req.originalUrl,
            amountTry: 1,
            lastEntryDate: new Date()
        })

        await apiControlRepository.updateRecord({api: req.ip}, {$set: {requestControl: isHaveRecord.requestControl}})
        return next()
    }

    const isEnoughTimeForNextTry = isCheckLastDate(isHaveEndpoint.lastEntryDate);

    if (isHaveEndpoint.amountTry >= CONTROL_SETTINGS.AMOUNT_TRY && isEnoughTimeForNextTry) {
        return res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
    }
    console.log('isEnoughTimeForNextTry', isEnoughTimeForNextTry)
    const updatedRequestControl = isHaveRecord.requestControl.map(el => el.endpoint === req.originalUrl
        ? {...el, amountTry: isEnoughTimeForNextTry ? ++el.amountTry : 1,  lastEntryDate: isEnoughTimeForNextTry ? el.lastEntryDate : new Date()}
        : el
    )

    await apiControlRepository.updateRecord({api: req.ip}, {$set: {requestControl: updatedRequestControl}});

    next();
};
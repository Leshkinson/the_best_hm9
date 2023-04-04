import {NextFunction, Request, Response} from "express";
import {apiControlRepository} from "../repositories/api-control-repository";
import {ApiRequestControlType} from "../types/types";
import {HTTP_STATUSES} from "../http_statuses";
import moment from "moment";

const isCheckLastDate = (date:Date) => {
    const currentDate = moment(new Date());
    const checkDate = moment(date);
    const seconds = currentDate.diff(checkDate, 'seconds');
    return seconds < 10
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
    const a = isCheckLastDate(isHaveEndpoint.lastEntryDate)
    if (isHaveEndpoint.amountTry > 5 &&  a) {
        return res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429)
    }
    const updatedRequestControl = isHaveRecord.requestControl.map(el => el.endpoint === req.originalUrl
        ? {...el, amountTry: a ? 0 : ++el.amountTry, lastEntryDate: new Date()}
        : el
    )

    await apiControlRepository.updateRecord({api: req.ip}, {$set: {requestControl: updatedRequestControl}})

    next()
};
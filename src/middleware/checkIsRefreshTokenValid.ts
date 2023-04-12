import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {jwtService} from "../application/jwt-service";
import {securityDevicesRepository} from "../repositories/securityDevices-repository";


export const checkIsRefreshTokenValid = async (req: Request, res: Response, next: NextFunction) => {
    const {refreshToken} = req.cookies;

    if (!refreshToken) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
    console.log('refreshToken', refreshToken)
    console.log('here1')
    const decodedToken = await jwtService.decodeReFreshToken(refreshToken.refreshToken)

    if (!decodedToken) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
    console.log('here2')
    const {deviceId, lastUpdateDate} = decodedToken

    const isHaveSession = await securityDevicesRepository.getAllUserSessions({deviceId})

    if(!isHaveSession.length || isHaveSession[0].lastUpdateDate !== lastUpdateDate){
        console.log('here3')
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
    console.log('here4')
    return  next();
};
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {jwtService} from "../application/jwt-service";
import {authService} from "../services/auth-service";
import {securityDevicesRepository} from "../repositories/securityDevices-repository";
import {securityDevicesService} from "../services/securityDevices-service";

export const authController = {

    async getMe(req: Request, res: Response) {
        if (req.content.user) {
            const user = await authService.getMe(req.content.user)
            res.status(HTTP_STATUSES.OK200).send(user)
        }
    },

    async authorization(req: Request, res: Response) {
        const title = req.headers["user-agent"] || ''
        const [accessToken, refreshToken] = await authService.authorization(req.content.user, req.ip, title)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
        })

        res.status(HTTP_STATUSES.OK200).json(accessToken)
    },

    async refreshToken(req: Request, res: Response) {
        const {refreshToken} = req.cookies.refreshToken;
        const decodedOldToken = await jwtService.decodeReFreshToken(refreshToken)

        if (decodedOldToken) {
            const {userId, deviceId} = decodedOldToken
            const lastActiveDate = new Date().toISOString()
            const [accessToken, refreshNewToken] = await authService.refreshToken(userId, refreshToken, deviceId)
            console.log('test refreshNewToken', refreshNewToken)
            // @ts-ignore
            const {lastUpdateDate} = await jwtService.decodeReFreshToken(refreshNewToken.refreshToken)
            console.log('Test lastUpdateDate', lastUpdateDate)
            await securityDevicesRepository.updateSession({deviceId}, {$set: {lastUpdateDate, lastActiveDate}})
            return res.status(HTTP_STATUSES.OK200).cookie('refreshToken', refreshNewToken, {
                httpOnly: true,
                secure: true
            }).send(accessToken)
        }
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    },

    async registration(req: Request, res: Response) {
        await authService.registration(req.body)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    },

    async registrationConfirmation(req: Request, res: Response) {
        const isRegistration = await authService.registrationConfirmation(req.body.code)
        isRegistration ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    },

    async regEmailResend(req: Request, res: Response) {
        const isEmailSend = await authService.regEmailResend(req.body.email)
        isEmailSend ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    },

    async logout(req: Request, res: Response) {
        const {refreshToken} = req.cookies.refreshToken;
        const decodedToken = await jwtService.decodeReFreshToken(refreshToken)

        if (decodedToken) {
            const {deviceId, userId} = decodedToken
            await securityDevicesService.removeSession(deviceId, userId)
            return res.clearCookie('refreshToken').sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }

        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    },
}
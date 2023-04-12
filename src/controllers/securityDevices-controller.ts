import {Request, Response} from "express";
import {securityDevicesService} from "../services/securityDevices-service";
import {HTTP_STATUSES} from "../http_statuses";
import {jwtService} from "../application/jwt-service";


export const securityDevicesController = {

    async getAllActiveSessions(req: Request, res: Response) {
        try {
            const {refreshToken} = req.cookies.refreshToken;
            const sessions = await securityDevicesService.getActiveSessions(refreshToken)
            return res.status(HTTP_STATUSES.OK200).json(sessions)
        } catch (error) {
            return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
    },

    async removeOtherSessions(req: Request, res: Response) {
        const {refreshToken} = req.cookies.refreshToken;
        const isRemoveSession = await securityDevicesService.removeOtherSessions(refreshToken)
        return isRemoveSession ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    },

    async removeSession(req: Request, res: Response) {
        const {refreshToken} = req.cookies.refreshToken;
        // @ts-ignore
        const { userId } = await jwtService.decodeReFreshToken(refreshToken)
        const isRemoveSessionStatus = await securityDevicesService.removeSession(req.params.id, userId)
        switch (isRemoveSessionStatus) {
            case "not_found":
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                break
            case "forbidden":
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
                break
            case "success":
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                break
            default:
              break
        }
    },

}
import {Request, Response} from "express";
import {securityDevicesService} from "../services/securityDevices-service";
import {HTTP_STATUSES} from "../http_statuses";


export const securityDevicesController = {

    async getAllActiveSessions(req: Request, res: Response) {
        try {
            const {refreshToken} = req.cookies.refreshToken;
            const sessions = await securityDevicesService.getActiveSessions(refreshToken)
            res.status(HTTP_STATUSES.OK200).json(sessions)
        } catch (error) {
            if (error instanceof Error)
            console.log(error.message)
        }
    },

    async removeOtherSessions(req: Request, res: Response) {
        const {refreshToken} = req.cookies.refreshToken;
        const isRemoveSession = await securityDevicesService.removeOtherSessions(refreshToken)
        return isRemoveSession ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    },

    async removeSession(req: Request, res: Response) {
        const isRemoveSession = await securityDevicesService.removeSession(req.params.id)
      return  isRemoveSession ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    },

}
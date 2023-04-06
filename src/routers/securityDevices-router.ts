import {Router} from "express";
import {securityDevicesController} from "../controllers/securityDevices-controller";
import {checkIsRefreshTokenValid} from "../middleware/checkIsRefreshTokenValid";


export const securityDevicesRouter = Router({})

//-------------------GET---------------//
securityDevicesRouter.get('/',checkIsRefreshTokenValid, securityDevicesController.getAllActiveSessions)

//-------------------DELETE---------------//
securityDevicesRouter.delete('/', checkIsRefreshTokenValid, securityDevicesController.removeOtherSessions)
securityDevicesRouter.delete('/:id', securityDevicesController.removeSession)
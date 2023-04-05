import {Router} from "express";
import {securityDevicesController} from "../controllers/securityDevices-controller";


export const securityDevicesRouter = Router({})

//-------------------GET---------------//
securityDevicesRouter.get('/', securityDevicesController.getAllActiveSessions)

//-------------------DELETE---------------//
securityDevicesRouter.delete('/', securityDevicesController.removeOtherSessions)
securityDevicesRouter.delete('/:id', securityDevicesController.removeSession)
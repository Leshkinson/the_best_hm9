import {securityDevicesRepository} from "../repositories/securityDevices-repository";
import {jwtService} from "../application/jwt-service";
import {securityDevicesModel} from "../models/securityDevices-model";


export const securityDevicesService = {

    async getActiveSessions() {
        const filter = {}
        const sessions =  await securityDevicesRepository.getAllUserSessions(filter)
        return securityDevicesModel(sessions)
    },

    async removeOtherSessions(refreshToken: string) {
         const decodedToken = await jwtService.decodeReFreshToken(refreshToken)
         if(decodedToken){
             const {userId, deviceId} = decodedToken
             const filter = {userId, deviceId : { $ne: deviceId }}
             return await securityDevicesRepository.removeOtherSessions(filter)
        }
         return null
    },

    async removeSession(deviceId: string): Promise<boolean> {
        const filter = {deviceId}
        return await securityDevicesRepository.removeSession(filter)
    },
}
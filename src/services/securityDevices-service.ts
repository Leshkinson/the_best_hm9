import {securityDevicesRepository} from "../repositories/securityDevices-repository";
import {jwtService} from "../application/jwt-service";


export const securityDevicesService = {

    async getActiveSessions() {
        const filter = {}
        return await securityDevicesRepository.getAllUserSessions(filter)
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
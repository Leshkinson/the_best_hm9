import {UserFromDBType} from "../types/types";


export const securityDevicesModel = (session: any) => {
    const sessionConverter = (session: any) => {
        return {
            ip: session.ip,
            title: session.title,
            lastActiveDate: session.lastActiveDate,
            createdAt: session.deviceId
        }
    }

    if (Array.isArray(session)) {
        return session.map((s: any) => sessionConverter(s))
    }
    return sessionConverter(session)
}
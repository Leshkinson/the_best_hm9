
export const securityDevicesModel = (session: any) => {
    const sessionConverter = (session: any) => {
        return {
            ip: session.ip,
            title: session.title,
            lastActiveDate: session.lastActiveDate,
            deviceId: session.deviceId
        }
    }

    if (Array.isArray(session)) {
        return session.map((s: any) => sessionConverter(s))
    }
    return sessionConverter(session)
}
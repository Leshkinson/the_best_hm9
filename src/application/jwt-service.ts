import jwt from 'jsonwebtoken'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '123'
const refreshTokenSecret = '333'

const refreshTokenParser = {
    pars(userId: string, deviceId: string) {
        return {
            userId: userId,
            deviceId: deviceId
        }
    },

    decoded(token: string) {
        const [userId, deviceId] = token.split('_')
        return [userId, deviceId]
    },
}

export const jwtService = {

    async createAccessToken(user: any) {
        const accessToken = jwt.sign({userId: user.id}, accessTokenSecret, {expiresIn: '10s'}) // Вернуть время обратно!!!
        return {accessToken}
    },

    async createRefreshToken(user: any, deviceId: string) {
        const payload = refreshTokenParser.pars(user.id, deviceId)
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {expiresIn: '100s'});
        return {refreshToken}
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, accessTokenSecret)
            return result.userId
        } catch (error) {
            return null
        }
    },

    async decodeReFreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, refreshTokenSecret)

            const payload = jwt.decode(token)
            return {
                // @ts-ignore
               lastUpdateDate: result.iat, userId: payload?.userId, deviceId: payload.deviceId
            }
        } catch (error) {

            return null
        }
    },

}
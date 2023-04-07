import jwt from 'jsonwebtoken'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '123'
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '333'

const refreshTokenParser = {
    pars(userId: string, deviceId: string) {
        return `${userId}_${deviceId}`
    },

    decode(token: string) {
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
        const refreshToken = jwt.sign({payload}, refreshTokenSecret, {expiresIn: '100s'});
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
            const [userId, deviceId] = refreshTokenParser.decode(result.payload)
            return {
               lastUpdateDate: result.iat, userId, deviceId
            }
        } catch (error) {
            return null
        }
    },

}
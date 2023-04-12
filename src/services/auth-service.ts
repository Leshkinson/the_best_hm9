import {UserFromDBType, UserRequestType} from "../types/types";
import {createId} from "../utils/createId";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../application/emailManager";
import {userRepository} from "../repositories/user-repositpry";
import {getTextForRegistration} from "../utils/getTextForRegistration";
import {jwtService} from "../application/jwt-service";
import {securityDevicesRepository} from "../repositories/securityDevices-repository";

export const authService = {

    async getMe(user: any) {
        return {
            "email": user.accountData.email,
            "login": user.accountData.userName,
            "userId": user.id,
        }
    },

    async authorization(user: any, ip: string, title: string) {
        const deviceId = uuidv4()

        const [accessToken, refreshToken] = await authService.createdAccessAndRefreshTokens(user, deviceId)
        // @ts-ignore
        const {lastUpdateDate} = await jwtService.decodeReFreshToken(refreshToken?.refreshToken)
        const session = {title, ip, lastActiveDate: new Date().toISOString(), deviceId, userId: user.id, lastUpdateDate}
        await securityDevicesRepository.addedSession(session)

        return [accessToken, refreshToken]
    },

    async createdAccessAndRefreshTokens(user: any, deviceId: string) {
        const accessToken = await jwtService.createAccessToken(user)
        const refreshToken = await jwtService.createRefreshToken(user, deviceId)
        return [accessToken, refreshToken]
    },

    async registration(userData: UserRequestType) {
        const id = createId()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(userData.password, salt)
        const generatedCode = uuidv4()
        const newUser: UserFromDBType = {
            id,
            accountData: {
                userName: userData.login,
                email: userData.email,
                hash,
                salt,
                createdAt: new Date().toISOString(),
            },
            emailConformation: {
                confirmationCode: generatedCode,
                expirationDate: add(new Date(), {
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const text = getTextForRegistration(generatedCode)

        await emailManager.sendEmailConfirmationMessage(userData.email, "DmitriСorporate", text)
        await userRepository.createUser(newUser)
    },


    async registrationConfirmation(code: string) {
        const filter: any = {
            "emailConformation.confirmationCode": code
        }
        const user = await userRepository.getUserByFilter(filter)

        if (user && !user.emailConformation.isConfirmed) {
            const update = {
                $set: {"emailConformation.isConfirmed": true}
            }
            await userRepository.changeUser({id: user.id}, update)
            return user

        }
        return null
    },

    async regEmailResend(email: string) {
        const filter: any = {'accountData.email': email}
        const user = await userRepository.getUserByFilter(filter)

        if (user && !user.emailConformation.isConfirmed) {
            const generatedCode = uuidv4()
            const text = getTextForRegistration(generatedCode)
            const update = {
                $set: {'emailConformation.confirmationCode': generatedCode}
            }
            await userRepository.changeUser({id: user.id}, update)
            await emailManager.sendEmailConfirmationMessage(email, "DmitriСorporate", text)
            return true
        }
        return false
    },

    async refreshToken(userId: any, oldRefreshToken: string, deviceId: any) {
        const user = {id: userId}
        //await authService.saveUsedToken(oldRefreshToken)
        return await authService.createdAccessAndRefreshTokens(user, deviceId)
    },

    async saveUsedToken(token: any): Promise<void> {
        const tokenObj = {refreshToken: token}
       // await usedRefreshRepository.saveUsedToken(tokenObj)
    },
    //
    // async findUsedToken(refreshToken: any): Promise<boolean> {
    //     const filter = {refreshToken}
    //     const isTokenUsed = await usedRefreshRepository.findUsedToken(filter)
    //     return !!isTokenUsed
    // }
}
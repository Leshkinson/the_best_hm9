import {sessionsCollections} from "../../mongoDB";


export const securityDevicesRepository = {

    async getAllUserSessions(filter: any): Promise<any> {
        return await sessionsCollections.find(filter).toArray();
    },

    async addedSession(session: any) {
        await sessionsCollections.insertOne(session)
    },

    async updateSession(filter: any, session: any) {
        await sessionsCollections.updateOne(filter, session)
    },

    async removeSession(filter: any):Promise<boolean> {
        const result = await sessionsCollections.deleteOne(filter)
        return result.deletedCount === 1
    },

    async removeOtherSessions(filter: any) {
        const result = await sessionsCollections.deleteMany(filter)
        return result.deletedCount >= 1
    },

    async removeAllSessions() {
        await sessionsCollections.deleteMany({})
    },

}
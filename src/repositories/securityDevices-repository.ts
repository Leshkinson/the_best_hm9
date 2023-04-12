import {sessionsCollections} from "../../mongoDB";


export const securityDevicesRepository = {

    async getAllUserSessions(filter: any): Promise<any> {
        return await sessionsCollections.find(filter).toArray();
    },

    async getSession(filter: any): Promise<any> {
        return await sessionsCollections.findOne(filter)
    },

    async addedSession(session: any) {
        await sessionsCollections.insertOne(session)
    },

    async updateSession(filter: any, session: any) {
        await sessionsCollections.updateOne(filter, session)
    },

    async removeSession(filter: any):Promise<void> {
       await sessionsCollections.deleteOne(filter)
    },

    async removeOtherSessions(filter: any) {
        const result = await sessionsCollections.deleteMany(filter)
        return result.deletedCount >= 1
    },

    async removeAllSessions() {
        await sessionsCollections.deleteMany({})
    },

}
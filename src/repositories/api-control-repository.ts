import {requestControlCollections} from "../../mongoDB";
import {ApiRequestControlType} from "../types/types";


export const apiControlRepository = {

    async getRecordByFilter(filter: any): Promise<ApiRequestControlType | null> {
        return requestControlCollections.findOne(filter)
    },

    async createRecord(record: any): Promise<void> {
        await requestControlCollections.insertOne(record)
    },

    async updateRecord(filter:any, newObj: any): Promise<void> {
          await requestControlCollections.updateOne(filter, newObj)
    },

    async deleteAllRecords(): Promise<void> {

    }

}
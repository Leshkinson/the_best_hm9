import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
import {
    ApiRequestControlType,
    BlogResponseType,
    PostResponseType, SessionType,
    UserFromDBType,
} from "./src/types/types";

dotenv.config()

const mongoURi = "mongodb+srv://dimaaleks943:AdB7QJrdw9zyOLUY@cluster0.kv7bgcj.mongodb.net/?retryWrites=true&w=majority"
const client =  new MongoClient(mongoURi)
const myDB = process.env.npm_lifecycle_event !== "jest"  ?  client.db("myDB") : client.db("myTest")
export const postCollections = myDB.collection<PostResponseType>("posts")
export const blogCollections = myDB.collection<BlogResponseType>("blogs")
export const userCollections = myDB.collection<UserFromDBType>("users")
export const commentCollections = myDB.collection<any>("comments")
export const usedRefreshCollections = myDB.collection<any>("usedRefresh")
export const requestControlCollections = myDB.collection<ApiRequestControlType>("requestControl")
export const sessionsCollections = myDB.collection<SessionType>("sessions")

export async function runDB() {
    try {
        await client.connect()
    } catch {
         await client.close()
    }
}
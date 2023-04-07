import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {postsRouter} from "./src/routers/posts-router";
import {blogsRouter} from "./src/routers/blogs-router";
import {testingRouter} from "./src/routers/testing-router";
import {userRouter} from "./src/routers/users-router";
import {authRouter} from "./src/routers/auth-router";
import {commentRouter} from "./src/routers/comment-router";
import {securityDevicesRouter} from "./src/routers/securityDevices-router";

export const app = express()

//---USE---//
app.set('trust proxy', true)
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/comments', commentRouter)
app.use('/security/devices', securityDevicesRouter)
//---SET---//

//---TEST---//
app.use('/testing', testingRouter)


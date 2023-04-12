import {blogRepository} from "../repositories/blog-repository";
import {postRepository} from "../repositories/post-repository";
import {userRepository} from "../repositories/user-repositpry";
import {commentRepository} from "../repositories/comment-repository";
import {securityDevicesRepository} from "../repositories/securityDevices-repository";
import {securityDevicesService} from "../services/securityDevices-service";
import {HTTP_STATUSES} from "../http_statuses";
import {Request, Response} from "express";


export const testingController = {

    async clearDB() {
        await blogRepository.deleteAllBlogs()
        await postRepository.deleteAllPosts()
        await userRepository.deleteAllUser()
        await commentRepository.deleteAllComment()
        await securityDevicesRepository.removeAllSessions()
    }
}
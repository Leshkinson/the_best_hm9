import {blogRepository} from "../repositories/blog-repository";
import {postRepository} from "../repositories/post-repository";
import {userRepository} from "../repositories/user-repositpry";
import {commentRepository} from "../repositories/comment-repository";
import {securityDevicesRepository} from "../repositories/securityDevices-repository";


export const testingController = {

    async clearDB() {
        // await blogRepository.deleteAllBlogs()
        // await postRepository.deleteAllPosts()
        // await userRepository.deleteAllUser()
        // await commentRepository.deleteAllComment()
        // await securityDevicesRepository.removeAllSessions()
    }
}
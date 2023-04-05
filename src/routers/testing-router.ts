import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {testingController} from "../controllers/testing-controller";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await testingController.clearDB()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
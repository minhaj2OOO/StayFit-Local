import { Controller, Get, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { StatusCodes as STATUS}  from "http-status-codes";
import { RewardModel } from "../models/Reward";
import { isLoggedIn } from "../middlewares/LoggedIn";

@Controller("rewards")
export class RewardsController {

    @Get("")
    @Middleware([isLoggedIn])
    public async getAllRewards(req: Request, res: Response): Promise<Response> {
        // fetch all rewards from server
		// this will be a list of reward objects with id, name and points
        // return the list of rewards
        try{

            const rewards = await RewardModel.getAllRewards();

            return res.status(STATUS.OK).json(rewards);

        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: "RC001"
            });
        }
    }

    @Get(":id")
    @Middleware([isLoggedIn])
    public async getRewardInfo(req: Request, res: Response): Promise<Response> {
        // fetch reward info from server
        // this will be a reward object with id, name and points
        // return the reward
        try{
            const id = parseInt(req.params.id, 0);
            const reward = await RewardModel.getRewardInfo(id);

            if(reward === null){
                return res.status(STATUS.NOT_FOUND).json({
                    message: "Reward content not found",
                    code: "RC002"
                });
            }
            return res.status(STATUS.OK).json(reward);
        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: "RC003"
            });
        }
    }
}
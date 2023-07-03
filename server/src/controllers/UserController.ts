import { Controller, ClassOptions, ChildControllers, Get, Post, Put, Delete, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { StatusCodes as STATUS}  from "http-status-codes";
import { UserModel } from "../models/User";
import { UserInterface } from "../models/User";
import { isLoggedIn } from "../middlewares/LoggedIn";
import { RewardModel } from "../models/Reward";
import * as controllers from './user/Index';

const ctrlList = [];

for (const c in controllers) {
    if(controllers.hasOwnProperty(c)) {
        const ctrl = (controllers as any)[c];
        ctrlList.push(new ctrl());
    }
}

@Controller("user") // all api class have to have api to work properly
@ClassOptions({ mergeParams: true })
@ChildControllers(ctrlList)
export class UserApiController {

    @Get("info")
    @Middleware([isLoggedIn])
    public async getUserInfo(req: Request, res: Response): Promise<Response> {

        const email = req.session?.email;

        try{
            const user: UserInterface = await UserModel.getUserInfo(email) as UserInterface;

            if(user === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "User info could not be retrieved. Please try again.",
                    code: "UC001"
                });
            }

            return res.status(STATUS.OK).json({
                birthDate: user.birthdate,
                weight: user.weight,
                height: user.height,
                calorieGoal: user.caloriegoal,
                proteinGoal: user.proteingoal,
                gender: user.gender,
                lastWeighIn: user.lastweighin,
            });

        } catch(e) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
    }

    @Put("updateInfo/static")
    @Middleware([isLoggedIn])
    public async updateStaticUserInfo(req: Request, res: Response): Promise<Response> {

        const {birthDate, height, gender} = req.body;
        const email = req.session?.email;

        try{
            const user: UserModel = await UserModel.updateStaticUserInfo(birthDate, height, gender, email) as UserInterface;

            if(user === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "User settings could not be updated. Please try again.",
                    code: "UC002"
                });
            }
        } catch(e) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
        return res.status(STATUS.OK).json({message: "User settings have been updated."});
    }

    @Put("updateInfo/dynamic")
    @Middleware([isLoggedIn])
    public async updateDynamicUserInfo(req: Request, res: Response): Promise<Response> {

        const {type, weight, calorieGoal, proteinGoal, lastWeighIn} = req.body;
        const email = req.session?.email;

        try{
            const user: UserModel = await UserModel.updateDynamicUserInfo(type, weight, calorieGoal, proteinGoal, lastWeighIn, email) as UserInterface;

            if(user === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "User settings could not be updated. Please try again.",
                    code: "UC003"
                });

            }
        } catch(e) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
        return res.status(STATUS.OK).json({message: "User settings have been updated."});
    }

    @Get("rewards")
    @Middleware([isLoggedIn])
    public async getRewardsUnlocked(req: Request, res: Response): Promise<Response> {
        console.log("get rewards");

        const email = req.session?.email;

        try{
            const rewardsUnlocked = await RewardModel.getUserRewardsUnlocked(email);
            // create an array of rewards that are unlocked

            const rewardsUnlockedArray = rewardsUnlocked.map((reward: any) => {
                return reward.rewardid;
            });

            return res.status(STATUS.OK).json(rewardsUnlockedArray);
        } catch(e) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
    }

    @Get("points")
    @Middleware([isLoggedIn])
    public async getPoints(req: Request, res: Response): Promise<Response> {
        console.log("get points");
        const email = req.session?.email;

        try{
            const points = await UserModel.getUserPoints(email);

            if(points === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "Points could not be retrieved. Please try again.",
                    code: "UC005"
                });

            }
            return res.status(STATUS.OK).json(points);
        } catch(e) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
    }

    @Post("rewards/redeem")
    @Middleware([isLoggedIn])
    public async redeemReward(req: Request, res: Response): Promise<Response> {
        // fetch reward info from server
        // this will be a reward object with id, name and cost, content
        // return the users unlocked rewards
        const email = req.session?.email;
        const {rewardId} = req.body;

        try{
            const rewardRedeemed = await RewardModel.redeemReward(rewardId, email);

            if(rewardRedeemed === null){
                return res.status(STATUS.NOT_FOUND).json({
                    message: "Reward could not be redeeded",
                    code: "UC006"
                });
            }

            const rewardsUnlocked = await RewardModel.getUserRewardsUnlocked(email);
            // create an array of rewards that are unlocked

            const rewardsUnlockedArray = rewardsUnlocked.map((reward: any) => {
                return reward.rewardid;
            });

            return res.status(STATUS.OK).json(rewardsUnlockedArray);
        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: "RC005"
            });
        }
    }

    @Post("points/add")
    @Middleware([isLoggedIn])
    public async addPoints(req: Request, res: Response): Promise<Response> {
        console.log("add points");
        const email = req.session?.email;
        const {points} = req.body;

        try{          
            const userPoints: number = await UserModel.getUserPoints(email);

            const updatedPoints = userPoints + points;
            const user: UserModel = await UserModel.updatePoints(updatedPoints, email) as UserInterface;

            if(user === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "Points could not be added. Please try again.",
                    code: "UC007"
                });
            }
        } catch(e) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
        return res.status(STATUS.OK).json({message: "Points have been added."});
    }

    @Post("points/deduct")
    @Middleware([isLoggedIn])
    public async deductPoints(req: Request, res: Response): Promise<Response> {
        console.log("deduct points");
        const email = req.session?.email;
        const {points} = req.body;

        try{          
            const userPoints: number = await UserModel.getUserPoints(email);

            const updatedPoints = userPoints - points;
            const user: UserModel = await UserModel.updatePoints(updatedPoints, email) as UserInterface;

            if(user === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "Points could not be deducted. Please try again.",
                    code: "UC008"
                });
            }
        } catch(e) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
        return res.status(STATUS.OK).json({message: "Points have been deducted."});
    }
}
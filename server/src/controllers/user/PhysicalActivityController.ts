import { Controller, Get, Post, Put, Delete, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { StatusCodes as STATUS}  from "http-status-codes";
import { isLoggedIn } from "../../middlewares/LoggedIn";
import { PhysicalActivityModel, PhysicalActivityInterface } from "../../models/PhysicalActivity";

@Controller("physicalActivity")
export class PhysicalActivityController {

    @Get(":day")
    @Middleware([isLoggedIn])
    public async getUserDayPhysicalActivity(req: Request, res: Response): Promise<Response> {

        const {day} = req.params;
        const email = req.session?.email;

        try{
            const physicalActivityListForDay: PhysicalActivityInterface[] = await PhysicalActivityModel.getUserDayPhysicalActivity(day, email) as PhysicalActivityInterface[];

            if(physicalActivityListForDay === null) {
                return res.status(STATUS.OK).json({physicalActivity: {}});
            }

            // get all the cals of food counted, and sum them
            const totalCalBurnt = physicalActivityListForDay.reduce((acc, curr) => {
                return acc + parseFloat(curr.burnt);
            }, 0);

            const physicalActivityList = physicalActivityListForDay.map( (pa) => {
                return {
                    id: pa.physicalactivityid,
                    exercise: pa.exercisename,
                    burnt: pa.burnt,
                    day: pa.day,
                }
            });

            return res.status(STATUS.OK).json({
                sumBurnt: totalCalBurnt,
                physicalActivity: physicalActivityList
            });

        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
    }

    @Post("add")
    @Middleware([isLoggedIn])
    public async addUserDayPhysicalActivity(req: Request, res: Response): Promise<Response> {

        const {exercise, burnt, day} = req.body;
        const email = req.session?.email;

        try{
            const physicalActivityAdded: PhysicalActivityInterface = await PhysicalActivityModel.addUserPhysicalActivity(exercise, burnt, day, email) as PhysicalActivityInterface;

            if(physicalActivityAdded === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "Physical Activity could not be added. Please try again.",
                    code: "PAC001"
                });

            }
        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }

        return res.status(STATUS.OK).json({message: "Physical Activity has been added."});
    }

    @Delete(":id")
    @Middleware([isLoggedIn])
    public async deleteUserDayPhysicalActivity(req: Request, res: Response): Promise<Response> {

        const {id} = req.params;
        const email = req.session?.email;
        try{
            const physicalActivityDeleted: PhysicalActivityInterface = await PhysicalActivityModel.deleteUserPhysicalActivity(id, email) as PhysicalActivityInterface;

            if(physicalActivityDeleted === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "Physical Activity could not be deleted. Please try again.",
                    code: "PAC002"
                });

            }
        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }

        return res.status(STATUS.OK).json({message: "Physical Activity has been deleted."});
    }
}
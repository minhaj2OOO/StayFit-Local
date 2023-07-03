import { Controller, Get, Post, Put, Delete, Middleware } from "@overnightjs/core";
import { Request, Response } from "express";
import { StatusCodes as STATUS}  from "http-status-codes";
import { isLoggedIn } from "../../middlewares/LoggedIn";
import { FoodModel, FoodInterface } from "../../models/Food";

@Controller("food")
export class FoodController {

    @Get(":day")
    @Middleware([isLoggedIn])
    public async getUserDayFood(req: Request, res: Response): Promise<Response> {
        const {day} = req.params;
        const email = req.session?.email;

        try{
            const foodListForDay: FoodInterface[] = await FoodModel.getUserDayFood(day, email) as FoodInterface[];

            if(foodListForDay === null) {
                return res.status(STATUS.OK).json({food: {}});
            }
            // get all the cals of food counted, and sum them
            const totalCal = foodListForDay.reduce((acc, food) => {
                return acc + parseFloat(food.cal);
            }, 0);
            // get all the fat of food counted, and sum them
            const totalFat = foodListForDay.reduce((acc, food) => {
                return acc + parseFloat(food.fat);
            }, 0);
            // get all the carb of food counted, and sum them
            const totalCarb = foodListForDay.reduce((acc, food) => {
                return acc + parseFloat(food.carb);
            }, 0);
            // get all the protein of food counted, and sum them
            const totalProtein = foodListForDay.reduce((acc, food) => {
                return acc + parseFloat(food.protein);
            }, 0);
            // create an array of food objects with attributes such as name, amount and unit
            const foodList = foodListForDay.map((food) => {
                return {
                    id: food.foodid,
                    name: food.foodname,
                    amount: food.weight,
                    unit: "g",
                    cal: food.cal,
                    fat: food.fat,
                    carb: food.carb,
                    protein: food.protein,
                }
            });

            return res.status(STATUS.OK).json({
                food: {
                    sumCal: totalCal,
                    sumFat: totalFat,
                    sumProtein: totalProtein,
                    sumCarb: totalCarb,
                    foods: foodList
                }
            });

        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
    }

    @Post("addFood")
    @Middleware([isLoggedIn])
    public async addUserDayFood(req: Request, res: Response): Promise<Response> {
        const {foodname, cal, fat, carb, protein, day, weight} = req.body;
        const email = req.session?.email;

        try{
            const foodAdded: FoodInterface = await FoodModel.addUserFood(foodname, cal, fat, carb, protein, day, email, weight) as FoodInterface;

            if(foodAdded === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "Food could not be added. Please try again.",
                    code: "FC001"
                });
            }
        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
        return res.status(STATUS.OK).json({message: "Food has been added."});
    }

    @Delete(":id")
    @Middleware([isLoggedIn])
    public async deleteUserDayFood(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const email = req.session?.email;
        try{
            const foodDeleted: FoodInterface = await FoodModel.deleteUserFood(id, email) as FoodInterface;

            if(foodDeleted === null) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    message: "Food could not be deleted. Please try again.",
                    code: "FC002"
                });
            }
        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }
        return res.status(STATUS.OK).json({message: "Food has been deleted."});
    }
}
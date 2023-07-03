import { Controller, Get, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { LoginModel } from "../models/Login";
import { StatusCodes as STATUS}  from "http-status-codes";

@Controller("help")
export class HelpController {

    @Get("isLoggedIn")
    public async isLoggedIn(req: Request, res: Response): Promise<Response> {

        console.log(req.session?.email)
        if(req.session?.email){
            return res.status(STATUS.OK).json({email: req.session?.email});
        }

        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(null);
    }


    @Post("login")
    public async login(req: Request, res: Response){
        const {email, password} = req.body;

        const result = {userExists: false};

        if(req.session?.email === email){
            result.userExists = true;
            req.session.email = email;
            return res.status(STATUS.OK).json(result);
        }

        const userFound = await LoginModel.verifyUser(email, password);


        if(userFound?.password === password) {
            result.userExists = true;
            req.session.email = email;
            return res.status(STATUS.OK).json(result);
        }

        return res.status(STATUS.NOT_FOUND).json({
            message: "Could not verify user. Please try again",
            code: "HC001"
        })
    }

    @Post("signup")
    public async signup(req: Request, res: Response){

        const {email, password} = req.body;

        try{
            const userCreated = await LoginModel.createNewUser(email, password);

            if(userCreated === null){
                return res.status(STATUS.BAD_REQUEST).json({
                    message: "Could not create user. Please try again",
                    code: "HC002"
                });
            }

            if( userCreated?.email === email && userCreated?.password === password ){
                req.session.email = email;
                return res.status(STATUS.OK).json({email: userCreated?.email , password: userCreated?.password});
            }

        }catch(e){
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                code: e.code
            });
        }

        return res.status(STATUS.CONFLICT).json({
            message: "A user was created but not with the credentials you requested. Please try to login before signing up again.",
            code: "HC003"
        });

    }

    @Get("logout")
    public async logout(req: Request, res: Response){

        try{
            delete req.session.email;
            return res.status(STATUS.OK).json("User has been logged out");
        }catch{
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                message: "Could not logout. Please refresh the page and try again.",
                code: "HC004"
            })
        }
    }
}
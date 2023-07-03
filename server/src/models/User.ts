import { client } from './index';

export interface UserInterface {
    email?: string;
    password?: string;
    birthdate?: string;
    weight?: number;
    height?: number;
    gender?: string;
    caloriegoal?: number;
    proteingoal?: number;
    lastweighin?: string;
    points?: number;
}

export class UserModel implements UserInterface {
    email?: string;
    password?: string;
    birthdate?: string;
    weight?: number;
    height?: number;
    gender?: string;
    caloriegoal?: number;
    proteingoal?: number;
    lastweighin?: string;
    points?: number

    constructor(user: UserInterface) {
        Object.assign(this, user);
    }

    static async getUserInfo(email: string): Promise<UserModel | null> {
        const query = `Select * FROM public."USER" u WHERE u."email" = $1;`
        const params = [email]

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new UserModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async updateStaticUserInfo(birthDate: string, height: string,gender: string, email: string): Promise<UserModel | null> {

        const query = `UPDATE public."USER" u SET "birthdate" = $1, "height" = $2, "gender" = $3 WHERE u."email" = $4 RETURNING *;`;
        const params = [birthDate, height, gender, email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new UserModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async updateDynamicUserInfo( type: "weight"|"goal"|"proteingoal", weight: string|null, calorieGoal: number|null, proteinGoal: number|null, lastWeighIn: string|null, email: string): Promise<UserModel | null> {

        let query = "";
        let params: any[] = [];

        if(type === "weight"){
            query = `UPDATE public."USER" u SET "weight" = $1, "lastweighin" = $2 WHERE u."email" = $3 RETURNING *;`;
            params = [weight, lastWeighIn, email];
        }
        else if(type === "proteingoal"){
            query = `UPDATE public."USER" u SET "proteingoal" = $1 WHERE u."email" = $2 RETURNING *;`;
            params = [proteinGoal, email];
        }

        else{
            query = `UPDATE public."USER" u SET "caloriegoal" = $1 WHERE u."email" = $2 RETURNING *;`;
            params = [calorieGoal, email];
        }

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new UserModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async getUserPoints(email: string): Promise<number | null> {
        const query = `SELECT u."points" FROM public."USER" u WHERE u."email" = $1;`;
        const params = [email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(data[0].points);
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async updatePoints(points: number, email: string): Promise<UserModel | null> {
        const query = `UPDATE public."USER" u SET "points" = $1 WHERE u."email" = $2 RETURNING *;`
        const params = [points, email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
            .then(res => {
                const data = res.rows;
                console.log("data")
                console.log(data)
                if(data.length > 0){
                    resolve(new UserModel(data[0]));
                }else{
                    resolve(null);
                }
            })
            .catch(err => reject(err));
        })
    }
}
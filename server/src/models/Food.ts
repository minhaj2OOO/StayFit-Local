import { client } from './index';

export interface FoodInterface {
    foodid?: string;
    foodname?: string;
    cal?: string;
    fat?: string;
    protein?: string;
    carb?: string;
    email?: string;
    day?: string;
    weight?: string;
}

export class FoodModel implements FoodInterface {
    foodid?: string;
    foodname?: string;
    cal?: string;
    fat?: string;
    protein?: string;
    carb?: string;
    email?: string;
    day?: string;
    weight?: string;

    constructor(user: FoodInterface) {
        Object.assign(this, user);
    }

    static async addUserFood(foodname: string, cal: string, fat: string, carb: string, protein: string, day: string, email: string, weight: string): Promise<FoodModel | null>{

        const query = `INSERT INTO public."FOOD" ("foodname", "cal", "fat", "carb", "protein", "day", "email", "weight") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`;
        const params = [foodname, cal, fat, carb, protein, day, email, weight];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new FoodModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async getUserDayFood(day: string, email: string): Promise<FoodModel[] | null>{
        console.log("day")
        console.log(day)
        console.log("email")
        console.log(email)

        const query = `SELECT * FROM public."FOOD" WHERE "day" = $1 AND "email" = $2;`;
        const params = [day, email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(
                            data.map( d=> {
                                return new FoodModel(d);
                            })
                        );
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async deleteUserFood(foodid: string, email: string): Promise<FoodModel | null>{
        const query = `DELETE FROM public."FOOD" WHERE "foodid" = $1 and "email" = $2 RETURNING *;`;
        const params = [foodid, email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new FoodModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }
}
import { client } from './index';

export interface PhysicalActivityInterface {
    physicalactivityid?: string;
    exercisename?: string;
    burnt?: string;
    email?: string;
    day?: string;
}

export class PhysicalActivityModel implements PhysicalActivityInterface {
    physicalactivityid?: string;
    exercisename?: string;
    burnt?: string;
    email?: string;
    day?: string;

    constructor(user: PhysicalActivityInterface) {
        Object.assign(this, user);
    }

    static async addUserPhysicalActivity(exercisename: string, burnt: string, day: string, email: string): Promise<PhysicalActivityModel | null>{

        const query = `INSERT INTO public."PHYSICAL_ACTIVITY" ("exercisename", "burnt", "day", "email") VALUES ($1, $2, $3, $4) RETURNING *;`;
        const params = [exercisename, burnt, day, email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new PhysicalActivityModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async getUserDayPhysicalActivity(day: string, email: string): Promise<PhysicalActivityModel[] | null>{
        console.log("day")
        console.log(day)
        console.log("email")
        console.log(email)

        const query = `SELECT * FROM public."PHYSICAL_ACTIVITY" WHERE "day" = $1 AND "email" = $2;`;
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
                                return new PhysicalActivityModel(d);
                            })
                        );
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async deleteUserPhysicalActivity(physicalactivityid: string, email: string): Promise<PhysicalActivityModel | null>{
        const query = `DELETE FROM public."PHYSICAL_ACTIVITY" WHERE "physicalactivityid" = $1 and "email" = $2 RETURNING *;`;
        const params = [physicalactivityid, email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new PhysicalActivityModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }
}
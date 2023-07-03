import { client } from './index';
import { UserInterface } from './User';

export class LoginModel implements UserInterface {
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

    constructor(user: UserInterface) {
        Object.assign(this, user);
    }

    static verifyUser(email: string, password: string): Promise<LoginModel | null> {

        const query = `Select u."email", u."password" FROM public."USER" u WHERE u."email" = $1 AND u."password" = $2;`;
        const params = [email, password];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new LoginModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async createNewUser(email: string, password: string): Promise<LoginModel | null>{

        // making sure comment does exist before attempting to update it
        const userExists = await this.findUser(email);

        if(userExists !== null){
            return new Promise<UserInterface | null>((resolve, reject) => {
                reject(
                    {
                        message: "There already exists a user with the same email",
                        code:"LM001"
                    })
            })
        }

        const query = `INSERT INTO public."USER" ("email" , "password") VALUES ($1, $2) RETURNING *;`;
        const params = [email, password];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new LoginModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static findUser(email: string): Promise<LoginModel | null> {

        console.log('email')
        console.log(email)
        const query = `Select * FROM public."USER" u WHERE u."email" = $1;`
        const params = [email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new LoginModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }
}
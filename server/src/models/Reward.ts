import { client } from './index';

export interface RewardInterface {
    rewardid: number;
    name?: string;
    cost?: number;
    content?: string;
}

export class RewardModel implements RewardInterface {
    rewardid: number;
    name?: string;
    cost?: number;
    content?: string;

    constructor(reward: RewardInterface) {
        Object.assign(this, reward);
    }

    static async getAllRewards(): Promise<RewardModel[] | null> {
        // fetch all rewards from server
		// this will be a list of reward objects with id, name and points
        // return the list of rewards

        const query = `SELECT * FROM public."REWARD";`;

        return new Promise((resolve, reject) => {
            client.query(query)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    resolve(data.map((reward: RewardInterface) => new RewardModel(reward)));
                })
                .catch(err => reject(err));
        })
    }

    static async getUserRewardsUnlocked(email: string): Promise<RewardModel[] | null> {
        // fetch all rewards from server
        // this will be a list of reward objects with id, name and points
        // return the list of rewards

        const query = `SELECT "rewardid" FROM public."REWARD_UNLOCKED" WHERE "email" = $1;`;
        const params = [email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data")
                    console.log(data)
                    resolve(data.map((reward: RewardInterface) => new RewardModel(reward)));
                })
                .catch(err => reject(err));
        })
    }

    static async getRewardInfo(rewardid: number): Promise<RewardModel | null> {
        const query = `SELECT * FROM public."REWARD" WHERE "rewardid" = $1;`;
        const params = [rewardid];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    if(data.length > 0){
                        resolve(new RewardModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }

    static async redeemReward(rewardid: number, email: string): Promise<RewardModel | null> {
        const query = `INSERT INTO public."REWARD_UNLOCKED"("rewardid", "email") VALUES ($1, $2) RETURNING *;`;
        const params = [rewardid, email];

        return new Promise((resolve, reject) => {
            client.query(query, params)
                .then(res => {
                    const data = res.rows;
                    console.log("data redeem")
                    console.log(data)
                    if(data.length > 0){
                        resolve(new RewardModel(data[0]));
                    }else{
                        resolve(null);
                    }
                })
                .catch(err => reject(err));
        })
    }
}
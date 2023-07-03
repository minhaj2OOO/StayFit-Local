import axios from 'axios';
import {useState, useEffect, FunctionComponent} from 'react';
import { Link } from "react-router-dom";
import Navbar from '../components/NavBar';

interface RewardInterface {
    rewardid: number;
    name: string;
    cost: number;
    content: string;
}

export const Rewards:FunctionComponent<any> = () => {

	const [rewards, setRewards] = useState<RewardInterface[]>([]);
	const [rewardsUnlocked, setRewardsUnlocked] = useState<number[]>([]);
	const [points, setPoints] = useState(0);
	const [refresh, setRefresh] = useState(true);

	useEffect(() => {
		if(!refresh) return;
		// get the user's points
		axios.get("/api/user/points")
		.then((res) => {
			console.log("points")
			console.log(res.data)
			setPoints(res.data)
		})
		.catch((err) => {
			console.log(err);
		})
		
		// fetch all rewards from server
		axios.get("/api/rewards")
		.then((res) => {
			console.log("Rewards")
			console.log(res.data)
			setRewards(res.data)
		})
		.catch(err => console.log(err));

		// find which rewards the user has unlocked
		axios.get("/api/user/rewards/")
		.then((res) => {
			console.log("Rewards Unlocked")
			console.log(res.data)
			setRewardsUnlocked(res.data)
		})
		.catch(err => console.log(err));
		setRefresh(false);
	}, [refresh]);
	

	const confirmRedeem = (rewardId: number, cost: number) => {

		// check if user's points is enough to redeem reward
		if(points < cost) {
			alert("You don't have enough points to redeem this reward!")
			return;
		}

		if (window.confirm("Are you sure you want to redeem this reward?")) {
			// make a request to server to redeem reward
			// will just be a list of reward IDs
			axios.post("/api/user/rewards/redeem", {rewardId: rewardId})
			.then(async (response) => {
				await axios.post("/api/user/points/deduct", {points: cost})
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				})
				setRewardsUnlocked(response.data)
				setRefresh(true)
				console.log(response);
			})
		}
	}

	return (
		<div>
			<Navbar title="Rewards" backUrl="/stayfit/home"/>
			
			<div className="container">
				<div className="d-flex justify-content-center">
					<h2 className='mb-3'>Points: {points}</h2>
				</div>
				<div className="row">
					{rewards.map(reward => (
						<div className="col-md-4 mb-4" key={reward.rewardid}>
							<div className="card">
								<div className="card-body">
									<h5 className="card-title">{reward.name}</h5>
									<p className="card-text">Points: {reward.cost}</p>
									{
									rewardsUnlocked.includes(reward.rewardid) ?
										<Link to={"/stayfit/rewards/" + reward.rewardid}>

											<button className="btn btn-primary">Enter</button>
										</Link>
										:
										<button className="btn btn-primary" onClick={() => confirmRedeem(reward.rewardid, reward.cost)}>Redeem</button>
									}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

		</div>
	);
}

export default Rewards;



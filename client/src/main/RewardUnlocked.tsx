import axios from 'axios';
import {useState, useEffect, FunctionComponent} from 'react';
import { useParams } from "react-router-dom";
import Navbar from '../components/NavBar';

interface rewardInterface{
	id: number;
	name: string;
	content: string;
	cost: number;
}

export const RewardUnlocked:FunctionComponent<any> = () => {
	const {id} = useParams(); //fetch reward id from useparams
	const [reward, setReward] = useState<rewardInterface>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true)
		axios.get("/api/user/rewards/")
		.then((res) => {
			if(!res.data.includes(parseInt(id||""))) {
				window.location.href = "/404";
				return;
			}
		})
		.catch(err => console.log(err));
		// fetch all rewards from server
		axios.get(`/api/rewards/${id}`)
		.then((res) => {
			setReward(res.data)
		})
		.catch(err => {
			console.log(err)
		});
		setLoading(false)
	}, []);

	return (
		loading?
		<>Loading...</>
		:
		<div>
			<Navbar title={reward?.name ||"Reward Unlocked"} backUrl="/stayfit/rewards"/>
			<div className="container">
				<div className="row">
					<p><div dangerouslySetInnerHTML={{ __html: reward?.content || "" }} /></p>
				</div>
			</div>
		</div>
	);
}
export default RewardUnlocked;



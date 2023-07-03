import {useState, useEffect, FunctionComponent} from 'react';
import { Link } from "react-router-dom";
import {emptyFood, foodInterface} from '../functions/constants';
import FoodNutritionInfo from '../components/FoodNutritionInfo';
import axios from 'axios';
import { convertDateToString } from '../functions/helperFunctions';
import Navbar from '../components/NavBar';

export const FoodLog:FunctionComponent<any> = () => {
	const day = localStorage.getItem("day") || convertDateToString(new Date());
	const [data, setData] = useState<foodInterface>(emptyFood);
	const [loading, setLoading] = useState(true);
	const [fetchFood, setFetchFood] = useState(true);

	useEffect(() => {
		// make an axios.post request to get the data
		if(!fetchFood) return;

		setLoading(true);
		axios.get(`/api/user/food/${day}`)
		.then((res) => {
			if((Object.keys(res.data.food).length === 0)){
				setData(emptyFood);
				return;
			}
			setData(res.data.food);
			setLoading(false);
		})
		.catch((err) => {
			console.log(err);
			setLoading(false);
		})
		setFetchFood(false);
		// set the data to the state
	}, [fetchFood]);

	return (
		<div>
			<Navbar title="Food Log" backUrl="/stayfit/home" />

			<div className='d-flex justify-content-center'>
				<Link to={'/stayfit/foodlog/search'}>
					<button className="btn btn-primary">Add Food</button>
				</Link>	
			</div>	
				
			{
				!loading && 
					<div>
					{
						data.foods.map((food) => {
							return <FoodNutritionInfo key={food.id} id={food.id} name={food.name} amount={food.amount} unit={food.unit} cal={food.cal} fat={food.fat} protein={food.protein} carb={food.carb} setFetch={setFetchFood}/>
						})
					}
					</div>
			}
		</div>
	);
}


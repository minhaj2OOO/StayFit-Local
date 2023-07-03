import {useState, useEffect, FunctionComponent} from 'react';
import {Link,  useLocation, useResolvedPath} from "react-router-dom";
import { convertDateToString } from '../functions/helperFunctions';
import axios from 'axios';
import Navbar from '../components/NavBar';

interface nutrientInterface {
	name: string;
	amount: number;
	unit: string;
}

export const TrackFood:FunctionComponent<any> = () => {
	const { pathname } = useLocation();
	let link = useResolvedPath(pathname).pathname.split('/');
	const foodId = link[link.length-1];

	const [fat, setFat] = useState(0);
	const [carb, setCarb] = useState(0);
	const [protein, setProtein] = useState(0);
	const [cal, setCal] = useState(0);
	const [name, setName] = useState('');
	
	const [loading, setLoading] = useState(true);
	const [enterClicked, setEnterClicked] = useState(false);

	const [amount, setAmount] = useState(1);
	const unit = "g";

	const day = localStorage.getItem("day") || convertDateToString(new Date());

	useEffect(() => {
		setLoading(true);
		axios.get(`https://api.spoonacular.com/food/ingredients/${foodId}/information?apiKey=db913ca9f0954813bd4efddc017009be&amount=${amount}&unit=${unit}`)
		.then((res) => {
			console.log(res.data)
			setName(res.data.name);

			res.data.nutrition.nutrients.map((nutrient: nutrientInterface) => {
				if (nutrient.name === "Calories") {
					setCal(nutrient.amount)
				} else if (nutrient.name === "Fat") {
					setFat(nutrient.amount)
				} else if (nutrient.name === "Carbohydrates") {
					setCarb(nutrient.amount)
				} else if (nutrient.name === "Protein") {
					setProtein(nutrient.amount)
				}
			})
			setLoading(false);
		}).catch((err) => {
			console.log(err);
			setLoading(false);
		})
		
	}, []);

	useEffect(() => {
		if(!enterClicked) return;

		axios.get(`https://api.spoonacular.com/food/ingredients/${foodId}/information?apiKey=db913ca9f0954813bd4efddc017009be&amount=${amount}&unit=${unit}`)
		.then((res) => {
			console.log(res.data)
			setName(res.data.name);

			res.data.nutrition.nutrients.map((nutrient: nutrientInterface) => {
				if (nutrient.name === "Calories") {
					setCal(nutrient.amount)
				} else if (nutrient.name === "Fat") {
					setFat(nutrient.amount)
				} else if (nutrient.name === "Carbohydrates") {
					setCarb(nutrient.amount)
				} else if (nutrient.name === "Protein") {
					setProtein(nutrient.amount)
				}
			})
		}).catch((err) => {
			console.log(err);
		})
		
		setEnterClicked(false)
		
	}, [enterClicked]);

	// TRACK FOOD
	const trackFood = () => {

		axios.post('/api/user/food/addFood', {
			foodname: name,
			cal: cal,
			fat: fat,
			carb: carb,
			protein: protein,
			day: day,
			weight: amount,
		})
		.then(async (res) => {
			console.log(res);
			await axios.post("/api/user/points/add", {points: 5})
            .then((res) => {
                console.log(res);
				alert(`You earnt 5 points.`)
            })
            .catch((err) => {
                console.log(err);
            })
		})
	}

	return (
		loading ? 
		<div>Loading...</div> 
		:
		<div>
			<Navbar title={name} backUrl='/stayfit/foodlog/search' />

			<div className="container">
				<div className="input-group mb-3 d-flex justify-content-center">
					<div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Serving Size (g)</span>
					</div>
					<input type="number" min="1" id="page-food-amount" value={amount} className="ml-3" onChange={(e) => setAmount(Number(e.target.value))} />
					<button className='btn btn-primary' onClick={() => setEnterClicked(true)}>Enter</button>
				</div>

				<div className="row">
					<div className="col-md-8 offset-md-4">
						<h2 className='mt-3'>Nutritional Information</h2>
						<h5>{cal}kcals</h5>
						<h5>{carb}g Carbohydrate</h5>
						<h5>{protein}g Protein</h5>
						<h5>{fat}g Fat</h5>
						<Link to={`/stayfit/foodlog`}>
							<button className="btn btn-primary mt-2" onClick={trackFood}>Track Food</button>
						</Link>
					</div>
				</div>			
			</div>
		</div>
	);
}

export default TrackFood;
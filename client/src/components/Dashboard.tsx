import axios from 'axios';
import { FunctionComponent, useEffect, useState } from 'react';
import { createDateObject } from '../functions/helperFunctions';

export const Dashboard: FunctionComponent<any> = ({ day }) => {
	const macros = ["Carbs", "Protein", "Fat"];
	const [goalCal, setGoalCal] = useState(0);
	const [proteinGoal, setProteinGoal] = useState(0);
	const [gender, setGender] = useState("");
	const [weight, setWeight] = useState(-1);
	const [height, setHeight] = useState(-1);
	const [age, setAge] = useState(-1);
	const [eaten, setEaten] = useState(0);
	const [macroValues, setMacroValues] = useState([0,0,0]);
	const [burnt, setBurnt] = useState(0);
	const [bmr, setBmr] = useState(0);
	const [netcal, setNetcal] = useState(0);
	
	useEffect(() => {
		axios.get(`/api/user/food/${day}`)
			.then((res) => {				
				if((Object.keys(res.data.food).length === 0)){
					setEaten(0);
					setMacroValues([0,0,0]);
					return;
				}
				console.log(res.data);
				setEaten(res.data.food.sumCal?.toFixed(1));
				setMacroValues([res.data.food.sumCarb.toFixed(1), res.data.food.sumProtein.toFixed(1), res.data.food.sumFat.toFixed(1)]);
			})
			.catch((err) => {
				console.log(err);
			})

		axios.get(`/api/user/physicalActivity/${day}`)
		.then((res) => {
			if((Object.keys(res.data.physicalActivity).length === 0)){
				setBurnt(0);
				return;
			}
			console.log(res.data);
			setBurnt(res.data.sumBurnt);
		})
		.catch((err) => {
			console.log(err);
		})
	}, [day])

	useEffect(() => {
		axios.get(`/api/user/info`)
			.then((res) => {
				setGoalCal(parseFloat(res.data.calorieGoal));
				setProteinGoal(parseFloat(res.data.proteinGoal));
				setGender(res.data.gender);
				setWeight(parseFloat(res.data.weight));
				setHeight(parseFloat(res.data.height));

				const birthDate = createDateObject(res.data.birthDate);
				setAge(calculateAge(birthDate));
			})
			.catch((err) => {
				console.log(err);
			})
	}, [])

	useEffect(() => {
		if(gender === '' || height === -1 || weight === -1 || age === -1) return;
		if(gender === "Male"){
			setBmr( Number((88.362 + (13.397*weight) + (4.799*height) - (5.677*age)).toFixed(1)) );
		}
		else if( gender === "Female"){
			setBmr( Number((447.593 + (9.247*weight) + (3.098*height) - (4.330*age)).toFixed(1)) );
		}
	}, [gender, weight, height, age])

	useEffect(() => {
		setNetcal(Number((eaten - burnt - bmr).toFixed(1)));
	}, [burnt, bmr, eaten])

	const calculateAge = (birthdate: Date) => {
		const now = new Date();		
		let yearsDiff = now.getFullYear() - birthdate.getFullYear();
		const monthsDiff = now.getMonth() - birthdate.getMonth();
		const daysDiff = now.getDate() - birthdate.getDate();
		
		// Adjust for negative month or day differences
		if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
		  yearsDiff--;
		}
		return yearsDiff;
	}

	return (
		<div>
			<div className="bg-primary bg-gradient bg-opacity-50">
				<div className="col-sm d-flex justify-content-center pt-1">
					<h3>⚫Net Calories: {netcal}/{goalCal}kcal</h3>
				</div>

				<div className="container d-flex justify-content-between mt-3">
					<div>
						<h3>Calories Eaten</h3>
						<h5>{eaten}kcal</h5>
					</div>
					<div>
						<h3>BMR</h3>
						<h5>{bmr}kcal</h5>
					</div>
					<div>
						<h3>Calories Burnt</h3>
						<h5>{burnt}kcal</h5>
					</div>
				</div>

				<div className="container d-flex justify-content-between mt-3">
					{
						macros.map((macro, count) => {
							if (macro === "Protein") {
							  return (
								<div className="databar-data" key={macro}>
								  <h3>{macro}</h3>
								  <h5>{macroValues[count]}/{proteinGoal}g</h5>
								</div>
							  );
							} else {
							  return (
								<div className="databar-data" key={macro}>
								  <h3>{macro}</h3>
								  <h5>{macroValues[count]}g</h5>
								</div>
							  );
							}
						  })
					}
				</div>
			</div>	
			<hr className="mt-0 border border-1 border-dark opacity-100"/>				
		</div>
	);
}
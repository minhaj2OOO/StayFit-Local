import {useState, useEffect, FunctionComponent} from 'react';
import axios from 'axios';
import { convertDateToString } from '../functions/helperFunctions';
import Navbar from '../components/NavBar';

export const Settings:FunctionComponent<any> = () => {
	const [dob, setDob] = useState<string>(convertDateToString(new Date()));
	const [weight, setWeight] = useState(120);
	const [height, setHeight] = useState(60);
	const [gender, setGender] = useState("Male");
	const [calorieGoal, setCalorieGoal] = useState(0);
	const [calorieGoalString, setCalorieGoalString] = useState('0');
	const [proteinGoal, setProteinGoal] = useState(0);
	const [proteinGoalString, setProteinGoalString] = useState('0');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		axios.get('/api/user/info')
		.then((res) => {
			setDob(res.data.birthDate);
			setWeight(res.data.weight);
			setHeight(res.data.height);
			setGender(res.data.gender);
			setCalorieGoal(res.data.calorieGoal);
			setCalorieGoalString(res.data.calorieGoal?.toString());
			setProteinGoal(res.data.proteinGoal);
			setProteinGoalString(res.data.proteinGoal?.toString());
			setLoading(false);
		}).catch((err) => {
			console.log(err);
			setLoading(false);
		})
	}, []);

	useEffect(() => {
		setCalorieGoal(parseInt(calorieGoalString));
	}, [calorieGoalString])

	useEffect(() => {
		setProteinGoal(parseInt(proteinGoalString));
	}, [proteinGoalString])

	const submitStatic = () => {
		axios.put('/api/user/updateInfo/static', {
			birthDate: dob,
			height: height,
			gender: gender
		})
		.then((res) => {
			console.log(res.data);
			alert(`Your personal Information has been updated.`)
		}).catch((err) => {
			console.log(err);
		})
	}

	const submitDynamic = (type: string) => {
		if(type === "weight"){
			axios.put('/api/user/updateInfo/dynamic', {
				type: type,
				weight: weight,
				lastWeighIn: convertDateToString(new Date()),
				calorieGoal: null,
				proteinGoal: null
			})
			.then((res) => {
				console.log(res.data);
				alert(`Your weight has been updated.`)
			}).catch((err) => {
				console.log(err);
			})
		}
		else if(type === "proteingoal"){
			axios.put('/api/user/updateInfo/dynamic', {
				type: type,
				weight: null,
				lastWeighIn: convertDateToString(new Date()),
				calorieGoal: null,
				proteinGoal: proteinGoal
			})
			.then((res) => {
				console.log(res.data);
				alert(`Your daily protein goal has been updated.`)
			}).catch((err) => {
				console.log(err);
			})
		}
		else{
			axios.put('/api/user/updateInfo/dynamic', {
				type: type,
				weight: null,
				lastWeighIn: null,
				calorieGoal: calorieGoal,
				proteinGoal: null
			})
			.then((res) => {
				console.log(res.data);
				alert(`Your daily net calorie goal has been updated.`)
			}).catch((err) => {
				console.log(err);
			})
		}
	}

	const changeDob = (event: React.ChangeEvent<HTMLInputElement>) => {
		const currentDate = new Date(event.currentTarget.value);
		const nextDate = new Date(currentDate); // Create a new Date object with the current date
		nextDate.setDate(currentDate.getDate()); 
		const stringDate = convertDateToString(nextDate);
		localStorage.setItem('day', stringDate);
		setDob(stringDate);
	}

	const convertStringToDate = (dateString: string): Date => {
		// Split the dateString into an array of [day, month, year]
		const [day, month, year] = dateString.split('-').map(Number);
		// Create a new Date object using the year, month, and day
		const date = new Date(year, month - 1, day);
		return date;
	}

	return (
		!loading ?
		<div>
			<Navbar title="Settings" backUrl='/stayfit/home/'/>

			<div className="input-group mb-3 d-flex justify-content-center">
				<div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Weight (kg)</span>
				</div>
            	<input type="number" step="0.1" min="1" id="page-configure-calories" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))}/>
				<button className="btn btn-primary" onClick={() => submitDynamic("weight")}>Update Weight</button>
			</div>

			<div className="input-group mb-3 d-flex justify-content-center">
				<div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Daily Net Calorie Goal (kcal)</span>
				</div>
            	<input type="number" value={calorieGoalString} onChange={(e) => setCalorieGoalString(e.target.value)}/>
				<button className="btn btn-primary" onClick={() => submitDynamic("goal")}>Update Calorie Goal</button>
			</div>

			<div className="input-group mb-3 d-flex justify-content-center">
				<div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Daily Protein Goal (g)</span>
				</div>
            	<input type="number" value={proteinGoalString} onChange={(e) => setProteinGoalString(e.target.value)}/>
				<button className="btn btn-primary" onClick={() => submitDynamic("proteingoal")}>Update Protein Goal</button>
			</div>

			<hr className="container" />
			<h5 className="d-flex justify-content-center">Personal Information</h5>

			<div className="input-group mb-3 d-flex justify-content-center">
				<div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Birth Date</span>
				</div>
				<input type="date" id="datechanger-date" onChange={e => {changeDob(e);}} value={convertStringToDate(dob).toLocaleDateString('en-CA')}/>
			</div>
				
			<div className="input-group mb-3 d-flex justify-content-center">
				<div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Height (cm)</span>
				</div>
				<input type="number" min="1" id="page-configure-calories" value={height} onChange={(e) => setHeight(parseInt(e.target.value))}/>
			</div>

			<div className="input-group mb-3 d-flex justify-content-center">
				<div className="input-group-prepend">
					<span className="input-group-text" id="basic-addon1">Gender</span>
				</div>
				<select name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
				</select>
			</div>

			<div className="input-group mb-3 d-flex justify-content-center">
				<button className="btn btn-primary" onClick={submitStatic}>Save</button>
            </div>
		</div>
		:
		<>Loading...</>
	);
}

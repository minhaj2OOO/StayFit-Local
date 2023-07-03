import {useState, useEffect, FunctionComponent} from 'react';
import { Link } from "react-router-dom";
import { DateChanger } from '../components/DateChanger';
import axios from 'axios';
import { createDateObject } from '../functions/helperFunctions';

export const Home:FunctionComponent = () => {

	const [lastWeighIn, setLastWeighIn] = useState('');
	
	const signOut = () => {		
		// make api call to backend to signout
		axios.get('/api/help/logout')
		.then(res => {
			console.log(res.data)
			localStorage.removeItem('user');
			localStorage.removeItem('day');
			window.location.href = '/stayfit/signin';
		})
		.catch(err => {
			console.log(err);
			alert("Failed to signout. Please try again.")
		})
	}

	useEffect(() => {
		axios.get('/api/user/info')
		.then((res) => {
			setLastWeighIn(res.data.lastWeighIn);
		}).catch((err) => {
			console.log(err);
		})
	}, []);

	useEffect(() => {
		if(lastWeighIn === '') return;

		const lastDate = createDateObject(lastWeighIn);
		const currentDate = new Date();
		const diffInMs = Math.abs(currentDate.getTime() - lastDate.getTime());
		const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays > 7) {
			alert(`It's been more than a week. Please weigh yourself again.`);
		}
	}, [lastWeighIn])

	return (
		<div>
			<nav className="navbar navbar-expand-lg bg-dark justify-content-between p-3">
				<Link to={"/stayfit/home"}>
					<img src="/stayfit_logo.png" alt="Logo" />
				</Link>
				<h1 className='text-white'>Home</h1>
				<div className='d-inline'>
					<button className="btn btn-primary m-2" onClick={() => {signOut()}}>Sign Out</button>
					<Link to="/stayfit/settings">
						<button className="btn btn-light">⚙️</button>
					</Link>
				</div>			
          	</nav>

			<DateChanger />
				
			<div className="container">
				<Link to={'/stayfit/foodlog'} className='text-decoration-none'>
					<h2>🍳 Food Log</h2>
				</Link>
				<hr className="container"/>
				<Link to={'/stayfit/physicalactivity'} className='text-decoration-none'>
					<h2>🏋 Physical Activity Log</h2>
				</Link>
				<hr className="container"/>
				<Link to={'/stayfit/rewards'} className='text-decoration-none'>
					<h2>🏆 Rewards</h2>
				</Link>
				<hr className="container"/>
				<Link to={'/stayfit/tips'} className='text-decoration-none'>
					<h2>💡 Tips</h2>
				</Link>
			</div>			
		</div>
	);
}

export default Home;
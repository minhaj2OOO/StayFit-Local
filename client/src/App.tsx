import { Route, Routes as Switch, BrowserRouter as Router } from "react-router-dom";
import { SignIn } from "./main/SignIn";
import { Home } from "./main/Home";
import { Settings } from "./main/Settings";
import { FoodLog } from "./main/FoodLog";
import { Search } from "./main/Search";
import { TrackFood } from "./main/TrackFood";
import { PhysicalActivity } from "./main/PhysicalActivity";
import { Rewards } from "./main/Rewards";
import { RewardUnlocked } from "./main/RewardUnlocked";
import { Tips } from "./main/Tips";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
	return (
		<div>			
			<Router>			
				<Switch>
					<Route path='/' element={ <SignIn /> } />
					<Route path='/stayfit/signin' element={ <SignIn /> } />
					
					<Route path="/" element={ <PrivateRoute />  }>
						<Route path='/stayfit/home' element={ <Home /> } />
					</Route>

					<Route path="/" element={ <PrivateRoute />  }>
						<Route path='/stayfit/settings' element={ <Settings /> }/>
					</Route>

					<Route path="/" element={ <PrivateRoute />  }>
						<Route path='/stayfit/foodlog' element={<FoodLog />}/>
					</Route>

					<Route path="/" element={ <PrivateRoute />  }>
						<Route path='/stayfit/foodlog/search' element={<Search />}/>
					</Route>

					<Route path="/" element={ <PrivateRoute />  }>
						<Route path='/stayfit/foodlog/search/:id' element={<TrackFood />}/>
					</Route>

					<Route path="/" element={ <PrivateRoute />  }>
						<Route path='/stayfit/physicalactivity' element={ <PhysicalActivity /> } />		
					</Route>

					<Route path="/" element={ <PrivateRoute />  }>
						<Route path='/stayfit/rewards' element={ <Rewards /> } />
					</Route>			

					<Route path="/" element={ <PrivateRoute />  }>
						<Route path='/stayfit/rewards/:id' element={ <RewardUnlocked /> } />
					</Route>

					<Route path="/" element={ <PrivateRoute />  }>
						<Route path='/stayfit/tips' element={ <Tips /> } />
					</Route>

					<Route path='/404' element={ <>404 Not Found</> } />
				</Switch>			
			</Router>
		</div>
	);
}

export default App;

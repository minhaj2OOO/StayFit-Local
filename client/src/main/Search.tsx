import {useState, useEffect, FunctionComponent} from 'react';
import {useLocation, useResolvedPath} from "react-router-dom";
import SearchResults from '../components/SearchResults'
import Navbar from '../components/NavBar';

interface foodInfointerface {
	id: number;
	name: string;
	image: string;
}

export const Search:FunctionComponent<any> = () => {
	const { pathname } = useLocation();
	let mealArray = useResolvedPath(pathname).pathname.split('/');
	let meal =mealArray[mealArray.length-2];
	const [search, setSearch] = useState('');
	const [enterClicked, setEnterClicked] = useState(false);
	const [foodInfo, setFoodInfo] = useState<foodInfointerface[]>([]);
	const baseSrc = "https://spoonacular.com/cdn/ingredients_100x100/";
	
	useEffect(() => {
		if(!enterClicked) return;

		if (search!==''){
			const fetchResults = async() => {
				let response = await fetch(`https://api.spoonacular.com/food/ingredients/search?apiKey=db913ca9f0954813bd4efddc017009be&query=${search}&number=25`);
				let data = await response.json();
				setFoodInfo(data.results);
			}
			fetchResults();
		}
		setEnterClicked(false);
	}, [enterClicked])

	return (
		<div>
			<Navbar title="Search Food" backUrl="/stayfit/foodlog" />

			<div className="input-group mb-3 d-flex justify-content-center">
				<input type="text" placeholder="🔍 Search Food" id="page-searchbar" value={search} onChange={(e) => {
					setSearch(e.target.value);
				}}/>
				<button className="btn btn-primary" onClick={() => setEnterClicked(true)}>Search</button>
			</div>
			
			<div className="container">
				{
					foodInfo.map((item) => {
						return <SearchResults key={item.id} id={'foodId-'+item.id} title={item.name} imgSrc={baseSrc+item.image} meal={meal}/>
					})
				}
			</div>
		</div>
	);
}

export default Search;



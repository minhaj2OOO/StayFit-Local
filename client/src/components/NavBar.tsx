import { FC } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface NavbarProps {
  title: string;
  backUrl: string;
}	
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

const Navbar: FC<NavbarProps> = ({ title, backUrl }) => {
  return (
    <nav className="navbar navbar-expand-lg bg-dark justify-content-between mb-3 p-3">
      <Link to={"/stayfit/home"}>
        <img src="/stayfit_logo.png" alt="Logo" />
      </Link>
      <h1 className='text-white'>{title}</h1>
      <div className='d-inline'>
        <button className="btn btn-primary m-2" onClick={() => {signOut()}}>Sign Out</button>
        <Link to={backUrl}>
          <button className="btn btn-light">⬅</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
import axios from "axios";
import {FunctionComponent, useState} from "react";
import { Link } from "react-router-dom";

export const SignIn:FunctionComponent = () => {
  //
  const [onSignUp, setOnSignUp] =  useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logIn = () => {
    // Check Login
    axios.post(`/api/help/login`, {email: email, password: password})
      .then(res => {
        console.log(res.data)
        localStorage.setItem('user', email);
        window.location.pathname = '/stayfit/home';
      })
      .catch(e => {
        const error = e.response.data;
        console.log(error);
        alert(`${error.message}. CODE: ${error.code}`)
      })
  }
  
  const signUp = () => {
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    // Check if password is at least 8 characters
    if (password.length < 8) {
      alert("Password should be at least 8 characters long");
      return;
    }
    
    // Add User
    axios.post(`/api/help/signup`, {email: email, password: password})
      .then(res => {
        console.log(res.data)
        localStorage.setItem('user', res.data.email);
        window.location.pathname = '/stayfit/home';
      })
      .catch(e => {
        const error = e.response.data;
        console.log(error);
        alert(`${error.message}. CODE: ${error.code}`)
      })
  }

  if (onSignUp === true) {
    return (
      <div>
          <nav className="navbar navbar-expand-lg bg-dark justify-content-between mb-3 p-3">
            <Link to={"/stayfit/home"}>
              <img src="/stayfit_logo.png" alt="Logo" />
            </Link>
          </nav>

          <h2 className="d-flex justify-content-center">Sign Up</h2>

          <div className="input-group mb-3 d-flex justify-content-center">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">Email</span>
            </div>
            <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
          </div>
          
          <div className="input-group mb-3 d-flex justify-content-center">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">Password</span>
            </div>
            <input type="password" id="signUp-password" maxLength={15} value={password} onChange={(e) => {setPassword(e.target.value)}} />
          </div>
            
          <div className="input-group mb-3 d-flex justify-content-center">
            <button className="btn btn-primary" onClick={signUp} >Submit</button>
          </div>
            
          <h5 className="input-group mt-5 d-flex justify-content-center">Already a member?</h5>
          <div className="input-group mb-3 d-flex justify-content-center">
            <button className="btn btn-primary" onClick={() => {setOnSignUp(false)}} id="signin-btnOther">Log In</button>
          </div>
      </div>
    );
  } else {
    return (
        <div>
          <nav className="navbar navbar-expand-lg bg-dark justify-content-between mb-3 p-3">
          <Link to={"/stayfit/home"}>
            <img src="/stayfit_logo.png" alt="Logo" />
          </Link>
          </nav>

          <h2 className="d-flex justify-content-center">Log In</h2>

          <div className="input-group mb-3 d-flex justify-content-center">
            <div className="input-group-prepend">
               <span className="input-group-text" id="basic-addon1">Email</span>
            </div>
            <input type="email" id="logIn-email" onChange={(e) => {setEmail(e.target.value)}} />
          </div>

          <div className="input-group mb-3 d-flex justify-content-center">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">Password</span>
            </div>
            <input type="password" id="logIn-password" onChange={(e) => {setPassword(e.target.value)}} />
          </div>

          <div className="input-group mb-3 d-flex justify-content-center">
            <button className="btn btn-primary" onClick={logIn}>Log In</button>
          </div>

          <h5 className="input-group mt-5 d-flex justify-content-center">Not a member?</h5>
            <div className="input-group mb-3 d-flex justify-content-center">
             <button className="btn btn-primary" onClick={() => {setOnSignUp(true)}} id="signin-btnOther">Sign Up</button>   
            </div>
        </div>     
    );
  }
}
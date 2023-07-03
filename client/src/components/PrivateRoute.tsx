import { useEffect, useState} from "react";
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';


export const PrivateRoute= () => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean|null>(null);

    useEffect(() => {
        axios.get("/api/help/isLoggedIn")
            .then(res => {
                const { email } = res.data;
                console.log(email);
                window.localStorage.setItem("user", email);
                setIsLoggedIn(true);
            })
            .catch(error => {
                setIsLoggedIn(false);
            })
    },[]);

    const renderComponent = () => {
        if(isLoggedIn === null){
            return <>Loading...</>
        }else if(isLoggedIn){
            return <Outlet />;
        }else{
            return <Navigate to="/" />;
        }
    }

    return renderComponent();
}
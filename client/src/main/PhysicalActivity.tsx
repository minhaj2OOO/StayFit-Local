import axios from "axios";
import React, {FunctionComponent, useState, useEffect} from "react";
import { convertDateToString } from "../functions/helperFunctions";
import Navbar from "../components/NavBar";

interface exerciseDetails {
    id: number;
    exercise: string;
    burnt: number;
    day: string;
}

export const PhysicalActivity:FunctionComponent = () => {
    const [exercise, setExercise] = useState("");
    const [burnt, setBurnt] = useState(1);
    const [allExercises, setAllExercises] = useState<exerciseDetails[]>([]);
    const [refresh, setRefresh] = useState(true);
	const day = localStorage.getItem("day") || convertDateToString(new Date());

    useEffect(() => {
        if(refresh === false) return;

        axios.get(`/api/user/physicalActivity/${day}`)
        .then((res) => {
            setAllExercises(res.data.physicalActivity);
            setRefresh(false);
        })
        .catch((err) => {
            console.log(err);
            setRefresh(false);
        })
    }, [refresh]);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if(exercise === "" || burnt === 0){
            alert("Please fill in all the fields");
            return;
        };

        axios.post("/api/user/physicalActivity/add", {
            exercise: exercise,
            burnt: burnt,
            day: day
        })
        .then(async (response) => {
            await axios.post("/api/user/points/add", {points: 5})
            .then((res) => {
                console.log(res);
                alert(`You earnt 5 points.`)
            })
            .catch((err) => {
                console.log(err);
            })
            setExercise("");
            setBurnt(1);
            setRefresh(true);
        })
        .catch((error) => {
            console.log(error);
        })
    }
   
    const removeExercise = (id: number) => {
        axios.delete(`/api/user/physicalActivity/${id}`)
        .then((response) => {
            setRefresh(true);
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return ( 
        <div>
            <Navbar title="Physical Activity Log" backUrl="/stayfit/home"/>

            <form id="PhysicalActivityForm">
                <div className="input-group mb-3 d-flex justify-content-center">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Activity Description</span>
                    </div> 
                    <textarea form="PhysicalActivityForm" name="exercise" value={exercise} onChange={ (e) => {setExercise(e.target.value)}}></textarea>
                </div>
                <div className="input-group mb-3 d-flex justify-content-center">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">Calories Burnt (kcal)</span>
                    </div> 
                    <input type="number" min="1" name="burnt" value={burnt} onChange={ (e) => {setBurnt(parseInt(e.target.value))}}/>
                </div>
                <div className="input-group mb-3 d-flex justify-content-center">
                    <button className="btn btn-primary" type="submit" onClick={ (e) => handleSubmit(e)}>Submit</button>
                </div>     
            </form> 
            
            <div className="container">
                {allExercises.length > 0 && 
                    allExercises.map((exercise, index) => {
                        return (
                            <div key={index} className="container">
                                <p>⚫{exercise.exercise} {exercise.burnt}kcal</p>
                                <button className="btn btn-danger" onClick={() => {removeExercise(exercise.id)}}>Remove</button>
                                <hr className="container" />
                            </div>
                        )}
                    )
                }
            </div>
        </div>
    )
}
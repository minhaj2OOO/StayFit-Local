import React, { FunctionComponent, useEffect, useState } from 'react';
import { convertDateToString, createDateObject } from '../functions/helperFunctions';
import { Dashboard } from './Dashboard';

export const DateChanger: FunctionComponent<any> = () => {
  const [day, setDay] = useState<string>(localStorage.getItem('day') || convertDateToString(new Date()));
  const [dateValue, setDateValue] = useState<Date>(createDateObject(day));

  useEffect(() => {
    localStorage.setItem('day', day);
  }, []);

  useEffect(() => {
    setDateValue(createDateObject(day));
  }, [day]);

  const changeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentDate = new Date(event.currentTarget.value);
    const nextDate = new Date(currentDate); // Create a new Date object with the current date
    nextDate.setDate(currentDate.getDate()); 
    const stringDate = convertDateToString(nextDate);
    localStorage.setItem('day', stringDate);
    setDay(stringDate);
  }

  const decrementDate = () => {
    const nextDate = new Date();
    nextDate.setDate(dateValue.getDate() - 1);
    nextDate.setMonth(dateValue.getMonth());
    nextDate.setFullYear(dateValue.getFullYear());
    const stringDate = convertDateToString(nextDate);
    localStorage.setItem('day', stringDate);
    setDay(stringDate);
  }

  const incrementDate = () => {
    const nextDate = new Date();
    nextDate.setDate(dateValue.getDate() + 1);
    nextDate.setMonth(dateValue.getMonth());
    nextDate.setFullYear(dateValue.getFullYear());
    const stringDate = convertDateToString(nextDate);
    localStorage.setItem('day', stringDate);
    setDay(stringDate);
  }

  const convertStringToDate = (dateString: string): Date => {
    // Split the dateString into an array of [day, month, year]
    const [day, month, year] = dateString.split('-').map(Number);
    // Create a new Date object using the year, month, and day
    const date = new Date(year, month - 1, day);
    return date;
  }

	return (
		<div>
			<div className="bg-primary bg-gradient bg-opacity-50 pb-3">
				<div className="container d-flex justify-content-center pt-3">
					<button className="btn btn-light m-3" onClick={() => decrementDate()}>⬅</button>
					<input
            className='p-3'
            type="date"
            id="datechanger-date"
            onChange={e => {
              changeDate(e);
            }}
            value={convertStringToDate(day).toLocaleDateString('en-CA')}
            placeholder="dd-mm-yyyy"
          />
					<button className="btn btn-light m-3" onClick={() => incrementDate()}>➡</button>
				</div>			
			</div>
			<Dashboard day={day} />			
		</div>
	);
}
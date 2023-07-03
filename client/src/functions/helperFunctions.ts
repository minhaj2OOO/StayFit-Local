export const formatDate = (date: Date) => {
	let dd = String(date.getDate()).padStart(2, '0');
	let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
	let yyyy = date.getFullYear();
	const newDate: string = dd + '-' + mm + '-' + yyyy;
	return newDate;
}

export const convertDateToString = (date: Date) => {
	console.log(date)
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
}
  
export const createDateObject = (dateString: string) => {
	const parts = dateString.split('-');
	const yearInt = parseInt(parts[2], 10);
	const monthInt = parseInt(parts[1], 10) - 1; // JavaScript months are 0-11
	const dayInt = parseInt(parts[0], 10);
	return new Date(yearInt, monthInt, dayInt);
}
  
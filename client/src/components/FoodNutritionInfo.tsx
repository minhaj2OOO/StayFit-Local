import { FunctionComponent} from 'react';
import axios from 'axios';

export const FoodInfo:FunctionComponent<any> = ({ id, name, amount, unit, cal, fat, protein, carb, setFetch }: { id: string, name: string, amount: string, unit: string, cal: string, fat: string, protein: string, carb: string, setFetch: Function }) => {
  const removeFood = () => {
    console.log("Deleting food: ", id)
    axios.delete(`/api/user/food/${id}`)
    .then((res) => {
      console.log(res);
      setFetch(true);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <div className="container">
      <h5>⚫{name}</h5>
      <p>{cal}kcal | {amount}{unit} | {protein}{unit} Protein | {carb}{unit} Carbs | {fat}{unit} Fat</p>
      <button className="btn btn-danger" onClick={() => removeFood()}>Remove</button>
      <hr className="container" />
    </div>
  );
}

export default FoodInfo;
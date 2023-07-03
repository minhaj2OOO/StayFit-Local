import {FunctionComponent} from 'react';
import Navbar from '../components/NavBar';

export const Tips:FunctionComponent<any> = () => {
  return (
    <div>
      <Navbar title="Tips" backUrl='/stayfit/home/' />

        <div className='container pt-1'>
          <h5>DON'T OBSESS OVER CALORIE TRACKING</h5> 
          Weigh yourself weekly, preferably after you've woken up and been to the bathroom. 
          Depending on the measurement, adjust your calories and activity levels from there.
          <hr></hr>
        </div>
        <div className='container pt-1'>
          <h5>OPTIMAL PROTEIN INTAKE</h5> 
          Most adults need around 0.75g of protein per kg of body weight per day. 
          If resistance training to build strength and muscle, 1.6-2.2g of protein per kg 
          of lean mass is recommended.
          <hr></hr>
        </div>
        <div className='container pt-1'>
          <h5>NET CALORIES</h5> 
          If you want to gain weight, you should be in a caloric surplus - 
          your weekly net calories should be positive. If you want to lose weight, you should 
          be in a caloric deficit - your weekly net calories should be negative.
          If you want to maintain your current weight, have a weekly net calories around 0.
          <hr></hr>
        </div>
    </div>
  );
}

export default Tips;



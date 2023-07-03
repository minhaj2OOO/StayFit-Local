import {FunctionComponent} from 'react';
import {Link} from "react-router-dom";

interface searchResultsInterface {
  key:number, 
  id:string, 
  title:string, 
  imgSrc:string, 
  meal:string
}

export const SearchResults:FunctionComponent<searchResultsInterface> = ({id, title, imgSrc}: searchResultsInterface) => {
  const getNumId = (id:string) => {
    const arr = id.split('-');
    return arr[1];
  }

  return (
    <div>
      <div className='pt-5'>
        <Link to={`/stayfit/foodlog/search/${getNumId(id)}`}>
        <div className="foodbar-left">
          {
            imgSrc ? <img src={imgSrc} alt={title} /> : null
          }
          <h2>{title}</h2>
        </div>
        </Link>
      </div>   
    </div>
  );
}

export default SearchResults;
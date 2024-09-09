import { useEffect } from "react";
import { getSpots } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import { MdStarRate } from "react-icons/md";
import './LandingPage.css'

const LandingPage = () => {
  const dispatch = useDispatch();
  const allSpots = useSelector(state => state.spot.Spots)

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  if (!allSpots) {
    return (
      <h1>Loading...</h1>
    )
  }
  return (
    <ul className="all-spots-container">
      {allSpots.map(({ id, previewImage, city, state, avgRating, price }) => (
        <li key={id} className="spot-card">
          <img src={previewImage} alt="spot-image" className="spot-image"/>
          <div className="spot-info">
            <div>{city}, {state}</div>
            <div><MdStarRate />{avgRating}</div>
          </div>
          <div className="spot-price">${price} night</div>
        </li>
      ))}
    </ul>
  )
}

export default LandingPage

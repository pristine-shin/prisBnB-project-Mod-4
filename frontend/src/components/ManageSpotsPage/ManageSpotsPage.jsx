import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getCurrentUserSpots } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import { MdStarRate } from "react-icons/md";
import './ManageSpots.css'

const ManageSpotsPage = () => {
  const dispatch = useDispatch();
  const currUserSpots = useSelector(state => state.spot.Spots)

  useEffect(() => {
    dispatch(getCurrentUserSpots());
  }, [dispatch]);

  if (!currUserSpots) {
    return (
      <h1>Loading...</h1>
    )
  }
  return (
    <div className="all-spots-container">
      {currUserSpots.map(({ id, previewImage, city, state, avgRating, price }) => (
        <div key={id} className="spot-card">
          <NavLink to={`/spots/${id}`} className="spot-link">
            <img src={previewImage} alt="spot-image" className="spot-image"/>
            <div className="spot-info">
              <div>{city}, {state}</div>
              <div><MdStarRate />{avgRating ? avgRating.toFixed(2) : avgRating}</div>
            </div>
            <div className="spot-price">${price} night</div>
          </NavLink>
        </div>
      ))}
    </div>
  )
}

export default ManageSpotsPage;

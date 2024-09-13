import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { deleteSpot, getCurrentUserSpots } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import { MdStarRate } from "react-icons/md";
import './ManageSpots.css'

const ManageSpotsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currUserSpots = useSelector(state => state.spot.Spots)

  useEffect(() => {
    dispatch(getCurrentUserSpots());
  }, [dispatch, currUserSpots]);//this isn't great, it re renders all the time

  const handleClick = async (e) => {
    e.preventDefault();
    return navigate('/spots/new');
  }

  // const handleClickDelete = async (e) => {
  //   e.preventDefault();
  //   console.log('test click')

  //   // return dispatch(deleteSpot())
  // }


  if (!currUserSpots) {
    return (
      <h1>Loading...</h1>
    )
  }
  return (
    <div className="manage-spots-page-container">
      <div className="manage-spots-header">
        <h1>Manage Your Spots</h1>
        <button onClick={handleClick} className="review-button">Create a New Spot</button>
      </div>
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
              <div className="update-delete-buttons-container">
                <NavLink to={`/spots/${id}/edit`}>
                  <button className="review-button">Update</button>
                </NavLink>
                <NavLink to={`/spots/current`}>
                <button onClick={() => dispatch(deleteSpot(id))}className="review-button">Delete</button>
                </NavLink>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageSpotsPage;

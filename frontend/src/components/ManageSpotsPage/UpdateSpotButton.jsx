import { useNavigate } from "react-router-dom";
import { getSpotById } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";

const UpdateSpotButton = ({ spot }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(spot)
    const currSpot = useSelector(state => state.spot)
    // console.log(currSpot)

    const handleClick = async (e) => {
        e.preventDefault();
        // console.log(spot)
        dispatch(getSpotById(spot.id))
        console.log(currSpot)
        navigate(`/spots/${spot.id}/edit`)
    }

    return (
        <div>
            <button onClick={handleClick} className="review-button">Update</button>
        </div>
    )
}

export default UpdateSpotButton

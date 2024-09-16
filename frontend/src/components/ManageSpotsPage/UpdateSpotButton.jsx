import { useNavigate } from "react-router-dom";
import { getSpotById } from "../../store/spot";
import { useDispatch } from "react-redux";

const UpdateSpotButton = ({ spot }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch(getSpotById(spot.id))
        navigate(`/spots/${spot.id}/edit`)
    }

    return (
        <div>
            <button onClick={handleClick} className="review-button">Update</button>
        </div>
    )
}

export default UpdateSpotButton

import { useDispatch } from "react-redux";
import { deleteSpot } from "../../store/spot";

const DeleteSpotButton = ({ spotId }) => {
    const dispatch = useDispatch();

    const handleClick = async (e) => {
        e.preventDefault();

        return dispatch(deleteSpot(spotId))
    }
    return (
        <div>
            <button onClick={handleClick} className="review-button">Delete</button>
        </div>
    )
}

export default DeleteSpotButton

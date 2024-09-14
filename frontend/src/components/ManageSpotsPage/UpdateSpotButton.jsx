import { useNavigate } from "react-router-dom";

const UpdateSpotButton = ({ spotId }) => {
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();

        navigate(`/spots/${spotId}/edit`)
    }
    return (
        <div>
            <button onClick={handleClick} className="review-button">Update</button>
        </div>
    )
}

export default UpdateSpotButton

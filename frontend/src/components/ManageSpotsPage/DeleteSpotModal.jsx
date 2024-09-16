import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
import './ManageSpots.css'
import { deleteSpot } from "../../store/spot";


const DeleteSpotModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleClickDelete = async (e) => {
    e.preventDefault();

    return dispatch(deleteSpot(spotId))
    .then(closeModal)
  };

  return (
    <div className="review-form-container">
      <h1 id="heading">Confirm Delete</h1>
      <div>Are you sure you want to remove this spot from the listings?</div>
      <button onClick={handleClickDelete} className="delete-review-button" >Yes (Delete Spot)</button>
      <button onClick={closeModal} className="keep-review-button">No (Keep Spot)</button>
    </div>
  );
};

export default DeleteSpotModal;

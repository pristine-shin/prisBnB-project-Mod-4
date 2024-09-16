import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import './DeleteReview.css'
import { deleteReview } from "../../store/review";

const DeleteReviewModal = ({reviewId}) => {
  const dispatch = useDispatch();
  const currSpotId = useSelector((state) => state.spot.id)
  const { closeModal } = useModal();

  const handleClickDelete = async (e) => {
    e.preventDefault();

    return dispatch(deleteReview(reviewId, currSpotId))
    .then(closeModal)
  };

  return (
    <div className="review-form-container">
      <h1 id="heading">Confirm Delete</h1>
      <div>Are you sure you want to delete this review?</div>
      <button onClick={handleClickDelete} className="delete-review-button">Yes (Delete Review)</button>
      <button onClick={closeModal} className="keep-review-button">No (Keep Review)</button>
    </div>
  );
};

export default DeleteReviewModal;

import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import './DeleteReview.css'
import { deleteReview } from "../../store/review";

const DeleteReviewModal = () => {
  const dispatch = useDispatch();
  // const currSpot = useSelector((state) => state.spot)
  const review = useSelector((state) => state.review)
  // const currUser = useSelector((state) => state.session.user);
  const { closeModal } = useModal();

  // if(currUser) return <Navigate to='/' replace={true} />

  const handleClickDelete = async (e) => {
    e.preventDefault();

    return dispatch(deleteReview(review.id))
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

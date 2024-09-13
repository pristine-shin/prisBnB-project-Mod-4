import { useDispatch, useSelector } from "react-redux";
// import { useParams } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './DeleteReview.css'
import { deleteReview } from "../../store/review";

const DeleteReviewModal = ({reviewId}) => {
  const dispatch = useDispatch();
  const currSpotId = useSelector((state) => state.spot.id)
  // const review = useSelector((state) => state.review)
  console.log('current spot', currSpotId)
  console.log('current reviewId', reviewId)
  // const currUser = useSelector((state) => state.session.user);
  const { closeModal } = useModal();

  // if(currUser) return <Navigate to='/' replace={true} />

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

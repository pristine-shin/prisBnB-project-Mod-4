import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import { FaStar } from 'react-icons/fa';
import './CreateReviewForm.css'
import { createReview } from "../../store/review";

const CreateReviewFormModal = () => {
  const dispatch = useDispatch();
  const currSpot = useSelector((state) => state.spot)
  const currUser = useSelector((state) => state.session.user);
  const [review, setReview] = useState("");
  const [numStars, setNumStars] = useState(null);
  const [hover, setHover] = useState(null);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // if(currUser) return <Navigate to='/' replace={true} />

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(createReview(
      {
        userId: currUser.id,
        spotId: currSpot.id,
        review,
        stars: numStars,
      }
    ))
    .then((review) => console.log(review))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    });
  };

  return (
    <div className="review-form-container">
      <h1 id="heading">How was your stay?</h1>
      <form onSubmit={handleSubmit} className="review-form">
        <textarea
          placeholder="Leave your review here..."
          className="review-input"
          type="text"
          rows='7'
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        {errors.review && <p>{errors.review}</p>}
        <div className="stars-container">
            {[...Array(5)].map((star, idx) => {
                const currStars = idx + 1
                return (
                    <label key={idx}>
                        <input
                            type="radio"
                            name="rating"
                            value={currStars}
                            onClick={() => setNumStars(currStars)}
                            required
                        />
                        <FaStar
                            size={20}
                            className="star"
                            color={currStars <= (hover || numStars) ? "yellow" : "grey" }
                            onMouseEnter={() => setHover(currStars)}
                            onMouseLeave={() => setHover(null)}
                            style={{
                                outline: 'black'
                            }}
                        />
                    </label>
                )
            })}
        </div>
        {errors.stars && <p>{errors.stars}</p>}
        <button type="submit" className="review-button">Submit Your Review</button>
      </form>
    </div>
  );
};

export default CreateReviewFormModal;

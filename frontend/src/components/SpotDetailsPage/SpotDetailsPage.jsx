import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getSpotById, getReviewsBySpotId } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from '../OpenModalButton';
import CreateReviewFormModal from "../CreateReviewFormModal/CreateReviewFormModal";
import { MdStarRate } from "react-icons/md";
import { LuDot } from "react-icons/lu";
import './SpotDetails.css'
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

const SpotDetailsPage = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const { spotId } = useParams();
    const spotDetails = useSelector(state => state.spot);
    const currUser = useSelector((state) => state.session.user);
    const review = useSelector((state) => state.review)

    // console.log(review);

    useEffect(() => {
        dispatch(getSpotById(spotId)).then(dispatch(getReviewsBySpotId(spotId))).then(() => { setisLoading(true) })
    }, [dispatch, spotId, review]);

    // const previewImg = spotDetails.SpotImages.find(image => image.preview === true);
    // console.log(spotDetails);
    const handleClick = () => {
        alert('Feature Coming Soon...')
    }

    return (
        <>
            {
                isLoading ?

                    <div className="spot-details-container">
                        <h2>{spotDetails.name}</h2>
                        <h3>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</h3>
                        {spotDetails.SpotImages.length ?
                            <div className="spot-images-container">
                                <div className="preview-image">
                                    <img src={spotDetails.SpotImages.find(image => image.preview === true).url} alt="preview-image" />
                                </div>
                                <div className="smaller-images">
                                    {spotDetails.SpotImages.slice(1, 5).map((image, idx) => (
                                        <img key={idx} src={image.url} alt={`Spot Image ${idx}`} className="spot-images" />
                                    ))}
                                </div>
                            </div>
                            :

                            <div>No Images Yet</div>
                        }
                        <div className="description-price-container">
                            <div className="description-container">
                                <h3>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h3>
                                <p id="description">
                                    {spotDetails.description}
                                </p>
                            </div>
                            <div className="price-container">
                                <div className="price-details">
                                    <h3>${spotDetails.price} night</h3>
                                    <div><MdStarRate />{spotDetails.avgRating ? spotDetails.avgRating.toFixed(2) : spotDetails.avgRating} <LuDot /> {spotDetails.numReviews} reviews</div>
                                </div>
                                <button id="reserve-button" onClick={handleClick}>Reserve</button>
                            </div>
                        </div>
                        <hr />
                        <div className="reviews-outer-container">
                            <h3><MdStarRate />{spotDetails.avgRating ? spotDetails.avgRating.toFixed(2) : spotDetails.avgRating} <LuDot /> {spotDetails.numReviews} reviews</h3>
                            <div className="reviews-inner-container">
                                {
                                    currUser && spotDetails.ownerId !== currUser.id && !(spotDetails.Reviews.find(review => review.userId === currUser.id)) && !spotDetails.Reviews.length ? (
                                        <div>
                                            <OpenModalButton
                                                buttonText="Post Your Review"
                                                buttonClassName="review-button"
                                                modalComponent={<CreateReviewFormModal />}
                                            />
                                            <div style={{
                                            marginTop: '15px'
                                        }}>Be the first to post a review!</div>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )
                                }
                                {
                                    !spotDetails.Reviews.length ? (
                                        <div></div>
                                    ) : (
                                        <div className="reviews-list">
                                            {spotDetails.Reviews.map(review => (
                                                <div key={review.id} className="single-review">
                                                    <div className="reviewer-name">{review.User.firstName}</div>
                                                    <div className="review-date">Month {review.createdAt.slice(0, 4)}</div>
                                                    <div className="review-text">{review.review}</div>
                                                    { currUser && currUser.id === review.userId ? (
                                                        <OpenModalButton
                                                            buttonText="Delete"
                                                            buttonClassName="delete-review-modal-button"
                                                            reviewId={review.id}
                                                            modalComponent={<DeleteReviewModal reviewId={review.id}/>}
                                                        />
                                                    ) : (
                                                        <div></div>
                                                    ) }
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                    </div>

                    :

                    <h1>Loading...</h1>

            }
        </>

    )
}

export default SpotDetailsPage

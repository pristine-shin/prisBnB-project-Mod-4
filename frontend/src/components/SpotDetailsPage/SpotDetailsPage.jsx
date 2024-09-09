import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { getSpotById } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import { MdStarRate } from "react-icons/md";
import './SpotDetails.css'

const SpotDetailsPage = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const { spotId } = useParams();
    const spotDetails = useSelector(state => state.spot)

    useEffect(() => {
        dispatch(getSpotById(spotId)).then(() => { setisLoading(true) })
    }, [dispatch, spotId]);

    // const previewImg = spotDetails.SpotImages.find(image => image.preview === true);
    // console.log(previewImg);

    return (
        <>
            {
                isLoading ?

                    <div>
                        <h2>{spotDetails.name}</h2>
                        <h3>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</h3>
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
                        <div className="description-price-container">
                            <div className="description-container">
                                <h3>Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}</h3>
                                <p id="description">
                                    {spotDetails.description}
                                </p>
                            </div>
                            <div className="price-container">
                                <div className="price-details">
                                    <h3>${spotDetails.price}night</h3>
                                    <div><MdStarRate />{spotDetails.avgRating}</div>
                                    <div>{spotDetails.numReviews} reviews</div>
                                </div>
                                <button>Reserve</button>
                            </div>
                        </div>
                        <div className="reviews-container">
                            Reviews will go here.
                        </div>
                    </div>

                    :

                    <h1>Loading...</h1>

            }
        </>

    )
}

export default SpotDetailsPage

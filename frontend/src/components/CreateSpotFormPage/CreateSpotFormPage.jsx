import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot, postSpotImage } from '../../store/spot';
import './CreateSpotForm.css'

function CreateSpotFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImgUrl, setPreviewImgUrl] = useState("");
  const [img1Url, setImg1Url] = useState("");
  const [img2Url, setImg2Url] = useState("");
  const [img3Url, setImg3Url] = useState("");
  const [img4Url, setImg4Url] = useState("");
  const [errors, setErrors] = useState({});


  // if (sessionUser) return <Navigate to="/spots/new" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sessionUser) {
      setErrors({});

      const newSpot = {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      }

      dispatch(
        createSpot(newSpot)
      )
        .then(spot => {
          dispatch(postSpotImage({ spotId: spot.id, url: previewImgUrl, preview: true }))
          return spot.id
        })
        .then((id) => {
          dispatch(postSpotImage({ spotId: id, url: img1Url, preview: false }))
          return id;
        })
        .then((id) => {
          dispatch(postSpotImage({ spotId: id, url: img2Url, preview: false }))
          return id;
        })
        .then((id) => {
          dispatch(postSpotImage({ spotId: id, url: img3Url, preview: false }))
          return id;
        })
        .then((id) => {
          dispatch(postSpotImage({ spotId: id, url: img4Url, preview: false }))
          navigate(`/spots/${id}`)
          return id;
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
  };

  return (
    <div className='create-spot-container'
      style={{
        width: "33%",
        display: "flex",
        flexDirection: "column",
        marginLeft: "33%",

      }}>
      <h1>Create a new Spot</h1>
      <h2>Where&apos;s your place located?</h2>
      <h3>Guests will only get your exact address once they booked a reservation.</h3>
      <form onSubmit={handleSubmit} className='create-spot-form'>
        <label>Country
          <input
            placeholder='Country'
            className='form-input'
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          // required
          />
        </label>
        {errors.country && <p>{errors.country}</p>}
        <label>Street Address
          <input
            placeholder='Address'
            className='form-input'
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          // required
          />
        </label>
        {errors.address && <p>{errors.address}</p>}
        <label>City
          <input
            placeholder='City'
            className='form-input'
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          // required
          />
        </label>
        {errors.city && <p>{errors.city}</p>}
        <label>State
          <input
            placeholder='STATE'
            className='form-input'
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          // required
          />
        </label>
        {errors.state && <p>{errors.state}</p>}
        <label>Latitude
          <input
            placeholder='Latitude'
            className='form-input'
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          // required
          />
        </label>
        {errors.lat && <p>{errors.lat}</p>}
        <label>Longitude
          <input
            placeholder='Longitude'
            className='form-input'
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          // required
          />
        </label>
        {errors.lng && <p>{errors.lng}</p>}

        <hr />

        <h2>Describe your place to guests</h2>
        <h3>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h3>
        <textarea
          placeholder='Please write at least 30 characters'
          className='form-input'
          type="text"
          rows='7'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        // required
        />
        {errors.description && <p>{errors.description}</p>}

        <hr />

        <h2>Create a title for your spot</h2>
        <h3>Catch guests&apos; attention with a spot title that highlights what makes your place special.</h3>
        <input
          placeholder='Name of your spot'
          className='form-input'
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        // required
        />
        {errors.name && <p>{errors.name}</p>}

        <hr />

        <h2>Set a base price for your spot</h2>
        <h3>Competitive pricing can help your listing stand out and rank higher in search results.</h3>
        <label style={{
          display: 'flex',
          alignItems: 'center',
        }}> $
          <input
            placeholder='Price per night (USD)'
            className='form-input'
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{
              marginLeft: '5px'
            }}
          // required
          />
        </label>
        {errors.price && <p>{errors.price}</p>}

        <hr />

        <h2>Liven up your spot with photos</h2>
        <h3>Submit a link to at least one photo to publish your spot.</h3>
        <div className='image-url-input'>
          <input
            placeholder='Preview Image URL'
            className='form-input'
            type="url"
            value={previewImgUrl}
            onChange={(e) => setPreviewImgUrl(e.target.value)}
          />
          <input
            placeholder='Image URL'
            className='form-input'
            type="url"
            value={img1Url}
            onChange={(e) => setImg1Url(e.target.value)}
          />
          <input
            placeholder='Image URL'
            className='form-input'
            type="url"
            value={img2Url}
            onChange={(e) => setImg2Url(e.target.value)}
          />
          <input
            placeholder='Image URL'
            className='form-input'
            type="url"
            value={img3Url}
            onChange={(e) => setImg3Url(e.target.value)}
          />
          <input
            placeholder='Image URL'
            className='form-input'
            type="url"
            value={img4Url}
            onChange={(e) => setImg4Url(e.target.value)}
          />
        </div>
        <hr />
        <div className='create-spot-button-section'>
          <button type="submit" id='create-spot-button'>Create Spot</button>
        </div>
      </form>
    </div>
  );
}

export default CreateSpotFormPage;

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { createSpot } from '../../store/spot';
import './CreateSpotForm.css'

function CreateSpotFormPage() {
  const dispatch = useDispatch();
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
  const [errors, setErrors] = useState({});


  // if (sessionUser) return <Navigate to="/spots/new" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sessionUser) {
      setErrors({});
      return dispatch(
        createSpot({
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price
        })
      )
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
    }
  };

  return (
    <div className='create-spot-container'>
      <h1 id='heading'>Create a new Spot</h1>
      <h2>Where's your place located?</h2>
      <h3>Guests will only get your exact address once they booked a reservation.</h3>
      <form onSubmit={handleSubmit} className='create-spot-form'>
        <label>Country
          <input
            placeholder='Country'
            className='form-input'
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
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
            required
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
            required
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
            required
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
            required
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
            required
          />
        </label>
        {errors.lng && <p>{errors.lng}</p>}

        <hr />

        <h2>Describe your place to guests</h2>
        <h3>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h3>
        <input
            placeholder='Please write at least 30 characters'
            className='form-input'
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
        />

        <hr />

        <h2>Create a title for your spot</h2>
        <h3>Catch guests' attention with a spot title that highlights what makes your place special.</h3>
        <input
            placeholder='Name of your spot'
            className='form-input'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />

        <hr />

        <h2>Set a base price for your spot</h2>
        <h3>Competitive pricing can help your listing stand out and rank higher in search results.</h3>
        <label> $
        <input
            placeholder='Price per night (USD)'
            className='form-input'
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
        />
        </label>

        <hr />

        <h2>Liven up your spot with photos</h2>
        <h3>Submit a link to at least one photo to publish your spot.</h3>
        {/* <input
            placeholder='Preview Image URL'
            className='form-input'
            type="url"
            value={}
            onChange={(e) => setName(e.target.value)}
            required
        /> */}

        <hr />


        <button type="submit" id='create-spot-button'>Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpotFormPage;

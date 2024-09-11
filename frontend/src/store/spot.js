import { csrfFetch } from './csrf';

// constant to avoid debugging typos
const LOAD_SPOTS = 'spot/load_spots';
const ADD_SPOT = 'spot/add_spot';
const ADD_IMAGE = 'spot/add_image';
const LOAD_DETAILS = 'spot/load_details';
const LOAD_REVIEWS = 'spot/load_reviews'

//regular action creator
const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots
  };
};

const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    spot
  }
};

const addImage = (image) => {
  return {
    type: ADD_IMAGE,
    image
  }
}

const loadDetails = (spotId) => {
  return {
    type: LOAD_DETAILS,
    spotId
  }
}

const loadReviews = (spotId) => {
  return {
    type: LOAD_REVIEWS,
    spotId
  }
}

// thunk action creator
export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
    return response;
  }
}

export const createSpot = (spot) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price } = spot;
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify({
      address, city, state, country, lat, lng, name, description, price
    })
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addSpot(data.spot));


    return data;
  }
}

export const postSpotImage = (image) => async(dispatch) => {
  const { spotId, url, preview } = image;
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    body: JSON.stringify({url, preview})
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addImage(data));
    return res;
  }
}

export const getSpotById = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(loadDetails(data));
    return data.SpotImages;
  }
}

export const getReviewsBySpotId = (spotId) => async(dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadReviews(data.Reviews));
    return res;
  }
}


// reducer
const initialState = {};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = {...state, Spots: action.spots};//could turn this into an object with each spot id as the key so lookup time is faster
      return newState;
    }
    case ADD_SPOT: {
      const newState = {...state, ...action.spot};
      return newState;
    }
    //might not need this one?
    // case ADD_IMAGE: {
    //   const newState = {...state, ...action.image};
    //   return newState;
    // }
    case LOAD_DETAILS: {
      const newState = {...state, ...action.spotId};//dont think this will do it but lets see
      return newState;
    }
    case LOAD_REVIEWS: {
      const newState = {...state, Reviews: action.spotId};
      return newState;
    }
    default:
      return state;
  }
};

export default spotReducer;

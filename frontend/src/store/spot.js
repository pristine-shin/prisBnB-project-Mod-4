import { csrfFetch } from './csrf';

// constant to avoid debugging typos
const LOAD_SPOTS = 'spot/load_spots';
const ADD_SPOT = 'spot/add_spot';
const LOAD_DETAILS = 'spot/load_details';
const ADD_IMAGE = 'spot/add_image';

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

const addImage = (spotId) => {
  return {
    type: ADD_IMAGE,
    spotId
  }
}

//I dont think i need this? i can get the id from the load spots
const loadDetails = (spotId) => {
  return {
    type: LOAD_DETAILS,
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
    return res;
  }
}

export const postSpotImage = (image) => async(dispatch) => {
  const { url, preview } = image;
  const res = await csrfFetch(`/api/${spotId}/images`, {
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
    return response;
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
      const newState = {...state, ...action.spot.spot};
      return newState;
    }
    case ADD_IMAGE: {
      const newState = {...state, }
    }
    case LOAD_DETAILS: {
      const newState = {...state, ...action.spotId};//dont think this will do it but lets see
      return newState;
    }
    default:
      return state;
  }
};

export default spotReducer;

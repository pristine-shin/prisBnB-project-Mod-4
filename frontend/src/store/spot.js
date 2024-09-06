import { csrfFetch } from './csrf';

// constant to avoid debugging typos
const LOAD_SPOTS = 'spot/load_spots';
const ADD_SPOT = 'spot/add_spot';

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
    dispatch(addSpot(data.Spot));
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
      const newState = {...state, ...action.spot.Spot};
      return newState;
    }
    default:
      return state;
  }
};

export default spotReducer;

import { csrfFetch } from './csrf';

// constant to avoid debugging typos
const LOAD_SPOTS = 'spot/load_spots'

//regular action creator
const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots
  };
};

// thunk action creator
export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');

  if (response.ok) {
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
    return response;
  }
}

// reducer
const initialState = {};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = {...state, Spots: action.spots};
      return newState;
    }
    default:
      return state;
  }
};

export default spotReducer;

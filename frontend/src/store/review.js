import { csrfFetch } from './csrf';

// constant to avoid debugging typos
const LOAD_REVIEWS = 'review/load_reviews';

//regular action creator
const loadReviews = (reviews) => {
    return {
      type: LOAD_REVIEWS,
      reviews
    };
  };

// thunk action creator
export const getReviewsBySpotId = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');

    if (response.ok) {
      const data = await response.json();
      dispatch(loadSpots(data.Spots));
      return response;
    }
  }

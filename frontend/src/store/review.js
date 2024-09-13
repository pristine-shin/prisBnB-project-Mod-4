import { csrfFetch } from './csrf';

// constant to avoid debugging typos
const ADD_REVIEW = 'review/add_review';
const REMOVE_REVIEW = 'review/remove_review'

//regular action creator
const addReview = (review) => {
  return {
    type: ADD_REVIEW,
    review
  };
};

export const removeReview = () => {
  return {
    type: REMOVE_REVIEW
  }
}

// thunk action creator
export const createReview = (spotId, newReview) => async (dispatch) => {
  const { review, stars } = newReview;
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ review, stars })
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data)
    dispatch(addReview(data));
    return data;
  }
}

export const deleteReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })

  if (res.ok) {
    const result = await res.json();
    dispatch(removeReview())
    return result;
  }
}
//reducer
const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_REVIEW: {
      const newReview = action.review;
      const newState = { ...state, ...newReview };
      return newState;
    }
    case REMOVE_REVIEW: {
      const newState = {...state};
      delete newState.review
      return newState;//test this it might mess up
    }
    default:
      return state;
  }
}

export default reviewReducer;

import { csrfFetch } from './csrf';

// constant to avoid debugging typos
const ADD_SESSION = 'session/add_session';
const REMOVE_SESSION = 'session/remove_session';

//regular action creator
const addSession = (user) => {
  return {
    type: ADD_SESSION,
    user
  };
};

const removeSession = () => {
  return {
    type: REMOVE_SESSION,
  }
}

// thunk action creator
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credential,
      password
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addSession(data.user));
    return response;
  }
}

// reducer
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SESSION: {
      const newState = {...state, user: action.user};
      return newState;
    }
    case REMOVE_SESSION: {
      return {...state, user: null }
    }
    default:
      return state;
  }
};

export default sessionReducer;

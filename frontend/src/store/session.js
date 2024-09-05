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

export const removeSession = () => {
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

export const logout = () => async (dispatch) => {
  const res = await csrfFetch('/api/session', {
    method: 'DELETE',
  });

  if (res.ok) {
    const result = await res.json();
    dispatch(removeSession())
    return result;
  }
}

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");

  if (response.ok) {
    const data = await response.json();
    dispatch(addSession(data.user));
    return response;
  }
  }

export const signUp = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password}),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addSession(data.user));
    return res;
  }
};

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

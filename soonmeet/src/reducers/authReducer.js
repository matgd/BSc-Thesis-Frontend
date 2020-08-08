import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
  isSignedIn: false,
  username: null,
  authToken: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        username: action.payload.username,
        authToken: action.payload.authToken
      };
    case SIGN_OUT:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

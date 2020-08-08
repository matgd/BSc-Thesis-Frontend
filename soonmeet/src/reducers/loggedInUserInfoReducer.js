import { GET_USER_INFO, SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
  id: null,
  username: null,
  first_name: null,
  last_name: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USER_INFO:
      return {
        ...state,
        ...action.payload
      };
    case SIGN_IN:
      return { ...state, username: action.payload.username };
    case SIGN_OUT:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

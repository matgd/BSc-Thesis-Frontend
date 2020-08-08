import {
  SEARCH_FOR_FRIENDS,
  SIGN_OUT
} from '../actions/types';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_FOR_FRIENDS:
      return [ ...action.payload ];
    case SIGN_OUT:
      return [ ...INITIAL_STATE ];
    default:
      return state;
  }
};

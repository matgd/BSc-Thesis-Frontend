import _ from 'lodash';
import {
  GET_PENDING_FRIEND_INVITES,
  ACCEPT_FRIEND_INVITATION,
  REJECT_FRIEND_INVITATION,
  DELETE_FROM_FRIEND_LIST,
  SIGN_OUT
} from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PENDING_FRIEND_INVITES:
      return { ...state, ...action.payload };
    case ACCEPT_FRIEND_INVITATION:
      return _.omit(state, action.payload.invitationId); // takes only ID
    case REJECT_FRIEND_INVITATION:
    case DELETE_FROM_FRIEND_LIST:
      return _.omit(state, action.payload); // takes only ID
    case SIGN_OUT:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

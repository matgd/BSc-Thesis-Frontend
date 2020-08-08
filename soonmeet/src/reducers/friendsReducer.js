import {
  LOAD_FRIEND_LIST,
  ACCEPT_FRIEND_INVITATION,
  REJECT_FRIEND_INVITATION,
  SIGN_OUT,
  DELETE_FROM_FRIEND_LIST
} from '../actions/types';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_FRIEND_LIST:
      return [...state, ...action.payload];
    case ACCEPT_FRIEND_INVITATION:
      return [
        ...state,
        {
          profile: action.payload.inviterId,
          username: action.payload.inviterUsername,
          first_name: action.payload.inviterFirstName,
          last_name: action.payload.inviterLastName,
          invitation: action.payload.invitationId
        }
      ];
    case REJECT_FRIEND_INVITATION:
    case DELETE_FROM_FRIEND_LIST:
      return state.filter(friend => friend.invitation !== action.payload); // id
    case SIGN_OUT:
      return [...INITIAL_STATE];
    default:
      return state;
  }
};

import {
  ACCEPT_MEETING_INVITATION, ADD_MEETING_INVITE_TO_CALENDAR,
  LOAD_MEETING_INVITES,
  REJECT_MEETING_INVITATION,
  SIGN_OUT
} from '../actions/types';
import { ACCEPTED, REJECTED } from '../const/attendanceStatus';

const INITIAL_STATE = {
  meta: { invites_loaded: false },
  pendingInvites: [],
  invites: {}
};

const patchInvite = (state, inviteId, attendanceStatus) => {
  let invitesCopy = { ...state.invites };
  Object.keys(invitesCopy).forEach(date => {
    invitesCopy[date].forEach(invite => {
      if (invite.id === inviteId) invite.attendance_status = attendanceStatus;
    });
  });

  return {
    ...state,
    pendingInvites: [...state.pendingInvites].filter(
      i => i.id !== inviteId
    ),
    invites: invitesCopy
  };
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_MEETING_INVITES:
      return {
        ...state,
        pendingInvites: [...action.payload.pendingInvites],
        invites: { ...action.payload.invites },
        meta: { invites_loaded: true }
      };
    case ADD_MEETING_INVITE_TO_CALENDAR:
      let newInvites = { ...state.invites };
      Object.keys(action.payload.invites).forEach(date => {
        if (newInvites[date] === undefined) {
          newInvites[date] = [];
        }
        newInvites[date] = newInvites[date].concat(action.payload.invites[date]);
      });

      return {
        ...state,
        pendingInvites: state.pendingInvites.concat(action.payload.pendingInvites),
        invites: newInvites
      };
    case REJECT_MEETING_INVITATION:
      return patchInvite(state, action.payload, REJECTED);
    case ACCEPT_MEETING_INVITATION:
      return patchInvite(state, action.payload, ACCEPTED);
    case SIGN_OUT:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

import { combineReducers } from 'redux';

import authReducer from './authReducer';
import loggedInUserInfoReducer from './loggedInUserInfoReducer';
import friendsReducer from './friendsReducer';
import friendInvitesReducer from './friendInvitesReducer';
import calendarReducer from './calendarReducer';
import calendarEventsReducer from './calendarEventsReducer';
import friendsSearchReducer from './friendsSearchReducer';
import meetingInvitesReducer from './meetingInvitesReducer';

export default combineReducers({
  authReducer,
  loggedInUserInfoReducer,
  friendsReducer,
  friendInvitesReducer,
  calendarReducer,
  calendarEventsReducer,
  friendsSearchReducer,
  meetingInvitesReducer
});
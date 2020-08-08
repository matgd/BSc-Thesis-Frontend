import {
  CALENDAR_NEXT_WEEK,
  CALENDAR_PREVIOUS_WEEK,
  CALENDAR_CURRENT_WEEK,
  CALENDAR_SELECTED_DAY_WEEK,
  SIGN_OUT
} from '../actions/types';
import startOfWeek from 'date-fns/startOfWeek';

let weekStartDay = startOfWeek(new Date(Date.today()), { weekStartsOn: 1 });
const INITIAL_STATE = {
  today: Date.today().toJSON(),
  monday: weekStartDay.toJSON(),
  tuesday: weekStartDay.tuesday().toJSON(),
  wednesday: weekStartDay.wednesday().toJSON(),
  thursday: weekStartDay.thursday().toJSON(),
  friday: weekStartDay.friday().toJSON(),
  saturday: weekStartDay.saturday().toJSON(),
  sunday: weekStartDay.sunday().toJSON()
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CALENDAR_NEXT_WEEK:
      return {
        ...state,
        monday: new Date(state.monday).next().monday().toJSON(),
        tuesday: new Date(state.tuesday).next().tuesday().toJSON(),
        wednesday: new Date(state.wednesday).next().wednesday().toJSON(),
        thursday: new Date(state.thursday).next().thursday().toJSON(),
        friday: new Date(state.friday).next().friday().toJSON(),
        saturday: new Date(state.saturday).next().saturday().toJSON(),
        sunday: new Date(state.sunday).next().sunday().toJSON()
      };
    case CALENDAR_PREVIOUS_WEEK:
      return {
        ...state,
        monday: new Date(state.monday).previous().monday().toJSON(),
        tuesday: new Date(state.tuesday).previous().tuesday().toJSON(),
        wednesday: new Date(state.wednesday).previous().wednesday().toJSON(),
        thursday: new Date(state.thursday).previous().thursday().toJSON(),
        friday: new Date(state.friday).previous().friday().toJSON(),
        saturday: new Date(state.saturday).previous().saturday().toJSON(),
        sunday: new Date(state.sunday).previous().sunday().toJSON()
      };
    case CALENDAR_SELECTED_DAY_WEEK:
      return { ...state, ...action.payload };
    case CALENDAR_CURRENT_WEEK:
    case SIGN_OUT:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

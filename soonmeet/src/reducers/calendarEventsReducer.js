import {
  CLEAR_CALENDAR_EVENT_STORE,
  CREATE_CALENDAR_EVENT,
  LOAD_CALENDAR_EVENTS,
  SIGN_OUT
} from '../actions/types';

const INITIAL_STATE = { loaded: false };

// const moveCyclicEvents = (stateCopy, dayOffset) => {
//   /*
//   MOVES EVENT FORWARD ONE WEEK AHEAD WHEN COMING FROM PREVIOUS WEEK TO NEXT -
//   - COMING FROM WEEK BEFORE FIRST APPEARANCE OF THE EVENT WILL MOVE WEEK FORWARD
//   BY ONE WEEK FROM CURRENT VIEW
//    */
//   stateCopy = _.omit(stateCopy, 'loaded');
//   Object.keys(stateCopy).forEach(date => {
//     stateCopy[date].forEach((event, index) => {
//       if (event.event_date__frequency === WEEKLY) {
//         let startDate = new Date(event.event_date__start_date);
//         let endDate = new Date(event.event_date__end_date);
//         if (startDate.addDays(dayOffset) >= new Date(event.actual_start_date)) {
//           stateCopy[date].splice(index, 1);
//           if (stateCopy[startDate] === undefined) {
//             stateCopy[startDate.toDateString()] = [];
//           }
//           event.event_date__start_date = startDate.toJSON();
//           event.event_date__end_date = endDate.toJSON();
//           stateCopy[startDate.toDateString()].push(event);
//         }
//       }
//     });
//   });
//   return stateCopy;
// };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_CALENDAR_EVENTS:
      return {
        ...state,
        ...action.payload,
        loaded: true
      };
    case CREATE_CALENDAR_EVENT:
      let newState = { ...state };
      Object.keys(action.payload).forEach(dateKey => {
        if (newState[dateKey] === undefined) {
          newState[dateKey] = [];
        }
        action.payload[dateKey].forEach(event => {
          newState[dateKey].push(event);
        });
        newState[dateKey].sort((a, b) => {
          let _a = new Date(a.event_date__start_date);
          let _b = new Date(b.event_date__start_date);
          return +_a - +_b;
        });
      });
      return newState;
    case CLEAR_CALENDAR_EVENT_STORE:
      let startDate = new Date(action.payload.start);
      startDate.setHours(0, 0, 0, 0);
      let endDate = new Date(action.payload.end);
      endDate.setHours(0, 0, 0, 0);
      for (
        let infPrevent = 0;
        infPrevent < 14 && startDate <= endDate;
        infPrevent++
      ) {
        state[startDate.toDateString()] = state[
          startDate.toDateString()
        ].filter(event => event.id !== action.payload.eventId);
        startDate.addDays(1);
      }
      return { ...state };
    case SIGN_OUT:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

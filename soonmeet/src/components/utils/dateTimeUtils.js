import endOfDay from 'date-fns/endOfDay';

/**
 * Get time of start and end in format "hh:mm - hh:mm".
 * @param startDate
 * @param endDate
 * @returns {string}
 */
export const timeStartEndString = (startDate, endDate) => {
  return `${startDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })} - ${endDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

/**
 * Get minutes of differences between two dates.
 * @param startDate
 * @param endDate
 * @returns {number}
 */
export const timeMinuteDifference = (startDate, endDate) => {
  return Math.ceil((endDate - startDate) / 1000 / 60);
};

/**
 * Get minutes of date counting from midnight.
 * @param date
 * @returns {number}
 */
export const minutesElapsedFromMidnight = date => {
  return date.getHours() * 60 + date.getMinutes();
};

/**
 * If event takes place in more than one day, split it to smaller one-day events.
 * @param event
 * @returns {[]}
 */
export const splitEventToDays = event => {
  let end = new Date(event.event_date__end_date);
  let endDay = new Date(event.event_date__end_date);
  endDay.setHours(0, 0, 0, 0);

  let splitEvent = [];
  let startPassing = new Date(event.event_date__start_date);
  let startPassingDay = new Date(event.event_date__start_date);
  startPassingDay.setHours(0, 0, 0, 0);

  let i = 0; // prevent infinite loop
  while (startPassingDay <= endDay && i < 14) {
    if (+startPassingDay === +endDay) {
      // unary to convert to int
      splitEvent.push({
        ...event,
        event_date__start_date: startPassing.toJSON(),
        event_date__end_date: end.toJSON()
      });
      startPassingDay.day();
    } else {
      splitEvent.push({
        ...event,
        event_date__start_date: startPassing.toJSON(),
        event_date__end_date: endOfDay(startPassing).toJSON()
      });
      startPassing.day().setHours(0, 0, 0, 0);
      startPassingDay.day();
    }
    i++;
  }
  return splitEvent;
};

/**
 * Return true if dates are overlapping else false.
 * @param startDateA
 * @param endDateA
 * @param startDateB
 * @param endDateB
 * @returns {boolean}
 */
export const datesAreOverlapping = (
  startDateA,
  endDateA,
  startDateB,
  endDateB
) => {
  let [startA, endA] = [new Date(startDateA), new Date(endDateA)];
  let [startB, endB] = [new Date(startDateB), new Date(endDateB)];

  return startA < endB && endA > startB;
};

/**
 * propsStart and propsEnd are taken from view, so time between cannot exceed 24 hours.
 * To determine real start and end of an event, Redux store is being searched.
 * @returns {[Date, Date]}
 */
export const determineActualStartEnd = (
  propsStart,
  propsEvents,
  propsEnd,
  propsId
) => {
  let givenStart = new Date(propsStart);

  for (
    let preventInf = 0;
    givenStart.getHours() === 0 &&
    givenStart.getMinutes() === 0 &&
    preventInf < 15;
    preventInf++
  ) {
    givenStart.addDays(-1);
    if (propsEvents[givenStart.toDateString()] !== undefined) {
      let eventList = propsEvents[givenStart.toDateString()].filter(
        event => event.id === propsId
      );
      if (eventList[0] !== undefined) {
        givenStart.setTime(
          new Date(eventList[0].event_date__start_date).getTime()
        );
      } else {
        givenStart.addDays(1);
        break;
      }
    } else {
      givenStart.addDays(1);
      break;
    }
  }

  let givenEnd = new Date(propsEnd);
  for (
    let preventInf = 0;
    givenEnd.getMilliseconds() === 999 && preventInf < 15;
    preventInf++
  ) {
    givenEnd.addDays(1);
    if (propsEvents[givenEnd.toDateString()] !== undefined) {
      let eventList = propsEvents[givenEnd.toDateString()].filter(
        event => event.id === propsId
      );
      if (eventList[0] !== undefined) {
        givenEnd.setTime(new Date(eventList[0].event_date__end_date).getTime());
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return [givenStart, givenEnd];
};

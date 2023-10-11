import { isDefined } from './guards';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DateTime {

  /***
   * Determine if the given date is between in the range
   * of start and end date.
   * @param {Date} date
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {boolean} true if the date is between, otherwise false.
   */
  export const isBetween = (date: Date, startDate: Date, endDate: Date): boolean => {
	const startDateMs = new Date(startDate).getTime();
	const endDateMs = new Date(endDate).getTime();
	const dateMs = date.getTime();

	return dateMs > startDateMs && dateMs < endDateMs;
  };

  /***
   * Check if the date is the same as the other date.
   * If both are null, they are the same.
   * If either one of them is null, they are not the same.
   * Otherwise, the dates will be checked.
   * @param {Date | null} date
   * @param {Date | null} date2
   * @returns {boolean} true if dates are same, otherwise false.
   */
  export const isSame = (date: Date | null, date2: Date | null): boolean => {
	if (!isDefined(date) && !isDefined(date2)) {
	  return true;
	}

	if (!isDefined(date) || !isDefined(date2)) {
	  return false;
	}

	const dateMs = new Date(date).getTime();
	const date2Ms = new Date(date2).getTime();

	return dateMs === date2Ms;
  };

  /***
   * Determines if the given date range 1 is within
   * date range 2.
   * @param {Date} date1Start
   * @param {Date} date1End
   * @param {Date} date2Start
   * @param {Date} date2End
   * @returns {boolean} true if range is within, otherwise false.
   */
  export const isRangeWithinAnother = (
	date1Start: Date,
	date1End: Date,
	date2Start: Date,
	date2End: Date
  ): boolean => {
	const date1StartMs = new Date(date1Start).getTime();
	const date1EndMs = new Date(date1End).getTime();
	const date2StartMs = new Date(date2Start).getTime();
	const date2EndMs = new Date(date2End).getTime();
	return date1StartMs >= date2StartMs && date1EndMs <= date2EndMs;
  };

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Day {

	/***
	 * Return the date from today.
	 * @returns {Date}
	 */
	export const today = (): Date => {
	  const date = new Date();
	  date.setHours(0, 0, 0, 0);
	  return date;
	};

	/***
	 * Return a Date with the next day from today.
	 * @returns {Date}
	 */
	export const next = (): Date => {
	  const date = today();
	  const dayAhead = date.getDate() + 1;
	  date.setDate(dayAhead);
	  return date;
	};

	/***
	 * Return a Date with the day before from today.
	 * @returns {Date}
	 */
	export const before = (): Date => {
	  const date = today();
	  const dayBefore = date.getDate() - 1;
	  date.setDate(dayBefore);
	  return date;
	};

	/***
	 * Checks whether the given date day is before the given start date day.
	 * @param {Date | null} date
	 * @param {Date} startDate
	 * @returns {boolean} true if the day is before the given one, otherwise false.
	 */
	export const isBefore = (date: Date | null, startDate: Date): boolean => {
	  const copyDate = isDefined(date) ? new Date(date) : new Date();
	  const copyStartDate = new Date(startDate);
	  const givenDay = new Date(copyDate.getFullYear(), copyDate.getMonth(), copyDate.getDate());
	  const startDay = new Date(copyStartDate.getFullYear(), copyStartDate.getMonth(), copyStartDate.getDate());
	  return givenDay < startDay;
	};

	/***
	 * Checks whether the given date day is same or after the given start date day.
	 * @param {Date | null} date
	 * @param startDate
	 * @returns {boolean} true if the day is same or after the given one, otherwise false.
	 */
	export const isSameOrAfter = (date: Date | null, startDate: Date): boolean => {
	  const copyDate = isDefined(date) ? new Date(date) : new Date();
	  const copyStartDate = new Date(startDate);
	  const givenDay = new Date(copyDate.getFullYear(), copyDate.getMonth(), copyDate.getDate());
	  const startDay = new Date(copyStartDate.getFullYear(), copyStartDate.getMonth(), copyStartDate.getDate());
	  return givenDay >= startDay;
	};

	/***
	 * Checks whether the given date is same or before the given start day.
	 * @param {Date | null} date
	 * @param {Date} startDate
	 * @returns {boolean} true if the day is same or before the given one, otherwise false.
	 */
	export const isSameOrBefore = (date: Date | null, startDate: Date): boolean => {
	  const copyDate = isDefined(date) ? new Date(date) : new Date();
	  const copyStartDate = new Date(startDate);
	  const givenDay = new Date(copyDate.getFullYear(), copyDate.getMonth(), copyDate.getDate());
	  const startDay = new Date(copyStartDate.getFullYear(), copyStartDate.getMonth(), copyStartDate.getDate());
	  return givenDay <= startDay;
	};

	/***
	 * Calculates the difference of days between the two given dates
	 * @param {Date | null} date
	 * @param {Date} startDate
	 * @returns {number} difference of days between two dates
	 */
	export const difference = (date: Date | null, startDate: Date): number => {
	  const copyDate = isDefined(date) ? new Date(date) : new Date();
	  const copyStartDate = new Date(startDate);

	  const differenceTime = copyDate.getTime() - copyStartDate.getTime();
	  return Math.round(differenceTime / (1000 * 3600 * 24));
	};

	/***
	 * Determines the weekdays between two dates.
	 * @param {Date | null} date
	 * @param {Date} startDate
	 * @returns {number[]} the days as number from the given period of two dates.
	 */
	export const weekdays = (date: Date | null, startDate: Date): number[] => {
	  const copyDate = isDefined(date) ? new Date(date) : new Date();
	  const copyStartDate = new Date(startDate);

	  const weekdays: number[] = [];
	  const curDate = new Date(copyStartDate.getTime());
	  while (curDate <= copyDate) {
		weekdays.push(curDate.getDay());
		curDate.setDate(curDate.getDate() + 1);
	  }
	  return weekdays;
	};

  }
}

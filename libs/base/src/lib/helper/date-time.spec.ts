import { DateTime } from './date-time';

describe('Date time helper functions', () => {

    describe('DateTime functions', () => {
        it('isBetween - should match date between', () => {
            const date = new Date('August 19, 1994 23:15:30');
            const startDate = new Date('August 01, 1994 23:15:30');
            const endDate = new Date('August 25, 1994 23:15:30');

            const isBetween = DateTime.isBetween(date, startDate, endDate);

            expect(isBetween).toBeTruthy();
        });

        it('isBetween - should not match date between', () => {
            const date = new Date('June 03, 1994 23:15:30');
            const startDate = new Date('August 01, 1994 23:15:30');
            const endDate = new Date('August 25, 1994 23:15:30');

            const isBetween = DateTime.isBetween(date, startDate, endDate);

            expect(isBetween).toBeFalsy();
        });

        it('isSame - should match date', () => {
            const date = new Date('August 19, 1994 23:15:30');
            const date2 = new Date('August 19, 1994 23:15:30');

            const isSame = DateTime.isSame(date, date2);

            expect(isSame).toBeTruthy();

            expect(DateTime.isSame(null, null)).toBeTruthy();
        });

        it('isSame - should not match date', () => {
            const date = new Date('August 19, 1994 23:15:30');
            const date2 = new Date('August 20, 1994 23:15:30');

            const isSame = DateTime.isSame(date, date2);

            expect(isSame).toBeFalsy();
            expect(DateTime.isSame(date, null)).toBeFalsy();
        });

        it('isRangeWithinAnother - should be in range', () => {
            const date1 = new Date('August 01, 1994 23:15:30');
            const dateEnd1 = new Date('August 19, 1994 23:15:30');
            const date2 = new Date('August 01, 1994 23:15:30');
            const dateEnd2 = new Date('August 28, 1994 23:15:30');

            const isInRange = DateTime.isRangeWithinAnother(date1, dateEnd1, date2, dateEnd2);

            expect(isInRange).toBeTruthy();
        });

        it('isRangeWithinAnother - should not be in range', () => {
            const date1 = new Date('August 01, 1994 23:15:30');
            const dateEnd1 = new Date('September 19, 1994 23:15:30');
            const date2 = new Date('August 01, 1994 23:15:30');
            const dateEnd2 = new Date('August 28, 1994 23:15:30');

            const isInRange = DateTime.isRangeWithinAnother(date1, dateEnd1, date2, dateEnd2);

            expect(isInRange).toBeFalsy();
        });
    });

    describe('Day functions', () => {

        it('should return next day', () => {
            const today = new Date();
            const tomorrow = new Date(new Date().setDate(today.getDate() + 1));

            const nextDay = DateTime.Day.next();

            expect(nextDay.toDateString()).toEqual(tomorrow.toDateString());
        });

        it('should return day before', () => {
            const today = new Date();
            const dayBefore = new Date(new Date().setDate(today.getDate() - 1));

            const nextDay = DateTime.Day.before();

            expect(nextDay.toDateString()).toEqual(dayBefore.toDateString());
        });

        it('should return true for the day before', () => {
            const today = new Date();
            const dayBefore = new Date(new Date().setDate(today.getDate() - 1));

            const isBefore = DateTime.Day.isBefore(dayBefore, today);

            expect(isBefore).toBeTruthy();
        });

        it('should return false for the day before', () => {
            const today = new Date();
            const daysAhead = new Date(new Date().setDate(today.getDate() + 6));

            const isBefore = DateTime.Day.isBefore(daysAhead, today);

            expect(isBefore).toBeFalsy();
        });

        it('should return true for the same day', () => {
            const today = new Date();

            const isBefore = DateTime.Day.isSameOrAfter(today, today);

            expect(isBefore).toBeTruthy();
        });

        it('should return true for the day after', () => {
            const today = new Date();
            const daysAhead = new Date(new Date().setDate(today.getDate() + 6));

            const isBefore = DateTime.Day.isSameOrAfter(daysAhead, today);

            expect(isBefore).toBeTruthy();
        });

        it('should return false for the day before', () => {
            const today = new Date();
            const dayBefore = new Date(new Date().setDate(today.getDate() - 1));

            const isBefore = DateTime.Day.isSameOrAfter(dayBefore, today);

            expect(isBefore).toBeFalsy();
        });

        it('should return true for the day before', () => {
            const today = new Date();
            const dayBefore = new Date(new Date().setDate(today.getDate() - 1));

            const isBefore = DateTime.Day.isSameOrBefore(dayBefore, today);

            expect(isBefore).toBeTruthy();
        });

        it('should return true for the day before', () => {
            const today = new Date();
            const dayBefore = new Date(new Date().setDate(today.getDate() - 1));

            const isBefore = DateTime.Day.isSameOrBefore(dayBefore, today);

            expect(isBefore).toBeTruthy();
        });

        it('should return true for the day before', () => {
            const today = new Date();
            const dayBefore = new Date(new Date().setDate(today.getDate() - 1));

            const isBefore = DateTime.Day.isSameOrBefore(dayBefore, today);

            expect(isBefore).toBeTruthy();
        });

        it('should return true for the same day', () => {
            const today = new Date();

            const isBefore = DateTime.Day.isSameOrBefore(today, today);

            expect(isBefore).toBeTruthy();
        });

        it('should return the exact difference of days', () => {
            const kDifferenceOfDays = 6;

            const today = new Date();
            const daysAhead = new Date(new Date().setDate(today.getDate() + kDifferenceOfDays));

            const differenceOfDays = Math.round(DateTime.Day.difference(daysAhead, today));

            expect(differenceOfDays).toBe(kDifferenceOfDays);
        });

        it('should return the exact difference of days for negative numbers', () => {
            const kDifferenceOfDays = 6;

            const today = new Date();
            const daysBefore = new Date(new Date().setDate(today.getDate() - kDifferenceOfDays));

            const differenceOfDays = DateTime.Day.difference(daysBefore, today);

            expect(differenceOfDays).toBe(-kDifferenceOfDays);
        });

        it('should return amount of weekdays between two dates', () => {
            const kDifferenceOfDays = 6;

            const today = new Date();
            const daysAhead = new Date(new Date().setDate(today.getDate() + kDifferenceOfDays));

            const weekdays = DateTime.Day.weekdays(daysAhead, today);

            expect(weekdays.length).toBe(kDifferenceOfDays + 1);
        });

    });

});

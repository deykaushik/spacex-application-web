import { DaySelectionTextPipe } from './day-selection-text.pipe';

describe('DaySelectionTextPipe', () => {
   it('create an instance', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe).toBeTruthy();
   });
   it('should return day selection text for the day', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('26', '05/05/2018', '05/30/2018', false)).toBe('The 26th of every month');
   });
   it('should return day selection text for the day with autopay term true', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('26', '05/05/2018', '05/30/2018', true)).toBe('The 26th of every month');
   });
   it('should return empty if there is no value', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('', '05/05/2018', '05/30/2018', false)).toBe('');
   });
   it('should return day selection text for the due day where due day is equal to 1', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('1', '05/6/2018', '06/1/2018', false)).toBe('The due date of every month');
   });
   it('should return day selection text for the due day-1 where due day is equal to 1', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('31', '05/6/2018', '06/1/2018', false)).toBe('24 days after statement date');
   });
   it('should return day selection text for the due day where due day is equal to 2', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('2', '05/6/2018', '06/2/2018', false)).toBe('The due date of every month');
   });
   it('should return day selection text for the due day', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('30', '05/5/2018', '05/30/2018', false)).toBe('The due date of every month');
   });
   it('should return day selection text for the due day-1', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('29', '05/5/2018', '05/30/2018', false)).toBe('24 days after statement date');
   });
   it('should return day selection text for the due day-2', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('28', '05/5/2018', '05/30/2018', false)).toBe('23 days after statement date');
   });
   it('should return day selection text for the due day-2 where due day is equal to 1', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('30', '05/6/2018', '06/1/2018', false)).toBe('23 days after statement date');
   });
   it('should return day selection text for the due day-1 where due day is equal to 2', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('1', '05/6/2018', '06/2/2018', false)).toBe('24 days after statement date');
   });
   it('should return day selection text for the due day-2 where due day is equal to 2', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('31', '05/6/2018', '06/2/2018', false)).toBe('23 days after statement date');
   });
   it('should return valid day', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('31', '05/27/2018', '05/14/2018', false)).toBe('The 31st of every month');
   });
   it('should return invalid day', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('15', '05/27/2018', '06/14/2018', false)).toBe('');
   });
   it('should return invalid day when min date less than max date', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('4', '05/05/2018', '05/27/2018', false)).toBe('');
   });
   it('should return Payment due date', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('27', '05/05/2018', '05/27/2018', false)).toBe('The due date of every month');
   });
   it('should return day with suffix st', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('21', '05/05/2018', '05/27/2018', false)).toBe('The 21st of every month');
   });
   it('should return day with suffix nd', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('22', '05/05/2018', '05/27/2018', false)).toBe('The 22nd of every month');
   });
   it('should return day with suffix st', () => {
      const pipe = new DaySelectionTextPipe();
      expect(pipe.transform('23', '05/05/2018', '05/27/2018', false)).toBe('The 23rd of every month');
   });
});

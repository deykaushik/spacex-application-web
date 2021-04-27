import { DatePipe } from '@angular/common';
import { LocaleDatePipe } from './locale-date.pipe';
import { Constants } from './../../core/utils/constants';

describe('LocaleDatePipe', () => {
   const pipe = new LocaleDatePipe();
   const datePipe = new DatePipe('en-us');

   it('create an instance', () => {
      expect(pipe).toBeTruthy();
   });

   it('format invalid date to browser compatible date format', () => {
      expect(datePipe.transform(pipe.transform('2017-09-28 02:00:00 AM'), Constants.formats.ddMMYYYY)).toBe('28/09/2017');
   });
});

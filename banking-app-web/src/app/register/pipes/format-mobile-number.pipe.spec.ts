import { FormatMobileNumberPipe } from './format-mobile-number.pipe';

describe('Pipe: Default', () => {
   let pipe: FormatMobileNumberPipe;

   beforeEach(() => {
      pipe = new FormatMobileNumberPipe();
   });

   it('should hanle empty input parameter', () => {
      expect(pipe.transform('')).toBeFalsy();
   });

   it('should convert number', () => {
      expect(pipe.transform('0823457645')).toBe('***' + String.fromCharCode(160) + '***' + String.fromCharCode(160) + '7645' );
   });


});

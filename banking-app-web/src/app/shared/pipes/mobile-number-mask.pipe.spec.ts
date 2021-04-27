import { MobileNumberMaskPipe } from './mobile-number-mask.pipe';

describe('MobileNumberMaskPipe', () => {
   let pipe;
   beforeEach(() => {
      pipe = new MobileNumberMaskPipe();
   });
   it('create an instance', () => {
      expect(pipe).toBeTruthy();
   });
   it('should mask mobile number', () => {
      const transformedResult = pipe.transform('9232332424', 3);
      expect(transformedResult).toBe('*** ***2424');
   });
   it('should handle empty mobile number', () => {
      const transformedResult = pipe.transform('');
      expect(transformedResult).toBe('');
   });
});

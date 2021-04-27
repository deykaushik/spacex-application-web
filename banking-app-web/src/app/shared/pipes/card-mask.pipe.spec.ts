import { CardMaskPipe } from './card-mask.pipe';

describe('CardMaskPipe', () => {
   it('create an instance', () => {
      const pipe = new CardMaskPipe();
      expect(pipe).toBeTruthy();
   });

   it('should mask the card number with center digits', () => {
      const pipe = new CardMaskPipe();
      expect(pipe.transform('1234 5678 9010', 4, 4)).toBe('1234 **** 9010');
   });

   it('should mask the card number with ignoring first digits spaces', () => {
      const pipe = new CardMaskPipe();
      const masked = pipe.transform('123 4 567 8 9010', 4, 4);
      expect(masked).toBe('123 4 *** * 9010');
   });

   it('should mask the card number with ignoring last digits spaces', () => {
      const pipe = new CardMaskPipe();
      const masked = pipe.transform('1234 567 89 010', 4, 4);
      expect(masked).toBe('1234 *** *9 010');
   });

   it('should mask the card number with ignoring first/last digits spaces', () => {
      const pipe = new CardMaskPipe();
      const masked = pipe.transform('123 4 567 89 010', 4, 4);
      expect(masked).toBe('123 4 *** *9 010');
   });
});

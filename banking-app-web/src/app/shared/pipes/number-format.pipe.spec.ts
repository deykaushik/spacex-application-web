import { NumberFormatPipe } from './number-format.pipe';

describe('NumberFormatPipe', () => {
   let pipe: NumberFormatPipe;

   beforeEach(() => {
      pipe = new NumberFormatPipe();
   });
   it('create an instance', () => {
      expect(pipe).toBeTruthy();
   });
   it('format number', () => {
      expect(pipe.transform('34567', 4)).toBe('*4567');
   });
   it('format number with exact digits', () => {
      expect(pipe.transform('4567', 4)).toBe('4567');
   });
   it('format null number', () => {
      expect(pipe.transform('', 4)).toBe('');
   });
   it('format number with alphabets', () => {
      expect(pipe.transform('abc123', 4)).toBe('**c123');
   });
});

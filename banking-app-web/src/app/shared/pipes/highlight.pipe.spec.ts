import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
   const cssClass = 'highlight';
   let pipe: HighlightPipe;

   beforeEach(() => {
      pipe = new HighlightPipe();
   });

   it('create an instance', () => {
      expect(pipe).toBeTruthy();
   });

   it('should return the html with highlighted text embedded', () => {
      const transformedResult = pipe.transform('NEDBANK', 'NED', cssClass);
      expect(transformedResult).toBe('<span class="highlight">NED</span>BANK');
      expect(transformedResult.indexOf(cssClass)).toBeGreaterThan(-1);
   });

   it('should return the text, because query does not match', () => {
      const transformedResult = pipe.transform('NEDBANK', 'ABC', 'highlight');
      expect(transformedResult).toBe('NEDBANK');
      expect(transformedResult.indexOf(cssClass)).toBe(-1);
   });

   it('should return the text, because no query passed', () => {
      const transformedResult = pipe.transform('NEDBANK', null, 'highlight');
      expect(transformedResult).toBe('NEDBANK');
      expect(transformedResult.indexOf(cssClass)).toBe(-1);
   });
});

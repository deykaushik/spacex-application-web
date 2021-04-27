import { SkeletonLoaderPipe } from './skeleton-loader.pipe';

describe('SkeletonLoaderPipe', () => {
   const cssClass = 'skeleton-screen';
   let pipe: SkeletonLoaderPipe;

   beforeEach(() => {
      pipe = new SkeletonLoaderPipe();
   });

   it('create an instance', () => {
      expect(pipe).toBeTruthy();
   });
   it('should return the html with skeleton-screen css embedded', () => {
      const transformedResult = pipe.transform('NEDBANK', true, cssClass);
      expect(transformedResult).toBe('<span class="skeleton-screen"></span>');
      expect(transformedResult.indexOf(cssClass)).toBeGreaterThan(-1);
   });
   it('should return the html with skeleton-screen css embedded', () => {
      const transformedResult = pipe.transform('NEDBANK', true);
      expect(transformedResult).toBe('<span class="skeleton-screen"></span>');
      expect(transformedResult.indexOf(cssClass)).toBeGreaterThan(-1);
   });
   it('should return the text, because query does not match', () => {
      const transformedResult = pipe.transform('NEDBANK', false, 'skeleton-screen');
      expect(transformedResult).toBe('NEDBANK');
      expect(transformedResult.indexOf(cssClass)).toBe(-1);
   });

   it('should return the text, because no query passed', () => {
      const transformedResult = pipe.transform('NEDBANK', null, 'skeleton-screen');
      expect(transformedResult).toBe('NEDBANK');
      expect(transformedResult.indexOf(cssClass)).toBe(-1);
   });
});

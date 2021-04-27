
import { EmailMaskPipe } from './email-mask.pipe';

describe('EmailMaskPipe', () => {
   it('create an instance', () => {
      const pipe = new EmailMaskPipe();
      expect(pipe).toBeTruthy();
   });

   it('should check for no email', () => {
      const pipe = new EmailMaskPipe();
      expect(pipe.transform('test')).toBe('');
   });

   it('should mask the email with one char', () => {
      const pipe = new EmailMaskPipe();
      expect(pipe.transform('t@nedbank.com')).toBe('t@***.com');
   });

   it('should mask the email with two char', () => {
      const pipe = new EmailMaskPipe();
      expect(pipe.transform('ta@nedbank.com')).toBe('t***@***.com');
   });

   it('should mask the  number with center digits', () => {
      const pipe = new EmailMaskPipe();
      expect(pipe.transform('test@nedbank.com')).toBe('te***@***.com');
   });

   it('should mask the card number with ignoring last digits spaces', () => {
      const pipe = new EmailMaskPipe();
      const masked = pipe.transform('');
      expect(masked).toBe('');
   });
});

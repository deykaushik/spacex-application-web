import { AmountTransformPipe } from './amount-transform.pipe';
import { Constants } from './../../core/utils/constants';

describe('Pipe: Default', () => {
   let pipe: AmountTransformPipe;

   beforeEach(() => {
      pipe = new AmountTransformPipe();
   });
   it('format amount', () => {
      expect(pipe.transform('34567')).toBe('R34 567');
   });
   it('format amount with decimal', () => {
      expect(pipe.transform('123345.67')).toBe('R123 345.67');
   });
   it('format 0 amount', () => {
      expect(pipe.transform('0')).toBe('R');
   });
   it('format null amount', () => {
      expect(pipe.transform(null)).toBe('R');
   });
   it('format empty amount', () => {
      expect(pipe.transform('')).toBe('R');
   });
   it('format undefined amount', () => {
      expect(pipe.transform(undefined)).toBe('R');
   });
   it('format 0.0 amount', () => {
      expect(pipe.transform('0.0')).toBe('R0.0');
   });

   it('parse R32445 amount', () => {
      expect(pipe.parse('R32 445')).toBe('32445');
   });
   it('parse R324.45 amount', () => {
      expect(pipe.parse('R324.45')).toBe('324.45');
   });
   it('parse R1 232 445.56 amount', () => {
      expect(pipe.parse('R1 232 445.56')).toBe('1232445.56');
   });
   it('parse R0 amount', () => {
      expect(pipe.parse('R0')).toBe('0');
   });
   it('parse R1.0 amount', () => {
      expect(pipe.parse('R1.0')).toBe('1');
   });
   it('parse R100.00 amount', () => {
      expect(pipe.parse('R100.00')).toBe('100');
   });
   it('parse R.10 amount', () => {
      expect(pipe.parse('R.10')).toBe('.10');
   });
   it('parse R1.11 amount', () => {
      expect(pipe.parse('R1.10')).toBe('1.10');
   });
   it('parse empty amount', () => {
      expect(pipe.parse('')).toBe('0');
   });
   it('format non decimal amount', () => {
      const config = {
         noDecimal: true
      };
      expect(pipe.transform('999.99', config)).toBe('R999');
   });
   it('should format null amount as label', () => {
      expect(pipe.transform(null, Constants.amountPipeSettings.amountWithLabel)).toBe('R0.00');
   });
   it('should format null amount as label', () => {
      const amountWithSign = {
         showSign: true
      };
      expect(pipe.transform('-100', amountWithSign)).toBe('- R100');
   });
   it('should format amount with sign', () => {
      expect(pipe.transform('-100', Constants.amountPipeSettings.amountWithLabelAndSign)).toBe('- R100.00');
   });
   it('should format decimal NaN number', () => {
      const config = {
         noDecimal: true
      };
      expect(pipe.transform('.', config)).toBe('R');
   });
   it('prefix GB currecny', () =>  {
      expect(pipe.transform('100', '', Constants.labels.gbtype)).toBe('GB100');
   });
   it('prefix GB currency with sign', () => {
      expect(pipe.transform('-100', Constants.amountPipeSettings.amountWithLabelAndSign, 'GB')).toBe('- GB100.00');
   });
   it('prefix GB currecny with zero for explicit Null as 0 flag', () =>  {
   expect(pipe.transform('', '', Constants.labels.gbtype, true)).toBe('GB0');
   });
   it('prefix GB currecny with space', () =>  {
      expect(pipe.transform('3810', Constants.amountPipeSettings.amountWithLabelAndSignRewards, 'GB')).toBe('GB 3 810');
      });
   it('prefix MR currecny', () => {
      expect(pipe.transform('100', '' ,  Constants.labels.amextype)).toBe('MR100');
   });
   it('prefix MR currency with sign', () => {
      expect(pipe.transform('-100', Constants.amountPipeSettings.amountWithLabelAndSign, 'MR')).toBe('- MR100.00');
   });
   it('prefix default currency', () => {
      expect(pipe.transform('100')).toBe('R100');
   });
   it('should format decimal NaN number', () => {
      const amountWithSign = {
         prefixValue: 'GHS'
      };
      expect(pipe.transform('100', amountWithSign)).toBe('GHS100');
   });
});

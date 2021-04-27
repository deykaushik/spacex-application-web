import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountUtility } from './amount';

describe('Amount Utility', () => {

   it('should format amount 12345678', () => {
      const value = '12345678';
      expect(AmountUtility.amountSplit(value, ' ')).toBe('12 345 678');
   });

   it('should format decimal amount', () => {
      const value = '1234567.99';
      expect(AmountUtility.amountSplit(value, ' ')).toBe('1 234 567.99');
   });

   it('should return amount only from tranform amount with cents', () => {
      const value = 'R1 234 567.99';
      expect(AmountUtility.amountOnly(value)).toBe('1234567.99');
   });

   it('should return amount only from tranform amount', () => {
      const value = 'R12 567';
      expect(AmountUtility.amountOnly(value)).toBe('12567');
   });

});

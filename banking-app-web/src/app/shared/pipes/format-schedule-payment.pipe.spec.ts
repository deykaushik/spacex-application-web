import { FormatSchedulePaymentPipe } from './format-schedule-payment.pipe';
import { IScheduledTransactionType, IScheduledTransaction } from '../../core/services/models';
import { DatePipe } from '@angular/common';

describe('FormatSchedulePaymentPipe', () => {
   let pipe: FormatSchedulePaymentPipe;

   const testScheduledData: IScheduledTransaction = {
      transactionID: 1234567,
      nextTransDate: '2017-09-20T00:00:00',
      bFName: 'UNKNOWN',
      myDescription: 'test',
      startDate: '2017-09-20T00:00:00',
      beneficiaryDescription: 'test',
      fromAccount: { accountNumber: '1713277581', accountType: 'cheque' },
      toAccount: { accountNumber: '1042853096', accountType: 'CA' },
      amount: 100.0,
      reoccurrenceItem: {
         reoccurrenceFrequency: 'Monthly',
         recInstrID: 2050467,
         reoccurrenceOccur: 12,
         reoccOccurrencesLeft: 11,
         reoccurrenceToDate: '2018-09-16T00:00:00',
         reoccSubFreqType: 'DayOfMonth', 'reoccSubFreqVal': '16'
      },
      serviceProvider: 'MNT',
      serviceProviderName: 'MNT',
      destinationNumber: '989 101 767'
   };

   const testTransactionTypeData: IScheduledTransactionType = {
      transaction: testScheduledData,
      type: 'Transfer',
      iconClass: 'transfer-icon'
   };

   beforeEach(() => {
      const datePipe = new DatePipe('en-US');
      pipe = new FormatSchedulePaymentPipe(datePipe);
   });

   it('create an instance', () => {
      expect(pipe).toBeTruthy();
   });


   it('should return undefined', () => {
      testScheduledData['type'] = 'Transfer';
      const transformedResult = pipe.transform(undefined, false);
      expect(transformedResult).toBeUndefined();
   });


   it('should return undefined', () => {
      testScheduledData['type'] = 'Transfer';
      const transformedResult = pipe.transform(undefined, true);
      expect(transformedResult).toBeUndefined();
   });

   it('should return the recurrence messgae', () => {
      const transformedResult = pipe.transform(testTransactionTypeData, true);
      expect(transformedResult).toBe('Repeats Monthly (11 payments remaining)');

   });

   it('should return the transaction description for type transfer', () => {
      testTransactionTypeData.type = 'Transfer';
      const transformedResult = pipe.transform(testTransactionTypeData);
      expect(transformedResult).toBe('Transfer from <b>cheque account</b> to <b>current account</b>, <b>R100.00</b> on <b>20/09/2017</b>');

   });

   it('should return the transaction description for type payment', () => {
      testTransactionTypeData.type = 'Payment';
      const transformedResult = pipe.transform(testTransactionTypeData);
      expect(transformedResult).toBe('Pay <b>UNKNOWN</b>, <b>R100.00</b> on <b>20/09/2017</b>');
   });

   it('should return the transaction description for type mobile', () => {
      testTransactionTypeData.type = 'Mobile';
      const transformedResult = pipe.transform(testTransactionTypeData);
      expect(transformedResult).toBe('Recharge MNT 989 101 767 , <b>R100.00<b> on <b>20/09/2017</b>');
   });

   it('should return the recurrence detail', () => {
      const transformedResult = pipe.transform(testTransactionTypeData, true);
      expect(transformedResult).toBe('Repeats Monthly (11 payments remaining)');
   });

   it('should return the recurrence detail with single repeat left', () => {
      testTransactionTypeData.transaction.reoccurrenceItem.reoccOccurrencesLeft = 1;
      const transformedResult = pipe.transform(testTransactionTypeData, true);
      expect(transformedResult).toBe('Repeats Monthly (1 payment remaining)');
   });
   it('should return handle all cases for transfer type ', () => {
      delete testTransactionTypeData.transaction.toAccount.accountType;
      testTransactionTypeData.type = 'Transfer';
      const transformedResult = pipe.transform(testTransactionTypeData);
      expect(transformedResult).toBe('Transfer from <b>cheque account</b> to <b>1042853096</b>, <b>R100.00</b> on <b>20/09/2017</b>');

   });
});

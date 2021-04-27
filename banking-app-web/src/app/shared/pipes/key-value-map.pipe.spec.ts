import { KeyValueMapPipe } from './key-value-map.pipe';
import { Constants } from '../../core/utils/constants';
import { AmountTransformPipe } from './amount-transform.pipe';
import { DatePipe } from '@angular/common';
import {
   IAccountBalanceDetail, IBalanceDetailsChangeLabel, IPropertyLabelsDetailedBalances,
   IPropertyToApplyFilter, IInvestmentDetailsList, IKeyValueMapResultSequence
} from '../../core/services/models';

describe('KeyValueMapPipe', () => {
   const label = Constants.labels.account.balanceDetailLabels;
   const mockPropertyFilters: IPropertyToApplyFilter = {};
   const mockPropertySequence: string[] = ['movementsDue', 'unclearedEffects', 'accruedFees',
      'pledgedAmount', 'crInterestDue', 'dbInterestDue'];
   const mockChangePropertyValue: IBalanceDetailsChangeLabel = { label: null };
   const mockPropertyLabels: IPropertyLabelsDetailedBalances[] = [{ prop: 'crInterestDue', append: 'crInterestRate' },
   { prop: 'dbInterestDue', append: 'dbInterestRate' }];
   const mockBalanceDetailInput: IAccountBalanceDetail = {
      accountType: 'TD',
      currentBalance: 2300,
      movementsDue: 100,
      unclearedEffects: 1000,
      accruedFees: 50,
      pledgedAmount: 10,
      crInterestDue: 0,
      crInterestRate: 0,
      dbInterestDue: 0,
      dbInterestRate: 0,
      overdraftLimit: 0,
      investmentAccountType: 'FIX'
   };
   const mockBalanceDetailInputInvestment: IInvestmentDetailsList = {
      'additionalDeposit': 20,
      'availableBalance': 200,
      'availableWithdrawal': 0,
      'bonusPercentage': 0,
      'currency': '',
      'currentBalance': 100,
      'dateOfOpening': '2001-01-01T12:00:00',
      'depositFrequency': 0,
      'initialDeposit': 0,
      'interestFrequency': 'Monthly',
      'interestRate': 7,
      'investmentAccountType': 'NTC',
      'investmentNumber': '98875894',
      'investmentProductName': '',
      'investmentProductType': '',
      'investmentTerm': '',
      'payOutDate': '0001-01-01T00:00:00',
      'reservedForRelease': 200,
      'termRemaining': '',
      'totalInterestPaid': 300,
      'withdrawalFrequency': 12
   };
   const mockBalanceDetailInputFca: IAccountBalanceDetail = {
      accountType: 'CFC',
      currentBalance: 2300,
      movementsDue: 100,
      unclearedEffects: 1000,
      accruedFees: 50,
      pledgedAmount: 10,
      crInterestDue: 0,
      crInterestRate: 0,
      dbInterestDue: 0,
      dbInterestRate: 0,
      currency: '&#x24;',
      currencyCode: 'USD',
      investmentAccountType: null
   };
   const mockBalanceDetailInputMFCLoan: IAccountBalanceDetail = {
      accountName: 'Bakkie',
      accountNumber: '120991800010002',
      accountType: 'IS',
      interestRate: 14.2,
      loanAmount: 165224,
      nextInstallmentAmount: 3277.24,
      paymentTerm: '72 Months',
      termRemaining: '22 Months',
      paymentDueDate: '2001-02-03T12:00:00',
      balloonAmount: 123
   };
   const dateFilterOnProperties = [];
   const rateFilterOnProperties = [];
   const noFilterOnProperties = [];
   const keys = [];
   const removeField = [];
   let pipe: KeyValueMapPipe;

   beforeEach(() => {
      pipe = new KeyValueMapPipe();
      pipe.amountTransform = new AmountTransformPipe();
      pipe.amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
      pipe.dateFilter = new DatePipe('en-US');
      pipe.defaultDate = label.defaultDate.toString();
   });

   it('create an instance', () => {
      expect(pipe).toBeTruthy();
   });

   it('should not populate date, rate and noFilter when pos is undefined ', () => {
      const mockPropertyFiltersEmpty = {};
      const transformedResult = pipe.transform(mockBalanceDetailInput, mockPropertySequence, mockPropertyFiltersEmpty,
         mockChangePropertyValue);
      expect(pipe.dateFilterOnProperties).toBeUndefined();
      expect(pipe.rateFilterOnProperties).toBeUndefined();
      expect(pipe.noFilterOnProperties).toBeUndefined();
   });

   it('should return the keys to populate with appropriate filters applied', () => {
      const mockPropertyFiltersAllFilters: IPropertyToApplyFilter = {
         date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate', 'bonusPercentage'],
         noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
      };
      const mockPropertySequenceAllFilter = ['totalInterestPaid', 'reservedForRelease', 'accruedInterest',
         'dateOfOpening', 'interestRate', 'payOutDate', 'interestFrequency', 'investmentTerm', 'termRemaining',
         'availableWithdrawal', 'bonusPercentage'];
      const changeLabelForFixedInv: IBalanceDetailsChangeLabel = { label: ['payOutDate', 'maturityDate'] };
      const transformedResult = pipe.transform(mockBalanceDetailInput, mockPropertySequenceAllFilter, mockPropertyFiltersAllFilters,
         changeLabelForFixedInv);
      const dateFilterExpectedReturn: string[] = ['dateOfOpening', 'payOutDate'];
      const rateFilterExpectedReturn: string[] = ['interestRate', 'bonusPercentage'];
      const noFilterExpectedReturn: string[] = ['interestFrequency', 'investmentTerm', 'termRemaining'];
      expect(pipe.dateFilterOnProperties).toEqual(dateFilterExpectedReturn);
      expect(pipe.rateFilterOnProperties).toEqual(rateFilterExpectedReturn);
      expect(pipe.noFilterOnProperties).toEqual(noFilterExpectedReturn);
   });

   it('should return the keys to populate for CASA accounts with out overdraft', () => {
      const mockPropertyLabelsCasa: IPropertyLabelsDetailedBalances[] = [{ prop: 'crInterestDue', append: 'crInterestRate' }];
      const mockPropertySequenceCa: string[] = ['movementsDue', 'unclearedEffects', 'accruedFees', 'pledgedAmount', 'crInterestDue'];
      mockBalanceDetailInput.accountType = Constants.VariableValues.accountTypes.currentAccountType.code;
      const transformExpectedResult: IKeyValueMapResultSequence[] = [{ 'id': 'movementsDue', 'key': 'Movements due', 'value': 'R100.00' },
      { 'id': 'unclearedEffects', 'key': 'Uncleared effects', 'value': 'R1 000.00' },
      { 'id': 'accruedFees', 'key': 'Accrued fees', 'value': 'R50.00' },
      { 'id': 'pledgedAmount', 'key': 'Pledged amount', 'value': 'R10.00' },
      { 'id': 'crInterestDue', 'key': 'Credit interest due(0%)', 'value': 'R0.00' }];
      const transformedResult: IKeyValueMapResultSequence[] = pipe.transform(mockBalanceDetailInput, mockPropertySequenceCa, null,
         mockChangePropertyValue, mockPropertyLabelsCasa);
      expect(transformedResult).toEqual(transformExpectedResult);
   });

   it('should return the proper labels for CASA accounts with overdraft', () => {
      const mockPropertySequenceCa = ['movementsDue', 'unclearedEffects', 'accruedFees', 'pledgedAmount', 'crInterestDue', 'dbInterestDue'];
      mockBalanceDetailInput.accountType = Constants.VariableValues.accountTypes.currentAccountType.code;
      const transformExpectedResult: IKeyValueMapResultSequence[] = [{ 'id': 'movementsDue', 'key': 'Movements due', 'value': 'R100.00' },
      { 'id': 'unclearedEffects', 'key': 'Uncleared effects', 'value': 'R1 000.00' },
      { 'id': 'accruedFees', 'key': 'Accrued fees', 'value': 'R50.00' },
      { 'id': 'pledgedAmount', 'key': 'Pledged amount', 'value': 'R10.00' },
      { 'id': 'crInterestDue', 'key': 'Credit interest due(0%)', 'value': 'R0.00' },
      { 'id': 'dbInterestDue', 'key': 'Debit interest due(0%)', 'value': 'R0.00' }];
      const transformedResult: IKeyValueMapResultSequence[] = pipe.transform(mockBalanceDetailInput, mockPropertySequenceCa, null,
         mockChangePropertyValue, mockPropertyLabels);
      expect(transformedResult).toEqual(transformExpectedResult);
   });

   it('should return the proper sequence for accounts with default date', () => {
      const mockPropertySequenceDs = ['dateOfOpening', 'interestRate', 'payOutDate', 'totalInterestPaid', 'reservedForRelease'];
      const mockPropertyFiltersDs: IPropertyToApplyFilter = { date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate'] };
      mockBalanceDetailInputInvestment.investmentAccountType = 'NTC';
      const transformExpectedResult: IKeyValueMapResultSequence = {
         'id': 'totalInterestPaid',
         'key': 'Interest paid in current tax year', 'value': 'R300.00'
      };
      const transformedResult = pipe.transform(mockBalanceDetailInputInvestment, mockPropertySequenceDs, mockPropertyFiltersDs,
         mockChangePropertyValue);
      expect(transformedResult[2]).toEqual(transformExpectedResult);
   });

   it('should return the proper sequence for fca accounts', () => {
      const mockPropertySequenceFca = ['currency', 'interestReceivable', 'estimatedRandValue', 'exchangeRateBuy'];
      const mockPropertyLabelsFca = [{ prop: 'interestReceivable', append: 'crInterestRate' },
      { prop: 'currency', append: 'currencyCode', applyOnValue: 'yes' }];
      mockBalanceDetailInputInvestment.investmentAccountType = 'CFC';
      const transformExpectedResult: IKeyValueMapResultSequence = { 'id': 'currency', 'key': 'Currency', 'value': '&#x24;(USD)' };
      const transformedResult = pipe.transform(mockBalanceDetailInputFca, mockPropertySequenceFca, null,
         mockChangePropertyValue, mockPropertyLabelsFca);
      expect(transformedResult[0]).toEqual(transformExpectedResult);
   });

   it('should return sequence by altering the label of property for MFC VAF loan account', () => {
      const mockPropertySequenceMFCLoan: string[] = ['nextInstallmentAmount', 'termRemaining',
         'loanAmount', 'interestRate', 'balloonAmount',
         'paymentDueDate', 'paymentTerm'];
      const mockPropertyFiltersMFCLoan: IPropertyToApplyFilter = {
         rate: ['interestRate'], noFilter: ['paymentTerm', 'termRemaining'],
         date: ['paymentDueDate']
      };
      mockBalanceDetailInputInvestment.investmentAccountType = 'IS';
      const changeLabelForMFCLoan: IBalanceDetailsChangeLabel = { label: ['paymentDueDate', 'balloonPaymentDueDate'] };
      const transformExpectedResult: IKeyValueMapResultSequence[] = [
         { 'key': 'Instalment amount', 'value': 'R3 277.24', 'id': 'nextInstallmentAmount' },
         { 'key': 'Term remaining', 'value': '22 Months', 'id': 'termRemaining' },
         { 'key': 'Loan amount', 'value': 'R165 224.00', 'id': 'loanAmount' },
         { 'key': 'Interest rate', 'value': '14.2%', 'id': 'interestRate' },
         { 'key': 'Balloon amount', 'value': 'R123.00', 'id': 'balloonAmount' },
         { 'key': 'Balloon payment due date', 'value': '03 Feb 2001', 'id': 'paymentDueDate' },
         { 'key': 'Original term', 'value': '72 Months', 'id': 'paymentTerm' }];
      const transformedResult = pipe.transform(mockBalanceDetailInputMFCLoan, mockPropertySequenceMFCLoan, mockPropertyFiltersMFCLoan,
         changeLabelForMFCLoan);
      expect(transformedResult).toEqual(transformExpectedResult);
   });
});

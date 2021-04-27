import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Constants } from './constants';
import { DatePipe } from '@angular/common';
import { CommonUtility } from './common';
import { FormsModule } from '@angular/forms';
import { IDashboardAccount, IClientDetails, IPlasticCard } from '../services/models';
import { transferAccountsDummyData } from '../data/skeleton-data';

const investmentType = Constants.labels.account.balanceDetailLabels.investmentType;
let templateDetails = [];
let filterToBeApplied = {};
let propertyLabels = [];
let accountType = Constants.VariableValues.accountTypes.investmentAccountType.code;

const mockCard: IPlasticCard = {
      'plasticId': 4, 'plasticNumber': '529874 0000753039', 'plasticStatus': 'Active', 'plasticType': 'G1D', 'dcIndicator': 'D',
      'plasticCustomerRelationshipCode': 'PRI', 'plasticStockCode': 'GD1', 'plasticCurrentStatusReasonCode': 'AAA',
      'plasticBranchNumber': '702', 'nameLine': 'PGBCK172 27092016', 'plasticStatusCode': 'AOA',
      'expiryDate': '2019-09-30 12:00:00 AM', 'issueDate': '2018-02-06 12:00:00 AM', 'plasticDescription': 'MASTERCARD SAA GOLD',
      'cardAccountNumber': '589846 076146995 6', 'owner': true, 'availableBalance': 289311.67, 'allowATMLimit': true,
      'allowBranch': true, 'allowBlock': true, 'allowReplace': true
   };

describe('Common Utility', () => {

   it('should validate valid email', () => {
      const email = 'test@mail.com';
      expect(CommonUtility.isValidEmail(email)).toBeTruthy();
   });

   it('should invalidate invalid email', () => {
      const email = 'test.mail.com';
      expect(CommonUtility.isValidEmail(email)).toBeFalsy();
   });

   it('should return correct account type style for different account types', () => {
      const email = 'test.mail.com';
      expect(CommonUtility.getAccountTypeStyle('CA')).toBe('current');

      expect(CommonUtility.getAccountTypeStyle('SA')).toBe('savings');
      expect(CommonUtility.getAccountTypeStyle('SA', 'ClubAccount')).toBe('club-accounts');

      expect(CommonUtility.getAccountTypeStyle('CC')).toBe('credit-card');

      expect(CommonUtility.getAccountTypeStyle('NC')).toBe('loan');
      expect(CommonUtility.getAccountTypeStyle('IS')).toBe('loan');
      expect(CommonUtility.getAccountTypeStyle('HL')).toBe('loan');
      expect(CommonUtility.getAccountTypeStyle('PL')).toBe('loan');

      expect(CommonUtility.getAccountTypeStyle('TD')).toBe('investment');
      expect(CommonUtility.getAccountTypeStyle('DS')).toBe('investment');
      expect(CommonUtility.getAccountTypeStyle('INV')).toBe('investment');
      expect(CommonUtility.getAccountTypeStyle('CFC')).toBe('foreign');
      expect(CommonUtility.getAccountTypeStyle('Rewards')).toBe('rewards');
      expect(CommonUtility.getAccountTypeStyle('')).toBe('default');
   });

   it('should return correct account type name for different account types', () => {
      expect(CommonUtility.getAccountTypeName('CA')).toBe('current');
      expect(CommonUtility.getAccountTypeName('SA')).toBe('savings');
      expect(CommonUtility.getAccountTypeName('CC')).toBe('credit');
      expect(CommonUtility.getAccountTypeName('NC')).toBe('nedCredit');
      expect(CommonUtility.getAccountTypeName('IS')).toBe('installment');
      expect(CommonUtility.getAccountTypeName('HL')).toBe('home loan');
      expect(CommonUtility.getAccountTypeName('PL')).toBe('personal loan');
      expect(CommonUtility.getAccountTypeName('TD')).toBe('call');
      expect(CommonUtility.getAccountTypeName('DS')).toBe('investment');
      expect(CommonUtility.getAccountTypeName('NP')).toBe('nedmatic profile');
      expect(CommonUtility.getAccountTypeName('ONL')).toBe('over night loan / nedmatic profile');
      expect(CommonUtility.getAccountTypeName('CFC')).toBe('customer foreign currency');
      expect(CommonUtility.getAccountTypeName('ABC')).toBe('ABC');
      expect(CommonUtility.getAccountTypeName('INV')).toBe('NGI investment');
   });

   it('should return date label for different types of date', () => {
      const datePipe = new DatePipe(Constants.labels.localeString);
      const todaysDate = new Date();
      const tomorrowsDate = new Date();
      tomorrowsDate.setDate(tomorrowsDate.getDate() + 1);
      const transformedDate = datePipe.transform(tomorrowsDate, 'fullDate');
      expect(CommonUtility.getDateString(new Date())).toBe('today.');
      expect(CommonUtility.getDateString(tomorrowsDate)).toBe(`on ${transformedDate}`);
   });
   it('should return ten digit mobile no ', () => {
      expect(CommonUtility.tenDigitMobile('+219876543210').length).toBe(10);
   });
   it('should give num array from string', () => {
      expect(CommonUtility.getNumberArray('1 2 3 4 5 6').length).toBe(6);
   });
   it('should get getAcronymName for empty', () => {
      expect(CommonUtility.getAcronymName('')).toBe('');
   });
   it('should return true for same date', () => {
      const date1 = new Date();
      const date2 = new Date();
      expect(CommonUtility.isSameDateAs(date1, date2)).toBeTruthy();
   });
   it('should return false for different date', () => {
      const date1 = new Date();
      const date2 = new Date('October 13, 2014 11:13:00');
      expect(CommonUtility.isSameDateAs(date1, date2)).toBeFalsy();
   });

   it('should return unique ID', () => {
      expect(CommonUtility.getID('Try Again')).toBe('try_again');
   });

   it('should return blank as an id', () => {
      expect(CommonUtility.getID(null)).toBe('');
   });

   it('should return blank as an id', () => {
      expect(CommonUtility.getID(null)).toBe('');
   });

   it('should exicute print', () => {
      spyOn(window, 'print').and.returnValue(true);
      CommonUtility.print();
   });

   it('should check that no-print class has bean removed ', () => {
      const dummy = document.createElement('div');
      dummy.classList.add('main-header', 'main-footer', 'sub-menu-mob', 'no-print');
      document.body.appendChild(dummy);
      CommonUtility.addPrintHeaderFooter();
      const test = document.getElementsByClassName('sub-menu-mob')[0];
      expect(test.className.indexOf('no-print') === -1).toBeTruthy();
   });

   it('should check that no-print class has bean added', () => {
      const dummy = document.createElement('div');
      dummy.classList.add('main-header', 'main-footer', 'sub-menu-mob');
      document.body.appendChild(dummy);
      CommonUtility.removePrintHeaderFooter();
      const test = document.getElementsByClassName('sub-menu-mob')[0];
      expect(test.className.indexOf('no-print') > -1).toBeTruthy();
   });
   it('should convert number to string', () => {
      expect(CommonUtility.convertNumbertoWords(123344))
         .toBe('one lakh twenty three thousand three hundred and forty four');
      expect(CommonUtility.convertNumbertoWords('')).toBe('');
      expect(CommonUtility.convertNumbertoWords(12345678910)).toBe('overflow');
      expect(CommonUtility.convertNumbertoWords(123456789))
         .toBe('twelve crore thirty four lakh fifty six thousand seven hundred and eighty nine');
   });

   it('should return correct template details for fixed DS detailed balances', () => {
      templateDetails = ['totalInterestPaid', 'reservedForRelease', 'accruedInterest', 'dateOfOpening',
         'interestRate', 'payOutDate', 'interestFrequency', 'investmentTerm', 'termRemaining',
         'availableWithdrawal', 'bonusPercentage'];
      filterToBeApplied = {
         date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate', 'bonusPercentage'],
         noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
      };
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, investmentType.fixedInv)).toEqual(result);
   });

   it('should return correct template details for linked DS detailed balances', () => {
      templateDetails = ['dateOfOpening', 'payOutDate', 'interestRate', 'interestFrequency',
         'investmentTerm', 'termRemaining', 'reservedForRelease', 'totalInterestPaid', 'additionalDeposit',
         'availableWithdrawal'];
      filterToBeApplied = {
         date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate'],
         noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
      };
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, investmentType.linkedInv)).toEqual(result);
   });

   it('should return correct template details for notice DS detailed balances', () => {
      templateDetails = ['dateOfOpening', 'interestRate', 'payOutDate', 'totalInterestPaid', 'reservedForRelease'];
      filterToBeApplied = { date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate'] };
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, investmentType.noticeInv)).toEqual(result);
   });

   it('should return correct template details for call Df detailed balances', () => {
      accountType = Constants.VariableValues.accountTypes.treasuryInvestmentAccountType.code;
      templateDetails = ['interestRate', 'interestFrequency', 'interestPaymentDate', 'dateOfOpening',
         'accruedInterest', 'totalInterestPaid', 'initialDeposit'];
      filterToBeApplied = { date: ['interestPaymentDate', 'dateOfOpening'], rate: ['interestRate'], noFilter: ['interestFrequency'] };
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, investmentType.callDfInv)).toEqual(result);
   });

   it('should return correct template details for notice Df detailed balances', () => {
      accountType = Constants.VariableValues.accountTypes.treasuryInvestmentAccountType.code;
      templateDetails = ['totalInterestPaid', 'reservedForRelease', 'accruedInterest', 'dateOfOpening',
         'interestRate', 'payOutDate'];
      filterToBeApplied = { date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate'] };
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, investmentType.noticeDfInv)).toEqual(result);
   });

   it('should return correct template details for fixed Df detailed balances', () => {
      accountType = Constants.VariableValues.accountTypes.treasuryInvestmentAccountType.code;
      templateDetails = ['totalInterestPaid', 'accruedInterest', 'dateOfOpening', 'interestRate',
         'maturityDate', 'interestFrequency', 'interestPaymentDate', 'investmentTerm', 'termRemaining'
         , 'initialDeposit'];
      filterToBeApplied = {
         date: ['dateOfOpening', 'maturityDate', 'interestPaymentDate'], rate: ['interestRate'],
         noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
      };
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, investmentType.fixedDfInv)).toEqual(result);
   });

   it('should return correct template details for cfo Df detailed balances', () => {
      accountType = Constants.VariableValues.accountTypes.treasuryInvestmentAccountType.code;
      templateDetails = ['totalInterestPaid', 'reservedForRelease', 'accruedInterest', 'dateOfOpening',
         'interestRate', 'maturityDate', 'interestFrequency', 'interestPaymentDate', 'investmentTerm',
         'termRemaining', 'availableWithdrawal', 'initialDeposit'];
      filterToBeApplied = {
         date: ['dateOfOpening', 'maturityDate', 'interestPaymentDate'], rate: ['interestRate'],
         noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
      };
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, investmentType.cfoDfInv)).toEqual(result);
   });

   it('should return correct template details for INV detailed balances', () => {
      accountType = 'INV';
      templateDetails = ['fundFolioNumber', 'quantity', 'availableUnits',
         'unitPrice', 'cededAmount', 'unclearedAmount', 'percentage'];
      filterToBeApplied = {
         rate: ['percentage'], noFilter: ['fundFolioNumber', 'quantity', 'availableUnits',
            'cededAmount', 'unclearedAmount']
      };
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null)).toEqual(result);
   });

   it('should return correct template details for casa w/o overdraft detailed balances', () => {
      templateDetails = ['movementsDue', 'unclearedEffects', 'accruedFees', 'pledgedAmount', 'crInterestDue'];
      propertyLabels = [{ prop: 'crInterestDue', append: 'crInterestRate' }];
      const result = { templateDetails: templateDetails, propertyLabels: propertyLabels };
      accountType = Constants.VariableValues.accountTypes.savingAccountType.code;
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null, false)).toEqual(result);

      accountType = Constants.VariableValues.accountTypes.currentAccountType.code;
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null, false)).toEqual(result);
   });

   it('should return correct template details for casa with overdraft detailed balances', () => {
      templateDetails = ['movementsDue', 'unclearedEffects', 'accruedFees', 'pledgedAmount',
         'crInterestDue', 'dbInterestDue'];
      propertyLabels = [{ prop: 'crInterestDue', append: 'crInterestRate' }, { prop: 'dbInterestDue', append: 'dbInterestRate' }];
      const result = { templateDetails: templateDetails, propertyLabels: propertyLabels };
      accountType = Constants.VariableValues.accountTypes.currentAccountType.code;
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null, true)).toEqual(result);
   });

   it('should return correct template details for club accounts detailed balances', () => {
      templateDetails = ['crInterestDue', 'movementsDue'];
      propertyLabels = [{ prop: 'crInterestDue', append: 'crInterestRate' }];
      const result = { templateDetails: templateDetails, propertyLabels: propertyLabels };
      accountType = Constants.VariableValues.accountTypes.savingAccountType.code;
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null, true, 'ClubAccount')).toEqual(result);
   });

   it('should return correct template details for fca', () => {
      templateDetails = ['currency', 'interestReceivable', 'estimatedRandValue', 'exchangeRateBuy'];
      propertyLabels = [{ prop: 'interestReceivable', append: 'crInterestRate' },
      { prop: 'currency', append: 'currencyCode', applyOnValue: 'yes' }];
      const result = { templateDetails: templateDetails, propertyLabels: propertyLabels };
      accountType = Constants.VariableValues.accountTypes.foreignCurrencyAccountType.code;
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null, false)).toEqual(result);
   });

   it('should return correct template details for HL detailed balances', () => {
      templateDetails = ['nextInstallmentAmount', 'loanAmount', 'interestRate', 'paymentTerm', 'termRemaining'];
      filterToBeApplied = {
         rate: ['interestRate'], noFilter: ['paymentTerm', 'termRemaining']
      };
      accountType = Constants.VariableValues.accountTypes.homeLoanAccountType.code;
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null)).toEqual(result);
   });

   it('should return correct template details for PL detailed balances', () => {
      templateDetails = ['nextInstallmentAmount', 'loanAmount', 'interestRate', 'paymentTerm', 'termRemaining'];
      filterToBeApplied = {
         rate: ['interestRate'], noFilter: ['paymentTerm', 'termRemaining']
      };
      accountType = Constants.VariableValues.accountTypes.personalLoanAccountType.code;
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null)).toEqual(result);
   });

   it('should return correct template details for mfc/vaf loan account detailed balances', () => {
      templateDetails = ['nextInstallmentAmount', 'termRemaining', 'loanAmount', 'interestRate', 'balloonAmount', 'paymentDueDate',
         'paymentTerm'];
      filterToBeApplied = {
         rate: ['interestRate'], noFilter: ['paymentTerm', 'termRemaining'], date: ['paymentDueDate']
      };
      accountType = Constants.VariableValues.accountTypes.mfcvafLoanAccountType.code;
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null)).toEqual(result);
   });

   it('should return correct template details for Credit card detailed balances', () => {
      templateDetails = ['creditLimit', 'outstandingBalance', 'paymentDueDate', 'minimumPaymentDue', 'latestStatementDate',
         'latestStatementBalance', 'lastPaymentDate', 'lastPaymentAmount'];
      filterToBeApplied = {
         date: ['paymentDueDate', 'latestStatementDate', 'lastPaymentDate']
      };
      accountType = Constants.VariableValues.accountTypes.creditCardAccountType.code;
      const result = { templateDetails: templateDetails, filterToBeApplied: filterToBeApplied };
      expect(CommonUtility.getBalanceDetailsTemplate(accountType, null)).toEqual(result);
   });

   it('should exicute topScroll', () => {
      CommonUtility.topScroll();
   });

   it('should call getPasswordField', () => {
      CommonUtility.getPasswordField(true);
      expect('password').toBe('password');
      CommonUtility.getPasswordField(false);
      expect('text').toBe('text');
   });

   it('should set transfer to accounts based on TransferRules', () => {
      let fromAccount = transferAccountsDummyData[0];
      const restAccounts = transferAccountsDummyData.filter(m => m.itemAccountId !== fromAccount.itemAccountId);
      let filteredItems = CommonUtility.transferToAccounts(fromAccount, restAccounts);
      expect(filteredItems.length).toBe(2);

      transferAccountsDummyData[0].TransferAccountRules = null;
      fromAccount = transferAccountsDummyData[0];
      filteredItems = CommonUtility.transferToAccounts(fromAccount, restAccounts);
      expect(filteredItems.length).toBe(0);

      transferAccountsDummyData[0].TransferAccountRules = null;
      fromAccount = transferAccountsDummyData[0];
      restAccounts[1].accountType = 'TEST';
      filteredItems = CommonUtility.transferToAccounts(fromAccount, restAccounts);
      expect(filteredItems.length).toBe(0);

   });

   it('should return account type description based on account type', () => {
      expect(CommonUtility.getAccountTypeDesc('CA')).toBe('Current account');
      expect(CommonUtility.getAccountTypeDesc('SA')).toBe('Savings account');
      expect(CommonUtility.getAccountTypeDesc('PL')).toBe('Personal loan');
      expect(CommonUtility.getAccountTypeDesc('HL')).toBe('Home loan');
      expect(CommonUtility.getAccountTypeDesc('DS')).toBe('Investment account');
   });

   it('should return true if it is my pockets account else should return false', () => {
      expect(CommonUtility.isMyPocketsAccount('SA', '25')).toBe(true);
      expect(CommonUtility.isMyPocketsAccount('SA', '001')).toBe(false);
   });

   it('should return investor number from investment number', () => {
      expect(CommonUtility.getInvestorNumber('23626775-9996')).toBe('23626775');
   });

   it('should return investor number as is', () => {
      expect(CommonUtility.getInvestorNumber('23626775')).toBe('23626775');
   });

   it('should return isValid true if result response does not have operationReference set and statusType is not present', () => {
      const metadata = {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: undefined,
                     result: 'R00',
                     status: 'Customer Enroled',
                     reason: ''
                  }
               ]
            }
         ]
      };
      const res = CommonUtility.getResultStatus(metadata);
      expect(res.isValid).toBe(true);
   });

   it('should return isValid false if result response have operationReference does not match statusType', () => {
      const metadata = {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'test',
                     result: 'R00',
                     status: 'Customer Enroled',
                     reason: ''
                  }
               ]
            }
         ]
      };
      const res = CommonUtility.getResultStatus(metadata, 'status');
      expect(res.isValid).toBe(false);
   });

   it('should return isValid true if result response have operationReference set and statusType is present', () => {
      const metadata = {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'test',
                     result: 'R00',
                     status: 'Customer Enroled',
                     reason: ''
                  }
               ]
            }
         ]
      };
      const res = CommonUtility.getResultStatus(metadata, 'test');
      expect(res.isValid).toBe(true);
   });

   it('should return isValid true if result response does not have any error', () => {
      const metadata = {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: '',
                     result: 'R00',
                     status: 'Customer Enroled',
                     reason: ''
                  }
               ]
            }
         ]
      };
      const res = CommonUtility.getResultStatus(metadata);
      expect(res.isValid).toBe(true);
   });

   it('should return reason if result response have any error', () => {
      const metadata = {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: '',
                     result: 'R05',
                     status: 'FAILURE',
                     reason: 'Already has account'
                  }
               ]
            }
         ]
      };
      const res = CommonUtility.getResultStatus(metadata);
      expect(res.reason).toBe('Already has account');
   });

   it('should return id based on the residency code of client', () => {
      const details = {
         IdOrTaxIdNo: 123,
         PassportNo: 'abc',
         Resident: 'ZA'
      };
      expect(CommonUtility.getResidencyBasedClientId(details as IClientDetails)).toBe('123');
      details.Resident = 'NA';
      expect(CommonUtility.getResidencyBasedClientId(details as IClientDetails)).toBe('abc');

   });

   it('should return true if it is any of CA or SA account else should return false', () => {
      expect(CommonUtility.isCasaAccount('SA')).toBe(true);
      expect(CommonUtility.isCasaAccount('CA')).toBe(true);
      expect(CommonUtility.isCasaAccount('IS')).toBe(false);
   });

   it('should return true for garage card and false for not a garage card', () => {
      const card: IPlasticCard = {
         'plasticId': 4, 'plasticNumber': '529874 0000753039', 'plasticStatus': 'Active', 'plasticType': 'G1D', 'dcIndicator': 'D',
         'plasticCustomerRelationshipCode': 'PRI', 'plasticStockCode': 'GD1', 'plasticCurrentStatusReasonCode': 'AAA',
         'plasticBranchNumber': '702', 'nameLine': 'PGBCK172 27092016',
         'expiryDate': '2019-09-30 12:00:00 AM', 'issueDate': '2018-02-06 12:00:00 AM', 'plasticDescription': 'MASTERCARD SAA GOLD',
         'cardAccountNumber': '589846 076146995 6', 'owner': true, 'availableBalance': 289311.67, 'allowATMLimit': true,
         'allowBranch': true, 'allowBlock': true, 'allowReplace': true
      };
      const notAGaragecard: IPlasticCard = {
         'plasticId': 3, 'plasticNumber': '529874 0000753039', 'plasticStatus': 'Active', 'plasticType': 'MW4', 'dcIndicator': 'C',
         'plasticCustomerRelationshipCode': 'PRI', 'plasticStockCode': 'MW4', 'plasticCurrentStatusReasonCode': 'AAA',
         'plasticBranchNumber': '1', 'nameLine': 'PGBCK172 27092016',
         'expiryDate': '2019-09-30 12:00:00 AM', 'issueDate': '2018-02-06 12:00:00 AM', 'plasticDescription': 'MASTERCARD SAA GOLD',
         'cardAccountNumber': '589846 076146995 6', 'owner': true, 'availableBalance': 289311.67, 'allowATMLimit': true,
         'allowBranch': true, 'allowBlock': true, 'allowReplace': true
      };
      expect(CommonUtility.isGarageCard(card)).toBe(true);
      expect(CommonUtility.isGarageCard(notAGaragecard)).toBe(false);
   });

   it('should return true for active card and false for not an active card', () => {
      const inactiveCard: IPlasticCard = {
         'plasticId': 3, 'plasticNumber': '529874 0000753039', 'plasticStatus': 'Active', 'plasticType': 'MW4', 'dcIndicator': 'C',
         'plasticCustomerRelationshipCode': 'PRI', 'plasticStockCode': 'MW4', 'plasticCurrentStatusReasonCode': 'AAA',
         'plasticBranchNumber': '1', 'nameLine': 'PGBCK172 27092016', 'plasticStatusCode': 'IAD',
         'expiryDate': '2019-09-30 12:00:00 AM', 'issueDate': '2018-02-06 12:00:00 AM', 'plasticDescription': 'MASTERCARD SAA GOLD',
         'cardAccountNumber': '589846 076146995 6', 'owner': true, 'availableBalance': 289311.67, 'allowATMLimit': true,
         'allowBranch': true, 'allowBlock': true, 'allowReplace': true
      };
      expect(CommonUtility.isActiveCard(mockCard)).toBe(true);
      expect(CommonUtility.isActiveCard(inactiveCard)).toBe(false);
   });

   it('should validate the given text', () => {
      expect(CommonUtility.isValidText('test', Constants.patterns.alphaNumeric)).toBe(true);
   });

   it('should return true if account type is personal loan', () => {
      expect(CommonUtility.isPersonalLoan('PL')).toBe(true);
   });

   it('should return false if account type is not personal loan', () => {
      expect(CommonUtility.isPersonalLoan('HL')).toBe(false);
   });

   it('should return true if account type is MFC/VAF', () => {
      expect(CommonUtility.isMfcvafLoan('IS')).toBe(true);
   });

   it('should return false if account type is not MFC/VAF', () => {
      expect(CommonUtility.isMfcvafLoan('PL')).toBe(false);
   });

   it('should return true if account type is CA', () => {
      expect(CommonUtility.isTransactionSearchApplicable('CA')).toBe(true);
   });

   it('should return true if account type is credit card account', () => {
      expect(CommonUtility.isCreditCardAccount('CC')).toBe(true);
   });

   it('should return false if account type is not credit card account', () => {
      expect(CommonUtility.isCreditCardAccount('CA')).toBe(false);
   });
   it('should return proper account type to be appended to GA events', () => {
      expect(CommonUtility.gaAccountType('', '33')).toBe('club');
      expect(CommonUtility.gaAccountType('SA', '25')).toBe('poc');
      expect(CommonUtility.gaAccountType('rewards', '')).toBe('rewards');
   });
});

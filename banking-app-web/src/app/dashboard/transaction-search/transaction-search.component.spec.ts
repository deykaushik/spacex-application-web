import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { assertModuleFactoryCaching } from './../../test-util';
import { TransactionSearchComponent } from './transaction-search.component';
import { Component, OnInit, OnChanges, Input, SimpleChange, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../account.service';
import { ITransactionDetail, IButtonGroup, IApiResponse } from '../../core/services/models';
import { GaTrackingService } from '../../core/services/ga.service';

const mockAccountTransactions: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: -2000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-07-30 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
},
{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 1000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2018-07-29 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}
];
const buttonGroup: IButtonGroup[] = [
   { label: '30 days', value: '30' },
   { label: '60 days', value: '60' },
   { label: 'Custom', value: 'custom' }];

const mockAccountTransactionsWithResultData: any = {
   resultData: {
      transactionID: '34526',
      resultDetail: [
         {
            operationReference: 'SUCCESS',
            result: 'R00',
            status: 'SUCCESS',
            reason: 'Success'
         }
      ]
   }
};
const accountServiceStub = {
   getAdvancedSearchData: jasmine.createSpy('getAdvancedSearchData').and.returnValue(Observable.of(mockAccountTransactions)),
   transactionSearchMode: jasmine.createSpy('transactionSearchMode').and.returnValue(false)
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
describe('TransactionSearchComponent', () => {
   let component: TransactionSearchComponent;
   let fixture: ComponentFixture<TransactionSearchComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TransactionSearchComponent],
         schemas: [NO_ERRORS_SCHEMA],
         imports: [FormsModule],
         providers: [
            { provide: AccountService, useValue: accountServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TransactionSearchComponent);
      component = fixture.componentInstance;
      component.accountDetails = {
         accountType: 'CA',
         itemAccountId: 2,
         parentSkeleton: false,
         searchEnabled: true
      };
      component.filter = 'PAY';
      component.amountFrom = '10';
      component.amountTo = '20';
      component.getDataFromService = true;
      component.transactions = [];
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.transactions = mockAccountTransactions;
      expect(component).toBeTruthy();
   });
   it('should intialize transactions with visible transactions', () => {
      component.transactions = mockAccountTransactions;
      component.ngOnChanges();
      expect(component.transactions).toBe(mockAccountTransactions);
   });
   it('if account type is CASA count should be -365', () => {
      component.transactions = mockAccountTransactions;
      component.accountDetails.accountType = 'CA';
      component.ngOnInit();
      expect(component.count).toBe(-365);
      expect(component.amountLabel).toBe('Amount ');
   });
   it('if account type is Credit count should be -180', () => {
      component.transactions = mockAccountTransactions;
      component.accountDetails.accountType = 'CC';
      component.ngOnInit();
      expect(component.count).toBe(-90);
      expect(component.amountLabel).toBe('Amount ');
   });
   it('if account type is foreign currency count should be -90', () => {
      component.transactions = mockAccountTransactions;
      component.accountDetails.accountType = 'CFC';
      component.ngOnInit();
      expect(component.count).toBe(-90);
      expect(component.amountLabel).toBe('Amount ');
   });
   it('if account type is rewards count should be -90', () => {
      component.transactions = mockAccountTransactions;
      component.accountDetails.accountType = 'Rewards';
      component.ngOnInit();
      expect(component.count).toBe(-90);
      expect(component.amountLabel).toEqual('Points ');
   });
   it('if from amount changes', () => {
      component.transactions = mockAccountTransactions;
      component.amountTo = '20';
      component.onFromAmountChange('10');
      expect(component.isFromAmountInValid).toBe(false);
      expect(component.amountFrom).toBe('10');
      expect(component.focusAmount).toBe('amountFrom');
   });
   it('if to amount changes', () => {
      component.transactions = mockAccountTransactions;
      component.amountTo = '20';
      component.amountFrom = '10';
      component.onToAmountChange(component.amountTo);
      expect(component.isToAmountInValid).toBe(false);
      expect(component.isFromAmountInValid).toBe(false);
      expect(component.focusAmount).toBe('amountTo');
   });
   it('selecting date from button group', () => {
      component.transactions = mockAccountTransactions;
      component.selectDate(buttonGroup[0]);
      expect(component.period).toBe('30');
      expect(component.selectedButton).toBe('30');
      expect(component.showDatePicker).toBe(false);
      expect(component.disableSubmit).toBe(false);
   });
   it('selecting date from button group if button is custom', () => {
      component.transactions = mockAccountTransactions;
      spyOn(component, 'setDatePicker').and.callThrough();
      component.selectDate(buttonGroup[2]);
      expect(component.period).toBe('custom');
      expect(component.selectedButton).toBe('custom');
      expect(component.showDatePicker).toBe(true);
      expect(component.disableSubmit).toBe(true);
      expect(component.enableDateText).toBe(true);
      expect(component.setDatePicker).toHaveBeenCalled();
   });
   it('selecting from date', () => {
      component.transactions = mockAccountTransactions;
      component.dateCount = 0;
      const value = new Date('2018-07-30T02:00:00+02:00');
      component.setFromDate(value);
      expect(component.dateCount).toBe(1);
      expect(component.fromDate).toBe(value);
   });
   it('selecting from date when dateCount is greater then one', () => {
      component.transactions = mockAccountTransactions;
      component.dateCount = 1;
      const value = new Date('2018-07-30T02:00:00+02:00');
      component.setFromDate(value);
      expect(component.dateCount).toBe(2);
      expect(component.fromDate).toBe(value);
      expect(component.disableSubmit).toBe(true);
   });
   it('selecting to date', () => {
      component.transactions = mockAccountTransactions;
      component.dateCount = 1;
      component.count = -365;
      const value = new Date('2018-07-30T02:00:00+02:00');
      component.setToDate(value);
      expect(component.dateCount).toBe(2);
      expect(component.disableSubmit).toBe(false);
   });
   it('formatting amount when account type is rewards', () => {
      component.transactions = mockAccountTransactions;
      component.amountFrom = '';
      component.accountDetails.accountType = 'Rewards';
      component.formatAmount('amountFrom');
      expect(component.amountTo).toBe('');
   });
   it('formatting amount when account type is rewards but amount from is not null', () => {
      component.transactions = mockAccountTransactions;
      component.amountFrom = '10';
      component.amountTo = '20';
      component.accountDetails.accountType = 'Rewards';
      component.formatAmount('amountFrom');
      expect(component.amountTo).toBe('20');
   });
   it('formatting amount when account type is not rewards and from amount is numeric', () => {
      component.transactions = mockAccountTransactions;
      component.amountFrom = '20';
      component.formatAmount('amountFrom');
      expect(component.amountFrom).toBe('20.00');
   });
   it('formatting amount when account type is not rewards and to amount is numeric', () => {
      component.transactions = mockAccountTransactions;
      component.amountTo = '20';
      component.formatAmount('amountTo');
      expect(component.amountTo).toBe('20.00');
   });
   it('filterContentContextual is called', () => {
      component.filteredTransactions = mockAccountTransactions;
      component.transactions = mockAccountTransactions;
      component.visibleTransactions = mockAccountTransactions;
      component.isAdvancedSearch = false;
      component.filter = 'PAY';
      component.filterContentContextual('PAY');
      expect(component.visibleTransactions).toEqual(mockAccountTransactions);
   });
   it('filterContentContextual is called when getDataFromService is false', () => {
      component.filteredTransactions = mockAccountTransactions;
      component.transactions = mockAccountTransactions;
      component.visibleTransactions = mockAccountTransactions;
      component.isAdvancedSearch = false;
      component.filter = 'PAY';
      component.getDataFromService = false;
      component.filterContentContextual('PAY');
      expect(component.visibleTransactions).toEqual(mockAccountTransactions);
   });
   it('get start and end date for CASA', () => {
      component.transactions = mockAccountTransactions;
      component.period = '30';
      component.accountDetails.accountType = 'CA';
      component.getStartDateEndDate();
      expect(component.getDataFromService).toBe(true);
   });
   it('get start and end date for Credit', () => {
      component.transactions = mockAccountTransactions;
      component.period = 'Custom';
      component.accountDetails.accountType = 'CC';
      component.getStartDateEndDate();
      expect(component.getDataFromService).toBe(false);
   });
   it('get start and end date for Rewards and FCA', () => {
      component.transactions = mockAccountTransactions;
      component.period = 'Custom';
      component.accountDetails.accountType = 'Rewards';
      component.getStartDateEndDate();
      expect(component.getDataFromService).toBe(false);
   });
   it('get start and end date for Rewards and FCA for 60 days', () => {
      component.transactions = mockAccountTransactions;
      component.period = '60';
      component.accountDetails.accountType = 'Rewards';
      component.getStartDateEndDate();
      expect(component.getDataFromService).toBe(false);
   });
   it('get start and end date for Rewards and FCA for 90 days', () => {
      component.transactions = mockAccountTransactions;
      component.period = '90';
      component.accountDetails.accountType = 'Rewards';
      component.getStartDateEndDate();
      expect(component.getDataFromService).toBe(false);
   });
   it('get filtered date data', () => {
      component.transactions = mockAccountTransactions;
      spyOn(component, 'searchForCasaAndCreditCard').and.callThrough();
      component.getDataFromService = true;
      component.fromDate = new Date('2018-07-30T02:00:00+02:00');
      component.toDate = new Date('2018-08-30T02:00:00+02:00');
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockAccountTransactions));
      component.getFilteredDateData(component.fromDate, component.toDate);
      expect(component.searchForCasaAndCreditCard).toHaveBeenCalled();
   });
   it('get filtered date data and accountType is credit card', () => {
      component.transactions = mockAccountTransactions;
      spyOn(component, 'searchForCasaAndCreditCard').and.callThrough();
      component.getDataFromService = true;
      component.fromDate = new Date('2018-07-30T02:00:00+02:00');
      component.toDate = new Date('2018-08-30T02:00:00+02:00');
      component.accountDetails.accountType = 'CC';
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockAccountTransactions));
      component.getFilteredDateData(component.fromDate, component.toDate);
      expect(component.searchForCasaAndCreditCard).toHaveBeenCalled();
   });
   it('get start and end date for CASA when period is custom', () => {
      component.transactions = mockAccountTransactions;
      component.period = 'Custom';
      component.accountDetails.accountType = 'CA';
      component.getStartDateEndDate();
      expect(component.getDataFromService).toBe(true);
   });
   it('get start and end date for rewards when period is 30 days', () => {
      component.transactions = mockAccountTransactions;
      component.period = '30';
      component.accountDetails.accountType = 'Rewards';
      component.getStartDateEndDate();
      expect(component.getDataFromService).toBe(false);
   });
   it('get filtered date data when call api is false', () => {
      component.transactions = mockAccountTransactions;
      spyOn(component, 'searchForCasaAndCreditCard').and.callThrough();
      component.getDataFromService = false;
      component.fromDate = new Date('2018-07-30T02:00:00+02:00');
      component.toDate = new Date('2018-08-30T02:00:00+02:00');
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockAccountTransactions));
      component.getFilteredDateData(component.fromDate, component.toDate);
      expect(component.transactions).toBe(mockAccountTransactions);
   });
   it('get filter data based on amount', () => {
      component.transactions = mockAccountTransactions;
      component.getAmountRangeFilteredData(mockAccountTransactions, -1000, -2000);
      expect(component.transactions).toBe(mockAccountTransactions);
   });
   it('get filter data based on amount and amounts are 0', () => {
      component.transactions = mockAccountTransactions;
      component.getAmountRangeFilteredData(mockAccountTransactions, 0, 0);
      expect(component.transactions).toBe(mockAccountTransactions);
   });
   it('on click of cancel button', () => {
      component.transactions = mockAccountTransactions;
      accountServiceStub.transactionSearchMode.and.returnValue(false);
      component.goBack();
      expect(accountServiceStub.transactionSearchMode).toHaveBeenCalled();
   });
   it('on click of submit button', () => {
      component.transactions = mockAccountTransactions;
      component.showLoader = true;
      component.period = '30';
      component.isContextualGAEvent = true;
      component.submit();
      expect(component.showLoader).toBe(false);
      expect(component.isAdvancedSearch).toBe(false);
   });
   it('on click of submit button when amount from and amount to is not null', () => {
      component.transactions = mockAccountTransactions;
      component.showLoader = true;
      component.period = '30';
      component.amountFrom = '20';
      component.amountTo = '10';
      component.submit();
      expect(component.showLoader).toBe(false);
      expect(component.isAdvancedSearch).toBe(false);
   });
   it('on click of submit button when filter is not null', () => {
      component.transactions = mockAccountTransactions;
      spyOn(component, 'filterContentContextual').and.callThrough();
      component.showLoader = true;
      component.period = 'Custom';
      component.accountDetails.accountType = 'CA';
      component.getDataFromService = true;
      component.fromDate = new Date('2018-07-30T02:00:00+02:00');
      component.toDate = new Date('2018-08-30T02:00:00+02:00');
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockAccountTransactions));
      component.filter = 'PAY';
      component.submit();
      expect(component.showLoader).toBe(false);
   });
   it('on click of submit button when filter is not null and filter date data is not null', () => {
      spyOn(component, 'filterContentContextual').and.callThrough();
      component.transactions = mockAccountTransactions;
      component.period = '30';
      component.accountDetails.accountType = 'CC';
      component.amountFrom = '10';
      component.amountTo = '20';
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockAccountTransactions));
      component.filter = 'PAY';
      component.submit();
      expect(component.showLoader).toBe(false);
   });
   it('on click of submit button when filter is not null and filter date data is not null and amount is not null', () => {
      spyOn(component, 'filterContentContextual').and.callThrough();
      component.transactions = mockAccountTransactions;
      component.period = '30';
      component.accountDetails.accountType = 'CA';
      component.amountFrom = '10';
      component.amountTo = '20';
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockAccountTransactions));
      component.submit();
      expect(component.showLoader).toBe(false);
   });
   it('get filtered date data with resultDetails', () => {
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockAccountTransactionsWithResultData));
      component.submit();
      expect(component.showLoader).toBe(false);
   });
   it('google analytics advance search function called', () => {
      spyOn(component, 'sendEvent').and.callThrough();
      component.GAEventAdvanceSearch();
      expect(component.sendEvent).toHaveBeenCalled();
   });
   it('account type is rewards', () => {
      component.setErrorMessage('Points ');
      expect(component.amountLabel).toBe('Points ');
      expect(component.errorMessageFrom).toEqual('Points from should be less than Points up to');
   });
   it('account type is not rewards', () => {
      component.setErrorMessage('Amount ');
      expect(component.amountLabel).toBe('Amount ');
      expect(component.errorMessageFrom).toEqual('Amount from should be less than Amount up to');
   });
   it('selecting from date', () => {
      component.transactions = mockAccountTransactions;
      component.dateCount = 0;
      const value = new Date('2018-07-30T02:00:00+02:00');
      component.fromDate = value;
      component.setFromDate(value);
      expect(component.dateCount).toBe(1);
      expect(component.fromDate).toBe(value);
      expect(component.disableToCalendar).toBe(false);
   });
   it('set submit when from date and to date is not null', () => {
      component.fromDate = new Date('2018-07-30T02:00:00+02:00');
      component.toDate = new Date('2018-07-30T02:00:00+02:00');
      component.setSubmit();
      expect(component.disableSubmit).toBe(false);
   });
   it('set submit when submit has already been clicked', () => {
      component.fromDate = new Date('2018-07-30T02:00:00+02:00');
      component.toDate = new Date('2018-07-30T02:00:00+02:00');
      component.submitClicked = true;
      component.dateCount = 2;
      component.setSubmit();
      expect(component.disableSubmit).toBe(true);
   });
   it('call amount validation when amountTo is not null', () => {
      component.amountTo = '10';
      const value = component.amountValidation();
      expect(value).toBe(true);
   });
   it('call amount validation when amountTo is null', () => {
      component.amountTo = '';
      const value = component.amountValidation();
      expect(value).toBe(false);
   });
});

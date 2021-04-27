import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { AccountService } from '../account.service';
import { IDashboardAccount, IScheduledTransaction, IDashboardAccounts, IServiceProvider } from '../../core/services/models';
import { ScheduledCardComponent } from '../scheduled-card/scheduled-card.component';
import { BuyService } from '../../buy/buy-prepaid/buy.service';
import { ScheduledPaymentsComponent } from './scheduled-payments.component';

const mockAccountData: IDashboardAccount[] = [{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
},
{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '2',
   InterestRate: 0
}];

const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccountData,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];
const mockScheduledData: IScheduledTransaction[] = [
   {
      'batchID': 2060015,
      'transactionID': 29117114,
      'capturedDate': '2017-09-20T00:00:00',
      'startDate': '2017-09-20T00:00:00',
      'nextTransDate': '2017-09-20T00:00:00',
      'beneficiaryID': 0,
      'sortCode': '196005',
      'bFName': 'UNKNOWN',
      'myDescription': 'test',
      'beneficiaryDescription': 'test',
      'fromAccount': { 'accountNumber': '1713277581' },
      'toAccount': { 'accountNumber': '1042853096', accountType: 'CA' },
      'amount': 100.0,
      'reoccurrenceItem': {
         'reoccurrenceFrequency': 'Monthly',
         'recInstrID': 2050467,
         'reoccurrenceOccur': 12,
         'reoccOccurrencesLeft': 11,
         'reoccurrenceToDate': '2018-09-16T00:00:00',
         'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
      },
      'serviceProvider': 'VDC',
      'serviceProviderName': 'Vodacom'
   }];

const mockServiceProvidersData: IServiceProvider[] = [
   {
      'serviceProviderCode': 'CLC',
      'serviceProviderName': 'Cell C'
   },
   {
      'serviceProviderCode': 'VDC',
      'serviceProviderName': 'Vodacom'
   },
   {
      'serviceProviderCode': 'VGN',
      'serviceProviderName': 'Virgin'
   }
];

const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard/account/scheduled/:id', component: testComponent },
   { path: 'Mobile/:id', component: testComponent },
];

describe('ScheduledPaymentsComponent', () => {
   let component: ScheduledPaymentsComponent;
   let fixture: ComponentFixture<ScheduledPaymentsComponent>;


   const accountServiceStub = {

      getScheduledTransfer: jasmine.createSpy('getScheduledTransfer').and.returnValue(Observable.of(mockScheduledData)),

      getScheduledMobileTrasactions: jasmine.createSpy('getScheduledMobileTrasactions').and.returnValue(Observable.of(mockScheduledData)),

      getScheduledPayment: jasmine.createSpy('getScheduledPayment').and.returnValue(Observable.of(mockScheduledData)),

      getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),

      setAccountData: jasmine.createSpy('setAccountData'),

      getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData[0])

   };

   const buyServiceStub = {
      getServiceProviders: jasmine.createSpy('getServiceProviders').and.returnValue(Observable.of(mockServiceProvidersData))
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [ScheduledPaymentsComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: AccountService, useValue: accountServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }) } },
         { provide: BuyService, useValue: buyServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ScheduledPaymentsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be created when there is no data in service', () => {
      accountServiceStub.getAccountData.and.returnValue(undefined);
      expect(component).toBeTruthy();
   });
   it('should be created and ItemAccountId should get set on ngOnInit', () => {
      accountServiceStub.getAccountData.and.returnValue(mockAccountData);
      component.accountId = 1;
      component.ngOnInit();
      expect(component.ItemAccountId).toEqual(1);
   });
});

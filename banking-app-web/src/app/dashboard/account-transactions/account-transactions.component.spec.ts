import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange, EventEmitter } from '@angular/core';
import { assertModuleFactoryCaching } from './../../test-util';
import { AccountTransactionsComponent } from './account-transactions.component';
import { UpliftDormancyComponent } from './../uplift-dormancy/uplift-dormancy.component';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { AccountService } from '../account.service';
import {
   IClientDetails, IDashboardAccounts, ITransactionDetailsData, IDashboardAccount, ITransactionDetail
} from '../../core/services/models';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from './../../core/utils/constants';
import { AccountTransactionDetailsComponent } from '../account-transaction-details/account-transaction-details.component';
import { GaTrackingService } from '../../core/services/ga.service';

const mockAccounts: IDashboardAccount[] = [{
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
   AccountStatusCode: '10',
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
   InterestRate: 0,
   AccountStatusCode: '00',
},
{
   AccountName: 'Investment',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'INV',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '3',
   InterestRate: 0
}];

const mockaccountContainers: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccounts,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];

const mockTransactionDetailsData: ITransactionDetailsData = {
   accountContainers: mockaccountContainers,
   balance: 5000,
   itemAccountId: 1,
};

function getClientDetails(): IClientDetails {
   return {
      CisNumber: 110282180605,
      FirstName: 'Marc',
      SecondName: '',
      Surname: 'Schutte',
      FullNames: 'Mr Marc Schutte',
      CellNumber: '+27992180605',
      EmailAddress: '',
      BirthDate: '1977-03-04T22:00:00Z',
      FicaStatus: 701,
      SegmentId: 'AAAZZZ',
      IdOrTaxIdNo: 7703055072088,
      SecOfficerCd: '36407',
      AdditionalPhoneList: [
         {
            AdditionalPhoneType: 'BUS',
            AdditionalPhoneNumber: '(086) 1828828'
         },
         {
            AdditionalPhoneType: 'CELL',
            AdditionalPhoneNumber: '+27992180605'
         },
         {
            AdditionalPhoneType: 'HOME',
            AdditionalPhoneNumber: '(078) 2228519'
         }
      ],
      Address: {
         AddressLines: [
            {
               AddressLine: 'G12 KYLEMORE'
            },
            {
               AddressLine: 'THE MARINA RESIDENTS DOCK ROAD'
            },
            {
               AddressLine: 'WATERFRONT'
            }
         ],
         AddressCity: 'CAPE TOWN',
         AddressPostalCode: '08001'
      }
   };
}

const mockClientDetailsData = getClientDetails();
const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard/account/scheduled/:id', component: testComponent }
];

const clientPreferencesStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(mockClientDetailsData),
};
const mockTransactionsForShortDesc: ITransactionDetail[] = [{
   TransactionId: null,
   Description: 'Test MR bonus 3768000010300602; CELESTE FLORIST; Rand Value: R13821,26; 3770*******9478',
   Amount: 2764.0,
   Debit: false,
   Account: '841709000015',
   PostedDate: '2017-10-26 12:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 9298.0,
   Currency: 'MR',
   ShortDescription: null
}];
const mockTransactions: ITransactionDetail[] = [{
   TransactionId: null,
   Description: 'Test MR bonus 3768000010300602',
   Amount: 2764.0,
   Debit: false,
   Account: '841709000015',
   PostedDate: '2017-10-27 12:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 9298.0,
   Currency: 'GB',
   ShortDescription: null
}];

const mockTransactionWithoutDesc: ITransactionDetail[] = [{
   TransactionId: null,
   Description: null,
   Amount: 2764.0,
   Debit: false,
   Account: '841709000015',
   PostedDate: '2017-10-27 12:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 9298.0,
   Currency: 'GB',
   ShortDescription: null
}];

const accountServiceStub = {
   hasTransactionsAndDetailsForIS: jasmine.createSpy('hasTransactionsAndDetailsForIS').and.returnValue(false),
   setTransactionsForCASA: jasmine.createSpy('setTransactionsForCASA'),
   getTransactionsForCASA: jasmine.createSpy('getTransactionsForCASA').and.returnValue(mockTransactions),
   transactionSearchModeEmitter: new EventEmitter<boolean>(),
   transactionSearchMode: jasmine.createSpy('transactionSearchMode').and.returnValue(true)
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
describe('AccountTransactionsComponent', () => {
   let component: AccountTransactionsComponent;
   let fixture: ComponentFixture<AccountTransactionsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [AccountTransactionsComponent, AmountTransformPipe, SkeletonLoaderPipe, UpliftDormancyComponent,
            AccountTransactionDetailsComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [BsModalService,
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }) } },
            { provide: ClientProfileDetailsService, useValue: clientPreferencesStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: AccountService, useValue: accountServiceStub },
            AccountTransactionDetailsComponent],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountTransactionsComponent);
      component = fixture.componentInstance;
      component.transactions = [];
      component.itemAccountId = 1;
      component.accountDetails = {
         accountType: 'CA',
         parentSkeleton: true,
         itemAccountId: 1
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      accountServiceStub.transactionSearchModeEmitter.emit(true);
      component.ngOnChanges({ changes: new SimpleChange(null, null, null) });
      expect(component).toBeTruthy();
   });
   it('should check skeleton loading and transaction display on Account Change', () => {
      accountServiceStub.transactionSearchModeEmitter.emit(true);
      component.ngOnChanges({ transactions: true });
      component.transactions = null;
      component.ngOnChanges({ transactions: false });
   });

   it('should check account is dormant or not', () => {
      component.transactionDetailsData = mockTransactionDetailsData;
      component.getAccountStatus();
      expect(component.isDormantAccount).toBeTruthy();
   });

   it('should emit notification data from child to parent component', () => {
      const $event = {
         message: '',
         showMessage: true,
         isSuccess: true
      };
      spyOn(component.notifications, 'emit');
      component.notification($event);
      expect(component.notifications.emit).toHaveBeenCalled();
   });

   it('should verify the rewards transactions list size', () => {
      component.transactions = mockTransactions;
      component.accountType = 'Rewards';
      component.ngOnChanges({
         transactions: {
            firstChange: false
         }
      });
      expect(component.visibleTransactions.length).toBeGreaterThan(0);
   });

   it('should verify the empty rewards transactions list size', () => {
      component.transactions = null;
      component.accountType = 'Rewards';
      component.ngOnChanges({ transactions: true });
      expect(component.visibleTransactions.length).toBe(0);
   });

   it('should pickedup 2nd block of characters from transcation description', () => {
      component.transactions = mockTransactionsForShortDesc;
      component.visibleTransactions = mockTransactionsForShortDesc;
      component.setVisibileTransactionDescription();
      expect(component.visibleTransactions[0].Description).toBeDefined();
      expect(component.visibleTransactions[0].ShortDescription).toEqual('CELESTE FLORIST');

      component.visibleTransactions[0].Description = undefined;
      component.setVisibileTransactionDescription();
      expect(component.visibleTransactions[0].Description).toBeUndefined();
   });

   it('should pickedup as is description if there is no 2nd block in transaction description', () => {
      component.transactions = mockTransactions;
      component.visibleTransactions = mockTransactions;
      component.setVisibileTransactionDescription();
      expect(component.visibleTransactions[0].ShortDescription).toEqual('Test MR bonus 3768000010300602');
   });

   it('should return description if there is no value for short description', () => {
      component.transactions = mockTransactions;
      component.visibleTransactions = mockTransactions;
      component.setVisibileTransactionDescription();
      expect(component.visibleTransactions[0].ShortDescription).toEqual('Test MR bonus 3768000010300602');
   });
   it('transaction Search mode emitter', () => {
      const value = true;
      accountServiceStub.transactionSearchModeEmitter.subscribe(data => {
         component.setSearchMode(value);
         expect(component.searchEnabled).toBe(value);
      });
   });
   it('is transaction applicable', () => {
      component.visibleTransactions = mockTransactions;
      component.accountType = 'CA';
      component.showTransactionSearch = true;
      const value = component.isTransactionSearchApplicable();
      expect(value).toBe(true);
   });
   it('should set search mode', () => {
      const value = true;
      component.setSearchMode(value);
      expect(component.searchEnabled).toBe(value);
   });
   it('should set search view', () => {
      component.searchEnabled = true;
      component.setSearchView();
      expect(component.searchEnabled).toBe(false);
   });

   it('should get currency name', () => {
         expect(component.getCurrencyName('USD')).toEqual(Constants.currencies['USD'].fullName);
   });

   it('should get currency symbol', () => {
         expect(component.getCurrencySymbol('USD')).toEqual(Constants.currencies['USD'].symbol);
   });
});

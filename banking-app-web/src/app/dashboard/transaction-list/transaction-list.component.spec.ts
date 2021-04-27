import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../test-util';
import { AccountService } from '../account.service';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { TruncateDescriptionPipe } from '../../shared/pipes/truncate-description.pipe';
import { TransactionListComponent } from './transaction-list.component';
import { ITransactionAccountDetails, IDashboardAccount } from '../../core/services/models';
import { GaTrackingService } from '../../core/services/ga.service';
const mockClubAccount: IDashboardAccount = {
   AccountName: 'EARLSMERE',
   Balance: 0.0,
   AvailableBalance: 0.0,
   AccountNumber: 8966219016001,
   AccountType: 'SA',
   AccountIcon: '',
   NewAccount: true,
   LastUpdate: '2018-06-26 07:05:20 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '6',
   InterestRate: 0.0,
   IsShow: false,
   IsProfileAccount: true,
   ProductType: '33',
   Pockets: []
};
const accountServiceStub = {
   hasTransactionsAndDetailsForIS: jasmine.createSpy('hasTransactionsAndDetailsForIS').and.returnValue(false),
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockClubAccount)
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('TransactionListComponent', () => {
   let component: TransactionListComponent;
   let fixture: ComponentFixture<TransactionListComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TransactionListComponent, SkeletonLoaderPipe, TruncateDescriptionPipe, AmountTransformPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: AccountService, useValue: accountServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TransactionListComponent);
      component = fixture.componentInstance;
      component.transactions = [];
      component.accountDetails = {
         accountType: 'CA',
         itemAccountId: 2,
         parentSkeleton: false,
         searchEnabled: undefined
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('show expand the first transaction detail', () => {
      component.accountDetails.accountType = 'Rewards';
      component.hasTransactionsAndDetailsForIS = true;
      component.setTransactionDetails(0);
      expect(component.selectedIndex).toBe(0);
   });

   it('do not show transaction detail', () => {
      component.accountDetails.accountType = 'CC';
      component.hasTransactionsAndDetailsForIS = false;
      component.setTransactionDetails(0);
      expect(component.selectedIndex).toBeUndefined();
   });

   it('show expand the selected transaction detail and close the previous', () => {
      component.accountDetails.accountType = 'Rewards';
      component.selectedIndex = 5;
      component.hasTransactionsAndDetailsForIS = true;
      component.setTransactionDetails(3);
      expect(component.selectedIndex).toBe(3);
   });

   it('close the transaction detail expanded window', () => {
      component.accountDetails.accountType = 'Rewards';
      component.selectedIndex = 4;
      component.hasTransactionsAndDetailsForIS = true;
      component.closeTransactionDetails(4);
      expect(component.selectedIndex).toBe(null);
   });

   it('do not close the transaction detail expanded window if account is not changed and is lazy loading', () => {
      component.accountDetails.accountType = 'CA';
      component.selectedIndex = 4;
      component.hasTransactionsAndDetailsForIS = true;
      component.ngOnChanges({ transactions: true });
      expect(component.selectedIndex).toBe(4);
      expect(component.accountDetails.itemAccountId).toBe(2);
   });
   it('do not close the transaction detail expanded window if account is not changed and is lazy loading', () => {
      component.accountDetails.accountType = 'Rewards';
      component.selectedIndex = 4;
      component.hasTransactionsAndDetailsForIS = true;
      component.ngOnChanges({ transactions: true });
      expect(component.selectedIndex).toBe(null);
      expect(component.accountDetails.itemAccountId).toBe(2);
   });

   it('do close the transaction detail expanded window if account has changed and is lazy loading', () => {
      component.accountDetails.itemAccountId = 2;
      component.selectedIndex = 4;
      component.hasTransactionsAndDetailsForIS = true;
      component.ngOnChanges({
         transactions: true,
         itemAccountId: {
            currentValue: 2,
            firstChange: false,
            previousValue: 1
         }
      });
      expect(component.selectedIndex).toBe(null);
      expect(component.accountDetails.itemAccountId).toBe(2);
   });
});

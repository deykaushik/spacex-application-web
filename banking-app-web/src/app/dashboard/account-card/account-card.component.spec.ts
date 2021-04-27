import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { BsModalService } from 'ngx-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { assertModuleFactoryCaching } from './../../test-util';

import { AccountService } from '../account.service';
import { TermsService } from './../../shared/terms-and-conditions/terms.service';
import { PreFillService } from '../../core/services/preFill.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { AccountDetailComponent } from '../account-detail/account-detail.component';
import { AccountCardComponent } from './account-card.component';
import { LandingComponent } from '../landing/landing.component';
import { AccountBalanceDetailComponent } from '../account-balance-detail/account-balance-detail.component';
import { IAccountConfig } from './../dashboard.model';
import {
   IDashboardAccount, IDashboardAccounts, IAccountBalanceDetail,
   ISettlementFeatureVisibleProps, IFicaResult
} from '../../core/services/models';
import { SharedModule } from '../../shared/shared.module';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';

const mockAccounts: IDashboardAccount[] = [{
   AccountName: 'Inv CA1',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'SA',
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
},
{
   AccountName: 'Inv CA0',
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
   AccountName: 'Inv NGI',
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
   ItemAccountId: '4',
   InterestRate: 0
}];
const mockHomeLoanAccount: IDashboardAccount = {
   AccountName: 'EARLSMERE',
   Balance: 0.0,
   AvailableBalance: 0.0,
   AccountNumber: 8966219016001,
   AccountType: 'HL',
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
   ProductType: ' ',
   Pockets: []
   };

const mockRewardsAccounts: IDashboardAccount[] = [{
   AccountName: 'Greenbacks',
   Balance: 2196,
   AvailableBalance: 61,
   AccountNumber: 601710000004,
   AccountType: 'Rewards',
   AccountIcon: null,
   NewAccount: null,
   LastUpdate: null,
   InstitutionName: null,
   Currency: 'GB',
   SiteId: null,
   ItemAccountId: '5',
   InterestRate: null,
   RewardsProgram: 'GB'
}, {
   AccountName: 'Amex membership',
   Balance: 2196,
   AvailableBalance: null,
   AccountNumber: 601710000004,
   AccountType: 'Rewards',
   AccountIcon: null,
   NewAccount: null,
   LastUpdate: null,
   InstitutionName: null,
   Currency: 'MR',
   SiteId: null,
   ItemAccountId: '6',
   InterestRate: null,
   RewardsProgram: 'MR'
}, {
   AccountName: 'Miles rewards',
   Balance: 2196,
   AvailableBalance: null,
   AccountNumber: 601710000004,
   AccountType: 'Rewards',
   AccountIcon: null,
   NewAccount: null,
   LastUpdate: null,
   InstitutionName: null,
   Currency: null,
   SiteId: null,
   ItemAccountId: '7',
   InterestRate: null,
   RewardsProgram: 'Miles'
},
{
   AccountName: 'Miles rewards',
   Balance: 2196,
   AvailableBalance: null,
   AccountNumber: 601710000004,
   AccountType: 'DS',
   AccountIcon: null,
   NewAccount: null,
   LastUpdate: null,
   InstitutionName: null,
   Currency: null,
   SiteId: null,
   ItemAccountId: '7',
   InterestRate: null,
   RewardsProgram: 'Miles'
}];

const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccounts,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}, {
   ContainerName: 'Rewards',
   Accounts: mockRewardsAccounts,
   ContainerIcon: null,
   Assets: null
}, {
   ContainerName: 'Investments',
   Accounts: mockAccounts,
   ContainerIcon: null,
   Assets: null
}];

const mockAccountConfig: IAccountConfig[] = [{
   type: 'Card',
   title: 'Credit Cards',
   currentBalance: 'Current Balance',
   availableBalance: 'Available Balance'
}, {
   type: 'Investment',
   title: 'Investments',
   currentBalance: 'Current Balance',
   availableBalance: 'Available Balance'
}, {
   type: 'Rewards',
   title: 'Rewards',
   currentBalance: 'Rewards balance',
   availableBalance: 'Rand value'
}];

const mockbuildingBalanceData: IAccountBalanceDetail = {
   accountName: 'BOND A/C',
   accountNumber: '8605376000101',
   accountType: 'HL',
   currency: '&#x52;',
   outstandingBalance: 1.17,
   nextInstallmentAmount: 3519.45,
   amountInArrears: -181726.91,
   nextPaymentDue: 3519.45,
   nextPaymentDate: '2018-05-01T05:30:00+05:30',
   interestRate: 8.25,
   loanAmount: 405000,
   email: 'test@gmail.com',
   paymentTerm: '240',
   termRemaining: '64 months',
   balanceNotPaidOut: 10000,
   registeredAmount: 405000,
   accruedInterest: 0,
   isSingleBond: true,
   isJointBond: false,
   PropertyAddress: '6, WABOOM, 40672, Sandton',
   nameAndSurname: 'Mr Brian Bernard Sheinuk',
   contactNumber: '+27991365718'
};

const mockbuildingData: IAccountBalanceDetail = {
      accountName: 'BOND A/C',
      accountNumber: '8605376000101',
      accountType: 'HL',
      currency: '&#x52;',
      outstandingBalance: 1.17,
      nextInstallmentAmount: 3519.45,
      amountInArrears: -181726.91,
      nextPaymentDue: 3519.45,
      nextPaymentDate: '2018-05-01T05:30:00+05:30',
      interestRate: 8.25,
      loanAmount: 405000,
      email: 'test@gmail.com',
      paymentTerm: '240',
      termRemaining: '64 months',
      balanceNotPaidOut: 10000,
      registeredAmount: 405000,
      accruedInterest: 0,
      isSingleBond: false,
      isJointBond: false,
      PropertyAddress: '6, WABOOM, 40672, Sandton',
      nameAndSurname: 'Mr Brian Bernard Sheinuk',
      contactNumber: '+27991365718'
};

const mockAccountBalanceDetails: IAccountBalanceDetail = {
   movementsDue: 0,
   unclearedEffects: 0,
   accruedFees: 0,
   pledgedAmount: 0,
   crInterestDue: 0,
   crInterestRate: 0,
   dbInterestDue: 0,
   overdraftLimit: 10000,
   dbInterestRate: 16.25
};

const mockFicaResult: IFicaResult[] = [{
   isFica: true,
},
{
   isFica: false,
}];

const accountServiceStub = {
   getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),
   getAccountConfig: jasmine.createSpy('getAccountConfig').and.returnValue(mockAccountConfig[0]),
   getNgiAccountConfig: mockAccountConfig[1],
   getRewardsAccountConfig: mockAccountConfig[2],
   setAccountData: jasmine.createSpy('setAccountData'),
   getficaStatus: jasmine.createSpy('getficaStatus').and.returnValue(Observable.of(mockFicaResult[0])),
   getFicaFalse: mockFicaResult[1],
   getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail').and.returnValue(Observable.of(mockAccountBalanceDetails)),
   hasTransactionsAndDetailsForIS: jasmine.createSpy('hasTransactionsAndDetailsForIS').and.returnValue(true),
};

const testComponent = class { };
const routes: Routes = [
   { path: '', component: testComponent },
   { path: 'account/detail/:accountId', component: testComponent }
];
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('AccountCardComponent', () => {
   let component: AccountCardComponent;
   let fixture: ComponentFixture<AccountCardComponent>;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [RouterTestingModule.withRoutes(routes)],
         declarations: [AccountCardComponent, SkeletonLoaderPipe, AmountTransformPipe],
         providers: [
            { provide: AccountService, useValue: accountServiceStub },
            PreFillService,
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountCardComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      component.accountContainers = mockDashboardAccounts;
      component.itemAccountId = '1';
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should change account on account click from dropdown', () => {
      component.accountChange.subscribe(data => {
         expect(data).toBe(mockAccounts[1]);
      });
      component.onAccountChange(mockAccounts[1]);
      expect(component.accountInfo).toBe(mockAccounts[1]);
   });

   it('should close the page', () => {
      component.closeOverlay(true);
      expect(component.showReasonError).toBe(true);
   });

   it('should call noticeWithdrawal on click on notice of withdrawal', () => {
      component.noticeWithdrawal();
      component.noticeWithdrawalFlag.subscribe(data => {
         expect(data).toBe(true);
      });
   });

   it('should set fica status to true', () => {
      component.allNotices  = [{
       nickname: 'Alroy'
      }];
      accountServiceStub.getficaStatus.and.returnValue(Observable.of(accountServiceStub.getFicaFalse));
      component.noticeWithdrawal();
      expect(component.showReasonError).toBe(true);
   });

   it('should sort the accounts', () => {
      component.processDropdownData();
      expect(component.dropdownAccounts[0]).toBe(mockAccounts[2]);
   });

   it('should load greenback rewards account', () => {
      component.itemAccountId = '5';
      component.isNow = true;
      accountServiceStub.getAccountConfig.and.returnValue(accountServiceStub.getRewardsAccountConfig);
      component.processData();
      expect(component.accountInfo).toBe(mockRewardsAccounts[0]);
      expect(component.accountConfig.currentBalance).toBe('Greenbacks balance');
      expect(component.isBalanceDetailAvailable).toBe(false);
   });

   it('should load greenback rewards account', () => {
      component.isNow = true;
      component.accountInfo = mockRewardsAccounts[3];
      component.isNoticeofWithdrawal();
      expect(component.isWithdrawBtnShow).toBe(true);
   });

   it('should load amex rewards account', () => {
      component.itemAccountId = '6';
      component.isNow = true;
      component.accountInfo = mockRewardsAccounts[3];
      accountServiceStub.getAccountConfig.and.returnValue(accountServiceStub.getRewardsAccountConfig);
      component.processData();
      expect(component.accountInfo).toBe(mockRewardsAccounts[1]);
      expect(component.accountConfig.currentBalance).toBe('Amex Membership rewards balance');
      expect(component.isBalanceDetailAvailable).toBe(false);
   });

   it('should set headers for inv ngi account', () => {
      component.itemAccountId = '4';
      component.isNow = true;
      component.accountInfo = mockRewardsAccounts[3];
      accountServiceStub.getAccountConfig.and.returnValue(accountServiceStub.getNgiAccountConfig);
      component.processData();
      expect(component.accountInfo).toBe(mockAccounts[3]);
      expect(component.accountConfig.currentBalance).toBe('Market value');
      expect(component.isBalanceDetailAvailable).toBe(true);
   });

   it('should return true if it is my pockets account else return false', () => {
      expect(component.isMyPocketsAccount('SA', '25')).toBe(true);
      expect(component.isMyPocketsAccount('SA', '001')).toBe(false);
   });

   it('should return correct account type style for different account types', () => {
      expect(component.getAccountTypeStyle('CA')).toBe('current');
      expect(component.getAccountTypeStyle('SA')).toBe('savings');
      expect(component.getAccountTypeStyle('SA', 'ClubAccount')).toBe('club-accounts');
      expect(component.getAccountTypeStyle('')).toBe('default');
   });

   it('should navigate on settle loan click', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.onSettleLoanClick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/settlement/direct-pay/1');
   });
   it('should navigate on back to overview click', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.backToOverview();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   });
   it('should return true if home loan', () => {
      component.accountInfo = mockHomeLoanAccount;
      expect(component.isHomeLoan()).toBe(true);
   });
   it('should return false when check building loan account', () => {
      component.buildingLoanAccount = mockbuildingData;
      component.accountInfo = mockHomeLoanAccount;
      expect(component.isBuildingLoan()).toBe(false);
   });
   it('should return true when check building loan account', () => {
      component.buildingLoanAccount = mockbuildingBalanceData;
      component.accountInfo = mockHomeLoanAccount;
      expect(component.isBuildingLoan()).toBe(true);
   });

   it('should show settle loan', () => {
      const settlementFeatureProps = {} as ISettlementFeatureVisibleProps;
      settlementFeatureProps.showSettleLoanBtn = true;
      component.settlementFeatureProps = settlementFeatureProps;
      expect(component.showSettleLoan()).toBe(true);
   });

   it('should not show settle loan', () => {
      const settlementFeatureProps = {} as ISettlementFeatureVisibleProps;
      settlementFeatureProps.showSettleLoanBtn = false;
      component.settlementFeatureProps = settlementFeatureProps;
      expect(component.showSettleLoan()).toBe(false);
   });

   it('should show settlemnt amount and error', () => {
      const settlementFeatureProps = {} as ISettlementFeatureVisibleProps;
      settlementFeatureProps.showError = true;
      settlementFeatureProps.showAmount = true;
      component.settlementFeatureProps = settlementFeatureProps;
      expect(component.handleSettlementProps()).toBe(true);
   });

   it('should not show settle amount and error', () => {
      const settlementFeatureProps = {} as ISettlementFeatureVisibleProps;
      settlementFeatureProps.showError = false;
      settlementFeatureProps.showAmount = false;
      component.settlementFeatureProps = settlementFeatureProps;
      expect(component.handleSettlementProps()).toBe(false);
   });

});

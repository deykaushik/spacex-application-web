import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../test-util';
import { AccountBalanceDetailComponent } from './account-balance-detail.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { AccountService } from '../account.service';
import { Observable } from 'rxjs/Observable';
import { IAccountBalanceDetail, IBalanceDetailsChangeLabel, IInvestmentDetailsList, IDashboardAccount } from '../../core/services/models';
import { expand } from 'rxjs/operator/expand';
import { KeyValueMapPipe } from '../../shared/pipes/key-value-map.pipe';
import { CommonUtility } from '../../core/utils/common';
import { Constants } from '../../core/utils/constants';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { GaTrackingService } from './../../core/services/ga.service';

const investmentDetailsList: IInvestmentDetailsList[] = [{
   currentBalance: 2618759.14,
   additionalDeposit: 100,
   availableBalance: 20,
   availableWithdrawal: 0,
   bonusPercentage: 0,
   currency: '&#x24;',
   dateOfOpening: '',
   depositFrequency: 0,
   initialDeposit: 0,
   interestFrequency: '',
   interestRate: 0,
   investmentAccountType: 'FIX',
   investmentNumber: '010900100',
   investmentProductName: 'Investment details list',
   investmentProductType: null,
   investmentTerm: null,
   payOutDate: '',
   reservedForRelease: 0,
   termRemaining: null,
   totalInterestPaid: 1000,
   withdrawalFrequency: 2
}];
const mockBalanceDetail: IAccountBalanceDetail = {
   movementsDue: -10000.0,
   unclearedEffects: 0.0,
   accruedFees: 0.0,
   pledgedAmount: 0.0,
   crInterestDue: 1482.96,
   crInterestRate: 1.0,
   overdraftLimit: 15900.0,
   dbInterestDue: 0.0,
   dbInterestRate: 9.25,
   accountType: 'CA',
   paymentDueDate: '2001-01-01T12:00:00',
   investmentDetailsList: investmentDetailsList
};

const mockBalanceDetailsDS: IAccountBalanceDetail = {
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
   isOverDraftAccount: jasmine.createSpy('isOverDraftAccount').and.returnValue(Observable.of(true)),
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockClubAccount),
   getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail').and.returnValue(Observable.of(mockBalanceDetail)),
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('AccountBalanceDetailComponent', () => {
   let component: AccountBalanceDetailComponent;
   let fixture: ComponentFixture<AccountBalanceDetailComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [CollapseModule, RouterTestingModule],
         declarations: [AccountBalanceDetailComponent, SkeletonLoaderPipe, AmountTransformPipe, KeyValueMapPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: AccountService, useValue: accountServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountBalanceDetailComponent);
      component = fixture.componentInstance;
      component.changeLabel = { label: null };
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should view more balances', () => {
      component.isOpen = false;
      component.accountType = 'CA';
      component.itemAccountId = 2;
      fixture.detectChanges();
      component.handleBalanceDisplay(true);
      expect(component.title).toEqual('COLLAPSE MORE BALANCES');
   });

   it('should check balance detail on Account change', () => {
      const balanceDetailProps = {
         firstChange: false,
         currentValue: {
            itemAccountId: 1,
            isDormantAccount: true
         },
         previousValue: 3
      };
      component.balanceDetailProps = {
         itemAccountId: 1,
         accountType: 'CA',
         containerName: 'bank',
         isDormantAccount: true
      };
      component.isOpen = true;
      component.ngOnChanges({ balanceDetailProps });
      expect(component.itemAccountId).toEqual(1);
   });

   it('should not call balance detail on Account change If it is not in collapse mode', () => {
      const balanceDetailProps = {
         firstChange: false,
         currentValue: {
            itemAccountId: 1,
            isDormantAccount: true
         },
         previousValue: 3
      };
      component.balanceDetailProps = {
         itemAccountId: 1,
         accountType: 'CA',
         containerName: 'bank',
         isDormantAccount: true
      };
      component.isOpen = false;
      component.ngOnChanges({ balanceDetailProps });
      expect(component.isSkeletonMode).toBe(true);

      balanceDetailProps.firstChange = true;
      component.ngOnChanges({ balanceDetailProps });
      expect(component.isSkeletonMode).toBe(false);
   });

   it('should not set isOverDraft flag for savings account', () => {
      component.accountType = component.accountTypes.savingAccountType.code;
      component.getAccountBalanceDetail();
      expect(component.isOverDraft).toBeFalsy();
   });
   it('should set flag to show fixed investment balance details', () => {
      component.accountType = component.accountTypes.investmentAccountType.code;
      component.setDetailedBalanceView(mockBalanceDetailsDS);
      expect(component.toShowPropertiesOnView).toEqual(['totalInterestPaid', 'reservedForRelease', 'accruedInterest', 'dateOfOpening',
         'interestRate', 'payOutDate', 'interestFrequency', 'investmentTerm', 'termRemaining',
         'availableWithdrawal', 'bonusPercentage']);
      expect(component.propertyToApplyFilter).toEqual({
         date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate', 'bonusPercentage'],
         noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
      });
   });
   it('should set flag to show linked investment balance details', () => {
      mockBalanceDetailsDS.investmentAccountType = component.investmentType.linkedInv;
      component.accountType = component.accountTypes.investmentAccountType.code;
      component.setDetailedBalanceView(mockBalanceDetailsDS);
      expect(component.toShowPropertiesOnView).toEqual(['dateOfOpening', 'payOutDate', 'interestRate', 'interestFrequency',
         'investmentTerm', 'termRemaining', 'reservedForRelease', 'totalInterestPaid', 'additionalDeposit',
         'availableWithdrawal']);
      expect(component.propertyToApplyFilter).toEqual({
         date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate'],
         noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
      });
   });

   it('should set flag to show all other investment balance details', () => {
      mockBalanceDetailsDS.investmentAccountType = component.investmentType.noticeInv;
      component.accountType = component.accountTypes.investmentAccountType.code;
      component.setDetailedBalanceView(mockBalanceDetailsDS);
      expect(component.toShowPropertiesOnView).toEqual(['dateOfOpening', 'interestRate', 'payOutDate', 'totalInterestPaid',
         'reservedForRelease']);
      expect(component.propertyToApplyFilter).toEqual({ date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate'] });
   });

   it('should set flag to show current account with overdraft balance details', () => {
      component.isOverDraft = accountServiceStub.isOverDraftAccount();
      component.accountType = 'CA';
      component.setDetailedBalanceView(mockBalanceDetail);
      expect(component.toShowPropertiesOnView).toEqual(['movementsDue', 'unclearedEffects', 'accruedFees', 'pledgedAmount',
         'crInterestDue', 'dbInterestDue']);
      expect(component.propertyLabels).toEqual([{ prop: 'crInterestDue', append: 'crInterestRate' },
      { prop: 'dbInterestDue', append: 'dbInterestRate' }]);
   });

   it('should set flag to show casa account with/o overdraft balance details', () => {
      component.isOverDraft = false;
      component.accountType = 'SA';
      component.setDetailedBalanceView(mockBalanceDetail);
      expect(component.toShowPropertiesOnView).toEqual(['movementsDue', 'unclearedEffects', 'accruedFees',
         'pledgedAmount', 'crInterestDue']);
      expect(component.propertyLabels).toEqual([{ prop: 'crInterestDue', append: 'crInterestRate' }]);
   });

   it('should return correct account type style for different account types', () => {
      expect(component.getAccountTypeStyle('CA')).toBe('current');
      expect(component.getAccountTypeStyle('SA')).toBe('savings');
      expect(component.getAccountTypeStyle('SA', 'ClubAccount')).toBe('club-accounts');
      expect(component.getAccountTypeStyle('CFC')).toBe('foreign');
      expect(component.getAccountTypeStyle('TD')).toBe('investment');
      expect(component.getAccountTypeStyle('DS')).toBe('investment');
      expect(component.getAccountTypeStyle('INV')).toBe('investment');
   });

   it('Navigate to overdraft screen', () => {

      const spy = spyOn(router, 'navigateByUrl');
      component.itemAccountId = 1;
      component.onOverdraftClick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/overdraft/limit-view/1');
   });

   it('should set label to be changed for DS investments for balance details', () => {
      component.isOverDraft = false;
      component.accountType = 'TD';
      component.setDetailedBalanceView(mockBalanceDetail);
      expect(component.changeLabel).toEqual({ label: ['totalInterestPaid', 'interestPaidToDate'] });
   });
   it('should set label to be changed for mfc vaf loan for balance details', () => {
      component.isOverDraft = false;
      component.accountType = 'IS';
      component.setDetailedBalanceView(mockBalanceDetail);
      expect(component.changeLabel).toEqual({ label: ['paymentDueDate', 'balloonPaymentDueDate'] });
   });
});

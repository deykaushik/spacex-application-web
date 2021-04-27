import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from './../../test-util';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { AccountShareComponent } from './account-share.component';
import { AccountShareStatusComponent } from './account-share-status/account-share-status.component';
import { AccountService } from '../account.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { IClientDetails, IUniversalBranchCode, IClientAccountDetail, IAccountBalanceDetail } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';

const mockClientDetails: IClientDetails = {
   DefaultAccountId: '2',
   CisNumber: 12000036423,
   FirstName: 'June',
   SecondName: 'Bernadette',
   Surname: 'Metherell',
   FullNames: 'Mrs June Bernadette Metherell',
   CellNumber: '+27994583427',
   EmailAddress: '',
   BirthDate: '1957-04-04T22:00:00Z',
   FicaStatus: 701,
   SegmentId: 'CEBZZZ',
   IdOrTaxIdNo: 5704050086083,
   SecOfficerCd: '11905',
   AdditionalPhoneList: [{
      AdditionalPhoneType: 'BUS',
      AdditionalPhoneNumber: '(011) 4729828'
   }, {
      AdditionalPhoneType: 'CELL',
      AdditionalPhoneNumber: '+27994583427'
   }, {
      AdditionalPhoneType: 'HOME',
      AdditionalPhoneNumber: '(011) 4729828'
   }],
   Address: {
      AddressLines: [{
         AddressLine: '4 OLGA STREET'
      }, {
         AddressLine: 'FLORIDA EXT 4'
      }, {
         AddressLine: 'FLORIDA'
      }],
      AddressPostalCode: '01709'
   }
};

function getUniveralBranchCodes(): IUniversalBranchCode[] {
   return [{
      accountType: 'CA',
      branchCode: '198765'
   }, {
      accountType: 'SA',
      branchCode: '198765'
   }, {
      accountType: 'HL',
      branchCode: '170305'
   }, {
      accountType: 'PL',
      branchCode: '198765'
   }];
}

const mockUniversalBranchCodes: IUniversalBranchCode[] = getUniveralBranchCodes();

const mockClientAccountDetails: IClientAccountDetail = {
   AccountHolderName: 'James Bob',
   IsAlternateAccount: true
};

const mockAccountBalanceDetails: IAccountBalanceDetail = {
   accountHolderName: 'Bob James'
};


const clientProfileDetailsSuccessServiceStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(mockClientDetails),
};

const clientProfileDetailsFailedServiceStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(undefined),
};

const accountServiceSuccessStub = {
   getUniversalBranchCodes: jasmine.createSpy('getUniversalBranchCodes').and.returnValue(Observable.of(mockUniversalBranchCodes)),
   isPrimaryAccount: jasmine.createSpy('isPrimaryAccount').and.returnValue(true),
   getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail').and.returnValue(Observable.of(mockAccountBalanceDetails)),
   getAccountDetails: jasmine.createSpy('getAccountDetails').and.returnValue(Observable.of(mockClientAccountDetails))
};

const accountServiceFailureStub = {
   getUniversalBranchCodes: jasmine.createSpy('getUniversalBranchCodes').and.returnValue(Observable.of(undefined))
};

const accountTypes = Constants.VariableValues.accountTypes;

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('AccountShareComponent', () => {
   let component: AccountShareComponent;
   let fixture: ComponentFixture<AccountShareComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         schemas: [NO_ERRORS_SCHEMA],
         declarations: [AccountShareComponent, AccountShareStatusComponent, SkeletonLoaderPipe],
         providers: [{ provide: ClientProfileDetailsService, useValue: clientProfileDetailsSuccessServiceStub },
         { provide: AccountService, useValue: accountServiceSuccessStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountShareComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      component.accountType = accountTypes.currentAccountType.code;
      component.accountNumber = '1009017640';
      component.accountId = 1;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should open account share modal', () => {
      component.openAccountShareModal();
      expect(component.isOverlayView).toBe(true);
      expect(component.buttonText).toBe('Cancel');
   });

   it('should close account share model', () => {
      const spy = spyOn(router, 'navigateByUrl');

      component.closeAccountShareModal();
      expect(component.isOverlayView).toBe(false);

      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/detail/1');
   });

   /* This spec is used to verify the business rule of account share,
      that is account type is not CASA, Home Loan or Personal loan
      then account share function must not appear. */
   it('should verify the account share type', () => {
      component.verifyAccountShareType(accountTypes.currentAccountType.code);
      expect(component.isShareAccount).toBe(true);

      component.verifyAccountShareType(accountTypes.savingAccountType.code);
      expect(component.isShareAccount).toBe(true);

      component.verifyAccountShareType(accountTypes.homeLoanAccountType.code);
      expect(component.isShareAccount).toBe(true);

      component.verifyAccountShareType(accountTypes.personalLoanAccountType.code);
      expect(component.isShareAccount).toBe(true);

      component.verifyAccountShareType(accountTypes.investmentAccountType.code);
      expect(component.isShareAccount).toBe(false);
   });

   it('should return the universal branch code and account holder name based on an account type', () => {
      component.accountType = accountTypes.currentAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('198765');
      expect(component.sharedAccountDetails.accountName).toBe('June Metherell');

      component.accountType = accountTypes.savingAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('198765');
      expect(component.sharedAccountDetails.accountName).toBe('June Metherell');

      component.accountType = accountTypes.personalLoanAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('198765');
      expect(component.sharedAccountDetails.accountName).toBe('June Metherell');

      component.accountType = accountTypes.homeLoanAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('170305');
      expect(component.sharedAccountDetails.accountName).toBe('Bob James');

      component.accountType = accountTypes.investmentAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('');
      expect(component.sharedAccountDetails.accountName).toBe('June Metherell');
   });

   it('should return an account type description based on account type', () => {
      component.accountType = accountTypes.currentAccountType.code;
      expect(component.getAccountTypeDesc()).toBe('Current account');

      component.accountType = accountTypes.savingAccountType.code;
      expect(component.getAccountTypeDesc()).toBe('Savings account');

      component.accountType = accountTypes.personalLoanAccountType.code;
      expect(component.getAccountTypeDesc()).toBe('Personal loan');

      component.accountType = accountTypes.homeLoanAccountType.code;
      expect(component.getAccountTypeDesc()).toBe('Home loan');

      component.accountType = accountTypes.investmentAccountType.code;
      expect(component.getAccountTypeDesc()).toBe('Investment account');
   });

   it('should return an account holder name', () => {
      expect(component.getAccountHolderNameFromClientDetails('Jhon', 'Smith')).toBe('Jhon Smith');
   });

   it('should return first name as account holder name If surname is not present', () => {
      expect(component.getAccountHolderNameFromClientDetails('Jhon', null)).toBe('Jhon');
   });

   it('should return first name as account holder name If surname has white spaces', () => {
      expect(component.getAccountHolderNameFromClientDetails('Jhon', ' ')).toBe('Jhon');
   });

   it('should return surname name as account holder name If firstname is not present', () => {
      expect(component.getAccountHolderNameFromClientDetails(null, 'Smith')).toBe('Smith');
   });

   it('should return surname name as account holder name If firstname has white spaces', () => {
      expect(component.getAccountHolderNameFromClientDetails(' ', 'Smith')).toBe('Smith');
   });

   it('should return empty name as account holder name If first and surname are not present', () => {
      expect(component.getAccountHolderNameFromClientDetails(null, null)).toBe('');
   });

   it('should return the universal branch code and account holder name based on an account type and alternate account', () => {
      accountServiceSuccessStub.isPrimaryAccount.and.returnValue(false);

      component.accountType = accountTypes.currentAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('198765');
      expect(component.sharedAccountDetails.accountName).toBe('James Bob');

      component.accountType = accountTypes.savingAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('198765');
      expect(component.sharedAccountDetails.accountName).toBe('James Bob');

      component.accountType = accountTypes.personalLoanAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('198765');
      expect(component.sharedAccountDetails.accountName).toBe('Bob James');

      component.accountType = accountTypes.homeLoanAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('170305');
      expect(component.sharedAccountDetails.accountName).toBe('Bob James');

      component.accountType = accountTypes.investmentAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.branchCode).toBe('');
      expect(component.sharedAccountDetails.accountName).toBe('June Metherell');
   });

   it('account holder name should be empty for account detail data is null/undefined', () => {
      component.sharedAccountDetails.accountName = '';
      accountServiceSuccessStub.getAccountDetails.and.returnValue(Observable.of(null));
      accountServiceSuccessStub.isPrimaryAccount.and.returnValue(false);
      component.accountType = accountTypes.currentAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.accountName).toBe('');
   });

   it('account holder name should be empty for balance details data is null/undefined', () => {
      component.sharedAccountDetails.accountName = '';
      accountServiceSuccessStub.getAccountBalanceDetail.and.returnValue(Observable.of(null));
      accountServiceSuccessStub.isPrimaryAccount.and.returnValue(false);
      component.accountType = accountTypes.personalLoanAccountType.code;
      component.getUniversalBranchCodeAndHolderName();
      expect(component.sharedAccountDetails.accountName).toBe('');
   });

   it('should change the overlay button text to Close', () => {
      component.onStatus(true);
      expect(component.buttonText).toBe('Close');
   });

   it('should not change the overlay button text to Close', () => {
      component.onStatus(false);
      expect(component.buttonText).not.toBe('Close');
   });

   it('should change the overlay button text to Cancel', () => {
      component.onStatus(false);
      expect(component.buttonText).toBe('Cancel');
   });

});

describe('AccountShareComponent', () => {
   let component: AccountShareComponent;
   let fixture: ComponentFixture<AccountShareComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         schemas: [NO_ERRORS_SCHEMA],
         declarations: [AccountShareComponent, AccountShareStatusComponent, SkeletonLoaderPipe],
         providers: [{ provide: ClientProfileDetailsService, useValue: clientProfileDetailsFailedServiceStub },
         { provide: AccountService, useValue: accountServiceFailureStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountShareComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      component.accountType = accountTypes.currentAccountType.code;
      component.accountNumber = '1009017640';
      component.accountId = 1;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should show skeleton loading if data does not load', () => {
      expect(component.isSkeletonMode).toBe(true);
   });

});

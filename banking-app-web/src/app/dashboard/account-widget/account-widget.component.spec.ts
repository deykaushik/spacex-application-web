import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { assertModuleFactoryCaching } from './../../test-util';
import { AccountService } from './../account.service';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { AccountWidgetComponent } from './account-widget.component';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { TermsService } from './../../shared/terms-and-conditions/terms.service';
import { PreFillService } from '../../core/services/preFill.service';
import { IDashboardAccount, IClientDetails, IApiResponse } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { IAccountConfig } from '../dashboard.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GaTrackingService } from '../../core/services/ga.service';
import { GreenbacksEnrolmentService } from '../../core/services/greenbacks-enrolment.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';

const mockRenameAccount: IDashboardAccount = {
   AccountName: 'BusinessSaving Account',
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
   InterestRate: 0,
   isEditInProcess: false,
   IsShow: true
};

const mockUpdatedAccount: IDashboardAccount = {
   AccountName: 'Business Account',
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
   InterestRate: 0,
   isEditInProcess: true,
   IsShow: true,
   kebabOpen: false
};

const event = {
   keyCode: 32
};

const accountNameList = {
   accountNamePlus21Character: 'Current Saving Account',
   accountName21Character: 'Testing SavingAccount',
   accountNameSpecialCharacter: '@@Account',
   editableAccountName: 'Saving Account'
};

const mockAccounts: IDashboardAccount[] = [mockRenameAccount, mockUpdatedAccount];

const mockJoinRewardsAccount: any = {
   AccountNumber: '',
   IsShow: true,
   AccountType: 'Rewards',
};

const mockAccountRenameApiSuccessResponse: IApiResponse = {
   data: {
      AccountNumber: '8146140061701',
      AccountNickName: 'Nedbank'
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'Profile Account Modification',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'Success'
               }
            ]
         }
      ]
   }
};

const mockAccountRenameApiEmptyResponse: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'Profile Account Modification',
                  result: 'R03',
                  status: 'FAILURE',
                  reason: 'Failure'
               }
            ]
         }
      ]
   }
};

const accountConfig: IAccountConfig[] = [{
   availableBalance: 'Available Balance',
   currentBalance: 'Current Balance',
   title: 'Everyday Banking',
   type: 'Bank'
}, {
   availableBalance: 'Available balance',
   currentBalance: 'Outstanding balance',
   title: 'Loans',
   type: 'Loan'
}, {
   availableBalance: 'Available Balance',
   currentBalance: 'Current Balance',
   title: 'Credit Cards',
   type: 'Card'
}, {
   availableBalance: 'Available Balance',
   currentBalance: 'Current Balance',
   title: 'Investments',
   type: 'Investment'
}, {
   availableBalance: 'Rand value',
   currentBalance: 'Rewards balance',
   title: 'Rewards',
   type: 'Rewards'
}];
const clientDetails: IClientDetails = {
   'DefaultAccountId': '2',
   'CisNumber': 120000036423,
   'FirstName': 'June',
   'SecondName': 'Bernadette',
   'Surname': 'Metherell',
   'FullNames': 'Mrs June Bernadette Metherell',
   'CellNumber': '+27994583427',
   'EmailAddress': '',
   'BirthDate': '1957-04-04T22:00:00Z',
   'FicaStatus': 701,
   'SegmentId': 'CEBZZZ',
   'IdOrTaxIdNo': 5704050086083,
   'SecOfficerCd': '11905',
   'AdditionalPhoneList': [{
      'AdditionalPhoneType': 'BUS',
      'AdditionalPhoneNumber': '(011) 4729828'
   }, {
      'AdditionalPhoneType': 'CELL',
      'AdditionalPhoneNumber': '+27994583427'
   }, {
      'AdditionalPhoneType': 'HOME',
      'AdditionalPhoneNumber': '(011) 4729828'
   }],
   'Address': {
      'AddressLines': [{
         'AddressLine': '4 OLGA STREET'
      }, {
         'AddressLine': 'FLORIDA EXT 4'
      }, {
         'AddressLine': 'FLORIDA'
      }],
      'AddressPostalCode': '01709'
   }
};
const accounts: IDashboardAccount[] = [{
   AccountIcon: 'glyphicon-account_current',
   AccountName: 'CURRENT',
   AccountNumber: 1088016006,
   AccountType: 'CA',
   AvailableBalance: 64482.33,
   Balance: 39182.33,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '1',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   isEditInProcess: false,
   IsShow: true,
   SiteId: '16390'
}, {
   AccountIcon: 'glyphicon-account_credit_card',
   AccountName: 'credit',
   AccountNumber: 5898460005189931,
   AccountType: 'CC',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '2',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   isEditInProcess: false,
   IsShow: false,
   SiteId: '16390'
}, {
   AccountIcon: 'glyphicon-account_credit_card',
   AccountName: 'DS',
   AccountNumber: 5898460005189931,
   AccountType: 'DS',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '2',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   isEditInProcess: false,
   IsShow: true,
   SiteId: '16390'
}];
const ngiAccounts: IDashboardAccount[] = [{
   AccountIcon: 'glyphicon-account_credit_card',
   AccountName: 'NGI',
   AccountNumber: 5898460005189931,
   AccountType: 'INV',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '1',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   isEditInProcess: false,
   IsShow: true,
   SiteId: '16390'
}];
const nonNgiAccounts: IDashboardAccount[] = [{
   AccountIcon: 'glyphicon-account_credit_card',
   AccountName: 'DS1',
   AccountNumber: 5898460005189931,
   AccountType: 'DS',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '2',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   SiteId: '16390',
   isEditInProcess: false,
   IsShow: true
}, {
   AccountIcon: 'glyphicon-account_credit_card',
   AccountName: 'DS 2',
   AccountNumber: 5898460005189931,
   AccountType: 'DS',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '3',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   SiteId: '16390',
   isEditInProcess: false,
   IsShow: false
}];
const mockNgiAndNonNgiAccounts = ngiAccounts.concat(nonNgiAccounts);
const mockLoanAccounts: IDashboardAccount[] = [{
   AccountIcon: 'glyphicon-account_loan',
   AccountName: 'Loan',
   AccountNumber: 5898460005189931,
   AccountType: 'HL',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '1',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   SiteId: '16390'
},
{
   AccountIcon: 'glyphicon-account_loan',
   AccountName: 'Loan',
   AccountNumber: 5898460005189931,
   AccountType: 'PL',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '1',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   SiteId: '16390'
},
{
   AccountIcon: 'glyphicon-account_loan',
   AccountName: 'Loan',
   AccountNumber: 5898460005189931,
   AccountType: 'IS',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '1',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   SiteId: '16390'
}];

const mockNoHLloanAccounts: IDashboardAccount[] = [{
   AccountIcon: 'glyphicon-account_loan',
   AccountName: 'Loan',
   AccountNumber: 5898460005189931,
   AccountType: 'IS',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '1',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   SiteId: '16390'
},
{
   AccountIcon: 'glyphicon-account_loan',
   AccountName: 'Loan',
   AccountNumber: 5898460005189931,
   AccountType: 'PL',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '1',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   SiteId: '16390'
},
{
   AccountIcon: 'glyphicon-account_loan',
   AccountName: 'Loan',
   AccountNumber: 5898460005189931,
   AccountType: 'IS',
   AvailableBalance: 0,
   Balance: 0,
   Currency: '&#x52;',
   InstitutionName: 'Nedbank (South Africa)',
   InterestRate: 0,
   ItemAccountId: '1',
   LastUpdate: '2017-12-26 09:46:52 AM',
   NewAccount: true,
   SiteId: '16390'
}];

const accountServiceStub = {
   getAccountConfig: jasmine.createSpy('getAccountConfig').and.returnValue(accountConfig[0]),
   getAccountConfigForRewards: jasmine.createSpy('getAccountConfig').and.returnValue(accountConfig[4]),
   getAccountConfigForUnitTrust: jasmine.createSpy('getAccountConfig').and.returnValue(accountConfig[3]),
   getAccountConfigForLoan: jasmine.createSpy('getAccountConfig').and.returnValue(accountConfig[1]),
   getAccountNumber: jasmine.createSpy('getAccountNumber').and.returnValue('1009017640'),
   saveAccountName: jasmine.createSpy('saveAccountName').and.returnValue(Observable.of(mockAccountRenameApiSuccessResponse.data))
};
const clientProfileDetailsServiceStub = {
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
};

const bsModalServiceStub = {
   show: jasmine.createSpy('show')
};

const preFillServiceStub = {};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const greenbaksEnrolmentServiceStub = {
   resetCustomerStorage: jasmine.createSpy('resetCustomerStorage'),
   isCustomerEnroled: jasmine.createSpy('isCustomerEnroled').and.returnValue(true)
};

const systemErrorServiceStub = {
   raiseError: jasmine.createSpy('raiseError'),
   closeError: jasmine.createSpy('closeError').and.returnValue(null)
};

const PreApprovedOffersServiceStub = {
      getPreApprovedPersonalLoan: jasmine.createSpy('getPreApprovedPersonalLoan').and.returnValue({ id: 56322}),
      changeOfferStatusById: jasmine.createSpy('changeOfferStatusById').and.callFake((p, l) => {
           return Observable.create(obs => {
                 obs.next();
                 obs.complete();
           });
      }),
      InitializeWorkFlow: jasmine.createSpy('InitializeWorkFlow').and.returnValue([])
};

describe('AccountWidgetComponent', () => {
   let component: AccountWidgetComponent;
   let fixture: ComponentFixture<AccountWidgetComponent>;
   let router: Router;
   let accountService: AccountService;
   let debugElement: DebugElement;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [AccountWidgetComponent, SkeletonLoaderPipe, AmountTransformPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: PreApprovedOffersService, useValue: PreApprovedOffersServiceStub },
            { provide: BsModalService, useValue: bsModalServiceStub },
            { provide: SystemErrorService, useValue: systemErrorServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: GreenbacksEnrolmentService, useValue: greenbaksEnrolmentServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: AccountService, useValue: accountServiceStub }, { provide: TermsService, useValue: {} },
            { provide: SystemErrorService, useValue: systemErrorServiceStub }]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountWidgetComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      router = TestBed.get(Router);
      component.accounts = accounts;
      accountService = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should provide the correct AccountType Style', () => {
      expect(component.getAccountTypeStyle('CA')).toEqual('current');
      expect(component.getAccountTypeStyle('SA')).toEqual('savings');
      expect(component.getAccountTypeStyle('SA')).toEqual('savings', 'ClubAccount');
      expect(component.getAccountTypeStyle('CC')).toEqual('credit-card');
      expect(component.getAccountTypeStyle('NC')).toEqual('loan');
      expect(component.getAccountTypeStyle('IS')).toEqual('loan');
      expect(component.getAccountTypeStyle('HL')).toEqual('loan');
      expect(component.getAccountTypeStyle('TD')).toEqual('investment');
      expect(component.getAccountTypeStyle('DS')).toEqual('investment');
      expect(component.getAccountTypeStyle('INV')).toEqual('investment');
      expect(component.getAccountTypeStyle('XYZ')).toEqual('default');
   });

   it('should navigate on account click', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.allowNavigation = true;
      component.onAccountClick('1');
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/detail/1');
   });

   it('should not navigate on account click', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.onAccountClick('');
      expect(spy.calls.first()).toBeUndefined();
   });
   it('should call getSortedAccountsWithDefault', () => {
      component.type = 'Bank';
      component.getSortedAccountsWithDefault();
   });
   it('should call getSortedForexAccounts', () => {
      component.accountConfig.type = 'Foreign';
      component.getSortedForexAccounts();
      expect(component.accounts);
   });
   it('should set label for rewards', () => {
      component.type = Constants.labels.dashboardRewardsAccountTitle;
      accountService.getAccountConfig = accountServiceStub.getAccountConfigForRewards;
      component.ngOnInit();
      expect(component.accountConfig.currentBalance).toBe('Rewards balance');
   });
   it('should set label for unit trust', () => {
      component.accounts = ngiAccounts;
      component.type = Constants.VariableValues.accountContainers.investment;
      accountService.getAccountConfig = accountServiceStub.getAccountConfigForUnitTrust;
      component.ngOnInit();
      expect(component.accountConfig.currentBalance).toBe('Market value');
      expect(component.accountConfig.availableBalance).toBe('');
   });
   it('should set label for other than unit trust investments', () => {
      component.type = Constants.VariableValues.accountContainers.investment;
      accountService.getAccountConfig = accountServiceStub.getAccountConfigForUnitTrust;
      component.ngOnInit();
      expect(component.accountConfig.currentBalance).toBe('Current balance');
      expect(component.accountConfig.availableBalance).toBe('Available balance');
   });

   it('should set label for both unit trust and non unit trust investments', () => {
      component.type = Constants.VariableValues.accountContainers.investment;
      component.accounts = mockNgiAndNonNgiAccounts;
      const unitTrustAccounts = mockNgiAndNonNgiAccounts.filter(account =>
         account.AccountType === component.unitTrustInvestmentAccountType);
      const nonUnitTrustAccounts = mockNgiAndNonNgiAccounts.filter(account =>
         account.AccountType !== component.unitTrustInvestmentAccountType);
      let sortedInvAccounts = [];
      sortedInvAccounts = sortedInvAccounts.concat(nonUnitTrustAccounts).concat(unitTrustAccounts);
      sortedInvAccounts = sortedInvAccounts.filter(account => account.IsShow === true);
      component.ngOnInit();
      expect(component.hasNgiInvestments).toBe(true);
      expect(component.accounts).toEqual(sortedInvAccounts);
   });

   it('should rename the account name', () => {
      const updateName = 'nedbank';
      component.accounts = mockAccounts;
      component.visibleAccounts = mockAccounts;
      spyOn(component, 'changeAccountEditStatus');
      spyOn(component.accountNameChange, 'emit');
      component.onConfirmBtnClick(updateName, mockRenameAccount);
      expect(component.isShowMessageBlock).toBe(true);
      expect(component.isSuccess).toBe(true);
      expect(component.changeAccountEditStatus).toHaveBeenCalled();
      expect(component.accountNameChange.emit).toHaveBeenCalled();
   });

   it('should not rename the account name', () => {
      const updateName = 'nedbank';
      component.accounts = mockAccounts;
      const error = Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      });
      accountService.saveAccountName = jasmine.createSpy('saveAccountName').and.returnValue(error);
      spyOn(component, 'changeAccountEditStatus');
      component.onConfirmBtnClick(updateName, mockRenameAccount);
      expect(component.isSuccess).toBe(false);
      expect(component.changeAccountEditStatus).toHaveBeenCalled();
      expect(systemErrorServiceStub.closeError).toHaveBeenCalled();
   });

   it('should not rename the account on failure to save', () => {
      const updateName = 'nedbank';
      component.accounts = mockAccounts;
      spyOn(component, 'changeAccountEditStatus');
      spyOn(component.accountNameChange, 'emit');
      accountServiceStub.saveAccountName.and.returnValue(Observable.of(mockAccountRenameApiEmptyResponse.data));
      component.onConfirmBtnClick(updateName, mockRenameAccount);
      expect(component.isSuccess).toBe(false);
      expect(component.changeAccountEditStatus).toHaveBeenCalled();
      expect(component.accountNameChange.emit).not.toHaveBeenCalled();
   });

   it('should click on edit button', fakeAsync(() => {
      component.accounts = mockAccounts;
      component.editedAccountName = mockRenameAccount.AccountName;
      component.totalVisibleAccounts = 3;
      component.onEditBtnClick(mockRenameAccount);
      fixture.detectChanges();
      tick(0);
      expect(component.isAccountNameInvalid).toBe(false);
      expect(mockRenameAccount.isEditInProcess).toBe(true);
      const accountElement = fixture.debugElement.query(By.css('#acc_name'));
      expect(accountElement).toBeDefined();
   }));

   it('should click on close button', () => {
      component.closeMessageBlock();
      expect(component.isShowMessageBlock).toBe(false);
   });

   it('should change input value', () => {
      mockUpdatedAccount.AccountName = accountNameList.editableAccountName;
      const pattern = Constants.patterns.alphaNumericWithSpace;
      component.editedAccountName = accountNameList.editableAccountName;
      component.onInputChanged(mockUpdatedAccount.AccountName);
      expect(mockUpdatedAccount.AccountName.length < 21).toBe(true);
      expect(component.accountNameLengthFlag).toBe(false);
      mockUpdatedAccount.AccountName = accountNameList.accountNamePlus21Character;
      component.onInputChanged(mockUpdatedAccount.AccountName);
      expect(mockUpdatedAccount.AccountName.length < 21).toBe(false);
      expect(component.isAccountNameInvalid).toBe(false);
      component.editedAccountName = accountNameList.accountNameSpecialCharacter;
      component.onInputChanged(component.editedAccountName);
      expect(component.isAccountNameInvalid).toBe(true);
   });

   it('should not allow space in the beginning', async(() => {
      jasmine.clock().install();
      component.onInputChanged(' ');
      jasmine.clock().tick(1);
      expect(component.editedAccountName).toBe('');
      jasmine.clock().uninstall();
   }));

   it('account name length flag should be true', () => {
      component.onInputChanged('be happy everyday eve');
      expect(component.accountNameLengthFlag).toBe(true);
   });

   it('should click on cancel button', () => {
      component.onCancelBtnClick(mockRenameAccount);
      expect(component.editedAccountName).toBe('');
      expect(component.accountNameLengthFlag).toBe(false);
   });

   it('should return true if it is my pockets account else should return false', () => {
      expect(component.isMyPocketsAccount('SA', '25')).toBe(true);
      expect(component.isMyPocketsAccount('SA', '001')).toBe(false);
   });

   it('should return row expand class', () => {
      expect(component.getAccountEditableStyle(mockRenameAccount)).toBe('row-expand');
   });

   it('should open join popup on join button click', () => {
      greenbaksEnrolmentServiceStub.isCustomerEnroled.and.returnValue(false);
      component.type = 'Rewards';
      component.accounts = [mockJoinRewardsAccount] as IDashboardAccount[];
      fixture.detectChanges();
      const joinButton = fixture.debugElement.query(By.css('#enroll'));
      joinButton.nativeElement.click();
      expect(bsModalServiceStub.show).toHaveBeenCalled();
   });

   it('should set label for different loan accounts', () => {
      component.accounts = mockLoanAccounts;
      component.type = Constants.VariableValues.accountContainers.loan;
      accountService.getAccountConfig = accountServiceStub.getAccountConfigForLoan;
      component.ngOnInit();
      expect(component.accountConfig.currentBalance).toBe('Outstanding balance');
      expect(component.accountConfig.availableBalance).toBe('Available balance');
   });
   it('should set label if loan container has only PL and IS loan accounts', () => {
      component.accounts = mockNoHLloanAccounts;
      component.type = Constants.VariableValues.accountContainers.loan;
      accountService.getAccountConfig = accountServiceStub.getAccountConfigForLoan;
      component.ngOnInit();
      expect(component.accountConfig.currentBalance).toBe('Outstanding balance');
      expect(component.accountConfig.availableBalance).toBe('');
   });
   it('should return title with underscore', () => {
      component.accountConfig.title = accountConfig[0].title;
      expect(component.getTitle()).toBe('everyday_banking');
   });
   it('should return false if customerId not present in localStorage',
      inject([GreenbacksEnrolmentService], (service: GreenbacksEnrolmentService) => {
         greenbaksEnrolmentServiceStub.isCustomerEnroled.and.returnValue(true);
         greenbaksEnrolmentServiceStub.resetCustomerStorage.calls.reset();
         expect(component.canShowJoinGreenbacksEnrolment()).toBe(false);
         expect(service.isCustomerEnroled).toHaveBeenCalled();
      })
   );
   it('should return true if localstorage contains customerid',
      inject([GreenbacksEnrolmentService], (service: GreenbacksEnrolmentService) => {
         greenbaksEnrolmentServiceStub.isCustomerEnroled.and.returnValue(false);
         expect(component.canShowJoinGreenbacksEnrolment()).toBe(true);
         expect(service.isCustomerEnroled).toHaveBeenCalled();
      })
   );

   it('should toggle Kebab icon',
      inject([GreenbacksEnrolmentService], (service: GreenbacksEnrolmentService) => {
         component.onKebabClick(mockUpdatedAccount);
         expect(mockUpdatedAccount.kebabOpen).toBe(true);
      })
   );
   it('should handle viewLoanOffer()', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.viewLoanOffer();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/offers/56322');
   });
});

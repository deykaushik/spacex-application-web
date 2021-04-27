import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from '../../test-util';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { IDashboardAccounts, IDashboardAccount, IClientDetails, IReportSuspicious } from '../../core/services/models';
import { IAlertMessage } from '../../core/services/models';
import { SystemErrorService } from '../../core/services/system-services.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { AmountFormatDirective } from './../../shared/directives/amount-format.directive';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';

import { ReportSuspiciousComponent } from './report-suspicious.component';
import { AccountService } from '../../dashboard/account.service';
import { FeedbackService } from '../feedback.service';

const returnValueFeedback = Observable.of({
   data: {
      attempts: 0,
      remainingTime: '0',
      attemptsCompletedFlag: false
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'Suspicious Activity',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'SUCCESS'
               }
            ]
         }
      ]
   }
});

const mockAccounts: IDashboardAccount[] = [{
   'AccountName': 'Inv CA1',
   'Balance': 0,
   'AvailableBalance': 0,
   'AccountNumber': 1009017640,
   'AccountType': 'SA',
   'AccountIcon': 'glyphicon-account_current',
   'NewAccount': true,
   'LastUpdate': '2017-08-18 10:51:01 AM',
   'InstitutionName': 'Nedbank (South Africa)',
   'Currency': '&#x52;',
   'SiteId': '16390',
   'ItemAccountId': '1',
   'InterestRate': 0
},
{
   'AccountName': 'Inv CA2',
   'Balance': 0,
   'AvailableBalance': 0,
   'AccountNumber': 1009017640,
   'AccountType': 'CA',
   'AccountIcon': 'glyphicon-account_current',
   'NewAccount': true,
   'LastUpdate': '2017-08-18 10:51:01 AM',
   'InstitutionName': 'Nedbank (South Africa)',
   'Currency': '&#x52;',
   'SiteId': '16390',
   'ItemAccountId': '2',
   'InterestRate': 0
},
{
   'AccountName': 'Inv CA0',
   'Balance': 0,
   'AvailableBalance': 0,
   'AccountNumber': 1009017640,
   'AccountType': 'CA',
   'AccountIcon': 'glyphicon-account_current',
   'NewAccount': true,
   'LastUpdate': '2017-08-18 10:51:01 AM',
   'InstitutionName': 'Nedbank (South Africa)',
   'Currency': '&#x52;',
   'SiteId': '16390',
   'ItemAccountId': '1',
   'InterestRate': 0
},
{
   'AccountName': 'Inv NGI',
   'Balance': 0,
   'AvailableBalance': 0,
   'AccountNumber': 1009017640,
   'AccountType': 'INV',
   'AccountIcon': 'glyphicon-account_current',
   'NewAccount': true,
   'LastUpdate': '2017-08-18 10:51:01 AM',
   'InstitutionName': 'Nedbank (South Africa)',
   'Currency': '&#x52;',
   'SiteId': '16390',
   'ItemAccountId': '4',
   'InterestRate': 0
}];

const mockRewardsAccounts: IDashboardAccount[] = [{
   'AccountName': 'Greenbacks',
   'Balance': 2196,
   'AvailableBalance': 61,
   'AccountNumber': 601710000004,
   'AccountType': 'Rewards',
   'AccountIcon': null,
   'NewAccount': null,
   'LastUpdate': null,
   'InstitutionName': null,
   'Currency': 'GB',
   'SiteId': null,
   'ItemAccountId': '5',
   'InterestRate': null,
   'RewardsProgram': 'GB'
}, {
   'AccountName': 'Amex membership',
   'Balance': 2196,
   'AvailableBalance': null,
   'AccountNumber': 601710000004,
   'AccountType': 'Rewards',
   'AccountIcon': null,
   'NewAccount': null,
   'LastUpdate': null,
   'InstitutionName': null,
   'Currency': 'MR',
   'SiteId': null,
   'ItemAccountId': '6',
   'InterestRate': null,
   'RewardsProgram': 'MR'
}, {
   'AccountName': 'Miles rewards',
   'Balance': 2196,
   'AvailableBalance': null,
   'AccountNumber': 601710000004,
   'AccountType': 'Rewards',
   'AccountIcon': null,
   'NewAccount': null,
   'LastUpdate': null,
   'InstitutionName': null,
   'Currency': null,
   'SiteId': null,
   'ItemAccountId': '7',
   'InterestRate': null,
   'RewardsProgram': 'Miles'
}];

const mockDashboardAccounts: IDashboardAccounts[] = [{
   'ContainerName': 'Bank',
   'Accounts': mockAccounts,
   'ContainerIcon': 'glyphicon-account_current',
   'Assets': 747248542.18
}, {
   'ContainerName': 'Rewards',
   'Accounts': mockRewardsAccounts,
   'ContainerIcon': null,
   'Assets': null
}, {
   'ContainerName': 'Investments',
   'Accounts': mockAccounts,
   'ContainerIcon': null,
   'Assets': null
}];

function getClientDetails(): IClientDetails {
   return {
      CisNumber: 110282180605,
      FirstName: 'Marc',
      SecondName: '',
      Surname: 'Schutte',
      FullNames: 'Mr Marc Schutte',
      CellNumber: '+27992180605',
      EmailAddress: 'abc@gmail.com',
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

const mockAlertMessage: IAlertMessage = {
   showSuccess: true,
   showError: true,
   alertMessage: ''
};

const mockClientDetails = getClientDetails();

const feedbackServiceStub = {
   reportSuspiciousSubmit: jasmine.createSpy('reportSuspiciousSubmit').and.callFake(function () { return returnValueFeedback; }),
   reportSuspiciousAttempts: jasmine.createSpy('reportSuspiciousAttempts').and.callFake(function () { return returnValueFeedback; }),
};

const clientDetailsObserver: BehaviorSubject<any> = new BehaviorSubject<any>(getClientDetails());

const clientProfileDetailsServiceStub = {
   clientDetailsObserver: clientDetailsObserver,
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
};

const accountsFromCacheStub = {
   getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.callFake(function () {
      return mockDashboardAccounts;
   }),
   getDashboardAccountsData: jasmine.createSpy('getDashboardAccounts').and.callFake(function () {
      return mockDashboardAccounts;
   })
};

const accountsFromServiceStub = {
   getDashboardAccountsData: jasmine.createSpy('getDashboardAccounts').and.callFake(function () {
      return mockDashboardAccounts;
   })

};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};

describe('ReportSuspiciousComponent', () => {
   let component: ReportSuspiciousComponent;
   let fixture: ComponentFixture<ReportSuspiciousComponent>;
   let feedbackService: FeedbackService;
   let accountService: AccountService;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ReportSuspiciousComponent, AmountTransformPipe, AmountFormatDirective],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [SystemErrorService, AmountTransformPipe, { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
            { provide: AccountService, useValue: accountsFromCacheStub },
            { provide: FeedbackService, useValue: feedbackServiceStub },
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ReportSuspiciousComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      feedbackService = fixture.debugElement.injector.get(FeedbackService);
      accountService = fixture.debugElement.injector.get(AccountService);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be set spinner false', () => {
      component.ngOnInit();
      expect(component.showSpinner).toBe(false);
   });

   it('should call request object before calling submit API', () => {
     const accountNumber = '0';
      component.sendSuspiciousReport();
      expect(component.ReportSuspiciousReq().accountNumber).toBe(accountNumber);
   });

   it('should submit the  suspicious report', () => {
      component.showLoader = false;
      component.isFormValid = true;
      component.reportSuspiciousText = 'test';
      expect(component.showSpinner).toBe(false);
   });

   it('should not show loader if  reportSuspiciousSubmit API fails', () => {
      feedbackService.reportSuspiciousSubmit = jasmine.createSpy('reportSuspiciousSubmit').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.showLoader = false;
      component.isFormValid = true;
      component.reportSuspiciousText = 'test';
      component.sendSuspiciousReport();
      expect(component.showSpinner).toBe(false);
   });

   it('should not show loader if  reportSuspiciousAttempts API fails', () => {
      feedbackService.reportSuspiciousAttempts = jasmine.createSpy('reportSuspiciousAttempts').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.getReportSuspiciousAttempts();
      expect(component.showSpinner).toBe(false);
   });

   it('should set alert message', () => {
      component.setAlertMessage(mockAlertMessage);
      expect(component.showSpinner).toBe(false);
   });

   it('should select account from drop down', () => {
      component.onAccountSelect(mockAccounts[0]);
      expect(component.selectedAccountName).toBe('Inv CA1');
   });

   it('should count number of character enter in reason field ', () => {
      component.reportSuspiciousText = 'test';
      component.reportSuspiciousInfoChange();
      expect(component.reportSuspiciousInfo).toBe('4/1000');
   });

   it('should count number of character enter in amount field ', () => {
      const mockAmount = {
         viewModel: 'R12 349'
      };
      component.totalAmountChange(mockAmount);
      expect(component.totalAmount).toBe('12349');
   });

   it('should remove character from  amount field ', () => {
      const mockAmount = {
         viewModel: 'R12 349a'
      };
      component.totalAmountChange(mockAmount);
      expect(component.totalAmount).toBe('12349');
   });

   it('should count number of character enter in account number field ', () => {
      component.accountNumber = '12345';
      component.accountNumberChange();
      expect(component.accountNumberInfo).toBe('5/35');
   });

   it('should count number of character enter in bank name field', () => {
      component.bankName = 'absa';
      component.bankNameChange();
      expect(component.bankNameInfo).toBe('4/50');
   });

   it('should validate email id ', () => {
      component.email = 'Test@nedbank.co.za';
      component.emailChange();
      expect(component.isEmailValid).toBe(true);
   });

   it('should return account type', () => {
      expect(component.getAccountTypeStyle('CA')).toBe('current');
   });

   it('should call account service for fetching accounts data', () => {
      accountService.getDashboardAccountsData = jasmine.createSpy('getDashboardAccounts').and.callFake(function () {
         return null;
      });
      accountService.getDashboardAccounts().subscribe = jasmine.createSpy('getDashboardAccounts').and.callFake(function () {
         return mockDashboardAccounts;
      });
      component.getAccountData();
      expect(component.selectedAccount.AccountType).toBe('CA');
   });

   it('should be empty client email if there is no email from client details', () => {
      clientProfileDetailsServiceStub.clientDetailsObserver.next({});
      expect(component.email).toBe('');
   });
});

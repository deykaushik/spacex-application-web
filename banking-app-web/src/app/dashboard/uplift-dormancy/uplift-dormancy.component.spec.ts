import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { assertModuleFactoryCaching } from './../../test-util';
import { AccountService } from '../account.service';

import {
   ITransactionDetail, ITransactionDetailsData,
   IDashboardAccount, IDashboardAccounts, IApiResponse, IClientDetails, IValidation
} from '../../core/services/models';
import { LocaleDatePipe } from './../../shared/pipes/locale-date.pipe';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { Constants } from './../../core/utils/constants';

import { UpliftDormancyComponent } from './uplift-dormancy.component';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { HttpErrorResponse } from '@angular/common/http';


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

const mockTransactionDetailsDataForTransferFlow: ITransactionDetailsData = {
   accountContainers: mockaccountContainers,
   balance: -5000,
   itemAccountId: 1,
};

const mockTransactionDetailsDataForLocateBranchFlow: ITransactionDetailsData = {
   accountContainers: mockaccountContainers,
   balance: 500000,
   itemAccountId: 1,
};

const mockTransactionDetailsDataForNotDormantAccount: ITransactionDetailsData = {
   accountContainers: mockaccountContainers,
   balance: 5000,
   itemAccountId: 2,
};


const mockUpliftAccountDormancy: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            transactionID: '0',
            resultDetail: [
               {
                  operationReference: 'SUCCESS',
                  result: 'R00',
                  status: 'PENDING'
               }
            ]
         }
      ]
   }
};

const mockUpliftAccountDormancyStatus: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            transactionID: '0',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R0VP',
                  status: 'PENDING'
               }
            ]
         }
      ]
   }
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
const mockClientDetailsDataFICA: IClientDetails = {
   CisNumber: 110282180605,
   FirstName: 'Marc',
   SecondName: '',
   Surname: 'Schutte',
   FullNames: 'Mr Marc Schutte',
   CellNumber: '+27992180605',
   EmailAddress: '',
   BirthDate: '1977-03-04T22:00:00Z',
   FicaStatus: 900,
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

const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard/account/scheduled/:id', component: testComponent }
];

const mockUpdateAccountStatusApprove: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            transactionID: '0',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R0VP',
                  status: 'PENDING'
               }
            ]
         }
      ]
   }
};

const mockAccountStatusWithoutApprove: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            transactionID: '0',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'SUCCESS'
               }
            ]
         }
      ]
   }
};

const mockAccountStatusFailure: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            transactionID: '0',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R01',
                  status: 'FAILURE'
               }
            ]
         }
      ]
   }
};

const mockTransaction = {
   metadata: {
      resultData: [
         {
            transactionID: 'instantpayment',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'SUCCESS'
               }
            ]
         }
      ]
   }
};

const mockAccountStatusApprove: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            transactionID: '0',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R0VP',
                  status: 'SUCCESS'
               }
            ]
         }
      ]
   }
};

const bsModalServiceStub = {
   show: jasmine.createSpy('getApproveItStatus').and.callFake(function () {
      return {
         content: {
            getApproveItStatus: Observable.of(true),
            resendApproveDetails: Observable.of(true),
            getOTPStatus: Observable.of(true),
            otpIsValid: Observable.of(true),
            updateSuccess: Observable.of(true),
            processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
            processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
            processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
         }
      };
   }),
   onShow: jasmine.createSpy('onShow'),
   onShown: jasmine.createSpy('onShown'),
   onHide: jasmine.createSpy('onHide'),
   onHidden: {
      asObservable: jasmine.createSpy('onHidden asObservable').and.callFake(function () {
         return Observable.of(true);
      })
   },
};

function getOverdraftValidations(): IValidation[] {
   return [{
      validationType: 'Overdraft',
      setting: [
         {
            validationKey: 'Minimum',
            validationValue: '100'
         },
         {
            validationKey: 'Maximum',
            validationValue: '250000'
         }
      ]
   }];
}


const clientPreferencesStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(mockClientDetailsData),
};

const accountServiceStub = {
   upliftAccountDormancy:
      jasmine.createSpy('upliftAccountDormancy').and.returnValue(Observable.of(mockUpliftAccountDormancy)),
   upliftAccountDormancyStatus: jasmine.createSpy('upliftAccountDormancyStatus')
      .and.returnValue(Observable.of(mockUpliftAccountDormancyStatus)),
   getApproveItOtpStatus: jasmine.createSpy('getApproveItOtpStatus').and.returnValue(Observable.of({
      transactionVerificationCode: 'TVCCODE', verificationReferenceId: '213'
   })),
   getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of(mockTransaction)),
   getOverdraftValidations: jasmine.createSpy('getOverdraftValidations')
      .and.returnValue(Observable.of(getOverdraftValidations()))
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('UpliftDormancyComponent', () => {
   let component: UpliftDormancyComponent;
   let fixture: ComponentFixture<UpliftDormancyComponent>;
   let service: AccountService;
   let modalService: BsModalService;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [UpliftDormancyComponent, AmountTransformPipe, LocaleDatePipe, SkeletonLoaderPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [BsModalService,
            { provide: AccountService, useValue: accountServiceStub },
            { provide: BsModalService, useValue: bsModalServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientPreferencesStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(UpliftDormancyComponent);
      component = fixture.componentInstance;
      modalService = TestBed.get(BsModalService);
      router = TestBed.get(Router);
      service = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.ngOnChanges({ changes: new SimpleChange(null, null, null) });
      expect(component).toBeTruthy();
   });

   it('Is account is dormant', () => {
      component.transactionDetailsData = mockTransactionDetailsData;
      component.ngOnChanges({ transactionDetailsData: true });
      expect(component.isDormantAccount).toBe(true);
   });
   it('should activate account using approve it functionality', () => {
      service.upliftAccountDormancy = jasmine.createSpy('upliftAccountDormancy')
         .and.returnValue(Observable.of(mockUpdateAccountStatusApprove));
      fixture.detectChanges();
      component.itemAccountId = 1;
      component.activateDormantAccount();
      expect(component.activateAccountFlow).toEqual(false);
   });

   it('should activate account without  approve it  functionality', () => {
      service.upliftAccountDormancy = jasmine.createSpy('upliftAccountDormancy')
         .and.returnValue(Observable.of(mockAccountStatusWithoutApprove));
      fixture.detectChanges();
      component.itemAccountId = 1;
      component.activateDormantAccount();
      expect(component.activateAccountFlow).toEqual(false);
   });

   it('should activate account with approve it  functionality after calling transaction API', () => {
      service.upliftAccountDormancy = jasmine.createSpy('upliftAccountDormancy')
         .and.returnValue(Observable.of(mockAccountStatusApprove));
      fixture.detectChanges();
      component.itemAccountId = 1;
      component.activateDormantAccount();
      expect(component.activateAccountFlow).toEqual(false);
   });

   it('should go to transactional flow', () => {
      component.transactionDetailsData = mockTransactionDetailsDataForTransferFlow;
      component.ngOnChanges('change');
      component.getDormantAccount();
      expect(component.transferAmountFlow).toEqual(true);
   });

   it('should go to locate branch flow', () => {
      component.transactionDetailsData = mockTransactionDetailsDataForLocateBranchFlow;
      component.ngOnChanges('change');
      component.getDormantAccount();
      expect(component.locateBranchFlow).toEqual(true);
   });

   it('should not go to dormant flow', () => {
      component.transactionDetailsData = mockTransactionDetailsDataForNotDormantAccount;
      component.ngOnChanges('change');
      component.getDormantAccount();
      expect(component.isDormantAccount).toEqual(false);
   });

   it('should show error message', () => {
      service.upliftAccountDormancy = jasmine.createSpy('upliftAccountDormancy')
         .and.returnValue(Observable.of(mockAccountStatusFailure));
      fixture.detectChanges();
      component.itemAccountId = 1;
      component.activateDormantAccount();
      expect(component.dormancyNotification.isSuccess).toEqual(1);
   });

   it('should show success message', () => {
      component.successNotification();
      expect(component.dormancyNotification.message)
         .toEqual('Your account is now active again. Please ensure that you transact with this account  to avoid dormancy again.');
      expect(component.dormancyNotification.isSuccess).toEqual(3);
      expect(component.dormancyNotification.showMessage).toBeTruthy();
   });

   it('should set default value if validation API fails', () => {
      service.getOverdraftValidations = jasmine.createSpy('getOverdraftValidations').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.getOverdraftValidations();
      expect(component.accountBalance).toBe(50000);
   });

   it('should set loader false if upliftAccountDormancy API fails', () => {
      service.upliftAccountDormancy = jasmine.createSpy('upliftAccountDormancy').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.itemAccountId = 1;
      component.activateDormantAccount();
      expect(component.showLoader).toBeFalsy();
   });

   it('should set loader false if resendApproveDetails API fails', () => {
      service.upliftAccountDormancy = jasmine.createSpy('upliftAccountDormancy').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.itemAccountId = 1;
      component.resendApproveDetails();
      expect(component.showLoader).toBeFalsy();
   });

   it('should return true for locate branch flow', () => {
      clientPreferencesStub.getClientPreferenceDetails.and.returnValue(Observable.of(mockClientDetailsDataFICA));
      expect(component.getLocateBranchFlow()).toBeTruthy();
   });

   it('should set label for transfer amount flow', () => {
      clientPreferencesStub.getClientPreferenceDetails.and.returnValue(Observable.of(mockClientDetailsDataFICA));
      component.getTransferAmountFlow();
      const label = 'deposit';
      expect(component.labels.deposit).toBe(label);
   });

   it('should navigate to locate branch', () => {
      component.branchLocatorURL = Constants.routeUrls.locateBranch + '/1';
      const spy = spyOn(router, 'navigateByUrl');
      component.navigateToLocateBranch();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/upliftdormancy/branchlocator/1');
   });
});

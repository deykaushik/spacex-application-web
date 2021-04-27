
import { Constants } from './../../core/utils/constants';
import { AccountService } from '../../dashboard/account.service';
import { FormsModule } from '@angular/forms';
import { IApiResponse, IDashboardAccounts, IDashboardAccount, IStatementPreferences, IMetaData } from '../../core/services/models';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LoaderService } from '../../core/services/loader.service';
import { StatementPreferencesComponent } from './statement-preferences.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { CommonUtility } from '../../core/utils/common';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { SharedModule } from '../../shared/shared.module';
import { ApiService } from '../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { WindowRefService } from '../../core/services/window-ref.service';
import { assertModuleFactoryCaching } from '../../test-util';
import { GaTrackingService } from '../../core/services/ga.service';

const mockGetAccountStatementPreferences: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'MONTHLY',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM', 'TEST@GAS.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}

};
const mockInvalidEmailAccountStatementPreferences: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'MONTHLY',
      deliveryMode: 'POST',
      email: ['GUNJAL138@GMAIL.COM,,,', 'TEST@GAS.COM,,,,'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};
const mockGetAccountStatementPreferencesForMfc: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'TEST',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};
const mockStatementPreferencesWithoutDeliveryMode: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'MONTHLY',
      deliveryMode: undefined,
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};
const mockStatementPreferencesNever: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'NEVER',
      deliveryMode: undefined,
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};
const mockStatementPreferencesUnknown: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'UNKNOWN',
      deliveryMode: undefined,
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};

const mockGetAccountStatementPreferencesEmptyEmail: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'MONTHLY',
      deliveryMode: 'EMAIL',
      email: [],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}

};

const mockGetAccountStatementPreferencesNoEmail: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'MONTHLY',
      deliveryMode: 'EMAIL',
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}

};
const mockGetAccountStatementPreferencesForMfcWithQuarterly: IApiResponse = {
   data: {

      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'QUARTERLY',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};

const mockGetAccountStatementPreferencesForMfcWithHalfYearly: IApiResponse = {
   data: {

      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'HALFYEARLY',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};

const mockGetAccountStatementPreferencesForMfcWithHalfyearly: IApiResponse = {
   data: {

      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'HALFYEARLY',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};
const mockGetAccountStatementPreferencesForMfcWithBiMonthly: IApiResponse = {
   data: {

      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'BIMONTHLY',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};

const mockGetAccountStatementPreferencesForMfcWithBiMonth: IApiResponse = {
   data: {

      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'BIM',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};

const mockGetAccountStatementPreferencesForMfcWithMonth: IApiResponse = {
   data: {

      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'MTH',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};
const mockGetAccountStatementPreferencesForMfcWithQuarter: IApiResponse = {
   data: {

      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'QRT',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}
};

const mockUpdateAccountStatementPreferences: IMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Maintain Statement Preferences Delivery',
               result: 'R00',
               status: 'SUCCESS'
            }
         ]
      }
   ]
};
const mockUpdateAccountStatementPreferencesWithFail: IMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Maintain Statement Preferences Delivery',
               result: 'R01',
               status: 'FAILURE'
            }
         ]
      }
   ]
};
const mockAccountsData: IDashboardAccount[] = [{
   AccountName: 'Inv SA',
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
   AccountName: 'Inv CA',
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
   AccountName: 'Inv CC',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CC',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '3',
   InterestRate: 0
},
{
   AccountName: 'Inv INV',
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
   ItemAccountId: '5',
   InterestRate: 0
}];


const mockInvData: IDashboardAccount[] = [
   {
      AccountName: 'Inv INV',
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

const mockAccountData: IDashboardAccount = {
   AccountName: 'Inv IS',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'IS',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '3',
   InterestRate: 0
};
const mockAccountDataWithOutId: IDashboardAccount = {
   AccountName: 'Inv IS',
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
};

const mockAccountDataWithINV: IDashboardAccount = {
   AccountName: 'Inv INV',
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
};

const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccountsData,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];

const mockInvAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockInvData,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];

const accountServiceStub = {
   getAccountStatementPreferences: jasmine.createSpy('getAccountStatementPreferences')
      .and.returnValue(Observable.of(mockGetAccountStatementPreferences)),
   updateAccountStatementPreferences:
   jasmine.createSpy('updateAccountStatementPreferences').and.returnValue(Observable.of(mockUpdateAccountStatementPreferences)),
   getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),
   setAccountData: jasmine.createSpy('setAccountData'),
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData),
   showAlertMessage: jasmine.createSpy('showAlertMessage').and.returnValue(true),
   getInvAccountData: jasmine.createSpy('getInvAccountData').and.returnValue(mockAccountDataWithINV)
};
const windowServiceStubMobile = {
   nativeWindow: {
      innerWidth: 375
   }
};
const windowServiceStub = {
   nativeWindow: {
      innerWidth: 800
   }
};
const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard/account/scheduled/:id', component: testComponent },
   { path: 'Mobile/:id', component: testComponent },
];
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('StatementPreferencesComponent', () => {
   let component: StatementPreferencesComponent;
   let fixture: ComponentFixture<StatementPreferencesComponent>;
   let service: AccountService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam), SharedModule],
         declarations: [StatementPreferencesComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [LoaderService,
            { provide: AccountService, useValue: accountServiceStub },
            { provide: WindowRefService, useValue: windowServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '3' }) } }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StatementPreferencesComponent);
      component = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should not be item account id is not equal to selected acount id', () => {
      service.getAccountData = jasmine.createSpy('getAccountData')
         .and.returnValue(Observable.of(mockAccountDataWithINV));
      service.getDashboardAccounts = jasmine.createSpy('getDashboardAccounts')
         .and.returnValue(Observable.of(mockDashboardAccounts));
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.statementDetails.accountType).toEqual(component.accountTypes.creditCardAccountType.code);
      expect(component.isMobileView).toBe(false);
      expect(component.buttonGroupWidth).toEqual(199);
   });

   it('should be get statement preferences details', () => {
      component.buttonName = component.labels.save;
      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockGetAccountStatementPreferences));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
   });

   it('should be get statement preferences details for frequencies', () => {
      component.buttonName = component.labels.save;
      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockGetAccountStatementPreferencesForMfc));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
      expect(component.statementPreferencesDetails.frequency).toEqual(component.values.monthly);
      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockGetAccountStatementPreferencesForMfcWithQuarterly));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
      expect(component.statementPreferencesDetails.frequency).toEqual(component.values.quarterly);

      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockGetAccountStatementPreferencesForMfcWithHalfYearly));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
      expect(component.statementPreferencesDetails.frequency).toEqual(component.values.halfyearly);

      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockGetAccountStatementPreferencesForMfcWithBiMonthly));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
      expect(component.statementPreferencesDetails.frequency).toEqual(component.values.biMonthly);

      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockGetAccountStatementPreferencesForMfcWithBiMonth));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
      expect(component.statementPreferencesDetails.frequency).toEqual('Bimonthly');

      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockGetAccountStatementPreferencesForMfcWithMonth));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
      expect(component.statementPreferencesDetails.frequency).toEqual('Monthly');

      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockGetAccountStatementPreferencesForMfcWithQuarter));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
      expect(component.statementPreferencesDetails.frequency).toEqual('Quarterly');
   });

   it('should be get statement preferences details for frequencies never and unknown', () => {
      component.buttonName = component.labels.save;
      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockStatementPreferencesNever));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
      expect(component.statementPreferencesDetails.frequency).toEqual(component.values.never);
      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockStatementPreferencesUnknown));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
      expect(component.statementPreferencesDetails.frequency).toEqual(component.values.unknown);
   });

   it('should not be get statement preferences details', () => {
      component.buttonName = component.labels.save;
      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
      fixture.detectChanges();
      component.getAccountStatementPreferencesDetails();
   });

   it('should be update statement preferences', () => {
      component.buttonName = component.labels.save;
      component.statementDetails.isGroupDisabled = false;
      service.updateAccountStatementPreferences = jasmine.createSpy('updateAccountStatementPreferences')
         .and.returnValue(Observable.of(mockUpdateAccountStatementPreferences));
      fixture.detectChanges();
      component.updateStatementPreferences(mockGetAccountStatementPreferences.data);
      const showUpdateMessage = {
         showAlert: true,
         displayMessageText: component.messages.updateSuccess,
         action: 'close',
         alertType: 'Success',
      };
      accountServiceStub.showAlertMessage(showUpdateMessage);
      expect(component.isShowAlert).toEqual(true);
      expect(component.statementDetails.isGroupDisabled).toEqual(true);
      expect(component.buttonName).toEqual(component.labels.save);
      expect(component.statementDetails.inProgress).toEqual(false);
   });

   it('should call update statement preferences and have set default value to DO NOT SEND', () => {
      component.buttonName = component.labels.save;
      component.statementDetails.isGroupDisabled = false;
      service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockStatementPreferencesWithoutDeliveryMode));
      component.getAccountStatementPreferencesDetails();
      expect(component.deliveryMode).toEqual(component.values.doNotSend);
   });

   it('should be fail to update statement preferences', () => {
      component.buttonName = component.labels.save;
      component.statementDetails.isGroupDisabled = false;
      service.updateAccountStatementPreferences = jasmine.createSpy('updateAccountStatementPreferences')
         .and.returnValue(Observable.of(mockUpdateAccountStatementPreferencesWithFail));
      fixture.detectChanges();
      component.updateStatementPreferences(mockGetAccountStatementPreferences.data);
      const showErrorMessage = {
         showAlert: true,
         displayMessageText: component.messages.updateFail,
         action: 2,
         alertType: 3,
      };
      accountServiceStub.showAlertMessage(showErrorMessage);
      expect(component.isShowAlert).toEqual(true);
      expect(component.statementDetails.isGroupDisabled).toEqual(false);
      expect(component.buttonName).toEqual(component.labels.save);
      expect(component.statementDetails.inProgress).toEqual(false);
   });

   it('should not be update statement preferences', () => {
      component.buttonName = component.labels.save;
      component.statementDetails.isGroupDisabled = false;
      service.updateAccountStatementPreferences = jasmine.createSpy('updateAccountStatementPreferences')
         .and.returnValue(Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
      fixture.detectChanges();
      component.updateStatementPreferences(mockGetAccountStatementPreferences.data);
      expect(component.statementDetails.inProgress).toEqual(false);
      expect(component.statementDetails.isGroupDisabled).toEqual(false);
      expect(component.buttonName).toEqual(component.labels.save);
   });

   it('should not call update statement preferences', () => {
      component.buttonName = component.labels.save;
      component.statementDetails.isGroupDisabled = true;
      fixture.detectChanges();
      expect(component.updateStatementPreferences(mockGetAccountStatementPreferences.data)).toBe(false);
   });

   it('should be edit statement preferences', () => {
      component.buttonName = component.labels.save;
      component.statementDetails.isGroupDisabled = false;
      fixture.detectChanges();
      component.updateStatementPreferences(mockGetAccountStatementPreferences.data);
      expect(component.statementDetails.isGroupDisabled).toEqual(true);
      expect(component.buttonName).toEqual(component.labels.save);
   });
   it('should be call validateDeliveryMode', () => {
      component.validateDeliveryMode(mockInvalidEmailAccountStatementPreferences.data);
      expect(component.statementDetails.isGroupDisabled).toBe(false);
   });
   it('should be call validateDeliveryMode', () => {
      component.deliveryMode = 'POST';
      component.validateDeliveryMode(mockInvalidEmailAccountStatementPreferences.data);
      expect(component.statementDetails.isGroupDisabled).toBe(true);
   });

   it('should be close notification message', () => {
      component.onAlertLinkSelected(false);
      expect(component.isShowAlert).toBe(false);
   });
   it('should be call onEdit', () => {
      component.onEdit();
      expect(component.statementDetails.isGroupDisabled).toBe(false);
      expect(component.isShowAlert).toBe(false);
   });
   it('should be call isDisable', () => {
      component.statementDetails.isGroupDisabled = true;
      component.statementPreferencesDetails.deliveryMode = '';
      component.statementDetails.inProgress = false;
      component.isDisable();
      expect(component.isDisable()).toBe(true);
   });
   it('should be call isDisable return false', () => {
      component.statementDetails.isGroupDisabled = false;
      component.statementPreferencesDetails.deliveryMode = 'Email';
      component.statementDetails.inProgress = false;
      component.isDisable();
      expect(component.isDisable()).toBe(false);
   });
   it('should be call changeIsGroupDisabled', () => {
      component.changeIsGroupDisabled(false);
      expect(component.statementDetails.isGroupDisabled).toBe(false);
   });
   it('should be change toggle button', () => {
      component.statementPreferencesDetails = mockGetAccountStatementPreferences.data;
      component.onTypeChange(Constants.VariableValues.statementPreferenceTypes[0]);
      expect(component.statementPreferencesDetails.deliveryMode).toBe(Constants.VariableValues.statementPreferenceTypes[0].value);
   });
   // unit trust test cases
   it('should show confirmation pop-up on click of save button', () => {
      component.buttonName = component.labels.save;
      component.displayConfirmationPopup();
      expect(component.showConfirmationPopup).toBe(true);
   });

   it('should hide confirmation pop-up on click of cancel button', () => {
      component.hideConfirmationPopup();
      expect(component.showConfirmationPopup).toBe(false);
   });
   it('should show unit trust view', () => {
      accountServiceStub.getAccountData.and.returnValue(Observable.of(mockAccountDataWithINV));
      accountServiceStub.getDashboardAccounts.and.returnValue(Observable.of(mockInvAccounts));
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.statementDetails.accountType).toEqual('INV');
      expect(component.isUnitTrust).toBe(true);
   });
   it('should hide confirmation pop-up on click of confirm button', () => {
      component.confirmUpdateStatementPreferences(component.statementDetails);
      expect(component.showConfirmationPopup).toBe(false);
   });
   it('should set email [] if paramter is not recived', () => {
      accountServiceStub.getAccountStatementPreferences.and.returnValue(Observable.of(mockGetAccountStatementPreferencesNoEmail));
      component.getAccountStatementPreferencesDetails();
      fixture.detectChanges();
      expect(component.statementPreferencesDetails.email).toEqual([]);
   });
   it('should call add statement preferences if email is not present and set delivery mode as email', () => {
      component.buttonName = component.labels.save;
      accountServiceStub.getAccountStatementPreferences.and.returnValue(Observable.of(mockGetAccountStatementPreferencesEmptyEmail));
      component.getAccountStatementPreferencesDetails();
      fixture.detectChanges();
      expect(component.statementPreferencesDetails.email).toEqual([]);
      component.confirmUpdateStatementPreferences(component.statementDetails);
      expect(component.showConfirmationPopup).toBe(false);
      expect(component.unitTrustEmail).toEqual(undefined);
      component.addStatementPreferences(component.statementPreferencesDetails);
      expect(component.statementPreferencesDetails.deliveryMode).toEqual('EMAIL');
   });
   it('should call update statement preferences and have set delivery mode to EMAIL if email is presenet', () => {
      component.buttonName = component.labels.save;
      accountServiceStub.getAccountStatementPreferences.and.returnValue(Observable.of(mockStatementPreferencesWithoutDeliveryMode));
      component.getAccountStatementPreferencesDetails();
      fixture.detectChanges();
      expect(component.unitTrustEmail).toEqual('GUNJAL138@GMAIL.COM');
      component.updateStatementPreferences(component.statementPreferencesDetails);
      expect(component.statementPreferencesDetails.deliveryMode).toEqual('EMAIL');
   });
   it('should be add statement preferences', () => {
      component.buttonName = component.labels.save;
      component.statementDetails.isGroupDisabled = false;
      service.updateAccountStatementPreferences = jasmine.createSpy('updateAccountStatementPreferences')
         .and.returnValue(Observable.of(mockUpdateAccountStatementPreferences));
      fixture.detectChanges();
      component.addStatementPreferences(mockGetAccountStatementPreferences.data);
      const showUpdateMessage = {
         showAlert: true,
         displayMessageText: component.messages.updateSuccess,
         action: 'close',
         alertType: 'Success',
      };
      accountServiceStub.showAlertMessage(showUpdateMessage);
      expect(component.isShowAlert).toEqual(true);
   });
   it('should be fail to add statement preferences', () => {
      component.buttonName = component.labels.save;
      component.statementDetails.isGroupDisabled = false;
      service.updateAccountStatementPreferences = jasmine.createSpy('updateAccountStatementPreferences')
         .and.returnValue(Observable.of(mockUpdateAccountStatementPreferencesWithFail));
      fixture.detectChanges();
      component.addStatementPreferences(mockGetAccountStatementPreferences.data);
      const showErrorMessage = {
         showAlert: true,
         displayMessageText: component.messages.updateFail,
         action: 2,
         alertType: 3,
      };
      accountServiceStub.showAlertMessage(showErrorMessage);
      expect(component.isShowAlert).toEqual(true);
      expect(component.buttonName).toEqual(component.labels.save);
      expect(component.statementDetails.inProgress).toEqual(false);
   });
   it('should not be add statement preferences', () => {
      component.buttonName = component.labels.save;
      component.statementDetails.isGroupDisabled = false;
      service.updateAccountStatementPreferences = jasmine.createSpy('updateAccountStatementPreferences')
         .and.returnValue(Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
      fixture.detectChanges();
      component.addStatementPreferences(mockGetAccountStatementPreferences.data);
      expect(component.statementDetails.inProgress).toEqual(false);
      expect(component.statementDetails.isGroupDisabled).toEqual(false);
      expect(component.buttonName).toEqual(component.labels.save);
   });
   it('should change unit trust button disable flag to false', () => {
      component.emailChange();
      expect(component.isUnitTrustButtonDisable).toEqual(false);
   });
});
describe('StatementPreferencesComponent', () => {
   let component: StatementPreferencesComponent;
   let fixture: ComponentFixture<StatementPreferencesComponent>;
   let service: AccountService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam), SharedModule],
         declarations: [StatementPreferencesComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [LoaderService, { provide: AccountService, useValue: accountServiceStub },
            { provide: WindowRefService, useValue: windowServiceStubMobile },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '3' }) } }]
      })
         .compileComponents();
   }));
   beforeEach(() => {
      fixture = TestBed.createComponent(StatementPreferencesComponent);
      component = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });
   it('should make mobile view true', () => {
      service.getAccountData = jasmine.createSpy('getAccountData')
         .and.returnValue(Observable.of(mockAccountDataWithOutId));
      service.getDashboardAccounts = jasmine.createSpy('getDashboardAccounts')
         .and.returnValue(Observable.of(mockDashboardAccounts));
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.statementDetails.accountType).toEqual(component.accountTypes.creditCardAccountType.code);
      expect(component.isMobileView).toBe(true);
   });
});

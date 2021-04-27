import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { assertModuleFactoryCaching } from './../../test-util';
import { BeneficiaryService } from '../../core/services/beneficiary.service';
import { IAccountDetail, IClientDetails } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { IContactCard, IBankDefinedBeneficiary, IPrepaidAccountDetail, IRefreshAccountsApiResult } from '../../core/services/models';
import { IPaymentMetaData } from './../../core/services/models';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { HighlightPipe } from './../../shared/pipes/highlight.pipe';

import { PaymentService } from './../../payment/payment.service';
import { IPayAmountVm } from './../../payment/payment.models';
import { AccountService } from '../account.service';
import { QuickpayComponent } from './quickpay.component';

const el = {
   show: jasmine.createSpy('show'),
   hide: jasmine.createSpy('hide')
};

let isMobilePayment = false;

const returnValueMakePayment = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'SUCCESS',
               reason: ''
            },
            {
               operationReference: 'ABC',
               result: 'FV01',
               status: 'ERROR',
               reason: ''
            }
         ]
      }
   ]
});

const returnValueMakePaymentNoTransaction = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'ABC',
               result: 'FV01',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
});

const paymentDetails: any = {
   bFName: 'name',
   bank: 'bank',
   amount: 1234,
   toAccount: {
      accountNumber: '1234'
   },
   fromAccount: {
      accountNumber: '1234',
      accountType: 'SA'
   },
   cellphone: '123',
   myDescription: 'abc',
   beneficiaryDescription: 'abc'
};

const paymentServiceStub = {
   paymentWorkflowSteps: {
      payTo: {
         isDirty: false
      },
      payAmount: {
         isDirty: false
      },
      payFor: {
         isDirty: false
      },
      payReview: {
         isDirty: false
      }
   },
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of([{
      accountNumber: '123456',
      availableBalance: 24567,
      currentBalance: 34567,
      nickname: 'Test account'
   }])),

   getPaymentLimits: jasmine.createSpy('getPaymentLimits').and.returnValue(Observable.of([{
      limitType: 'payment',
      userAvailableDailyLimit: 500
   }, {
      limitType: 'sendimali',
      userAvailableDailyLimit: 100
   }])),

   isMobilePayment: function () {
      return isMobilePayment;
   },

   getPayAmountVm: jasmine.createSpy('getPayAmountVm').and.returnValue(
      <IPayAmountVm>{
         isInstantPay: false,
         isTransferLimitExceeded: false,
         isValid: true,
         availableTransferLimit: 50000,
         allowedTransferLimit: 40000,
         transferAmount: 0,
         selectedAccount: null,
         paymentDate: new Date(),
         recurrenceFrequency: Constants.VariableValues.paymentRecurrenceFrequency.none.code,
         numRecurrence: 0,
         reccurenceDay: 0
      }
   ),
   getPayToVm: jasmine.createSpy('getPayToVm').and.returnValue({
      isAccountPayment: true,
      bank: {
         rtc: true,
         universalCode: '123'
      }
   }),
   getPayForVm: jasmine.createSpy('getPayForVm').and.returnValue(paymentDetails),

   getPayReviewVm: jasmine.createSpy('getPayReviewVm').and.returnValue({ isSaveBeneficiary: false }),


   savePayForInfo: jasmine.createSpy('savePayForInfo'),
   savePayAmountInfo: jasmine.createSpy('savePayAmountInfo').and.returnValue({}),
   savePayReviewInfo: jasmine.createSpy('savePayReviewInfo'),
   savePayToInfo: jasmine.createSpy('getPayToVm'),

   makePayment: jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
      return returnValueMakePayment;
   }),
   getPaymentDetailInfo: jasmine.createSpy('getPaymentDetailInfo').and.returnValue(paymentDetails),
   isPaymentStatusNavigationAllowed: jasmine.createSpy('isPaymentStatusNavigationAllowed').and.returnValue(true),
   clearPaymentDetails: jasmine.createSpy('clearPaymentDetails').and.callThrough,
   updateTransactionID: jasmine.createSpy('updateTransactionID').and.callThrough,
   updateexecEngineRef: () => { },
   resetPaymentModels: jasmine.createSpy('updateTransactionID').and.callThrough,
   isPaymentStatusValid: jasmine.createSpy('isPaymentStatusValid').and.returnValue(true),
   getBanks: jasmine.createSpy('getBanks').and.returnValue(Observable.of([])),
   getPublicHolidays: jasmine.createSpy('getPublicHolidays').and.returnValue(Observable.of([{
      date: '2018-10-10',
      dayName: 'Monday',
      description: 'abc'
   }])),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>(getMockPaymentAccounts()),
   initializePaymentWorkflowSteps: jasmine.createSpy('initializePaymentWorkflowSteps'),
   raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
   createGUID: jasmine.createSpy('createGUID').and.callFake(() => { }),
   raiseSystemErrorforAPIFailure: jasmine.createSpy('raiseSystemErrorforAPIFailure').and.callFake((redirectURL: string) => { }),
   isAPIFailure: jasmine.createSpy('isAPIFailure').and.returnValue(true)
};
function getMockPaymentAccounts(): IPrepaidAccountDetail[] {
   return [{
      itemAccountId: '1',
      accountNumber: '1001004345',
      productCode: '017',
      productDescription: 'TRANSACTOR',
      isPlastic: false,
      accountType: 'CA',
      nickname: 'TRANS 02',
      sourceSystem: 'Profile System',
      currency: 'ZAR',
      availableBalance: 42250354156.29,
      currentBalance: 42250482237.21,
      profileAccountState: 'ACT',
      accountLevel: 'U0',
      viewAvailBal: true,
      viewStmnts: true,
      isRestricted: false,
      viewCurrBal: true,
      viewCredLim: true,
      viewMinAmtDue: true,
      isAlternateAccount: true,
      allowCredits: true,
      allowDebits: true,
      accountRules: {
         instantPayFrom: true,
         onceOffPayFrom: true,
         futureOnceOffPayFrom: true,
         recurringPayFrom: true,
         recurringBDFPayFrom: true,
         onceOffTransferFrom: true,
         onceOffTransferTo: true,
         futureTransferFrom: true,
         futureTransferTo: true,
         recurringTransferFrom: true,
         recurringTransferTo: true,
         onceOffPrepaidFrom: true,
         futurePrepaidFrom: true,
         recurringPrepaidFrom: true,
         onceOffElectricityFrom: true,
         onceOffLottoFrom: true,
         onceOffiMaliFrom: true
      }
   }];
}

function getContactCardData(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: 'Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'CA',
            beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed',
            accountNumber: '1104985268',
            bankName: 'NEDBANK',
            branchCode: '171338',
            beneficiaryType: 'PLL',
            myReference: 'Z Mahomed',
            instantPaymentAvailable: true,
            beneficiaryReference: 'Gomac',
            valid: true,
         },
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268'
            , branchCode: '171338',
            beneficiaryType: 'PEL', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      }],
      beneficiaryRecentTransactDetails: []
   };
}
const SelectedBeneficiary = {
   accountType: 'CA',
   beneficiaryID: 2,
   beneficiaryName: 'Zahira Mahomed',
   accountNumber: 1104985268,
   bankName: 'NEDBANK',
   branchCode: '171338',
   beneficiaryType: 'PLL',
   myReference: 'Z Mahomed',
   instantPaymentAvailable: true,
   beneficiaryReference: 'Gomac',
   bankCode: 'FFF',
   valid: true,
};
function getBankApprovedData(): IBankDefinedBeneficiary {
   return {
      bDFID: '11111110',
      bDFName: 'STANDARD BANK CARD DIVISION',
      sortCode: 205
   };
}
const beneficiaryServiceStub = {
   getBankApprovedBeneficiaries: jasmine.createSpy('getBankApprovedBeneficiaries').and.returnValue(Observable.of([getBankApprovedData()])),
   getContactCards: jasmine.createSpy('getContactCards').and.returnValue(Observable.of([getContactCardData()])),
};
const clientDetails: IClientDetails = {
   FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
   EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
};
const clientProfileDetailsServiceStub = {
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
};
const mockRefreshAccountsApiResponse: IRefreshAccountsApiResult = {
   result: {
      resultCode: 0,
      resultMessage: ''
   }
};
const accountServiceStub = {
   refreshAccounts: jasmine.createSpy('refreshAccounts').and.returnValue(Observable.of(mockRefreshAccountsApiResponse)),
   notifyAccountsUpdate: jasmine.createSpy('getDashboardAccounts').and.returnValues(Observable.of())
};
describe('QuickpayComponent', () => {
   let component: QuickpayComponent;
   let fixture: ComponentFixture<QuickpayComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      isMobilePayment = false;
      TestBed.configureTestingModule({
         declarations: [
            QuickpayComponent,
            HighlightPipe,
            SkeletonLoaderPipe,
            AmountTransformPipe
         ],
         imports: [FormsModule, TooltipModule.forRoot()],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: PaymentService, useValue: paymentServiceStub }, SystemErrorService,
         { provide: BeneficiaryService, useValue: beneficiaryServiceStub },
         { provide: AccountService, useValue: accountServiceStub },
         { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub }],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(QuickpayComponent);
      component = fixture.componentInstance;
      component.selectedBeneficiary = SelectedBeneficiary;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should toggle instant pay', () => {
      component.isInstantPaymentValid = true;
      component.onInstantPayClick(null);
      expect(component.payAmountVm.isInstantPay).toBeTruthy();
   });

   it('should check for no accounts', () => {
      paymentServiceStub.accountsDataObserver.next([]);
      fixture.detectChanges();
   });

   it('should check for null in account', () => {
      paymentServiceStub.accountsDataObserver.next(null);
      fixture.detectChanges();
   });

   it('should show tooltip on instant pay toggle click', () => {
      component.isInstantPaymentValid = false;
      component.onInstantPayClick(el);
      expect(el.show).toHaveBeenCalled();
   });

   it('should handle payment amount change', () => {
      component.payAmountVm.transferAmount = 123456;
      component.onAmountChange(component.payAmountVm.transferAmount);
      expect(component.payAmountVm.isTransferLimitExceeded).toBe(true);
   });

   it('should handle payment amount change', () => {
      component.payAmountVm.transferAmount = 1;
      component.onAmountChange(component.payAmountVm.transferAmount);
      expect(component.payAmountVm.isTransferLimitExceeded).toBe(false);
   });

   it('should handle account selection', () => {
      component.onAccountSelection(component.payAmountVm.selectedAccount);
      expect(component.payAmountVm.selectedAccount).toBeDefined();
   });
   it('should check if the form is dirty', () => {
      component.validate();
      expect(component.quickPayForm.dirty).toBe(false);
   });
   it('should call show on showTooltip when visibility is false', () => {
      component.payAmountVm.isInstantPay = false;
      component.showTooltip(el);
      expect(el.show).toHaveBeenCalled();
   });
   it('should add class on showTooltip when visibility is true', () => {
      component.payAmountVm.isInstantPay = true;
      component.hideTooltip(el);
      expect(el.hide).toHaveBeenCalled();
   });
   it('should set message for time when tooltip is shown', () => {
      component.currentDate = new Date('2017-10-08');
      component.payAmountVm.isInstantPay = true;
      component.showTooltip(el);
      expect(component.instantPayUnavailableMsg).toEqual(Constants.labels.instantPay.accountErrorMessage);
   });

   it('should set message for time when tooltip is shown', () => {
      component.currentDate = new Date('2017-10-08');
      component.selectedBeneficiary.instantPaymentAvailable = false;
      component.showTooltip(el);
      expect(component.instantPayUnavailableMsg).toEqual(Constants.labels.instantPay.accountErrorMessage);
   });

   it('should check for Sunday', () => {
      component.selectedBeneficiary.instantPaymentAvailable = true;
      component.currentDate = new Date('2017-10-08');
      expect(component.isSunday()).toEqual(true);
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should check for not allowed from bank', () => {
      component.selectedBeneficiary.instantPaymentAvailable = false;
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toBe(false);
   });

   it('should check for Saturday', () => {
      component.currentDate = new Date('2017-10-07');
      component.selectedBeneficiary.instantPaymentAvailable = false;
      expect(component.isSaturday()).toEqual(true);
   });

   it('should check for week day', () => {
      component.currentDate = new Date('2017-10-06');
      expect(component.isWeekDay()).toEqual(true);
   });

   it('should check for public holiday', () => {
      component.selectedBeneficiary.instantPaymentAvailable = true;
      component.currentDate = new Date('2018-10-10 06:00:00');
      component.publicHolidays = [{
         date: '2018-10-10',
         description: '',
         dayName: ''
      }];
      expect(component.isPublicHoliday()).toBeDefined();
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should check for time on Saturday', () => {
      component.currentDate = new Date('07-10-2017 20:03:44');
      component.selectedBeneficiary.instantPaymentAvailable = true;
      expect(component.isValidInstantPaymentTime()).toBe(false);
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should check for time on week days', () => {
      component.currentDate = new Date('06-10-2017 20:03:44');
      component.selectedBeneficiary.instantPaymentAvailable = true;
      expect(component.isValidInstantPaymentTime()).toBe(false);
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should validate instant payment with valid data', () => {
      component.selectedBeneficiary.instantPaymentAvailable = true;
      component.currentDate = new Date('06-10-2017 10:03:44');
      component.publicHolidays = [{
         date: '2018-10-10',
         description: '',
         dayName: ''
      }];
      component.isInstantPayAvailableForAcc = true;
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(true);
   });

   it('should validate instant payment time for default scenario', () => {
      component.currentDate = new Date('2017-10-08');
      expect(component.isValidInstantPaymentTime()).toBeUndefined();
   });
   it('should check payment limit with account payment', () => {
      isMobilePayment = false;
      const selectedacc = component.payAmountVm.selectedAccount;
      selectedacc.accountType = 'SA';
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.payAmountVm.availableTransferLimit).toBe(500);
   });
   it('should toggle overlay visibility on activeOverlay call', () => {
      component.isVisible = true;
      component.activeOverlay();
      expect(component.isVisible).toBe(false);
      component.activeOverlay();
      expect(component.isVisible).toBe(true);
   });

   it('should check if payment is through cellphone(isPrepaid) onselectBeneficiary call', () => {
      component.selectedBeneficiary = null;
      const benefeciary = {
         item: component.processedBeneficiaryData[0]
      };
      benefeciary.item.beneficiaryType = 'PPD';
      component.selectBeneficiary(benefeciary);
      fixture.detectChanges();
      expect(component.selectedBeneficiary).not.toBeNull();
   });

   it('should set benefeciary onselectBeneficiary call', () => {
      component.selectedBeneficiary = null;
      const benefeciary = {
         item: component.processedBeneficiaryData[0]
      };
      component.selectBeneficiary(benefeciary);
      fixture.detectChanges();
      expect(component.selectedBeneficiary).not.toBeNull();
   });

   it('should set visible on hide overlay', () => {
      component.hideOverlay(true);
      expect(component.isVisible).toBe(true);
   });

   it('should clear beneficiary there is no benefeciary result ', () => {
      const benefeciary = {
         item: component.processedBeneficiaryData[0]
      };
      component.selectBeneficiary(benefeciary);
      component.noBeneficiaryResults('abcd');
      fixture.detectChanges();
      component.blurBeneficiaryInput();
      fixture.detectChanges();
      expect(component.selectedBeneficiary).toBe(null);
      component.selectBeneficiary(benefeciary);
      component.noBeneficiaryData = null;
      component.blurBeneficiaryInput();
      fixture.detectChanges();
      expect(component.selectedBeneficiary).not.toBe(null);
   });

   it('should set workflowsteps on next click', () => {
      const benefeciary = {
         item: component.processedBeneficiaryData[0]
      };
      component.selectBeneficiary(benefeciary);
      component.onNextClick();
      fixture.detectChanges();
      expect(component.quickpayWorkflowSteps.payAmount).toBe(false);
      expect(component.quickpayWorkflowSteps.payReview).toBe(true);
      expect(component.quickpayWorkflowSteps.payStatus).toBe(false);
   });

   it('should set workflowsteps on edit click', () => {
      component.onEditClick();
      fixture.detectChanges();
      expect(component.quickpayWorkflowSteps.payAmount).toBe(true);
      expect(component.quickpayWorkflowSteps.payReview).toBe(false);
      expect(component.quickpayWorkflowSteps.payStatus).toBe(false);
   });


   it('should clear beneficiary if nothing is selected on blur', () => {
      const benefeciary = {
         item: component.processedBeneficiaryData[0]
      };
      component.selectBeneficiary(benefeciary);
      component.blurBeneficiary(null);
      fixture.detectChanges();
      expect(component.selectedBeneficiary).toBe(null);
   });
   it('should set beneficiary if it is selected on blur', () => {
      const benefeciary = {
         item: component.processedBeneficiaryData[0]
      };
      component.blurBeneficiary(benefeciary);
      fixture.detectChanges();
      expect(component.selectedBeneficiary).not.toBe(null);
   });

   it('should reinitialize on click of done', () => {
      component.onPaymentDone();
      fixture.detectChanges();
      expect(component.quickpayWorkflowSteps.payAmount).toBeTruthy();
      expect(component.quickpayWorkflowSteps.payReview).toBeFalsy();
      expect(component.quickpayWorkflowSteps.payStatus).toBeFalsy();
   });


   it('should make payment on click of pay', () => {
      component.onPayClick();
      fixture.detectChanges();
      expect(component.quickpayWorkflowSteps.payAmount).toBeFalsy();
      expect(component.quickpayWorkflowSteps.payStatus).toBeTruthy();
      expect(component.quickpayWorkflowSteps.payReview).toBeFalsy();
   });


   it('should not set isPaymentSuccessful on every step failure',
      inject([PaymentService], (paymentService: PaymentService) => {
         paymentService.makePayment = jasmine.createSpy('makePayment').and.returnValue(Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
         component.makeQuickPayment();
         fixture.detectChanges();
         expect(component.isPaymentSuccessful).toBeUndefined();
      }));

   it('should not set isPaymentSuccessful on every step failure'
      , inject([PaymentService], (paymentService: PaymentService) => {
         paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(true);
         paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
            if (validate) {
               return returnValueMakePayment;
            } else {
               return Observable.create(observer => {
                  observer.error(new Error('error'));
                  observer.complete();
               });
            }
         });
         component.makeQuickPayment();
         fixture.detectChanges();
         expect(component.isPaymentSuccessful).toBeUndefined();
         expect(paymentService.raiseSystemErrorforAPIFailure).toHaveBeenCalled();
      }));
   it('should not set isPaymentSuccessful on every step failure '
      , inject([PaymentService], (paymentService: PaymentService) => {
         paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(true);
         paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
            if (validate) {
               return returnValueMakePayment;
            } else {
               paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(false);
               return returnValueMakePayment;
            }
         });
         component.makeQuickPayment();
         fixture.detectChanges();
         expect(component.isPaymentSuccessful).toBeUndefined();
      }));
   it('should not set isPaymentSuccessful on every step failure '
      , inject([PaymentService], (paymentService: PaymentService) => {
         paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(false);
         component.makeQuickPayment();
         fixture.detectChanges();
         expect(component.isPaymentSuccessful).toBeUndefined();
      }));

   it('shouldhandle assignee and amount field validation', () => {
      const benefeciary = {
         item: component.processedBeneficiaryData[0]
      };
      component.selectBeneficiary(benefeciary);
      fixture.detectChanges();
      component.payAmountVm.transferAmount = 0;
      component.insufficientFunds = false;
      component.validateQuickPay();
      fixture.detectChanges();
      expect(component.payAmountVm.isValid).toBe(false);
      expect(component.insufficientFunds).toBe(false);
   });

   it('shouldhandle empty bank name and assign unknownAccountType', () => {
      const benefeciary = {
         item: component.processedBeneficiaryData[0]
      };
      component.selectBeneficiary(benefeciary);
      fixture.detectChanges();
      component.selectedBeneficiary.bankName = '';
      component.onNextClick();
      fixture.detectChanges();
      expect(component.quickpayWorkflowSteps.payAmount).toBe(false);
      expect(component.quickpayWorkflowSteps.payReview).toBe(true);
      expect(component.quickpayWorkflowSteps.payStatus).toBe(false);
   });
   it('should handle prepaid account when selected', () => {
      const benefeciary = {
         item: component.processedBeneficiaryData[0]
      };
      component.selectBeneficiary(benefeciary);
      component.isPrepaid = true;
      component.onNextClick();
      expect(component.quickpayWorkflowSteps.payAmount).toBe(false);
      expect(component.quickpayWorkflowSteps.payReview).toBe(true);
      expect(component.quickpayWorkflowSteps.payStatus).toBe(false);
   });
   it('shouldhandle retry payment max until limit reached'
      , inject([PaymentService], (paymentService: PaymentService) => {
         paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(false);
         paymentService.isAPIFailure = false;
         component.onRetryQuickPay();
         expect(component.isPaymentSuccessful).not.toBe(true);
         component.onRetryQuickPay();
         expect(component.isPaymentSuccessful).not.toBe(true);
         component.onRetryQuickPay();
         expect(component.disableRetryButton).toBe(true);
      }));
   it('should get isAPIFailure ', () => {
      const isAPIFailure = component.IsAPIFailure;
   });
   it('should give instant pay allowed for account if account is not CASA', () => {
      component.currentDate = new Date('2017-10-08');
      component.selectedBeneficiary.instantPaymentAvailable = false;
      component.isInstantPayAvailableForAcc = true;
      component.showTooltip(el);
      expect(component.instantPayUnavailableMsg).toEqual(Constants.labels.instantPay.bankErrorMessage);
   });
   it('instant pay not avaiable this time meesage must be shown if account is CASA and instant pay is available', () => {
      component.currentDate = new Date('2017-10-08');
      component.selectedBeneficiary.instantPaymentAvailable = true;
      component.isInstantPayAvailableForAcc = true;
      component.showTooltip(el);
      expect(component.instantPayUnavailableMsg).toEqual(Constants.labels.instantPay.timeErrorMessage);
   });
   it('instant pay must available if selected account is CASA', () => {
      const selectedacc = component.payAmountVm.selectedAccount;
      selectedacc.accountType = 'SA';
      component.onAccountSelection(selectedacc);
      expect(component.isInstantPayAvailableForAcc).toBe(true);
   });
   it('should check if instant payment allowed for this accont', () => {
      component.selectedBeneficiary.instantPaymentAvailable = true;
      component.currentDate = new Date('2017-10-09');
      component.isInstantPayAvailableForAcc = false;
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });
});

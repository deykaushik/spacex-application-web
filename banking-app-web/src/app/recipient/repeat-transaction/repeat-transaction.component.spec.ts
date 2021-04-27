import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from './../../test-util';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { RepeatTransactionComponent } from './repeat-transaction.component';
import { BeneficiaryService } from '../../core/services/beneficiary.service';
import { LoaderService } from '../../core/services/loader.service';
import { PaymentService } from '../../payment/payment.service';
import { IPayAmountVm } from '../../payment/payment.models';
import { Constants } from '../../core/utils/constants';
import { IAccountDetail, IPrepaidAccountDetail, IClientDetails, IContactCard } from '../../core/services/models';
import { SharedModule } from '../../shared/shared.module';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { CommonUtility } from '../../core/utils/common';
import { SystemErrorService } from '../../core/services/system-services.service';

const testComponent = class { };

const routerTestingStub = [
   { path: 'recipient/payment/status', component: testComponent }
];

describe('RepeatTransactionComponent', () => {
   let component: RepeatTransactionComponent;
   let fixture: ComponentFixture<RepeatTransactionComponent>;
   function getContactCardData(): IContactCard {
      return {
         contactCardID: 4,
         contactCardName: 'Zahira Mahomed',
         contactCardDetails: [
            {
               accountType: 'CA', beneficiaryID: 2,
               beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
               bankName: 'NEDBANK', branchCode: '171338',
               beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
               beneficiaryReference: 'Gomac', valid: true
            }, {
               accountType: 'CA', beneficiaryID: 3,
               beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
               bankName: 'NEDBANK', branchCode: '171338',
               beneficiaryType: 'PPD', myReference: 'Z Mahomed',
               beneficiaryReference: 'Gomac', valid: true
            },
            {
               accountType: 'CA', beneficiaryID: 4,
               beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
               bankName: 'NEDBANK', branchCode: '171338',
               beneficiaryType: 'PEL', myReference: 'Z Mahomed',
               beneficiaryReference: 'Gomac', valid: true
            }
         ],
         contactCardNotifications: [{
            notificationAddress: 'swapnilp@yahoo.com',
            notificationType: 'EMAIL', notificationDefault: true,
            notificationParents: []
         }],
         beneficiaryRecentTransactDetails: []
      };
   }
   const mockAccountData: IAccountDetail = {
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
   };
   const beneficairyData = {
      selectedTransaction: {
         beneficiaryID: 2,
         paymentAmount: 100,
         paymentCRNarration: 'hi',
         paymentDRNarration: 'hi',
         acctNumber: '123456'
      },
      contactCard: getContactCardData()
   };
   const beneServiceStub = {
      selectedBeneficiary: new BehaviorSubject(beneficairyData)
   };

   const loaderStud = {
      show() { },
      hide() { }
   };
   const paymentDetails: any = {
      bFName: 'name',
      bank: 'bank',
      amount: 1234,
      toAccount: {
         accountNumber: '1234'
      },
      fromAccount: {
         accountNumber: '1234',
         accountType: 'CC'
      },
      cellphone: '123',
      myDescription: 'abc',
      beneficiaryDescription: 'abc'
   };

   const returnValueMakePayment = function (value = 'SUCCESS') {
      return Observable.of({
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'FV01',
                     status: value,
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
         return returnValueMakePayment();
      }),
      getPaymentDetailInfo: jasmine.createSpy('getPaymentDetailInfo').and.returnValue(paymentDetails),
      isPaymentStatusNavigationAllowed: jasmine.createSpy('isPaymentStatusNavigationAllowed').and.returnValue(true),
      clearPaymentDetails: jasmine.createSpy('clearPaymentDetails').and.callThrough,
      updateTransactionID: jasmine.createSpy('updateTransactionID').and.callThrough,
      updateexecEngineRef: () => { },
      resetPaymentModels: jasmine.createSpy('updateTransactionID').and.callThrough,
      isPaymentStatusValid: jasmine.createSpy('isPaymentStatusValid').and.returnValue(true),
      getPublicHolidays: jasmine.createSpy('getPublicHolidays').and.returnValue(Observable.of([{
         date: '2018-10-10',
         dayName: 'Monday',
         description: 'abc'
      }])),
      initializePaymentWorkflowSteps: jasmine.createSpy('initializePaymentWorkflowSteps'),
      refreshAccounts: () => { },
      raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
      createGUID: jasmine.createSpy('createGUID').and.callFake(() => { }),
      raiseSystemErrorforAPIFailure: jasmine.createSpy('raiseSystemErrorforAPIFailure').and.callFake((redirectURL: string) => { })
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

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [RepeatTransactionComponent, AmountTransformPipe],
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingStub)],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            { provide: BeneficiaryService, useValue: beneServiceStub },
            LoaderService, SystemErrorService,
            { provide: PaymentService, useValue: paymentServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RepeatTransactionComponent);
      component = fixture.componentInstance;
      component.notifications = CommonUtility.getNotificationTypes();
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be call on amount change', () => {
      component.onAmountChange(100);
      expect(component.payAmountVm.isValid).toBeTruthy();
   });


   it('should be call on amount change', () => {
      component.onAmountChange(100);
      expect(component.payAmountVm.isValid).toBeTruthy();
   });
   it('should change notification successfully', () => {
      const SMSselected = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
      component.onNotificationChange(null, SMSselected);
      expect(component.payForVm.notification.value).toBe(SMSselected.value);
   });

   it('should make payment on click of pay', () => {
      component.makePaymentClick();
      fixture.detectChanges();
      expect(component.payStatus).toBeTruthy();
   });


   it('should not set isPaymentSuccessful on every step failure',
      inject([PaymentService], (paymentService: PaymentService) => {
         paymentService.makePayment = jasmine.createSpy('makePayment').and.returnValue(Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
         component.makePayment();
         fixture.detectChanges();
         expect(component.payStatus).toBeFalsy();
      }));

   it('should handle failure for second make payment request'
      , inject([PaymentService], (paymentService: PaymentService) => {
         paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(true);
         paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
            if (validate) {
               return returnValueMakePayment();
            } else {
               return Observable.create(observer => {
                  observer.error(new Error('error'));
                  observer.complete();
               });
            }
         });
         component.makePayment();
         fixture.detectChanges();
         expect(component.payStatus).toBeFalsy();
         expect(paymentService.raiseSystemErrorforAPIFailure).toHaveBeenCalled();
      }));

   it('should handle failure response second make payment request'
      , inject([PaymentService], (paymentService: PaymentService) => {
         paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(true);
         paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
            if (validate) {
               return returnValueMakePayment();
            } else {
               return returnValueMakePayment('FAILURE');
            }
         });
         component.makePayment();
         fixture.detectChanges();
      }));
   it('should unkown failure response second make payment request'
      , inject([PaymentService], (paymentService: PaymentService) => {
         paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(true);
         paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
            if (validate) {
               return returnValueMakePayment();
            } else {
               return returnValueMakePayment('UNKOWN');
            }
         });
         component.makePayment();
         fixture.detectChanges();
      }));
   it('should handle account selection'
      , inject([PaymentService], (paymentService: PaymentService) => {
         component.onAccountSelection(mockAccountData);
         fixture.detectChanges();
         expect(component.payAmountVm.selectedAccount.accountNumber).toBe(mockAccountData.accountNumber);
      }));
   it('should call go back method'
      , inject([PaymentService], (paymentService: PaymentService) => {
         component.goBack();
      }));
});

import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { PaymentService } from './../payment.service';
import { PayForComponent } from './pay-for.component';
import { Constants } from '../../core/utils/constants';
import { IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { IBeneficiaryData, IPrepaidAccountDetail, IClientDetails } from './../../core/services/models';
import { GaTrackingService } from '../../core/services/ga.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { PreFillService } from '../../core/services/preFill.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { ISettlementDetail } from '../../core/services/models';

const clientDetailsObserver: BehaviorSubject<any> = new BehaviorSubject<any>(getClientDetails());
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
      PreferredName: 'Marc',
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

const mockBeneficiaryData: IBeneficiaryData = {
   contactCard: {
      contactCardID: 1,
      contactCardName: 'ABSA',
      contactCardDetails: [
         {
            accountType: 'U0',
            beneficiaryID: 1,
            beneficiaryName: 'ABSA',
            accountNumber: '540181500',
            bankCode: '009',
            bankName: 'ABSA BANK',
            branchCode: '632005',
            beneficiaryType: 'BNFEXT',
            myReference: 'CHEQUE',
            beneficiaryReference: 'CHEQUE',
            valid: true
         }
      ],
      contactCardNotifications: [
         {
            notificationAddress: '0833537452',
            notificationType: 'SMS',
            notificationDefault: true,
            notificationParents: [
               {
                  beneficiaryID: 7,
                  beneficiaryType: 'BNFEXT',
                  notificationID: 2604457
               }
            ]
         }
      ],
   },
   contactCardDetails: {
      cardDetails: {
         accountType: 'U0',
         beneficiaryID: 1,
         beneficiaryName: 'ABSA',
         accountNumber: '540181500',
         bankCode: '009',
         bankName: 'ABSA BANK',
         branchCode: '632005',
         beneficiaryType: 'BNFEXT',
         myReference: 'CHEQUE',
         beneficiaryReference: 'CHEQUE',
         valid: true
      },
      isAccount: true,
      isPrepaid: false,
      isElectricity: false
   }
};

const mockBeneficiaryDetails = {
      beneficiaryAccountName: 'ABC',
      beneficiaryAccountStatus: 'ACTIVE',
      beneficiaryAccountType: 'SAVINGS',
      beneficiaryCurrency: 'GHS',
      checkReference: 'xyz',
      transactionID: '285jkzc',
      residentialStatus: 'RESIDENT'
};

const mockCasaAccountData = {
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

function getMockPaymentAccounts(): IPrepaidAccountDetail[] {
   return [mockCasaAccountData];
}

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
   isMobilePayment: jasmine.createSpy('isMobilePayment').and.returnValue(true),
   getPayForVm: jasmine.createSpy('getPayForVm').and.returnValue({}),
   savePayForInfo: jasmine.createSpy('savePayForInfo'),
   getPayToVm: jasmine.createSpy('getPayToVm').and.returnValue({
      isAccountPayment: true,
      isRecipientPicked: true,
      isCrossBorderPaymentActive: true,
      beneficiaryData: mockBeneficiaryData,
      crossBorderPayment: {
         beneficiaryDetails: mockBeneficiaryDetails
      }
   }),
   getActiveCasaAccounts: jasmine.createSpy('getActiveCasaAccounts').and.returnValue(Observable.of([mockCasaAccountData])),
   getPayAmountVm: jasmine.createSpy('getPayAmountVm').and.returnValue({}),
   savePayAmountInfo: jasmine.createSpy('savePayAmountInfo'),
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};
const getDefaultAccount = jasmine.createSpy('getDefaultAccount').and.returnValue(undefined);

const mockSettlementData: ISettlementDetail = {
   settlementAmt: 100,
   yourReference: 'Test Ref',
   theirReference: 'Their Reference'
};

const preFillServiceStub = new PreFillService();
preFillServiceStub.settlementDetail = mockSettlementData;

describe('PayFor Component', () => {
   let component: PayForComponent;
   let fixture: ComponentFixture<PayForComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [PayForComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: PaymentService, useValue: paymentServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         {
            provide: ClientProfileDetailsService, useValue: {
               getDefaultAccount: getDefaultAccount,
               getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue([]),
               clientDetailsObserver: clientDetailsObserver
            }
         },
         { provide: PreFillService, useValue: preFillServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(PayForComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should have default notification as NONE', () => {
      const smsSelected = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
      expect(component.vm.notification.value).toBe(smsSelected.value);
   });

   it('should change notification successfully', () => {
      const SMSselected = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
      component.onNotificationChange(null, SMSselected);
      expect(component.vm.notification.value).toBe(SMSselected.value);
   });

   // when all values are valid
   it('form should be validated with valid Email values ', () => {
      component.vm = {
         yourReference: 'test value',
         theirReference: 'test value',
         notification: { name: Constants.notificationTypes.email, value: Constants.notificationTypes.email },
         notificationInput: 'test@mail.com'
      };
      component.validate();
      expect(component.isValid).toBeTruthy();
   });


   // when all values are valid
   it('form should be invalidated with invalid Email values ', () => {
      component.vm = {
         yourReference: 'test value',
         theirReference: 'test value',
         notification: { name: Constants.notificationTypes.email, value: Constants.notificationTypes.email },
         notificationInput: 'test.mail.com'
      };
      component.validate();
      expect(component.isValid).toBeFalsy();
   });

   // when all values are valid
   it('form should be invalidated with Empty Email value ', () => {
      component.vm = {
         yourReference: 'test value',
         theirReference: 'test value',
         notification: { name: Constants.notificationTypes.email, value: Constants.notificationTypes.email },
         notificationInput: ''
      };
      component.validate();
      expect(component.isValid).toBeFalsy();
   });

   // when all values are valid
   it('form should be validated with valid SMS number values ', () => {
      component.vm = {
         yourReference: 'test value',
         theirReference: 'test value',
         notification: { name: Constants.notificationTypes.SMS, value: Constants.notificationTypes.SMS },
         notificationInput: '9898989898'
      };
      component.validate();
      expect(component.isValid).toBeTruthy();
   });


   // when SMS number is not valid
   it('form should be validated with invalid SMS number values ', () => {
      component.vm = {
         yourReference: 'test value',
         theirReference: 'test value',
         notification: { name: Constants.notificationTypes.SMS, value: Constants.notificationTypes.SMS },
         notificationInput: '876'
      };
      component.validate();
      expect(component.isValid).toBeFalsy();
   });

   // when all values are valid
   it('form should be validated with valid None notification ', () => {
      component.vm = {
         yourReference: 'test value',
         theirReference: 'test value',
         notification: { name: Constants.notificationTypes.none, value: Constants.notificationTypes.none },
         notificationInput: '876'
      };
      component.validate();
      expect(component.isValid).toBeTruthy();
   });


   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      component.isValid = true;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });


   it('should contain step handler', () => {
      expect(component.stepClick).toBeDefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should allow to change mobile number', () => {
      component.vm = {
         yourReference: 'Test your reference',
         theirReference: 'Test their reference',
         notification: { name: Constants.notificationTypes.SMS, value: Constants.notificationTypes.SMS },
         notificationInput: '1234567891'
      };
      fixture.detectChanges();
      component.vm.notificationInput = '1234567890';
      component.onMobileNumberChange(component.vm.notificationInput);
      fixture.detectChanges();
      expect(component.isValid).toBeTruthy();
   });
   it('should check if the form is dirty', () => {
      component.validate();
      expect(component.payToForm.dirty).toBe(false);
   });
   it('should set correct notification when notification is changed', () => {
      const emailNotification = component.notifications.find(m => m.value === Constants.notificationTypes.email);
      component.onNotificationChange(null, emailNotification);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.vm.notification.value).toBe(emailNotification.value);
         expect(component.vm.notification.notificationInput).toBe(undefined);

         const SMSNotification = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
         component.onNotificationChange(null, SMSNotification);
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.vm.notification.value).toBe(SMSNotification.value);
            expect(component.vm.notificationInput).toBe('0833537452');
         });
      });
   });
   it('should not set beneficiary data if recipient is not selected at pay to', () => {
      const payToVm = paymentServiceStub.getPayToVm();
      payToVm.isRecipientPicked = false;
      component.vm.notification = undefined;
      component.ngOnInit();
      expect(component.vm.notification.value).toBe(component.notifications.find(m => m.value === Constants.notificationTypes.none).value);
   });
   it('should not set beneficiary data if there is a wrong notification type or there is no default notification', () => {
      const emailNotification = component.notifications.find(m => m.value === Constants.notificationTypes.email);
      component.vm.notification.value = emailNotification.value;
      component.vm.notification.notificationInput = 'testmail@test.com';

      component.payToVm.beneficiaryData.contactCard.contactCardNotifications[0].notificationType = 'ABC';
      component.setDefaultNotification(component.payToVm.beneficiaryData.contactCard.contactCardNotifications);

      component.payToVm.beneficiaryData.contactCard.contactCardNotifications[0].notificationDefault = false;
      component.setDefaultNotification(component.payToVm.beneficiaryData.contactCard.contactCardNotifications);

      expect(component.vm.notification.value).toBe(emailNotification.value);
      expect(component.vm.notification.notificationInput).toBe('testmail@test.com');
   });
   it('should handle for no beneficiary card notifications', () => {
      component.vm.contactCardNotifications = [];

      const emailNotification = component.notifications.find(m => m.value === Constants.notificationTypes.email);
      component.onNotificationChange(null, emailNotification);
      expect(component.vm.notification.value).toBe(emailNotification.value);
   });
   it('should not set beneficiary data if isAccountPayment is false', () => {
      component.vm.theirReference = '';
      const payToVm = paymentServiceStub.getPayToVm();
      payToVm.isAccountPayment = false;
      component.setDataFromBeneficiary();
      expect(component.vm.theirReference).toBe('');
   });
   it('should not set beneficiary data if there are no card details or contact card notifications', () => {
      const emailNotification = component.notifications.find(m => m.value === Constants.notificationTypes.email);
      component.vm.notification.value = emailNotification.value;
      component.vm.notification.notificationInput = 'testmail@test.com';

      component.payToVm.beneficiaryData.contactCardDetails.cardDetails = undefined;
      component.payToVm.beneficiaryData.contactCard.contactCardNotifications = undefined;
      component.setDataFromBeneficiary();

      expect(component.vm.notification.value).toBe(emailNotification.value);
      expect(component.vm.notification.notificationInput).toBe('testmail@test.com');
   });
   it('should not set beneficiary data if contact card is not defined', () => {
      const emailNotification = component.notifications.find(m => m.value === Constants.notificationTypes.email);
      component.vm.notification.value = emailNotification.value;
      component.vm.notification.notificationInput = 'testmail@test.com';

      component.payToVm.beneficiaryData.contactCard = undefined;
      component.setDataFromBeneficiary();

      expect(component.vm.notification.value).toBe(emailNotification.value);
      expect(component.vm.notification.notificationInput).toBe('testmail@test.com');
   });
   it('Should open reason dropdown', () => {
      component.onReasonDropdownOpen();
      expect(component.isReasonDirty).toBe(true);
   });
   it('Should validate reason dropdown', () => {
      const dropDownInput = component.payToForm.paymentReasonRef;
      component.onReasonDropdownOpen();
      expect(component.isReasonDropdownValid(dropDownInput)).toBe(true);
   });
   it('should handle payment reason change', () => {
      const selected = { name: 'Other', value: 'Other' };
      const event = new Event('click', {});
      component.onPaymentReasonChange(event, selected);
      expect(component.showReasonError).toBeTruthy();
      selected.value = 'Gift';
      selected.name = 'Gift';
      component.onPaymentReasonChange(event, selected);
      expect(component.vm.paymentReason.code).toBe(selected.value);
   });
   it('should set first Account from account list when there is no account in VM', () => {
      component.payAmountVm.accountFromDashboard = '1';
      component.payAmountVm.selectedAccount = undefined;
      component.setAccountFrom();
   });
   it('should set reason error flag to false on closeResonError', () => {
      component.closeResonError();
      expect(component.showReasonError).toBeFalsy();
   });
   it('should handle account selection', () => {
      component.onAccountSelection(component.payAmountVm.selectedAccount);
      expect(component.payAmountVm.selectedAccount).toBeDefined();
   });
});

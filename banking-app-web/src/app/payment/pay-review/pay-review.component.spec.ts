import { BsModalService, BsModalRef, AlertModule } from 'ngx-bootstrap';
import { IPaymentMetaData } from './../../core/services/models';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { assertModuleFactoryCaching } from './../../test-util';
import { EmailMaskPipe } from './../../shared/pipes/email-mask.pipe';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { PayReviewComponent } from './pay-review.component';
import { PaymentService } from './../payment.service';
import { Constants } from './../../core/utils/constants';
import { IPayAmountVm } from '../payment.models';
import { IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { SharedModule } from '../../shared/shared.module';
import { GaTrackingService } from '../../core/services/ga.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { MobileNumberMaskPipe } from './../../shared/pipes/mobile-number-mask.pipe';
import { RecipientService } from '../../recipient/recipient.service';
import { PaymentType } from '../../core/utils/enums';
import { SystemErrorService } from '../../core/services/system-services.service';

let isAccountPayment = false;
let isMobilePayment = false;

const response = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'SUCCESS',
               reason: '',
            },
            {

               operationReference: 'ABC',
               result: 'FV01',
               status: 'ERROR',
               reason: ''
            },
         ],
         transactionID: 123
      }

   ]
};

const returnValueMakePayment = Observable.of(response);

const returnValueMakePaymentTransactionrandomStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'unknown',
               reason: ''
            }
         ]
      }
   ]
});
const returnValueMakePaymentWithPendingStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'SECURETRANSACTION',
               result: 'FV01',
               status: 'PENDING',
               reason: ''
            },
         ],
         transactionID: 123
      },
   ]
});

const makePaymentFailureStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'FAILURE',
               reason: 'reason'
            }
         ]
      }
   ]
}),
   paymentDetails: any = {
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
      beneficiaryDescription: 'abc',
      transactionID: 123
   },
   payAmountVm = {
      selectedAccount: {
         accountType: 'CC',
         productCode: ''
      },
      paymentDate: new Date()
   };
const paymentServiceStub = {
   paymentWorkflowSteps: {
      payTo: {
         isDirty: false,
         model: {
            getViewModel: () => {
               return paymentServiceStub.paymentWorkflowSteps.payTo.model;
            },
            bank: {
               bankName: 'NedBank',
               bankCode: '009'
            },
            branch: {
               branchCode: '009',
               branchName: 'test branch'
            },
            recipientName: 'Recipient Test',
            accountNumber: '6786786786',
            bankName: '',
            branchName: '',
            mobileNumber: '4564',
            accountType: '0S',
            isReadOnly: false,
            paymentType: PaymentType.account,
            banks: [{
               bankCode: '001',
               bankName: 'Test',
               rTC: true,
               universalCode: '100',
               branchCodes: [{
                  branchCode: '001',
                  branchName: 'Test'
               }]
            }],
            isRecipientPicked: false,
            isAccountPayment: true,
            isRecipientValid: false,
            beneficiaryData: {
               'contactCard': {
                  'contactCardID': 1,
                  'contactCardName': 'Allan Gray Unit Trust Management Limited',
                  'contactCardDetails': [
                     {
                        'accountType': 'U0', 'beneficiaryID': 23,
                        'beneficiaryName': 'Allan Gray Unit Trust Management Limited',
                        'accountNumber': '62239773329', 'branchCode': '204109', 'beneficiaryType': 'BNFEXT',
                        'myReference': 'AGUT', 'beneficiaryReference': 'AGUT135454', 'valid': false
                     }],
                  'contactCardNotifications': [],
                  'beneficiaryRecentTransactDetails': [{
                     'paymentDate': '2018-02-07T00:00:00',
                     'paymentAmount': 1, 'acctNumber': '1010103296', 'paymentDRNarration': 'AGUT',
                     'paymentCRNarration': 'AGUT135454', 'execEngineRef': '000000489058205591'
                  },
                  {
                     'paymentDate': '2018-02-07T00:00:00', 'paymentAmount': 1, 'acctNumber': '1010103296',
                     'paymentDRNarration': 'AGUT', 'paymentCRNarration': 'AGUT135454',
                     'execEngineRef': '000000489058202812'
                  }]
               }, 'contactCardDetails': {
                  'cardDetails': {
                     'accountType': 'U0', 'beneficiaryID': 23,
                     'beneficiaryName': 'Allan Gray Unit Trust Management Limited', 'accountNumber': '62239773329',
                     'branchCode': '204109', 'beneficiaryType': 'BNFEXT', 'myReference': 'AGUT',
                     'beneficiaryReference': 'AGUT135454', 'valid': false
                  }, 'isAccount': true,
                  'isPrepaid': false, 'isElectricity': false
               }
            }
         }
      },
      payAmount: {
         isDirty: false
      },
      payFor: {
         isDirty: false,
         model: {
            getViewModel: () => {
               return paymentServiceStub.paymentWorkflowSteps.payFor.model;
            },
            notification: { name: 'Email', value: 'Email' },
            notificationInput: 'email@mail.com'
         }
      },
      payReview: {
         isDirty: false,
         model: {
            getViewModel: () => {
               return paymentServiceStub.paymentWorkflowSteps.payReview.model;
            },
            isSaveBeneficiary: true,
            updateModel: (vm) => {

            }
         }
      }
   },
   paymentDetails: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV01',
                  status: 'SUCCESS',
                  reason: '',
               },
               {
                  operationReference: 'ABC',
                  result: 'FV01',
                  status: 'ERROR',
                  reason: ''

               },
            ],
            transactionID: 123
         }
      ]
   },
   isMobilePayment: function () {
      return isMobilePayment;
   },
   isAccountPayment: function () {
      return isAccountPayment;
   },
   getPayToVm: jasmine.createSpy('getPayToVm').and.callFake(() => {
      return paymentServiceStub.paymentWorkflowSteps.payTo.model;
   }),
   getPayForVm: jasmine.createSpy('getPayForVm').and.returnValue(paymentDetails),
   getPayAmountVm: jasmine.createSpy('getPayAmountVm').and.returnValue(payAmountVm),
   savePayReviewInfo: jasmine.createSpy('savePayReviewInfo'),
   makePayment: jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
      return returnValueMakePayment;
   }),
   getPayReviewVm: jasmine.createSpy('getPayReviewVm').and.returnValue({ isSaveBeneficiary: false }),
   isPaymentStatusValid: jasmine.createSpy('isPaymentStatusValid').and.returnValue(true),
   updateexecEngineRef: () => { },
   updateTransactionID: jasmine.createSpy('updateTransactionID'),
   isBeneficiarySaved: jasmine.createSpy('isBeneficiarySaved'),
   getApproveItOtpStatus: jasmine.createSpy('getApproveItOtpStatus').and.returnValue(Observable.of({ metadata: response })),
   getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
   refreshAccounts: function () { },
   raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
   createGUID: jasmine.createSpy('createGUID').and.callFake(() => { }),
   raiseSystemErrorforAPIFailure: jasmine.createSpy('raiseSystemErrorforAPIFailure').and.callFake((redirectURL: string) => { })

};


const updateRecipientPendingStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'SECURETRANSACTION',
               result: 'FV01',
               status: 'PENDING',
               reason: ''
            },
         ],
         transactionID: 123
      },
   ]
});

const updateRecipientFailureStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'FAILURE',
               reason: 'reason'
            }
         ]
      }
   ]
});
const recipientServiceStub = {
   updateRecipient: jasmine.createSpy('updateRecipient').and.callFake(function (validate = true) {
      return Observable.of(response);
   }),
   getTransactionStatus: jasmine.createSpy('getTransactionStatus').and.returnValue(response),
   addUpdateSuccess: false,
   tempContactCard: { secureTransaction: {} },
   getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
   getApproveItOtpStatus: jasmine.createSpy('getApproveItOtpStatus').and
      .returnValue(Observable.of({ metadata: response }))
};

const testComponent = class { };
const routerTestingParam = [
   { path: 'payment/status', component: testComponent }
];


const mockShow = {
   subscribe: jasmine.createSpy('show content').and.returnValue(Observable.of(true))
};

const BsModalServiceStub = {
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
            unsubscribeAll: jasmine.createSpy('unsubscribeAll'),
            navigateClose: jasmine.createSpy('navigateClose')
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

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};

const clientDetailsObserver = new Subject();

const responseMock = {
   FullNames: 'Marc Schutte',
   CellNumber: '27992180605',
   EmailAddress: '',
   Address: {
      AddressLines: [
         {
            AddressLine: 'G12 KYLEMORE'
         }
      ]
   },
   AddressCity: 'Cape Town',
   AddressPostalCode: 1234
};

describe('PayReviewComponent', () => {
   let component: PayReviewComponent;
   let fixture: ComponentFixture<PayReviewComponent>;
   let paymentService: PaymentService;
   let recipientService: RecipientService;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      isMobilePayment = false;
      isAccountPayment = false;
      TestBed.configureTestingModule({
         declarations: [PayReviewComponent, AmountTransformPipe, MobileNumberMaskPipe, EmailMaskPipe],
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [{ provide: PaymentService, useValue: paymentServiceStub },
         { provide: BsModalService, useValue: BsModalServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: RecipientService, useValue: recipientServiceStub }, SystemErrorService,
         {
            provide: ClientProfileDetailsService, useValue: {
               clientDetailsObserver: clientDetailsObserver
            }
         }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(PayReviewComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      paymentService = fixture.debugElement.injector.get(PaymentService);
      recipientService = fixture.debugElement.injector.get(RecipientService);
      fixture.detectChanges();

   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });


   it('should contain step handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should load status component on every payment failure ', () => {
      paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(false);
      component.nextClick(4);

      paymentService.makePayment = jasmine.createSpy('makePayment').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      spyOn(component.isButtonLoader, 'emit');
      component.nextClick(4);
      clientDetailsObserver.next(null);
      clientDetailsObserver.next(responseMock);
      expect(component.isButtonLoader.emit).toHaveBeenCalled();
   });

   it('should load status component on every payment failure ', () => {
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
      spyOn(component.isButtonLoader, 'emit');
      component.nextClick(4);
      expect(paymentService.raiseSystemErrorforAPIFailure).toHaveBeenCalled();
   });

   it('should handle pending status', () => {
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {

         return returnValueMakePaymentWithPendingStatus;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(BsModalServiceStub.show).toHaveBeenCalled();
      expect(paymentService.isPaymentSuccessful).toBeTruthy();
   });

   it('should handle success status', () => {
      paymentServiceStub.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return returnValueMakePayment;
      });
      component.nextClick(4);
      fixture.detectChanges();
   });
   it('should handle sucess state of make payment for foreign bank ', () => {
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return Observable.of({
            resultData: [
               {
                  resultDetail: [
                     {
                        operationReference: 'TRANSACTION',
                        result: 'FV01',
                        status: 'SUCCESS',
                        reason: ''
                     }
                  ]
               }
            ]
         });
      });
      component.isForeignBankPayment = true;
      component.makePayment();
      expect(paymentService.isPaymentSuccessful).toBeTruthy();
   });

   it('should handle random status', () => {
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return returnValueMakePaymentTransactionrandomStatus;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });

   it('should load status component on every step failure ', () => {
      paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(true);
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         if (validate) {
            return returnValueMakePayment;
         } else {
            paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(false);
            return returnValueMakePayment;
         }
      });
      const spy = spyOn(router, 'navigateByUrl');
      component.nextClick(4);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/payment/status');
   });

   it('should handle failure status', () => {
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return makePaymentFailureStatus;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });

   it('should return non resident passport number', () => {
      component.profileDetails = {
         FullNames: 'ABC',
         CellNumber: '523424234234',
         RsaId: 4524234324,
         PassportNumber: 'E452423',
         Resident: 'ZA',
         EmailAddress: 'a@a.com',
         Address: {
            AddressLines: [
               {
                  AddressLine: 'G12 KYLEMORE'
               }
            ]
         }
      };
      expect(component.displayRsaPassportNo()).toBe(4524234324);
      component.profileDetails.Resident = 'LA';
      expect(component.displayRsaPassportNo()).toBe('E452423');
   });

   it('should Update recipient details for valid = false recipient for Success', () => {
      spyOn(paymentService.paymentWorkflowSteps.payTo.model, 'getViewModel').and.callFake(() => {
         paymentService.paymentWorkflowSteps.payTo.model.isRecipientPicked = true;
         return paymentService.paymentWorkflowSteps.payTo.model;
      });
      component.payForVm = paymentService.paymentWorkflowSteps.payFor.model.getViewModel();
      recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
         .and.returnValue({ isValid: true, status: 'Success' });
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return makePaymentFailureStatus;
      });

      component.nextClick(4);
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });
   it('should Update recipient details for valid = false recipient for Failure Status', () => {
      spyOn(paymentService.paymentWorkflowSteps.payTo.model, 'getViewModel').and.callFake(() => {
         paymentService.paymentWorkflowSteps.payTo.model.isRecipientPicked = true;
         return paymentService.paymentWorkflowSteps.payTo.model;
      });
      recipientService.updateRecipient = jasmine.createSpy('updateRecipient').and.callFake((validate = true) => {
         if (validate) {
            return updateRecipientFailureStatus;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.payForVm = paymentService.paymentWorkflowSteps.payFor.model.getViewModel();
      recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
         .and.returnValue({ isValid: true, status: 'Failure' });
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake((validate = true) => {
         return makePaymentFailureStatus;
      });

      component.nextClick(4);
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });
   it('should Update recipient details for valid = false recipient for PENDING Status', () => {
      spyOn(paymentService.paymentWorkflowSteps.payTo.model, 'getViewModel').and.callFake(() => {
         paymentService.paymentWorkflowSteps.payTo.model.isRecipientPicked = true;
         return paymentService.paymentWorkflowSteps.payTo.model;
      });
      recipientService.updateRecipient = jasmine.createSpy('updateRecipient').and.returnValue((updateRecipientPendingStatus));
      component.payForVm = paymentService.paymentWorkflowSteps.payFor.model.getViewModel();
      recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
         .and.returnValue({ isValid: true, status: 'PENDING' });
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return makePaymentFailureStatus;
      });

      component.nextClick(4);
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });
   it('should Update recipient details for valid = false recipient if error occured while updating recipient ', () => {
      spyOn(paymentService.paymentWorkflowSteps.payTo.model, 'getViewModel').and.callFake(() => {
         paymentService.paymentWorkflowSteps.payTo.model.isRecipientPicked = true;
         return paymentService.paymentWorkflowSteps.payTo.model;
      });
      recipientService.updateRecipient = jasmine.createSpy('updateRecipient').and.callFake((validate = true) => {
         return Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         });
      });
      component.payForVm = paymentService.paymentWorkflowSteps.payFor.model.getViewModel();
      recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
         .and.returnValue({ isValid: false, status: 'Faliure' });
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return makePaymentFailureStatus;
      });

      component.updateRecipient();
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });
   it('should Update recipient details for valid = false recipient if error occured while updating recipient ', () => {
      spyOn(paymentService.paymentWorkflowSteps.payTo.model, 'getViewModel').and.callFake(() => {
         paymentService.paymentWorkflowSteps.payTo.model.isRecipientPicked = true;
         return paymentService.paymentWorkflowSteps.payTo.model;
      });
      recipientService.updateRecipient = jasmine.createSpy('updateRecipient').and.callFake((validate = true) => {
         if (validate) {
            recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
               .and.returnValue({ isValid: false, status: 'Faliure' });
            return Observable.of(response);
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.payForVm = paymentService.paymentWorkflowSteps.payFor.model.getViewModel();

      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return makePaymentFailureStatus;
      });

      component.updateRecipient();
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });
   it('should Update recipient details for valid = false recipient if error occured while updating recipient ', () => {
      spyOn(paymentService.paymentWorkflowSteps.payTo.model, 'getViewModel').and.callFake(() => {
         paymentService.paymentWorkflowSteps.payTo.model.isRecipientPicked = true;
         return paymentService.paymentWorkflowSteps.payTo.model;
      });
      recipientService.updateRecipient = jasmine.createSpy('updateRecipient').and.callFake((contactCard, validate = true) => {
         if (validate) {
            recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
               .and.returnValue({ isValid: true, status: 'Failure' });
            return Observable.of(response);
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.payForVm = paymentService.paymentWorkflowSteps.payFor.model.getViewModel();
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return makePaymentFailureStatus;
      });
      component.updateRecipient();
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });
   it('should Update recipient details for valid = false recipient if error occured while updating recipient ', () => {

      component.payToVm.bank = { bankCode: '009', bankName: 'Bank Name', universalCode: '8987987', rTC: false };
      recipientService.updateRecipient = jasmine.createSpy('updateRecipient').and
         .callFake((contactCard, validate = true) => {
            if (validate) {
               recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
                  .and.returnValue({ isValid: true, status: 'Faliure' });
               return Observable.of(response);
            } else {
               recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
                  .and.returnValue({ isValid: false, status: 'Failure' });
               return Observable.of(response);
            }
         });
      component.payForVm = paymentService.paymentWorkflowSteps.payFor.model.getViewModel();
      component.payForVm.notification = { value: 'None', name: 'Name' };

      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return makePaymentFailureStatus;
      });
      component.updateRecipient();
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });
   it('should Update recipient details for valid = false recipient if error occured while updating recipient ', () => {

      component.payToVm.bank = { bankCode: '009', bankName: 'Bank Name', universalCode: '8987987', rTC: false };
      recipientService.updateRecipient = jasmine.createSpy('updateRecipient').and
         .callFake((contactCard, validate = true) => {
            if (validate) {
               recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
                  .and.returnValue({ isValid: true, status: 'Faliure' });
               return Observable.of(response);
            } else {
               recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
                  .and.returnValue({ isValid: false, status: 'Failure' });
               return Observable.of(response);
            }
         });
      component.payToVm.isRecipientPicked = true;
      component.payToVm.branch = null;
      component.payForVm = paymentService.paymentWorkflowSteps.payFor.model.getViewModel();
      component.payForVm.notification = { value: 'Email', name: 'Email' };
      component.payToVm.beneficiaryData.contactCard.contactCardNotifications =
         [{ notificationType: 'Email', notificationAddress: 'aaa@mail.com' }];
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return makePaymentFailureStatus;
      });
      component.updateRecipient();
      expect(paymentService.isPaymentSuccessful).toBeFalsy();
   });
   it('should set benificiary error message on benificairy invalid update', () => {
      spyOn(paymentService.paymentWorkflowSteps.payTo.model, 'getViewModel').and.callFake(() => {
         paymentService.paymentWorkflowSteps.payTo.model.isRecipientPicked = true;
         return paymentService.paymentWorkflowSteps.payTo.model;
      });
      recipientService.updateRecipient = jasmine.createSpy('updateRecipient').and.returnValue((updateRecipientPendingStatus));
      recipientService.getApproveItStatus = jasmine.createSpy('getApproveItStatus').and.returnValue(
         Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));


      component.payForVm = paymentService.paymentWorkflowSteps.payFor.model.getViewModel();
      recipientService.getTransactionStatus = jasmine.createSpy('getTransactionStatus')
         .and.returnValue({ isValid: true, status: 'PENDING' });


      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return makePaymentFailureStatus;
      });
      component.updateRecipient();
   });

   it('should close modal and navigate away in case of error during approve otp status in payment ', () => {
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         if (validate) {
            return returnValueMakePayment;
         } else {
            return returnValueMakePaymentWithPendingStatus;
         }
      });
      paymentService.getApproveItStatus = jasmine.createSpy('getApproveItStatus').and.returnValue(
         Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
      component.makePayment();
      expect(paymentService.isPaymentSuccessful).toBeFalsy();

   });

   it('should validate component to enable pay', () => {
      spyOn(component.isComponentValid, 'emit');
      component.isFutureDate = true;
      component.isShowSaveRecipient = false;
      component.validate(true);
      expect(component.isComponentValid.emit).toHaveBeenCalledWith(true);
   });

   it('should validate component and toggle to enable pay', () => {
      spyOn(component.isComponentValid, 'emit');
      component.isFutureDate = true;
      component.isShowSaveRecipient = true;
      component.validate(true);
      expect(component.isComponentValid.emit).toHaveBeenCalledWith(true);
   });

   it('should validate component to disable pay', () => {
      spyOn(component.isComponentValid, 'emit');
      component.isFutureDate = true;
      component.isShowSaveRecipient = true;
      component.validate(false);
      expect(component.isComponentValid.emit).toHaveBeenCalledWith(false);
   });

});

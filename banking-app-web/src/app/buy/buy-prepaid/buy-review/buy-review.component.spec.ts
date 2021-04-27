import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { assertModuleFactoryCaching } from './../../../test-util';
import { BuyReviewComponent } from './buy-review.component';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { BuyService } from './../buy.service';
import { BsModalService } from 'ngx-bootstrap';
import { IBuyPrepaidDetail } from './../../../core/services/models';
import { GaTrackingService } from '../../../core/services/ga.service';
import { SystemErrorService } from '../../../core/services/system-services.service';

const testComponent = class { };
const routerTestingParam = [{ path: 'buy/status', component: testComponent }];
const returnValuePrepaidWithRefrenceTransaction = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'SECURETRANSACTION',
               result: 'FV01',
               status: 'SUCCESS',
               reason: ''
            },
         ]
      }
   ]
});
const returnValuePrepaidWithPendingStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'PENDING',
               reason: ''
            },
         ],
         transactionID: 123
      },
   ]
});


const returnValuePrepaidUnknownStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'unknown',
               reason: 'status unknown'
            },
         ],
         transactionID: 123
      },
   ]
});

const prepaidFailureStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'FAILURE',
               reason: 'reason'
            },
         ],
         transactionID: 123
      },
   ]
});

function getPrepaidDetail() {
   return {
      startDate: '2018-01-02T00:00:00',
      nextTransDate: '2018-01-02T00:00:00',
      fromAccount: {
         accountName: 'Current',
         accountNumber: '1011108607',
         accountType: 'CA'
      },
      destinationNumber: '1111111111',
      serviceProvider: 'CLC',
      productCode: 'PAI',
      amount: 100.0,
      isVoucherAmount: true,
      favourite: false,
      bfName: 'a',
      myDescription: 'ww',
      saveBeneficiary: true,
   };
}
const returnValuePrepaid = Observable.of({
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
const buyServiceStub = {
   buyWorkflowSteps: {
      buyTo: {
         isNavigated: false,
         isDirty: false
      },
      buyReview: {
         isNavigated: false,
         isDirty: false
      },
      buyAmount: {
         isNavigated: false,
         isDirty: false
      },
      buyFor: {
         isNavigated: false,
         isDirty: false
      }
   },
   getBuyToVm: jasmine.createSpy('getBuyToVm').and.returnValue({
      recipientName: 'Test',
      mobileNumber: 896767687,
      serviceProvider: 'Virgin',
      serviceProviderName: 'V'
   }),
   getBuyForVm: jasmine.createSpy('getBuyForVm').and.returnValue({
      yourReference: 'Reference',
      notificationType: 'Email',
      notificationInput: 'test@mail.com'
   }),
   getBuyAmountVm: jasmine.createSpy('getBuyAmountVm').and.returnValue(
      {
         startDate: new Date(),
         productCode: 'ABC',
         rechargeType: 'Airtime',
         bundleType: 'recharge',
         amount: 100,
         recurrenceFrequency: 'Weekly',
         numRecurrence: '1',
         selectedAccount: { accountNumber: '123', accountType: 'CA' },
      }),
   saveBuyReviewInfo: jasmine.createSpy('saveBuyReviewInfo'),
   buyPrepaid: jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
      return returnValuePrepaid;
   }),
   isPrepaidStatusValid: jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true),
   isTransferStatusNavigationAllowed: jasmine.createSpy('isTransferStatusNavigationAllowed').and.returnValue(true),
   updateTransactionID: jasmine.createSpy('updateTransactionID'),
   getBuyReviewVm: jasmine.createSpy('getBuyReviewVm').and.returnValue({ isSaveBeneficiary: true }),
   isBeneficiarySaved: jasmine.createSpy('updateTransactionID'),
   prepaidDetails: jasmine.createSpy('prepaidDetails').and.returnValue(<IBuyPrepaidDetail>getPrepaidDetail()),
   setSecureTransactionVerification: jasmine.createSpy('setSecureTransactionVerification').and.returnValue({
      verificationReferenceId: 545140
   }),
   getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: returnValuePrepaid })),
   getApproveItOtpStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: returnValuePrepaid })),
   refreshAccounts: function () { },
   raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
   createGuID: jasmine.createSpy('createGuID'),
   redirecttoStatusPage: jasmine.createSpy('redirecttoStatusPage'),
   updateexecEngineRef: jasmine.createSpy('updateexecEngineRef')
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
            unsubscribeAll: jasmine.createSpy('unsubscribeAll')
         },
         hide: () => { }

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
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('BuyReviewComponent', () => {
   let component: BuyReviewComponent;
   let fixture: ComponentFixture<BuyReviewComponent>;
   let buyService: BuyService;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyReviewComponent],
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: BuyService, useValue: buyServiceStub },
         { provide: BsModalService, useValue: bsModalServiceStub }, SystemErrorService,
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyReviewComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      buyService = fixture.debugElement.injector.get(BuyService);
   });

   it('should be created', inject([BuyService], (service: BuyService) => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
   }));

   it('should contain step handler', () => {
      expect(component.nextClick).toBeDefined();
   });
   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should load status component on every transaction failure ', () => {
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(false);
      component.nextClick(4);

      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      spyOn(component.isButtonLoader, 'emit');
      component.nextClick(4);
      expect(component.isButtonLoader.emit).toHaveBeenCalled();
   });

   it('should load status component on every transfer failure ', () => {
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true);
      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         if (validate) {
            return returnValuePrepaid;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      buyService.redirecttoStatusPage = jasmine.createSpy('redirecttoStatusPage');
      component.nextClick(4);
      expect(buyService.redirecttoStatusPage).toHaveBeenCalled();
   });
   it('should load status component on every step failure ', () => {
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true);
      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         if (validate) {
            return returnValuePrepaid;
         } else {
            buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(false);
            return returnValuePrepaid;
         }
      });
      const spy = spyOn(router, 'navigateByUrl');
      component.nextClick(4);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/buy/status');
   });
   it('should handle success status', () => {
      buyService.isPaymentSuccessful = false;
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true);
      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         return returnValuePrepaidWithRefrenceTransaction;
      });
      component.nextClick(4);
      expect(buyService.isPaymentSuccessful).toBe(true);
   });
   it('should handle pending status', () => {
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true);
      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         return returnValuePrepaidWithPendingStatus;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(buyService.isPaymentSuccessful).toBe(true);
   });
   it('should handle unknown status', () => {
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true);
      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         return returnValuePrepaidUnknownStatus;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(buyService.errorMessage).toBe('status unknown');
   });

   it('should handle failure', () => {
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true);
      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         return prepaidFailureStatus;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(buyService.isPaymentSuccessful).toBeFalsy();
   });
   it('should handle pending status and redirect to status page on error', () => {

      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         return returnValuePrepaidWithPendingStatus;
      });


      buyService.getApproveItStatus = jasmine.createSpy('getApproveItStatus').and.returnValue(
         Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
      component.nextClick(4);
      expect(buyService.redirecttoStatusPage).toHaveBeenCalled();
   });

});

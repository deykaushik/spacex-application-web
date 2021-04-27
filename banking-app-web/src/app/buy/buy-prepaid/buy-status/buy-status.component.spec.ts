import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { assertModuleFactoryCaching } from './../../../test-util';
import { BuyStatusComponent } from './buy-status.component';
import { BuyService } from './../buy.service';
import { IPrepaidMetaData } from './../../../core/services/models';
import { SharedModule } from '../../../shared/shared.module';
import { GaTrackingService } from '../../../core/services/ga.service';
import { SystemErrorService } from '../../../core/services/system-services.service';

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
const testComponent = class { };

const routerTestingStub = [
   { path: 'buy/status', component: testComponent }
];

describe('BuyStatusComponent', () => {
   let location: Location;
   let router: Router;
   let component: BuyStatusComponent;
   let fixture: ComponentFixture<BuyStatusComponent>;
   let buyService: BuyService;
   let modalService: BsModalService;

   const buyReturnValue: any = {
      bFName: 'name',
      bank: 'bank',
      amount: 1234,
      toAccount: {
         accountNumber: '1234'
      },
      fromAccount: {
         accountNumber: '1234'
      },
      myDescription: 'abc',
      beneficiaryDescription: 'abc',
      transactionID: '1234'
   };
   const _getPrepaidDetailInfo = {
      amount: 5,
      fromAccount: {
         accountNumber: '1001005570',
         accountType: 'CA'
      },
      favourite: false,
      destinationNumber: '1050020009',
      isVoucherAmount: false,
      serviceProvider: 'VDC',
      productCode: 'PAI',
      myDescription: 'Alpha Numeric Meter Input',
      startDate: '2017-11-07',
      transactionID: '29811025',
      saveBeneficiary: true,
   };

   const response = {
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
   };
   const returnValuePrepaid = Observable.of(response);
   const buyServiceStub = {
      refreshAccounts: function () { },
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
      isTransferStatusNavigationAllowed: jasmine.createSpy('isTransferStatusNavigationAllowed').and.returnValue(true),
      buyPrepaid: jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         return returnValuePrepaid;
      }),
      isPrepaidStatusValid: jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true),
      updateTransactionID: jasmine.createSpy('updateTransactionID'),
      getPrepaidDetailInfo: jasmine.createSpy('getPrepaidDetailInfo').and.returnValue(_getPrepaidDetailInfo),
      getPaymentStatus: jasmine.createSpy('getPaymentStatus').and.returnValue(true),
      clearRechargePaymentDetails: jasmine.createSpy('clearRechargePaymentDetails'),
      setSecureTransactionVerification: jasmine.createSpy('setSecureTransactionVerification').and.returnValue({
         verificationReferenceId: 545140
      }),
      getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
      isBeneficiarySaved: jasmine.createSpy('updateTransactionID'),
      prepaidDetails: jasmine.createSpy('prepaidDetails').and.returnValue(_getPrepaidDetailInfo),
      getApproveItOtpStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
      raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
      createGuID: jasmine.createSpy('createGuID'),
      updateexecEngineRef: jasmine.createSpy('updateexecEngineRef'),
      redirecttoStatusPage : jasmine.createSpy('redirecttoStatusPage')
   };
   const gaTrackingServiceStub = {
      sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingStub)],
         declarations: [BuyStatusComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: BsModalService, useValue: bsModalServiceStub },
         { provide: BuyService, useValue: buyServiceStub }, SystemErrorService,
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyStatusComponent);
      component = fixture.componentInstance;
      buyService = fixture.debugElement.injector.get(BuyService);
      modalService = fixture.debugElement.injector.get(BsModalService);
      router = TestBed.get(Router);
      location = TestBed.get(Location);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should defined heading ', () => {
      expect(component.labels.buyLabels.buySuccess).toBeDefined();
   });

   it('should contain new purchase', () => {
      expect(component.newPurchase).toBeDefined();
   });

   it('should contain Go to Dahsboard', () => {
      expect(component.navigateToDashboard).toBeDefined();
   });

   it('should redirect to buy on new buy', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.newPurchase();
      tick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/buy');
   }));

   it('should redirect to dashboard if navigated', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.navigateToDashboard();
      tick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   }));

   it('should redirect to buy if navigation is not allowed', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      buyService.isTransferStatusNavigationAllowed = jasmine.createSpy('isTransferStatusNavigationAllowed').and.returnValue(false);
      const comp = new BuyStatusComponent(router, buyService, modalService, null);
      comp.ngOnInit();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/buy');
   }));

   it('should set successful to true on purchase successful', fakeAsync(() => {
      buyReturnValue.transactionID = '1234';
      buyService.getPrepaidDetailInfo = jasmine.createSpy('getPrepaidDetailInfo').and.returnValue(buyReturnValue);
      component.ngOnInit();
      expect(component.successful).toBe(true);
   }));
   it('should set successful to false if payment not-successful', fakeAsync(() => {
      buyReturnValue.transactionID = '';
      buyService.getPaymentStatus =
         jasmine.createSpy('getPaymentStatus').and.returnValue(false);
      component.ngOnInit();
      expect(component.successful).toBe(false);
   }));

   it(`should show unsuccessful status and not disable try again
       button if on retry payment is successful but payment status is invalid `,
      () => {
         buyService.isPrepaidStatusValid =
            jasmine.createSpy('isPrepaidStatusValid').and.returnValue(false);
         component.retryPayment();
         buyService.buyPrepaid =
            jasmine.createSpy('buyPrepaid')
               .and.returnValue(Observable.create(observer => {
                  observer.error(new Error('error'));
                  observer.complete();
               }));
         expect(component.successful).toBe(false);
         expect(component.disableRetryButton).toBe(false);
      });

   it('should redirect to dashboard on Go to overview', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.navigateToDashboard();
      tick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   }));

   it('should handle buyPrepaid failure',
      () => {
         buyService.buyPrepaid =
            jasmine.createSpy('buyPrepaid').and.returnValue(Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            }));
         component.retryPayment();
         fixture.detectChanges();
         expect(component.disableRetryButton).toBe(false);
      });
   it('should handle success status', () => {
      buyService.isPaymentSuccessful = false;
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true);
      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         return returnValuePrepaidWithRefrenceTransaction;
      });
      component.retryPayment();
      expect(buyService.isPaymentSuccessful).toBe(true);
   });
   it('should handle pending status', () => {
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true);
      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         return returnValuePrepaidWithPendingStatus;
      });
      component.retryPayment();
      fixture.detectChanges();
      expect(buyService.isPaymentSuccessful).toBe(true);
   });
   it('should handle unknown status', () => {
      buyService.isPrepaidStatusValid = jasmine.createSpy('isPrepaidStatusValid').and.returnValue(true);
      buyService.buyPrepaid = jasmine.createSpy('buyPrepaid').and.callFake(function (validate = true) {
         return returnValuePrepaidUnknownStatus;
      });
      component.retryPayment();
      fixture.detectChanges();
      expect(buyService.errorMessage).toBe('status unknown');
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
      component.retryPayment();
      expect(buyService.redirecttoStatusPage).toHaveBeenCalled();
   });

});

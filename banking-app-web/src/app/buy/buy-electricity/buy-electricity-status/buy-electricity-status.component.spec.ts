import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { assertModuleFactoryCaching } from './../../../test-util';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { Constants } from './../../../core/utils/constants';
import { IBuyElectricityMetaData } from './../../../core/services/models';
import { BuyElectricityStatusComponent } from './buy-electricity-status.component';
import { BuyElectricityService } from './../buy-electricity.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { SystemErrorService } from '../../../core/services/system-services.service';

const routerTestingParam = [
   { path: 'buyElectricity/status', component: BuyElectricityStatusComponent }
];

const returnValueMakePurchaseWithPendingStatus = Observable.of({
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

const returnValueMakePurchaseTransactionrandomStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'alibaba',
               reason: ''
            }
         ]
      }
   ]
});
const returnValueMakePurchaseTransactionPendingStatus = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'PENDING',
               reason: ''
            }
         ]
      }
   ]
});

const returnValueMakePurchaseNoTransaction = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
});

const mockShow = {
   subscribe: jasmine.createSpy('show content').and.returnValue(Observable.of(true))
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

describe('BuyElectricityStatusComponent', () => {
   let location: Location;
   let router: Router;
   let modalService: BsModalService;
   let component: BuyElectricityStatusComponent;
   let fixture: ComponentFixture<BuyElectricityStatusComponent>;
   let buyElectricityService: BuyElectricityService;

   const paymentReturnValue: any = {
      startDate: '2017-10-13T00:00:00.0394904+02:00',
      nextTransDate: '2017-10-13T00:00:00.0394904+02:00',
      serviceProvider: 'BLT',
      productCode: 'FBE',
      amount: 1200,
      myDescription: 'abc',
      transactionID: '1234',
      electricityMeterDetails: {
         Municipality: 'Eskom'
      }
   };

   const _getBuyElectricityDetailsInfo = {
      startDate: '2017-10-13T00:00:00.0394904+02:00',
      fromAccount: {
         accountNumber: '1001005570',
         accountType: 'CA'
      },
      destinationNumber: 1050020009,
      serviceProvider: 'BLT',
      productCode: 'PEL',
      amount: 400,
      myDescription: 'Alpha Numeric Meter Input'
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

   const returnElectricityPayment = Observable.of(response);

   const buyServiceStub = {
      electricityDetails: {},
      refreshAccounts: function () { },
      getApproveItOtpStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
      getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
      electricityWorkflowSteps: {
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

      getBuyElectricityToVm: jasmine.createSpy('getBuyElectricityToVm').and.returnValue({
         recipientName: 'Test',
         meterNumber: 8967676876,
         serviceProvider: 'Virgin',
         productCode: 'V'
      }),
      getBuyElectricityForVm: jasmine.createSpy('getBuyElectricityForVm').and.returnValue({
         yourReference: 'Reference',
         notificationType: 'Email',
         notificationInput: 'test@mail.com'
      }),
      getBuyElectricityAmountVm: jasmine.createSpy('getBuyElectricityAmountVm').and.returnValue({
         amount: 100,
         selectedAccount: { accountNumber: '123', accountType: 'CA' },
      }),
      getBuyElectricityReviewVm: jasmine.createSpy('getBuyElectricityAmountVm').and.returnValue({
         isSaveBeneficiary: false,
      }),
      saveBuyElectricityReviewInfo: jasmine.createSpy('saveBuyElectricityReviewInfo'),
      makeElectricityPayment: jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = true) {
         return returnElectricityPayment;
      }),
      isElectricityPaymentStatusValid: jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(true),
      isPaymentStatusNavigationAllowed: jasmine.createSpy('isPaymentStatusNavigationAllowed').and.returnValue(true),
      updateTransactionID: jasmine.createSpy('updateTransactionID'),
      getBuyElectricityDetailsInfo: jasmine.createSpy('getBuyElectricityDetailsInfo').and.returnValue(_getBuyElectricityDetailsInfo),
      getPaymentStatus: jasmine.createSpy('getPaymentStatus').and.returnValue(true),
      clearElectricityPaymentDetails: jasmine.createSpy('clearElectricityPaymentDetails'),
      isFBEClaim: jasmine.createSpy('isFBEClaim').and.returnValue(false),
      fbeClaimed: jasmine.createSpy('fbeClaimed').and.returnValue(Observable.of({})),
      isFBETransactionValid: jasmine.createSpy('isFBETransactionValid').and.returnValue(true),
      isBeneficiarySaved: jasmine.createSpy('isBeneficiarySaved'),
      raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
      createGuID: jasmine.createSpy('createGuID'),
      updateexecEngineRef: jasmine.createSpy('updateexecEngineRef')
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [BuyElectricityStatusComponent, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: BuyElectricityService, useValue: buyServiceStub },
         { provide: BsModalService, useValue: bsModalServiceStub }, SystemErrorService,
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      }).compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(BuyElectricityStatusComponent);
      component = fixture.componentInstance;
      buyElectricityService = fixture.debugElement.injector.get(BuyElectricityService);
      router = TestBed.get(Router);
      modalService = TestBed.get(BsModalService);
      location = TestBed.get(Location);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should contain new payment', () => {
      expect(component.newPayment).toBeDefined();
   });

   it('should defined heading ', () => {
      expect(component.heading).toBeDefined();
   });

   it('should defined heading ', () => {
      expect(component.successful).toBeDefined();
   });

   it('should redirect to payment on new payment', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.newPayment();
      tick();
      const url = spy.calls.first().args[0];
      expect(url).toBe(Constants.routeUrls.buyElectricity);
   }));

   it('should fetch payment details on init', () => {
      expect(component.buyElectricityDetail).toBeDefined();
   });

   it('should redirect to payment if no payment details found',
      inject([Injector], (injector: Injector) => {
         const spy = spyOn(router, 'navigateByUrl');
         buyElectricityService.isPaymentStatusNavigationAllowed = jasmine.createSpy('isPaymentStatusNavigationAllowed')
            .and.returnValue(false);
         const comp = new BuyElectricityStatusComponent(router, buyElectricityService, modalService, injector, null);
         comp.ngOnInit();
         const url = spy.calls.first().args[0];
         comp.ngOnDestroy();
         expect(url).toBe(Constants.routeUrls.buyElectricity);
      }));

   it('should set successful on init', () => {
      expect(component.successful).toBeDefined();
   });

   it('should set successful to true on payment successful', fakeAsync(() => {
      paymentReturnValue.transactionID = '1234';
      buyElectricityService.getPaymentStatus = jasmine.createSpy('getPaymentStatus').and.returnValue(true);
      buyElectricityService.getBuyElectricityDetailsInfo =
         jasmine.createSpy('getBuyElectricityDetailsInfo').and.returnValue(paymentReturnValue);
      component.ngOnInit();
      expect(component.successful).toBe(true);
   }));

   it('should set successful to false if payment not-successful', (() => {
      paymentReturnValue.transactionID = '';
      buyElectricityService.getPaymentStatus =
         jasmine.createSpy('getPaymentStatus').and.returnValue(false);
      component.ngOnInit();
      expect(component.successful).toBe(false);
   }));

   it('should retry the payment upto 3 times on payment failure', fakeAsync(() => {
      buyElectricityService.getPaymentStatus =
         jasmine.createSpy('getPaymentStatus').and.returnValue(false);
      expect(component.disableRetryButton).toBe(false);
      component.retryPayment();
      component.retryPayment();
      component.retryPayment();
      component.retryPayment();
      expect(component.disableRetryButton).toBe(true);
   }));

   it(`should show unsuccessful status and not disable try again
         button if on retry payment is successful but payment status is invalid `,
      () => {
         buyElectricityService.isElectricityPaymentStatusValid =
            jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(false);
         component.retryPayment();
         buyElectricityService.makeElectricityPayment =
            jasmine.createSpy('makeElectricityPayment')
               .and.returnValue(Observable.create(observer => {
                  observer.error(new Error('error'));
                  observer.complete();
               }));
         expect(component.successful).toBe(false);
         expect(component.disableRetryButton).toBe(false);
      });

   it(`should show unsuccessful status for FBE redeem and not disable try again
         button if on retry payment is successful `,
      () => {
         buyElectricityService.isElectricityPaymentStatusValid =
            jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(true);
         buyElectricityService.isFBEClaim = jasmine.createSpy('isFBEClaim').and.returnValue(true);
         component.retryPayment();
         expect(component.successful).toBe(true);
         // expect(component.disableRetryButton).toBe(true);
      });

   it('should load unsuccessful payment status and not disable retry button if clicked once on every payment failure ', () => {
      buyElectricityService.isElectricityPaymentStatusValid = jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(true);
      buyElectricityService.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = false) {
         if (validate) {
            return returnElectricityPayment;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      buyElectricityService.redirecttoStatusPage = jasmine.createSpy('redirecttoStatusPage');
      component.retryPayment();
      expect(buyElectricityService.redirecttoStatusPage).toHaveBeenCalled();
      expect(component.successful).toBe(false);
   });


   it('should load successful payment status and disable retry button if clicked once on every payment success  ', () => {
      buyElectricityService.isElectricityPaymentStatusValid = jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(true);
      buyElectricityService.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = false) {
         if (!validate) {
            return returnElectricityPayment;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.retryPayment();
      expect(component.successful).toBe(false);
      expect(component.disableRetryButton).toBe(false);
   });

   it('should load unsuccessful payment status and not disable retry button if clicked once on payment status invalid', () => {
      buyElectricityService.isElectricityPaymentStatusValid = jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(false);
      buyElectricityService.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = false) {
         if (!validate) {
            return returnElectricityPayment;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.retryPayment();
      expect(component.successful).toBe(false);
      expect(component.disableRetryButton).toBe(false);
   });
   it('should load unsuccessful payment status and disable retry button if clicked once on payment status invalid on every payment', () => {
      buyElectricityService.isElectricityPaymentStatusValid = jasmine.createSpy('isElectricityPaymentStatusValid').and
         .callFake(function (metadata: IBuyElectricityMetaData) {
            buyElectricityService.isElectricityPaymentStatusValid = jasmine.createSpy('isElectricityPaymentStatusValid').and
               .callFake(function (metadataObj: IBuyElectricityMetaData) {
                  return false;
               });
            buyElectricityService.makeElectricityPayment =
               jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = false) {
                  if (!validate) {
                     return returnElectricityPayment;
                  } else {
                     return Observable.create(observer => {
                        observer.error(new Error('error'));
                        observer.complete();
                     });
                  }
               });
            return true;
         });
      buyElectricityService.makeElectricityPayment =
         jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = false) {
            if (!validate) {
               return returnElectricityPayment;
            } else {
               return Observable.create(observer => {
                  observer.error(new Error('error'));
                  observer.complete();
               });
            }
         });
      component.retryPayment();
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

   it('should handle makeElectricityPayment failure',
      () => {
         buyElectricityService.makeElectricityPayment =
            jasmine.createSpy('makeElectricityPayment').and.returnValue(Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            }));
         component.retryPayment();
         fixture.detectChanges();
         expect(component.disableRetryButton).toBe(false);
      });

   it('should handle fbe Claimed sucessfully', () => {
      buyElectricityService.isPaymentStatusNavigationAllowed = jasmine.createSpy('isPaymentStatusNavigationAllowed')
         .and.returnValue(false);
      buyElectricityService.isFBEClaim = jasmine.createSpy('isFBEClaim').and.returnValue(true);
      buyElectricityService.isPaymentSuccessful = true;
      component.ngOnInit();
      expect(component.successful).toBe(true);
      expect(component.heading).toBe(Constants.labels.fbeClaimSuccessful);
   });

   it('should handle fbe Claimed unsucessful', () => {
      buyElectricityService.isPaymentStatusNavigationAllowed = jasmine.createSpy('isPaymentStatusNavigationAllowed')
         .and.returnValue(false);
      buyElectricityService.isFBEClaim = jasmine.createSpy('isFBEClaim').and.returnValue(true);
      buyElectricityService.isPaymentSuccessful = false;
      component.ngOnInit();
      expect(component.successful).toBe(false);
      expect(component.heading).toBe(Constants.labels.fbeClaimUnSuccessful);
   });

   it('should handle pending status', () => {
      buyElectricityService.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseWithPendingStatus;
      });
      component.retryPayment();
      fixture.detectChanges();
      expect(bsModalServiceStub.show).toHaveBeenCalled();
      expect(buyElectricityService.isPaymentSuccessful).toBeTruthy();
   });

   it('should handle pending status with fbe', () => {
      buyElectricityService.isFBEClaimed = true;
      buyElectricityService.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseWithPendingStatus;
      });
      component.retryPayment();
      fixture.detectChanges();
      expect(bsModalServiceStub.show).toHaveBeenCalled();
      expect(buyElectricityService.isPaymentSuccessful).toBeTruthy();
   });

   it('should handle faliure status', () => {
      buyElectricityService.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseNoTransaction;
      });
      component.retryPayment();
      fixture.detectChanges();
      expect(buyElectricityService.isPaymentSuccessful).toBeFalsy();
   });

   it('should handle random status', () => {
      buyElectricityService.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseTransactionrandomStatus;
      });
      component.retryPayment();
      fixture.detectChanges();
      expect(buyElectricityService.isPaymentSuccessful).toBeFalsy();
   });
   it('should handle pending status and redirect to status page on error', () => {
      buyElectricityService.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = true) {
         return returnValueMakePurchaseTransactionPendingStatus;
      });
      buyElectricityService.getApproveItStatus = jasmine.createSpy('getApproveItStatus').and.returnValue(
         Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
      buyElectricityService.redirecttoStatusPage = jasmine.createSpy('redirecttoStatusPage').and.callFake(() => { });
      component.retryPayment();
      expect(buyElectricityService.redirecttoStatusPage).toHaveBeenCalled();
   });

});

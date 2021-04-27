import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { Constants } from './../../core/utils/constants';
import { IPaymentMetaData } from './../../core/services/models';

import { assertModuleFactoryCaching } from './../../test-util';
import { PayStatusComponent } from './pay-status.component';
import { PaymentService } from './../payment.service';
import { SharedModule } from '../../shared/shared.module';
import { ReportsModule } from '../../reports/reports.module';
import { ReportsService } from '../../reports/reports.service';
import { SystemErrorService } from '../../core/services/system-services.service';

describe('PaymentStatusComponent', () => {
   let location: Location;
   let router: Router;
   let component: PayStatusComponent;
   let fixture: ComponentFixture<PayStatusComponent>;
   let paymentService: PaymentService;
   let isAccountPayment = false;
   let isMobilePayment = false;
   let modalService: BsModalService;

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
               {
                  operationReference: 'ABC',
                  result: 'FV01',
                  status: 'ERROR',
                  reason: ''
               }
            ],
            transactionID: 123
         },
      ]
   });

   const returnValueMakePaymentTransactionrandomStatus = Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV01',
                  status: 'alibaba',
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

   const returnValueMakeNoPayment = Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV01',
                  status: 'FAILURE',
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

   const response = {
      resultData: [{
         resultDetail: [],
         transactionID: 123
      }]
   };
   const returnElectricityPayment = Observable.of(response);

   const returnValueMakePaymentNoTransaction = Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV01',
                  status: 'FAILURE',
                  reason: ''
               },
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
         accountType: 'CC'
      },
      cellphone: '123',
      myDescription: 'abc',
      beneficiaryDescription: 'abc'
   };

   const paymentReturnValue: any = {
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
      transactionID: '1234',
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
   };
   const makePaymentService = new Promise(function (resolve, reject) {
      reject('Unsuccessful');
   });
   const service = Observable.fromPromise(makePaymentService);
   const testComponent = class { };
   const routerTestingParam = [
      { path: 'dashboard', component: testComponent },
      { path: 'payment/status', component: testComponent },
   ];
   const paymentServiceStub = {
      refreshAccounts: function () { },
      isPaymentStatusValid: jasmine.createSpy('isPaymentStatusValid').and.returnValue(true),
      makePayment: jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return returnValueMakePayment;
      }),
      getPaymentDetailInfo: jasmine.createSpy('getPaymentDetailInfo').and.returnValue(paymentReturnValue),
      isPaymentStatusNavigationAllowed: jasmine.createSpy('isPaymentStatusNavigationAllowed').and.returnValue(true),
      clearPaymentDetails: jasmine.createSpy('clearPaymentDetails').and.callThrough,
      updateTransactionID: jasmine.createSpy('updateTransactionID').and.callThrough,
      getPayForVm: jasmine.createSpy('getPayForVm').and.returnValue(paymentDetails),
      getPayToVm: jasmine.createSpy('getPayToVm').and.returnValue({ isAccountPayment: false }),
      getPaymentStatus: jasmine.createSpy('getPaymentStatus').and.returnValue(false),
      isBeneficiarySaved: jasmine.createSpy('isBeneficiarySaved').and.returnValue(true),
      updateexecEngineRef: () => { },
      getPayAmountVm: jasmine.createSpy('getPayToVm').and.returnValue({ selectedAccount: { accountType: 'CC', productCode: 'abc' } }),
      getApproveItOtpStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
      getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
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
      raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
      createGUID: jasmine.createSpy('createGUID').and.callFake(() => { }),
      raiseSystemErrorforAPIFailure: jasmine.createSpy('raiseSystemErrorforAPIFailure').and.callFake((redirectURL: string) => { }),
      isAPIFailure: jasmine.createSpy('isAPIFailure').and.returnValue(true)
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      isMobilePayment = false;
      isAccountPayment = false;
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [PayStatusComponent, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: PaymentService, useValue: paymentServiceStub },
            { provide: BsModalService, useValue: bsModalServiceStub }, SystemErrorService,
            BsModalRef,
            { provide: ReportsService, useValue: { open: jasmine.createSpy('open').and.returnValue(undefined) } }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(PayStatusComponent);
      component = fixture.componentInstance;
      paymentService = fixture.debugElement.injector.get(PaymentService);
      router = TestBed.get(Router);
      location = TestBed.get(Location);
      modalService = fixture.debugElement.injector.get(BsModalService);
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
      expect(url).toBe('/payment');
   }));

   it('should fetch payment details on init', () => {
      expect(component.paymentDetail).toBeDefined();
   });

   it('should redirect to payment if no payment details found',
      inject([Injector], (injector: Injector) => {
         const spy = spyOn(router, 'navigateByUrl');
         paymentService.isPaymentStatusNavigationAllowed = jasmine.createSpy('isPaymentStatusNavigationAllowed').and.returnValue(false);
         const comp = new PayStatusComponent(router, paymentService, modalService, injector, null);
         comp.ngOnInit();
         const url = spy.calls.first().args[0];
         expect(url).toBe('/payment');
      }));

   it('should set successful on init', () => {
      expect(component.successful).toBeDefined();
   });

   it('should set successful to true on payment successful', fakeAsync(() => {
      paymentReturnValue.transactionID = '1234';
      paymentService.getPaymentStatus = jasmine.createSpy('getPaymentStatus').and.returnValue(true);
      paymentService.getPaymentDetailInfo = jasmine.createSpy('getPaymentDetailInfo').and.returnValue(paymentReturnValue);
      component.ngOnInit();
      expect(component.successful).toBe(true);
   }));

   it('should set successful to false if payment not-successful', fakeAsync(() => {
      paymentReturnValue.transactionID = '';
      paymentService.getPaymentDetailInfo = jasmine.createSpy('getPaymentDetailInfo').and.returnValue(paymentReturnValue);
      component.ngOnInit();
      expect(component.successful).toBe(false);
   }));

   it('should retry the payment upto 3 times on payment failure', fakeAsync(() => {
      component.retryPayment();
      component.retryPayment();
      component.retryPayment();
      component.retryPayment();
      expect(component.disableRetryButton).toBe(true);
   }));

   it('should show unsuccessful status and not disable try again button if on retry payment is successful but payment status is invalid ',
      () => {
         paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(false);
         component.retryPayment();
         paymentService.makePayment = jasmine.createSpy('makePayment').and.returnValue(Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
         expect(component.successful).toBe(false);
         expect(component.disableRetryButton).toBe(false);
      });

   it('should load unsuccessful payment status on every payment failure if clicked on retry button', () => {
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
      component.retryPayment();
      expect(paymentService.raiseSystemErrorforAPIFailure).toHaveBeenCalled();
   });

   it('should handle success status', () => {
      paymentServiceStub.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return returnValueMakePayment;
      });
      component.retryPayment();
   });

   it('should set successful to true on payment successful', fakeAsync(() => {

      paymentServiceStub.getPaymentStatus = jasmine.createSpy('getPaymentStatus').and.returnValue(true);

      component.ngOnInit();

   }));

   it('should handle pending status', () => {
      paymentServiceStub.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return returnValueMakePaymentWithPendingStatus;
      });
      component.retryPayment();
      fixture.detectChanges();

   });

   it('should handle faliure status', () => {
      paymentServiceStub.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return returnValueMakeNoPayment;
      });
      component.retryPayment();
      fixture.detectChanges();

   });

   it('should handle random status', () => {
      paymentServiceStub.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = true) {
         return returnValueMakePaymentTransactionrandomStatus;
      });
      paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(true);
      component.retryPayment();
      fixture.detectChanges();

   });

   it('should load successful payment status and disable retry button if clicked once on every payment success  ', () => {
      paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(true);
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = false) {
         if (validate) {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         } else {
            return returnValueMakePayment;
         }
      });
      component.retryPayment();
      expect(component.successful).toBe(true);
      expect(component.disableRetryButton).toBe(false);
   });

   it('should load unsuccessful payment status and not disable retry button if clicked once on payment status invalid', () => {
      paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(false);
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = false) {
         if (validate) {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         } else {
            return returnValueMakePayment;
         }
      });
      component.retryPayment();
      expect(component.successful).toBe(false);
      expect(paymentService.raiseSystemErrorforAPIFailure).toHaveBeenCalled();
   });
   it('should load unsuccessful payment status and disable retry button if clicked once on payment status invalid on every payment',
      () => {
         paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and
            .callFake(function (metadata: IPaymentMetaData) {
               paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and
                  .callFake(function (metadataObj: IPaymentMetaData) {
                     return false;
                  });
               paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = false) {
                  if (validate) {
                     return Observable.create(observer => {
                        observer.error(new Error('error'));
                        observer.complete();
                     });
                  } else {
                     return returnValueMakePaymentNoTransaction;
                  }
               });
               return true;
            });
         paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = false) {
            if (validate) {
               return Observable.create(observer => {
                  observer.error(new Error('error'));
                  observer.complete();
               });
            } else {
               return returnValueMakePayment;
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
   it('should load unsuccessful payment status on every payment failure after clicking retry button ', () => {
      paymentService.isPaymentStatusValid = jasmine.createSpy('isPaymentStatusValid').and.returnValue(false);
      paymentService.makePayment = jasmine.createSpy('makePayment').and.callFake(function (validate = false) {
         if (validate) {
            return returnValueMakePayment;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.retryPayment();
      expect(component.successful).toBe(false);
      expect(paymentService.raiseSystemErrorforAPIFailure).toHaveBeenCalled();

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
      component.isCrossBorderPayment = true;
      component.retryPayment();
      expect(paymentService.isPaymentSuccessful).toBeTruthy();
   });
   it('should call the print report ', inject([ReportsService], (reportsService: ReportsService) => {
      component.isCrossBorderPayment = false;
      const newComp = class TestComponent { reportData: any; };
      expect(reportsService.open(newComp, {}, {})).toBeUndefined();
   }));
   it('should get isAPIFailure ', () => {
      const isAPIFailure = component.IsAPIFailure;
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
      component.retryPayment();
      expect(paymentService.isPaymentSuccessful).toBeFalsy();

   });
});

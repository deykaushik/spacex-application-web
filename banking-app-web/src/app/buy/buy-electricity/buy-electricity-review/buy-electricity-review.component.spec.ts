import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

import { assertModuleFactoryCaching } from './../../../test-util';
import { BuyElectricityReviewComponent } from './buy-electricity-review.component';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { BuyElectricityService } from './../buy-electricity.service';
import { Constants } from './../../../core/utils/constants';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { GaTrackingService } from '../../../core/services/ga.service';

const testComponent = class { };
const routerTestingParam = [
   { path: 'buyElectricity/status', component: testComponent }
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

const returnValueMakePurchaseTransaction = Observable.of(response);


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
      },
   },
   getBuyElectricityToVm: jasmine.createSpy('getBuyElectricityToVm').and.returnValue({
      recipientName: 'Test',
      meterNumber: 8967676876,
      serviceProvider: 'Virgin',
      productCode: 'V',
      isValid: true
   }),
   getBuyElectricityForVm: jasmine.createSpy('getBuyElectricityForVm').and.returnValue({
      yourReference: 'Reference',
      notificationType: 'Email',
      notificationInput: 'test@mail.com'
   }),
   getBuyElectricityAmountVm: jasmine.createSpy('getBuyElectricityAmountVm').and.returnValue(
      {
         amount: 100,
         selectedAccount: { accountNumber: '123', accountType: 'CA' },
         electricityAmountInArrears: 20
      }),
   saveBuyElectricityAmountInfo: jasmine.createSpy('saveBuyElectricityAmountInfo'),
   getBuyElectricityReviewVm: jasmine.createSpy('getBuyElectricityAmountVm').and.returnValue(
      {
         isSaveBeneficiary: false,
      }),
   saveBuyElectricityReviewInfo: jasmine.createSpy('saveBuyElectricityReviewInfo'),
   makeElectricityPayment: jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = true) {
      return returnElectricityPayment;
   }),
   isElectricityPaymentStatusValid: jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(true),
   isPaymentStatusNavigationAllowed: jasmine.createSpy('isPaymentStatusNavigationAllowed').and.returnValue(true),
   updateTransactionID: jasmine.createSpy('updateTransactionID'),
   isBeneficiarySaved: jasmine.createSpy('isBeneficiarySaved'),
   raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
   createGuID: jasmine.createSpy('createGuID'),
   redirecttoStatusPage: jasmine.createSpy('redirecttoStatusPage').and.callFake(() => { }),
   updateexecEngineRef: jasmine.createSpy('updateexecEngineRef')
};

const returnElectricityPayment = Observable.of(response);

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

describe('BuyElectricityReviewComponent', () => {
   let component: BuyElectricityReviewComponent;
   let fixture: ComponentFixture<BuyElectricityReviewComponent>;
   let buyService: BuyElectricityService;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            BuyElectricityReviewComponent,
            AmountTransformPipe
         ],
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: BuyElectricityService, useValue: buyServiceStub }, SystemErrorService,
         { provide: BsModalService, useValue: bsModalServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(BuyElectricityReviewComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      buyService = fixture.debugElement.injector.get(BuyElectricityService);
   });

   it('should be created', inject([BuyElectricityService], (service: BuyElectricityService) => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
   }));

   it('should contain step handler', () => {
      expect(component.nextClick).toBeDefined();
   });
   it('should call next handler', () => {
      const currentStep = 1;
      component.onTermsConditionsClick();
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
      buyService.isElectricityPaymentStatusValid = jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(false);
      buyService.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      spyOn(component.isButtonLoader, 'emit');
      component.nextClick(4);
      expect(component.isButtonLoader.emit).toHaveBeenCalled();
   });

   it('should load status component on every transfer failure ', () => {
      buyService.isElectricityPaymentStatusValid = jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(true);
      buyService.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = true) {
         if (validate) {
            return returnElectricityPayment;
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
      buyService.isElectricityPaymentStatusValid = jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(true);
      buyService.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = true) {
         if (validate) {
            return returnElectricityPayment;
         } else {
            buyService.isElectricityPaymentStatusValid = jasmine.createSpy('isElectricityPaymentStatusValid').and.returnValue(false);
            return returnElectricityPayment;
         }
      });
      const spy = spyOn(router, 'navigateByUrl');
      component.nextClick(4);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/buyElectricity/status');
   });
   it('should handle tshwane decline click', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.tshwanDeclineClick();
      const url = spy.calls.first().args[0];
      expect(url).toBe(Constants.routeUrls.dashboard);
      expect(component.isVisible).toBeFalsy();
   }));
   it('should handle tshwane continue click', fakeAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.tshwanContinueClick();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.isVisible).toBeFalsy();
         });
      });
   }));

   it('should handle pending status', () => {
      buyService.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseWithPendingStatus;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(bsModalServiceStub.show).toHaveBeenCalled();
      expect(buyService.isPaymentSuccessful).toBeTruthy();
   });

   it('should handle faliure status', () => {
      buyService.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseNoTransaction;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(buyService.isPaymentSuccessful).toBeFalsy();
   });

   it('should handle sucess status', () => {
      buyService.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseTransaction;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(buyService.isPaymentSuccessful).toBeTruthy();
   });

   it('should handle random status', () => {
      buyService.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseTransactionrandomStatus;
      });
      component.nextClick(4);
      fixture.detectChanges();
      expect(buyService.isPaymentSuccessful).toBeFalsy();
   });
   it('should handle pending status and redirect to status page on error', () => {
      buyService.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = true) {
         return returnValueMakePurchaseTransactionPendingStatus;
      });
      buyService.getApproveItStatus = jasmine.createSpy('getApproveItStatus').and.returnValue(
         Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
      buyService.redirecttoStatusPage = jasmine.createSpy('redirecttoStatusPage').and.callFake(() => { });
      component.nextClick(4);
      expect(buyService.redirecttoStatusPage).toHaveBeenCalled();
   });
});

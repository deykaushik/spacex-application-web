import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { assertModuleFactoryCaching } from './../../../test-util';
import { HighlightPipe } from './../../../shared/pipes/highlight.pipe';
import { Constants } from './../../../core/utils/constants';
import { BuyElectricityToComponent } from './buy-electricity-to.component';
import { BuyElectricityService } from '../buy-electricity.service';
import { BeneficiaryService } from '../../../core/services/beneficiary.service';
import { IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { IContactCard, IBankDefinedBeneficiary, IBuyElectricityAccountDetail, IAccountDetail } from '../../../core/services/models';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { PreFillService } from '../../../core/services/preFill.service';
import { Subscription } from 'rxjs/Subscription';
import { GaTrackingService } from '../../../core/services/ga.service';
import { LoaderService } from '../../../core/services/loader.service';
let location: Location;
let router: Router;

const validMeter = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: '',
               result: 'HV04',
               status: '',
               reason: '',
            }
         ]
      }
   ]
};

const unvalidMeter = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: '',
               result: 'HV02',
               status: '',
               reason: '',
            }
         ]
      }
   ]
};

const fbeMeter = {
   resultData: [
      {
         transactionID: '100',
         resultDetail: [
            {
               operationReference: '',
               result: 'R00',
               status: '',
               reason: '',
            }
         ]
      }
   ]
};

const getFBESucessfulMockData = () => {
   return {
      resultData: [
         {
            transactionID: '1',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'SAVED_VALID',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   };
};

const getFBEUnSucessfulMockData = () => {
   return {
      resultData: [
         {
            transactionID: '0',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'HV04',
                  status: 'Failure',
                  reason: ''
               }
            ]
         }
      ]
   };
};

function getMockElectricityAccounts(): IBuyElectricityAccountDetail[] {
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

const buyElectricityServiceStub = {
   electricityWorkflowSteps: {
      buyTo: {
         isDirty: false
      }
   },
   validateMeter: jasmine.createSpy('validateMeter').and.callFake(() => {
      return Observable.of(validMeter);
   }),
   getBuyElectricityToVm: jasmine.createSpy('getBuyElectricityToVm').and.callFake(() => {
      return {
         recipientName: 'abc',
         meterNumber: '1234555234',
         serviceProvider: 'BLT',
         providerCode: 'MTN',
         isVmValid: false
      };
   }),
   saveBuyElectricityToInfo: jasmine.createSpy('saveBuyElectricityToInfo'),
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.
      returnValue(Observable.of(
         getMockElectricityAccounts()
      )),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>(null),
   getBuyElectricityForVm: jasmine.createSpy('getBuyElectricityForVm').and.returnValue({}),
   saveBuyElectricityForInfo: jasmine.createSpy('saveBuyElectricityForInfo'),
   raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
   createGuID: jasmine.createSpy('createGuID'),
   redirecttoStatusPage: jasmine.createSpy('redirecttoStatusPage')
};

function getContactCardData(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: 'Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
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

function getBankApprovedData(): IBankDefinedBeneficiary {
   return {
      bDFID: '11111110',
      bDFName: 'STANDARD BANK CARD DIVISION',
      sortCode: 205
   };
}
const serviceStub = {
   getBankApprovedBeneficiaries: jasmine.createSpy('getBankApprovedBeneficiaries').and.returnValue(Observable.of([getBankApprovedData()])),
   getContactCards: jasmine.createSpy('getContactCards').and.returnValue(Observable.of([getContactCardData()])),
};
const preFillServiceStub = new PreFillService();
preFillServiceStub.preFillBeneficiaryData = {
   contactCardDetails: {
      cardDetails: getContactCardData().contactCardDetails[0],
      isPrepaid: true,
   }
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const testComponent = class { };

const routerTestingStub = [
   { path: 'buyElectricity/status', component: testComponent }
];

describe('BuyElectricityToComponent', () => {
   let component: BuyElectricityToComponent;
   let fixture: ComponentFixture<BuyElectricityToComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyElectricityToComponent, HighlightPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [
            RouterTestingModule.withRoutes(routerTestingStub),
            TypeaheadModule.forRoot(),
            FormsModule
         ],
         providers: [LoaderService, { provide: BuyElectricityService, useValue: buyElectricityServiceStub },
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: BeneficiaryService, useValue: serviceStub }, SystemErrorService, BsModalService,
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(BuyElectricityToComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   afterEach(() => {
      component.isComponentValid.unsubscribe();
      component.isButtonLoader.unsubscribe();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should emit is component valid', inject([BuyElectricityService], (service: BuyElectricityService) => {
      component.isMeterNumberValid = true;
      component.isComponentValid.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   }));

   it('should validate meter number', inject([BuyElectricityService], (service: BuyElectricityService) => {
      component.vm.meterNumber = '1234';
      component.onMeterNumberBlur(component.vm.meterNumber);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeTruthy();
         });
      });
   }));

   it('should handle the validate meter request error scenario', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.validateMeter = jasmine.createSpy('validateMeter')
         .and.callFake(() => {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         });

      component.vm.meterNumber = '1234';
      component.vm.recipientName = 'Test';
      component.onMeterNumberBlur(component.vm.meterNumber);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.isButtonLoader.subscribe((data) => {
            expect(data).toBeFalsy();
         });
      });
   }));
});


const buyElectricityServiceStub1 = {
   electricityWorkflowSteps: {
      buyTo: {
         isDirty: false
      }
   },
   validateMeter: jasmine.createSpy('validateMeter').and.callFake(() => {
      return Observable.of(unvalidMeter);
   }),
   getBuyElectricityToVm: jasmine.createSpy('getBuyElectricityToVm').and.callFake(() => {
      return {
         recipientName: 'abc',
         meterNumber: '1234555234',
         serviceProvider: 'BLT',
         providerCode: 'MTN',
         isVmValid: true
      };
   }),
   saveBuyElectricityToInfo: jasmine.createSpy('saveBuyElectricityToInfo'),
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.
      returnValue(Observable.of(
         getMockElectricityAccounts()
      )),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>(getMockElectricityAccounts()),
   fbeButtonTextChange: jasmine.createSpy('fbeButtonTextChange'),
   fbeClaimedUnsuccessful: jasmine.createSpy('fbeClaimedUnsuccessful'),
   makeElectricityPayment: jasmine.createSpy('makeElectricityPayment').and.returnValue(Observable.of(getFBEUnSucessfulMockData())),
   isFBETransactionValid: jasmine.createSpy('isFBETransactionValid').and.returnValue(false),
   getBuyElectricityForVm: jasmine.createSpy('getBuyElectricityForVm').and.returnValue({}),
   saveBuyElectricityForInfo: jasmine.createSpy('saveBuyElectricityForInfo'),
   raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
   createGuID: jasmine.createSpy('createGuID'),
   redirecttoStatusPage: jasmine.createSpy('redirecttoStatusPage')
};

describe('BuyElectricityToComponent', () => {
   let component: BuyElectricityToComponent;
   let fixture: ComponentFixture<BuyElectricityToComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyElectricityToComponent, HighlightPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [
            RouterTestingModule.withRoutes(routerTestingStub),
            TypeaheadModule.forRoot(),
            FormsModule
         ],
         providers: [LoaderService, { provide: BuyElectricityService, useValue: buyElectricityServiceStub1 },
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: BeneficiaryService, useValue: serviceStub }, SystemErrorService, BsModalService,
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyElectricityToComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   afterEach(() => {
      component.isComponentValid.unsubscribe();
      component.isButtonLoader.unsubscribe();
   });

   it('should handle wrong meter number', () => {
      component.vm.meterNumber = '999';
      component.onMeterNumberBlur(component.vm.meterNumber);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
         component.isComponentValid.subscribe((data) => {
            expect(data).toBeFalsy();
         });
      });
   });
   it('should handle empty meter number', () => {
      component.onMeterNumberBlur(null);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.isMeterNumberValid).toBeFalsy();
      });
   });
   it('should handle reciepeint focus, if not entered', () => {
      component.vm.meterNumber = '999';
      component.vm.recipientName = '';
      component.isMeterNumberValid = false;
      component.onMeterNumberBlur(component.vm.meterNumber);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.isMeterNumberValid).toBeFalsy();
      });
   });
   it('should set meter number invalid on meter number change', () => {
      component.onMeterNumberChange();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.isMeterNumberValid).toBeFalsy();
      });
   });

   /*
   it('should unsuccessful redeem fbe', () => {
      component.fbeClick();
      fixture.detectChanges();
      component.nextClick(1);
      fixture.detectChanges();
      expect(buyElectricityServiceStub1.fbeClaimedUnsuccessful).toHaveBeenCalled();
   });
   */
});

let data;
const observale = new Observable(observer => {
   data = observer;
   observer.next([]);
});
const updateSucessBehaviour = new BehaviorSubject(true);
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

const buyElectricityServiceStubForFBE = {
   isPaymentSuccessful: false,
   electricityDetails: {},
   getApproveItOtpStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
   getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({ metadata: response })),
   updateTransactionID: jasmine.createSpy('updateTransactionID'),
   electricityWorkflowSteps: {
      buyTo: {
         isDirty: false
      }
   },
   validateMeter: jasmine.createSpy('validateMeter').and.callFake(() => {
      return Observable.of(fbeMeter);
   }),
   getBuyElectricityToVm: jasmine.createSpy('getBuyElectricityToVm').and.callFake(() => {
      return {
         recipientName: 'abc',
         meterNumber: '1234555234',
         serviceProvider: 'BLT',
         providerCode: 'FBE',
         isVmValid: true
      };
   }),
   saveBuyElectricityToInfo: jasmine.createSpy('saveBuyElectricityToInfo'),
   fbeClaimed: jasmine.createSpy('fbeClaimed').and.returnValue(Observable.of([])),
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.
      returnValue(observale),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>([]),
   fbeButtonTextChange: jasmine.createSpy('fbeButtonTextChange'),
   fbeClaimedUnsuccessful: jasmine.createSpy('fbeClaimedUnsuccessful'),
   makeElectricityPayment: jasmine.createSpy('makepurchase').and.callFake(function (validate = true) {
      return Observable.of(getFBESucessfulMockData());
   }),
   isFBETransactionValid: jasmine.createSpy('isFBETransactionValid').and.returnValue(true),
   getBuyElectricityForVm: jasmine.createSpy('getBuyElectricityForVm').and.returnValue({}),
   saveBuyElectricityForInfo: jasmine.createSpy('saveBuyElectricityForInfo'),
   raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
   createGuID: jasmine.createSpy('createGuID'),
   redirecttoStatusPage: jasmine.createSpy('redirecttoStatusPage')
};

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

const returnValueMakePurchaseTransaction = Observable.of(response);

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

describe('BuyElectricityToComponent', () => {
   let component: BuyElectricityToComponent;
   let fixture: ComponentFixture<BuyElectricityToComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyElectricityToComponent, HighlightPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [
            RouterTestingModule.withRoutes(routerTestingStub),
            TypeaheadModule.forRoot(),
            FormsModule
         ],
         providers: [SystemErrorService, LoaderService,
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: BuyElectricityService, useValue: buyElectricityServiceStubForFBE },
            { provide: BeneficiaryService, useValue: serviceStub },
            { provide: BsModalService, useValue: bsModalServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyElectricityToComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      location = TestBed.get(Location);
      fixture.detectChanges();
   });

   afterEach(() => {
      component.isComponentValid.unsubscribe();
      component.isButtonLoader.unsubscribe();
   });

   it('should change component mode to FBE', () => {
      component.fbeClick();
      expect(component.isFBE).toBeTruthy();
   });

   it('should change component mode to purchase', () => {
      component.purchaseClick();
      expect(component.isFBE).toBeFalsy();
   });

   /*
   it('should redeem fbe', () => {
      component.fbeClick();
      fixture.detectChanges();
      component.nextClick(1);
      fixture.detectChanges();
      expect(buyElectricityServiceStubForFBE.fbeClaimed).toHaveBeenCalled();
   });
*/

   it('should handle error scenario while redeem fbe', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and
         .returnValue(Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
      component.fbeClick();
      fixture.detectChanges();
      component.nextClick(1);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.isButtonLoader.subscribe(d => {
            expect(d).toBeFalsy();
         });
      });
   }));

   it('should set isSearchRecipients true on showSearchRecipients method call', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.showSearchRecipients();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.isSearchRecipients).toBe(true);
         });
      });
   });

   it('should set isSearchRecipients false on hideSearchRecipients method call', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.hideSearchRecipients();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.isSearchRecipients).toBe(false);
         });
      });
   });

   it('should handle beneficiary selection', () => {
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            cardDetails: getContactCardData().contactCardDetails[0],
            isPrepaid: true
         }
      });
   });

   it('should set isSearchRecipients true on showSearchRecipients method call', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.showSearchRecipients();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.isSearchRecipients).toBe(true);
         });
      });
   });

   it('should set isSearchRecipients false on hideSearchRecipients method call', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.hideSearchRecipients();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.isSearchRecipients).toBe(false);
         });
      });
   });

   it('should handle beneficiary selection', () => {
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            cardDetails: getContactCardData().contactCardDetails[0],
            isPrepaid: true
         }
      });

      expect(component.vm.recipientName).toEqual(getContactCardData().contactCardDetails[0].beneficiaryName);
   });


   it('should set bank and my recipients when getContact cards', () => {
      const recipientsData = [
         [], [getContactCardData()]
      ];
      component.getContactCards(recipientsData);
      expect(component.myRecipients).not.toBeNull();
      expect(component.bankApprovedRecipients).not.toBeNull();
   });

   it('should handle matching beneficiary', () => {
      const recipientsData = [
         [], [getContactCardData()]
      ];
      component.getContactCards(recipientsData);
      const benefeciary = {
         item: getContactCardData().contactCardDetails[0]
      };
      component.selectBeneficiary(benefeciary);
      fixture.detectChanges();
      expect(component.selectedBeneficiary).toBe(benefeciary.item);

   });
   it('should handle non matching beneficiary', () => {
      component.selectedBeneficiary = undefined;
      const recipientsData = [
         [], [getContactCardData()]
      ];
      component.getContactCards(recipientsData);
      const benefeciary = {
         item: {
            accountType: 'CA', beneficiaryID: 99,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PPD', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }
      };
      fixture.detectChanges();
      spyOn(component, 'handleBeneficiarySelection');
      component.selectBeneficiary(benefeciary);
      expect(component.handleBeneficiarySelection).not.toHaveBeenCalled();
   });

   it('should handle beneficiary selection for prepaid contact card', () => {
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            cardDetails: getContactCardData().contactCardDetails[0],
            isElectricity: true
         },
         contactCard: getContactCardData()
      });
      expect(component.vm.recipientName).toEqual(getContactCardData().contactCardDetails[0].beneficiaryName);
   });

   it('should handle beneficiary name clear', () => {
      component.meterNumberSubscription = new Subscription();
      component.onRecipientNameClear();
      expect(component.lastMeterNumber).toBeUndefined();

      component.buyElectricityToForm.controls.meterNumber = new FormControl();
      component.vm.isRecipientPicked = true;
      component.onRecipientNameClear();
      expect(component.lastMeterNumber).toBe('');
   });

   it('should handle pending status', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseWithPendingStatus;
      });
      component.fbeClick();
      component.nextClick(4);
      fixture.detectChanges();
      expect(bsModalServiceStub.show).toHaveBeenCalled();
      expect(service.isPaymentSuccessful).toBeTruthy();
   }));

   it('should handle pending status with fail', inject([BuyElectricityService, BsModalService], (service: BuyElectricityService,
      mservice: BsModalService) => {
      mservice.show = jasmine.createSpy('getApproveItStatus').and.callFake(function () {
         return {
            content: {
               getApproveItStatus: Observable.of(true),
               resendApproveDetails: Observable.of(true),
               getOTPStatus: Observable.of(true),
               otpIsValid: Observable.of(true),
               updateSuccess: Observable.of(false),
               processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
               processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
               processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
            }
         };
      }),
         service.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
            return returnValueMakePurchaseWithPendingStatus;
         });
      component.fbeClick();
      component.nextClick(4);
      fixture.detectChanges();
      expect(mservice.show).toHaveBeenCalled();
      expect(service.isPaymentSuccessful).toBeFalsy();
   }));

   it('should handle faliure status', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseNoTransaction;
      });
      component.fbeClick();
      component.nextClick(4);
      fixture.detectChanges();
      expect(service.isPaymentSuccessful).toBeFalsy();
   }));

   it('should handle sucess status', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseTransaction;
      });
      component.fbeClick();
      component.nextClick(4);
      fixture.detectChanges();
      expect(service.isPaymentSuccessful).toBeTruthy();
   }));

   it('should handle random status', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.makeElectricityPayment = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseTransactionrandomStatus;
      });
      component.fbeClick();
      component.nextClick(4);
      fixture.detectChanges();
      expect(service.isPaymentSuccessful).toBeFalsy();
   }));

   it('should not validate meter number if it is not changed', inject([BuyElectricityService], (service: BuyElectricityService) => {
      component.vm.meterNumber = '1234';
      component.onMeterNumberBlur(component.vm.meterNumber);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.vm.meterNumber = '1234';
         component.onMeterNumberBlur(component.vm.meterNumber);
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.validateMeterNumber()).toHaveBeenCalledTimes(1);
         });
      });
   }));
   it('should handle pending status and redirect to status page on error'
      , inject([BuyElectricityService], (service: BuyElectricityService) => {

         service.makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.callFake(function (validate = true) {
            return returnValueMakePurchaseTransactionPendingStatus;
         });


         service.getApproveItStatus = jasmine.createSpy('getApproveItStatus').and.returnValue(
            Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            }));
         component.isFBE = true;
         component.nextClick(1);
         expect(service.redirecttoStatusPage).toHaveBeenCalled();
      }));
});


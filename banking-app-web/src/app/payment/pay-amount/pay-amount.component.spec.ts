import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { assertModuleFactoryCaching } from './../../test-util';
import { Constants } from '../../core/utils/constants';
import { PaymentType } from '../../core/utils/enums';
import { GaTrackingService } from '../../core/services/ga.service';
import { PreFillService } from '../../core/services/preFill.service';
import { ISettlementDetail } from '../../core/services/models';
import { IAccountDetail, IPrepaidAccountDetail, IClientDetails } from '../../core/services/models';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';

import { IPayAmountVm } from '../payment.models';
import { PaymentService } from './../payment.service';
import { PayAmountComponent } from './pay-amount.component';

const el = {
   show: jasmine.createSpy('show'),
   hide: jasmine.createSpy('hide')
};

const calculateQuoteSubject = new Subject();
let isMobilePayment = false;
let isAccountPayment = false;
function getMockBankData() {
   return {
      bankCode: '001',
      bankName: 'Test',
      rTC: false,
      universalCode: '',
      branchCodes: [{
         branchCode: '001',
         branchName: 'Test Branch'
      }]
   };
}

function getValidMockBankData() {
   return {
      bankCode: '001',
      bankName: 'Test',
      rTC: true,
      universalCode: 'aaaaaaa',
      branchCodes: [{
         branchCode: '001',
         branchName: 'Test Branch'
      }]
   };
}
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
const crossBorderPaymentData = {
   country: {
      code: 'GHS',
      countryName: 'Ghana'
   },
   currency: 'GHS',
   bank: {
      bankName: 'abc',
      accountNumber: '221',
      branch: {
         branchName: 'aa',
         branchAddress: 'SA',
         branchCityVillage: 'SA',
         branchStateProvince: null,
         branchZip: '123',
      }
   },
   personalDetails: {
      gender: 'Male',
      idPassportNumber: '123',
      recipientMobileNo: '999',
      recipientAddress: 'SA',
      recipientCityVillage: '',
      recipientStateProvince: '',
      recipientZip: ''
   },
   beneficiaryDetails: {
      beneficiaryAccountName: '1234',
      beneficiaryAccountStatus: '12',
      beneficiaryAccountType: 'Current',
      beneficiaryCurrency: 'GHS',
      checkReference: 'as',
      transactionID: 'asdf-asdf',
      residentialStatus: 'Permanent',
   }
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
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.
      returnValue(Observable.of(
         getMockPaymentAccounts()
      )),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>(getMockPaymentAccounts()),

   getPaymentLimits: jasmine.createSpy('getPaymentLimits').and.returnValue(Observable.of([{
      limitType: 'payment',
      userAvailableDailyLimit: 500
   }, {
      limitType: 'sendimali',
      userAvailableDailyLimit: 100
   }, {
      limitType: 'instantpayment',
      userAvailableDailyLimit: 200
   }])),

   isMobilePayment: function () {
      return isMobilePayment;
   },
   isAccountPayment: function () {
      return isAccountPayment;
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
      paymentType: PaymentType.account,
      bank: {
         rtc: true,
         universalCode: '123'
      },
      isCrossBorderPaymentActive: false,
      crossBorderPayment: crossBorderPaymentData
   }),
   savePayAmountInfo: jasmine.createSpy('savePayAmountInfo').and.returnValue({}),
   getPublicHolidays: jasmine.createSpy('getPublicHolidays').and.returnValue(Observable.of([{
      date: '2018-10-10',
      dayName: 'Monday',
      description: 'abc'
   }])),
   calculateQuote: jasmine.createSpy('calculateQuote').and.returnValue(calculateQuoteSubject)
};
const MockQuoteCalculateResponse = {
   data: {
      beneficiaryAmount: '100',
      cutOffTime: '2',
      deliveryTimeInHour: '3',
      maximumRemittanceAmount: '4',
      remittanceCharge: '5',
      totalPaymentAmount: '100',
      paymentExchangeRate: '6'
   },
   metadata: {
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
   }
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

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};

const mockSettlementData: ISettlementDetail = {
   settlementAmt: 100,
};

const preFillServiceStub = new PreFillService();

describe('PayAmountComponent', () => {
   let component: PayAmountComponent;
   let fixture: ComponentFixture<PayAmountComponent>;
   let body: HTMLElement;
   let paymentService: PaymentService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      isMobilePayment = false;
      isAccountPayment = false;
      TestBed.configureTestingModule({
         imports: [FormsModule, TooltipModule.forRoot()],
         declarations: [PayAmountComponent, AmountTransformPipe, SkeletonLoaderPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: PaymentService, useValue: paymentServiceStub },
         { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: PreFillService, useValue: preFillServiceStub }],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(PayAmountComponent);
      component = fixture.componentInstance;
      body = component['document'].body;
      paymentService = fixture.debugElement.injector.get(PaymentService);
      fixture.detectChanges();
   });

   it('should be created in case of cellphone payment', () => {
      component.payToVm.paymentType = PaymentType.mobile;
      expect(component).toBeTruthy();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set account from if navigated from dashboard', () => {
      component.vm.accountFromDashboard = '1';
      component.vm.selectedAccount = undefined;
      component.setAccountFrom();
      expect(component.vm.selectedAccount.itemAccountId).toBe(component.vm.accountFromDashboard);
   });
   it('should toggle instant pay', () => {
      component.isInstantPaymentValid = true;
      component.vm.isInstantPay = false;
      component.onInstantPayClick(null);
      expect(component.accounts).toBeTruthy();
   });

   it('should show tooltip on instant pay toggle click', () => {
      component.isInstantPaymentValid = false;
      component.onInstantPayClick(el);
      expect(el.show).toHaveBeenCalled();
   });

   it('should handle payment amount change', () => {
      component.vm.transferAmount = 123456;
      component.vm.isInstantPay = true;
      component.onAmountChange(component.vm.transferAmount);
      expect(component.vm.isTransferLimitExceeded).toBe(true);
      expect(component.vm.transferAmount).toBeGreaterThan(0);
      expect(component.vm.allowedTransferLimit).toBeLessThan(0);
   });

   it('should handle payment amount change', () => {
      component.vm.transferAmount = 1;
      component.vm.isInstantPay = false;
      component.onAmountChange(component.vm.transferAmount);
      expect(component.vm.isTransferLimitExceeded).toBe(false);
      expect(component.vm.allowedTransferLimit).toBe(499);
   });

   it('should handle account selection', () => {
      component.customTooltip = el;
      component.onAccountSelection(component.vm.selectedAccount);
      expect(component.vm.selectedAccount).toBeDefined();
   });

   it('should validate component', () => {
      fixture.detectChanges();
      component.vm.isTransferLimitExceeded = false;
      component.vm.isValid = true;
      component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.monthly;
      component.vm.numRecurrence = 12;
      expect(component.validate()).toBeFalsy();

      component.vm.selectedAccount = null;
      expect(component.validate()).toBeFalsy();
   });

   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler with various reccurrence values', () => {
      const currentStep = 1;
      component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.weekly;
      expect(component.nextClick(currentStep)).toBeUndefined();

      component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.none;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should contain step handler', () => {
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

   it('should check if the form is dirty', () => {
      component.validate();
      expect(component.payAmountForm.dirty).toBe(false);
   });

   it(`should validate number of repetitions allowed for various
         payment frequencies & number of repititions.`, () => {
         component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.none;
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.monthly;
         component.vm.numRecurrence = 0;
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.vm.numRecurrence = 12;
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.vm.numRecurrence = 13;
         expect(component.isNumReccurencesInvalid()).toBeTruthy();


         component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.weekly;
         component.vm.numRecurrence = -1;
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.vm.numRecurrence = 52;
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.vm.numRecurrence = 53;
         expect(component.isNumReccurencesInvalid()).toBeTruthy();
      });

   it('should check for changing payment frequency', () => {
      component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.monthly);
      component.vm.isInstantPay = false;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.none);
         expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.none);
      });
   });

   it('should populate payment frequency for various payment frequency types', () => {

      component.populatePaymentFrequency(Constants.VariableValues.paymentRecurrenceFrequency.monthly.code);
      expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.monthly);

      component.populatePaymentFrequency(Constants.VariableValues.paymentRecurrenceFrequency.weekly.code);
      expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.weekly);

      component.populatePaymentFrequency(Constants.VariableValues.paymentRecurrenceFrequency.none.code);
      expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.none);


      expect(function () {
         component.populatePaymentFrequency('invalid');
      }).toThrowError();
   });

   it('should set visible visible on hide overlay', () => {
      component.hideOverlay(true);
      expect(component.isVisible).toBe(true);
   });
   it('should toggle overlay visibility on activeOverlay call', () => {
      component.isVisible = true;
      component.activeOverlay();
      expect(component.isVisible).toBe(false);
      component.activeOverlay();
      expect(component.isVisible).toBe(true);
   });
   it('should call show on showTooltip when visibility is false', () => {
      component.vm.isInstantPay = false;
      component.showTooltip(el);
      expect(el.show).toHaveBeenCalled();
   });

   it('check for isInstantPayAvailableForBank', () => {
      component.vm.isInstantPay = false;
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should add class on showTooltip when visibility is true', () => {
      component.vm.isInstantPay = true;
      component.hideTooltip(el);
      expect(el.hide).toHaveBeenCalled();
   });
   it('should not set numRecurrence ', () => {
      component.vm.recurrenceFrequency = '';
      component.nextClick(1);
      expect(component.vm.numRecurrence).toBeNull();
   });

   it('should set message for time when tooltip is shown', () => {
      component.currentDate = new Date('2017-10-08');
      component.payToVm.bank = getMockBankData();
      component.payToVm.bank.universalCode = 'abc';
      component.payToVm.bank.rTC = true;
      component.showTooltip(el);
      expect(component.instantPayUnavailableMsg).toEqual(Constants.labels.instantPay.timeErrorMessage);
   });

   it('should set message for time when tooltip is shown', () => {
      component.currentDate = new Date('2017-10-08');
      component.payToVm.bank = getMockBankData();

      component.showTooltip(el);
      expect(component.instantPayUnavailableMsg).toEqual(Constants.labels.instantPay.bankErrorMessage);
   });

   it('should check for Sunday', () => {
      component.currentDate = new Date('2017-10-08');
      expect(component.isSunday()).toEqual(true);
      component.payToVm.bank = getValidMockBankData();
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should check for Saturday', () => {
      component.currentDate = new Date('2017-10-07');
      component.payToVm.bank = getMockBankData();
      expect(component.isSaturday()).toEqual(true);
   });

   it('should check for week day', () => {
      component.currentDate = new Date('2017-10-06');
      expect(component.isWeekDay()).toEqual(true);
   });

   it('should check for public holiday', () => {
      component.currentDate = new Date('2018-10-10 06:00:00');
      component.publicHolidays = [{
         date: '2018-10-10',
         description: '',
         dayName: ''
      }];
      expect(component.isPublicHoliday()).toBeDefined();
      component.payToVm.bank = getValidMockBankData();
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should check for time on Saturday', () => {
      component.currentDate = new Date('07-10-2017 20:03:44');
      expect(component.isValidInstantPaymentTime()).toBe(false);
      component.payToVm.bank = getValidMockBankData();
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should check for time on week days', () => {
      component.currentDate = new Date('06-10-2017 20:03:44');
      expect(component.isValidInstantPaymentTime()).toBe(false);
      component.payToVm.bank = getValidMockBankData();
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should validate instant payment with valid data', () => {
      component.currentDate = new Date('06-10-2017 10:03:44');
      component.payToVm.bank = getValidMockBankData();
      component.publicHolidays = [{
         date: '2018-10-10',
         description: '',
         dayName: ''
      }];
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(true);
   });

   it('should validate instant payment time for default scenario', () => {
      component.currentDate = new Date('2017-10-08');
      component.payToVm.bank = getValidMockBankData();
      expect(component.isValidInstantPaymentTime()).toBeUndefined();
   });

   it('should check payment limit with mobile payment', () => {
      isMobilePayment = true;
      component.ngOnInit();
      expect(component.vm.availableTransferLimit).toBe(100);
   });

   it('should check payment limit with account payment', () => {
      isMobilePayment = false;
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.vm.availableTransferLimit).toBe(500);
      expect(component.vm.availableInstantTransferLimit).toBe(200);
   });

   it('should set date from the date component', () => {
      const date = new Date();
      component.setDate(date);
      expect(component.vm.paymentDate).toBe(date);
   });
   it('should check for null in account', () => {
      paymentServiceStub.accountsDataObserver.next(null);
      fixture.detectChanges();
   });
   it('should enable repeat payment dropdown for different date', () => {
      const date = new Date('October 13, 2017 11:13:00');
      component.setDate(date);
      expect(component.vm.paymentDate).toBe(date);
      expect(component.isSameDate).toBeFalsy();
      component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.monthly);
      component.vm.isInstantPay = false;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.none);
         expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.none);
      });
   });
   it('should check for no accounts', () => {
      paymentServiceStub.accountsDataObserver.next([]);
      fixture.detectChanges();
   });
   it('should check isAccountPayment inside ngOnInit to get Public holidays', () => {
      isAccountPayment = true;
      component.ngOnInit();
   });
   it('should check for changing repeat type', () => {
      const repeatType = component.vm.repeatType;
      component.onRepeatTypeChange(repeatType);
   });
   it('should set crossborder payment on calculate with payment account', () => {
      component.payToVm.crossBorderPayment = crossBorderPaymentData;
      component.vm.selectedCurrency = Constants.defaultCrossPlatformCurrency.name;
      component.onCalculate();
      calculateQuoteSubject.next(MockQuoteCalculateResponse);
      expect(component.vm.totalPaymentAmount).toBe('100');
      expect(component.vm.remittanceCharge).toBe('5');
   });
   it('should set crossborder payment on calculate with payment account', () => {
      component.showloader = true;
      paymentService.calculateQuote = jasmine.createSpy('calculateQuote').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         });
      });
      component.onCalculate();
      expect(component.showloader).toBe(false);
   });
   it('should set check calculate quote error in range 201 to 299', () => {
      component.showloader = true;
      paymentService.calculateQuote = jasmine.createSpy('calculateQuote').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.onCalculate();
      expect(component.showloader).toBe(false);
      component.showloader = true;
      paymentService.calculateQuote = jasmine.createSpy('calculateQuote').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 304, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.onCalculate();
      expect(component.showloader).toBe(false);
   });
   it('should set crossborder payment on calculate with beneficiary account', () => {
      component.payToVm.crossBorderPayment = crossBorderPaymentData;
      component.vm.selectedCurrency = component.payToVm.crossBorderPayment.beneficiaryDetails.beneficiaryCurrency;
      component.crossBorderAmountMinimumLimit = 90;
      component.onCalculate();
      calculateQuoteSubject.next({});
      calculateQuoteSubject.next(MockQuoteCalculateResponse);
      expect(component.vm.totalPaymentAmount).toBe('100');
      expect(component.vm.remittanceCharge).toBe('5');
   });
   it('should check if minimum cross border payment is less than minimum amount', () => {
      component.payToVm.crossBorderPayment = crossBorderPaymentData;
      component.vm.selectedCurrency = component.payToVm.crossBorderPayment.beneficiaryDetails.beneficiaryCurrency;
      component.crossBorderAmountMinimumLimit = 1000;
      component.onCalculate();
      calculateQuoteSubject.next({});
      calculateQuoteSubject.next(MockQuoteCalculateResponse);
      expect(component.showCalculation).toBe(false);
      expect(component.showLimitExceedingError).toBe(true);
   });
   it('should set currency on currency change', () => {
      component.onCurrencyChange(null, { name: 'GHS' });
      expect(component.vm.selectedCurrency).toBe('GHS');
   });
   it('should set on crossborder payment', () => {
      component.showTwoButtons.subscribe(result => {
         expect(result).toBe(true);
      });
      component.payToVm.isCrossBorderPaymentActive = true;
      component.setCrossBorderPayment();
   });
   it('should handle manage transfer limits in crossborder payment', () => {
      component.payToVm.isCrossBorderPaymentActive = true;
      component.vm.selectedCurrency = 'GHS';
      component.manageTransferLimitForCrossBorderPayment();
      expect(component.vm.isTransferLimitExceeded).toBe(false);
   });
   it('should handle manage transfer limits in crossborder payment', () => {
      component.payToVm.isCrossBorderPaymentActive = true;
      component.vm.selectedCurrency = 'ZAR ';
      component.vm.allowedTransferLimit = -1;
      component.manageTransferLimitForCrossBorderPayment();
      expect(component.vm.isTransferLimitExceeded).toBe(true);
   });
   it('should set showCalculation on decline click', () => {
      component.showCalculation = true;
      component.declineClick();
      expect(component.showCalculation).toBe(false);
   });

   it('check for isInstantPayAvailableForAccount', () => {
      component.isInstantPayAvailableForAcc = false;
      component.currentDate = new Date('2018-10-11 06:00:00');
      component.publicHolidays = [{
         date: '2018-10-10',
         description: '',
         dayName: ''
      }];
      component.payToVm.bank = getValidMockBankData();
      component.validateInstantPayment();
      expect(component.isInstantPaymentValid).toEqual(false);
   });

   it('should disable instant payment if account is not CASA', () => {
      component.customTooltip = el;
      component.currentDate = new Date('2018-10-11 06:00:00');
      component.publicHolidays = [{
         date: '2018-10-10',
         description: '',
         dayName: ''
      }];
      const selectacc = component.vm.selectedAccount;
      selectacc.accountType = 'CR';
      component.onAccountSelection(selectacc);
      expect(component.isInstantPayAvailableForAcc).toBe(false);
   });
   it('should show account related message that instant pay is not available', () => {
      component.currentDate = new Date('2017-10-08');
      component.payToVm.bank = getMockBankData();
      component.payToVm.bank.universalCode = 'abc';
      component.payToVm.bank.rTC = true;
      component.isInstantPayAvailableForAcc = false;
      component.showTooltip(el);
      expect(component.instantPayUnavailableMsg).toBe(Constants.labels.instantPay.accountErrorMessage);
      component.payToVm.bank.rTC = false;
      component.showTooltip(el);
      expect(component.instantPayUnavailableMsg).toBe(Constants.labels.instantPay.accountErrorMessage);

   });
   it('should filter account based on  account type', () => {
      component.currentDate = new Date('2017-10-08');
      component.payToVm.bank = getMockBankData();
      component.payToVm.bank.universalCode = 'abc';
      component.payToVm.bank.rTC = true;
      component.showTooltip(el);
      component.isInstantPaymentValid = true;
      component.vm.isInstantPay = false;
      component.accounts = getMockPaymentAccounts();
      component.onInstantPayClick(el);
      expect(component.accounts).toBeDefined();
   });
   it('should toggle instant pay', () => {
      component.isInstantPaymentValid = true;
      component.vm.isInstantPay = true;
      component.onInstantPayClick(null);
      expect(component.vm.isInstantPay).toBeFalsy();
   });
   it('it should set value of allowInstantPaymentToggle to true', () => {
      isMobilePayment = false;
      component.allowInstantPaymentToggle = false;
      paymentService.isAccountPayment = jasmine.createSpy('isAccountPayment').and.returnValue(true);
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.allowInstantPaymentToggle).toBe(true);
   });
   it('it should set value of allowInstantPaymentToggle to true in case of service failure', () => {
      isMobilePayment = false;
      component.allowInstantPaymentToggle = false;
      paymentService.isAccountPayment = jasmine.createSpy('isAccountPayment').and.returnValue(true);
      paymentService.getPublicHolidays = jasmine.createSpy('getPublicHolidays').and.returnValue(Observable.throw(''));
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.allowInstantPaymentToggle).toBe(true);
   });
});

import { DecimalPipe } from '@angular/common';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';

import { assertModuleFactoryCaching } from './../../../test-util';
import { SkeletonLoaderPipe } from './../../../shared/pipes/skeleton-loader.pipe';
import { AmountFormatDirective } from './../../../shared/directives/amount-format.directive';
import { ValidateRequiredDirective } from './../../../shared/directives/validations/validation-required.directive';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { BuyAmountComponent } from './buy-amount.component';
import { BuyService } from '../buy.service';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { ITransactionFrequency } from '../../../core/utils/models';
import { BuyAmountModel } from './buy-amount.model';
import { IBuyToVm, IBuyAmountVm } from './../buy.models';
import {
   IPrepaidLimitDetail, IPrepaidServiceProviderProducts, IPrepaidAccountDetail,
   IServiceProvider, IAccountDetail, IClientDetails
} from './../../../core/services/models';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { GaTrackingService } from '../../../core/services/ga.service';
function getMockProviderData(): IServiceProvider[] {
   return [{
      serviceProviderCode: 'VGN',
      serviceProviderName: 'Virgin'
   },
   {
      serviceProviderCode: '8TA',
      serviceProviderName: 'Telkom Mobile'
   }];
}


const AllinOneProduct = [{ amountValue: 49, bundleList: 'DAY', bundleValue: 30 },
{ amountValue: 49, bundleList: 'SMS', bundleValue: 100 },
{ amountValue: 49, bundleList: 'MIN', bundleValue: 100 },
{ amountValue: 49, bundleList: 'MB', bundleValue: 100 },
{ amountValue: 49, bundleList: 'WIN', bundleValue: 120 },
{ amountValue: 89, bundleList: 'DAY', bundleValue: 30 },
{ amountValue: 89, bundleList: 'WIN', bundleValue: 120 },
{ amountValue: 89, bundleList: 'SMS', bundleValue: 200 },
{ amountValue: 89, bundleList: 'MIN', bundleValue: 200 },
{ amountValue: 89, bundleList: 'MB', bundleValue: 200 },
{ amountValue: 199, bundleList: 'DAY', bundleValue: 60 },
{ amountValue: 199, bundleList: 'WIN', bundleValue: 120 },
{ amountValue: 199, bundleList: 'MB', bundleValue: 500 },
{ amountValue: 199, bundleList: 'MIN', bundleValue: 500 },
{ amountValue: 199, bundleList: 'SMS', bundleValue: 500 }];
const VodaComProviderConfig = [{
   allowFutureDated: false, allowPurchaseNow: true, allowRecurring: false, maxAmount: 5, minAmount: 2, productCode: 'PVB',
   productDescription: 'Power Voice Bundle', voucherTopupInstructions: 'PRESS *100*01*> (ENTER PIN)>> PRESS # > PRESS DIAL',
   productDetails: [{ amountValue: 3, bundleList: 'MIN', bundleValue: 20 },
   { amountValue: 9, bundleList: 'MIN', bundleValue: 50 }]
}];
const CellCProviderwithAllinOneStub = [{
   allowFutureDated: false, allowPurchaseNow: true, allowRecurring: false, maxAmount: 0, minAmount: 0, productCode: 'PCB',
   productDescription: 'All in One', voucherTopupInstructions: 'DIAL 141>LISTEN>PRESS 1>(ENTER PIN)> PRESS #',
   productDetails: AllinOneProduct
}];

function getMockPrepaidAccounts(): IPrepaidAccountDetail[] {
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

function getMockProviderProductsData(name): IPrepaidServiceProviderProducts[] {
   return [{
      productCode: 'PAI',
      productDescription: 'Prepaid Airtime',
      minAmount: 5,
      maxAmount: 1000,
      allowPurchaseNow: true,
      allowFutureDated: true,
      allowRecurring: true,
      voucherTopupInstructions: 'DIAL 555>LISTEN>PRESS 5>(ENTER PIN)>PRESS #',
      productDetails: [
         {
            amountValue: 5,
            bundleList: 'R',
            bundleValue: 5
         },
         {
            amountValue: 29,
            bundleList: 'R',
            bundleValue: 29
         }]
   }, {
      productCode: 'PCB',
      productDescription: 'All in One',
      minAmount: 0,
      maxAmount: 0,
      allowPurchaseNow: true,
      allowFutureDated: true,
      allowRecurring: true,
      voucherTopupInstructions: 'DIAL 555>LISTEN>PRESS 5>(ENTER PIN)>PRESS #',
      productDetails: [
         {
            amountValue: 5,
            bundleList: 'SMS',
            bundleValue: 5
         },
         {
            amountValue: 29,
            bundleList: 'DAY',
            bundleValue: 29
         }]
   },
   {
      productCode: 'PDN',
      productDescription: 'Daily Bundle',
      minAmount: 0,
      maxAmount: 0,
      allowPurchaseNow: true,
      allowFutureDated: true,
      allowRecurring: true,
      voucherTopupInstructions: 'DIAL 555>LISTEN>PRESS 5>(ENTER PIN)>PRESS #',
      productDetails: [
         {
            amountValue: 5,
            bundleList: 'SMS',
            bundleValue: 5
         },
         {
            amountValue: 29,
            bundleList: 'DAY',
            bundleValue: 29
         }]
   }
   ];
}
function getMockPrepaidLimitData(): IPrepaidLimitDetail[] {
   return [{
      limitType: 'prepaid',
      dailyLimit: 3000,
      userAvailableDailyLimit: 3000,
      maxDailyLimit: 3000,
      isTempLimit: false,
      maxTmpDateRangeLimit: 30
   }, {
      limitType: 'payment',
      dailyLimit: 3000,
      userAvailableDailyLimit: 3000,
      maxDailyLimit: 3000,
      isTempLimit: false,
      maxTmpDateRangeLimit: 30
   }];
}
function getMockBuyAmountModel(): IBuyAmountVm {
   return {
      startDate: new Date(),
      endDate: new Date(),
      productCode: null,
      rechargeType: null,
      bundleType: 'Own Amount',
      amount: 10,
      recurrenceFrequency: Constants.VariableValues.paymentRecurrenceFrequency.none.code,
      numRecurrence: '',
      selectedAccount: null,
      repeatType: 'endDate'
   };
}

function getMockBuyToData(): IBuyToVm {
   return {
      recipientName: 'abc',
      mobileNumber: '123455523',
      serviceProvider: 'MTN',
      serviceProviderName: 'MTN'
   };
}
const getMockCELLCBuyToData: IBuyToVm = {

   recipientName: 'abc',
   mobileNumber: '123455523',
   serviceProvider: 'CLC',
   serviceProviderName: 'Cell C'

}; const getMockVodacomBuyToData: IBuyToVm = {

   recipientName: 'abc',
   mobileNumber: '123455523',
   serviceProvider: 'VDC',
   serviceProviderName: 'Vodacom'

};
const buyServiceStub = {
   buyWorkflowSteps: {
      BuyAmountComponent: {
         isDirty: false
      }
   },
   getServiceProvidersProducts: jasmine.createSpy('getServiceProvidersProducts').and.
      returnValue(Observable.of(
         getMockProviderProductsData('MTN')
      )),
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.
      returnValue(Observable.of(
         getMockPrepaidAccounts()
      )),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>(getMockPrepaidAccounts()),
   getPrepaidLimit: jasmine.createSpy('getPrepaidLimit').and.
      returnValue(Observable.of(getMockPrepaidLimitData()
      )),
   getBuyAmountVm: jasmine.createSpy('getBuyAmountVm').and.returnValue(getMockBuyAmountModel()),
   getBuyToVm: jasmine.createSpy('getBuyToVm').and.
      returnValue(getMockBuyToData()),
   saveBuyAmountInfo: jasmine.createSpy('saveBuyAmountInfo')
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
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('BuyAmountComponent', () => {
   let component: BuyAmountComponent;
   let fixture: ComponentFixture<BuyAmountComponent>;
   let buyService: BuyService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            BuyAmountComponent,
            AmountTransformPipe,
            SkeletonLoaderPipe,
            AmountFormatDirective
         ],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            AmountTransformPipe,
            { provide: BuyService, useValue: buyServiceStub }, DecimalPipe,
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(BuyAmountComponent);
      component = fixture.componentInstance;
      buyService = fixture.debugElement.injector.get(BuyService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set account from if navigated from dashboard', () => {
      component.vm.accountNumberFromDashboard = '1';
      component.vm.selectedAccount = undefined;
      component.setAccountFrom();
      expect(component.vm.selectedAccount.itemAccountId).toBe(component.vm.accountNumberFromDashboard);
   });

   it('should create a view model,populate products and bundles corresponding to provide from step 1', () => {
      expect(component.vm).toBeDefined();
      expect(component.accounts.length).toBe(getMockPrepaidAccounts().length);
      expect(component.products.length).toBe(getMockProviderProductsData('MTN').length);
   });

   it('should show amount box if change recharge type to own amount', () => {
      component.onRechargeTypeChanged('Own Amount');
      expect(component.showBundleAmountBox).toBe(true);
      expect(component.vm.amount).toBe(0);
      expect(component.selectedBundleType).toBe('Own Amount');
      expect(component.isValid).toBe(false);
   });
   it('should be able to change recharge type to Airtime and set bundles of it', () => {
      component.onRechargeTypeChanged('Airtime');
      expect(component.showBundleAmountBox).toBe(false);
      expect(component.vm.amount).toBe(5);
      expect(component.isValid).toBe(true);
   });
   it('should disable the next button if data is not entered for own amount', () => {
      component.onRechargeTypeChanged('Own Amount');
      expect(component.vm.amount).toBe(0);
      expect(component.isValid).toBe(false);
   });
   it('should be to able to select a bundle type Airtime and set the corresponding amount value', () => {
      component.onRechargeTypeChanged('Airtime');
      component.onBundleAmountTypeChanged(component.bundleAmountTypes[0]);
      expect(component.vm.productCode).toBe('PAI');
      expect(component.vm.amount).toBe(5);
      expect(component.buyAmountForm.valid).toBe(true);
      expect(component.showOwnAmount).toBe(true);
   });

   it('should be to able to select a bundle type All in one and set the corresponding amount value', () => {
      component.onRechargeTypeChanged('All in One');
      component.onBundleAmountTypeChanged(component.bundleAmountTypes[0]);
      expect(component.vm.productCode).toBe('PCB');
      expect(component.vm.amount).toBe(5);
      expect(component.buyAmountForm.valid).toBe(true);
      expect(component.showOwnAmount).toBe(false);
   });

   it('should validate amount value wrt limit', () => {
      component.onAmountChange(100);
      expect(component.isTransferLimitExceeded).toBe(false);
      expect(component.allowedTransferLimit).toBe(component.availableTransferLimit - 100);
      expect(component.isValid).toBe(true);
   });
   it('validate payment on insufficant balance ', inject([BuyService], (service: BuyService) => {
      component.onAmountChange(1234);
      component.validatePaymentAmount(1233);
      expect(component.isValid).toEqual(false);
      component.vm.amount = 2;
      component.validatePaymentAmount(1);
      component.isTransferLimitExceeded = false;
      expect(component.isValid).toEqual(false);
   }));
   it('should change the recurrence value', () => {
      const paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(paymentRecurrenceFrequencies[0].value);
         expect(component.vm.numRecurrence).toBe('');
      });
   });

   it('should validate the recurrence value if never is set', () => {
      const paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(paymentRecurrenceFrequencies[0].value);
         const flag = component.isRecurrenceValueInvalid();
         expect(flag).toBe(false);
      });
   });
   it('should validate the recurrence value if weekly value is set', () => {
      const paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(paymentRecurrenceFrequencies[1].value);
         component.vm.numRecurrence = '10';
         const flag = component.isWeeklyRecurrenceInvalid();
         expect(flag).toBe(false);
      });
   });
   it('should validate the recurrence value if monthly value is set', () => {
      const paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(paymentRecurrenceFrequencies[2].value);
         component.vm.numRecurrence = '10';
         const flag = component.isMonthlyRecurrenceInvalid();
         expect(flag).toBe(false);
      });
   });
   it('should invalidate the recurrence value if weekly value is set', () => {
      const paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(paymentRecurrenceFrequencies[1].value);
         component.vm.numRecurrence = '55';
         const flag = component.isWeeklyRecurrenceInvalid();
         expect(flag).toBe(true);
      });
   });
   it('should invalidate the recurrence value if monthly value is set', () => {
      const paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(paymentRecurrenceFrequencies[2].value);
         component.vm.numRecurrence = '13';
         const flag = component.isMonthlyRecurrenceInvalid();
         expect(flag).toBe(true);
      });
   });
   it('should invalidate the recurrence value if no value is set', () => {
      const paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(paymentRecurrenceFrequencies[2].value);
         component.vm.numRecurrence = '';
         const flag = component.isRecurrenceValueInvalid();
         expect(flag).toBe(false);
      });
   });
   it('should not set numRecurrence ', () => {
      component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.none;
      component.nextClick(3);
      expect(component.vm.numRecurrence).toBeNull();
   });
   it('should call next handler with various reccurrence values', () => {
      const currentStep = 1;
      component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.weekly;
      expect(component.nextClick(currentStep)).toBeUndefined();

      component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.none;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });
   it('should have step click', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
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
   it('should populate data from the model', () => {
      const rechargeType = getMockProviderProductsData('MTN')[1];
      expect(component.vm.rechargeType).toBe(
         rechargeType.productDescription.replace(`${Constants.labels.buyLabels.buyAmountLabels.Prepaid} `, ''));
      expect(component.selectedAccount.accountNumber).toBe(getMockPrepaidAccounts()[0].accountNumber);
   });
   it(`should validate number of repetitions allowed for various
   payment frequencies & number of repititions.`, () => {
         component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.none;
         expect(component.isNumReccurencesInvalid()).toBeFalsy();
         component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.monthly;
         component.vm.numRecurrence = '';
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.vm.numRecurrence = '12';
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.vm.numRecurrence = '13';
         expect(component.isNumReccurencesInvalid()).toBeTruthy();


         component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.weekly;

         component.vm.numRecurrence = '52';
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.vm.numRecurrence = '53';
         expect(component.isNumReccurencesInvalid()).toBeTruthy();
      });
   it('should set date from the date component', () => {
      const date = new Date();
      component.setDate(date);
      expect(component.vm.startDate).toBe(date);
   });
   it('should enable repeat payment dropdown for different date', () => {
      const date = new Date('October 13, 2017 11:13:00');
      component.setDate(date);
      expect(component.vm.startDate).toBe(date);
      expect(component.isSameDate).toBeFalsy();
      component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.monthly);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.none);
         expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.none);
      });
   });
   it('should check for changing payment frequency', () => {
      component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.monthly);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.none);
         expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.none);
      });
   });
   it('should check for changing repeat type', () => {
      const repeatType = component.vm.repeatType;
      component.onRepeatTypeChange(repeatType);
   });

   it('should prevent to buy MTN Daily Bundle for Future date', () => {
      component.onRechargeTypeChanged('Daily Bundle');
      expect(component.isSchedulePaymentDisabled).toBeTruthy();
      expect(component.repeatPurchaseMessage).toBe(component.repeatPaymentdisableMessage);
      expect(component.vm.startDate).toEqual(component.todayDate);
      expect(component.formatDate).toEqual(moment(component.todayDate));
   });

   it('should prevent to repeat buy Cell C and All in one bundle', () => {
      component.validateProviderConfiguration('CLC', 'PCB');
      expect(component.isRecurringPaymentDisabled).toBeTruthy();
      expect(component.isSchedulePaymentDisabled).toBeFalsy();
   });
   it('should set bundleMessage for Vodacom and BIG Bonus Voucher', () => {
      component.validateProviderConfiguration('VDC', 'PBB');
      expect(component.bundleMessage).not.toEqual('');
   });

   it('should show bundle format mixed as defined in multipleBundle formats with product All in One', () => {
      buyService.getBuyToVm = jasmine.createSpy('getBuyToVm').and.returnValue(getMockCELLCBuyToData);
      const product: IPrepaidServiceProviderProducts = {
         productCode: 'PCB',
         productDescription: '',
         minAmount: 1,
         maxAmount: 100,
         allowPurchaseNow: true,
         allowFutureDated: false,
         allowRecurring: false,
         voucherTopupInstructions: '',
         productDetails: null
      };
      component.selectedProduct = product;
      const value = component.getAmountLiteral({ amountValue: 49, bundleList: 'SMS', bundleValue: 100 });
      expect(value).toEqual('R49.00 for 100SMS and 100MB');

   });
   it('should show bundle in R i.e. South African Rand format only', () => {
      buyService.getBuyToVm = jasmine.createSpy('getBuyToVm').and.returnValue(getMockVodacomBuyToData);
      const product: IPrepaidServiceProviderProducts = {
         productCode: 'PBB',
         productDescription: '',
         minAmount: 1,
         maxAmount: 100,
         allowPurchaseNow: true,
         allowFutureDated: false,
         allowRecurring: false,
         voucherTopupInstructions: '',
         productDetails: null
      };
      component.selectedProduct = product;
      Constants.labels.buyLabels.ProductAmountandFormat.push(
         {
            providerCode: 'VDC', productCode: 'PVB', ProductFormat: '',
            productsIncluded: [{ amountValue: 2, bundleList: 'MIN', bundleValue: 10 }]
         }
      );
      const value = component.getAmountLiteral({ amountValue: 49, bundleList: 'SMS', bundleValue: 100 });
      expect(value).toEqual('R49.00');

   });

   it('should add only those bundles which are defined in ProductAmountandFormat constants and have mathcing bundles', () => {
      buyService.getBuyToVm = jasmine.createSpy('getBuyToVm').and.returnValue(getMockVodacomBuyToData);
      let vodacomProviderConfig: IPrepaidServiceProviderProducts[] = [];
      const VodamComConfig = [{
         allowFutureDated: false, allowPurchaseNow: true, allowRecurring: false, maxAmount: 5, minAmount: 2, productCode: 'PVB',
         productDescription: 'Power Voice Bundle', voucherTopupInstructions: 'PRESS *100*01*> (ENTER PIN)>> PRESS # > PRESS DIAL',
         productDetails: [{ amountValue: 2, bundleList: 'MIN', bundleValue: 10 },
         { amountValue: 5, bundleList: 'MIN', bundleValue: 60 }]
      }];

      vodacomProviderConfig = VodamComConfig;
      component.products = vodacomProviderConfig;
      component.vm.productCode = 'PVB';
      component.bundleAmountTypes = [{ amountValue: 2, bundleList: 'MIN', bundleValue: 10 },
      { amountValue: 5, bundleList: 'MIN', bundleValue: 60 }];
      component.onRechargeTypeChanged('Power Voice');

      expect(component.bundleAmountTypes.length).toEqual(1);
   });
   it(`should add all bundles which are coming from API and its
   product configuration is defined in ProductAmountandFormat constants but do not have matching bundles`, () => {
         buyService.getBuyToVm = jasmine.createSpy('getBuyToVm').and.returnValue(getMockVodacomBuyToData);
         let vodacomProviderConfig: IPrepaidServiceProviderProducts[] = [];
         vodacomProviderConfig = VodaComProviderConfig;
         component.products = vodacomProviderConfig;
         component.vm.productCode = 'PVB';
         component.bundleAmountTypes = [{ amountValue: 2, bundleList: 'MIN', bundleValue: 10 },
         { amountValue: 9, bundleList: 'MIN', bundleValue: 50 }];
         component.onRechargeTypeChanged('Power Voice');

         expect(component.bundleAmountTypes.length).toEqual(2);
      });
   it('should add distinct amount only in case of All in One Product Code', () => {
      buyService.getBuyToVm = jasmine.createSpy('getBuyToVm').and.returnValue(getMockCELLCBuyToData);
      let CellCProviderConfig: IPrepaidServiceProviderProducts[] = [];
      CellCProviderConfig = CellCProviderwithAllinOneStub;
      component.products = CellCProviderConfig;
      component.vm.productCode = 'CLC';
      component.bundleAmountTypes = AllinOneProduct;
      component.onRechargeTypeChanged('All in One');
      expect(component.bundleAmountTypes.length).toEqual(3);
   });


});

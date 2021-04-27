import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../../test-util';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { BuyElectricityAmountModel } from './buy-electricity-amount.model';
import { IBuyElectricityToVm, IBuyElectricityAmountVm } from './../buy-electricity.models';

import { SkeletonLoaderPipe } from './../../../shared/pipes/skeleton-loader.pipe';
import { AmountFormatDirective } from './../../../shared/directives/amount-format.directive';
import { ValidateRequiredDirective } from './../../../shared/directives/validations/validation-required.directive';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { BuyElectricityAmountComponent } from './buy-electricity-amount.component';
import { BuyElectricityService } from '../buy-electricity.service';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { ITransactionFrequency } from '../../../core/utils/models';
import { IAccountDetail, IClientDetails } from '../../../core/services/models';
import {
   IBuyElectricityLimitDetail, IBuyElectricityAccountDetail,
   IServiceProvider
} from './../../../core/services/models';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';


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


function getMockElectricityLimitData(): IBuyElectricityLimitDetail[] {
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
function getMockBuyElectricityAmountModel(): IBuyElectricityAmountVm {
   return {
      startDate: new Date(),
      amount: 10,
      selectedAccount: null
   };
}

function getMockBuyElectricityToData(): IBuyElectricityToVm {
   return {
      recipientName: 'abc',
      meterNumber: '1234555234',
      serviceProvider: 'MTN',
      productCode: 'PEL',
      isVmValid: true
   };
}
const getElectricityLimitsBehaviour = new  BehaviorSubject(getMockElectricityLimitData());
const buyServiceStub = {
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.
      returnValue(Observable.of(
         getMockElectricityAccounts()
      )),
   getElectricityLimits: jasmine.createSpy('getElectricityLimits').and.
      returnValue(getElectricityLimitsBehaviour),
   getBuyElectricityAmountVm: jasmine.createSpy('getBuyAmountVm').and.returnValue(getMockBuyElectricityAmountModel()),
   saveBuyElectricityAmountInfo: jasmine.createSpy('saveBuyAmountInfo'),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>(getMockElectricityAccounts()),
};

describe('BuyElectricityAmountComponent', () => {
   let component: BuyElectricityAmountComponent;
   let fixture: ComponentFixture<BuyElectricityAmountComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            BuyElectricityAmountComponent,
            AmountTransformPipe,
            SkeletonLoaderPipe,
            ValidateRequiredDirective,
            AmountFormatDirective
         ],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            AmountTransformPipe,
            { provide: BuyElectricityService, useValue: buyServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyElectricityAmountComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should create empty aray acounts when no acounts is emited ', () => {
      buyServiceStub.accountsDataObserver.next(undefined);
      expect(component.accounts.toString()).toBe([].toString());
      buyServiceStub.accountsDataObserver.next(getMockElectricityAccounts());
   });

   it('should create a view mode provide from step 1', () => {
      expect(component.vm).toBeDefined();
      expect(component.accounts.length).toBe(getMockElectricityAccounts().length);
   });

   it('should set account from if navigated from dashboard', () => {
      component.vm.accountNumberFromDashboard = '1';
      component.vm.selectedAccount = null;
      component.setAccountFrom();
      expect(component.vm.selectedAccount.itemAccountId).toBe(component.vm.accountNumberFromDashboard);
   });

   it('should enable the next button if all the form data is valid', () => {
      component.vm.amount = 10;
      fixture.detectChanges();
      expect(component.isValid).toBe(true);
      expect(component.buyElectricityAmountForm.valid).toBe(true);
   });


   it('should validate amount value wrt limit', () => {
      component.onAmountChange(100);
      expect(component.isTransferLimitExceeded).toBe(false);
      expect(component.allowedTransferLimit).toBe(component.availableTransferLimit - 100);
      expect(component.isValid).toBe(true);
   });
   it('should invalidate amount value wrt limit', () => {
      component.onAmountChange(10000);
      expect(component.isTransferLimitExceeded).toBe(true);
      expect(component.allowedTransferLimit).toBe(component.availableTransferLimit - 10000);
      expect(component.isValid).toBe(false);
   });
   it('should validate amount value wrt limit', () => {
      component.onAmountChange(1);
      expect(component.isTransferLimitExceeded).toBe(false);
      expect(component.allowedTransferLimit).toBe(component.availableTransferLimit - 1);
      expect(component.isValid).toBe(false);
   });

   it('should have step click', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });
   it('should handle next handler  values', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
      expect(component.vm.amount).toBeDefined();
   });
   it('should handle next handler  values', () => {
      const subscribe = component.isComponentValid.subscribe(val => {
            expect(val).toBe(false);
            subscribe.unsubscribe();
      });
      getElectricityLimitsBehaviour.error(new Error());
   });
});

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

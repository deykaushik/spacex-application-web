import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { assertModuleFactoryCaching } from './../../../test-util';
import { BuyToComponent } from './buy-to.component';
import { BuyService } from '../buy.service';
import { HighlightPipe } from './../../../shared/pipes/highlight.pipe';
import { BeneficiaryService } from '../../../core/services/beneficiary.service';
import { IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { IBankDefinedBeneficiary, IContactCard, IBuyElectricityAccountDetail, IAccountDetail } from '../../../core/services/models';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { IBuyAmountVm } from './../buy.models';
import { Constants } from '../../../core/utils/constants';
import { PreFillService } from '../../../core/services/preFill.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
const buyServiceStub = {
   buyWorkflowSteps: {
      buyTo: {
         isDirty: false
      }
   },
   getBuyToVm: jasmine.createSpy('getBuyToVm').and.callFake(() => {
      return {
         recipientName: 'abc',
         mobileNumber: '123455523',
         serviceProvider: 'MTN'
      };
   }),
   saveBuyToInfo: jasmine.createSpy('saveBuyToInfo'),
   getServiceProviders: jasmine.createSpy('getServiceProviders').and.returnValue(Observable.of([{
      serviceProviderCode: 'VGN',
      serviceProviderName: 'Virgin'
   },
   {
      serviceProviderCode: '8TA',
      serviceProviderName: 'Telkom Mobile'
   }])),
   handleMobilePayment: jasmine.createSpy('handleMobilePayment'),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>(getMockElectricityAccounts()),
   getBuyAmountVm: jasmine.createSpy('getBuyAmountVm').and.returnValue(getMockBuyAmountModel()),
   saveBuyAmountInfo: jasmine.createSpy('saveBuyAmountInfo'),
   getBuyForVm: jasmine.createSpy('getBuyToVm').and.returnValue({}),
   saveBuyForInfo: jasmine.createSpy('saveBuyForInfo')
};
function getMockBuyAmountModel(): IBuyAmountVm {
   return {
      startDate: new Date(),
      productCode: null,
      rechargeType: null,
      bundleType: 'Own Amount',
      amount: 10,
      recurrenceFrequency: Constants.VariableValues.paymentRecurrenceFrequency.none.code,
      numRecurrence: '',
      selectedAccount: null
   };
}
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
function getContactCardData(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: 'Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PPD', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PPD', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'Test', branchCode: '001',
            beneficiaryType: 'BFNXT', myReference: 'Z Mahomed',
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
   getContactCards: jasmine.createSpy('getContactCards').and.returnValue(Observable.of([getContactCardData()]))
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

describe('BuyToComponent', () => {
   let component: BuyToComponent;
   let fixture: ComponentFixture<BuyToComponent>;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyToComponent, HighlightPipe],
         imports: [
            FormsModule,
            RouterTestingModule,
            TypeaheadModule.forRoot(),
            BsDropdownModule.forRoot()
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: BuyService, useValue: buyServiceStub },
         { provide: PreFillService, useValue: preFillServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: BeneficiaryService, useValue: serviceStub }, SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyToComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should return provider icon class', () => {
      expect(component.getProviderIconClass('abc')).toEqual('icon-abc');
   });

   it('should handle provider selection', () => {
      component.onProviderSelection({
         serviceProviderCode: 'MTN',
         serviceProviderName: 'MTNa'
      });
      expect(component.displaySelectedServiceProvider).toEqual('MTNa');
      expect(component.vm.serviceProvider).toEqual('MTN');
      expect(component.vm.serviceProviderName).toEqual('MTNa');
   });
   it('should validate for default text in service provider name', () => {
      component.displaySelectedServiceProvider = 'Please select';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.validateServiceProvider()).toBe(false);
      });
   });
   it('should validate for Service Provider Name', () => {
      component.displaySelectedServiceProvider = 'Cell C';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.validateServiceProvider()).toBe(true);
      });
   });

   it('should validate for Provider Name', () => {
      component.displaySelectedServiceProvider = 'Cell C';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.checkDefaultSelected(component.displaySelectedServiceProvider)).toBe(false);
      });
   });

   it('should validate for incorrect mobile number', () => {
      component.vm.mobileNumber = '12367891';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.validateMobileNumber()).toBe(false);
      });
   });

   it('should validate for correct mobile number', () => {
      component.vm.mobileNumber = '1234567891';
      component.onMobileNumberChange(component.vm.mobileNumber);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.validateMobileNumber()).toBe(true);
      });
   });

   it('should allow to change mobile number', () => {
      component.vm.mobileNumber = '1234567891';
      fixture.detectChanges();

      component.vm.mobileNumber = '1234567890';
      component.onMobileNumberChange(component.vm.mobileNumber);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
         expect(component.validateMobileNumber()).toBe(true);
      });
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
      component.vm.serviceProvider = 'xyz';
      expect(component.nextClick(currentStep)).toBeUndefined();
      component.vm.serviceProvider = 'MTN';
      component.nextClick(currentStep);
   });

   it('should check for selected provider', () => {
      expect(component.isProviderSelected('')).toBeFalsy();
   });

   it('should check for selected provider', () => {
      component.vm.serviceProvider = 'MTN';
      expect(component.isProviderSelected('MTN')).toBeTruthy();
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
});

describe('BuyToComponent', () => {
   let component: BuyToComponent;
   let fixture: ComponentFixture<BuyToComponent>;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BuyToComponent, HighlightPipe],
         imports: [
            FormsModule,
            RouterTestingModule,
            TypeaheadModule.forRoot(),
            BsDropdownModule.forRoot()
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [SystemErrorService, PreFillService, { provide: BuyService, useValue: buyServiceStub },
            { provide: BeneficiaryService, useValue: serviceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BuyToComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
      buyServiceStub.accountsDataObserver.next([]);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
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

   it('should set isRecipientPicked on onRecipientNameChanged', () => {
      component.onRecipientNameChanged();
      fixture.detectChanges();
      expect(component.vm.isRecipientPicked).toBe(false);
   });

});


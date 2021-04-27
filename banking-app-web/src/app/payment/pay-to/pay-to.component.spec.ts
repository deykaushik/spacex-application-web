import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../test-util';
import { PayToComponent } from './pay-to.component';
import { PaymentService } from '../payment.service';
import { IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { HighlightPipe } from './../../shared/pipes/highlight.pipe';
import {
   IBank, IContactCard, IBankDefinedBeneficiary, IBeneficiaryData,
   IAccountDetail, IPrepaidAccountDetail, CountryDetail, IRemittanceAvailabilityStatus
} from './../../core/services/models';
import { ICrossBorderVm, IPayAmountVm } from '../../payment/payment.models';
import { Constants } from '../../core/utils/constants';
import { BeneficiaryService } from '../../core/services/beneficiary.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { PaymentType } from '../../core/utils/enums';
import { PreFillService } from '../../core/services/preFill.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { LoaderService } from '../../core/services/loader.service';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

const validateBeneficiarySubject = new Subject();
const preFillServiceStub = new PreFillService();
preFillServiceStub.preFillBeneficiaryData = {
   contactCardDetails: {
      cardDetails: getContactCardData().contactCardDetails[0],
      isPrepaid: true,
   }
};
let component: PayToComponent, fixture: ComponentFixture<PayToComponent>, popularBankData: IBank[],
   mockBankData: IBank, mockCrossBorderPaymentData: ICrossBorderVm, isEdit, isNedBankSelected;
mockBankData = getMockBankData();
popularBankData = getPopularBankData();
mockCrossBorderPaymentData = getMockCrossBorderPaymentData();
const paymentServiceStub = {
   paymentWorkflowSteps: {
      payTo: {
         isDirty: false,
         isNavigated: false
      },
      payAmount: {
         isDirty: false,
         isNavigated: false
      },
      payFor: {
         isDirty: false,
         isNavigated: false
      },
      payReview: {
         isDirty: false,
         isNavigated: false
      }
   },
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.
      returnValue(Observable.of(
         getMockPaymentAccounts()
      )),
   countryListObserver: new BehaviorSubject<CountryDetail[]>(null),
   checkRemittanceAvailability: jasmine.createSpy('checkRemittanceAvailability').and.
      returnValue(Observable.of(
         getMockRemittanceAvailability()
      )),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>(getMockPaymentAccounts()),
   savePayAmountInfo: jasmine.createSpy('savePayAmountInfo').and.returnValue(null),
   getPayToVm: jasmine.createSpy('getPayToVm').and.callFake(() => {
      const vm = {};
      vm['crossBorderPayment'] = mockCrossBorderPaymentData;
      if (isEdit) {
         vm['bank'] = mockBankData;
      } else {
         vm['bank'] = null;
      }
      vm['isAccountPayment'] = true;
      vm['isMobilePayment'] = true;
      return vm;
   }),
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
   clearPayToVm: jasmine.createSpy('clearPayToVm'),
   savePayToInfo: jasmine.createSpy('savePayToInfo'),
   getBanks: jasmine.createSpy('getBanks').and.returnValue(Observable.of([mockBankData])),
   handleMobilePayment: jasmine.createSpy('handleMobilePayment'),
   resetDataOnRecipientSelection: jasmine.createSpy('resetDataOnRecipientSelection'),
   resetPayToStepData: jasmine.createSpy('resetPayToStepData'),
   resetPayForStepData: jasmine.createSpy('resetPayForStepData'),
   isMobilePayment: jasmine.createSpy('isMobilePayment').and.returnValue(true),
   isAccountPayment: jasmine.createSpy('isAccountPayment').and.returnValue(true),
   isCreditCardPayment: jasmine.createSpy('isCreditCardPayment').and.returnValue(true),
   isForeignBankPayment: jasmine.createSpy('isForeignBankPayment').and.returnValue(true),
   validateBeneficiary: jasmine.createSpy('validateBeneficiary').and.returnValue(validateBeneficiarySubject),
   raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { })
};

function getMockBankData() {
   return {
      bankCode: '001',
      bankName: 'Test',
      rTC: true,
      universalCode: '100',
      branchCodes: [{
         branchCode: '001',
         branchName: 'Test',
      }]
   };
}
function getPopularBankData() {
   return [
      {
         bankCode: '009', bankName: 'ABSA BANK',
         rTC: true,
         category: ''
      },

      {
         bankCode: '020', bankName: 'CAPITEC BANK', rTC: true,
         category: ''
      },
      {
         bankCode: '008', bankName: 'FNB SOUTH AFRICA', rTC: true,

         category: ''
      },
      {
         bankCode: '001', bankName: 'STANDARD BANK SOUTH AFRICA', rTC: true,

         category: ''
      },
      {
         bankCode: '003', bankName: 'NEDBANK', rTC: true,

         category: ''
      }];

}

function getMockCountryList() {
   return [
      {
         'countryName': 'BENIN',
         'isoCountry': 'BJ',
         'destinationCountry': 'EBJ',
         'destinationEntity': 'ECOBANK'
      }];
}

function getMockCrossBorderPaymentData() {
   return {
      country: {
         countryName: 'Ghana',
         code: 'GHS'
      },
      bank: {
         bankName: 'Ecobank',
         accountNumber: '1234567890',
      },
      personalDetails: {
         gender: null,
         idPassportNumber: null,
         recipientMobileNo: null,
         recipientAddress: null,
         recipientCityVillage: null,
         recipientStateProvince: null,
         recipientZip: null
      },
      beneficiaryDetails: {
         beneficiaryAccountName: null,
         checkReference: null
      }
   };
}

function getBankApprovedData(): IBankDefinedBeneficiary {
   return {
      bDFID: '11111110',
      bDFName: 'STANDARD BANK CARD DIVISION',
      sortCode: 205
   };
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
            beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'Test', branchCode: '001',
            beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CC', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'Test', branchCode: '001',
            beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
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

function getMockRemittanceAvailability(): IRemittanceAvailabilityStatus {

   return {
      data: {
         availability: true,
         cutOffTime: '15'
      },
      metadata: {
         page: 0,
         pageSize: 0,
         pageLimit: 0,
         resultData: [{
            batchID: '',
            transactionID: '',
            recInstrID: '',
            resultDetail: [{
               operationReference: '',
               result: '',
               status: '',
               reason: ''
            }],
            execEngineRef: ''
         }]
      }
   };
}

function getBankApprovedContactData(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: 'Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'BDF', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'BDF', myReference: 'Z Mahomed',
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
const serviceStub = {
   getBankApprovedBeneficiaries: jasmine.createSpy('getBankApprovedBeneficiaries').and.returnValue(Observable.of([getBankApprovedData()])),
   getContactCards: jasmine.createSpy('getContactCards').and.returnValue(Observable.of([getContactCardData()])),
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};
describe('PayToComponent', () => {
   let paymentService: PaymentService;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      isEdit = false;
      isNedBankSelected = true;
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [PayToComponent, HighlightPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: PaymentService, useValue: paymentServiceStub },
            { provide: BeneficiaryService, useValue: serviceStub },
            { provide: Document },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            LoaderService
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(PayToComponent);
      component = fixture.componentInstance;
      paymentService = TestBed.get(PaymentService);
      router = TestBed.get(Router);
      component.getContactCards([[getBankApprovedData()], [getContactCardData()]]);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call ngOnInit and set selected bank', () => {
      isEdit = true;
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.isBranchVisible).toBeFalsy();
   });

   it('Pay to Account button clicked', () => {
      component.onPayToAccountClick();
      expect(component.isAccountPayment()).toBeTruthy();
   });

   it('Pay to Mobile button clicked', () => {
      component.onPayToMobileClick();
      expect(component.isAccountPayment()).toBeFalsy();
   });

   it('Pay to Credit card button clicked', () => {
      component.onPayToCreditCardClick();
      expect(component.isCreditCardPayment()).toBe(true);
   });

   it('Pay to Foreign bank payment button clicked', () => {
      component.onPayToForeignBankClick();
      expect(component.isForeignBankPayment()).toBe(true);
   });

   it('Pay to is remittance available', () => {
      component.onPayToForeignBankClick();
      expect(component.isRemittanceAvailable()).toBe(true);
   });

   it('Should open country dropdown', () => {
      component.onCountryDropdownOpen();
      expect(component.crossCountryDirty).toBe(true);
   });

   it('Should select gender', () => {
      component.selectGender('Female');
      expect(component.vm.crossBorderPayment.personalDetails.gender).toBe('Female');
   });

   it('Should validate selected gender', () => {
      component.selectGender('Male');
      expect(component.validateGender).toBeTruthy();

   });

   it('Pay to Account button clicked', () => {
      component.vm.isRecipientPicked = true;
      component.onPayToAccountClick();
      expect(component.vm.paymentType).toBeUndefined();
   });

   it('Pay to Mobile clicked', () => {
      component.vm.isRecipientPicked = true;
      component.onPayToMobileClick();
      expect(component.vm.paymentType).toBeUndefined();
   });

   it('Pay to Credit card button clicked', () => {
      component.vm.isRecipientPicked = true;
      component.onPayToCreditCardClick();
      expect(component.vm.paymentType).toBeUndefined();
   });
   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should contain step handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should validate for correct mobile number', () => {
      component.vm.mobileNumber = '1234567891';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.validateMobileNumber()).toBe(true);
      });
   });

   it('should validate for correct mobile number on change', () => {
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

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should select a bank and store details in component vm', () => {
      component.selectBank({ item: mockBankData });
      fixture.detectChanges();
      expect(component.vm.bank.bankCode).toEqual(mockBankData.bankCode);
      expect(component.vm.bank.bankName).toEqual(mockBankData.bankName);
      expect(component.vm.bank.rTC).toEqual(mockBankData.rTC);
      expect(component.vm.bank.universalCode).toEqual(mockBankData.universalCode);
      expect(component.vm.bank.branchCodes.length).toEqual(mockBankData.branchCodes.length);
      expect(component.vm.bank.branchCodes[0].branchCode).toEqual(mockBankData.branchCodes[0].branchCode);
      expect(component.vm.bank.branchCodes[0].branchName).toEqual(mockBankData.branchCodes[0].branchName);
   });

   it('should select a branch and store details in component vm', () => {
      component.selectBranch({ item: mockBankData.branchCodes[0] });
      fixture.detectChanges();
      expect(component.vm.branch.branchCode).toEqual(mockBankData.branchCodes[0].branchCode);
      expect(component.vm.branch.branchName).toEqual(mockBankData.branchCodes[0].branchName);
   });

   it('should select the bank from list', () => {
      component.blurBank({ item: mockBankData });
      fixture.detectChanges();
      expect(component.vm.bank).toBeTruthy();
   });

   it('should not select the bank from list and clear the bank', () => {
      component.blurBank({});
      fixture.detectChanges();
      expect(component.vm.bank).toBeFalsy();
   });

   it('should clear the bank data from the vm and input', () => {
      component.noBankResults(true);
      component.blurBankInput();
      expect(component.vm.bank).toBeFalsy();
   });

   it('should not clear the bank data from the vm and input', () => {
      component.blurBank({ item: mockBankData });
      component.noBankResults(false);
      component.blurBankInput();
      expect(component.vm.bank).toBeTruthy();
   });
   it('should select the branch from list', () => {
      const branch = mockBankData.branchCodes[0];
      component.selectBank({ item: mockBankData });
      fixture.detectChanges();
      component.blurBranch({ item: mockBankData.branchCodes[0] });
      fixture.detectChanges();
      expect(component.vm.branch).toBeTruthy();
   });

   it('should not select the branch from list and clear the branch', () => {
      const branch = mockBankData.branchCodes[0];
      component.selectBank({ item: mockBankData });
      component.blurBranch({});
      fixture.detectChanges();
      expect(component.vm.branch).toBeFalsy();
   });

   it('should clear the bank data from the vm and input', () => {
      const branch = mockBankData.branchCodes[0];
      component.selectBank({ item: mockBankData });
      component.noBranchResults(true);
      component.blurBranchInput();
      expect(component.vm.branch).toBeFalsy();
   });

   it('should not clear the branch data from the vm and input', () => {
      const branch = mockBankData.branchCodes[0];
      component.selectBank({ item: mockBankData });
      component.blurBranch({ item: mockBankData.branchCodes[0] });
      component.noBranchResults(false);
      component.blurBranchInput();
      expect(component.vm.branch).toBeTruthy();
   });

   it('should set default NedBank settings if NedBank is selected by user', () => {
      mockBankData.bankName = Constants.VariableValues.nedBankDefaults.bankName;
      component.selectBank({ item: mockBankData });

      component.vm.accountType = Constants.VariableValues.accountTypes.creditCardAccountType.code;
      component.onAccountTypeDropdownOpen();
      component.onAccountTypeChanged({ value: { text: 'Credit Card', code: 'CC' } });

      expect(component.vm.branch).toBe(Constants.VariableValues.nedBankDefaults.branch);
      expect(component.vm.bank.acceptsBatchAVS).toBe(Constants.VariableValues.nedBankDefaults.acceptsBatchAVS);
      expect(component.vm.bank.acceptsRealtimeAVS).toBe(Constants.VariableValues.nedBankDefaults.acceptsRealtimeAVS);
      expect(component.vm.accountType).toBe(Constants.VariableValues.accountTypes.creditCardAccountType.code);
   });

   it('should hide branch if NedBank is selected by user', () => {
      mockBankData.bankName = Constants.VariableValues.nedBankDefaults.bankName;
      delete mockBankData.universalCode;
      component.selectBank({ item: mockBankData });
      fixture.detectChanges();
      expect(component.isBranchVisible).toBe(false);
      expect(component.isNedBankSelected).toBe(true);
   });
   it('should check if the form is dirty', () => {
      component.validate();
      expect(component.payToForm.dirty).toBe(false);
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

   it('should handle beneficiary selection for bank approved scenario', () => {
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: getBankApprovedData(),
         contactCardDetails: null
      });

      expect(component.vm.recipientName).toEqual(getBankApprovedData().bDFName);
      expect(component.isAccountPayment()).toBe(true);
   });

   it('should handle beneficiary selection for prepaid contact card', () => {
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            cardDetails: getContactCardData().contactCardDetails[0],
            isPrepaid: true,
         },
         contactCard: getContactCardData()
      });

      expect(component.vm.recipientName).toEqual(getContactCardData().contactCardDetails[0].beneficiaryName);
   });

   it('should handle beneficiary selection for account contact card', () => {
      component.ngOnInit();
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            isAccount: true,
            cardDetails: getContactCardData().contactCardDetails[0],
         },
         contactCard: getContactCardData()
      });

      expect(component.vm.recipientName).toEqual(getContactCardData().contactCardDetails[0].beneficiaryName);
   });

   it('should handle beneficiary selection with bank data', () => {
      component.ngOnInit();
      component.banks[0].bankName = 'Test';
      delete component.banks[0].universalCode;
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            isAccount: true,
            cardDetails: getContactCardData().contactCardDetails[1],
         },
         contactCard: getContactCardData()
      });

      expect(component.vm.bankName).toEqual('Test');
   });

   it('should handle beneficiary selection with no bank available for beneficiary', () => {
      component.ngOnInit();
      component.banks[0].bankName = 'Test1';
      const beneficiaryData: IBeneficiaryData = {
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            isAccount: true,
            cardDetails: getContactCardData().contactCardDetails[1],
         },
         contactCard: getContactCardData()
      };

      beneficiaryData.contactCardDetails.cardDetails.bankName = null;
      component.handleBeneficiarySelection(beneficiaryData);
      expect(component.vm.bankName).toBe('');
   });

   it('should handle beneficiary selection with no branch available for beneficiary', () => {
      component.ngOnInit();
      component.banks[0].bankName = 'Test';
      component.banks[0].bankCode = 'Test';
      component.banks[0].branchCodes[0].branchCode = 'ABC';
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            isAccount: true,
            cardDetails: getContactCardData().contactCardDetails[1],
         },
         contactCard: getContactCardData()
      });

      expect(component.vm.branchName).toEqual('');
   });

   it('should handle beneficiary selection with credit card', () => {
      component.ngOnInit();
      component.banks[0].bankName = 'Test';
      component.banks[0].branchCodes[0].branchCode = 'ABC';
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            isAccount: true,
            cardDetails: getContactCardData().contactCardDetails[2],
         },
         contactCard: getContactCardData()
      });

      expect(component.vm.recipientName).toEqual(getContactCardData().contactCardDetails[2].beneficiaryName);
   });

   it('should handle beneficiary selection for account contact card', () => {
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            isAccount: true,
            cardDetails: getContactCardData().contactCardDetails[0]
         },
         contactCard: getContactCardData()
      });
      expect(component.vm.recipientName).toEqual(getContactCardData().contactCardDetails[0].beneficiaryName);
   });

   it('should handle beneficiary selection for electricity contact card', () => {
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


   it('should handle receipient name changes', () => {
      const benefeciary = {
         item: getContactCardData().contactCardDetails[0]
      };
      component.selectBeneficiary(benefeciary);
      expect(component.vm.isShowBankName).toEqual(true);

      component.vm.beneficiaryData = {
         bankDefinedBeneficiary: null,
         contactCardDetails: null
      };
      component.selectBeneficiary(benefeciary);
      expect(component.vm.isShowBankName).toEqual(true);

      component.vm.beneficiaryData = {
         bankDefinedBeneficiary: getBankApprovedData(),
         contactCardDetails: null
      };
      component.selectBeneficiary(benefeciary);
      expect(component.vm.isShowBankName).toEqual(true);

   });

   it('should set benefeciary onselectBeneficiary call', () => {
      component.selectedBeneficiary = null;
      const benefeciary = {
         item: getContactCardData().contactCardDetails[0]
      };
      component.selectBeneficiary(benefeciary);
      fixture.detectChanges();
      expect(component.selectedBeneficiary).not.toBeNull();
   });

   it('should set bank and my recipients when getContact cards', () => {
      const recipientsData = [
         [
            getBankApprovedData()
         ],
         [
            getContactCardData()
         ]
      ];
      component.getContactCards(recipientsData);
      expect(component.myRecipients).not.toBeNull();
      expect(component.bankApprovedRecipients).not.toBeNull();
   });

   it('should handle bankapproved beneficiary', () => {
      const benefeciary = {
         item: getBankApprovedData()
      };
      component.selectBeneficiary(benefeciary);
      fixture.detectChanges();
      expect(component.selectedBeneficiary).toBe(benefeciary.item);

   });
   it('should handle non matching beneficiary', () => {
      component.myRecipients = [{
         contactCardID: 4,
         contactCardName: 'Zahira Mahomed',
         contactCardDetails: [
            {
               accountType: 'CA', beneficiaryID: 2,
               beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
               bankName: 'NEDBANK', branchCode: '171338',
               beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
               beneficiaryReference: 'Gomac', valid: true
            }],
         contactCardNotifications: [{
            notificationAddress: 'swapnilp@yahoo.com',
            notificationType: 'EMAIL', notificationDefault: true,
            notificationParents: []
         }],
         beneficiaryRecentTransactDetails: []
      }];
      const benefeciary = {
         item: getContactCardData()
      };
      component.selectBeneficiary(benefeciary);
      fixture.detectChanges();
      expect(component.selectedBeneficiary).toBe(benefeciary.item);

   });
   it('should set account type by code', () => {
      const accountTypeCode = 'CA';
      component.setAccountTypeByCode(accountTypeCode);
      expect(component.vm.accountType).toBe(accountTypeCode);
   });

   it('should handle pay to account/mobile click when recipient is picked', () => {
      component.vm.isRecipientPicked = false;
      component.vm.paymentType = PaymentType.account;

      component.onPayToAccountClick();
      expect(component.isAccountPayment()).toBe(true);

      component.vm.paymentType = PaymentType.mobile;

      component.onPayToMobileClick();
      expect(component.isAccountPayment()).toBe(false);
   });

   it('check for no accounts', () => {
      paymentServiceStub.accountsDataObserver.next(null);
   });

   it('should not show bank if step is navigated with bank hidden', () => {
      component.vm.isShowBankName = false;

      component.setShowBank(true);

      expect(component.vm.isShowBankName).toBe(false);
   });

   it('should check whether fields can be editable for non-electrical contact', () => {
      const contactCard = {
         contactCardDetails: [
            {
               accountType: 'CA', beneficiaryID: 2,
               beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
               bankName: 'NEDBANK', branchCode: '171338',
               beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
               beneficiaryReference: 'Gomac', valid: true
            },
            {
               accountType: 'CA', beneficiaryID: 2,
               beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
               bankName: 'Test', branchCode: '001',
               beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
               beneficiaryReference: 'Gomac', valid: true
            }]
      };
      component.isEditableField(contactCard, true);
      expect(component.vm.isReadOnly).toBeTruthy();
   });

   it('should return valid account type by code', () => {
      const accountTypeCode = 'CA';
      const accountType = component.getAccountTypeByCode(accountTypeCode);
      expect(accountType).toBe(Constants.VariableValues.accountTypes.currentAccountType.text);
   });

   it('should handle beneficiary selection for bank approved saved as contact', () => {
      component.handleBeneficiarySelection({
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            cardDetails: getBankApprovedContactData().contactCardDetails[0]
         },
         contactCard: getBankApprovedContactData()
      });
      expect(component.vm.isShowBankName).toBe(false);
   });

   it('should set credit card number', () => {
      paymentService.isMobilePayment = jasmine.createSpy('isMobilePayment').and.returnValue(false);
      paymentService.isAccountPayment = jasmine.createSpy('isAccountPayment').and.returnValue(false);
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.vm.creditCardNumber).toEqual(component.vm.accountNumber);
   });

   it('should set correct account type', () => {
      component.vm.accountTypeName = Constants.VariableValues.accountTypes.creditCardAccountType.text;
      expect(component.displaySelectedAccountType).toBe('Credit Card account');
      component.vm.accountTypeName = '';
      expect(component.displaySelectedAccountType).toBe('Please select');
   });

   it('should set country list from observer', () => {
      paymentServiceStub.countryListObserver.subscribe((countryList) => {
         if (countryList && countryList.length) {
            expect(countryList[0].countryName).toBe(getMockCountryList()[0].countryName);
         }
      });
      paymentServiceStub.countryListObserver.next(getMockCountryList());
   });
   it('should set country iso data', () => {
      const sampleCountry = {
         'countryName': 'BENIN',
         'isoCountry': 'BJ',
         'destinationCountry': 'EBJ',
         'destinationEntity': 'ECOBANK'
      };
      component.onCountryChanged(sampleCountry);
      expect(component.displaySelectedCountry).toBe(sampleCountry.countryName);
   });
   it('should validateBeneficiary in case of cross borderPayment', () => {
      component.vm.paymentType = 4;
      component.vm.isCrossBorderPaymentActive = true;
      component.nextClick(1);
      validateBeneficiarySubject.next({});
      validateBeneficiarySubject.next({
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
      });
      expect(paymentServiceStub.validateBeneficiary).toHaveBeenCalled();
   });
   it('should crossBorder vm on country selection', () => {
      const selected = {
         item: {
            countryName: 'Ghana',
            isCountry: 'GH'
         }
      };
      component.selectCountry(selected);
      expect(component.vm.crossBorderPayment.country.countryName).toBe(selected.item.countryName);
   });
   it('should crossBorder vm on country selection blur', () => {
      const selected = {
         item: {
            countryName: 'Ghana',
            isCountry: 'GH'
         }
      };
      component.blurCountry(selected);
      expect(component.vm.crossBorderPayment.country.countryName).toBe(selected.item.countryName);
      component.blurCountry({});
      expect(component.vm.crossBorderPayment.country.countryName).toBe(null);
   });
   it('should crossBorder vm on country selection blurCountryInput', () => {
      component.noCountryData = true;
      component.blurCountryInput();
      expect(component.vm.crossBorderPayment.country.countryName).toBe(null);
   });

   it('should set onCountryData on noCountryResults', () => {
      component.noCountryData = false;
      component.noCountryResults();
      expect(component.noCountryData).toBe(true);
   });
   it('should click on select branch element after selecting bank', () => {
      const body = document.getElementsByTagName('body')[0];
      const div = <HTMLDivElement>(document.createElement('div'));
      body.appendChild(div);
      component.branchelement = div;
      component.branchelement.setAttribute('id', 'branch');
      component.selectBank({ item: mockBankData });
      expect(component).toBeTruthy();
   });

   it('should call ngOnInit and set category for the banks to popular', () => {
      isEdit = true;
      const emptyBanks = [{ bankCode: '', bankName: null, rTC: true, category: '' },
       { bankCode: '', bankName: null, rTC: true, category: '' }];
      const allbanks = popularBankData.concat(emptyBanks);
      paymentService.getBanks = jasmine.createSpy('getBanks').and.returnValue(Observable.of(allbanks));
      component.ngOnInit();
      fixture.detectChanges();
      const value = component.banks.some(i => i.category === Constants.PopularCategory);
      expect(value).toBeTruthy();
   });


});

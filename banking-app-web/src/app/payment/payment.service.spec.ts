import { TestBed, inject } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { PaymentStep } from './payment.models';
import { PaymentService } from './payment.service';
import { ApiService } from '../core/services/api.service';
import { PayAmountComponent } from './pay-amount/pay-amount.component';
import { PayToModel } from './pay-to/pay-to.model';
import { PayForModel } from './pay-for/pay-for.model';
import { PayAmountModel } from './pay-amount/pay-amount.model';
import { Constants } from '../core/utils/constants';
import { CommonUtility } from '../core/utils/common';

import {
   IBank, IAccountDetail, ILimitDetail, IPaymentDetail, IRemittanceAvailabilityStatus,
   IPaymentMetaData, IPublicHoliday, IBankDefinedBeneficiary, IContactCard
} from './../core/services/models';
import { IWorkflowStep } from '../shared/components/work-flow/work-flow.models';
import { PaymentType } from '../core/utils/enums';
import { AmountTransformPipe } from '../shared/pipes/amount-transform.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { SystemErrorService } from '../core/services/system-services.service';

const amountTransform = new AmountTransformPipe();
const beneficiaryDetails = {
   beneficiaryAccountName: null,
   beneficiaryAccountStatus: null,
   beneficiaryAccountType: null,
   beneficiaryCurrency: null,
   checkReference: null,
   transactionID: null,
};

const testComponent = class { };
const routerTestingParam = [
   { path: 'payment/status', component: testComponent },
];

let _getActiveAccounts, _getActiveCasaAccounts, _getLimits, _getAllBanks, _getAllHolidays, _getAll, _create, _getAvailabilityCheck,
   mockBankData: IBank, mockActiveAccounts: IAccountDetail, mockActiveCasaAccounts: IAccountDetail, mockLimits: ILimitDetail,
   mockPaymentData: IPaymentMetaData, mockPublicHolidayData: IPublicHoliday, mockAvailabilityCheck, _createQuote;

function getMockBankData() {
   return {
      bankCode: '001',
      bankName: 'Test',
      rTC: true,
      universalCode: '100',
      branchCodes: [{
         branchCode: '001',
         branchName: 'Test Branch'
      }]
   };
}

function getActiveAccountsData() {
   return {
      itemAccountId: '1',
      accountNumber: '1001004345',
      productCode: '017',
      productDescription: 'TRANSACTOR',
      isPlastic: false,
      accountType: 'CA',
      nickname: 'TRANS 02',
      sourceSystem: 'Profile System',
      currency: 'ZAR',
      availableBalance: 13268.2,
      currentBalance: 13317.2,
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
   };
}

function getActiveCasaAccountsData() {
   return {
      itemAccountId: '1',
      accountNumber: '1001004345',
      productCode: '017',
      productDescription: 'TRANSACTOR',
      isPlastic: false,
      accountType: 'CA',
      nickname: 'TRANS 02',
      sourceSystem: 'Profile System',
      currency: 'ZAR',
      availableBalance: 13268.2,
      currentBalance: 13317.2,
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
   };
}

function getLimitsData() {
   return {
      limitType: 'payment',
      dailyLimit: 80900,
      userAvailableDailyLimit: 80900,
      maxDailyLimit: 150000,
      isTempLimit: false
   };
}

function getPaymentData() {
   return {
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
                  operationReference: 'BENEFICIARYSAVED',
                  result: 'SAVED_VALID',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   };
}

function getMockPublicHolidayData() {
   return {
      date: '2018-10-10',
      dayName: 'Monday',
      description: 'abc'
   };
}

function getmockAvailabilityCheck() {
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

function setPaymentInfo(service: PaymentService) {
   service.savePayForInfo({
      yourReference: '',
      theirReference: '',
      notificationInput: '',
      notification: {
         name: ''
      },
      crossBorderSmsNotificationInput: '0987654321'
   });

   service.savePayToInfo({
      accountNumber: null,
      creditCardNumber: null,
      paymentType: PaymentType.account,
      bankName: null,
      mobileNumber: null,
      recipientName: null,
      branchName: null,
      bank: {
         bankCode: '12',
         universalCode: 'abc',
         bankName: 'abc',
         rTC: null
      },
      branch: null,
      accountType: null,
      beneficiaryData: {
         bankDefinedBeneficiary: null,
         contactCardDetails: {
            isAccount: true,
            cardDetails: getContactCardData().contactCardDetails[0],
         }
      },
      isCrossBorderAllowed: true,
      isCrossBorderPaymentActive: true,
      crossBorderPayment: {
         country: {
            countryName: 'Kenya',
            code: 'KES'
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
         beneficiaryDetails: beneficiaryDetails
      }
   });

   const selectedAccount = getActiveAccountsData();
   service.savePayAmountInfo({
      selectedAccount: selectedAccount,
      isInstantPay: false,
      selectedCurrency: '',
      allowedTransferLimit: 50000,
      availableTransferLimit: 40000,
      numRecurrence: 10,
      paymentDate: new Date(),
      reccurenceDay: 0,
      recurrenceFrequency: null,
      transferAmount: 200,
      isTransferLimitExceeded: false,
      isValid: true
   });
   service.savePayReviewInfo({
      isSaveBeneficiary: false
   });
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
         }],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      }],
      beneficiaryRecentTransactDetails: []
   };
}

describe('PaymentService', () => {

   beforeEach(() => {
      mockBankData = getMockBankData();
      mockActiveAccounts = getActiveAccountsData();
      mockActiveCasaAccounts = getActiveCasaAccountsData();
      mockLimits = getLimitsData();
      mockPaymentData = getPaymentData();
      mockPublicHolidayData = getMockPublicHolidayData();

      _getActiveAccounts = jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of({ data: [mockActiveAccounts] }));
      _getActiveCasaAccounts = jasmine.createSpy('getActiveCasaAccounts')
         .and.returnValue(Observable.of({ data: [mockActiveCasaAccounts] }));
      _getLimits = jasmine.createSpy('getLimits').and.returnValue(Observable.of({ data: mockLimits }));
      _getAllBanks = jasmine.createSpy('getAllBanks').and.returnValue(Observable.of({ data: [mockBankData] }));
      _create = jasmine.createSpy('create').and.returnValue(Observable.of({ metadata: mockPaymentData }));
      _getAllHolidays = jasmine.createSpy('getAllHolidays').and.returnValue(Observable.of({ data: [mockPublicHolidayData] }));
      _getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: [mockActiveAccounts] }));
      _createQuote = jasmine.createSpy('_createQuote').and.returnValue(Observable.of({ metadata: mockPaymentData }));
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [PaymentService, SystemErrorService,
            {
               provide: ApiService, useValue: {
                  PaymentAccounts: {
                     getAll: _getActiveAccounts
                  },
                  PaymentLimits: {
                     getAll: _getLimits
                  },
                  Limits: {
                     getAll: _getLimits
                  },
                  Banks: {
                     getAll: _getAllBanks
                  },
                  MakeAccountPayment: {
                     create: _create
                  },
                  MakeMobilePayment: {
                     create: _create
                  },
                  PublicHolidays: {
                     getAll: _getAllHolidays
                  },
                  refreshAccounts: {
                     getAll: _getAll
                  },
                  CountryList: {
                     getAll: _getAll
                  },
                  InternationalBeneficiaryAccount: {
                     create: _create
                  },
                  QuoteCalculation: {
                     create: _createQuote
                  }
               }
            }, DatePipe]
      });
   });

   it('should be created', inject([PaymentService, DatePipe], (service: PaymentService) => {
      expect(service).toBeTruthy();
   }));

   it('should be reset model to inital state', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const vm = service.getPayToVm();
      service.clearPayToVm(vm);
      expect(service).toBeTruthy();
   }));

   it('should initialize the payment workflow models when initializePaymentWorkflow is called', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         expect(service.getPayToVm()).toBeDefined();
         expect(service.getPayAmountVm()).toBeDefined();
         expect(service.getPayForVm()).toBeDefined();
         expect(service.getPayReviewVm()).toBeDefined();
      }));

   it('should mark the PayTo step navigated when pay to info is Saved', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         service.savePayToInfo({
            creditCardNumber: null,
            accountNumber: null,
            paymentType: PaymentType.mobile,
            bankName: null,
            mobileNumber: null,
            recipientName: null,
            branchName: null,
            branch: {
               branchCode: 'ABCD',
               branchName: 'abc'
            },
            accountType: null,
            isCrossBorderAllowed: true,
            isCrossBorderPaymentActive: true,
            crossBorderPayment: {
               country: {
                  countryName: 'Kenya',
                  code: 'KES'
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
                  beneficiaryAccountStatus: null,
                  beneficiaryAccountType: null,
                  beneficiaryCurrency: null,
                  checkReference: null,
                  transactionID: null,
               }
            }
         });
         expect(service.getStepSummary(PaymentStep.payTo, true)).toBeTruthy();
      }));

   it('should mark the PayFor step navigated when pay for info is Saved', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         service.savePayForInfo({
            notificationInput: null,
            theirReference: null,
            yourReference: null,
            notification: null
         });
         expect(service.getStepSummary(PaymentStep.payFor, false).isNavigated).toBeTruthy();
      }));

   it('should mark the PayAmount step navigated when amount info is Saved with reccurence', inject([PaymentService],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         service.savePayAmountInfo({
            allowedTransferLimit: 0,
            availableTransferLimit: 0,
            isInstantPay: false,
            isTransferLimitExceeded: false,
            isValid: true,
            selectedAccount: getActiveAccountsData(),
            transferAmount: 0,
            numRecurrence: 12,
            paymentDate: new Date(),
            reccurenceDay: 2,
            recurrenceFrequency: 'Weekly'
         });
         expect(service.getStepSummary(PaymentStep.payAmount, false).isNavigated).toBeTruthy();
      }));

   it('should mark the PayAmount step navigated when amount info is Saved without recurrence', inject([PaymentService],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         service.savePayAmountInfo({
            allowedTransferLimit: 0,
            availableTransferLimit: 0,
            isInstantPay: false,
            isTransferLimitExceeded: false,
            isValid: true,
            selectedAccount: getActiveAccountsData(),
            transferAmount: 0,
            numRecurrence: null,
            paymentDate: new Date(),
            reccurenceDay: 0,
            recurrenceFrequency: null
         });
         expect(service.getStepSummary(PaymentStep.payAmount, false).isNavigated).toBeTruthy();
      }));

   it('should get payment limits', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.getPaymentLimits().subscribe(limit => {
      });
      expect(_getLimits).toHaveBeenCalled();
   }));

   it('should make payment with validate true', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      setPaymentInfo(service);

      let payToInfo = service.getPayToVm();
      payToInfo.beneficiaryData = {
         bankDefinedBeneficiary: getBankApprovedData(),
         contactCardDetails: null
      };
      payToInfo.mobileNumber = '999999999';
      payToInfo.paymentType = PaymentType.mobile;
      service.savePayToInfo(payToInfo);
      service.savePayReviewInfo({
         isSaveBeneficiary: true
      });
      service.makePayment().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPaymentData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();

      payToInfo.recipientName = getBankApprovedData().bDFName;
      service.savePayToInfo(payToInfo);
      service.makePayment().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPaymentData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();

      payToInfo = service.getPayToVm();
      payToInfo.paymentType = 0;
      payToInfo.creditCardNumber = '999999999';
      service.savePayToInfo(payToInfo);
      expect(service.makePayment()).toBeUndefined();
   }));

   it('should make payment with validate false', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      setPaymentInfo(service);
      const payForInfo = service.getPayForVm();
      payForInfo.notification.name = Constants.notificationTypes.none;
      service.savePayForInfo(payForInfo);
      service.makePayment(false);
      service.makePayment().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPaymentData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();
      service.makePayment(false).subscribe((data) => {
      });
      const payToInfo = service.getPayToVm();
      payToInfo.recipientName = payToInfo.beneficiaryData.contactCardDetails.cardDetails.beneficiaryName;
      service.savePayToInfo(payToInfo);
      service.makePayment(false);
      service.makePayment().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPaymentData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();

   }));

   it('should make payment for weekly recurrence', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      setPaymentInfo(service);

      // get payment amount vm & modify payment frequency
      const paymentAmountVm = service.getPayAmountVm();
      paymentAmountVm.recurrenceFrequency = Constants.VariableValues.paymentRecurrenceFrequency.weekly.code;
      service.savePayAmountInfo(paymentAmountVm);

      service.makePayment(false);
      service.makePayment().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPaymentData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();
   }));



   it('should check payment recurrence sub frequncy to be correctly generated',
      inject([PaymentService, DatePipe], (service: PaymentService) => {
         expect(function () {
            service.getPaymentRecurrenceSubFrequency(null, new Date());
         }).toThrowError();

         let paymentDate = new Date(2018, 0, 8);
         let recurrenceSubFrequency =
            service.getPaymentRecurrenceSubFrequency(Constants.VariableValues.paymentRecurrenceFrequency.monthly.code, paymentDate);
         expect(recurrenceSubFrequency).toBe('8');

         paymentDate = new Date(2018, 0, 8);
         recurrenceSubFrequency =
            service.getPaymentRecurrenceSubFrequency(Constants.VariableValues.paymentRecurrenceFrequency.weekly.code, paymentDate);
         expect(recurrenceSubFrequency).toBe('2');
      }));



   it('should make payment for monthly recurrence', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      setPaymentInfo(service);

      // get payment amount vm & modify payment frequency
      const paymentAmountVm = service.getPayAmountVm();
      paymentAmountVm.recurrenceFrequency = Constants.VariableValues.paymentRecurrenceFrequency.monthly.code;
      service.savePayAmountInfo(paymentAmountVm);

      service.makePayment(false);
      service.makePayment().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPaymentData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();
   }));

   it('should mark the PayReview step navigated when pay to info is Saved', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         service.savePayReviewInfo({
            isSaveBeneficiary: false
         });
         expect(service.getStepSummary(PaymentStep.review, true).isNavigated).toBeTruthy();
      }));

   it('should return empty step when no matching step is found', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         expect(service.getStepSummary.bind(service)).toThrowError('no matching step found!');
      }));

   it('should update transaction ID', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         setPaymentInfo(service);
         service.getPaymentDetailInfo();
         service.updateTransactionID('1234');
         expect(service.getPaymentDetailInfo().transactionID).toEqual('1234');
      }));
   it('should update execEngineRef', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         setPaymentInfo(service);
         service.getPaymentDetailInfo();
         service.updateexecEngineRef('1234/Test/number');
         expect(service.getPaymentDetailInfo().execEngineRef).toEqual('1234/Test/number');
      }));
   it('should payment details for foreign payment', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         setPaymentInfo(service);
         const payToModel = service.getPayToVm();
         payToModel.paymentType = PaymentType.foreignBank;
         const payAmountModel = service.getPayAmountVm();
         const PayForModel = service.getPayForVm();
         PayForModel.paymentReason = { name: '401', code: '401' };
         payAmountModel.transferAmount = 50;
         payAmountModel.selectedAccount = getActiveAccountsData();
         payAmountModel.paymentExchangeRate = '1';
         service.savePayToInfo(payToModel);
         service.savePayAmountInfo(payAmountModel);
         service.savePayForInfo(PayForModel);
         expect(service.getPaymentDetailInfo().remittanceInstruction).toBeTruthy();
      }));

   it('should return true for transaction success', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         const metadata = {
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
         };
         const result = service.isPaymentStatusValid(metadata);
         expect(result).toEqual(true);
      }));

   it('should return false for transaction failure', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         setPaymentInfo(service);
         const metadata = {
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
         };
         const result = service.isPaymentStatusValid(metadata);
         service.errorMessage = metadata.resultData[0].resultDetail[0].reason;
         expect(service.errorMessage).toBeDefined();
         expect(result).toEqual(false);
      }));

   it('should return false for invalid metadata', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         const metadata = {
            resultData: []
         };
         const result = service.isPaymentStatusValid(metadata);
         expect(result).toEqual(false);
      }));

   it('should return true for transaction success', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         const metadata = {
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
         };
         const result = service.isPaymentStatusValid(metadata);
         expect(result).toEqual(true);
      }));

   it('should return true for partial transaction success', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         const metadata = {
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
         const result = service.isPaymentPartialSuccess(metadata);
         expect(result).toEqual(true);
      }));

   it('should return false for partial transaction success', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         const metadata = {
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
         };
         const result = service.isPaymentPartialSuccess(metadata);
         expect(result).toEqual(false);
      }));
   it('should get account details', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.getActiveAccounts().subscribe(accounts => {
         const _account = accounts[0];
         expect(_account.itemAccountId).toEqual(mockActiveAccounts.itemAccountId);
         expect(_account.accountNumber).toEqual(mockActiveAccounts.accountNumber);
         expect(_account.productCode).toEqual(mockActiveAccounts.productCode);
         expect(_account.productDescription).toEqual(mockActiveAccounts.productDescription);
      });
      expect(_getActiveAccounts).toHaveBeenCalled();
   }));

   it('should get casa account details', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.getActiveCasaAccounts().subscribe(accounts => {
         const _account = accounts[0];
         expect(_account.itemAccountId).toEqual(mockActiveCasaAccounts.itemAccountId);
         expect(_account.accountNumber).toEqual(mockActiveCasaAccounts.accountNumber);
         expect(_account.productCode).toEqual(mockActiveCasaAccounts.productCode);
         expect(_account.productDescription).toEqual(mockActiveCasaAccounts.productDescription);
      });
      expect(_getActiveAccounts).toHaveBeenCalled();
   }));

   it('should get bank details', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.getBanks().subscribe(banks => {
         const _bank = banks[0];
         expect(_bank.bankCode).toEqual(mockBankData.bankCode);
         expect(_bank.bankName).toEqual(mockBankData.bankName);
         expect(_bank.rTC).toEqual(mockBankData.rTC);
         expect(_bank.universalCode).toEqual(mockBankData.universalCode);
         expect(_bank.branchCodes.length).toEqual(mockBankData.branchCodes.length);
         expect(_bank.branchCodes[0].branchCode).toEqual(mockBankData.branchCodes[0].branchCode);
         expect(_bank.branchCodes[0].branchName).toEqual(mockBankData.branchCodes[0].branchName);
      });
      expect(_getAllBanks).toHaveBeenCalled();
   }));

   it('should not allow navigation to payment status page', inject([PaymentService, DatePipe], (service: PaymentService) => {
      expect(service.isPaymentStatusNavigationAllowed()).toBeUndefined();
   }));

   it('should not allow navigation to payment status page', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      expect(service.isPaymentStatusNavigationAllowed()).toBe(false);
   }));

   it('should allow navigation to payment status page', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      service.savePayReviewInfo({
         isSaveBeneficiary: false
      });
      expect(service.isPaymentStatusNavigationAllowed()).toBe(true);
   }));

   it('should clear payment details', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      setPaymentInfo(service);
      service.clearPaymentDetails();
      expect(service.isPaymentSuccessful).toBeFalsy();
   }));

   it('should expect an error if wrong step number is passed to get step summary', inject([PaymentService],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         expect(function () {
            service.getStepSummary(-1, true);
         }).toThrow();
      }
   ));

   it('should get step default title information', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const currentStep: IWorkflowStep = {
         summary: {
            isNavigated: false,
            sequenceId: 2,
            title: null
         },
         buttons: {
            next: {
               text: null
            },
            edit: {
               text: null
            }
         },
         component: PayAmountComponent
      };
      service.getStepInitialInfo(currentStep);
      expect(currentStep.summary.title).toBeDefined();
   }));
   it('should get step updated title information', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const currentStep: IWorkflowStep = {
         summary: {
            isNavigated: false,
            sequenceId: 2,
            title: null
         },
         buttons: {
            next: {
               text: null
            },
            edit: {
               text: null
            }
         },
         component: PayAmountComponent
      };
      service.getStepInfo(currentStep);
      expect(currentStep.summary.title).toBeDefined();
   }));
   it('should get step default title information for pay to step', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const currentStep = service.getStepSummary(PaymentStep.payTo, true);
      service.paymentWorkflowSteps.payTo.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));
   it('should get step default title information for pay for step', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const currentStep = service.getStepSummary(PaymentStep.payFor, true);
      service.paymentWorkflowSteps.payFor.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));
   it('should get step default title information for pay amount step', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const currentStep = service.getStepSummary(PaymentStep.payAmount, true);
      service.paymentWorkflowSteps.payAmount.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));
   it('should get step default title information for pay review step', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const currentStep = service.getStepSummary(PaymentStep.review, true);
      service.paymentWorkflowSteps.payReview.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));

   it('should get step new title information for pay to step', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const payToModel = new PayToModel();
      payToModel.recipientName = 'Sample recipent';
      payToModel.accountNumber = '1111';
      payToModel.bankName = 'Sample Bank';
      service.initializePaymentWorkflow();
      service.paymentWorkflowSteps.payTo.model = payToModel;
      service.paymentWorkflowSteps.payTo.isNavigated = true;
      payToModel.isShowBankName = true;
      payToModel.paymentType = PaymentType.account;
      let currentSummary = service.getStepSummary(PaymentStep.payTo, false);
      let expectedTitle = `You are paying ${payToModel.recipientName} ${payToModel.bankName} - ${payToModel.accountNumber}`;
      expect(currentSummary.title).toEqual(expectedTitle);

      payToModel.bankName = null;
      payToModel.isShowBankName = false;
      currentSummary = service.getStepSummary(PaymentStep.payTo, false);
      expectedTitle = `You are paying ${payToModel.recipientName}`;
      expect(currentSummary.title).toEqual(expectedTitle);

      payToModel.bankName = null;
      payToModel.isShowBankName = true;
      currentSummary = service.getStepSummary(PaymentStep.payTo, false);
      expectedTitle = `You are paying ${payToModel.recipientName} - ${payToModel.accountNumber}`;
      expect(currentSummary.title).toEqual(expectedTitle);

      payToModel.accountNumber = null;
      currentSummary = service.getStepSummary(PaymentStep.payTo, false);
      expectedTitle = `You are paying ${payToModel.recipientName}`;
      expect(currentSummary.title).toEqual(expectedTitle);

      payToModel.paymentType = PaymentType.mobile;
      payToModel.accountNumber = null;
      payToModel.mobileNumber = '989221129';
      currentSummary = service.getStepSummary(PaymentStep.payTo, false);
      expectedTitle = `You are paying ${payToModel.recipientName} - ${payToModel.mobileNumber}`;
      expect(currentSummary.title).toEqual(expectedTitle);

      payToModel.paymentType = PaymentType.foreignBank;
      payToModel.foreignBeneficiaryName = 'Jason';
      payToModel.country = 'GN';
      payToModel.countryDispalyName = 'GHANA';
      payToModel.recipientCityVillage = 'Village';
      currentSummary = service.getStepSummary(PaymentStep.payTo, false);
      expectedTitle = `You are paying Jason in GHANA in Village`;
      expect(currentSummary.title).toEqual(expectedTitle);

      payToModel.paymentType = 6;
      payToModel.creditCardNumber = '1234 1234 1234';
      currentSummary = service.getStepSummary(PaymentStep.payTo, false);
      expectedTitle = `You are paying Sample recipent - 1234 1234 1234`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   it('should get step new title information for pay amount step', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const payAmountModel = new PayAmountModel();
      payAmountModel.transferAmount = 5000;
      payAmountModel.selectedAccount = getActiveAccountsData();
      service.paymentWorkflowSteps.payAmount.model = payAmountModel;
      service.paymentWorkflowSteps.payAmount.isNavigated = true;
      let currentSummary = service.getStepSummary(PaymentStep.payAmount, false);
      currentSummary = service.getStepSummary(PaymentStep.payAmount, false);
      const accountTypeNickName = payAmountModel.selectedAccount.nickname;
      const amount = amountTransform.transform(payAmountModel.transferAmount + '');
      const expectedTitle = `Pay ${amount} from my account-` +
         `${accountTypeNickName} ${CommonUtility.getDateString(payAmountModel.paymentDate)}`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));

   it('should get step new title information for pay amount step', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const payAmountModel = new PayAmountModel();
      const currentDate = new Date();
      payAmountModel.transferAmount = 5000;
      payAmountModel.selectedAccount = getActiveAccountsData();
      service.paymentWorkflowSteps.payAmount.model = payAmountModel;
      service.paymentWorkflowSteps.payAmount.isNavigated = true;
      payAmountModel.paymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      let currentSummary = service.getStepSummary(PaymentStep.payAmount, false);
      currentSummary = service.getStepSummary(PaymentStep.payAmount, false);
      const accountTypeNickName = payAmountModel.selectedAccount.nickname;
      const amount = amountTransform.transform(payAmountModel.transferAmount + '');
      const expectedTitle = `Pay ${amount} from my account-` +
         `${accountTypeNickName} on  `;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));

   it('should get step new title information for pay for step', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const payForModel = new PayForModel();
      payForModel.yourReference = 'aaaaa';
      payForModel.theirReference = 'bbbbb';
      payForModel.notification = {};
      payForModel.notification.name = 'SMS';
      payForModel.notificationInput = '98127394121';
      service.paymentWorkflowSteps.payFor.model = payForModel;
      service.paymentWorkflowSteps.payFor.isNavigated = true;
      let currentSummary = service.getStepSummary(PaymentStep.payFor, false);
      currentSummary = service.getStepSummary(PaymentStep.payFor, false);
      let expectedTitle = `Your reference: ${payForModel.yourReference} | Their reference: ${payForModel.theirReference}`;
      expectedTitle += `. Send notification by ${payForModel.notification.name.toLowerCase()}`;
      expectedTitle += ` to ${payForModel.notificationInput.toLowerCase()}`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   it('should get step new title information for pay amount with crossborder payment',
      inject([PaymentService], (service: PaymentService) => {
         service.initializePaymentWorkflow();
         const payAmountModel = new PayAmountModel();
         const payToVm = service.getPayToVm();
         payToVm.isCrossBorderPaymentActive = true;
         service.savePayToInfo(payToVm);
         payAmountModel.transferAmount = 50;
         payAmountModel.selectedAccount = getActiveAccountsData();
         payAmountModel.crossBorderPaymentAmount = 55;
         payAmountModel.beneficiaryCurrency = 'GHS';
         payAmountModel.beneficiaryAmount = '124.4';
         payAmountModel.totalPaymentAmount = '160';
         service.paymentWorkflowSteps.payAmount.model = payAmountModel;
         service.paymentWorkflowSteps.payAmount.isNavigated = true;
         const currentDate = new Date();
         payAmountModel.paymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
         let currentSummary = service.getStepSummary(PaymentStep.payAmount, false);
         currentSummary = service.getStepSummary(PaymentStep.payAmount, false);
         const amount = amountTransform.transform(payAmountModel.transferAmount + '');
         const crossBorderPaymentAmount = amountTransform.transform(payAmountModel.crossBorderPaymentAmount + '');
         const expectedTitle = `You have chosen to pay GHS 124.4 (R160)`;
         expect(currentSummary.title).toEqual(expectedTitle);
         service.paymentWorkflowSteps.payAmount.isNavigated = false;
         const currentSummaryDefault = service.getStepSummary(PaymentStep.payAmount, true);
         const defaultExpectedTitle = Constants.labels.payAmountCrossPaymentTitle;
         expect(currentSummaryDefault.title).toEqual(defaultExpectedTitle);
      }));

   it('should handle mobile payment', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      service.handleMobilePayment();
      const payForModel = service.paymentWorkflowSteps.payFor.model.getViewModel();
      expect(payForModel.theirReference).toEqual('');
   }));

   it('should make payment with validate true and selected branch', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      service.savePayForInfo({
         yourReference: '',
         theirReference: '',
         notificationInput: '',
         notification: {
            name: ''
         }
      });

      const selectedAccount = getActiveAccountsData();
      service.savePayAmountInfo({
         selectedAccount: selectedAccount,
         isInstantPay: false,
         allowedTransferLimit: 50000,
         availableTransferLimit: 40000,
         numRecurrence: 0,
         paymentDate: new Date(),
         reccurenceDay: 1,
         recurrenceFrequency: null,
         transferAmount: 200,
         isTransferLimitExceeded: false,
         isValid: true
      });
      service.savePayToInfo({
         accountNumber: null,
         paymentType: PaymentType.account,
         bankName: 'nedbank',
         mobileNumber: '123',
         recipientName: null,
         branchName: null,
         bank: null,
         branch: {
            branchCode: '1243',
            branchName: '123'
         },
         accountType: 'CA',
         creditCardNumber: null,
         isCrossBorderAllowed: true,
         isCrossBorderPaymentActive: true,
         crossBorderPayment: {
            country: {
               countryName: 'Kenya',
               code: 'KES'
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
               beneficiaryAccountStatus: null,
               beneficiaryAccountType: null,
               beneficiaryCurrency: null,
               checkReference: null,
               transactionID: null,
            }
         }
      });
      service.savePayReviewInfo({
         isSaveBeneficiary: true
      });
      expect(service.getPaymentDetailInfo().toAccount.accountType).toBe('CA');
      service.makePayment().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPaymentData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();
   }));

   it('should make payment with validate true and recurrence is weekly and selected branch',
      inject([PaymentService, DatePipe], (service: PaymentService) => {
         service.initializePaymentWorkflow();
         service.savePayForInfo({
            yourReference: '',
            theirReference: '',
            notificationInput: '',
            notification: {
               name: ''
            }
         });

         const selectedAccount = getActiveAccountsData();
         service.savePayAmountInfo({
            selectedAccount: selectedAccount,
            isInstantPay: false,
            allowedTransferLimit: 50000,
            availableTransferLimit: 40000,
            numRecurrence: 0,
            paymentDate: new Date(),
            reccurenceDay: 1,
            repeatType: 'endDate',
            recurrenceFrequency: 'Weekly',
            transferAmount: 200,
            isTransferLimitExceeded: false,
            isValid: true
         });
         service.savePayToInfo({
            accountNumber: null,
            paymentType: PaymentType.account,
            bankName: 'nedbank',
            mobileNumber: '123',
            recipientName: null,
            branchName: null,
            bank: null,
            branch: {
               branchCode: '1243',
               branchName: '123'
            },
            accountType: 'CA',
            creditCardNumber: null,
            isCrossBorderAllowed: true,
            isCrossBorderPaymentActive: true,
            crossBorderPayment: {
               country: {
                  countryName: 'Kenya',
                  code: 'KES'
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
                  beneficiaryAccountStatus: null,
                  beneficiaryAccountType: null,
                  beneficiaryCurrency: null,
                  checkReference: null,
                  transactionID: null,
               }
            }
         });
         service.savePayReviewInfo({
            isSaveBeneficiary: true
         });
         expect(service.getPaymentDetailInfo().toAccount.accountType).toBe('CA');
         service.makePayment().subscribe((data) => {
            expect(data.resultData[0].resultDetail).toEqual(mockPaymentData.resultData[0].resultDetail);
         });
         expect(_create).toHaveBeenCalled();
      }));
   it('should return payment status', inject([PaymentService], (service: PaymentService) => {
      expect(service.getPaymentStatus()).toEqual(false);
   }));
   it('should check if any payment step is dirty', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      service.paymentWorkflowSteps.payTo.isDirty = true;
      service.paymentWorkflowSteps.payAmount.isDirty = true;
      service.paymentWorkflowSteps.payFor.isDirty = true;
      service.paymentWorkflowSteps.payReview.isDirty = true;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(false);
   }));
   it('should check if any payment step is dirty', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      service.paymentWorkflowSteps.payTo.isDirty = false;
      service.paymentWorkflowSteps.payAmount.isDirty = true;
      service.paymentWorkflowSteps.payFor.isDirty = true;
      service.paymentWorkflowSteps.payReview.isDirty = true;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(false);
   }));
   it('should check if any payment step is dirty', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      service.paymentWorkflowSteps.payTo.isDirty = false;
      service.paymentWorkflowSteps.payAmount.isDirty = false;
      service.paymentWorkflowSteps.payFor.isDirty = true;
      service.paymentWorkflowSteps.payReview.isDirty = true;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(false);
   }));
   it('should check if any payment step is dirty', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      service.paymentWorkflowSteps.payTo.isDirty = true;
      service.paymentWorkflowSteps.payAmount.isDirty = false;
      service.paymentWorkflowSteps.payFor.isDirty = false;
      service.paymentWorkflowSteps.payReview.isDirty = false;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(true);
   }));
   it('should check for account type as payment type', inject([PaymentService], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      service.paymentWorkflowSteps.payTo.model.paymentType = 1;
      expect(service.isAccountPayment()).toBe(true);
   }));

   it('should get public holiday details', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.getPublicHolidays().subscribe(holidays => {
         const holiday = holidays[0];
         expect(holiday.date).toEqual(mockPublicHolidayData.date);
         expect(holiday.description).toEqual(mockPublicHolidayData.description);
         expect(holiday.dayName).toEqual(mockPublicHolidayData.dayName);
      });
      expect(_getAllHolidays).toHaveBeenCalled();
   }));

   it('should check for mobile payment', inject([PaymentService, DatePipe], (service: PaymentService) => {
      service.initializePaymentWorkflow();
      const isMobPayment = service.isMobilePayment();
      service.savePayForInfo({
         yourReference: '',
         theirReference: '',
         notificationInput: '',
         notification: {
            name: ''
         }
      });

      const selectedAccount = getActiveAccountsData();
      service.savePayAmountInfo({
         selectedAccount: selectedAccount,
         isInstantPay: false,
         allowedTransferLimit: 50000,
         availableTransferLimit: 40000,
         numRecurrence: 0,
         paymentDate: new Date(),
         reccurenceDay: 1,
         recurrenceFrequency: null,
         transferAmount: 200,
         isTransferLimitExceeded: false,
         isValid: true
      });
      service.savePayToInfo({
         accountNumber: null,
         paymentType: PaymentType.mobile,
         bankName: 'nedbank',
         mobileNumber: '123',
         recipientName: null,
         branchName: null,
         bank: null,
         branch: {
            branchCode: '1243',
            branchName: '123'
         },
         accountType: 'CA',
         creditCardNumber: null,
         isCrossBorderAllowed: true,
         isCrossBorderPaymentActive: true,
         crossBorderPayment: {
            country: {
               countryName: 'Kenya',
               code: 'KES'
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
            beneficiaryDetails: beneficiaryDetails
         }
      });
      service.savePayReviewInfo({
         isSaveBeneficiary: true
      });
      expect(isMobPayment).toBe(false);
      service.makePayment(false).subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPaymentData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();
   }));

   it('should be able to reset data on recipient selection', inject([PaymentService],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         let payToVm = service.getPayToVm();
         payToVm.bankName = 'Test';
         service.savePayToInfo(payToVm);

         let payForVm = service.getPayForVm();
         payForVm.yourReference = 'TestReference';
         service.savePayForInfo(payForVm);

         service.resetDataOnRecipientSelection();

         payToVm = service.getPayToVm();
         expect(payToVm.bankName).toBe(undefined);

         payForVm = service.getPayForVm();
         expect(payForVm.yourReference).toBe(undefined);
      }
   ));

   it('should be able to reset data on recipient selection if payfor is navigated', inject([PaymentService],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         const payToVm = service.getPayToVm();
         payToVm.bankName = 'Test';
         service.savePayToInfo(payToVm);

         const payForVm = service.getPayForVm();
         payForVm.yourReference = 'TestReference';
         service.savePayForInfo(payForVm);
         service.paymentWorkflowSteps.payFor.isNavigated = false;

         service.resetDataOnRecipientSelection();

         expect(payForVm.yourReference).toBe('TestReference');
      }
   ));

   it('should update Save Beneficiary false flag', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         setPaymentInfo(service);
         const payToVm = service.getPayToVm();
         payToVm.isRecipientPicked = true;
         service.savePayToInfo(payToVm);

         const payReviewVm = service.getPayReviewVm();
         service.getPaymentDetailInfo();
         expect(service.getPaymentDetailInfo().saveBeneficiary).toEqual(false);
      }));

   it('should update Save Beneficiary true flag', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         setPaymentInfo(service);
         const payToVm = service.getPayToVm();
         payToVm.isRecipientPicked = false;
         service.savePayToInfo(payToVm);

         service.getPaymentDetailInfo();
         expect(service.getPaymentDetailInfo().saveBeneficiary).toEqual(false);
      }));

   it('should check for Benificiary error', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         service.isBeneficiarySaved(null);
         expect(service.errorMessage).toBeUndefined();
         service.isBeneficiarySaved({ metadata: mockPaymentData });
         expect(service.errorMessage).toBeUndefined();
         const data = { metadata: mockPaymentData };
         data.metadata.resultData[0].resultDetail.splice(1, 1);
         service.isBeneficiarySaved(data);
         expect(service.errorMessage).toBe(Constants.labels.BenificiaryErrorMsg);
      }));
   it('should call api refresh accounts',
      inject([PaymentService], (service: PaymentService) => {
         service.refreshAccounts();
      }));
   it('should call api getQuote accounts',
      inject([PaymentService], (service: PaymentService) => {
         service.calculateQuote({ transactionID: 'abs-sdf' }).subscribe(res => {
            expect(_createQuote).toHaveBeenCalled();
         });
      }));
   it('should validate benficairy accounts',
      inject([PaymentService], (service: PaymentService) => {
         service.validateBeneficiary({}).subscribe(res => {
            expect(_create).toHaveBeenCalled();
         });
      }));
});


describe('PaymentService - Error handling scenarios', () => {

   beforeEach(() => {
      mockBankData = getMockBankData();
      mockActiveAccounts = getActiveAccountsData();
      mockLimits = getLimitsData();
      mockPaymentData = getPaymentData();
      mockPublicHolidayData = getMockPublicHolidayData();
      mockAvailabilityCheck = getmockAvailabilityCheck();

      _getActiveAccounts = jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of(null));
      _getLimits = jasmine.createSpy('getLimits').and.returnValue(Observable.of({ data: mockLimits }));
      _getAllBanks = jasmine.createSpy('getAllBanks').and.returnValue(Observable.of({ data: [mockBankData] }));
      _create = jasmine.createSpy('create').and.returnValue(Observable.of({ metadata: mockPaymentData }));
      _getAllHolidays = jasmine.createSpy('getAllHolidays').and.returnValue(Observable.of({ data: [mockPublicHolidayData] }));
      _getAvailabilityCheck = jasmine.createSpy('checkRemittanceAvailability').and.
         returnValue(Observable.of({ data: [mockAvailabilityCheck] }));

      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [PaymentService, SystemErrorService,
            {
               provide: ApiService, useValue: {
                  PaymentAccounts: {
                     getAll: _getActiveAccounts
                  },
                  PaymentLimits: {
                     getAll: _getLimits
                  },
                  Limits: {
                     getAll: _getLimits
                  },
                  Banks: {
                     getAll: _getAllBanks
                  },
                  MakeAccountPayment: {
                     create: _create
                  },
                  MakeMobilePayment: {
                     create: _create
                  },
                  PublicHolidays: {
                     getAll: _getAllHolidays
                  },
                  CountryList: {
                     getAll: _getAll
                  },
                  RemittanceAvailabilityCheck: {
                     getAll: _getAvailabilityCheck
                  }
               }
            }, DatePipe]
      });
   });

   it('should handle response for no conent for active accounts',
      inject([PaymentService, DatePipe], (service: PaymentService) => {
         service.getActiveAccounts().subscribe(response => {
            expect(response.length).toBe(0);
         });
      }));

   it('should handle response for remittance availability',
      inject([PaymentService], (service: PaymentService) => {
         service.checkRemittanceAvailability().subscribe(response => {
            expect(_getAvailabilityCheck).toHaveBeenCalled();
         });
      }));

   it('should reset models on resetPaymentModels',
      inject([PaymentService, DatePipe], (service: PaymentService) => {
         service.initializePaymentWorkflow();
         const payAmountModel = new PayAmountModel();
         payAmountModel.allowedTransferLimit = 100;
         service.paymentWorkflowSteps.payAmount.model = payAmountModel;

         const payToInfo = service.getPayToVm();
         payToInfo.mobileNumber = '999999999';
         service.savePayToInfo(payToInfo);

         const payForModel = new PayForModel();
         payForModel.yourReference = 'aaaaa';
         service.paymentWorkflowSteps.payFor.model = payForModel;

         service.resetPaymentModels();
         expect(service.paymentWorkflowSteps.payAmount.model.allowedTransferLimit).toBeUndefined();
         expect(service.paymentWorkflowSteps.payFor.model.yourReference).toBeUndefined();
         expect(service.paymentWorkflowSteps.payTo.model.mobileNumber).toBeUndefined();

      }));
});


describe('PaymentService', () => {

   beforeEach(() => {
      const NoContentResponse = jasmine.createSpy('getAll').and.returnValue(Observable.of(null));

      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [PaymentService, SystemErrorService,
            {
               provide: ApiService, useValue: {
                  PaymentAccounts: {
                     getAll: NoContentResponse
                  },
                  PaymentLimits: {
                     getAll: NoContentResponse
                  },
                  Limits: {
                     getAll: NoContentResponse
                  },
                  Banks: {
                     getAll: NoContentResponse
                  },
                  PublicHolidays: {
                     getAll: NoContentResponse
                  },
                  CountryList: {
                     getAll: _getAll
                  },
               }
            }, DatePipe]
      });
   });
   it('should handle response for no conent for active accounts',
      inject([PaymentService, DatePipe], (service: PaymentService) => {
         service.getActiveAccounts().subscribe(response => {
            expect(response.length).toBe(0);
         });
      }));
   it('should handle response for no conent for banks',
      inject([PaymentService, DatePipe], (service: PaymentService) => {
         service.getBanks().subscribe(response => {
            expect(response.length).toBe(0);
         });
      }));
   it('should handle response for no conent for PublicHolidays',
      inject([PaymentService, DatePipe], (service: PaymentService) => {
         service.getPublicHolidays().subscribe(response => {
            expect(response.length).toBe(0);
         });
      }));

   it('should handle response for no conent for Limits',
      inject([PaymentService, DatePipe], (service: PaymentService) => {
         service.getPaymentLimits().subscribe(response => {
            expect(response.length).toBe(0);
         });
      }));
   it('should refresh accounts',
      inject([PaymentService], (service: PaymentService) => {
         service.refreshAccountData();
         expect(service.accountsDataObserver.count.length).toBe(1);
      }));
   it('should set payment notice in case of success payment', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         const metadata = {
            resultData: [
               {
                  resultDetail: [
                     {
                        operationReference: 'TRANSACTION',
                        result: 'R00',
                        status: 'SUCCESS',
                        reason: 'Some reason coming'
                     }
                  ]
               }
            ]
         };
         const result = service.isPaymentStatusValid(metadata);
         expect(service.paymentNotice).toEqual('Some reason coming');
      }));
   it('should check notification is a type of array', inject([PaymentService, DatePipe],
      (service: PaymentService) => {
         service.initializePaymentWorkflow();
         setPaymentInfo(service);
         const paymentInfo: IPaymentDetail = service.getPaymentDetailInfo();
         expect(paymentInfo.notificationDetails instanceof Array).toBeTruthy();
      }));

   it('should correctly create GUID', inject([PaymentService],
      (service: PaymentService) => {
         service.paymentGUID = '';
         service.createGUID();
         expect(service.paymentGUID).not.toBe('');
      }));

   it('should enable API Failure flag', inject([PaymentService],
      (service: PaymentService) => {
         service.isAPIFailure = false;
         service.raiseSystemErrorforAPIFailure(Constants.routeUrls.paymentStatus);
         expect(service.isAPIFailure).toBeTruthy();
      }));
});


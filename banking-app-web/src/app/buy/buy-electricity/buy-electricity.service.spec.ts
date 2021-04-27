import { Constants } from './../../core/utils/constants';
import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';

import { BuyElectricityService } from './buy-electricity.service';
import { BuyElectricityToComponent } from './buy-electricity-to/buy-electricity-to.component';
import { ApiService } from '../../core/services/api.service';
import { BuyElectricityStep, IBuyElectricityToVm } from './buy-electricity.models';
import { CommonUtility } from './../../core/utils/common';
import { BuyElectricityAmountModel } from './buy-electricity-amount/buy-electricity-amount.model';
import {
   IBuyElectricityAccountDetail, IBuyElectricityLimitDetail,
   IBuyElectricityMeterValidationDetails
} from './../../core/services/models';
import { IWorkflowStep } from '../../shared/components/work-flow/work-flow.models';
import { IServiceProvider, IAccountDetail } from '../../core/services/models';
import { BuyElectricityForModel } from './buy-electricity-for/buy-electricity-for.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { SystemErrorService } from '../../core/services/system-services.service';
import { RouterTestingModule } from '@angular/router/testing';

const amountTransform = new AmountTransformPipe();
let _getActiveAccounts, _getPrepaidLimit, _buyElectricityMeterValidation, _buyElectricityTshwanMeterDetails,
   _makeElectricityPayment,
   _prepaidStatus, _outOfBandOtpStatus,
   mockElectricityLimitData: IBuyElectricityLimitDetail[], mockElectricityMeterValidationData,
   mockElectricityTshwanMeterDetails,
   mockElectricityAccountsData: IBuyElectricityAccountDetail[], getElectricityMeterVouchers;

const getSaveMockValidationData = () => {
   return {
      data: [
         {
            startDate: '2018-01-12T00:00:00',
            nextTransDate: '2018-01-12T00:00:00',
            destinationNumber: '0740033923',
            serviceProvider: 'BLT',
            productCode: 'FBE',
            amount: 77,
            myDescription: 'MinaMoo',
            electricityMeterDetails: {
               Municipality: 'Eskom'
            }
         }
      ],
      metadata: {
         resultData: [
            {
               transactionID: '1',
               resultDetail: [
                  {
                     operationReference: 'FBEVoucherRedeem',
                     result: 'HV04',
                     status: 'FAILURE',
                     reason: 'There is no free electricity for this meter.'
                  }
               ]
            }
         ]
      }
   };
};
const getSaveMockData = () => {
   return {
      data: [
         {
            startDate: '2018-01-12T00:00:00',
            nextTransDate: '2018-01-12T00:00:00',
            fromAccount: {
               accountName: 'TRANS  01',
               accountNumber: '1001005570',
               accountType: 'CA'
            },
            destinationNumber: '0740033923',
            serviceProvider: 'CLC',
            productCode: 'PAI',
            amount: 77,
            myDescription: 'MinaMoo'
         }
      ],
      metadata: {
         resultData: [
            {
               transactionID: '1',
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'SAVED_VALID',
                     status: 'SUCCESS',
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
      }
   };
};

const getTshwanMeterDetails = () => {
   return {
      data: [
         {
            startDate: '2017-10-23T14:50:15.9678853+02:00',
            nextTransDate: '2017-10-23T00:00:00',
            fromAccount: {
               accountName: 'TRANS 02',
               accountNumber: '1001004345',
               accountType: 'CA'
            },
            destinationNumber: '01050020003',
            serviceProvider: 'BLT',
            productCode: 'PEL',
            amount: 100,
            isVoucherAmount: false,
            electricityAmountInArrears: 20,
            electricityMeterDetails: {
               Municipality: 'Tshwan',
               CustomerName: 'PIETERS VAN DER WALT',
               CustomerAddress: '00071/1, PRETORIA GARDENS'
            }
         }
      ],
      metadata: {
         resultData: [
            {
               transactionID: '0',
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'R06',
                     status: 'FAILURE',
                     reason: 'The topup transaction has failed.'
                  }
               ]
            }
         ]
      }
   };
};

const getTshwanMeterDetailsWithRequestId = () => {
   return {
      data:
      {
         prepaids: [
            {
               startDate: '2017-10-23T14:50:15.9678853+02:00',
               nextTransDate: '2017-10-23T00:00:00',
               fromAccount: {
                  accountName: 'TRANS 02',
                  accountNumber: '1001004345',
                  accountType: 'CA'
               },
               destinationNumber: '01050020003',
               serviceProvider: 'BLT',
               productCode: 'PEL',
               amount: 100,
               isVoucherAmount: false,
               electricityAmountInArrears: 20,
               electricityMeterDetails: {
                  Municipality: 'Tshwan',
                  CustomerName: 'PIETERS VAN DER WALT',
                  CustomerAddress: '00071/1, PRETORIA GARDENS'
               }
            }
         ],
         requestId: '12345'
      },
      metadata: {
         resultData: [
            {
               transactionID: '0',
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'R06',
                     status: 'FAILURE',
                     reason: 'The topup transaction has failed.'
                  }
               ]
            }
         ]
      }
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

function getMockPrepaidLimitData(): IBuyElectricityLimitDetail[] {
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

function getElectricityVoucherMockData() {
   return {
      data: [{
         meterNumber: '01050020029',
         distributor: 'Actaris',
         customerName: 'Mr J Davies',
         customerAddress: '32 Place, Everywhere',
         serviceProvider: 'BLT',
         nedbankReferenceNr: '20171023/Nedbank/000000001310',
         amount: 0.0,
         globalReceiptNr: '',
         taxInvoiceNr: '',
         supplyGroupCode: 100610,
         keyRevisionNr: 1,
         tarrifIndexCode: 4,
         algorithmCode: 7,
         tokenTechnologyCode: 2,
         tokenDetail: [
            {
               normalSaleToken: '13281520171023333333',
               electricityAmount: 0.0,
               vat: '0',
               electricityUnits: 5.0,
               tarrif: []
            },
            {
               normalSaleToken: '13281520171023333333',
               electricityAmount: 0.0,
               vat: '0',
               electricityUnits: 5.0,
               tarrif: []
            }],
         enquiries: 'For token queries please contact your local municipal office'
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
      availableBalance: 13168.2,
      currentBalance: 13217.2,
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

const testComponent = class { };
const routerTestingParam = [
   { path: 'buyElectricity/status', component: testComponent },
];

let _getAll, mockActiveAccounts: IAccountDetail;
describe('BuyElectricityService', () => {
   mockActiveAccounts = getActiveAccountsData();
   beforeEach(() => {
      mockElectricityAccountsData = getMockElectricityAccounts();
      mockElectricityMeterValidationData = getSaveMockValidationData();
      mockElectricityTshwanMeterDetails = getTshwanMeterDetailsWithRequestId();
      mockElectricityLimitData = getMockPrepaidLimitData();
      _getActiveAccounts = jasmine.createSpy('getActiveAccounts')
         .and.returnValue(Observable.of({ data: mockElectricityAccountsData }));
      _getPrepaidLimit = jasmine.createSpy('getPrepaidLimit').and.returnValue(Observable.of({ data: mockElectricityLimitData }));
      _buyElectricityMeterValidation = jasmine.createSpy('buyElectricityMeterValidation').and.returnValue(
         Observable.of(getSaveMockValidationData()));
      _prepaidStatus = jasmine.createSpy('_prepaidStatus').and.returnValue(
         Observable.of(getSaveMockValidationData()));
      _outOfBandOtpStatus = jasmine.createSpy('_outOfBandOtpStatus').and.returnValue(
         Observable.of(getSaveMockValidationData()));
      _buyElectricityTshwanMeterDetails = jasmine.createSpy('buyElectricityTshwanMeterDetails').and.returnValue(
         Observable.of(getTshwanMeterDetailsWithRequestId()));
      _makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.returnValue(
         Observable.of(getSaveMockData()));
      _getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: [mockActiveAccounts] }));
      getElectricityMeterVouchers = jasmine.createSpy('ElectricityMeterVouchers')
         .and.returnValue(Observable.of(getElectricityVoucherMockData()));
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [BuyElectricityService, DatePipe, SystemErrorService, {
            provide: ApiService, useValue: {
               PrepaidAccounts: {
                  getAll: _getActiveAccounts
               },
               PrepaidLimit: {
                  getAll: _getPrepaidLimit
               },
               BuyElectricityMeterValidation: {
                  create: _buyElectricityMeterValidation
               },
               BuyElectricityTshwanMeterDetails: {
                  create: _buyElectricityTshwanMeterDetails
               },
               PrepaidStatus: {
                  create: _prepaidStatus
               },
               OutOfBandOtpStatus: {
                  create: _outOfBandOtpStatus
               },
               MakeElectricityPayment: {
                  create: _makeElectricityPayment
               },
               ElectricityMeterVouchers: {
                  getAll: getElectricityMeterVouchers
               },
               refreshAccounts: {
                  getAll: _getAll
               }
            }
         }]
      });
   });
   it('should be created', inject([BuyElectricityService, DatePipe], (service: BuyElectricityService, datePipe: DatePipe) => {
      expect(service).toBeTruthy();
   }));

   it('should initialize the buy workflow models when initializeBuyWorkflow is called', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService, datePipe: DatePipe) => {
         service.initializeBuyElectricityWorkflow();
         expect(service.getBuyElectricityToVm()).toBeDefined();
         expect(service.getBuyElectricityAmountVm()).toBeDefined();
         expect(service.getBuyElectricityForVm()).toBeDefined();
         expect(service.getBuyElectricityReviewVm()).toBeDefined();
      }));

   it('should mark the BuyTo step navigated when buy to info is Saved', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService, datePipe: DatePipe) => {
         service.initializeBuyElectricityWorkflow();
         service.saveBuyElectricityToInfo({
            meterNumber: '1234567890',
            recipientName: 'abc',
            serviceProvider: 'BLT',
            productCode: 'PEL',
            isVmValid: true
         });
         expect(service.getStepSummary(BuyElectricityStep.buyTo, true)).toBeTruthy();
      }));

   it('should get step updated title information', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService, datePipe: DatePipe) => {
         service.initializeBuyElectricityWorkflow();
         const currentStep: IWorkflowStep = {
            summary: {
               isNavigated: true,
               sequenceId: 1,
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
            component: BuyElectricityToComponent
         };
         service.electricityWorkflowSteps.buyTo.isNavigated = true;
         service.getStepInfo(currentStep);
         expect(currentStep.summary.title).toBeDefined();
      }));

   it('should get step updated title information', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService, datePipe: DatePipe) => {
         service.initializeBuyElectricityWorkflow();
         const currentStep: IWorkflowStep = {
            summary: {
               isNavigated: true,
               sequenceId: 1,
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
            component: BuyElectricityToComponent
         };
         service.electricityWorkflowSteps.buyTo.isNavigated = true;
         service.getStepInitialInfo(currentStep);
         expect(currentStep.summary.title).toBeDefined();
      }));

   it('should check if any step is dirty', inject([BuyElectricityService, DatePipe], (service: BuyElectricityService,
      datePipe: DatePipe) => {
      service.initializeBuyElectricityWorkflow();
      service.electricityWorkflowSteps.buyTo.isDirty = true;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(true);
   }));
   it('should check if any step is dirty', inject([BuyElectricityService, DatePipe], (service: BuyElectricityService,
      datePipe: DatePipe) => {
      service.initializeBuyElectricityWorkflow();
      service.electricityWorkflowSteps.buyTo.isDirty = true;
      service.electricityWorkflowSteps.buyReview.isDirty = true;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(false);
   }));

   it('should expect an error if wrong step number is passed to get step summary', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService, datePipe: DatePipe) => {
         service.initializeBuyElectricityWorkflow();
         expect(function () {
            service.getStepSummary(-1, true);
         }).toThrow();
      }
   ));
   it('should mark the BuyReview step navigated when buy to info is Saved', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService, datePipe: DatePipe) => {
         service.initializeBuyElectricityWorkflow();
         service.saveBuyElectricityToInfo({
            meterNumber: '1234567890',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            productCode: 'VGN',
            isVmValid: true
         });
         expect(service.getStepSummary(BuyElectricityStep.review, true)).toBeTruthy();
      }));

   it('should expect an error if wrong step number is passed to get step summary', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         service.initializeBuyElectricityWorkflow();
         expect(function () {
            service.getStepSummary(-1, true);
         }).toThrow();
      }
   ));
   it('should mark the BuyReview step navigated when buy to info is Saved', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService, datePipe: DatePipe) => {
         service.initializeBuyElectricityWorkflow();
         service.saveBuyElectricityToInfo({
            meterNumber: '1234567890',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            productCode: 'VGN',
            isVmValid: true
         });
         expect(service.getStepSummary(BuyElectricityStep.review, true)).toBeTruthy();
      }));

   it('should expect an error if wrong step number is passed to get step summary', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         service.initializeBuyElectricityWorkflow();
         expect(function () {
            service.getStepSummary(-1, true);
         }).toThrow();
      }
   ));
   it('should return false for invalid metadata', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService) => {
         const metadata = {
            resultData: []
         };
         const result = service.isElectricityPaymentStatusValid(metadata);
         expect(result).toEqual(false);
      }));
   it('should return false for transaction failure', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService) => {
         service.initializeBuyElectricityWorkflow();
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
         const result = service.isElectricityPaymentStatusValid(metadata);
         expect(result).toEqual(false);
      }));
   it('should return true for transaction success', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService) => {
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
         const result = service.isElectricityPaymentStatusValid(metadata);
         expect(result).toEqual(true);
      }));
   it('should get step updated title information for buy Amount', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      const buyAmountModel = new BuyElectricityAmountModel();
      buyAmountModel.amount = 5;
      buyAmountModel.startDate = new Date();
      buyAmountModel.selectedAccount = getMockElectricityAccounts()[0];
      service.electricityWorkflowSteps.buyAmount.model = buyAmountModel;
      service.electricityWorkflowSteps.buyAmount.isNavigated = true;
      let currentSummary = service.getStepSummary(BuyElectricityStep.buyAmount, false);
      currentSummary = service.getStepSummary(BuyElectricityStep.buyAmount, false);
      const amount = amountTransform.transform(buyAmountModel.amount + '');
      const expectedTitle = `${amount} prepaid electricity from my ` +
         `${CommonUtility.getAccountTypeName(buyAmountModel.selectedAccount.accountType)} account`;
      expect(currentSummary.title).toEqual(expectedTitle);
      service.electricityWorkflowSteps.buyAmount.isNavigated = true;
   }));

   it('should mark the BuyAmount step navigated when buy amount info is Saved', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         service.initializeBuyElectricityWorkflow();
         service.saveBuyElectricityAmountInfo({
            startDate: new Date('2017-10-08T18:30:00.000Z'),
            selectedAccount: getMockElectricityAccounts[0],
            amount: 10
         });
         expect(service.getStepSummary(BuyElectricityStep.buyAmount, true)).toBeTruthy();
      }));
   it('should get step default title information for buy amount step',
      inject([BuyElectricityService], (service: BuyElectricityService) => {
         service.initializeBuyElectricityWorkflow();
         const currentStep = service.getStepSummary(BuyElectricityStep.buyAmount, true);
         service.electricityWorkflowSteps.buyAmount.isNavigated = false;
         expect(currentStep.title).toBeDefined();
      }));
   it('should get step updated title information for buy Amount', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      const buyAmountModel = new BuyElectricityAmountModel();
      buyAmountModel.amount = 5;
      buyAmountModel.startDate = new Date();
      buyAmountModel.selectedAccount = getMockElectricityAccounts()[0];
      service.electricityWorkflowSteps.buyAmount.model = buyAmountModel;
      service.electricityWorkflowSteps.buyAmount.isNavigated = true;
      let currentSummary = service.getStepSummary(BuyElectricityStep.buyAmount, false);
      currentSummary = service.getStepSummary(BuyElectricityStep.buyAmount, false);
      const amount = amountTransform.transform(buyAmountModel.amount + '');
      const expectedTitle = `${amount} prepaid electricity from my ` +
         `${CommonUtility.getAccountTypeName(buyAmountModel.selectedAccount.accountType)} account`;
      expect(currentSummary.title).toEqual(expectedTitle);
      service.electricityWorkflowSteps.buyAmount.isNavigated = true;
   }));
   it('should mark the BuyFor step navigated when buy for info is Saved', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         service.initializeBuyElectricityWorkflow();
         service.saveBuyElectricityForInfo({
            yourReference: 'abc',
            notificationInput: '1234567898',
            notificationType: 'SMS'
         });
         expect(service.getStepSummary(BuyElectricityStep.buyFor, true)).toBeTruthy();
      }));

   it('should get step default title information for buy for step', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      const currentStep = service.getStepSummary(BuyElectricityStep.buyFor, true);
      service.electricityWorkflowSteps.buyFor.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));
   it('should get step updated title information for buy for', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      const buyforModel = new BuyElectricityForModel();
      buyforModel.yourReference = 'your ref';
      buyforModel.notificationInput = '1234567883';
      buyforModel.notificationType = 'SMS';
      service.electricityWorkflowSteps.buyFor.model = buyforModel;
      service.electricityWorkflowSteps.buyFor.isNavigated = true;
      const currentSummary = service.getStepSummary(BuyElectricityStep.buyFor, false);
      const expectedTitle = `Your reference: For ${buyforModel.yourReference} ` +
         `Send an ${buyforModel.notificationType} notification to ` +
         `${buyforModel.notificationInput}`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   it('should validate meter ', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      service.saveBuyElectricityToInfo({
         recipientName: 'abc',
         meterNumber: '1234555234',
         serviceProvider: 'BLT',
         productCode: 'MTN',
         isVmValid: true
      });
      service.validateMeter().subscribe(data => {
         const meterValidationResultDeatil = data.resultData[0].resultDetail[0];
         expect(meterValidationResultDeatil.result).toEqual(
            mockElectricityMeterValidationData.metadata.resultData[0].resultDetail[0].result);
      });
   }));
   it('should complete transaction ', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService, datePipe: DatePipe) => {
         service.initializeBuyElectricityWorkflow();
         service.saveBuyElectricityToInfo({
            meterNumber: '1234567890',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            productCode: 'VGN',
            isVmValid: true
         });
         service.saveBuyElectricityAmountInfo({
            startDate: new Date('2017-10-08T18:30:00.000Z'),
            selectedAccount: getMockElectricityAccounts()[0],
            amount: 10
         });
         service.saveBuyElectricityForInfo({
            yourReference: 'abc',
            notificationInput: '1234567898',
            notificationType: 'SMS'
         });
         service.saveBuyElectricityReviewInfo({
            isSaveBeneficiary: false
         });
         service.getBuyElectricityReviewVm();
         service.makeElectricityPayment(true).subscribe(respo => {
            expect(respo.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            service.makeElectricityPayment(false).subscribe(respo1 => {
               expect(service.isPaymentStatusNavigationAllowed()).toBe(true);
               service.getBuyElectricityDetailsInfo();
               service.updateTransactionID('1234');
               service.updateexecEngineRef('1234');
               expect(service.getBuyElectricityDetailsInfo().transactionID).toEqual('1234');
               expect(service.execEngineRef).toEqual('1234');
               expect(respo1.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            });
         });
         expect(_makeElectricityPayment).toHaveBeenCalled();
      }));
   it('should clear payment details ', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.clearElectricityPaymentDetails();
      expect(service.electricityDetails.amount).toBeUndefined();
   }));
   it('should return payment status ', inject([BuyElectricityService], (service: BuyElectricityService) => {
      expect(service.getPaymentStatus()).toMatch(/true|false/);
   }));
   it('should create elctricityMeterValidationDetails if not defined', inject(
      [BuyElectricityService], (service: BuyElectricityService) => {
         service.elctricityMeterValidationDetails = {
            destinationNumber: '1234567890',
            serviceProvider: 'VGN',
            productCode: 'VGN'
         };
         service.initializeBuyElectricityWorkflow();
         service.saveBuyElectricityToInfo({
            meterNumber: '1234567890',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            productCode: 'VGN',
            isVmValid: true
         });
         expect(service.getBuyElectricityMeterValidationDetailsInfo().destinationNumber).toBeDefined();
      }));
   it('should validate meter ', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      service.saveBuyElectricityToInfo({
         recipientName: 'abc',
         meterNumber: '1234555234',
         serviceProvider: 'BLT',
         productCode: 'MTN',
         isVmValid: true
      });
      service.validateMeter(false).subscribe(data => {
         const meterValidationResultDeatil = data.resultData[0].resultDetail[0];
         expect(meterValidationResultDeatil.result).toEqual(
            mockElectricityMeterValidationData.metadata.resultData[0].resultDetail[0].result);
      });
   }));
   it('should complete transaction ', inject([BuyElectricityService, DatePipe],
      (service: BuyElectricityService, datePipe: DatePipe) => {
         service.initializeBuyElectricityWorkflow();
         service.saveBuyElectricityToInfo({
            meterNumber: '1234567890',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            productCode: 'VGN',
            isVmValid: true,
            beneficiaryID: 1
         });
         service.saveBuyElectricityAmountInfo({
            startDate: new Date('2017-10-08T18:30:00.000Z'),
            selectedAccount: getMockElectricityAccounts()[0],
            amount: 10
         });
         service.saveBuyElectricityForInfo({
            yourReference: 'abc',
            notificationInput: '1234567898',
            notificationType: 'SMS'
         });
         service.saveBuyElectricityReviewInfo({
            isSaveBeneficiary: true
         });
         service.getBuyElectricityReviewVm();
         service.makeElectricityPayment(true).subscribe(respo => {
            expect(respo.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            service.makeElectricityPayment(false).subscribe(respo1 => {
               service.saveBuyElectricityToInfo({
                  meterNumber: '1234567890',
                  recipientName: 'abc',
                  serviceProvider: 'VGN',
                  productCode: 'VGN',
                  isVmValid: true
               });
               expect(service.isPaymentStatusNavigationAllowed()).toBe(true);
               service.getBuyElectricityDetailsInfo();
               service.electricityDetails = undefined;
               service.updateTransactionID('1234');
               service.updateexecEngineRef('1234');
               expect(service.getBuyElectricityDetailsInfo().transactionID).toEqual('1234');
               expect(service.execEngineRef).toEqual('1234');
               expect(respo1.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            });
         });
         expect(_makeElectricityPayment).toHaveBeenCalled();
      }));
   it('should clear payment details ', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.clearElectricityPaymentDetails();
      expect(service.electricityDetails.amount).toBeUndefined();
   }));
   it('should return payment status ', inject([BuyElectricityService], (service: BuyElectricityService) => {
      expect(service.getPaymentStatus()).toMatch(/true|false/);
   }));
   it('should create elctricityMeterValidationDetails if not defined', inject(
      [BuyElectricityService], (service: BuyElectricityService) => {
         service.elctricityMeterValidationDetails = {
            destinationNumber: '1234567890',
            serviceProvider: 'VGN',
            productCode: 'VGN'
         };
         service.initializeBuyElectricityWorkflow();
         service.saveBuyElectricityToInfo({
            meterNumber: '1234567890',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            productCode: 'VGN',
            isVmValid: true
         });
         expect(service.getBuyElectricityMeterValidationDetailsInfo().destinationNumber).toBeDefined();
      }));

   it('should handle null notification on edit header', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         service.initializeBuyElectricityWorkflow();
         service.initializeBuyElectricityWorkflow();
         const buyforModel = new BuyElectricityForModel();
         buyforModel.yourReference = 'your ref';
         buyforModel.notificationInput = null;
         buyforModel.notificationType = null;
         service.electricityWorkflowSteps.buyFor.model = buyforModel;
         service.electricityWorkflowSteps.buyFor.isNavigated = true;
         const currentSummary = service.getStepSummary(BuyElectricityStep.buyFor, false);
         const expectedTitle = `Your reference: For ${buyforModel.yourReference}`;
         expect(currentSummary.title).toEqual(expectedTitle);
      }));

   it('should return the claimed voucher details', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         const buyToVM: IBuyElectricityToVm = {
            recipientName: 'Test',
            meterNumber: '123456789',
            serviceProvider: 'BLT',
            productCode: 'FBE',
            isVmValid: true
         };
         service.initializeBuyElectricityWorkflow();
         service.fbeClaimed('1310', buyToVM).subscribe((response) => {
            expect(service.isFBEClaimed).toEqual(true);
            expect(service.isPaymentSuccessful).toEqual(true);
         });
      }));
   it('should return the FBE claimed status', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         expect(service.isFBEClaim()).toEqual(false);
      }));
   it('should redeem fbe', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         const buyToVM: IBuyElectricityToVm = {
            recipientName: 'Test',
            meterNumber: '123456789',
            serviceProvider: 'BLT',
            productCode: 'FBE',
            isVmValid: true
         };
         service.initializeBuyElectricityWorkflow();
         service.makeElectricityPayment(false, true).subscribe((response) => {
         });
      }));

   it('should validate fbe response', inject([BuyElectricityService], (service: BuyElectricityService) => {
      expect(service.isFBETransactionValid(getSaveMockData().metadata)).toBe(true);
   }));

   it('should change the fbe next button text to redeem', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         expect(service.buyToNextButton.text).toEqual(Constants.labels.nextText);
         service.fbeButtonTextChange(true);
         expect(service.buyToNextButton.text).toEqual(Constants.labels.fbeRedeem);
         service.fbeButtonTextChange(false);
         expect(service.buyToNextButton.text).toEqual(Constants.labels.nextText);
      }));
   it('should not redeem fbe and save unsucessful object to pass on', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         const buyToVM: IBuyElectricityToVm = {
            recipientName: 'Test',
            meterNumber: '123456789',
            serviceProvider: 'BLT',
            productCode: 'FBE',
            isVmValid: true
         };
         service.initializeBuyElectricityWorkflow();
         service.makeElectricityPayment(false, true).subscribe((response) => {
            service.fbeClaimedUnsuccessful(buyToVM);
            expect(buyToVM.fbeElectricityUnits).toEqual(0);
            expect(buyToVM.fbeTransactionID).toEqual('0');
            expect(service.isFBEClaimed).toBeTruthy();
            expect(service.isPaymentSuccessful).toBeFalsy();
         });
      }));
   it('should check for Benificiary error', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      service.isBeneficiarySaved(null);
      expect(service.errorMessage).toBeUndefined();
      service.isBeneficiarySaved(getSaveMockData());
      expect(service.errorMessage).toBeUndefined();
      const data = getSaveMockData();
      data.metadata.resultData[0].resultDetail.splice(1, 1);
      service.isBeneficiarySaved(data);
      expect(service.errorMessage).toBe(Constants.labels.BenificiaryErrorMsg);
   }));
   it('should check getApproveItOtpStatus', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      service.getApproveItOtpStatus('', '').subscribe((response) => {
         expect(response).toBeTruthy();
      });
   }));
   it('should check getApproveItStatus', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      service.clearElectricityPaymentDetails();
      service.getApproveItStatus().subscribe((response) => {
         expect(response).toBeTruthy();
      });
   }));
   it('should check updateFBETransactionID', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.clearElectricityPaymentDetails();
      service.updateFBETransactionID('1234');
      expect(service.electricityDetails.fbeTransactionId).toBe('1234');
   }));
   it('should check updateFBETransactionID when no electricityDetails', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         service.electricityDetails = undefined;
         service.updateFBETransactionID('1234');
         expect(service.electricityDetails.fbeTransactionId).toBe('1234');
         expect(service.electricityDetails).toBeDefined();
      }));
   it('should call refresh Accounts',
      inject([BuyElectricityService], (service: BuyElectricityService) => {
         service.refreshAccounts();
      }));
   it('CreateGuidShouldNotReturnEmpty', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         service.requestid = '';
         service.createGuID();
         expect(service.requestid).not.toBe('');
      }));

   it('Should set isNoResponseReceived to true', inject([BuyElectricityService],
      (service: BuyElectricityService) => {
         service.isNoResponseReceived = false;
         service.redirecttoStatusPage();
         expect(service.isNoResponseReceived).toEqual(true);
      }));
});
describe('BuyElectricityService', () => {
   beforeEach(() => {
      mockElectricityAccountsData = getMockElectricityAccounts();
      mockElectricityMeterValidationData = getSaveMockValidationData();
      mockElectricityTshwanMeterDetails = getTshwanMeterDetailsWithRequestId();
      mockElectricityLimitData = getMockPrepaidLimitData();
      _getActiveAccounts = jasmine.createSpy('getActiveAccounts')
         .and.returnValue(Observable.of({ data: mockElectricityAccountsData }));
      _getPrepaidLimit = jasmine.createSpy('getPrepaidLimit')
         .and.returnValue(Observable.of({ data: mockElectricityLimitData }));
      _buyElectricityMeterValidation = jasmine.createSpy('buyElectricityMeterValidation').and.returnValue(
         Observable.of(getSaveMockValidationData()));
      _prepaidStatus = jasmine.createSpy('_prepaidStatus');
      _outOfBandOtpStatus = jasmine.createSpy('_outOfBandOtpStatus');
      _buyElectricityTshwanMeterDetails = jasmine.createSpy('buyElectricityTshwanMeterDetails').and.returnValue(
         Observable.of(getTshwanMeterDetailsWithRequestId()));
      _makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.returnValue(
         Observable.of(getSaveMockData()));
      getElectricityMeterVouchers = jasmine.createSpy('ElectricityMeterVouchers')
         .and.returnValue(Observable.of(getElectricityVoucherMockData()));
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         providers: [BuyElectricityService, DatePipe, SystemErrorService, {
            provide: ApiService, useValue: {
               PrepaidAccounts: {
                  getAll: _getActiveAccounts
               },
               PrepaidLimit: {
                  getAll: _getPrepaidLimit
               },
               BuyElectricityMeterValidation: {
                  create: _buyElectricityTshwanMeterDetails
               },
               BuyElectricityTshwanMeterDetails: {
                  create: _buyElectricityTshwanMeterDetails
               },
               MakeElectricityPayment: {
                  create: _makeElectricityPayment
               },
               ElectricityMeterVouchers: {
                  getAll: getElectricityMeterVouchers
               }
            }
         }]
      });
   });
   it('should return tshwan meter details ', inject([BuyElectricityService], (service: BuyElectricityService) => {
      service.initializeBuyElectricityWorkflow();
      service.saveBuyElectricityAmountInfo({
         startDate: new Date('2017-10-08T18:30:00.000Z'),
         selectedAccount: getMockElectricityAccounts()[0],
         amount: 10
      });
      service.saveBuyElectricityToInfo({
         recipientName: 'abc',
         meterNumber: '1050020003',
         serviceProvider: 'BLT',
         productCode: 'PEL',
         isVmValid: true
      });
      service.getBuyElectricityAmountInArrearsDetailsInfo();
      service.getElectricityBillDetails().subscribe(data => {
         expect(data.prepaids[0]).toEqual(
            mockElectricityTshwanMeterDetails.data.prepaids[0]);
      });
   }));
});

describe('BuyElectricityService', () => {
   beforeEach(() => {
      mockElectricityAccountsData = getMockElectricityAccounts();
      mockElectricityMeterValidationData = getSaveMockValidationData();
      mockElectricityTshwanMeterDetails = getTshwanMeterDetailsWithRequestId();
      mockElectricityLimitData = getMockPrepaidLimitData();
      _getActiveAccounts = jasmine.createSpy('getActiveAccounts')
         .and.returnValue(Observable.of(null));
      _getPrepaidLimit = jasmine.createSpy('getPrepaidLimit')
         .and.returnValue(Observable.of({ data: mockElectricityLimitData }));
      _buyElectricityMeterValidation = jasmine.createSpy('buyElectricityMeterValidation').and.returnValue(
         Observable.of(getSaveMockValidationData()));
      _buyElectricityTshwanMeterDetails = jasmine.createSpy('buyElectricityTshwanMeterDetails').and.returnValue(
         Observable.of(getTshwanMeterDetailsWithRequestId()));
      _makeElectricityPayment = jasmine.createSpy('makeElectricityPayment').and.returnValue(
         Observable.of(getSaveMockData()));
      getElectricityMeterVouchers = jasmine.createSpy('ElectricityMeterVouchers')
         .and.returnValue(Observable.of(getElectricityVoucherMockData()));
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         providers: [BuyElectricityService, DatePipe, SystemErrorService, {
            provide: ApiService, useValue: {
               PrepaidAccounts: {
                  getAll: _getActiveAccounts
               },
               PrepaidLimit: {
                  getAll: _getPrepaidLimit
               },
               Limits: {
                  getAll: _getPrepaidLimit
               },
               BuyElectricityMeterValidation: {
                  create: _buyElectricityTshwanMeterDetails
               },
               BuyElectricityTshwanMeterDetails: {
                  create: _buyElectricityTshwanMeterDetails
               },
               MakeElectricityPayment: {
                  create: _makeElectricityPayment
               },
               ElectricityMeterVouchers: {
                  getAll: getElectricityMeterVouchers
               }
            }
         }]
      });
   });
   it('should call getElectricity Limits',
      inject([BuyElectricityService], (service: BuyElectricityService) => {
         service.getElectricityLimits().subscribe(response => {
            expect(response).toBe(mockElectricityLimitData);
         });
      }));
   it('should refresh accounts',
      inject([BuyElectricityService], (service: BuyElectricityService) => {
         service.refreshAccountData();
         expect(service.accountsDataObserver.count.length).toBe(1);
      }));
   it('should call PrepaidAccounts',
      inject([BuyElectricityService], (service: BuyElectricityService) => {
         service.initializeBuyElectricityWorkflow();
      }));
});

describe('BuyElectricityService for NoContent', () => {
   const NoContentResponse = jasmine.createSpy('getAll').and.returnValue(Observable.of(null));

   beforeEach(() => {

      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         providers: [BuyElectricityService, DatePipe, SystemErrorService, {
            provide: ApiService, useValue: {
               PrepaidAccounts: {
                  getAll: NoContentResponse
               },
               PrepaidLimit: {
                  getAll: NoContentResponse
               },
               Limits: {
                  getAll: NoContentResponse
               },
               ElectricityMeterVouchers: {
                  getAll: NoContentResponse
               }
            }
         }]
      });
   });
   it('should call getElectricity Limits',
      inject([BuyElectricityService], (service: BuyElectricityService) => {
         service.getElectricityLimits().subscribe(response => {
            expect(response.length).toBe(0);
            expect(NoContentResponse).toHaveBeenCalled();
         });
      }));
   it('should call getElectricity Limits',
      inject([BuyElectricityService], (service: BuyElectricityService) => {
         service.getElectricityLimits().subscribe(response => {
            expect(response.length).toBe(0);
            expect(NoContentResponse).toHaveBeenCalled();
         });
      }));
});

import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';

import { BuyService } from './buy.service';
import { BuyToComponent } from './buy-to/buy-to.component';
import { ApiService } from '../../core/services/api.service';
import { BuyStep } from './buy.models';
import { CommonUtility } from './../../core/utils/common';
import { BuyAmountModel } from './buy-amount/buy-amount.model';
import { IPrepaidServiceProviderProducts, IPrepaidAccountDetail, IPrepaidLimitDetail } from './../../core/services/models';
import { IWorkflowStep } from '../../shared/components/work-flow/work-flow.models';
import { IServiceProvider, IAccountDetail } from '../../core/services/models';
import { BuyForModel } from './buy-for/buy-for.model';
import { Constants } from '../../core/utils/constants';
import { SystemErrorService } from '../../core/services/system-services.service';

let _getActiveAccounts, _getProviders, _getProvidersProducts, _getPrepaidLimit, _buyPrepaid,
   mockPrepaidLimitData: IPrepaidLimitDetail[],
   mockPrepaidAccountsData: IPrepaidAccountDetail[],
   mockProviderData: IServiceProvider[],
   mockProviderProductsData: IPrepaidServiceProviderProducts[];

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
            isVoucherAmount: false,
            reoccurrenceItem: {
               reoccurrenceFrequency: 'Weekly',
               reoccurrenceOccur: 40,
               reoccOccurrencesLeft: 40,
               reoccurrenceToDate: '2018-10-12T00:00:00',
               reoccSubFreqType: 'DayOfWeek',
               reoccSubFreqVal: '5'
            },
            favourite: false,
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
   }];
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
   { path: 'buy/status', component: testComponent },
];

let _getAll, mockActiveAccounts: IAccountDetail;

describe('BuyService', () => {
   beforeEach(() => {
      mockActiveAccounts = getActiveAccountsData();
      mockProviderData = getMockProviderData();
      mockPrepaidAccountsData = getMockPrepaidAccounts();
      mockProviderProductsData = getMockProviderProductsData('urlParam');
      mockPrepaidLimitData = getMockPrepaidLimitData();
      _getProviders = jasmine.createSpy('getServiceProviders').and.returnValue(Observable.of({ data: mockProviderData }));
      _buyPrepaid = jasmine.createSpy('buyPrepaid').and.returnValue(Observable.of(getSaveMockData()));
      _getActiveAccounts = jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of({ data: mockPrepaidAccountsData }));
      _getProvidersProducts = jasmine.createSpy('getServiceProviders').and.returnValue(Observable.of({ data: mockProviderProductsData }));
      _getPrepaidLimit = jasmine.createSpy('getPrepaidLimit').and.returnValue(Observable.of({ data: mockPrepaidLimitData }));
      _getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: [mockActiveAccounts] }));
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [BuyService, DatePipe, SystemErrorService, {
            provide: ApiService, useValue: {
               ServiceProviders: {
                  getAll: _getProviders
               },
               BuyPrepaid: {
                  create: _buyPrepaid
               },
               PrepaidAccounts: {
                  getAll: _getActiveAccounts
               },
               Limits: {
                  getAll: _getPrepaidLimit
               },
               ServiceProvidersProducts: {
                  getAll: _getProvidersProducts
               },
               PrepaidLimit: {
                  getAll: _getPrepaidLimit
               },
               refreshAccounts: {
                  getAll: _getAll
               }
            }
         }]
      });
   });

   it('should be created', inject([BuyService, DatePipe], (service: BuyService, datePipe: DatePipe) => {
      expect(service).toBeTruthy();
   }));
   it('should call getElectricity Limits', inject([BuyService], (service: BuyService) => {
      service.getPrepaidLimit().subscribe(response => {
         expect(response).toBe(mockPrepaidLimitData);
      });
   }));
   it('should initialize the buy workflow models when initializeBuyWorkflow is called', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.initializeBuyWorkflow();
         expect(service.getBuyToVm()).toBeDefined();
         expect(service.getBuyAmountVm()).toBeDefined();
         expect(service.getBuyForVm()).toBeDefined();
      }));

   it('should mark the BuyTo step navigated when buy to info is Saved', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.initializeBuyWorkflow();
         service.saveBuyToInfo({
            mobileNumber: '123456789',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            serviceProviderName: 'Virgin'
         });
         expect(service.getStepSummary(BuyStep.buyTo, true)).toBeTruthy();
      }));

   it('should get step updated title information', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.initializeBuyWorkflow();
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
            component: BuyToComponent
         };
         service.buyWorkflowSteps.buyTo.isNavigated = true;
         service.getStepInfo(currentStep);
         expect(currentStep.summary.title).toBeDefined();
      }));

   it('should get step updated title information', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.initializeBuyWorkflow();
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
            component: BuyToComponent
         };
         service.buyWorkflowSteps.buyTo.isNavigated = true;
         service.getStepInitialInfo(currentStep);
         expect(currentStep.summary.title).toBeDefined();
      }));

   it('should check if any step is dirty', inject([BuyService, DatePipe], (service: BuyService, datePipe: DatePipe) => {
      service.initializeBuyWorkflow();
      service.buyWorkflowSteps.buyTo.isDirty = true;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(true);
   }));
   it('should check if any step is dirty', inject([BuyService, DatePipe], (service: BuyService, datePipe: DatePipe) => {
      service.initializeBuyWorkflow();
      service.buyWorkflowSteps.buyTo.isDirty = true;
      service.buyWorkflowSteps.buyReview.isDirty = true;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(false);
   }));
   it('should get provider details', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.getServiceProviders().subscribe(providers => {
            const _provider = providers[0];
            expect(_provider.serviceProviderCode).toEqual(mockProviderData[0].serviceProviderCode);
            expect(_provider.serviceProviderName).toEqual(mockProviderData[0].serviceProviderName);
         });
         expect(_getProviders).toHaveBeenCalled();
      }));

   it('should expect an error if wrong step number is passed to get step summary', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.initializeBuyWorkflow();
         expect(function () {
            service.getStepSummary(-1, true);
         }).toThrow();
      }
   ));
   it('should mark the BuyReview step navigated when buy to info is Saved', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.initializeBuyWorkflow();
         service.saveBuyToInfo({
            mobileNumber: '123456789',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            serviceProviderName: 'VGN'
         });
         expect(service.getStepSummary(BuyStep.review, true)).toBeTruthy();
      }));
   it('should complete transaction for weekly', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.initializeBuyWorkflow();
         service.saveBuyToInfo({
            mobileNumber: '123456789',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            serviceProviderName: 'VGN'
         });
         service.saveBuyAmountInfo({
            startDate: new Date('2017-10-08T18:30:00.000Z'),
            selectedAccount: getMockPrepaidAccounts()[0],
            productCode: 'PAI',
            rechargeType: 'Airtime',
            bundleType: 'Own Amount',
            recurrenceFrequency: 'Weekly',
            numRecurrence: '10',
            amount: 10
         });
         service.saveBuyForInfo({
            yourReference: 'abc',
            notificationInput: '1234567898',
            notificationType: 'SMS'
         });
         service.buyPrepaid().subscribe(respo => {
            expect(respo.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            service.buyPrepaid(false).subscribe(respo1 => {
               expect(respo1.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            });
         });
         expect(_buyPrepaid).toHaveBeenCalled();
      }));

   it('should complete transaction for Monthly when repeatType selected - endDate', inject([BuyService, DatePipe],
      (service: BuyService) => {
         service.initializeBuyWorkflow();
         service.saveBuyToInfo({
            mobileNumber: '123456789',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            serviceProviderName: 'VGN'
         });
         service.saveBuyAmountInfo({
            startDate: new Date(),
            selectedAccount: getMockPrepaidAccounts()[0],
            productCode: 'PAI',
            rechargeType: 'Airtime',
            bundleType: 'Own Amount',
            recurrenceFrequency: 'Monthly',
            repeatType: 'endDate',
            numRecurrence: '10',
            amount: 10
         });
         service.saveBuyForInfo({
            yourReference: 'abc',
            notificationInput: '1234567898',
            notificationType: 'SMS'
         });
         service.saveBuyReviewInfo({ isSaveBeneficiary: true });
         service.buyPrepaid().subscribe(respo => {
            expect(respo.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            service.buyPrepaid(false).subscribe(respo1 => {
               expect(service.isTransferStatusNavigationAllowed()).toBe(true);
               service.saveBuyToInfo({
                  mobileNumber: '123456789',
                  recipientName: 'abc',
                  serviceProvider: 'VGN',
                  serviceProviderName: 'VGN',
                  beneficiaryID: 1
               });
               service.getPrepaidDetailInfo();
               service.updateTransactionID('1234');
               service.updateexecEngineRef('1234');
               expect(service.getPrepaidDetailInfo().transactionID).toEqual('1234');
               expect(service.execEngineRef).toEqual('1234');
               expect(respo1.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            });
         });
         expect(_buyPrepaid).toHaveBeenCalled();
      }));


   it('should complete transaction  for Monthly ', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.initializeBuyWorkflow();
         service.saveBuyToInfo({
            mobileNumber: '123456789',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            serviceProviderName: 'VGN'
         });
         service.saveBuyAmountInfo({
            startDate: new Date('2017-10-08T18:30:00.000Z'),
            selectedAccount: getMockPrepaidAccounts()[0],
            productCode: 'PAI',
            rechargeType: 'Airtime',
            bundleType: 'Own Amount',
            recurrenceFrequency: 'Monthly',
            numRecurrence: '10',
            amount: 10
         });
         service.saveBuyForInfo({
            yourReference: 'abc',
            notificationInput: '1234567898',
            notificationType: 'SMS'
         });
         service.saveBuyReviewInfo({ isSaveBeneficiary: true });
         service.buyPrepaid().subscribe(respo => {
            expect(respo.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            service.buyPrepaid(false).subscribe(respo1 => {
               expect(service.isTransferStatusNavigationAllowed()).toBe(true);
               service.saveBuyToInfo({
                  mobileNumber: '123456789',
                  recipientName: 'abc',
                  serviceProvider: 'VGN',
                  serviceProviderName: 'VGN',
                  beneficiaryID: 1
               });
               service.getPrepaidDetailInfo();
               service.updateTransactionID('1234');
               service.updateexecEngineRef('1234');
               expect(service.getPrepaidDetailInfo().transactionID).toEqual('1234');
               expect(service.execEngineRef).toEqual('1234');
               expect(respo1.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            });
         });
         expect(_buyPrepaid).toHaveBeenCalled();
      }));
   it('should complete transaction for no transaction repeat', inject([BuyService, DatePipe],
      (service: BuyService, datePipe: DatePipe) => {
         service.initializeBuyWorkflow();
         service.saveBuyToInfo({
            mobileNumber: '123456789',
            recipientName: 'abc',
            serviceProvider: 'VGN',
            serviceProviderName: 'VGN'
         });
         service.saveBuyAmountInfo({
            startDate: new Date('2017-10-08T18:30:00.000Z'),
            selectedAccount: getMockPrepaidAccounts()[0],
            productCode: 'PAI',
            rechargeType: 'Airtime',
            bundleType: 'Own Amount',
            recurrenceFrequency: 'Never',
            numRecurrence: null,
            amount: 10
         });
         service.saveBuyForInfo({
            yourReference: 'abc',
            notificationInput: '1234567898',
            notificationType: 'SMS'
         });
         service.saveBuyReviewInfo({ isSaveBeneficiary: false });
         service.buyPrepaid().subscribe(respo => {
            expect(respo.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            service.buyPrepaid(false).subscribe(respo1 => {
               expect(respo1.resultData[0].resultDetail[0].status).toBe('SUCCESS');
            });
         });
         expect(_buyPrepaid).toHaveBeenCalled();
      }));

   it('should return true for transaction success', inject([BuyService, DatePipe],
      (service: BuyService) => {
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
         const result = service.isPrepaidStatusValid(metadata);
         expect(result).toEqual(true);
      }));

   it('should return false for no transaction details', inject([BuyService, DatePipe],
      (service: BuyService) => {
         const metadata = {
            resultData: [
               {
                  resultDetail: [
                  ]
               }
            ]
         };
         const result = service.isPrepaidStatusValid(metadata);
         expect(result).toEqual(false);
      }));

   it('should return false for transaction failure', inject([BuyService, DatePipe],
      (service: BuyService) => {
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
         const result = service.isPrepaidStatusValid(metadata);
         expect(result).toEqual(false);
      }));
   it('should return false for invalid metadata', inject([BuyService, DatePipe],
      (service: BuyService) => {
         const metadata = {
            resultData: []
         };
         const result = service.isPrepaidStatusValid(metadata);
         expect(result).toEqual(false);
      }));
   it('should expect an error if wrong step number is passed to get step summary', inject([BuyService],
      (service: BuyService) => {
         service.initializeBuyWorkflow();
         expect(function () {
            service.getStepSummary(-1, true);
         }).toThrow();
      }
   ));
   it('should get VoucherValue when data or sms is being selected ', inject([BuyService],
      (service: BuyService) => {
         const buyAmount = [{
            productCode: 'PAI',
            bundleType: 'Own Amount'
         }, {
            productCode: 'PDA'
         }];
         const buyTo = [{
            serviceProvider: 'TLK',
         }, {
            serviceProvider: 'CLC',
         }];
         expect(service.getVoucherValue(buyAmount[1], buyTo[0])).toBeTruthy();
      }));
   it('should get VoucherValue when TLK provider is being selected', inject([BuyService],
      (service: BuyService) => {
         const buyAmount = [{
            productCode: 'PAI',
            bundleType: 'Own Amount'
         }, {
            productCode: 'PDA'
         }];
         const buyTo = [{
            serviceProvider: 'TLK',
         }, {
            serviceProvider: 'CLC',
         }];
         expect(service.getVoucherValue(buyAmount[0], buyTo[0])).toBeTruthy();
      }));
   it('should get VoucherValue when bundle type is not custom', inject([BuyService],
      (service: BuyService) => {
         const buyAmount = [{
            productCode: 'PAI',
            bundleType: 'R14.00'
         }, {
            productCode: 'PDA'
         }];
         const buyTo = [{
            serviceProvider: 'TLK',
         }, {
            serviceProvider: 'CLC',
         }];
         expect(service.getVoucherValue(buyAmount[0], buyTo[1])).toBeTruthy();
      }));
   it('should get products of a provider', inject([BuyService],
      (service: BuyService) => {
         service.getServiceProvidersProducts('MTN').subscribe(providers => {
            const _provider = providers[0];
            expect(_provider.productCode).toEqual(mockProviderProductsData[0].productCode);
         });
      }));

   it('should mark the BuyAmount step navigated when buy amount info is Saved', inject([BuyService],
      (service: BuyService) => {
         service.initializeBuyWorkflow();
         service.saveBuyAmountInfo({
            startDate: new Date('2017-10-08T18:30:00.000Z'),
            selectedAccount: getMockPrepaidAccounts[0],
            productCode: 'PAI',
            rechargeType: 'Airtime',
            bundleType: 'Own Amount',
            recurrenceFrequency: 'Weekly',
            numRecurrence: '10',
            amount: 10
         });
         expect(service.getStepSummary(BuyStep.buyAmount, true)).toBeTruthy();
      }));
   it('should get step default title information for buy amount step', inject([BuyService], (service: BuyService) => {
      service.initializeBuyWorkflow();
      const currentStep = service.getStepSummary(BuyStep.buyAmount, true);
      service.buyWorkflowSteps.buyAmount.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));

   it('should get step default title information for buy amount step with repeat', inject([BuyService], (service: BuyService) => {
      service.initializeBuyWorkflow();
      const buyAmountModel = new BuyAmountModel();
      buyAmountModel.numRecurrence = '1';
      buyAmountModel.recurrenceFrequency = 'Weekly';
      buyAmountModel.amount = 5;
      buyAmountModel.rechargeType = 'airtime';
      buyAmountModel.startDate = new Date();
      buyAmountModel.selectedAccount = getMockPrepaidAccounts()[0];
      service.buyWorkflowSteps.buyAmount.model = buyAmountModel;
      service.buyWorkflowSteps.buyAmount.isNavigated = true;
      const currentStep = service.getStepSummary(BuyStep.buyAmount, false);
      expect(currentStep.title).toBeDefined();
   }));
   it('should get step updated title information for buy Amount', inject([BuyService], (service: BuyService) => {
      service.initializeBuyWorkflow();
      const buyAmountModel = new BuyAmountModel();
      buyAmountModel.amount = 10;
      buyAmountModel.bundleType = '10.00';
      buyAmountModel.rechargeType = 'airtime';
      const currentDate = new Date();
      buyAmountModel.startDate = new Date(currentDate.getFullYear(),
         currentDate.getMonth(), currentDate.getDate() + 1);
      buyAmountModel.selectedAccount = getMockPrepaidAccounts()[0];
      service.buyWorkflowSteps.buyAmount.model = buyAmountModel;
      service.buyWorkflowSteps.buyAmount.isNavigated = true;
      const currentSummary = service.getStepSummary(BuyStep.buyAmount, false);
      const expectedTitle = `${buyAmountModel.displayBundle} from my account-` +
         `${buyAmountModel.selectedAccount.nickname} on  `;
      expect(currentSummary.title).toEqual(expectedTitle);
      service.buyWorkflowSteps.buyAmount.isNavigated = true;
   }));
   it('should get step updated title information for buy Amount for data', inject([BuyService], (service: BuyService) => {
      service.initializeBuyWorkflow();
      service.saveBuyAmountInfo({
         startDate: new Date('2017-10-08T18:30:00.000Z'),
         selectedAccount: getMockPrepaidAccounts()[0],
         productCode: 'PAI',
         rechargeType: 'Data',
         bundleType: 'Own Amount',
         recurrenceFrequency: '',
         numRecurrence: '',
         amount: 10
      });
      const vm = service.getBuyAmountVm();
      const currentSummary = service.getStepSummary(BuyStep.buyAmount, false);
      const expectedTitle = `${vm.displayBundle} from my account-` +
         `${vm.selectedAccount.nickname} repeated  `;
      expect(currentSummary.title).toEqual(expectedTitle);
      service.buyWorkflowSteps.buyAmount.isNavigated = true;
   }));

   it('should get step updated title information for buy Amount for SMS', inject([BuyService], (service: BuyService) => {
      service.initializeBuyWorkflow();
      service.saveBuyAmountInfo({
         startDate: new Date('2017-10-08T18:30:00.000Z'),
         selectedAccount: getMockPrepaidAccounts()[0],
         productCode: 'PAI',
         rechargeType: 'SMS',
         bundleType: 'Own Amount',
         recurrenceFrequency: '',
         numRecurrence: '',
         amount: 10
      });
      const vm = service.getBuyAmountVm();
      const currentSummary = service.getStepSummary(BuyStep.buyAmount, false);
      const expectedTitle = `${vm.displayBundle} from my account-` +
         `${vm.selectedAccount.nickname} repeated  `;
      expect(currentSummary.title).toEqual(expectedTitle);
      service.buyWorkflowSteps.buyAmount.isNavigated = true;
   }));
   it('should mark the BuyFor step navigated when buy for info is Saved', inject([BuyService],
      (service: BuyService) => {
         service.initializeBuyWorkflow();
         service.saveBuyForInfo({
            yourReference: 'abc',
            notificationInput: '1234567898',
            notificationType: 'SMS'
         });
         expect(service.getStepSummary(BuyStep.buyFor, true)).toBeTruthy();
      }));

   it('should get step default title information for buy for step', inject([BuyService], (service: BuyService) => {
      service.initializeBuyWorkflow();
      const currentStep = service.getStepSummary(BuyStep.buyFor, true);
      service.buyWorkflowSteps.buyFor.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));
   it('should get step updated title information for buy for', inject([BuyService], (service: BuyService) => {
      service.initializeBuyWorkflow();
      const buyforModel = new BuyForModel();
      buyforModel.yourReference = 'your ref';
      buyforModel.notificationInput = '1234567883';
      buyforModel.notificationType = 'SMS';
      service.buyWorkflowSteps.buyFor.model = buyforModel;
      service.buyWorkflowSteps.buyFor.isNavigated = true;
      const currentSummary = service.getStepSummary(BuyStep.buyFor, false);
      const expectedTitle = `Your reference: For ${buyforModel.yourReference} ` +
         `Send an ${buyforModel.notificationType} notification to ` +
         `${buyforModel.notificationInput}`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   it('should get null notification on buy for', inject([BuyService], (service: BuyService) => {
      service.initializeBuyWorkflow();
      const buyforModel = new BuyForModel();
      buyforModel.yourReference = 'your ref';
      buyforModel.notificationInput = null;
      buyforModel.notificationType = null;
      service.buyWorkflowSteps.buyFor.model = buyforModel;
      service.buyWorkflowSteps.buyFor.isNavigated = true;
      const currentSummary = service.getStepSummary(BuyStep.buyFor, false);
      const expectedTitle = `Your reference: For ${buyforModel.yourReference}`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   it('should refresh accounts',
      inject([BuyService], (service: BuyService) => {
         service.refreshAccountData();
         expect(service.accountsDataObserver.count.length).toBe(1);
      }));
   it('should return payment status ', inject([BuyService], (service: BuyService) => {
      expect(service.getPaymentStatus()).toMatch(/true|false/);
   }));

   it('should check for Benificiary error', inject([BuyService, DatePipe],
      (service: BuyService) => {
         service.initializeBuyWorkflow();
         service.isBeneficiarySaved(null);
         expect(service.errorMessage).toBeUndefined();
         service.isBeneficiarySaved(getSaveMockData());
         expect(service.errorMessage).toBeUndefined();
         const data = getSaveMockData();
         data.metadata.resultData[0].resultDetail.splice(1, 1);
         service.isBeneficiarySaved(data);
         expect(service.errorMessage).toBe(Constants.labels.BenificiaryErrorMsg);
      }));
   it('should call refresh Accounts',
      inject([BuyService], (service: BuyService) => {
         service.refreshAccounts();
      }));

   it('CreateGuidShouldNotReturnEmpty', inject([BuyService],
      (service: BuyService) => {
         service.requestid = '';
         service.createGuID();
         expect(service.requestid).not.toBe('');
      }));

   it('Should set isNoResponseReceived to true', inject([BuyService],
      (service: BuyService) => {
         service.isNoResponseReceived = false;
         service.redirecttoStatusPage();
         expect(service.isNoResponseReceived).toEqual(true);
      }));
});

describe('BuyService - Error handling', () => {
   beforeEach(() => {
      mockProviderData = getMockProviderData();
      mockPrepaidAccountsData = getMockPrepaidAccounts();
      mockProviderProductsData = getMockProviderProductsData('urlParam');
      mockPrepaidLimitData = getMockPrepaidLimitData();
      _getProviders = jasmine.createSpy('getServiceProviders').and.returnValue(Observable.of({ data: mockProviderData }));
      _buyPrepaid = jasmine.createSpy('buyPrepaid').and.returnValue(Observable.of(getSaveMockData()));
      _getActiveAccounts = jasmine.createSpy('S').and.returnValue(Observable.of(null));
      _getProvidersProducts = jasmine.createSpy('getServiceProviders').and.returnValue(Observable.of({ data: mockProviderProductsData }));
      _getPrepaidLimit = jasmine.createSpy('getPrepaidLimit').and.returnValue(Observable.of({ data: mockPrepaidLimitData }));

      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         providers: [BuyService, DatePipe, SystemErrorService, {
            provide: ApiService, useValue: {
               ServiceProviders: {
                  getAll: _getProviders
               },
               BuyPrepaid: {
                  create: _buyPrepaid
               },
               PrepaidAccounts: {
                  getAll: _getActiveAccounts
               },
               ServiceProvidersProducts: {
                  getAll: _getProvidersProducts
               },
               PrepaidLimit: {
                  getAll: _getPrepaidLimit
               },
            }
         }]
      });
   });
   it('should call PrepaidAccounts',
      inject([BuyService], (service: BuyService) => {
         service.initializeBuyWorkflow();
      }));
   it('should return payment status ', inject([BuyService], (service: BuyService) => {
      expect(service.getPaymentStatus()).toMatch(/true|false/);
   }));
   it('should clear payment details ', inject([BuyService], (service: BuyService) => {
      service.clearRechargePaymentDetails();
      expect(service.prepaidDetails.amount).toBeUndefined();
   }));
});


describe('BuyService for NoContent', () => {
   const NoContentResponse = jasmine.createSpy('getAll').and.returnValue(Observable.of(null));

   beforeEach(() => {

      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         providers: [BuyService, DatePipe, SystemErrorService, {
            provide: ApiService, useValue: {
               PrepaidLimit: {
                  getAll: NoContentResponse
               }
            }
         }]
      });
   });
   it('should call getElectricity Limits',
      inject([BuyService], (service: BuyService) => {
         service.getPrepaidLimit().subscribe(response => {
            expect(response.length).toBe(0);
            expect(NoContentResponse).toHaveBeenCalled();
         });
      }));
});

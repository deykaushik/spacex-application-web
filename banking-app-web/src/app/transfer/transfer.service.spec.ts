import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { TransferService } from './transfer.service';
import { ApiService } from '../core/services/api.service';
import { TransferAmountComponent } from './transfer-amount/transfer-amount.component';
import { TransferAmountModel } from './transfer-amount/transfer-amount.model';
import { ReoccurenceModel } from './transfer.models';
import { IWorkflowStep } from './../shared/components/work-flow/work-flow.models';
import { IAccountDetail, ILimitDetail, ITransferMetaData } from './../core/services/models';
import { CommonUtility } from '../core/utils/common';
import { AmountTransformPipe } from '../shared/pipes/amount-transform.pipe';
import { SystemErrorService } from '../core/services/system-services.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '../../../node_modules/@angular/core';

const amountTransform = new AmountTransformPipe();
let _getActiveAccounts, _getLimits, _getAll, mockActiveAccounts: IAccountDetail, mockLimits: ILimitDetail[];
let _getAllBanks, _create, mockBankData, mockTransferData: ITransferMetaData;

function getMockBankData() {
   return {
      bankCode: '111',
      bankName: 'Test One',
      rTC: true,
      universalCode: '111',
      branchCodes: [{
         branchCode: '111',
         branchName: 'Branch One'
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

function getLimitsData() {
   return [{
      limitType: 'transfer',
      dailyLimit: 80900,
      userAvailableDailyLimit: 80900,
      maxDailyLimit: 150000,
      isTempLimit: false
   }, {
      limitType: 'payment',
      dailyLimit: 80900,
      userAvailableDailyLimit: 80900,
      maxDailyLimit: 150000,
      isTempLimit: false
   }];
}

function getTransferData() {
   return {
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
}
const testComponent = class { };
const routerTestingParam = [
   { path: 'transfer/status', component: testComponent },
];

describe('TransferService', () => {

   beforeEach(() => {
      mockBankData = getMockBankData();
      mockActiveAccounts = getActiveAccountsData();
      mockLimits = getLimitsData();
      mockTransferData = getTransferData();


      _getActiveAccounts = jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of({ data: [mockActiveAccounts] }));
      _getLimits = jasmine.createSpy('getLimits').and.returnValue(Observable.of({ data: mockLimits }));
      _getAllBanks = jasmine.createSpy('getAllBanks').and.returnValue(Observable.of({ data: [mockBankData] }));
      _create = jasmine.createSpy('makeTransfer').and.returnValue(Observable.of({ metadata: mockTransferData }));
      _getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: [mockActiveAccounts] }));

      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [TransferService, DatePipe, SystemErrorService,
            {
               provide: ApiService, useValue: {
                  TransferAccounts: {
                     getAll: _getActiveAccounts
                  },
                  TransferLimits: {
                     getAll: _getLimits
                  },
                  Limits: {
                     getAll: _getLimits
                  },
                  Banks: {
                     getAll: _getAllBanks
                  },
                  MakeTransfer: {
                     create: _create
                  },
                  refreshAccounts: {
                     getAll: _getAll
                  }
               }
            }]
      });
   });

   it('should be created', inject([TransferService], (service: TransferService) => {
      expect(service).toBeTruthy();
   }));
   it('should call getElectricity Limits', inject([TransferService], (service: TransferService) => {
      service.getLimits().subscribe(response => {
         expect(response).toBe(mockLimits);
      });
   }));
   it('should get account details', inject([TransferService], (service: TransferService) => {
      service.getActiveAccounts().subscribe(accounts => {
         const _account = accounts[0];
         expect(_account.itemAccountId).toEqual(mockActiveAccounts.itemAccountId);
         expect(_account.accountNumber).toEqual(mockActiveAccounts.accountNumber);
         expect(_account.productCode).toEqual(mockActiveAccounts.productCode);
         expect(_account.productDescription).toEqual(mockActiveAccounts.productDescription);
      });
      expect(_getActiveAccounts).toHaveBeenCalled();
   }));

   it('should initialize the transfer workflow models when initializeTransferWorkflow is called', inject([TransferService],
      (service: TransferService) => {
         service.initializeTransferWorkflow();
         expect(service.getTransferAmountVm()).toBeDefined();
      }
   ));

   it('should provide summary of "how much to transfer" step with default values', inject([TransferService],
      (service: TransferService) => {
         service.initializeTransferWorkflow();
         const amountStepSummary = service.getStepSummary(1, true);
         expect(amountStepSummary.title).toBe('How much would you like to transfer?');
         expect(amountStepSummary.isNavigated).toBe(false);
         expect(amountStepSummary.sequenceId).toBe(1);
      }
   ));

   it('should provide summary of "transfer review details" step with default values', inject([TransferService],
      (service: TransferService) => {
         service.initializeTransferWorkflow();
         const amountStepSummary = service.getStepSummary(2, true);
         expect(amountStepSummary.isNavigated).toBe(false);
         expect(amountStepSummary.sequenceId).toBe(2);
      }
   ));
   it('should expect an error if wrong step number is passed to get step summary', inject([TransferService],
      (service: TransferService) => {
         service.initializeTransferWorkflow();
         expect(function () {
            service.getStepSummary(-1, true);
         }).toThrow();
      }
   ));
   it('should save TransferAmountVm on invoking saveTransferAmountInfo & set the step to be navigated', inject([TransferService],
      (service: TransferService) => {
         service.initializeTransferWorkflow();

         const frequency: ReoccurenceModel = { reoccurrenceFrequency: 'Weekly', reoccurrenceOccur: 2, reoccSubFreqVal: '2' };
         service.saveTransferAmountInfo({
            amount: 0,
            availableTransferLimit: 0,
            selectedFromAccount: null,
            selectedToAccount: null,
            payDate: new Date(),
            allowedTransferLimit: 0,
            isTransferLimitExceeded: false,
            isValid: true,
            reoccurrenceItem: frequency
         });
         const amountStepSummary = service.getStepSummary(1, true);
         expect(amountStepSummary.isNavigated).toBe(true);
      }
   ));

   it('should get step updated title information', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
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
         component: TransferAmountComponent
      };
      service.getStepInfo(currentStep);
      expect(currentStep.summary.title).toBeDefined();
   }));

   it('should get step default title information', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
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
         component: TransferAmountComponent
      };
      service.getStepInitialInfo(currentStep);
      expect(currentStep.summary.title).toBeDefined();
   }));

   it('should initialize the transfer amount workflow model when initializeTransferWorkflow is called', inject([TransferService, DatePipe],
      (service: TransferService) => {
         service.initializeTransferWorkflow();
         expect(service.getTransferAmountVm()).toBeDefined();
      }));

   it('should mark navigated on save transfer review info', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
      service.saveTransferReviewInfo(service.getTransferAmountVm());
      expect(service.transferWorkflowSteps.reviewStep.isNavigated).toBe(true);
   }));

   it('should mark navigated on save transfer review info', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
      service.saveTransferReviewInfo(service.getTransferAmountVm());
      expect(service.transferWorkflowSteps.reviewStep.isNavigated).toBeTruthy();
   }));

   it('should update transaction ID', inject([TransferService, DatePipe],
      (service: TransferService) => {
         service.initializeTransferWorkflow();

         service.saveTransferAmountInfo({
            isTransferLimitExceeded: false,
            isValid: true,
            availableTransferLimit: 1000,
            allowedTransferLimit: 5000,
            amount: 1200,
            payDate: new Date(),
            selectedFromAccount: getActiveAccountsData(),
            selectedToAccount: getActiveAccountsData(),
            reoccurrenceItem: new ReoccurenceModel()
         });
         service.getTransferDetailInfo();
         service.updateTransactionID('1234');
         expect(service.getTransferDetailInfo().transactionID).toEqual('1234');
      }));

   it('should return true for transaction success', inject([TransferService, DatePipe],
      (service: TransferService) => {
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
         const result = service.isTransferStatusValid(metadata);
         expect(result).toEqual(true);
      }));

   it('should return false for transaction failure', inject([TransferService, DatePipe],
      (service: TransferService) => {
         service.initializeTransferWorkflow();
         service.saveTransferAmountInfo({
            isTransferLimitExceeded: false,
            isValid: true,
            availableTransferLimit: 1000,
            allowedTransferLimit: 5000,
            amount: 1200,
            payDate: new Date(),
            selectedFromAccount: getActiveAccountsData(),
            selectedToAccount: getActiveAccountsData(),
            reoccurrenceItem: new ReoccurenceModel()
         });
         const vm = service.getTransferAmountVm();
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
         const result = service.isTransferStatusValid(metadata);
         service.errorMessage = metadata.resultData[0].resultDetail[0].reason;
         expect(service.errorMessage).toBeDefined();
         expect(result).toEqual(false);
      }));

   it('should return false for invalid metadata', inject([TransferService, DatePipe],
      (service: TransferService) => {
         const metadata = {
            resultData: []
         };
         const result = service.isTransferStatusValid(metadata);
         expect(result).toEqual(false);
      }));
   it('should return true for partial transaction success', inject([TransferService, DatePipe],
      (service: TransferService) => {
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
         const result = service.isTransferPartialSuccess(metadata);
         expect(result).toEqual(true);
      }));

   it('should return false for partial transaction success', inject([TransferService, DatePipe],
      (service: TransferService) => {
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
         const result = service.isTransferPartialSuccess(metadata);
         expect(result).toEqual(false);
      }));
   it('should return false for transaction failure', inject([TransferService, DatePipe],
      (service: TransferService) => {
         service.initializeTransferWorkflow();
         service.saveTransferAmountInfo({
            isTransferLimitExceeded: false,
            isValid: true,
            availableTransferLimit: 1000,
            allowedTransferLimit: 5000,
            amount: 1200,
            payDate: new Date(),
            selectedFromAccount: getActiveAccountsData(),
            selectedToAccount: getActiveAccountsData(),
            reoccurrenceItem: new ReoccurenceModel()
         });
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
         const result = service.isTransferPartialSuccess(metadata);
         service.errorMessage = metadata.resultData[0].resultDetail[0].reason;
         expect(service.errorMessage).toBeDefined();
         expect(result).toEqual(false);
      }));

   it('should make transfer with validate true and false', inject([TransferService, DatePipe], (service: TransferService) => {
      service.initializeTransferWorkflow();
      const frequency: ReoccurenceModel = { reoccurrenceFrequency: 'Monthly', reoccurrenceOccur: 2, reoccSubFreqVal: '2' };
      service.saveTransferAmountInfo({
         isTransferLimitExceeded: false,
         isValid: true,
         availableTransferLimit: 1000,
         allowedTransferLimit: 5000,
         amount: 1900,
         payDate: new Date(),
         selectedFromAccount: getActiveAccountsData(),
         selectedToAccount: getActiveAccountsData(),
         reoccurrenceItem: frequency
      });
      const vm = service.getTransferAmountVm();
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
      const result = service.isTransferStatusValid(metadata);
      service.errorMessage = metadata.resultData[0].resultDetail[0].reason;
      expect(service.errorMessage).toBeDefined();

      service.makeTransfer().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockTransferData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();
      service.makeTransfer(false).subscribe((data) => {
         expect(_getAll).toHaveBeenCalled();
      });
   }));

   it('should get account details', inject([TransferService, DatePipe], (service: TransferService) => {
      service.getActiveAccounts().subscribe(accounts => {
         const _account = accounts[0];
         expect(_account.itemAccountId).toEqual(mockActiveAccounts.itemAccountId);
         expect(_account.accountNumber).toEqual(mockActiveAccounts.accountNumber);
         expect(_account.productCode).toEqual(mockActiveAccounts.productCode);
         expect(_account.productDescription).toEqual(mockActiveAccounts.productDescription);
      });
      expect(_getActiveAccounts).toHaveBeenCalled();
   }));

   it('should get bank details', inject([TransferService, DatePipe], (service: TransferService) => {
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

   it('should not allow navigation to transfer status page', inject([TransferService, DatePipe], (service: TransferService) => {
      expect(service.isTransferStatusNavigationAllowed()).toBeUndefined();
   }));

   it('should allow navigation to transfer status page', inject([TransferService], (service: TransferService) => {
      service.isAPIFailure = false;
      service.raiseSystemErrorforAPIFailure();
      expect(service.isAPIFailure).toBe(true);
   }));

   it('should not allow navigation to transfer status page', inject([TransferService, DatePipe], (service: TransferService) => {
      service.initializeTransferWorkflow();
      expect(service.isTransferStatusNavigationAllowed()).toBe(false);
   }));

   it('should allow navigation to transfer status page', inject([TransferService, DatePipe], (service: TransferService) => {
      service.initializeTransferWorkflow();
      service.saveTransferReviewInfo(service.getTransferAmountVm());
      expect(service.isTransferStatusNavigationAllowed()).toBe(true);
   }));

   it('should clear transfer details', inject([TransferService, DatePipe], (service: TransferService) => {
      service.initializeTransferWorkflow();

      service.saveTransferAmountInfo({
         isTransferLimitExceeded: false,
         isValid: true,
         availableTransferLimit: 1000,
         allowedTransferLimit: 5000,
         amount: 1900,
         payDate: new Date(),
         selectedFromAccount: getActiveAccountsData(),
         selectedToAccount: getActiveAccountsData(),
         reoccurrenceItem: new ReoccurenceModel()
      });
      service.clearTransferDetails();
      service.getTransferDetailInfo();
      service.updateexecEngineRef('some reference number');
      expect(service.getTransferDetailInfo().amount).toBeUndefined();
      expect(service.getTransferDetailInfo().execEngineRef).toBe('some reference number');
   }));

   it('should check if any transfer step is dirty', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
      service.transferWorkflowSteps.amountStep.isDirty = true;
      service.transferWorkflowSteps.reviewStep.isDirty = true;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(false);
   }));
   it('should check if any transfer step is dirty', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
      service.transferWorkflowSteps.amountStep.isDirty = true;
      service.transferWorkflowSteps.reviewStep.isDirty = false;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(true);
   }));
   it('should check if any transfer step is dirty', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
      service.transferWorkflowSteps.amountStep.isDirty = false;
      service.transferWorkflowSteps.reviewStep.isDirty = true;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(false);
   }));
   it('should check if any transfer step is dirty', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
      service.transferWorkflowSteps.amountStep.isDirty = false;
      service.transferWorkflowSteps.reviewStep.isDirty = false;
      const isDirty = service.checkDirtySteps();
      expect(isDirty).toBe(false);
   }));



   it('should expect an error if wrong step number is passed to get step summary', inject([TransferService],
      (service: TransferService) => {
         service.initializeTransferWorkflow();
         expect(function () {
            service.getStepSummary(-1, true);
         }).toThrow();
      }
   ));

   it('should get step default title information', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
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
         component: TransferAmountComponent
      };
      service.getStepInitialInfo(currentStep);
      expect(currentStep.summary.title).toBeDefined();
   }));
   it('should get step updated title information', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
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
         component: TransferAmountComponent
      };
      service.getStepInfo(currentStep);
      expect(currentStep.summary.title).toBeDefined();
   }));

   it('should get step default title information for transfer amount step', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
      const currentStep = service.getStepSummary(1, true);
      service.transferWorkflowSteps.amountStep.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));

   it('should get step default title information for transfer amount step', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
      const transferAmountModel = new TransferAmountModel();
      transferAmountModel.amount = 5000;
      transferAmountModel.reoccurrenceItem = {
         reoccurrenceFrequency: 'Weekly',
         reoccurrenceOccur: 10,
         reoccSubFreqVal: '10',
      };
      service.getActiveAccounts().subscribe(accounts => {
         transferAmountModel.selectedFromAccount = accounts[0];
         transferAmountModel.selectedToAccount = accounts[0];
      });
      service.transferWorkflowSteps.amountStep.model = transferAmountModel;
      service.transferWorkflowSteps.amountStep.isNavigated = true;
      const currentStep = service.getStepSummary(1, false);
      expect(currentStep.title).toBeDefined();
   }));


   it('should get step new title information for transfer amount step', inject([TransferService], (service: TransferService) => {
      service.initializeTransferWorkflow();
      const transferAmountModel = new TransferAmountModel();
      transferAmountModel.amount = 5000;

      service.transferWorkflowSteps.amountStep.model = transferAmountModel;
      service.transferWorkflowSteps.amountStep.isNavigated = true;
      service.getActiveAccounts().subscribe(accounts => {
         transferAmountModel.selectedFromAccount = accounts[0];
         transferAmountModel.selectedToAccount = accounts[0];
      });
      transferAmountModel.reoccurrenceItem = {
         reoccurrenceFrequency: null,
         reoccurrenceOccur: 10,
         reoccSubFreqVal: '10',
         reoccurrenceToDate: null
      };
      const currentSummary = service.getStepSummary(1, false);
      const fromAccountNickName = transferAmountModel.selectedFromAccount.nickname;
      const toAccountNickName = transferAmountModel.selectedToAccount.nickname;
      const amount = amountTransform.transform(transferAmountModel.amount + '');
      const expectedTitle = `Transfer ${amount} from my account-${fromAccountNickName}` +
         `  to my account-${toAccountNickName} today.`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));

   it('should get step new title information for transfer amount for schedule', inject([TransferService], (service: TransferService) => {
      const currentDate = new Date();
      service.initializeTransferWorkflow();
      const transferAmountModel = new TransferAmountModel();
      transferAmountModel.amount = 5000;
      transferAmountModel.payDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      service.transferWorkflowSteps.amountStep.model = transferAmountModel;
      service.transferWorkflowSteps.amountStep.isNavigated = true;
      service.getActiveAccounts().subscribe(accounts => {
         transferAmountModel.selectedFromAccount = accounts[0];
         transferAmountModel.selectedToAccount = accounts[0];
      });
      transferAmountModel.reoccurrenceItem = {
         reoccurrenceFrequency: null,
         reoccurrenceOccur: null,
         reoccSubFreqVal: null,
         reoccurrenceToDate: null
      };
      const currentSummary = service.getStepSummary(1, false);
      const fromAccountNickName = transferAmountModel.selectedFromAccount.nickname;
      const toAccountNickName = transferAmountModel.selectedToAccount.nickname;
      const amount = amountTransform.transform(transferAmountModel.amount + '');
      const expectedTitle = `Transfer ${amount} from my account-${fromAccountNickName}` +
         `  to my account-${toAccountNickName} on  `;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   it('should get step new title information for transfer amount for schedule', inject([TransferService], (service: TransferService) => {
      const currentDate = new Date();
      service.initializeTransferWorkflow();
      const transferAmountModel = new TransferAmountModel();
      transferAmountModel.amount = 5000;
      transferAmountModel.payDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      service.transferWorkflowSteps.amountStep.model = transferAmountModel;
      service.transferWorkflowSteps.amountStep.isNavigated = true;
      service.getActiveAccounts().subscribe(accounts => {
         transferAmountModel.selectedFromAccount = accounts[0];
         transferAmountModel.selectedToAccount = accounts[0];
      });
      transferAmountModel.reoccurrenceItem = {
         reoccurrenceFrequency: 'Weekly',
         reoccurrenceOccur: null,
         reoccSubFreqVal: null,
         reoccurrenceToDate: null
      };
      const currentSummary = service.getStepSummary(1, false);
      const fromAccountNickName = transferAmountModel.selectedFromAccount.nickname;
      const toAccountNickName = transferAmountModel.selectedToAccount.nickname;
      const amount = amountTransform.transform(transferAmountModel.amount + '');
      const expectedTitle = `Transfer ${amount} from my account-${fromAccountNickName}` +
         `  to my account-${toAccountNickName} repeated  `;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));

});


describe('TransferService - Error handling scenario', () => {

   beforeEach(() => {
      mockBankData = getMockBankData();
      mockActiveAccounts = getActiveAccountsData();
      mockLimits = getLimitsData();
      mockTransferData = getTransferData();


      _getActiveAccounts = jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of(null));
      _getLimits = jasmine.createSpy('getLimits').and.returnValue(Observable.of({ data: mockLimits }));
      _getAllBanks = jasmine.createSpy('getAllBanks').and.returnValue(Observable.of({ data: [mockBankData] }));
      _create = jasmine.createSpy('makeTransfer').and.returnValue(Observable.of({ metadata: mockTransferData }));

      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         providers: [TransferService, DatePipe, SystemErrorService,
            {
               provide: ApiService, useValue: {
                  TransferAccounts: {
                     getAll: _getActiveAccounts
                  },
                  TransferLimits: {
                     getAll: _getLimits
                  },
                  Banks: {
                     getAll: _getAllBanks
                  },
                  MakeTransfer: {
                     create: _create
                  }
               }
            }]
      });
   });

   it('should handle response for no conent for active accounts',
      inject([TransferService], (service: TransferService) => {
         service.getActiveAccounts().subscribe(response => {
            expect(response.length).toBe(0);
         });
      }));

   it('CreateGuid Should Not Return Empty', inject([TransferService],
      (service: TransferService) => {
         service.requestID = '';
         service.createGUID();
         expect(service.requestID).not.toBe('');
      }));
});

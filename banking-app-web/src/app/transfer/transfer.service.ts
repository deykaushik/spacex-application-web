import { DatePipe } from '@angular/common';
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Api } from '../core/services/api';
import { ApiService } from './../core/services/api.service';
import { Constants } from './../core/utils/constants';
import { TransferDetail, TransferDetailsDoublePayment } from './transfer.models';
import { TransferAmountModel } from './transfer-amount/transfer-amount.model';
import { TransferReviewModel } from './transfer-review/transfer-review.model';
import { TransferStep, ITransferWorkflowSteps, ITransferAmountVm, ITransferReviewVm } from './transfer.models';
import { IWorkflowStepSummary } from '../shared/components/work-flow/work-flow.models';
import { IWorkflowService, IWorkflowStep } from './../shared/components/work-flow/work-flow.models';
import {
   IApiResponse, IAccountDetail, ILimitDetail, ITransferMetaData, IErrorEmitterResponse, ITransferDetailsDoublePayment
} from './../core/services/models';
import { ITransferDetail, IBank } from './../core/services/models';
import { SystemErrorService } from '../core/services/system-services.service';
import { UUID } from 'angular2-uuid';


@Injectable()
export class TransferService implements IWorkflowService {
   public requestID: string;

   private transferDetails: ITransferDetail;

   makeTransferApi: Api<ITransferDetail>;
   transferWorkflowSteps: ITransferWorkflowSteps;
   public errorMessage?: string;
   callbackFromSystemService: EventEmitter<IErrorEmitterResponse> = new EventEmitter<IErrorEmitterResponse>();
   isAPIFailure = false;


   constructor(private apiService: ApiService, private datepipe: DatePipe,
      public router: Router, private systemErrorService: SystemErrorService) { }

   getActiveAccounts(): Observable<IAccountDetail[]> {
      return this.apiService.TransferAccounts.getAll().map(response => {
         return response ? response.data : [];
      });
   }

   getLimits(): Observable<ILimitDetail[]> {
      return this.apiService.TransferLimits.getAll().map((response) => response ? response.data : []);
   }

   initializeTransferWorkflow() {
      this.transferWorkflowSteps = {
         amountStep: {
            isNavigated: false,
            sequenceId: TransferStep.amount,
            model: new TransferAmountModel(),
            isDirty: false
         },
         reviewStep: {
            isNavigated: false,
            sequenceId: TransferStep.review,
            model: new TransferReviewModel(),
            isDirty: false
         }
      };
   }
   checkDirtySteps() {
      const isTransferToAmountModelDirty = this.transferWorkflowSteps.amountStep.isDirty;
      const isTransferToReviewModelDirty = this.transferWorkflowSteps.reviewStep.isDirty;
      return (isTransferToAmountModelDirty && !isTransferToReviewModelDirty);
   }

   getStepSummary(stepId: number, isDefault: boolean): IWorkflowStepSummary {

      const stepSummary: IWorkflowStepSummary = {
         isNavigated: false,
         sequenceId: 0,
         title: null
      };
      let isNavigated = true;
      switch (stepId) {
         case TransferStep.amount:
            isNavigated = this.transferWorkflowSteps.amountStep.isNavigated;
            stepSummary.title = this.transferWorkflowSteps.amountStep.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.transferWorkflowSteps.amountStep.isNavigated;
            stepSummary.sequenceId = TransferStep.amount;
            break;
         case TransferStep.review:
            stepSummary.title = this.transferWorkflowSteps.reviewStep.model.getStepTitle();
            stepSummary.isNavigated = this.transferWorkflowSteps.reviewStep.isNavigated;
            stepSummary.sequenceId = TransferStep.review;
            break;
         default:
            throw new Error('Wrong Step');
      }
      return stepSummary;
   }

   getTransferAmountVm(): ITransferAmountVm {
      return this.transferWorkflowSteps.amountStep.model.getViewModel();
   }

   saveTransferAmountInfo(vm: ITransferAmountVm) {
      vm.reoccurrenceItem.reoccSubFreqVal =
         this.getPaymentRecurrenceSubFrequency(vm.reoccurrenceItem.reoccurrenceFrequency, vm.payDate);
      this.transferWorkflowSteps.amountStep.model.updateModel(vm);
      this.transferWorkflowSteps.amountStep.isNavigated = true;
   }

   getStepInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, false);
   }
   getStepInitialInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, true);
   }

   saveTransferReviewInfo(vm: ITransferAmountVm) {
      this.transferWorkflowSteps.reviewStep.isNavigated = true;
   }

   createGUID() {
      this.requestID = UUID.UUID();
   }

   makeTransfer(validate = true) {
      return this.apiService.MakeTransfer.create(this.getTransferDetailInfoForDoublePayment(),
         { validate: validate }).map((response) => {
            if (!validate) {
               this.apiService.refreshAccounts.getAll().subscribe();
            }
            return response.metadata;
         });
   }

   getTransferDetailInfoForDoublePayment(): ITransferDetailsDoublePayment {
      const tarnsferDPDetails = new TransferDetailsDoublePayment();
      tarnsferDPDetails.requestId = this.requestID;
      tarnsferDPDetails.transfers = [this.getTransferDetailInfo()];
      return tarnsferDPDetails;

   }

   getBanks(): Observable<IBank[]> {
      return this.apiService.Banks.getAll().map(response => response ? response.data : []);
   }

   updateTransactionID(transactionID: string) {
      if (transactionID) {
         this.transferDetails.transactionID = transactionID;
      }
   }

   isTransferStatusValid(metadata: ITransferMetaData): boolean {
      let isValid = false;
      this.errorMessage = '';
      // check for transaction success
      if (metadata && metadata.resultData && metadata.resultData.length) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const transactionDetails = metadata.resultData[i].resultDetail
               .find(x => x.operationReference === Constants.metadataKeys.transaction);

            if (transactionDetails.status === Constants.metadataKeys.success) {
               isValid = true;
               break;
            } else {
               this.errorMessage = transactionDetails.reason;
               break;
            }
         }
      }
      return isValid;
   }

   isTransferStatusNavigationAllowed(): boolean {
      return this.transferWorkflowSteps && this.transferWorkflowSteps.reviewStep.isNavigated;
   }

   raiseSystemErrorforAPIFailure() {
      this.isAPIFailure = true;
      this.router.navigateByUrl(Constants.routeUrls.transferStatus);
   }



   getTransferDetailInfo(): ITransferDetail {
      const transferAmountViewModel = this.transferWorkflowSteps.amountStep.model.getViewModel();

      if (!this.transferDetails) {
         this.transferDetails = new TransferDetail();
      }
      this.transferDetails.startDate = this.datepipe.transform(transferAmountViewModel.payDate, Constants.formats.yyyyMMdd);
      this.transferDetails.amount = transferAmountViewModel.amount;
      this.transferDetails.fromAccount = {
         accountNumber: transferAmountViewModel.selectedFromAccount.accountNumber,
         accountType: transferAmountViewModel.selectedFromAccount.accountType
      };
      this.transferDetails.toAccount = {
         accountNumber: transferAmountViewModel.selectedToAccount.accountNumber,
         accountType: transferAmountViewModel.selectedToAccount.accountType
      };
      if (transferAmountViewModel.reoccurrenceItem.reoccurrenceFrequency) {
         this.transferDetails.reoccurrenceItem = transferAmountViewModel.reoccurrenceItem;
      }
      this.transferDetails.favourite = false;
      this.transferDetails.errorMessage = this.errorMessage;
      return this.transferDetails;
   }
   clearTransferDetails() {
      this.transferDetails = new TransferDetail();
      this.transferWorkflowSteps.amountStep.model.clearModel();
   }

   updateexecEngineRef(execEngineRef: string) {
      this.transferDetails.execEngineRef = execEngineRef;
   }
   // for retry feature
   isTransferPartialSuccess(metadata: ITransferMetaData): boolean {
      let isPartialSuccess = false;
      if (this.isTransferStatusValid(metadata)) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const transactionDetails = metadata.resultData[i].resultDetail
               .find(x => x.operationReference !== Constants.metadataKeys.transaction
                  && x.status !== Constants.metadataKeys.success);

            if (transactionDetails) {
               isPartialSuccess = true;
               break;
            }
         }
      }
      return isPartialSuccess;
   }
   getPaymentRecurrenceSubFrequency(paymentFrequency: string, paymentDate: Date): string {
      let dayOfrecurrence = 0;
      switch (paymentFrequency) {
         case Constants.VariableValues.paymentRecurrenceFrequency.monthly.code:
            dayOfrecurrence = paymentDate.getDate();
            break;
         case Constants.VariableValues.paymentRecurrenceFrequency.weekly.code:
            dayOfrecurrence = paymentDate.getDay() + 1;
            break;
      }

      return dayOfrecurrence.toString();
   }

   // raise error to system message control
   raiseSystemError(isCallback: boolean = false) {
      if (isCallback) {
         const callback = this.callbackFromSystemService.subscribe((response: IErrorEmitterResponse) => {
            callback.unsubscribe();
            this.clearTransferDetails();
            this.router.navigateByUrl(Constants.routeUrls.dashboard);
         });
      }
      this.systemErrorService.raiseError({
         error: Constants.VariableValues.sytemErrorMessages.transactionMessage,
         callbackEmitter: isCallback && this.callbackFromSystemService
      });
   }
}

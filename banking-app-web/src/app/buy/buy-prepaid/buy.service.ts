import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as models from './buy.models';
import { BuyToModel } from './buy-to/buy-to.model';
import { BuyReviewModel } from './buy-review/buy-review.model';
import { ApiService } from '../../core/services/api.service';
import { BuyAmountModel } from './buy-amount/buy-amount.model';
import {
   IPrepaidAccountDetail, IPrepaidLimitDetail, IPrepaidServiceProviderProducts,
   IPaymentNotification,
   IErrorEmitterResponse, IBuyprepaidDetailsWithGUID
} from './../../core/services/models';
import { IServiceProvider } from './../../core/services/models';
import { IWorkflowStep, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';
import { IBuyPrepaidDetail, IPrepaidMetaData } from './../../core/services/models';
import { IApiResponse, IAccountDetail, IOutOfBandResponse, IOutOfBandRequest } from './../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { BuyForModel } from './buy-for/buy-for.model';
import { CommonUtility } from '../../core/utils/common';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { SystemErrorService } from '../../core/services/system-services.service';

@Injectable()
export class BuyService {

   public buyWorkflowSteps: models.IBuymentWorkflowSteps;
   public prepaidDetails: IBuyPrepaidDetail;
   public isPaymentSuccessful = false;
   public errorMessage: string;
   requestid: string;
   public ResponseResult: string;
   public isNoResponseReceived = false;
   callbackFromSystemService: EventEmitter<IErrorEmitterResponse> = new EventEmitter<IErrorEmitterResponse>();
   accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   execEngineRef: string;
   constructor(private apiService: ApiService, private datepipe: DatePipe,
      public router: Router, private systemErrorService: SystemErrorService) { }

   // work flow methods
   initializeBuyWorkflow() {
      this.buyWorkflowSteps = {
         buyTo: {
            isNavigated: false,
            sequenceId: models.BuyStep.buyTo,
            model: new BuyToModel(),
            isDirty: false
         },
         buyReview: {
            isNavigated: false,
            sequenceId: models.BuyStep.review,
            model: new BuyReviewModel(),
            isDirty: false
         },
         buyAmount: {
            isNavigated: false,
            sequenceId: models.BuyStep.buyAmount,
            model: new BuyAmountModel(),
            isDirty: false
         },
         buyFor: {
            isNavigated: false,
            sequenceId: models.BuyStep.buyAmount,
            model: new BuyForModel(),
            isDirty: false
         },
      };
      this.apiService.PrepaidAccounts.getAll().subscribe(accountResponse => {
         const response = accountResponse ? accountResponse.data : [];
         this.updateAccountData(response);
      });
   }

   updateAccountData(accounts: IAccountDetail[]) {
      this.accountsDataObserver.next(accounts);
   }
   refreshAccountData() {
      this.accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   }
   // API methods start
   getPrepaidLimit(): Observable<IPrepaidLimitDetail[]> {
      return this.apiService.PrepaidLimit.getAll().map(response => response ? response.data : []);
   }

   getBuyToVm(): models.IBuyToVm {
      return this.buyWorkflowSteps.buyTo.model.getViewModel();
   }

   getBuyReviewVm(): models.IBuyReviewVm {
      return this.buyWorkflowSteps.buyReview.model.getViewModel();
   }

   saveBuyToInfo(vm: models.IBuyToVm) {
      this.buyWorkflowSteps.buyTo.model.updateModel(vm);
      this.buyWorkflowSteps.buyTo.isNavigated = true;
   }
   getBuyAmountVm(): models.IBuyAmountVm {
      return this.buyWorkflowSteps.buyAmount.model.getViewModel();
   }

   saveBuyAmountInfo(vm: models.IBuyAmountVm) {
      this.buyWorkflowSteps.buyAmount.model.updateModel(vm);
      this.buyWorkflowSteps.buyAmount.isNavigated = true;
   }

   getStepSummary(stepId: number, isDefault: boolean): IWorkflowStepSummary {
      const stepSummary: IWorkflowStepSummary = {
         isNavigated: false,
         sequenceId: 0,
         title: null
      };
      let isNavigated = true;
      switch (stepId) {
         case models.BuyStep.buyTo:
            isNavigated = this.buyWorkflowSteps.buyTo.isNavigated;
            stepSummary.title = this.buyWorkflowSteps.buyTo.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.buyWorkflowSteps.buyTo.isNavigated;
            stepSummary.sequenceId = models.BuyStep.buyTo;
            break;
         case models.BuyStep.review:
            isNavigated = this.buyWorkflowSteps.buyReview.isNavigated;
            stepSummary.title = this.buyWorkflowSteps.buyReview.model.getStepTitle();
            stepSummary.isNavigated = this.buyWorkflowSteps.buyReview.isNavigated;
            stepSummary.sequenceId = models.BuyStep.review;
            break;
         case models.BuyStep.buyAmount:
            isNavigated = this.buyWorkflowSteps.buyAmount.isNavigated;
            stepSummary.title = this.buyWorkflowSteps.buyAmount.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.buyWorkflowSteps.buyAmount.isNavigated;
            stepSummary.sequenceId = models.BuyStep.buyAmount;
            break;
         case models.BuyStep.buyFor:
            isNavigated = this.buyWorkflowSteps.buyFor.isNavigated;
            stepSummary.title = this.buyWorkflowSteps.buyFor.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.buyWorkflowSteps.buyFor.isNavigated;
            stepSummary.sequenceId = models.BuyStep.buyFor;
            break;
         default:
            throw new Error('no matching step found!');
      }
      return stepSummary;
   }
   checkDirtySteps() {
      return this.buyWorkflowSteps.buyTo.isDirty && !this.buyWorkflowSteps.buyReview.isDirty;
   }
   getStepInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, false);
   }
   getStepInitialInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, true);
   }

   getServiceProviders(): Observable<IServiceProvider[]> {
      return this.apiService.ServiceProviders.getAll().map(response => response.data);
   }
   buyPrepaid(validate = true) {
      if (validate) {
         this.prepaidDetails = null;
      }
      return this.apiService.BuyPrepaid.create(this.getPrepaidDetailInfoWithGUID(),
         { validate: validate }).map((response) => {
            return response.metadata;
         });
   }

   createGuID() {
      this.requestid = UUID.UUID();
   }


   private getPrepaidDetailInfoWithGUID(): IBuyprepaidDetailsWithGUID {
      const prepaids = [this.getPrepaidDetailInfo()];
      const prepaidDetailsWithGUID = new models.BuyPrepaidDetailWithGUID();
      prepaidDetailsWithGUID.requestId = this.requestid;
      prepaidDetailsWithGUID.prepaids = prepaids;
      return prepaidDetailsWithGUID;
   }

   getPrepaidDetailInfo(): IBuyPrepaidDetail {
      const buyToVm = this.getBuyToVm();
      const buyAmountVm = this.getBuyAmountVm();
      const buyForVm = this.getBuyForVm();
      const buyReviewVm = this.getBuyReviewVm();

      if (!this.prepaidDetails) {
         this.prepaidDetails = new models.BuyPrepaidDetail();
      }
      this.prepaidDetails.startDate = this.datepipe.transform(buyAmountVm.startDate, Constants.formats.yyyyMMdd);
      this.prepaidDetails.amount = buyAmountVm.amount;
      this.prepaidDetails.fromAccount = {
         accountNumber: buyAmountVm.selectedAccount.accountNumber,
         accountType: buyAmountVm.selectedAccount.accountType
      };
      if (buyForVm.notificationType !== Constants.notificationTypes.none) {
         const notification: IPaymentNotification = {
            notificationType: buyForVm.notificationType.toUpperCase(),
            notificationAddress: buyForVm.notificationInput,
         };
         this.prepaidDetails.notificationDetails = [notification];
      }
      if (buyAmountVm.recurrenceFrequency
         && buyAmountVm.recurrenceFrequency !== Constants.VariableValues.paymentRecurrenceFrequency.none.text) {
         if (buyAmountVm.repeatType !== Constants.VariableValues.endDateRepeatType) {
            this.prepaidDetails.reoccurrenceItem = {
               reoccSubFreqVal: this.getRecurrenceSubFrequency(buyAmountVm.recurrenceFrequency,
                  buyAmountVm.startDate),
               reoccurrenceOccur: +buyAmountVm.numRecurrence,
               reoccurrenceFrequency: buyAmountVm.recurrenceFrequency
            };
         } else {
            this.prepaidDetails.reoccurrenceItem = {
               reoccSubFreqVal: this.getRecurrenceSubFrequency(buyAmountVm.recurrenceFrequency,
                  buyAmountVm.startDate),
               reoccurrenceToDate: this.datepipe.transform(buyAmountVm.endDate, Constants.formats.yyyyMMdd),
               reoccurrenceFrequency: buyAmountVm.recurrenceFrequency
            };
         }
      }
      this.prepaidDetails.serviceProvider = buyToVm.serviceProvider;
      this.prepaidDetails.destinationNumber = buyToVm.mobileNumber;
      this.prepaidDetails.productCode = buyAmountVm.productCode;
      this.prepaidDetails.isVoucherAmount = this.getVoucherValue(buyAmountVm, buyToVm);
      this.prepaidDetails.favourite = false;
      this.prepaidDetails.myDescription = buyForVm.yourReference;
      this.prepaidDetails.saveBeneficiary = buyReviewVm.isSaveBeneficiary;

      if (buyToVm.beneficiaryID) {
         this.prepaidDetails.beneficiaryID = buyToVm.beneficiaryID;
      }
      if (this.prepaidDetails.saveBeneficiary) {
         this.prepaidDetails.bFName = CommonUtility.replaceAccentCharacters(buyToVm.recipientName);
      }
      return this.prepaidDetails;
   }
   getVoucherValue(buyAmount, buyTo) {
      // For Airtime
      if (buyAmount.productCode === Constants.labels.buyLabels.buyAmountLabels.AirtimeProductCode) {
         // For TLK provider return true
         if (buyTo.serviceProvider === Constants.labels.buyLabels.tlkProviderCode) {
            return true;
         } else {
            if (buyAmount.bundleType !== Constants.labels.buyLabels.buyAmountLabels.ownAmount) {
               return true; // if not own amount (custom)
            } else {
               return false; // if custom amount
            }
         }
      } else {
         return true; // For data and sms always return true
      }
   }
   getRecurrenceSubFrequency(paymentFrequency: string, paymentDate: Date): string {
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
   getServiceProvidersProducts(urlParam): Observable<IPrepaidServiceProviderProducts[]> {
      const routeParams = { provider: urlParam };
      return this.apiService.ServiceProvidersProducts.getAll({}, routeParams).map(response => response ? response.data : []);
   }

   getBuyForVm(): models.IBuyForVm {
      return this.buyWorkflowSteps.buyFor.model.getViewModel();
   }

   saveBuyForInfo(vm: models.IBuyForVm) {
      this.buyWorkflowSteps.buyFor.model.updateModel(vm);
      this.buyWorkflowSteps.buyFor.isNavigated = true;
   }
   saveBuyReviewInfo(vm) {
      this.buyWorkflowSteps.buyReview.model.updateModel(vm);
      this.buyWorkflowSteps.buyReview.isNavigated = true;
   }

   updateTransactionID(transactionID: string) {
      if (transactionID) {
         this.prepaidDetails.transactionID = transactionID;
         this.isPaymentSuccessful = true;
      }
   }
   updateexecEngineRef(execEngineRef: string) {
      this.execEngineRef = execEngineRef;
   }
   clearRechargePaymentDetails() {
      this.prepaidDetails = new models.BuyPrepaidDetail();
      this.isPaymentSuccessful = false;
   }

   getPaymentStatus() {
      return this.isPaymentSuccessful;
   }

   isPrepaidStatusValid(metadata: IPrepaidMetaData): boolean {
      let isValid = false;
      this.errorMessage = '';
      // check for transaction success
      if (metadata && metadata.resultData && metadata.resultData.length) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const transactionDetails = metadata.resultData[i].resultDetail
               .find(x => x.operationReference === Constants.metadataKeys.transaction);
            if (transactionDetails && transactionDetails.status !== Constants.metadataKeys.failure) {
               isValid = true;
               break;
            } else {
               if (transactionDetails) {
                  this.errorMessage = transactionDetails.reason;
               }
            }
         }
      }
      return isValid;
   }

   isTransferStatusNavigationAllowed(): boolean {
      return this.buyWorkflowSteps && this.buyWorkflowSteps.buyReview.isNavigated;
   }

   setSecureTransactionVerification(verificationId) {
      if (!this.prepaidDetails.secureTransaction) {
         this.prepaidDetails.secureTransaction = { verificationReferenceId: '' };
      }
      this.prepaidDetails.secureTransaction.verificationReferenceId = verificationId;
   }

   getApproveItStatus(): Observable<IOutOfBandResponse> {

      this.buyWorkflowSteps.buyTo.isDirty = false;

      return this.apiService.PrepaidStatus.create(
         null,
         null,
         { verificationId: this.getPrepaidDetailInfo().transactionID });

   }

   getApproveItOtpStatus(tvsCode: string, referenceId: string): Observable<IOutOfBandResponse> {

      this.buyWorkflowSteps.buyTo.isDirty = false;

      const request: IOutOfBandRequest = {
         transactionVerificationCode: tvsCode,
         verificationReferenceId: referenceId
      };

      return this.apiService.OutOfBandOtpStatus.create(request);
   }

   isBeneficiarySaved(approveItResponse) {
      const buyReviewVm = this.getBuyReviewVm();
      if (buyReviewVm.isSaveBeneficiary && approveItResponse && approveItResponse.metadata) {
         const resp = CommonUtility.getTransactionStatus(approveItResponse.metadata, Constants.metadataKeys.beneficiarySaved);
         if (!resp.isValid) {
            this.errorMessage = this.errorMessage || resp.reason || Constants.labels.BenificiaryErrorMsg;
         }
      }
   }

   refreshAccounts() {
      this.apiService.refreshAccounts.getAll().subscribe();
   }

   redirecttoStatusPage() {
      this.isNoResponseReceived = true;
      this.isPaymentSuccessful = false;
      this.router.navigateByUrl(Constants.routeUrls.buyStatus);

   }

}

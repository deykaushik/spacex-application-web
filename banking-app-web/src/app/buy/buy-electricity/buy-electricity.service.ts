
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as models from './buy-electricity.models';
import { BuyElectricityToModel } from './buy-electricity-to/buy-electricity-to.model';
import { BuyElectricityReviewModel } from './buy-electricity-review/buy-electricity-review.model';
import { BuyElectricityAmountModel } from './buy-electricity-amount/buy-electricity-amount.model';
import { BuyElectricityForModel } from './buy-electricity-for/buy-electricity-for.model';

import {
   IServiceProvider, IPaymentNotification, IErrorEmitterResponse,
   IBuyElectricityDetailWithGUID, IBuyElectricityMeterValidationDetailsWithGUID, IBuyElectricityAmountInArrearsDetails,
   IBuyElectricityAmountInArrearsDetailsWithGUID
} from './../../core/services/models';
import { IWorkflowStep, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';

import { IBuyElectricityAccountDetail } from './../../core/services/models';
import {
   IBuyElectricityDetail, IBuyElectricityMetaData, IBuyElectricityMeterValidationDetails,
   IBuyElectricityMeterValidationMetaData,
   IBuyElectricityLimitDetail, IAccountDetail
} from './../../core/services/models';

import { ApiService } from '../../core/services/api.service';
import { IApiResponse, IOutOfBandResponse, IOutOfBandRequest } from './../../core/services/models';
import { IWorkflowService } from './../../shared/components/work-flow/work-flow.models';
import { Constants } from '../../core/utils/constants';
import { BuyElectricityStep } from './buy-electricity.models';
import { CommonUtility } from '../../core/utils/common';
import { Router } from '@angular/router';
import { SystemErrorService } from '../../core/services/system-services.service';
import { UUID } from 'angular2-uuid';

@Injectable()
export class BuyElectricityService implements IWorkflowService {
   public electricityWorkflowSteps: models.IBuyElectricityWorkflowSteps;
   public electricityDetails: models.BuyElectricityDetail;
   public elctricityMeterValidationDetails: models.BuyElectricityMeterValidationDetails;
   public electricityAmountInArrearsDetails: models.BuyElectricityAmountInArrearsDetails;
   public isPaymentSuccessful = false;
   public meterValidationProductCode = 'FBE';
   public isFBE = false;
   public isFBEClaimed = false;
   public errorMessage?: string;
   public requestid: string;
   public isNoResponseReceived = false;
   public buyToNextButton = {
      text: Constants.labels.nextText
   };

   accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   callbackFromSystemService: EventEmitter<IErrorEmitterResponse> = new EventEmitter<IErrorEmitterResponse>();
   execEngineRef: string;


   constructor(private apiService: ApiService, private datepipe: DatePipe,
      public router: Router, private systemErrorService: SystemErrorService) {

   }
   checkDirtySteps() {
      return this.electricityWorkflowSteps.buyTo.isDirty && !this.electricityWorkflowSteps.buyReview.isDirty;
   }

   // work flow methods
   initializeBuyElectricityWorkflow() {
      this.electricityWorkflowSteps = {
         buyTo: {
            isNavigated: false,
            sequenceId: models.BuyElectricityStep.buyTo,
            model: new BuyElectricityToModel(),
            isDirty: false
         },
         buyAmount: {
            isNavigated: false,
            sequenceId: models.BuyElectricityStep.buyAmount,
            model: new BuyElectricityAmountModel(),
            isDirty: false
         },
         buyFor: {
            isNavigated: false,
            sequenceId: models.BuyElectricityStep.buyFor,
            model: new BuyElectricityForModel(),
            isDirty: false
         },
         buyReview: {
            isNavigated: false,
            sequenceId: models.BuyElectricityStep.review,
            model: new BuyElectricityReviewModel(),
            isDirty: false
         }
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
      this.fbeButtonTextChange(false);
   }

   getStepInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, false);
   }

   getStepInitialInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, true);
   }

   getStepSummary(stepId: number, isDefault: boolean): IWorkflowStepSummary {
      const stepSummary: IWorkflowStepSummary = {
         isNavigated: false,
         sequenceId: 0,
         title: null
      };
      let isNavigated = true;
      switch (stepId) {
         case BuyElectricityStep.buyTo:
            isNavigated = this.electricityWorkflowSteps.buyTo.isNavigated;
            stepSummary.title = this.electricityWorkflowSteps.buyTo.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.electricityWorkflowSteps.buyTo.isNavigated;
            stepSummary.sequenceId = BuyElectricityStep.buyTo;
            break;
         case BuyElectricityStep.buyAmount:
            isNavigated = this.electricityWorkflowSteps.buyAmount.isNavigated;
            stepSummary.title = this.electricityWorkflowSteps.buyAmount.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.electricityWorkflowSteps.buyAmount.isNavigated;
            stepSummary.sequenceId = BuyElectricityStep.buyAmount;
            break;
         case BuyElectricityStep.buyFor:
            isNavigated = this.electricityWorkflowSteps.buyFor.isNavigated;
            stepSummary.title = this.electricityWorkflowSteps.buyFor.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.electricityWorkflowSteps.buyFor.isNavigated;
            stepSummary.sequenceId = BuyElectricityStep.buyFor;
            break;
         case BuyElectricityStep.review:
            stepSummary.title = this.electricityWorkflowSteps.buyReview.model.getStepTitle();
            stepSummary.isNavigated = this.electricityWorkflowSteps.buyReview.isNavigated;
            stepSummary.sequenceId = BuyElectricityStep.review;
            break;
         default:
            throw new Error('no matching step found!');
      }
      return stepSummary;
   }

   getElectricityLimits(): Observable<IBuyElectricityLimitDetail[]> {
      return this.apiService.PrepaidLimit.getAll().map(response => response ? response.data : []);
   }

   getBuyElectricityToVm(): models.IBuyElectricityToVm {
      return this.electricityWorkflowSteps.buyTo.model.getViewModel();
   }
   saveBuyElectricityToInfo(vm: models.IBuyElectricityToVm) {
      this.electricityWorkflowSteps.buyTo.model.updateModel(vm);
      this.electricityWorkflowSteps.buyTo.isNavigated = true;
   }

   getBuyElectricityAmountVm(): models.IBuyElectricityAmountVm {
      return this.electricityWorkflowSteps.buyAmount.model.getViewModel();
   }
   saveBuyElectricityAmountInfo(vm: models.IBuyElectricityAmountVm) {
      this.electricityWorkflowSteps.buyAmount.model.updateModel(vm);
      this.electricityWorkflowSteps.buyAmount.isNavigated = true;
   }

   getBuyElectricityForVm(): models.IBuyElectricityForVm {
      return this.electricityWorkflowSteps.buyFor.model.getViewModel();
   }
   saveBuyElectricityForInfo(vm: models.IBuyElectricityForVm) {
      this.electricityWorkflowSteps.buyFor.model.updateModel(vm);
      this.electricityWorkflowSteps.buyFor.isNavigated = true;
   }

   validateMeter(validate = true): Observable<IBuyElectricityMeterValidationMetaData> {
      const query = { validate: validate };
      return this.apiService.BuyElectricityMeterValidation.create(this.getBuyElectricityMeterValidationDetailsInfoWithGuid(),
         query).map((response) => response.metadata);
   }

   getElectricityBillDetails(): Observable<IBuyElectricityAmountInArrearsDetailsWithGUID> {
      const query = { validate: true };
      return this.apiService.BuyElectricityMeterValidation.create(this.getBuyElectricityAmountInArrearsDetailsInfoWithGuid(),
         query).map((response) => response.data);
   }

   private getBuyElectricityMeterValidationDetailsInfoWithGuid(): IBuyElectricityMeterValidationDetailsWithGUID {
      const ElectricityMeterValidationDetailsWithGUID = new models.BuyElectricityMeterValidationDetailsWithGUID;
      ElectricityMeterValidationDetailsWithGUID.requestId = UUID.UUID();
      ElectricityMeterValidationDetailsWithGUID.prepaids = [this.getBuyElectricityMeterValidationDetailsInfo()];
      return ElectricityMeterValidationDetailsWithGUID;
   }
   private getBuyElectricityAmountInArrearsDetailsInfoWithGuid(): IBuyElectricityMeterValidationDetailsWithGUID {
      const ElectricityMeterValidationDetailsWithGUID = new models.BuyElectricityMeterValidationDetailsWithGUID;
      ElectricityMeterValidationDetailsWithGUID.requestId = UUID.UUID();
      ElectricityMeterValidationDetailsWithGUID.prepaids = [this.getBuyElectricityAmountInArrearsDetailsInfo()];
      return ElectricityMeterValidationDetailsWithGUID;
   }
   createGuID() {
      this.requestid = UUID.UUID();
   }


   private getBuyElectricityDetailsInfoWithGUID(argisFBE: boolean, payToViewModel: models.IBuyElectricityToVm)
      : IBuyElectricityDetailWithGUID {

      const prepaids = !argisFBE ? [this.getBuyElectricityDetailsInfo()] : [this.getFBEPayload(payToViewModel)];
      const electricityDetailsWithGUID = new models.BuyElectricityDetailWithGUID;
      electricityDetailsWithGUID.requestId = this.requestid;
      electricityDetailsWithGUID.prepaids = prepaids;
      return electricityDetailsWithGUID;
   }

   getBuyElectricityDetailsInfo(): IBuyElectricityDetail {
      const buyElectricityToVm = this.getBuyElectricityToVm();
      const buyElectricityForVm = this.getBuyElectricityForVm();
      const buyElectricityAmountVm = this.getBuyElectricityAmountVm();
      const buyElectricityReviewVm = this.getBuyElectricityReviewVm();
      if (!this.electricityDetails) {
         this.electricityDetails = new models.BuyElectricityDetail;
      }
      this.electricityDetails.startDate = this.datepipe.transform(new Date(), Constants.formats.yyyyMMdd);
      this.electricityDetails.amount = buyElectricityAmountVm.amount;
      this.electricityDetails.fromAccount = {
         accountNumber: buyElectricityAmountVm.selectedAccount.accountNumber,
         accountType: buyElectricityAmountVm.selectedAccount.accountType
      };
      this.electricityDetails.serviceProvider = buyElectricityToVm.serviceProvider;
      this.electricityDetails.destinationNumber = buyElectricityToVm.meterNumber;
      this.electricityDetails.productCode = buyElectricityToVm.productCode;
      this.electricityDetails.myDescription = buyElectricityForVm.yourReference;
      this.electricityDetails.saveBeneficiary = buyElectricityReviewVm.isSaveBeneficiary;
      if (buyElectricityForVm.notificationType !== Constants.notificationTypes.none) {
         const notification: IPaymentNotification = {
            notificationType: buyElectricityForVm.notificationType.toUpperCase(),
            notificationAddress: buyElectricityForVm.notificationInput,
         };
         this.electricityDetails.notificationDetails = [notification];
      }
      if (buyElectricityToVm.beneficiaryID) {
         this.electricityDetails.beneficiaryID = buyElectricityToVm.beneficiaryID;
      }
      if (this.electricityDetails.saveBeneficiary) {
         this.electricityDetails.bFName = CommonUtility.replaceAccentCharacters(buyElectricityToVm.recipientName);
      }
      return this.electricityDetails;
   }

   getBuyElectricityMeterValidationDetailsInfo(): IBuyElectricityMeterValidationDetails {
      const buyElectricityToVm = this.getBuyElectricityToVm();
      if (!this.elctricityMeterValidationDetails) {
         this.elctricityMeterValidationDetails = new models.BuyElectricityMeterValidationDetails;
      }
      this.elctricityMeterValidationDetails.serviceProvider = buyElectricityToVm.serviceProvider;
      this.elctricityMeterValidationDetails.destinationNumber = buyElectricityToVm.meterNumber;
      this.elctricityMeterValidationDetails.productCode = this.meterValidationProductCode;
      return this.elctricityMeterValidationDetails;
   }

   getBuyElectricityAmountInArrearsDetailsInfo(): IBuyElectricityMeterValidationDetails {
      const buyElectricityAmountVm = this.getBuyElectricityAmountVm();
      const buyElectricityToVm = this.getBuyElectricityToVm();
      if (!this.electricityAmountInArrearsDetails) {
         this.electricityAmountInArrearsDetails = new models.BuyElectricityAmountInArrearsDetails;
      }
      this.electricityAmountInArrearsDetails.serviceProvider = buyElectricityToVm.serviceProvider;
      this.electricityAmountInArrearsDetails.destinationNumber = buyElectricityToVm.meterNumber;
      this.electricityAmountInArrearsDetails.productCode = buyElectricityToVm.productCode;
      this.electricityAmountInArrearsDetails.amount = buyElectricityAmountVm.amount;
      this.electricityAmountInArrearsDetails.fromAccount = new models.BuyFromAccount(buyElectricityAmountVm.
         selectedAccount.accountNumber);
      return this.electricityAmountInArrearsDetails;
   }

   getBuyElectricityReviewVm(): models.IBuyElectricityReviewVm {
      return this.electricityWorkflowSteps.buyReview.model.getViewModel();
   }

   getFBEPayload(payToViewModel: models.IBuyElectricityToVm): IBuyElectricityDetail {
      return {
         destinationNumber: payToViewModel.meterNumber,
         serviceProvider: payToViewModel.serviceProvider,
         productCode: 'FBE'
      };
   }

   saveBuyElectricityReviewInfo(vm: models.IBuyElectricityReviewVm) {
      this.electricityWorkflowSteps.buyReview.model.updateModel(vm);
      this.electricityWorkflowSteps.buyReview.isNavigated = true;
   }

   makeElectricityPayment(validate: boolean, isFBE: boolean = false): Observable<IBuyElectricityMetaData> {
      if (validate) {
         this.electricityDetails = null;
      }
      let buyElectricityApi: Observable<IBuyElectricityMetaData>;
      const payToViewModel: models.IBuyElectricityToVm = this.getBuyElectricityToVm();
      const buyElectricityDetails: IBuyElectricityDetailWithGUID = this.getBuyElectricityDetailsInfoWithGUID(isFBE, payToViewModel);

      buyElectricityApi = this.apiService.MakeElectricityPayment.create(buyElectricityDetails,
         { validate: validate }).map((response) => {
            return response.metadata;
         });

      return buyElectricityApi;
   }

   isElectricityPaymentStatusValid(metadata: IBuyElectricityMetaData): boolean {
      let isValid = false;
      this.errorMessage = '';
      if (metadata && metadata.resultData && metadata.resultData.length) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const transactionDetails = metadata.resultData[i].resultDetail
               .find(x => x.operationReference === Constants.metadataKeys.transaction);

            if (transactionDetails.status !== Constants.metadataKeys.failure) {
               isValid = true;
               break;
            } else {
               this.errorMessage = transactionDetails.reason;
            }

         }
      }
      return isValid;
   }

   isFBETransactionValid(data) {
      return data.resultData[0].transactionID &&
         data.resultData[0].transactionID.length &&
         parseInt(data.resultData[0].transactionID, 10) > 0 &&
         data.resultData[0].resultDetail[0].operationReference === Constants.metadataKeys.transaction &&
         data.resultData[0].resultDetail[0].status === Constants.metadataKeys.success;
   }

   updateTransactionID(transactionID: string) {
      if (!this.electricityDetails) {
         this.electricityDetails = new models.BuyElectricityDetail;
      }
      if (transactionID) {
         this.electricityDetails.transactionID = transactionID;
         this.isPaymentSuccessful = true;
      }
   }
   updateexecEngineRef(execEngineRef: string) {
      this.execEngineRef = execEngineRef;
   }
   updateFBETransactionID(transactionID: string) {
      if (!this.electricityDetails) {
         this.electricityDetails = new models.BuyElectricityDetail;
      }
      if (transactionID) {
         this.electricityDetails.fbeTransactionId = transactionID;
         this.isPaymentSuccessful = true;
      }
   }

   clearElectricityPaymentDetails() {
      this.electricityDetails = new models.BuyElectricityDetail();
      this.isPaymentSuccessful = false;
   }

   isPaymentStatusNavigationAllowed(): boolean {
      return this.electricityWorkflowSteps && this.electricityWorkflowSteps.buyReview.isNavigated;
   }

   getPaymentStatus() {
      return this.isPaymentSuccessful;
   }

   fbeClaimed(transactionID: string, vmBuyTo: models.IBuyElectricityToVm) {
      const queryString = { electricityType: 'FBE' };
      const routeParams = { transactionID: transactionID };

      return this.apiService.ElectricityMeterVouchers.getAll(queryString, routeParams)
         .map((response) => {
            vmBuyTo.fbeClaimedDate = new Date();
            const totalElectricityUnits = response.data[0].tokenDetail
               .reduce((a, b) => {
                  return { electricityUnits: a.electricityUnits + b.electricityUnits };
               });
            vmBuyTo.fbeElectricityUnits = totalElectricityUnits.electricityUnits;
            vmBuyTo.fbeTransactionID = transactionID;
            vmBuyTo.fbeRecipientName = response.data[0].customerName;

            this.saveBuyElectricityToInfo(vmBuyTo);
            this.isFBEClaimed = true;
            this.isPaymentSuccessful = true;
            return response.data;
         });
   }

   fbeClaimedUnsuccessful(vmBuyTo: models.IBuyElectricityToVm, reason?: string) {
      vmBuyTo.fbeClaimedDate = new Date();
      vmBuyTo.fbeElectricityUnits = 0;
      vmBuyTo.fbeTransactionID = '0';
      this.saveBuyElectricityToInfo(vmBuyTo);
      this.errorMessage = reason;
      this.isFBEClaimed = true;
      this.isPaymentSuccessful = false;
   }

   isFBEClaim(): boolean {
      return this.isFBEClaimed;
   }

   fbeButtonTextChange(isFBE: boolean) {
      this.buyToNextButton.text = isFBE ? Constants.labels.fbeRedeem : Constants.labels.nextText;
   }

   getApproveItStatus(): Observable<IOutOfBandResponse> {

      this.electricityWorkflowSteps.buyTo.isDirty = false;

      return this.apiService.PrepaidStatus.create(
         null,
         null,
         { verificationId: this.electricityDetails.transactionID });

   }

   getApproveItOtpStatus(tvsCode: string, referenceId: string): Observable<IOutOfBandResponse> {

      this.electricityWorkflowSteps.buyTo.isDirty = false;

      const request: IOutOfBandRequest = {
         transactionVerificationCode: tvsCode,
         verificationReferenceId: referenceId
      };

      return this.apiService.OutOfBandOtpStatus.create(request);
   }

   isBeneficiarySaved(approveItResponse) {
      const buyElectricityReviewVm = this.getBuyElectricityReviewVm();
      if (buyElectricityReviewVm.isSaveBeneficiary && approveItResponse && approveItResponse.metadata) {
         const resp = CommonUtility.getTransactionStatus(approveItResponse.metadata, 'BENEFICIARYSAVED');
         if (!resp.isValid) {
            this.errorMessage = this.errorMessage || resp.reason || Constants.labels.BenificiaryErrorMsg;
         }
      }
   }
   refreshAccounts() {
      this.apiService.refreshAccounts.getAll().subscribe();
   }

   // raise error to system message control
   raiseSystemError(isCallback: boolean = false) {
      if (isCallback) {
         const callback = this.callbackFromSystemService.subscribe((response: IErrorEmitterResponse) => {
            callback.unsubscribe();
            this.clearElectricityPaymentDetails();
            this.router.navigateByUrl(Constants.routeUrls.dashboard);
         });
      }
      this.systemErrorService.raiseError({
         error: Constants.VariableValues.sytemErrorMessages.transactionMessage,
         callbackEmitter: isCallback && this.callbackFromSystemService
      });
   }
   redirecttoStatusPage() {
      this.isNoResponseReceived = true;
      this.isPaymentSuccessful = false;
      this.router.navigateByUrl(Constants.routeUrls.buyElectricityStatus);

   }
}

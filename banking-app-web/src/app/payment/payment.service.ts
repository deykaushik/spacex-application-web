import { DatePipe } from '@angular/common';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as models from './payment.models';
import { Constants } from './../core/utils/constants';
import { Api } from '../core/services/api';
import { ApiService } from './../core/services/api.service';
import { PayAmountModel } from './pay-amount/pay-amount.model';
import { PayForModel } from './pay-for/pay-for.model';
import { PayReviewModel } from './pay-review/pay-review.model';
import { PayToModel } from './pay-to/pay-to.model';

import {
   IApiResponse, IAccountDetail, ILimitDetail, IBank, IPaymentDetail,
   IPaymentMetaData, IPublicHoliday, IOutOfBandResponse, IOutOfBandRequest,
   CountryDetail, IRemittanceAvailabilityStatus, IPaymentNotification, IErrorEmitterResponse, IPaymentDetailWithGUID, IPrepaidDetailWithGUID
} from './../core/services/models';
import { IWorkflowStepSummary, IWorkflowStep } from '../shared/components/work-flow/work-flow.models';
import { PaymentStep, IPayToVm } from './payment.models';
import { IWorkflowService } from './../shared/components/work-flow/work-flow.models';
import { CommonUtility } from './../core/utils/common';
import { PaymentType } from '../core/utils/enums';
import { Router } from '@angular/router';
import { SystemErrorService } from '../core/services/system-services.service';
import { UUID } from 'angular2-uuid';


@Injectable()
export class PaymentService implements IWorkflowService {
   public paymentWorkflowSteps: models.IPaymentWorkflowSteps;
   public paymentDetails: IPaymentDetail;
   makePaymentApi: Api<IPaymentDetail>;
   public isPaymentSuccessful = false;
   public isAPIFailure = false;
   public errorMessage?: string;
   accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   casaAccountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   countryListObserver = new BehaviorSubject<CountryDetail[]>(null);
   isInvalidRecipientSaved: string;
   convertStringToNumber = CommonUtility.convertStringToNumber;
   callbackFromSystemService: EventEmitter<IErrorEmitterResponse> = new EventEmitter<IErrorEmitterResponse>();
   public paymentNotice?: string;
   public paymentDetailswithGUID: IPaymentDetailWithGUID;
   public prepaidDetailswithGUID: IPrepaidDetailWithGUID;
   public paymentGUID?= '';

   constructor(private apiService: ApiService, private datepipe: DatePipe,
      public router: Router, private systemErrorService: SystemErrorService) {
   }

   // API methods start
   getActiveAccounts(): Observable<IAccountDetail[]> {
      return this.apiService.PaymentAccounts.getAll().map(response => {
         return response ? response.data : [];
      });
   }

   getActiveCasaAccounts(): Observable<IAccountDetail[]> {
      return this.apiService.PaymentAccounts.getAll({ remittance: true }).map(response => {
         return response ? response.data : [];
      });
   }

   getCountryList(): Observable<CountryDetail[]> {
      return this.apiService.CountryList.getAll().map(response => {
         return response ? response.data : [];
      });
   }

   getPaymentLimits(): Observable<ILimitDetail[]> {
      return this.apiService.PaymentLimits.getAll().map((response) => response ? response.data : []);
   }

   makePayment(validate = true): Observable<IPaymentMetaData> {
      let paymentApi: Observable<IPaymentMetaData>;
      if (validate) {
         this.paymentDetails = null;
      }
      const payToViewModel: models.IPayToVm = this.getPayToVm(),
         paymentDetails: IPaymentDetail = this.getPaymentDetailInfo();

      if (payToViewModel.paymentType === PaymentType.account ||
         payToViewModel.paymentType === PaymentType.creditCard) {
         paymentApi = this.apiService.MakeAccountPayment.create(this.getPaymentDetailInfowithGUID(paymentDetails),
            { validate: validate }).map((response) => {
               return response.metadata;
            });
      } else if (payToViewModel.paymentType === PaymentType.mobile) {
         paymentApi = this.apiService.MakeMobilePayment.create(this.getPrepaidDetailInfowithGUID(paymentDetails),
            { validate: validate }).map((response) => {
               return response.metadata;
            });
      } else if (payToViewModel.paymentType === PaymentType.foreignBank) {
         paymentApi = this.apiService.MakeforeignPayment.create(paymentDetails,
            { validate: validate }).map((response) => {
               return response.metadata;
            });
      }
      return paymentApi;
   }

   createGUID() {
      this.paymentGUID = UUID.UUID();
   }
   getBanks(): Observable<IBank[]> {
      return this.apiService.Banks.getAll().map(response =>
         response ? CommonUtility.sortByKey(response.data, 'bankName') : []);
   }

   getPublicHolidays(): Observable<IPublicHoliday[]> {
      return this.apiService.PublicHolidays.getAll().map(response => response ? response.data : []);
   }
   getCasaAccounts(): Observable<IAccountDetail[]> {
      return this.apiService.casaAccounts.getAll().map(response => {
         return response ? response.data : [];
      });
   }
   // API methods end

   // work flow methods
   initializePaymentWorkflow() {
      this.initializePaymentWorkflowSteps();
      this.getActiveAccounts().subscribe(accountResponse => {
         const response = accountResponse;
         this.updateAccountData(response);
      });
      // this needs to be removed when api is available
      const payToVm = this.getPayToVm();
      if (payToVm.isCrossBorderAllowed) {
         this.getCountryList().subscribe(countryListResponse => {
            const response = countryListResponse;
            this.updateCountryList(response);
         });
      }

   }

   initializePaymentWorkflowSteps() {
      this.paymentWorkflowSteps = {
         payTo: {
            isNavigated: false,
            sequenceId: models.PaymentStep.payTo,
            model: new PayToModel(),
            isDirty: false
         },
         payAmount: {
            isNavigated: false,
            sequenceId: models.PaymentStep.payAmount,
            model: new PayAmountModel(),
            isDirty: false
         },
         payFor: {
            isNavigated: false,
            sequenceId: models.PaymentStep.payFor,
            model: new PayForModel(),
            isDirty: false
         },
         payReview: {
            isNavigated: false,
            sequenceId: models.PaymentStep.review,
            model: new PayReviewModel(),
            isDirty: false
         }
      };
   }

   updateAccountData(accounts: IAccountDetail[]) {
      this.accountsDataObserver.next(accounts);
      this.casaAccountsDataObserver.next(accounts);
   }

   updateCountryList(CountryList: CountryDetail[]) {
      this.countryListObserver.next(CountryList);
   }

   refreshAccountData() {
      this.accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
      this.casaAccountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   }

   isMobilePayment(): boolean {
      return this.paymentWorkflowSteps.payTo.model.paymentType === PaymentType.mobile;
   }

   isAccountPayment(): boolean {
      return this.paymentWorkflowSteps.payTo.model.paymentType === PaymentType.account ||
         this.paymentWorkflowSteps.payTo.model.paymentType === PaymentType.foreignBank;
   }

   getPayToVm(): models.IPayToVm {
      return this.paymentWorkflowSteps.payTo.model.getViewModel();
   }

   savePayToInfo(vm: models.IPayToVm) {
      this.paymentWorkflowSteps.payTo.model.updateModel(vm);
      this.paymentWorkflowSteps.payTo.isNavigated = true;
   }

   getPayAmountVm(): models.IPayAmountVm {
      return this.paymentWorkflowSteps.payAmount.model.getViewModel();
   }

   savePayAmountInfo(vm: models.IPayAmountVm) {
      this.paymentWorkflowSteps.payAmount.model.updateModel(vm);
      this.paymentWorkflowSteps.payAmount.isNavigated = true;
   }

   getPayForVm(): models.IPayForVm {
      return this.paymentWorkflowSteps.payFor.model.getViewModel();
   }

   savePayForInfo(vm: models.IPayForVm) {
      this.paymentWorkflowSteps.payFor.model.updateModel(vm);
      this.paymentWorkflowSteps.payFor.isNavigated = true;
   }

   getPayReviewVm(): models.IPayReviewVm {
      return this.paymentWorkflowSteps.payReview.model.getViewModel();
   }

   savePayReviewInfo(vm: models.IPayReviewVm) {
      this.paymentWorkflowSteps.payReview.model.updateModel(vm);
      this.paymentWorkflowSteps.payReview.isNavigated = true;
   }

   getforeignPaymentDetailInfo(): IPaymentDetail {
      const payToViewModel = this.paymentWorkflowSteps.payTo.model.getViewModel(),
         payAmountViewModel = this.paymentWorkflowSteps.payAmount.model.getViewModel(),
         payForViewModel = this.paymentWorkflowSteps.payFor.model.getViewModel(),
         payReviewViewModel = this.paymentWorkflowSteps.payReview.model.getViewModel();
      const foreignpaymentDetails = {
         'remittanceInstruction':
         {
            'beneficiaryInfo': {
               'beneficiaryAccount': payToViewModel.accountNumber,
               'beneficiaryCountry': payToViewModel.crossBorderPayment.country.code, // code
               'beneficiaryInstitution': payToViewModel.crossBorderPayment.bank.bankName,
               'beneficiaryName': payToViewModel.crossBorderPayment.beneficiaryDetails.beneficiaryAccountName, // name
               'beneficiarySurname': payToViewModel.crossBorderPayment.beneficiaryDetails.beneficiaryAccountName, // name
               'beneficiaryIdentification': payToViewModel.crossBorderPayment.personalDetails.idPassportNumber,
               'beneficiaryAmount': payAmountViewModel.beneficiaryAmount,
               'beneficiaryCurrency': payToViewModel.crossBorderPayment.beneficiaryDetails.beneficiaryCurrency,
               'checkReference': payToViewModel.crossBorderPayment.beneficiaryDetails.checkReference, // Name Api check ref
               'physicalAddress': {
                  'addressLine1': payToViewModel.crossBorderPayment.personalDetails.recipientAddress,
                  'addressLine2': '',
                  'suburb': '',
                  'city': payToViewModel.crossBorderPayment.personalDetails.recipientCityVillage,
                  'province': payToViewModel.crossBorderPayment.personalDetails.recipientStateProvince,
                  'postCode': payToViewModel.crossBorderPayment.personalDetails.recipientZip,
                  'country': payToViewModel.crossBorderPayment.country.code
               },
               'beneficiaryGender': payToViewModel.crossBorderPayment.personalDetails.gender
            },
            'senderInfo': {
               'senderAccount': payAmountViewModel.selectedAccount.accountNumber,
               'senderAccountName': payAmountViewModel.selectedAccount.nickname,
               'residentialStatus': payToViewModel.crossBorderPayment.beneficiaryDetails.residentialStatus, // name api
               'senderPhone': this.formatMobileNumber(payForViewModel.crossBorderSmsNotificationInput)
            },
            'paymentInfo': {
               'paymentNarration': payForViewModel.yourReference,
               'paymentAmount': this.convertStringToNumber(String(payAmountViewModel.transferAmount)), // input beneficairy amount
               'paymentCurrency': payAmountViewModel.selectedCurrency.trim(), // selected from drop down
               'paymentExchangeRate': payAmountViewModel.paymentExchangeRate.toString(),
               'balanceOfPaymentCategory': payForViewModel.paymentReason.code, // code
               'beneficiaryNarration': payForViewModel.theirReference
            },
         },
         'transactionID': payToViewModel.crossBorderPayment.beneficiaryDetails.transactionID
      };
      return foreignpaymentDetails;
   }

   formatMobileNumber(number: String): string {
      return Constants.VariableValues.countryCode + number.substr(-Constants.VariableValues.phoneNumberLength);
   }

   getPaymentDetailInfo(): IPaymentDetail {
      const payToViewModel = this.paymentWorkflowSteps.payTo.model.getViewModel(),
         payAmountViewModel = this.paymentWorkflowSteps.payAmount.model.getViewModel(),
         payForViewModel = this.paymentWorkflowSteps.payFor.model.getViewModel(),
         payReviewViewModel = this.paymentWorkflowSteps.payReview.model.getViewModel();

      if (!this.paymentDetails) {
         this.paymentDetails = new models.PaymentDetail();
      }
      if (payToViewModel.paymentType === PaymentType.foreignBank) {
         return this.getforeignPaymentDetailInfo();
      }
      this.paymentDetails.startDate = this.datepipe.transform(payAmountViewModel.paymentDate, Constants.formats.yyyyMMdd);
      this.paymentDetails.myDescription = payForViewModel.yourReference;
      this.paymentDetails.amount = payAmountViewModel.transferAmount;
      this.paymentDetails.fromAccount = {
         accountNumber: payAmountViewModel.selectedAccount.accountNumber,
         accountType: payAmountViewModel.selectedAccount.accountType
      };

      if (payForViewModel.notification.name !== Constants.notificationTypes.none) {
         const notification: IPaymentNotification = {
            notificationType: payForViewModel.notification.name.toUpperCase(),
            notificationAddress: payForViewModel.notificationInput,
         };
         this.paymentDetails.notificationDetails = [notification];
      }

      this.paymentDetails.saveBeneficiary = payReviewViewModel.isSaveBeneficiary;
      this.paymentDetails.bFName = CommonUtility.replaceAccentCharacters(payToViewModel.recipientName);
      // do not set sortCode for payments to Nedbank
      if (payToViewModel.paymentType === PaymentType.account) {
         if (!CommonUtility.isNedBank(payToViewModel.bank && payToViewModel.bank.bankName)) {
            if (payToViewModel.branch && payToViewModel.branch.branchCode) {
               this.paymentDetails.sortCode = payToViewModel.branch.branchCode;
            } else {
               this.paymentDetails.sortCode = payToViewModel.bank && payToViewModel.bank.universalCode;
            }
         } else {
            this.paymentDetails.BFType = Constants.BeneficiaryType.Internal;
            this.paymentDetails.sortCode = CommonUtility.getNedbankSortCode(
               payToViewModel.accountNumber, payToViewModel.accountType || Constants.VariableValues.unknownAccountType);
         }
         this.paymentDetails.beneficiaryDescription = payForViewModel.theirReference;
         this.paymentDetails.instantPayment = payAmountViewModel.isInstantPay;
         this.paymentDetails.bank = payToViewModel.bankName;
         this.paymentDetails.toAccount = {
            accountNumber: payToViewModel.accountNumber,
            accountType: payToViewModel.accountType || Constants.VariableValues.unknownAccountType
         };
      } else if (payToViewModel.paymentType === PaymentType.mobile) {
         this.paymentDetails.destinationNumber = CommonUtility.tenDigitMobile(payToViewModel.mobileNumber);
         this.paymentDetails.isVoucherAmount = false;
      } else if (payToViewModel.paymentType === PaymentType.creditCard) {
         this.paymentDetails.beneficiaryDescription = payForViewModel.theirReference;
         this.paymentDetails.toAccount = {
            accountNumber: payToViewModel.creditCardNumber,
            accountType: Constants.VariableValues.accountTypes.creditCardAccountType.code
         };
      }
      if (payAmountViewModel.recurrenceFrequency !== Constants.VariableValues.paymentRecurrenceFrequency.none.code) {
         if (payAmountViewModel.repeatType !== Constants.VariableValues.endDateRepeatType) {
            this.paymentDetails.reoccurrenceItem = {
               reoccSubFreqVal: this.getPaymentRecurrenceSubFrequency(payAmountViewModel.recurrenceFrequency,
                  payAmountViewModel.paymentDate),
               reoccurrenceOccur: payAmountViewModel.numRecurrence,
               reoccurrenceFrequency: payAmountViewModel.recurrenceFrequency
            };
         } else {
            this.paymentDetails.reoccurrenceItem = {
               reoccSubFreqVal: this.getPaymentRecurrenceSubFrequency(payAmountViewModel.recurrenceFrequency,
                  payAmountViewModel.paymentDate),
               reoccurrenceToDate: this.datepipe.transform(payAmountViewModel.endDate, Constants.formats.yyyyMMdd),
               reoccurrenceFrequency: payAmountViewModel.recurrenceFrequency
            };
         }
      }
      // Original bank defined beneficiary
      if (payToViewModel.beneficiaryData && payToViewModel.beneficiaryData.bankDefinedBeneficiary) {
         if (payToViewModel.recipientName === payToViewModel.beneficiaryData.bankDefinedBeneficiary.bDFName) {
            this.paymentDetails.sortCode = (payToViewModel.beneficiaryData.bankDefinedBeneficiary.sortCode).toString();
            this.paymentDetails.toAccount = {
               accountNumber: payToViewModel.beneficiaryData.bankDefinedBeneficiary.bDFID,
               accountType: Constants.Recipient.bankApprovedAccountType
            };
         }
      } else if (payToViewModel.beneficiaryData && payToViewModel.beneficiaryData.contactCardDetails) {
         if (payToViewModel.recipientName === payToViewModel.beneficiaryData.contactCardDetails.cardDetails.beneficiaryName) {
            this.paymentDetails.beneficiaryID = (payToViewModel.beneficiaryData.contactCardDetails.cardDetails.beneficiaryID).toString();
         }
         // bank approved beneficiary which is saved from original bank approved beneficiary
         if (payToViewModel.beneficiaryData.contactCardDetails.cardDetails.beneficiaryType
            === Constants.Recipient.bankApprovedAccountType) {
            this.paymentDetails.toAccount.accountType = payToViewModel.beneficiaryData.contactCardDetails.cardDetails.beneficiaryType;
         }
      }
      // as per GD-6796, to pass BID=0 for once off
      if (!payToViewModel.isRecipientPicked) {
         this.paymentDetails.beneficiaryID = '0';
      }
      return this.paymentDetails;
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
         default:
            throw new Error('Invalid payment frequency for recurrence payment');
      }

      return dayOfrecurrence.toString();
   }

   updateTransactionID(transactionID: string) {
      if (transactionID) {
         this.paymentDetails.transactionID = transactionID;
         this.isPaymentSuccessful = true;
      }
   }
   updateexecEngineRef(execEngineRef: string) {
      this.paymentDetails.execEngineRef = execEngineRef;
   }
   isPaymentStatusValid(metadata: IPaymentMetaData): boolean {
      let isValid = false;
      this.errorMessage = '';
      // check for transaction success
      if (metadata && metadata.resultData && metadata.resultData.length) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const transactionDetails = metadata.resultData[i].resultDetail
               .find(x => x.operationReference === Constants.metadataKeys.transaction);

            if (transactionDetails.status !== Constants.metadataKeys.failure) {
               isValid = true;
               if (transactionDetails.result === Constants.labels.linkAccountLabels.linkSuccessfulCode
                  && transactionDetails.operationReference === Constants.metadataKeys.transaction) {
                  this.paymentNotice = transactionDetails.reason;
               }
               break;
            } else {
               this.errorMessage = transactionDetails.reason;
               break;
            }
         }
      }
      return isValid;
   }

   // for retry feature
   isPaymentPartialSuccess(metadata: IPaymentMetaData): boolean {
      let isPartialSuccess = false;
      if (this.isPaymentStatusValid(metadata)) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const transactionDetails = metadata.resultData[i].resultDetail
               .find(x => x.operationReference !== Constants.metadataKeys.transaction &&
                  x.status !== Constants.metadataKeys.success);

            if (transactionDetails) {
               isPartialSuccess = true;
               break;
            }
         }
      }
      return isPartialSuccess;
   }

   // allow navigation to status page only if user has attempted payment
   isPaymentStatusNavigationAllowed(): boolean {
      return this.paymentWorkflowSteps && this.paymentWorkflowSteps.payReview.isNavigated;
   }

   // clear payment details
   clearPaymentDetails() {
      this.paymentDetails = new models.PaymentDetail();
      this.isPaymentSuccessful = false;
   }

   clearPayToVm(payToVm: IPayToVm): void {
      this.paymentWorkflowSteps.payTo.model.clearModel(payToVm);
   }

   // reset models
   resetPaymentModels() {
      this.paymentWorkflowSteps.payAmount.model = new PayAmountModel();
      this.paymentWorkflowSteps.payTo.model = new PayToModel();
      this.paymentWorkflowSteps.payFor.model = new PayForModel();
      this.paymentWorkflowSteps.payReview.model = new PayReviewModel();
   }

   getStepSummary(stepId: number, isDefault: boolean): IWorkflowStepSummary {
      const stepSummary: IWorkflowStepSummary = {
         isNavigated: false,
         sequenceId: 0,
         title: null
      };
      let isNavigated = true;
      const payToVm = this.getPayToVm();
      switch (stepId) {
         case PaymentStep.payTo:
            isNavigated = this.paymentWorkflowSteps.payTo.isNavigated;
            stepSummary.title = this.paymentWorkflowSteps.payTo.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.paymentWorkflowSteps.payTo.isNavigated;
            stepSummary.sequenceId = PaymentStep.payTo;
            break;
         case PaymentStep.payAmount:
            isNavigated = this.paymentWorkflowSteps.payAmount.isNavigated;
            stepSummary.title = this.paymentWorkflowSteps.payAmount.model.getStepTitle
               (isNavigated, isDefault, payToVm.isCrossBorderPaymentActive);
            stepSummary.isNavigated = this.paymentWorkflowSteps.payAmount.isNavigated;
            stepSummary.sequenceId = PaymentStep.payAmount;
            break;
         case PaymentStep.payFor:
            isNavigated = this.paymentWorkflowSteps.payFor.isNavigated;
            stepSummary.title = this.paymentWorkflowSteps.payFor.model.getStepTitle
               (isNavigated, isDefault, payToVm.isCrossBorderPaymentActive);
            stepSummary.isNavigated = this.paymentWorkflowSteps.payFor.isNavigated;
            stepSummary.sequenceId = PaymentStep.payFor;
            break;
         case PaymentStep.review:
            stepSummary.title = this.paymentWorkflowSteps.payReview.model.getStepTitle();
            stepSummary.isNavigated = this.paymentWorkflowSteps.payReview.isNavigated;
            stepSummary.sequenceId = PaymentStep.review;
            break;
         default:
            throw new Error('no matching step found!');
      }
      return stepSummary;
   }
   checkDirtySteps() {
      const isPayToModelDirty = this.paymentWorkflowSteps.payTo.isDirty;
      const isPayAmountModelDirty = this.paymentWorkflowSteps.payAmount.isDirty;
      const isPayForModelDirty = this.paymentWorkflowSteps.payFor.isDirty;
      const isPayReviewModelDirty = this.paymentWorkflowSteps.payReview.isDirty;
      return ((isPayToModelDirty || isPayAmountModelDirty || isPayForModelDirty) && !isPayReviewModelDirty);
   }
   getStepInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, false);
   }
   getStepInitialInfo(currentStep: IWorkflowStep) {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, true);
   }
   handleMobilePayment() {
      const payForVm = this.paymentWorkflowSteps.payFor.model.getViewModel();
      payForVm.theirReference = '';
      this.savePayForInfo(payForVm);
   }

   getPaymentStatus() {
      return this.isPaymentSuccessful;
   }

   resetDataOnRecipientSelection() {
      this.resetPayToStepData();
      if (this.paymentWorkflowSteps.payFor.isNavigated) {
         this.resetPayForStepData();
         this.paymentWorkflowSteps.payFor.isNavigated = false;
      }
   }

   resetPayToStepData() {
      this.paymentWorkflowSteps.payTo.model = null;
      this.paymentWorkflowSteps.payTo.model = new PayToModel();
      return this.paymentWorkflowSteps.payTo.model.getViewModel();
   }

   resetPayForStepData() {
      this.paymentWorkflowSteps.payFor.model = null;
      this.paymentWorkflowSteps.payFor.model = new PayForModel();
      return this.paymentWorkflowSteps.payFor.model.getViewModel();
   }

   getApproveItStatus(): Observable<IOutOfBandResponse> {
      const payToViewModel: models.IPayToVm = this.getPayToVm(),
         paymentDetails: IPaymentDetail = this.getPaymentDetailInfo();

      this.paymentWorkflowSteps.payReview.isDirty = false;
      this.paymentWorkflowSteps.payAmount.isDirty = false;
      this.paymentWorkflowSteps.payFor.isDirty = false;
      this.paymentWorkflowSteps.payTo.isDirty = false;

      if (payToViewModel.paymentType === PaymentType.account ||
         payToViewModel.paymentType === PaymentType.creditCard) {
         return this.apiService.PaymentStatus.create(
            null,
            null,
            { verificationId: this.paymentDetails.transactionID });

      } else {

         return this.apiService.PrepaidStatus.create(
            null,
            null,
            { verificationId: this.paymentDetails.transactionID });

      }
   }

   getApproveItOtpStatus(tvsCode: string, referenceId: string): Observable<IOutOfBandResponse> {

      this.paymentWorkflowSteps.payReview.isDirty = false;
      this.paymentWorkflowSteps.payAmount.isDirty = false;
      this.paymentWorkflowSteps.payFor.isDirty = false;
      this.paymentWorkflowSteps.payTo.isDirty = false;

      const request: IOutOfBandRequest = {
         transactionVerificationCode: tvsCode,
         verificationReferenceId: referenceId
      };

      return this.apiService.OutOfBandOtpStatus.create(request);
   }
   isBeneficiarySaved(approveItResponse) {
      const payReviewVm = this.getPayReviewVm();
      if (payReviewVm.isSaveBeneficiary && approveItResponse && approveItResponse.metadata) {
         const resp = CommonUtility.getTransactionStatus(approveItResponse.metadata, Constants.metadataKeys.beneficiarySaved);
         if (!resp.isValid) {
            this.errorMessage = this.errorMessage || resp.reason || Constants.labels.BenificiaryErrorMsg;
         }
      }
   }
   refreshAccounts() {
      this.apiService.refreshAccounts.getAll().subscribe();
   }
   validateBeneficiary(benficiaryDetails) {
      return this.apiService.InternationalBeneficiaryAccount.create(benficiaryDetails);
   }
   checkRemittanceAvailability(): Observable<IRemittanceAvailabilityStatus> {
      return this.apiService.RemittanceAvailabilityCheck.getAll().map(response => {
         return response ? response : {};
      });
   }
   calculateQuote(quoteDetails) {
      return this.apiService.QuoteCalculation.create(quoteDetails, { transactionID: quoteDetails.transactionID }, null);
   }

   raiseSystemErrorforAPIFailure(redirectURL = '') {
      this.isAPIFailure = true;
      if (redirectURL !== '') {
         this.router.navigateByUrl(redirectURL);
      }
   }

   private getPaymentDetailInfowithGUID(paymentDetails: IPaymentDetail): IPaymentDetailWithGUID {
      if (!this.paymentDetailswithGUID) {
         this.paymentDetailswithGUID = new models.PaymentDetailWithGUID();
      }
      if (this.paymentGUID === '') {
         this.createGUID();
      }
      this.paymentDetailswithGUID.payments = [paymentDetails];
      this.paymentDetailswithGUID.requestId = this.paymentGUID;

      return this.paymentDetailswithGUID;
   }

   private getPrepaidDetailInfowithGUID(paymentDetails: IPaymentDetail): IPrepaidDetailWithGUID {
      if (!this.prepaidDetailswithGUID) {
         this.prepaidDetailswithGUID = new models.PrepaidDetailWithGUID();
      }
      if (this.paymentGUID === '') {
         this.createGUID();
      }
      this.prepaidDetailswithGUID.prepaids = [paymentDetails];
      this.prepaidDetailswithGUID.requestId = this.paymentGUID;

      return this.prepaidDetailswithGUID;
   }
}

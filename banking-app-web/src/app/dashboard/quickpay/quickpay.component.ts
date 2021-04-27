import { PaymentType } from './../../core/utils/enums';
import { Component, OnInit, ViewChild, Output, EventEmitter, Injector, OnDestroy } from '@angular/core';

import { PaymentService } from '../../payment/payment.service';
import { BeneficiaryService } from '../../core/services/beneficiary.service';

import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { IPayAmountVm, IPayToVm, IPayForVm, IPayReviewVm } from '../../payment/payment.models';
import { IAccountDetail, IPublicHoliday, IPaymentDetail, IRefreshAccountsApiResult, IBank } from './../../core/services/models';

import { IQuickPayRecipient, IQuickPayWorkFlowSteps } from './quickpay.model';
import { IBankDefinedBeneficiary, IContactCard, IContactCardDetail, IBeneficiaryData, ILimitDetail } from '../../core/services/models';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { AccountService } from '../account.service';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../../core/components/base/base.component';
import { TermsAndConditionsConstants } from '../../shared/terms-and-conditions/constants';
import { SystemErrorService } from '../../core/services/system-services.service';

@Component({
   selector: 'app-quickpay',
   templateUrl: './quickpay.component.html',
   styleUrls: ['./quickpay.component.scss']
})
export class QuickpayComponent extends BaseComponent implements OnInit, OnDestroy {
   @ViewChild('quickPayForm') quickPayForm;
   isButtonLoader = false;

   quickpayWorkflowSteps: IQuickPayWorkFlowSteps = {
      payAmount: true,
      payReview: false,
      payStatus: false,
   };
   payAmountVm: IPayAmountVm;
   payToVm: IPayToVm;
   payForVm: IPayForVm;
   payReviewVm: IPayReviewVm;

   accounts: IAccountDetail[];
   selectedAccount: IAccountDetail;
   publicHolidays: IPublicHoliday[];
   currentDate = new Date();
   isInstantPaymentValid = false;
   instantPayUnavailableMsg: string;
   labels = Constants.labels;
   processedBeneficiaryData: IQuickPayRecipient[] = [];
   selectedBeneficiary: IQuickPayRecipient;
   selectedBeneficiaryName: string;
   benefeciarySearchResult = [];
   noBeneficiaryData = true;
   isTransferAmountValid = false;
   isVisible = false;
   paymentDetail: IPaymentDetail;
   isPaymentSuccessful = false;
   private paymentRetryTimes = 1;
   requestInprogress = false;
   disableRetryButton = false;
   skeletonMode: Boolean;
   beneficiaryDataProceesed = false;
   benificiaryFetching: Boolean;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   emptyStateUrl = Constants.links.nedBankEmptyStatePage;
   payErrorMessage: string;
   resetingQuickPayment = false;
   insufficientFunds = false;
   isPrepaid = false;
   termsAndConditionsPath = TermsAndConditionsConstants.TermsGeneralHtml;
   areBanksLoaded: boolean;
   banks: IBank[] = [];
   isImaliLimitExceeded = false;
   private paymentLimit: ILimitDetail;
   private mobileLimit: ILimitDetail;
   paymentMessage = '';
   isInstantPayAvailableForAcc: boolean;

   constructor(private paymentService: PaymentService, private beneficiaryService: BeneficiaryService,
      private clientProfileDetailsService: ClientProfileDetailsService,
      private accountService: AccountService, private systemErrorService: SystemErrorService,
      injector: Injector) {
      super(injector);
      this.paymentService.clearPaymentDetails();
   }

   onInstantPayClick(tooltip) {
      if (this.isInstantPaymentValid) {
         this.toggleInstantPayment();
      } else {
         this.showTooltip(tooltip);
      }
   }

   showTooltip(pop) {
      this.instantPayUnavailableMsg = this.isInstantPayAvailableOnCard() ?
         (this.isInstantPayAvailableForAcc ? this.labels.instantPay.timeErrorMessage : this.labels.instantPay.accountErrorMessage) :
         (this.isInstantPayAvailableForAcc ? this.labels.instantPay.bankErrorMessage : this.labels.instantPay.accountErrorMessage);
      pop.show();
   }

   hideTooltip(pop) {
      pop.hide();
   }

   activeOverlay() {
      this.isVisible = !this.isVisible;
   }

   hideOverlay(value) {
      this.isVisible = value;
   }

   isInstantPayAvailableOnCard() {
      return this.selectedBeneficiary.instantPaymentAvailable;
   }

   isSaturday(): boolean {
      return Constants.days.allDays[this.currentDate.getDay()] === Constants.days.saturday;
   }

   isSunday(): boolean {
      return Constants.days.allDays[this.currentDate.getDay()] === Constants.days.sunday;
   }
   isValidInstantPaymentTime(): boolean {
      let isValid;
      const currentHour = this.currentDate.getHours();
      if (this.isSaturday()) {
         isValid = currentHour >= Constants.instantPay.weekDayStartHour && currentHour <= Constants.instantPay.saturdayEndHour;
      } else if (this.isWeekDay()) {
         isValid = currentHour >= Constants.instantPay.weekDayStartHour && currentHour <= Constants.instantPay.weekDayEndHour;
      }
      return isValid;
   }

   isWeekDay(): boolean {
      return !this.isSaturday() && !this.isSunday();
   }

   isPublicHoliday(): IPublicHoliday {
      const todayDateString = this.currentDate.toDateString();
      return this.publicHolidays.find(holiday => new Date(holiday.date).toDateString() === todayDateString);
   }
   validateInstantPayment() {
      let isValid = true;
      if (!this.isInstantPayAvailableOnCard()) {
         isValid = false;
      } else if (this.isSunday()) {
         isValid = false;
      } else if (!this.isValidInstantPaymentTime()) {
         isValid = false;
      } else if (this.isPublicHoliday()) {
         isValid = false;
      } else if (!this.isInstantPayAvailableForAcc) {
         isValid = false;
      }
      this.isInstantPaymentValid = isValid;
   }

   // toggle instant pay option
   toggleInstantPayment() {
      this.payAmountVm.isInstantPay = !this.payAmountVm.isInstantPay;
   }

   ngOnInit() {
      this.skeletonMode = true;
      this.initializeQuickPay();
   }

   initializeQuickPay() {
      this.paymentService.initializePaymentWorkflowSteps();
      this.payAmountVm = this.paymentService.getPayAmountVm();
      this.payToVm = this.paymentService.getPayToVm();
      this.payForVm = this.paymentService.getPayForVm();
      this.payReviewVm = this.paymentService.getPayReviewVm();

      this.selectedBeneficiaryName = null;
      this.accounts = null;
      this.payAmountVm.selectedAccount = null;

      this.paymentService.getActiveAccounts().subscribe(accounts => {
         this.accounts = accounts || [];
         this.payAmountVm.selectedAccount = this.payAmountVm.selectedAccount ||
            this.clientProfileDetailsService.getDefaultAccount(this.accounts)
            || (this.accounts.length ? this.accounts[0] : null);
         this.skeletonMode = false;
         if (this.payAmountVm.selectedAccount) {
            this.isInstantPayAvailableForAcc = Constants.instantPayAllowedAccounts.includes(this.payAmountVm.selectedAccount.accountType);
         }
      });
      this.paymentService.getPaymentLimits().subscribe(payLimits => {
         this.paymentLimit = payLimits.find(limit => {
            return limit.limitType === Constants.VariableValues.settings.widgetTypes.payment;
         });
         this.mobileLimit = payLimits.find(limit => {
            return limit.limitType === Constants.VariableValues.settings.widgetTypes.sendimali;
         });

         this.payAmountVm.availableTransferLimit = this.paymentLimit.userAvailableDailyLimit;
         this.payAmountVm.allowedTransferLimit = this.payAmountVm.availableTransferLimit;
      });

      this.paymentService.getPublicHolidays().subscribe(response => {
         this.publicHolidays = response;
      });
      this.benificiaryFetching = true;
      this.beneficiaryService.getContactCards().subscribe(beneficiaries => {
         this.createRecipientData(beneficiaries);
         this.benificiaryFetching = false;
      });

      this.areBanksLoaded = false;
      this.paymentService.getBanks().subscribe((banks: IBank[]) => {
         this.banks = banks;
         this.areBanksLoaded = true;
      });
   }

   createRecipientData(beneficiaryData) {
      this.processedBeneficiaryData.length = 0;
      beneficiaryData.forEach((data) => {
         data.contactCardDetails.forEach((cardData) => {
            if (cardData.beneficiaryType !== 'FBE' && cardData.beneficiaryType !== 'PEL') {
               this.beneficiaryDataProceesed = true;
               this.processedBeneficiaryData.push({
                  'beneficiaryID': cardData.beneficiaryID,
                  'beneficiaryName': cardData.beneficiaryName,
                  'bankName': cardData.bankName ? cardData.bankName : '',
                  'accountType': cardData.accountType,
                  'accountNumber': cardData.accountNumber,
                  'beneficiaryReference': cardData.beneficiaryReference,
                  'beneficiaryType': cardData.beneficiaryType,
                  'instantPaymentAvailable': cardData.instantPaymentAvailable || false,
                  'branchCode': cardData.branchCode,
                  'bankCode': cardData.bankCode,
                  'myReference': cardData.myReference,
               });
            }
         });
      });
   }

   selectBeneficiary(selectedBeneficiary) {
      this.beneficiaryChange(selectedBeneficiary);
   }

   blurBeneficiary(selected) {
      if (selected && selected.item) {
         this.beneficiaryChange(selected);
      } else {
         this.clearBeneficiary();
      }
   }

   noBeneficiaryResults($event) {
      this.noBeneficiaryData = $event;
   }

   blurBeneficiaryInput() {
      if (this.noBeneficiaryData) {
         this.clearBeneficiary();
      }
   }

   onAccountSelection(account) {
      this.payAmountVm.selectedAccount = account;
      this.insufficientFunds = this.payAmountVm.transferAmount > 0 &&
         this.payAmountVm.transferAmount > this.payAmountVm.selectedAccount.availableBalance;
      this.isInstantPayAvailableForAcc = Constants.instantPayAllowedAccounts.includes(this.payAmountVm.selectedAccount.accountType);
   }

   private clearBeneficiary() {
      this.selectedBeneficiary = null;
      this.selectedBeneficiaryName = '';
   }

   private beneficiaryChange(beneficiary) {
      this.assignBeneficiary(beneficiary);
   }

   private assignBeneficiary(beneficiary) {
      this.payToVm.isRecipientPicked = true;
      this.selectedBeneficiary = beneficiary.item;
      this.isPrepaid = this.isPrepaidAccount(beneficiary.item);
      this.payAmountVm.transferAmount = null;
      this.validate();
      this.selectedBeneficiaryName = beneficiary.value;
      this.isImaliLimitExceeded = false;
      if (this.isPrepaid) {
         this.payAmountVm.availableTransferLimit = Math
            .min(this.paymentLimit.userAvailableDailyLimit, this.mobileLimit.userAvailableDailyLimit);
         this.isImaliLimitExceeded = (this.payAmountVm.availableTransferLimit === this.mobileLimit.userAvailableDailyLimit);
      } else {
         this.payAmountVm.availableTransferLimit = this.paymentLimit.userAvailableDailyLimit;
      }
   }

   private raiseAPIFailureError() {
      this.paymentService.raiseSystemErrorforAPIFailure();
   }
   isBankAccountContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType !== Constants.BeneficiaryType.Prepaid
         && contactCardDetail.beneficiaryType !== Constants.BeneficiaryType.Electricity;
   }
   isPrepaidContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType === Constants.BeneficiaryType.Prepaid;
   }
   private isPrepaidAccount(value) {
      return value.beneficiaryType === Constants.BeneficiaryType.Prepaid ? true : false;
   }
   onAmountChange(value) {
      this.payAmountVm.transferAmount = value;
      this.payAmountVm.allowedTransferLimit = this.payAmountVm.availableTransferLimit - this.payAmountVm.transferAmount;
      this.payAmountVm.isTransferLimitExceeded = this.payAmountVm.allowedTransferLimit < 0;
      this.insufficientFunds = value > 0 && value > this.payAmountVm.selectedAccount.availableBalance;
      this.validate();
   }

   validate() {
      this.payAmountVm.isValid = this.areBanksLoaded && !this.benificiaryFetching
         && !this.payAmountVm.isTransferLimitExceeded && this.payAmountVm.transferAmount > 0;
      this.isTransferAmountValid = this.payAmountVm.transferAmount && this.payAmountVm.transferAmount > 0;
   }

   validateQuickPay() {
      if (this.quickPayForm instanceof NgForm) {
         CommonUtility.markFormControlsTouched(this.quickPayForm);
      }

      if ((this.payAmountVm.isValid && this.selectedBeneficiaryName) && !this.insufficientFunds) {
         this.onNextClick();
      } else {
         this.validate();
      }
   }

   onNextClick() {
      const beneficiaryData = {
         contactCardDetails: {
            cardDetails: {
               accountNumber: this.selectedBeneficiary.accountNumber.toString(),
               accountType: (CommonUtility.isNedBank(this.selectedBeneficiary.bankName) ?
                  this.selectedBeneficiary.accountType : Constants.VariableValues.unknownAccountType),
               beneficiaryName: this.selectedBeneficiary.beneficiaryName,
               beneficiaryID: this.selectedBeneficiary.beneficiaryID,
               beneficiaryType: this.selectedBeneficiary.beneficiaryType,
            }
         }
      };
      const branch = {
         branchName: this.selectedBeneficiary.bankName,
         branchCode: this.selectedBeneficiary.branchCode
      };
      this.payAmountVm.paymentDate = this.currentDate;
      this.payToVm.accountType = beneficiaryData.contactCardDetails.cardDetails.accountType;
      this.payAmountVm.isInstantPay = false;
      this.validateInstantPayment();
      this.payToVm.beneficiaryData = beneficiaryData;
      this.payToVm.branch = branch;
      this.payToVm.recipientName = this.selectedBeneficiary.beneficiaryName;
      this.payToVm.bankName = this.selectedBeneficiary.bankName;
      this.payToVm.accountNumber = this.selectedBeneficiary.accountNumber.toString();
      if (this.isPrepaid) {
         this.payToVm.paymentType = PaymentType.mobile;
         this.payToVm.mobileNumber = this.selectedBeneficiary.accountNumber.toString();
      }
      this.payForVm.theirReference = this.selectedBeneficiary.beneficiaryReference;
      this.payForVm.yourReference = this.selectedBeneficiary.myReference;
      this.payForVm.notification = { name: Constants.notificationTypes.none };
      this.payReviewVm.isSaveBeneficiary = false;
      this.quickpayWorkflowSteps.payAmount = false;
      this.quickpayWorkflowSteps.payReview = true;
      if (this.selectedBeneficiary.bankName) {
         const selectedBank: IBank = this.banks.find((bank) => {
            return bank.bankName.toLowerCase().trim() === this.selectedBeneficiary.bankName.toLowerCase().trim();
         });
         this.payToVm.bank = selectedBank;
         this.payToVm.banks = this.banks;
      }
   }

   onEditClick() {
      this.quickpayWorkflowSteps.payAmount = true;
      this.quickpayWorkflowSteps.payReview = false;
   }

   onPayClick() {
      this.paymentService.isAPIFailure = false;
      this.isButtonLoader = true;
      this.paymentService.savePayAmountInfo(this.payAmountVm);
      this.paymentService.savePayForInfo(this.payForVm);
      this.paymentService.savePayToInfo(this.payToVm);
      this.paymentService.savePayReviewInfo(this.payReviewVm);
      this.paymentService.createGUID();
      this.makeQuickPayment();

   }
   makeQuickPayment() {
      this.paymentService.makePayment().subscribe((validationResponse) => {
         if (this.paymentService.isPaymentStatusValid(validationResponse)) {
            this.paymentService.makePayment(false).subscribe((paymentResponse) => {
               this.paymentService.isAPIFailure = false;
               if (this.paymentService.isPaymentStatusValid(paymentResponse)) {
                  this.paymentService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                  this.paymentService.isPaymentSuccessful = true;
                  this.onPayment();
               } else {
                  this.onPayment();
               }
            }, (error) => {
               this.onPayment();
               this.raiseAPIFailureError();
            });
         } else {
            this.onPayment();
         }
      }, (error) => {
         this.onPayment();
      });
   }
   onPayment() {
      this.paymentDetail = this.paymentService.getPaymentDetailInfo();
      this.isPaymentSuccessful = this.paymentService.isPaymentSuccessful;
      if (this.isPaymentSuccessful) {
         this.paymentMessage = Constants.labels.paymentSuccess;
      } else {
         if (this.IsAPIFailure) {
            this.paymentMessage = Constants.labels.somethingWentWrong;
         } else {
            this.paymentMessage = Constants.labels.paymentFailed;
         }
      }
      this.isButtonLoader = false;
      this.requestInprogress = false;
      this.quickpayWorkflowSteps.payAmount = false;
      this.quickpayWorkflowSteps.payReview = false;
      this.quickpayWorkflowSteps.payStatus = true;
      this.payErrorMessage = this.paymentService.errorMessage;
   }

   onPaymentDone() {
      this.resetingQuickPayment = true;
      this.paymentRetryTimes = 1;
      this.paymentService.clearPaymentDetails();
      this.paymentService.resetPaymentModels();
      this.payErrorMessage = '';
      this.accountService.refreshAccounts().subscribe((response: IRefreshAccountsApiResult) => {
         this.initializeQuickPay();
         this.accountService.notifyAccountsUpdate();
         this.quickpayWorkflowSteps.payAmount = true;
         this.quickpayWorkflowSteps.payReview = false;
         this.quickpayWorkflowSteps.payStatus = false;
         this.requestInprogress = false;
         this.disableRetryButton = false;
         this.resetingQuickPayment = false;
      });
   }

   onRetryQuickPay() {
      if (this.paymentRetryTimes < Constants.VariableValues.maximumTransferAttempts) {
         this.paymentRetryTimes++;
         this.requestInprogress = true;
         this.isButtonLoader = true;
         if (!this.paymentService.isAPIFailure) {
            this.paymentService.createGUID();
         }
         this.makeQuickPayment();
      } else {
         this.disableRetryButton = true;
      }
   }
   ngOnDestroy() {
      this.paymentService.clearPaymentDetails();
   }
   public get IsAPIFailure(): boolean {
      return this.paymentService.isAPIFailure;
   }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PaymentService } from '../../payment/payment.service';
import {
   IAccountDetail, IContactCardNotification, IBeneficiaryData, IContactCardDetail,
   IBeneficiaryRecentTransactDetail
} from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { INotificationItem } from '../../core/utils/models';
import { IPayToVm, IPayForVm, IPayAmountVm, IPayReviewVm } from '../../payment/payment.models';
import { Router } from '@angular/router';
import { PaymentType } from '../../core/utils/enums';
import { BeneficiaryService } from '../../core/services/beneficiary.service';
import { LoaderService } from '../../core/services/loader.service';
import { SystemErrorService } from '../../core/services/system-services.service';

@Component({
   selector: 'app-repeat-transaction',
   templateUrl: './repeat-transaction.component.html',
   styleUrls: ['./repeat-transaction.component.scss']
})
export class RepeatTransactionComponent implements OnInit {
   retryCount = 0;
   oneDayInMs = 24 * 60 * 60 * 1000;
   showNotificationMsg: boolean;
   paymentError: string;
   isValid: boolean;
   @ViewChild('repeatPayForm') repeatPayForm;
   contactCardDetails: IContactCardDetail;
   beneficaryTransaction: IBeneficiaryRecentTransactDetail;
   allowedMinimumValue: any;
   isMinimumViolated: boolean;
   isTryAgain = false;
   accounts: IAccountDetail[];
   beneficiaryData: IBeneficiaryData;
   vm: any = {};
   dateFormat: string = Constants.formats.ddMMMMyyyy;
   // vm: IPayReviewVm;
   payToVm: IPayToVm;
   payForVm: IPayForVm;
   payAmountVm: IPayAmountVm;
   payReviewVm: IPayReviewVm;
   insufficientFunds = false;
   isTransferAmountValid: boolean;
   labels = Constants.labels;
   notifyMsg = Constants.Recipient.paymentNotificationMsg;
   smsMinLength = Constants.VariableValues.smsMinLength;
   smsMaxLength = Constants.VariableValues.smsMaxLength;
   referenceMaxLength = Constants.VariableValues.referenceMaxLength;
   patterns = Constants.patterns;
   messages = Constants.messages;
   isMobilePayment = false;
   isPayInProcess: boolean;
   disablepayButton = false;
   notifications = CommonUtility.getNotificationTypes();
   payStatus = true;
   constructor(public router: Router, public paymentService: PaymentService,
      private beneficiaryService: BeneficiaryService,
      private loaderService: LoaderService, private systemErrorService: SystemErrorService) { }
   ngOnInit() {
      this.loaderService.show();
      this.beneficiaryService.selectedBeneficiary.subscribe(recipient => {
         this.beneficiaryData = recipient;
      });
      this.initializeRepeatPaymentWorkflow();
      const payAccounts = this.paymentService.getActiveAccounts();
      const payLimit = this.paymentService.getPaymentLimits();
      Observable.forkJoin(payAccounts, payLimit).subscribe(results => {
         this.accounts = results[0];
         this.payAmountVm.selectedAccount = this.payAmountVm.selectedAccount ||
            (this.accounts.length ? this.accounts.find(a => a.accountNumber === this.beneficaryTransaction.acctNumber) : null);
         const paymentLimit = results[1].find(limit => {
            return limit.limitType === Constants.VariableValues.settings.widgetTypes.payment;
         });
         this.payAmountVm.availableTransferLimit = paymentLimit.userAvailableDailyLimit;
         this.payAmountVm.allowedTransferLimit = this.payAmountVm.availableTransferLimit;
         this.loaderService.hide();
         this.isTransferAmountValid = true;
         this.validate();
      });
      this.payForVm.notification = this.notifications.find(m => m.value === Constants.notificationTypes.none);
   }
   onAccountSelection(account: IAccountDetail) {
      this.payAmountVm.selectedAccount = account;
      this.validate();
   }
   onAmountChange(value) {
      this.payAmountVm.transferAmount = value;
      this.payAmountVm.allowedTransferLimit = this.payAmountVm.availableTransferLimit - this.payAmountVm.transferAmount;
      this.payAmountVm.isTransferLimitExceeded = this.payAmountVm.allowedTransferLimit < 0;
      this.payAmountVm.isValid = !this.payAmountVm.isTransferLimitExceeded && this.payAmountVm.transferAmount > 0;
      this.isTransferAmountValid = this.payAmountVm.transferAmount && this.payAmountVm.transferAmount > 0;
      this.isMinimumViolated = this.payAmountVm.transferAmount < this.allowedMinimumValue && this.payAmountVm.transferAmount > 0;
      this.validate();
   }
   private raiseAPIFailureError() {
      this.paymentService.isAPIFailure = true;
      this.paymentService.raiseSystemErrorforAPIFailure();
   }
   onNotificationChange(event: Event, selectd: any) {
      this.payForVm.notification = selectd;
      this.payForVm.notificationInput = '';
      this.validate();
   }

   makePaymentClick() {
      if (!this.isPayInProcess) {
         if (!this.retryCount) {
            this.paymentService.isAPIFailure = false;
         }
         if (!this.paymentService.isAPIFailure) {
            this.paymentService.createGUID();
         }
         this.retryCount++;
         if (this.retryCount > 4) {
            this.paymentError = this.labels.paymentRetryMessage;
            return;
         }
         this.isPayInProcess = true;
         this.paymentService.savePayAmountInfo(this.payAmountVm);
         this.paymentService.savePayForInfo(this.payForVm);
         this.paymentService.savePayToInfo(this.payToVm);
         this.paymentService.savePayReviewInfo(this.payReviewVm);
         this.paymentError = '';
         this.makePayment();
      }
   }

   makePayment() {
      this.paymentService.makePayment().subscribe((validationResponse) => {
         this.paymentService.isAPIFailure = false;
         this.paymentService.isPaymentSuccessful = false;
         this.isPayInProcess = false;
         if (this.paymentService.isPaymentStatusValid(validationResponse)) {
            this.isPayInProcess = true;
            this.paymentService.makePayment(false).subscribe((paymentResponse) => {
               this.paymentService.isAPIFailure = false;
               this.isTryAgain = false;
               let responseStatus = '',
                  responseFailureReason = '';
               if (responseStatus === '') {
                  responseStatus = paymentResponse.resultData[0].resultDetail.find(item =>
                     item.operationReference === 'TRANSACTION').status;
                  responseFailureReason = paymentResponse.resultData[0].resultDetail.find(item =>
                     item.operationReference === 'TRANSACTION').reason;

               }
               if (responseStatus === 'SUCCESS') {
                  this.payStatus = true;
                  this.paymentService.updateTransactionID(paymentResponse.resultData[0].transactionID);
                  this.paymentService.updateexecEngineRef(paymentResponse.resultData[0].execEngineRef
                     || paymentResponse.resultData[0].transactionID);
                  this.paymentService.isPaymentSuccessful = true;
                  this.isPayInProcess = false;
                  this.paymentService.refreshAccounts();
                  this.router.navigateByUrl(Constants.routeUrls.recipientPaymentStatus);
               } else if (responseStatus === 'FAILURE') {
                  this.paymentService.errorMessage = responseFailureReason;
                  this.paymentError = responseFailureReason;
                  this.isPayInProcess = false;
                  this.payStatus = false;
                  this.paymentService.isPaymentSuccessful = false;
               } else {
                  this.paymentError = this.paymentService.errorMessage;
                  this.isPayInProcess = false;
                  this.paymentService.isPaymentSuccessful = false;
                  this.payStatus = false;
               }
            }, (error) => {
               if (this.paymentService.errorMessage === '') {
                  this.paymentService.errorMessage = this.labels.somethingWentWrong;
               }
               this.isPayInProcess = false;
               this.paymentError = this.paymentService.errorMessage;
               this.payStatus = false;
               this.isTryAgain = true;
               this.raiseAPIFailureError();
            });
         } else {
            this.paymentError = this.paymentService.errorMessage;
         }
      }, (error) => {
         this.paymentService.isPaymentSuccessful = false;
         this.payStatus = false;
         this.isPayInProcess = false;
         this.paymentError = this.paymentService.errorMessage;
      });
   }

   private initializeRepeatPaymentWorkflow() {
      this.paymentService.clearPaymentDetails();
      this.paymentService.initializePaymentWorkflowSteps();
      this.payAmountVm = this.paymentService.getPayAmountVm();
      this.payToVm = this.paymentService.getPayToVm();
      this.payForVm = this.paymentService.getPayForVm();
      this.payReviewVm = this.paymentService.getPayReviewVm();
      this.beneficaryTransaction = this.beneficiaryData.selectedTransaction;
      this.contactCardDetails = this.beneficiaryData.contactCard.contactCardDetails.find(cc =>
         cc.beneficiaryID === this.beneficaryTransaction.beneficiaryID);
      this.payToVm.accountNumber = this.contactCardDetails.accountNumber;
      this.payToVm.accountType = this.contactCardDetails.accountType;
      this.payToVm.recipientName = this.contactCardDetails.beneficiaryName;
      this.payToVm.beneficiaryData = this.beneficiaryData;
      this.payToVm.bankName = this.contactCardDetails.bankName;
      this.payToVm.accountNumber = this.contactCardDetails.accountNumber;
      this.payToVm.isRecipientPicked = true;
      this.payToVm.paymentType = PaymentType.account;
      this.payToVm.branch = { branchCode: this.contactCardDetails.branchCode, branchName: '' };
      this.payAmountVm.paymentDate = new Date();
      this.payAmountVm.transferAmount = this.beneficaryTransaction.paymentAmount;
      this.payForVm.theirReference = this.beneficaryTransaction.paymentCRNarration || this.contactCardDetails.beneficiaryReference;
      this.payForVm.yourReference = this.beneficaryTransaction.paymentDRNarration || this.contactCardDetails.myReference;
      this.payReviewVm.isSaveBeneficiary = false;
      this.showNotificationMsg = +new Date() - +new Date(this.beneficaryTransaction.paymentDate) <= this.oneDayInMs;
   }

   goBack() {
      this.router.navigateByUrl(Constants.routeUrls.recipient);
   }

   validate() {
      let valid = true;
      this.insufficientFunds = (this.payAmountVm.transferAmount > 0)
         && (this.payAmountVm.transferAmount > this.payAmountVm.selectedAccount.availableBalance);
      valid = !this.insufficientFunds;
      if (this.payForVm.notification && ((this.payForVm.notification.value === Constants.notificationTypes.SMS) ||
         (this.payForVm.notification.value === Constants.notificationTypes.Fax))) {
         this.isValid = (this.repeatPayForm.valid
            && (this.payForVm.notificationInput ? CommonUtility.isValidMobile(this.payForVm.notificationInput) : false));
      } else if (this.payForVm.notification && this.payForVm.notification.value === Constants.notificationTypes.email) {
         this.isValid = (this.repeatPayForm.valid
            && (this.payForVm.notificationInput ? CommonUtility.isValidEmail(this.payForVm.notificationInput) : false));
      } else {
         this.isValid = this.repeatPayForm.valid;
      }

   }
}

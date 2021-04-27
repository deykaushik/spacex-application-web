import { Component, OnInit } from '@angular/core';
import { OpenAccountService } from '../../open-account.service';
import { TermsService } from '../../../shared/terms-and-conditions/terms.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import {
   IOpenNewAccountPayload, IOpenNewAccountPayloadForFixedDeposit, IDepositDetails,
   IPayoutDetails, IRecurringDetails, IDeposit, ITermsAndConditions, IApiResponse
} from '../../../core/services/models';
import { Constants } from '../../constants';
import { AlertActionType, AlertMessageType } from '../../../shared/enums';
import { TermsAndConditionsConstants } from '../../../shared/terms-and-conditions/constants';
import { CommonUtility } from '../../../core/utils/common';

@Component({
   selector: 'app-review-details',
   templateUrl: './review-details.component.html',
   styleUrls: ['./review-details.component.scss']
})
export class ReviewDetailsComponent implements OnInit {
   workflowSteps: IStepper[];
   labels = Constants.labels.openAccount;
   symbol = Constants.symbols;
   openAccountMessages = Constants.messages.openNewAccount;
   openAccountValues = Constants.variableValues.openNewAccount;
   amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;
   isChecked = true;
   isSuccessPage: boolean;
   productDetails: IDeposit;
   productName: string;
   isNoticeDeposit: boolean;
   interestRate: number;
   depositDetails: IDepositDetails[];
   interestDetails: IPayoutDetails[];
   recurringDetails: IRecurringDetails[];
   depositPayload: IOpenNewAccountPayload;
   fixedDepositPayload: IOpenNewAccountPayloadForFixedDeposit;
   routeParams: string;
   deposit: IDepositDetails;
   interest: IPayoutDetails;
   recurring: IRecurringDetails;
   frequency: string;
   showTermsView: string;
   isRecurringShow: boolean;
   showLoader: boolean;
   showAlert: boolean;
   displayMessageText: string;
   action: number;
   alertType: number;
   recurringSection: boolean;
   termsAndConditionsPath = TermsAndConditionsConstants.TermsGeneralHtml;

   constructor(private workflowService: WorkflowService, private openAccountService: OpenAccountService,
      private termsService: TermsService) { }

   ngOnInit() {
      this.productDetails = this.openAccountService.getProductDetails();
      if (this.productDetails) {
         this.isNoticeDeposit = this.productDetails.noticeDeposit === this.openAccountValues.yes;
         this.productName = this.productDetails.name;
         this.frequency = this.productDetails.frequency1;
         this.interestRate = this.productDetails.realtimerate;
      }
      const interestRate = this.openAccountService.getRealTimeInterestRate();
      if (interestRate || !this.isNoticeDeposit) {
         this.interestRate = interestRate;
      }
      this.depositDetails = this.openAccountService.getDepositDetails();
      this.interestDetails = this.openAccountService.getInterestDetails();
      this.recurringDetails = this.openAccountService.getRecurringDetails();
      this.workflowSteps = this.workflowService.getWorkflow();
      if (this.recurringDetails && this.recurringDetails[0]) {
         this.isRecurringShow = true;
         this.recurringSection = this.recurringDetails[0].isRecurringYes;
      }
      this.showTermsAndConditions();
   }

   back() {
      (this.isRecurringShow) ? this.recurringEdit() : this.interestEdit();
   }

   change(value) {
      this.isChecked = !(value.currentTarget.checked);
   }

   setFrequency() {
      if (!this.isNoticeDeposit) {
         switch (this.interest.payoutOption) {
            case this.openAccountValues.monthly:
               return this.openAccountValues.monthlyPayment;
            case this.openAccountValues.quarterly:
               return this.openAccountValues.quarter;
            case this.openAccountValues.halfYearly:
               return this.openAccountValues.halfYear;
            case this.openAccountValues.yearly:
               return this.openAccountValues.year;
            case this.openAccountValues.investmentEnd:
               return this.openAccountValues.endInvestment;
         }
      } else {
         return this.openAccountValues.monthlyPayment;
      }
   }

   setInvestmentTerm() {
      return (this.isNoticeDeposit) ? this.openAccountValues.startDay : this.deposit.Months;
   }

   setDay(day: string) {
      if (this.recurring.Frequency === this.openAccountValues.weekly) {
         switch (day) {
            case this.openAccountValues.weekDays[0]:
               return 1;
            case this.openAccountValues.weekDays[1]:
               return 2;
            case this.openAccountValues.weekDays[2]:
               return 3;
            case this.openAccountValues.weekDays[3]:
               return 4;
            case this.openAccountValues.weekDays[4]:
               return 5;
            case this.openAccountValues.weekDays[5]:
               return 6;
         }
      } else {
         return parseInt(this.recurring.Day, 10);
      }
   }

   openNewAccount() {
      let payload = {};
      if (this.depositDetails && this.depositDetails[0]) {
         this.deposit = this.depositDetails[0];
      }
      if (this.interestDetails && this.interestDetails[0]) {
         this.interest = this.interestDetails[0];
      }
      if (this.recurringDetails && this.recurringDetails[0]) {
         this.recurring = this.recurringDetails[0];
         this.frequency = (this.recurringDetails[0].Frequency === this.openAccountValues.weekly) ? this.openAccountValues.weeklyPayment :
            this.openAccountValues.monthlyPayment;
      }
      if (this.isNoticeDeposit && this.recurring && this.recurring.isRecurringYes) {
         this.depositPayload = {
            requestID: this.guid(),
            investorNumber: this.deposit.investorNumber,
            investmentType: this.deposit.productType,
            depositFromAccType: this.deposit.depositAccountType,
            depositFromAcc: this.deposit.depositAccountNumber,
            investmentTerm: this.setInvestmentTerm(),
            currentInterestRate: this.interestRate,
            interestFrequency: this.setFrequency(),
            interestDay: this.interest.payoutDay,
            interestDisposalAccType: this.interest.payoutAccountType,
            interestDisposalAcc: this.interest.payoutAccount.replace(this.symbol.hyphenWithoutSpace, this.symbol.withoutSpace),
            capitalDisposalAccType: this.openAccountValues.non,
            capitalDisposalAcc: this.openAccountValues.non,
            depositAmount: this.deposit.Amount,
            recurringPaymentDetail: [
               {
                  recurringDay: this.setDay(this.recurring.Day),
                  recurringFromAccType: this.recurring.recurringAccountType,
                  recurringFromAcc: this.recurring.accountNumber,
                  recurringAmount: this.recurring.Amount,
                  recurringFreq: this.frequency,
               }]
         };
         payload = this.depositPayload;
      } else {
         this.fixedDepositPayload = {
            requestID: this.guid(),
            investorNumber: this.deposit.investorNumber,
            investmentType: this.deposit.productType,
            depositFromAccType: this.deposit.depositAccountType,
            depositFromAcc: this.deposit.depositAccountNumber.replace(this.symbol.hyphenWithoutSpace, this.symbol.withoutSpace),
            investmentTerm: this.setInvestmentTerm(),
            currentInterestRate: this.interestRate,
            interestFrequency: this.setFrequency(),
            interestDay: this.interest.payoutDay,
            interestDisposalAccType: this.interest.payoutAccountType,
            interestDisposalAcc: this.interest.payoutAccount.replace(this.symbol.hyphenWithoutSpace, this.symbol.withoutSpace),
            capitalDisposalAccType: this.openAccountValues.non,
            capitalDisposalAcc: this.openAccountValues.non,
            depositAmount: this.deposit.Amount
         };
         payload = this.fixedDepositPayload;
      }
      this.routeParams = this.openAccountValues.empty;
      this.openAccountService.openAccount(payload, this.routeParams).subscribe((result) => {
         this.showLoader = false;
         if (result && result.metadata) {
            const status = CommonUtility.getTransactionStatus(result.metadata, Constants.metadataKeys.transaction);
            if (status.isValid) {
               this.isSuccessPage = true;
               this.resetValues();
            } else {
               this.setAlertMessage();
            }
         } else {
            this.setAlertMessage();
         }
      }, error => {
         this.setAlertMessage();
         this.showLoader = false;
      });
   }

   openAccount() {
      this.showLoader = true;
      this.updateTermsAndConditions();
   }

   editDetails() {
      this.workflowSteps[1] = { step: this.workflowSteps[1].step, valid: true, isValueChanged: false };
      this.workflowService.setWorkflow(this.workflowSteps);
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[1].step);
   }

   editAccountDetails() {
      this.openAccountService.setRecurringEdit(false);
      this.openAccountService.setInterestEdit(false);
      this.editDetails();
   }

   recurringEdit() {
      this.openAccountService.setRecurringEdit(true);
      this.openAccountService.setInterestEdit(false);
      this.editDetails();
   }

   interestEdit() {
      this.openAccountService.setRecurringEdit(false);
      this.openAccountService.setInterestEdit(true);
      this.editDetails();
   }

   guid() {
      function s4() {
         return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
      }
      return s4() + s4() + this.symbol.hyphenWithoutSpace + s4() + this.symbol.hyphenWithoutSpace + s4()
         + this.symbol.hyphenWithoutSpace + s4() + this.symbol.hyphenWithoutSpace + s4() + s4() + s4();
   }

   showTermsAndConditions() {
      this.openAccountService.getTermsAndConditionsForOpenNewAccount().subscribe((res: ITermsAndConditions) => {
         if (res && res.noticeDetails) {
            res.noticeDetails.noticeContent = this.termsService.decodeTerms(res.noticeDetails.noticeContent);
            this.showTermsView = res.noticeDetails.noticeContent;
            this.showLoader = false;
         } else {
            this.showLoader = false;
            this.setAlertMessage();
         }
      }, error => {
         this.setAlertMessage();
         this.showLoader = false;
      });
   }

   updateTermsAndConditions() {
      this.openAccountService.updateTermsAndConditionsForOpenNewAccount().subscribe((result: IApiResponse) => {
         if (result && result.metadata) {
            const status = CommonUtility.getTransactionStatus(result.metadata, Constants.metadataKeys.transaction);
            if (status.isValid) {
               this.openNewAccount();
            } else {
               this.showLoader = false;
               this.setAlertMessage();
            }
         } else {
            this.showLoader = false;
            this.setAlertMessage();
         }
      }, error => {
         this.setAlertMessage();
         this.showLoader = false;
      });
   }

   setAlertMessage() {
      this.showAlert = true;
      this.displayMessageText = Constants.messages.openNewAccount.errorMessage;
      this.action = AlertActionType.Close;
      this.alertType = AlertMessageType.Error;
   }

   onAlertLinkSelected() {
      this.showAlert = false;
   }

   resetValues() {
      this.openAccountService.setDepositDetails(null);
      this.openAccountService.setInterestDetails(null);
      this.openAccountService.setRecurringDetails(null);
      this.openAccountService.setRecurringEdit(null);
      this.openAccountService.setRealTimeInterestRate(null);
   }
}

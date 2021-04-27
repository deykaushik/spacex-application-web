import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { AccountService } from '../../dashboard/account.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { FeedbackService } from '../feedback.service';
import { BaseComponent } from '../../core/components/base/base.component';
import { IDatePickerConfig } from 'ng2-date-picker';
import { IDashboardAccounts, IDashboardAccount, IApiResponse, IClientDetails } from '../../core/services/models';
import { IAccountConfig } from '../../dashboard/dashboard.model';
import { IReportSuspicious, IAlertMessage, IReportAttempts } from '../../core/services/models';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';

@Component({
   selector: 'app-report-suspicious',
   templateUrl: './report-suspicious.component.html',
   styleUrls: ['./report-suspicious.component.scss']
})
export class ReportSuspiciousComponent extends BaseComponent implements OnInit {

   @Output() alertMessage = new EventEmitter<IAlertMessage>();
   label = Constants.labels.reportFraud;
   value = Constants.VariableValues.reportFraud;
   message = Constants.messages.reportFraud;
   reportSuspiciousType: string;
   thirdPartyDetail = false;
   minEndDate: Moment;
   maxEndDate: Moment;
   calendarConfig: IDatePickerConfig;
   maxLimit = Constants.VariableValues.reportFraud.maxLimit;
   placeholder = this.label.placeholder;
   email: string;
   pattern = Constants.patterns;
   itemAccountId: string;
   accountContainer: IDashboardAccounts;
   accountConfig: IAccountConfig;
   accountInfo: IDashboardAccount;
   selectedAccount: IDashboardAccount;
   dropdownAccounts: IDashboardAccount[];
   isEmailValid: boolean;
   isBankNameValid: boolean;
   isAccountNumberValid: boolean;
   attempt: IReportAttempts;
   showSpinner: boolean;
   attemptsCompletedFlag: boolean;
   tryAgain: boolean;
   feedbackDetails: IReportSuspicious;
   formats = Constants.formats;
   reportDate: string;
   selectedAccountName: string;
   isFormValid: boolean;
   showLoader: boolean;
   defaultAccount: boolean;

   bankNameInfo: string;
   bankName: string;
   accountNumberInfo: string;
   accountNumber: string;
   totalAmountInfo: string;
   totalAmount: string;
   reportSuspiciousInfo: string;
   reportSuspiciousText: string;

   // Analytics
   GACategory = Constants.GAEventList.category.reportFraud;
   GAEvent = Constants.GAEventList.reportFraud.event;
   GALabel = Constants.GAEventList.reportFraud.label;

   constructor(private accountService: AccountService, private systemErrorService: SystemErrorService,
      private feedbackService: FeedbackService, private amountTransform: AmountTransformPipe,
      private clientProfileDetailsService: ClientProfileDetailsService,
      injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.showSpinner = true;
      this.assignDefaultValue();
      this.getAccountData();
      this.setCalendarConfig();
      this.getReportSuspiciousAttempts();
   }

   assignDefaultValue() {
      this.isBankNameValid = true;
      this.isAccountNumberValid = true;
      this.defaultAccount = true;
      this.isFormValid = true;
      this.thirdPartyDetail = false;
      this.reportSuspiciousText = this.value.empty;
      this.reportSuspiciousInfo = this.reportSuspiciousText.length + this.label.slash + this.maxLimit.reason;
      this.totalAmount = this.value.empty;
      this.totalAmountInfo = this.totalAmount.length + this.label.slash + this.maxLimit.totalAmount;
      this.accountNumber = this.value.empty;
      this.accountNumberInfo = this.accountNumber.length + this.label.slash + this.maxLimit.accountNumber;
      this.bankName = this.value.empty;
      this.bankNameInfo = this.bankName.length + this.label.slash + this.maxLimit.bankName;
      this.subscribeClientDetails();
   }

   getAccountTypeStyle(accountType: string) {
      return CommonUtility.getAccountTypeStyle(accountType);
   }

   getAccountData() {
      const cachedAccountsData = this.accountService.getDashboardAccountsData();
      if (cachedAccountsData) {
         this.processDropdownData(cachedAccountsData);
      } else {
         this.accountService.getDashboardAccounts().subscribe((accountContainers: IDashboardAccounts[]) => {
            this.processDropdownData(accountContainers);
         });
      }
   }

   processDropdownData(accountContainers: IDashboardAccounts[]) {
      this.dropdownAccounts = [];
      let tempDropdownAccounts: IDashboardAccount[];
      tempDropdownAccounts = [];

      this.selectedAccount = {} as IDashboardAccount;
      this.selectedAccount.AccountName = this.label.defaultAccount;
      this.selectedAccount.AccountNumber = 0;
      this.selectedAccount.AccountType = 'CA';
      this.dropdownAccounts.push(this.selectedAccount);

      // create a temporary account array with account type name
      accountContainers.forEach(ac => {
         ac.Accounts.forEach(a => {
            a['AccountTypeName'] = CommonUtility.getAccountTypeStyle(a.AccountType, ac.ContainerName);
         });
         Array.prototype.push.apply(tempDropdownAccounts, ac.Accounts);
      });

      // sort the accounts
      this.value.accountsOrder.forEach(ao => {
         Array.prototype.push.apply(this.dropdownAccounts, tempDropdownAccounts.filter(temp => {
            return temp['AccountTypeName'] === ao;
         }).sort((a, b) => a.AccountName.localeCompare(b.AccountName)));
      });
   }

   private setCalendarConfig() {
      this.minEndDate = moment().subtract(this.value.minDays, 'days');
      this.maxEndDate = moment().subtract(this.value.maxDay, 'days');

      this.calendarConfig = {
         format: Constants.formats.fullDate,
         disableKeypress: true,
         showGoToCurrent: false,
         min: this.minEndDate,
         max: this.maxEndDate,
         monthFormat: Constants.formats.monthFormat,
         openOnFocus: false
      };
   }

   setDate($event) {
      const limitEndDate = moment($event);
      this.reportDate = limitEndDate.format(this.formats.momentYYYYMMDD);
   }

   subscribeClientDetails() {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe((data: IClientDetails) => {
         if (data && data.EmailAddress && data.EmailAddress.length) {
            this.email = data.EmailAddress;
            this.emailChange();
         } else {
            this.email = '';
         }
      });
   }

   reportSuspiciousInfoChange() {
      this.reportSuspiciousInfo = this.reportSuspiciousText.length + this.label.slash + this.maxLimit.reason;
      this.isFormValid = this.isEmailValid && this.isAccountNumberValid && this.isBankNameValid;
   }

   totalAmountChange(amount) {
      this.totalAmount = amount.viewModel.replace(this.pattern.replaceSpace, '').replace(this.value.currency, '');
      if (!CommonUtility.isValidText(this.totalAmount, this.pattern.initialNonZero) || this.totalAmount.substr(0, 1) === this.value.zero) {
         this.totalAmount = this.totalAmount.substr(0, this.totalAmount.length - 1);
      }
      this.totalAmountInfo = this.totalAmount.length + this.label.slash + this.maxLimit.totalAmount;
   }

   accountNumberChange() {
      this.accountNumberInfo = this.accountNumber.length + this.label.slash + this.maxLimit.accountNumber;
      this.isAccountNumberValid = CommonUtility.isValidText(this.accountNumber, this.pattern.alphaNumeric) || !this.accountNumber.length;
      this.isFormValid = this.isEmailValid && this.isAccountNumberValid && this.isBankNameValid;
   }

   bankNameChange() {
      this.bankNameInfo = this.bankName.length + this.label.slash + this.maxLimit.bankName;
      this.isBankNameValid = CommonUtility.isValidText(this.bankName, this.pattern.alphaNumericWithSpace) || !this.bankName.length;
      this.isFormValid = this.isEmailValid && this.isAccountNumberValid && this.isBankNameValid;
   }

   emailChange() {
      this.isEmailValid = CommonUtility.isValidEmail(this.email);
      this.isFormValid = this.isEmailValid && this.isAccountNumberValid && this.isBankNameValid;
   }

   getReportSuspiciousAttempts() {
      this.showSpinner = true;
      this.feedbackService.reportSuspiciousAttempts().subscribe((attempts) => {
         if (attempts) {
            this.attempt = attempts.data;
            this.attemptsCompletedFlag = this.attempt.attemptsCompletedFlag;
            this.showSpinner = false;
         } else {
            this.showSpinner = false;
         }
      }, (error) => {
         this.showSpinner = false;
      });
   }

   sendSuspiciousReport() {
      if (!(this.showLoader || !this.isFormValid || !this.reportSuspiciousText.length)) {
         this.showLoader = true;
         this.feedbackDetails = this.ReportSuspiciousReq();
         this.feedbackService.reportSuspiciousSubmit(this.feedbackDetails).subscribe((response) => {
            if (response) {
               this.attempt = response.data;
               this.attemptsCompletedFlag = this.attempt.attemptsCompletedFlag;
               this.showLoader = false;
               this.alertMessage.emit({ showSuccess: true, showError: false, alertMessage: this.message.successMsg });
               this.assignDefaultValue();
            }
         }, (error) => {
            this.systemErrorService.closeError();
            this.showLoader = false;
            this.tryAgain = true;
         });
      }
   }

   // Analytics for third party details.
   GAnalytics() {
      this.sendEvent(
         this.GAEvent.accountSelected,
         this.GALabel.accountSelected,
         String(this.selectedAccount.AccountType ? true : false),
         this.GACategory
      );
      this.sendEvent(
         this.GAEvent.amount,
         this.GALabel.amount,
         String(this.totalAmount ? true : false),
         this.GACategory
      );
      this.sendEvent(
         this.GAEvent.thirdPartyAccount,
         this.GALabel.thirdPartyAccount,
         String(this.accountNumber ? true : false),
         this.GACategory
      );
      this.sendEvent(
         this.GAEvent.thirdPartyBank,
         this.GALabel.thirdPartyBank,
         String(this.bankName ? true : false),
         this.GACategory
      );
   }

   ReportSuspiciousReq(): IReportSuspicious {
      this.GAnalytics();
      const reportSuspicious = {
         incidentDate: this.reportDate,
         accountNumber: this.selectedAccount.AccountType ? String(this.selectedAccount.AccountNumber) : '',
         totalAmount: Number(this.totalAmount),
         thirdPartyAccountNumber: this.accountNumber,
         thirdPartyBankName: this.bankName,
         incidentDescription: this.reportSuspiciousText,
         emailId: this.email
      };
      return reportSuspicious;
   }

   onAccountSelect(account: IDashboardAccount) {
      this.defaultAccount = false;
      this.selectedAccount = account;
      this.selectedAccountName = account.AccountName;
   }

   setAlertMessage($event: IAlertMessage) {
      this.ngOnInit();
      this.alertMessage.emit($event);
   }
}

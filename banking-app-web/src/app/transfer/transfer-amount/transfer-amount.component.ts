import * as moment from 'moment';
import { Moment } from 'moment';
import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, Injector } from '@angular/core';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

import { TransferService } from './../transfer.service';
import { IAccountDetail, IReoccurenceModel, ILimitDetail, IRadioButtonItem } from './../../core/services/models';
import { IWorkflowChildComponent, IStepInfo } from '../../shared/components/work-flow/work-flow.models';
import { ITransferAmountVm, ReoccurenceModel } from '../transfer.models';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { ITransactionFrequency } from '../../core/utils/models';
import { IDatePickerConfig } from 'ng2-date-picker';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { LoaderService } from '../../core/services/loader.service';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
   selector: 'app-transfer-amount',
   templateUrl: './transfer-amount.component.html',
   styleUrls: ['./transfer-amount.component.scss']
})
export class TransferAmountComponent extends BaseComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {

   @Output() isComponentValid = new EventEmitter<boolean>();
   @ViewChild('tansferAmountForm') transferToForm;

   reoccurenceNumber = '';
   dp: BsDatepickerDirective;
   vm: ITransferAmountVm;
   accounts: IAccountDetail[];
   selectedFromAccounts: IAccountDetail[];
   selectedToAccounts: IAccountDetail[];
   showOverlay = false;
   insufficientFunds = false;
   isAmountEmpty = false;
   isAccountsLoaded = false;
   isSameDate = true;
   todayDate = new Date();
   isMinimumViolated: boolean;
   allowedMinimumValue = Constants.payMinimumVariableValues.amountMinValue;
   repeatTransferMessage = Constants.labels.repeatTransferErrorMessage;
   private repeatTypesConstant = Constants.VariableValues.repeatType;
   endDateRepeatTypeConstant = Constants.VariableValues.endDateRepeatType;
   paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
   selectedPaymentFrequency: ITransactionFrequency;
   labels = Constants.labels;
   repeatTypeValues: IRadioButtonItem[];
   formatDate: Moment;
   formatEndDate: Moment;
   minPaymentDate = moment();
   maxPaymentDate = CommonUtility.getNextDate(new Date(), 1, 'years');
   config = CommonUtility.getConfig(this.minPaymentDate, this.maxPaymentDate);
   minPaymentEndDate = CommonUtility.getNextDate(new Date(), 1, 'days');
   maxPaymentEndDate = CommonUtility.getNextDate(new Date(), 1, 'years');
   endConfig = CommonUtility.getConfig(this.minPaymentEndDate, this.maxPaymentEndDate);
   skeletonMode: Boolean;
   areAccountsLoaded = false;
   toAccountWarning = false;
   fromAccountWarning = false;
   todayDateDisabled = moment(new Date()).format(Constants.formats.fullDate);
   repeatTransferWeeklyMessage = Constants.labels.repeatTransferWeekMessage;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   constructor(private transferService: TransferService,
      private clientProfileDetailsService: ClientProfileDetailsService,
      private loader: LoaderService,
      injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.skeletonMode = true;
      this.vm = this.transferService.getTransferAmountVm();
      this.formatDate = moment(this.vm.payDate);
      this.formatEndDate = moment(this.vm.endDate);
      if (!(this.vm.reoccurrenceItem && this.vm.reoccurrenceItem.reoccurrenceFrequency)) {
         this.selectedPaymentFrequency = this.paymentRecurrenceFrequencies[0].value;
      } else {
         this.selectedPaymentFrequency =
            this.paymentRecurrenceFrequencies.find(m => m.value.code === this.vm.reoccurrenceItem.reoccurrenceFrequency).value;
         this.reoccurenceNumber = this.vm.reoccurrenceItem.reoccurrenceOccur.toString();
      }
      this.loader.show();
      this.transferService.getActiveAccounts().subscribe(response => {
         this.accounts = response;
         this.setAccountFrom();
         this.setAccountTo();
         this.loader.hide();
         if (this.accounts.length <= 1 || this.setFromAccounts(this.accounts) || this.setToAccounts(this.accounts)) {
            this.showOverlay = true;
            return;
         }

         this.areAccountsLoaded = this.accounts.length !== 0;
         this.skeletonMode = false;
         if (this.vm.amount) {
            this.onAmountChange(this.vm.amount);
         }
         this.validate();
      });

      if (!this.vm.availableTransferLimit) {
         this.loader.show();
         this.vm.availableTransferLimit = 0;
         this.transferService.getLimits().subscribe(response => {
            this.loader.hide();
            this.updateTranferLimit(response);
         });
      }
      this.repeatTypeValues = CommonUtility.getRepeatType();
      this.selectedRepeatType(this.vm.repeatType);
   }
   selectedRepeatType(value) {
      this.vm.repeatType = value ? value : Object.getOwnPropertyNames(this.repeatTypesConstant)[0];
   }
   updateTranferLimit(payLimits: ILimitDetail[]) {
      const paymentLimit = payLimits.find(limit => {
         return limit.limitType === Constants.VariableValues.settings.widgetTypes.payment;
      });
      const transferLimit = payLimits.find(limit => {
         return limit.limitType === Constants.VariableValues.settings.widgetTypes.transfer;
      });
      this.vm.availableTransferLimit = transferLimit.userAvailableDailyLimit;
   }
   ngAfterViewInit() {
      this.transferToForm.valueChanges
         .subscribe(values => this.validate());
   }

   setDate(value) {
      this.vm.payDate = value;
      this.minPaymentEndDate = CommonUtility.getNextDate(this.vm.payDate, 1, 'days');
      this.endConfig = CommonUtility.getConfig(this.minPaymentEndDate, this.formatEndDate);
      this.formatEndDate = moment(this.formatEndDate);
      this.vm.repeatDurationText = CommonUtility.getRepeatDurationText(this.vm.payDate, this.formatEndDate
         , this.selectedPaymentFrequency.code);
      this.vm.repeatStatusText = CommonUtility.getJourneyOccuranceMessage(this.selectedPaymentFrequency.code,
         this.vm.repeatType, this.formatEndDate, this.vm.reoccurrenceItem.reoccurrenceOccur);
      if (value && this.todayDate) {
         this.isSameDate = CommonUtility.isSameDateAs(value, this.todayDate);
         if (this.isSameDate) {
            this.onPaymentFrequencyChanged(this.paymentRecurrenceFrequencies[0].value);
         }
      }
   }
   setEndDate(value) {
      this.vm.endDate = moment(value);
      this.vm.repeatDurationText = CommonUtility.getRepeatDurationText(this.vm.payDate, this.vm.endDate
         , this.selectedPaymentFrequency.code);
      this.vm.repeatStatusText = CommonUtility.getJourneyOccuranceMessage(this.selectedPaymentFrequency.code,
         this.vm.repeatType, value, this.vm.reoccurrenceItem.reoccurrenceOccur);
   }

   setAccountFrom() {
      if (!this.vm.selectedFromAccount && this.vm.accountFromDashboard) {
         this.vm.selectedFromAccount = this.accounts.filter((ac) => {
            return ac.itemAccountId === this.vm.accountFromDashboard;
         })[0];
      }
   }

   setAccountTo() {
      if (!this.vm.selectedToAccount && this.vm.accountToTransfer) {
         this.vm.selectedToAccount = this.accounts.filter((ac) => {
            return ac.itemAccountId === this.vm.accountToTransfer;
         })[0];
      }
   }

   validate() {
      let valid: boolean;
      if (!this.vm.isValid || this.vm.isTransferLimitExceeded) {
         valid = false;
      } else {
         valid = this.transferToForm.valid && !this.isNumReccurencesInvalid();
      }
      if (this.transferToForm.dirty) {
         this.transferService.transferWorkflowSteps.amountStep.isDirty = true;
      }
      valid = valid && !this.skeletonMode;
      this.isComponentValid.emit(valid);
      this.isAmountEmpty = !this.vm.isValid && !this.insufficientFunds && !this.vm.isTransferLimitExceeded;

   }

   onAmountChange(value) {
      this.vm.amount = value;
      this.isMinimumViolated = this.vm.amount < this.allowedMinimumValue && this.vm.amount > 0;
      this.vm.allowedTransferLimit = this.vm.availableTransferLimit - this.vm.amount;
      this.vm.isTransferLimitExceeded = this.vm.allowedTransferLimit < 0;
      this.validatePaymentAmount(this.vm.selectedFromAccount.availableBalance);
   }

   validatePaymentAmount(availableBalance: number) {
      this.insufficientFunds = this.vm.amount > 0 && this.vm.amount > availableBalance;
      this.vm.isValid = !this.isMinimumViolated && !this.insufficientFunds && this.vm.amount > 0 && this.vm.amount <= availableBalance;
      this.validate();
   }

   nextClick(currentStep: number) {
      this.vm.reoccurrenceItem.reoccurrenceFrequency = this.selectedPaymentFrequency.code;
      this.vm.reoccurrenceItem.reoccurrenceToDate = moment(this.vm.endDate).format('YYYY-MM-DD');
      this.vm.reoccurrenceItem.reoccurrenceOccur = parseInt(this.reoccurenceNumber, 10);
      this.transferService.saveTransferAmountInfo(this.vm);
      this.sendEvent('transfer_amount_and_account_click_on_next');
   }
   onFromAccountSelection(selectedAccount: IAccountDetail) {
      this.vm.selectedFromAccount = selectedAccount;
      this.selectedToAccounts = CommonUtility.transferToAccounts(this.vm.selectedFromAccount, this.accounts);
      this.selectedToAccounts = this.selectedToAccounts.filter(account => {
         return (account.accountNumber !== selectedAccount.accountNumber && account.allowCredits);
      });
      if (this.vm.selectedToAccount && selectedAccount.accountNumber === this.vm.selectedToAccount.accountNumber) {
         this.vm.selectedToAccount = this.selectedToAccounts[0];
      }
      this.validatePaymentAmount(this.vm.selectedFromAccount.availableBalance);

      this.transferService.transferWorkflowSteps.amountStep.isDirty = true;
   }

   onToAccountSelection(selectedAccount: IAccountDetail) {
      this.vm.selectedToAccount = selectedAccount;
      this.transferService.transferWorkflowSteps.amountStep.isDirty = true;
   }

   onPaymentFrequencyChanged(paymentFrequency: ITransactionFrequency) {
      this.selectedPaymentFrequency = paymentFrequency;
      if (this.selectedPaymentFrequency.code !== null) {
         this.vm.repeatDurationText = CommonUtility.getRepeatDurationText(this.vm.payDate,
            this.vm.endDate, this.selectedPaymentFrequency.code);
         this.vm.repeatStatusText = CommonUtility.getJourneyOccuranceMessage(this.selectedPaymentFrequency.code,
            this.vm.repeatType, this.vm.endDate, this.vm.reoccurrenceItem.reoccurrenceOccur);
      }

      if (this.transferToForm.form.controls.numRecurrence) {
         this.transferToForm.form.controls.numRecurrence.reset();
      }
   }

   isNumReccurencesInvalid() {
      return this.isRecurrenceValueInvalid() ||
         this.isMonthlyRecurrenceInvalid() ||
         this.isWeeklyRecurrenceInvalid();
   }

   isRecurrenceValueInvalid(): boolean {
      if (this.vm.repeatType === this.endDateRepeatTypeConstant) {
         return false;
      } else {
         const isRecurrenceSelected = this.selectedPaymentFrequency !== Constants.VariableValues.paymentRecurrenceFrequency.none;
         return parseInt(this.reoccurenceNumber ? this.reoccurenceNumber : '0', 10) <= 0
            && isRecurrenceSelected;
      }
   }

   isMonthlyRecurrenceInvalid(): boolean {
      const isMonthlyRecurrence = this.selectedPaymentFrequency === Constants.VariableValues.paymentRecurrenceFrequency.monthly;
      return parseInt(this.reoccurenceNumber ? this.reoccurenceNumber : '0', 10)
         > Constants.VariableValues.paymentRecurrenceFrequency.monthly.maxValue
         && isMonthlyRecurrence;
   }

   isWeeklyRecurrenceInvalid(): boolean {
      const isWeeklyReccurence = this.selectedPaymentFrequency === Constants.VariableValues.paymentRecurrenceFrequency.weekly;
      return parseInt(this.reoccurenceNumber ? this.reoccurenceNumber : '0', 10)
         > Constants.VariableValues.paymentRecurrenceFrequency.weekly.maxValue
         && isWeeklyReccurence;
   }

   stepClick(stepInfo: IStepInfo) {
   }

   private setToAccounts(accounts) {
      this.selectedToAccounts = CommonUtility.transferToAccounts(this.vm.selectedFromAccount, accounts);
      this.selectedToAccounts = this.selectedToAccounts.filter(account => {
         return (account.accountNumber !== this.vm.selectedFromAccount.accountNumber && account.allowCredits);
      });
      if (!this.vm.selectedToAccount) {
         this.vm.selectedToAccount = this.selectedToAccounts[0];
      }
      return !this.vm.selectedToAccount;
   }
   private setFromAccounts(accounts) {
      this.selectedFromAccounts = CommonUtility.transferFromAccounts(accounts);
      if (!this.vm.selectedFromAccount) {
         const allowDebitAccounts = this.selectedFromAccounts.filter(account => account.allowDebits);
         this.vm.selectedFromAccount = this.clientProfileDetailsService.getDefaultAccount(allowDebitAccounts) ||
            allowDebitAccounts[0];
      }
      return !this.vm.selectedFromAccount;
   }
   accountMessages(account, isFromAccount: boolean = false) {
      // To do
      let msg: string;
      const from = 'from';
      const to = 'to';
      if (isFromAccount) {
         // Handle From account messages
         if (account && account.accountRules && account.accountRules.futureTransferFrom === false) {
            msg = CommonUtility.format(Constants.labels.futureTransferWarning, from);
            if (account.accountRules.recurringTransferFrom === false) {
               msg = CommonUtility.format(Constants.labels.repeatTransferWarning, from);
            }
            this.fromAccountWarning = true;
            this.setDate(new Date());
         } else {
            this.fromAccountWarning = false;
         }
      } else {
         // Handle To account messages
         if (account && account.accountRules && account.accountRules.futureTransferTo === false) {
            msg = CommonUtility.format(Constants.labels.futureTransferWarning, to);
            if (account.accountRules.recurringTransferTo === false) {
               msg = CommonUtility.format(Constants.labels.repeatTransferWarning, to);
            }
            this.toAccountWarning = true;
            this.setDate(new Date());
         } else {
            this.toAccountWarning = false;
         }
      }
      return msg;
   }
   onRepeatTypeChange(repeatTypeSelectedItem) {
      this.vm.repeatType = repeatTypeSelectedItem.value;
      this.vm.repeatStatusText = CommonUtility.getJourneyOccuranceMessage(this.selectedPaymentFrequency.code,
         this.vm.repeatType, this.vm.endDate, this.vm.reoccurrenceItem.reoccurrenceOccur);
   }
}

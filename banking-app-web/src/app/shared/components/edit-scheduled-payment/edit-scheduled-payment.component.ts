import * as moment from 'moment';
import { Moment } from 'moment';
import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../../dashboard/account.service';

import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';

import { ITransactionFrequency } from '../../../core/utils/models';
import { IDatePickerConfig } from 'ng2-date-picker';
import { IAccountDetail, IScheduledTransaction } from '../../../core/services/models';
import { BaseComponent } from '../../../core/components/base/base.component';
import { SystemErrorService } from '../../../core/services/system-services.service';


@Component({
   selector: 'app-edit-scheduled-payment',
   templateUrl: './edit-scheduled-payment.component.html',
   styleUrls: ['./edit-scheduled-payment.component.scss']
})
export class EditScheduledPaymentComponent extends BaseComponent implements OnInit, AfterViewInit {
   btnSaveText = 'Save';
   paymentFailedMsg: string;
   retryCount = 0;
   retryEditCount = 0;
   isDeleteFailed: boolean;
   accountId: number;
   retryMaxCount = 4;
   @Output() refreshPayment = new EventEmitter();
   @ViewChild('transactionForm') transactionForm;
   vm: IScheduledTransaction;
   isDeleteInProcess: boolean;
   @Input() transactionDetail: IScheduledTransaction;
   @Input() transactionType: string;
   @Input() transactionID: number;
   accounts: IAccountDetail[];
   selectedAccount: IAccountDetail;
   paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.editPaymentRecurrenceFrequency);
   selectedPaymentFrequency = this.paymentRecurrenceFrequencies[0].value;
   formatDate: Moment;
   minPaymentDate = moment();
   maxPaymentDate = moment().add(1, 'years');
   smsMinLength = Constants.VariableValues.smsMinLength;
   smsMaxLength = Constants.VariableValues.smsMaxLength;
   referenceMaxLength = Constants.VariableValues.referenceMaxLength;
   patterns = Constants.patterns;
   messages = Constants.messages;
   config: IDatePickerConfig = {
      format: Constants.formats.fullDate,
      disableKeypress: true,
      showGoToCurrent: false,
      min: this.minPaymentDate,
      max: this.maxPaymentDate,
      monthFormat: Constants.formats.monthFormat
   };
   labels = Constants.labels;
   notifications = CommonUtility.getNotificationTypes();
   isValid = true;
   isAmountValid = true;
   isButtonLoader = false;
   paymentEndDate;
   isDateChangeAllowed = true;
   payAmount;
   paymentStartDate;
   isError = false;
   isDeleteOverlay: boolean;
   isOriginRecipent: boolean;
   isDeletionDisabled: boolean;
   showCantBeDeletedMsg: boolean;
   disableBtnErrorMsg = true;

   constructor(private accountService: AccountService, private route: ActivatedRoute,
      private router: Router, injector: Injector, private systemErrorService: SystemErrorService) {
      super(injector);
      this.route.params.subscribe((params) => {
         this.transactionType = params.transactionType;
         this.transactionID = params.transactionID;
         this.accountId = params.accountId;
      });
   }

   ngOnInit() {
      this.getAccounts().subscribe((results) => {
         this.vm = CommonUtility.clone(this.transactionDetail);
         this.showCantBeDeletedMsg = this.isNonEditable();
         this.isDeletionDisabled = this.vm.capturedDate && (this.vm.capturedDate === this.vm.startDate);
         this.accounts = results;
         this.payAmount = this.vm.amount;
         this.setSelectedAccount();
         if (this.vm.reoccurrenceItem) {
            this.populatePaymentFrequency(this.vm.reoccurrenceItem.reoccurrenceFrequency);
            this.paymentEndDate = this.getPaymentEndDate(this.vm.reoccurrenceItem.reoccurrenceFrequency,
               this.vm.startDate, this.vm.reoccurrenceItem.reoccurrenceOccur);
            this.paymentStartDate = this.vm.startDate;
         }
         this.formatDate = moment(this.vm.startDate);
         // allow user to change date only if recurrence has not started
         this.isDateChangeAllowed = new Date(this.vm.startDate) >= new Date();
         this.setNotificationDetails();
      });
   }
   isNonEditable(): boolean {
      const timeDiffinMs = +new Date(this.vm.nextTransDate) - Date.now();
      const oneHourInMs = 60 * 60 * 1000;
      if (timeDiffinMs < oneHourInMs) {
         return true;
      } else {
         return false;
      }
   }
   ngAfterViewInit() {
      this.transactionForm.valueChanges
         .subscribe(values => {
            this.validate();
         });
   }

   setNotificationDetails() {
      if (!this.vm.notificationDetail && this.transactionType !== 'Transfer') {
         this.vm.notificationDetail = {
            notificationType: Constants.notificationTypes.none,
            notificationAddress: ''
         };
      }
   }

   validate() {
      this.isValid = this.transactionForm.valid && this.isNotificationValid() && !this.isNumReccurencesInvalid();
   }

   setSelectedAccount() {
      this.selectedAccount = this.accounts.find((account) => {
         return account.accountNumber === this.vm.fromAccount.accountNumber;
      });
   }

   getAccounts(): Observable<IAccountDetail[]> {
      let request;
      switch (this.transactionType) {
         case Constants.SchedulePaymentType.payment.name:
            request = this.accountService.getPaymentAccounts();
            break;
         case Constants.SchedulePaymentType.transfer.name:
            request = this.accountService.getTransferAccounts();
            break;
         case Constants.SchedulePaymentType.prepaid.name:
            request = this.accountService.getPrepaidAccounts();
            break;
      }
      return request;
   }

   // handle account selection
   onAccountSelection(account: IAccountDetail) {
      this.selectedAccount = account;
      this.vm.fromAccount = {
         accountNumber: account.accountNumber,
      };
   }

   setDate(value) {
      this.vm.startDate = value;
      this.paymentStartDate = value;
      if (this.vm.reoccurrenceItem) {
         this.setPaymentEndDate();
      }
   }

   populatePaymentFrequency(recurrenceFrequency: string) {
      switch (recurrenceFrequency) {
         case Constants.editPaymentRecurrenceFrequency.monthly.code:
            this.selectedPaymentFrequency = Constants.editPaymentRecurrenceFrequency.monthly;
            break;
         case Constants.editPaymentRecurrenceFrequency.weekly.code:
            this.selectedPaymentFrequency = Constants.editPaymentRecurrenceFrequency.weekly;
            break;
      }
   }

   onPaymentFrequencyChanged(paymentFrequency: ITransactionFrequency) {
      this.selectedPaymentFrequency = paymentFrequency;
      this.vm.reoccurrenceItem.reoccurrenceOccur = null;
      this.vm.reoccurrenceItem.reoccurrenceFrequency = paymentFrequency.text;
      this.vm.reoccurrenceItem.reoccSubFreqVal = this.getPaymentRecurrenceSubFrequency(paymentFrequency.code, this.vm.startDate);
      this.vm.reoccurrenceItem.reoccSubFreqType = this.getPaymentRecurrenceSubFrequencyType(paymentFrequency.code);
      this.setPaymentEndDate();
   }

   getPaymentRecurrenceSubFrequencyType(paymentFrequency: string): string {
      let reoccSubFreqType;
      switch (paymentFrequency) {
         case Constants.editPaymentRecurrenceFrequency.monthly.code:
            reoccSubFreqType = 'DayOfMonth';
            break;
         case Constants.editPaymentRecurrenceFrequency.weekly.code:
            reoccSubFreqType = 'DayOfWeek';
            break;
      }

      return reoccSubFreqType;
   }

   getPaymentRecurrenceSubFrequency(paymentFrequency: string, date: string): string {
      let dayOfrecurrence = 0;
      const paymentDate = new Date(date);
      switch (paymentFrequency) {
         case Constants.editPaymentRecurrenceFrequency.monthly.code:
            dayOfrecurrence = paymentDate.getDate();
            break;
         case Constants.editPaymentRecurrenceFrequency.weekly.code:
            dayOfrecurrence = paymentDate.getDay();
            break;
      }

      return dayOfrecurrence.toString();
   }

   isNumReccurencesInvalid() {
      let isInvalid = false;
      if (this.vm.reoccurrenceItem) {
         isInvalid = this.isRecurrenceValueInvalid() ||
            this.isMonthlyRecurrenceInvalid() ||
            this.isWeeklyRecurrenceInvalid();
      }
      return isInvalid;
   }

   isRecurrenceValueInvalid(): boolean {
      return (!this.vm.reoccurrenceItem.reoccurrenceOccur || this.vm.reoccurrenceItem.reoccurrenceOccur <= 0);
   }

   isMonthlyRecurrenceInvalid(): boolean {
      const isMonthlyRecurrence = this.selectedPaymentFrequency === Constants.editPaymentRecurrenceFrequency.monthly;
      return isMonthlyRecurrence
         && this.vm.reoccurrenceItem.reoccurrenceOccur
         && this.vm.reoccurrenceItem.reoccurrenceOccur > Constants.editPaymentRecurrenceFrequency.monthly.maxValue;
   }

   isWeeklyRecurrenceInvalid(): boolean {
      const isWeeklyReccurence = this.selectedPaymentFrequency === Constants.editPaymentRecurrenceFrequency.weekly;
      return isWeeklyReccurence
         && this.vm.reoccurrenceItem.reoccurrenceOccur
         && this.vm.reoccurrenceItem.reoccurrenceOccur > Constants.editPaymentRecurrenceFrequency.weekly.maxValue;
   }

   isNotificationValid() {
      let isValid = true;
      if (this.vm.notificationDetail) {
         const notificationType = this.vm.notificationDetail.notificationType,
            notificationAddress = this.vm.notificationDetail.notificationAddress;
         if ((notificationType.toLocaleLowerCase() === Constants.notificationTypes.SMS.toLocaleLowerCase()) ||
            (notificationType.toLocaleLowerCase() === Constants.notificationTypes.Fax.toLocaleLowerCase())) {
            isValid = notificationAddress ? CommonUtility.isValidMobile(notificationAddress) : false;
         } else if (notificationType.toLocaleLowerCase() === Constants.notificationTypes.email.toLocaleLowerCase()) {
            isValid = notificationAddress ? CommonUtility.isValidEmail(notificationAddress) : false;
         } else {
            isValid = this.transactionForm.valid;
         }
      }
      return isValid;
   }

   onMobileNumberChange(number) {
      this.validate();
   }

   onNotificationChange(selected) {
      this.vm.notificationDetail.notificationAddress = '';
      this.vm.notificationDetail.notificationType = selected.name;
   }

   onAmountChange(value) {
      if (parseInt(value, 10)) {
         this.isValid = true;
         this.isAmountValid = true;
         this.vm.amount = parseInt(value, 10);
      } else {
         this.isValid = false;
         this.isAmountValid = false;
      }
   }
   setPaymentEndDate() {
      this.paymentEndDate = this.getPaymentEndDate(this.vm.reoccurrenceItem.reoccurrenceFrequency,
         this.vm.startDate, this.vm.reoccurrenceItem.reoccurrenceOccur);
   }
   getPaymentEndDate(recurrenceFrequency: string, originDate: string, numReccurences: number) {
      let endDate;
      const startDate = moment(originDate);
      switch (recurrenceFrequency) {
         case Constants.editPaymentRecurrenceFrequency.monthly.code:
            endDate = startDate.add(numReccurences, 'M');
            break;
         case Constants.editPaymentRecurrenceFrequency.weekly.code:
            endDate = startDate.add(numReccurences, 'w');
            break;
      }
      return endDate;
   }

   updateScheduledPayment() {
      this.btnSaveText = 'Try again';
      this.retryEditCount++;
      if (this.retryEditCount > 4) {
         this.paymentFailedMsg = 'Payment update unsuccessful. Please try again later';
         return;
      }

      this.isButtonLoader = true;
      let request;
      const payload = this.vm;
      if (payload.reoccurrenceItem) {
         payload.reoccurrenceItem.reoccOccurrencesLeft = payload.reoccurrenceItem.reoccurrenceOccur;
         delete payload.reoccurrenceItem.reoccurrenceToDate;
      }
      // convert to yyyy-mm-dd format
      payload.startDate = moment(payload.startDate).format(Constants.formats.momentYYYYMMDD);
      // removed unwanted fields from payload
      delete payload.nextTransDate;
      this.accountService.createGUID();
      switch (this.transactionType) {
         case Constants.SchedulePaymentType.payment.name:
            request = this.accountService.saveScheduledPaymentDetail(payload);
            break;
         case Constants.SchedulePaymentType.transfer.name:
            request = this.accountService.saveScheduledTransferDetail(payload);
            break;
         case Constants.SchedulePaymentType.prepaid.name:

            request = this.accountService.saveScheduledPrepaidDetail(payload);
            break;
      }
      request.subscribe((response) => {
         this.isButtonLoader = false;
         if (this.accountService.isTransactionStatusValid(response)) {
            this.accountService.saveSuccessState(this.vm);
            this.refreshPayment.emit();
         } else {
            this.isError = true;
            this.paymentFailedMsg = 'Payment update unsuccessful.';
         }
      }, (error) => {
         this.isButtonLoader = false;
         this.isError = true;
         this.paymentFailedMsg = 'Payment update unsuccessful.';
         this.systemErrorService.raiseError({ error: Constants.VariableValues.sytemErrorMessages.transactionMessage });
      });
   }
   openDeleteOverlay() {
      this.isDeleteOverlay = true;
      this.sendEvent('click_on_delete_edit_scheduled_payment');
   }

   checkResponse(response): any {
      this.isDeleteInProcess = false;
      if (this.accountService.isTransactionStatusValid(response)) {
         if (this.accountId) {
            const url = CommonUtility.format(Constants.path.schedulePayment, this.accountId);
            this.router.navigateByUrl(url);
         } else {
            if (this.router.url.endsWith(Constants.path.recipient)) {
               this.refreshPayment.emit();
            } else {
               this.router.navigateByUrl(Constants.path.recipient);
            }

         }
      } else {
         this.handleError();
      }
   }

   removeScheduleTransaction() {
      this.retryCount++;
      if (this.retryCount > 4) {
         this.paymentFailedMsg = 'Payment delete unsuccessful. Please try again later.';
         return;
      }
      this.isDeleteOverlay = false;
      let recurringId = null, transactionID: number;
      this.isDeleteInProcess = true;
      transactionID = this.transactionID;
      if (this.vm.reoccurrenceItem) {
         recurringId = { recinstrid: this.vm.reoccurrenceItem.recInstrID };
      } else if (this.transactionType === Constants.SchedulePaymentType.prepaid.name) {
         recurringId = { batchId: this.vm.batchID };
      } else {
         transactionID = this.vm.batchID;
      }
      switch (this.transactionType) {
         case Constants.SchedulePaymentType.transfer.name:
            this.accountService.removeScheduledTransferDetail(transactionID, recurringId)
               .subscribe(response => this.checkResponse(response), err => this.handleError());
            break;
         case Constants.SchedulePaymentType.prepaid.name:
            this.accountService.removeScheduledPrepaidDetail(transactionID, recurringId)
               .subscribe(response => this.checkResponse(response), err => this.handleError());
            break;
         case Constants.SchedulePaymentType.payment.name:
            this.accountService.removeScheduledPaymentDetail(transactionID, recurringId)
               .subscribe(response => this.checkResponse(response), err => this.handleError());
            break;
      }
   }
   closeDeleteOverlay() {
      this.isDeleteOverlay = false;
      this.isDeleteInProcess = false;
   }
   handleError() {
      this.isDeleteInProcess = false;
      this.isDeleteFailed = true;
      this.paymentFailedMsg = 'Payment delete unsuccessful.';
      this.systemErrorService.raiseError({ error: Constants.VariableValues.sytemErrorMessages.transactionMessage });
   }
}

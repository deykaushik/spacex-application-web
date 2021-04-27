import * as moment from 'moment';
import { Moment } from 'moment';
import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, Inject, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { PaymentService } from './../payment.service';
import { PreFillService } from '../../core/services/preFill.service';
import { IPayAmountVm, IPayToVm } from '../payment.models';
import { IWorkflowChildComponent, IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import {
   IAccountDetail, IPublicHoliday, IRadioButtonItem, IGaEvent, ICrossBorderQuoteCalculate,
   ICrossBorderQuoteCalculateResult
} from './../../core/services/models';
import { CommonUtility } from '../../core/utils/common';
import { Constants } from '../../core/utils/constants';
import { ITransactionFrequency } from '../../core/utils/models';
import { environment } from './../../../environments/environment';
import { IDatePickerConfig } from 'ng2-date-picker';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { BaseComponent } from '../../core/components/base/base.component';
import { constants } from 'os';
import { TermsAndConditionsConstants } from '../../shared/terms-and-conditions/constants';
import { ISettlementDetail } from './../../core/services/models';

@Component({
   selector: 'app-pay-amount',
   templateUrl: './pay-amount.component.html',
   styleUrls: ['./pay-amount.component.scss']
})
export class PayAmountComponent extends BaseComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {
   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() showTwoButtons = new EventEmitter<boolean>();
   @ViewChild('payAmountForm') payAmountForm;
   @ViewChild('customTooltip') customTooltip;

   vm: IPayAmountVm;
   payToVm: IPayToVm;
   accounts: IAccountDetail[];
   paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
   selectedPaymentFrequency: ITransactionFrequency = this.paymentRecurrenceFrequencies[0].value;
   isTransferAmountValid = true;
   isVisible = false;
   instantPaymentAllowed = environment.features.instantPayment;
   publicHolidays: IPublicHoliday[];
   isInstantPaymentValid = true;
   instantPayUnavailableMsg: string;
   currentDate = new Date();
   repeatTypeValues: IRadioButtonItem[];
   formatDate: Moment;
   formatEndDate: Moment;
   minPaymentDate = moment();
   maxPaymentDate = CommonUtility.getNextDate(new Date(), 1, 'years');
   config = CommonUtility.getConfig(this.minPaymentDate, this.maxPaymentDate);
   minPaymentEndDate = CommonUtility.getNextDate(new Date(), 1, 'days');
   maxPaymentEndDate = CommonUtility.getNextDate(new Date(), 1, 'years');
   endConfig = CommonUtility.getConfig(this.minPaymentEndDate, this.maxPaymentEndDate);
   convertStringToNumber = CommonUtility.convertStringToNumber;
   isSameDate = true;
   todayDate = new Date();
   isMinimumViolated: boolean;
   allowedMinimumValue = Constants.payMinimumVariableValues.amountMinValue;
   repeatPaymentMessage = Constants.labels.repeatPaymentErrorMessage;
   endDateRepeatTypeConstant = Constants.VariableValues.endDateRepeatType;
   repeatPaymentCreditCardMessage = Constants.labels.repeatPaymentCreditCardMessage;
   mobilePayNoSchedule = Constants.labels.mobilePayNoSchedule;
   isAccountPayment = false;
   isMobilePayment = false;
   isCreditCardPayment = false;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   skeletonMode: Boolean;
   labels = Constants.labels;
   insufficientFunds = false;
   showCalculation = false;
   showLimitExceedingError = false;
   invalidLimitExceededMessage: string;
   private repeatTypesConstant = Constants.VariableValues.repeatType;
   defaultCurrency = Constants.defaultCrossPlatformCurrency.name;
   currencies = [{ name: this.defaultCurrency }];
   crossBorderPaymentResult: ICrossBorderQuoteCalculateResult;
   showloader = false;
   crossBorderAmountMinimumLimit = 150;
   crossBorderPaymentBelowLimit = false;
   apiErrorMsg: string;
   apiErrorMsgShow = false;
   termsAndConditionsPath = TermsAndConditionsConstants.TermsGeneralHtml;
   isImaliLimitExceeded = false;
   toIncreaseDailyLimit = false;
   preFillData: ISettlementDetail;
   isInstantPayAvailableForAcc: boolean;
   completeAccountList: IAccountDetail[];
   allowInstantPaymentToggle = false;
   constructor(
      private paymentService: PaymentService,
      private preFillService: PreFillService,
      @Inject(DOCUMENT) private document: Document,
      private clientProfileDetailsService: ClientProfileDetailsService,
      injector: Injector
   ) {
      super(injector);
   }


   ngOnInit() {
      this.skeletonMode = true;
      this.preFillData = this.preFillService.settlementDetail;
      this.vm = this.paymentService.getPayAmountVm();
      this.formatDate = moment(this.vm.paymentDate);
      this.formatEndDate = moment(this.vm.endDate);
      this.payToVm = this.paymentService.getPayToVm();
      this.isAccountPayment = this.paymentService.isAccountPayment();
      this.isMobilePayment = this.paymentService.isMobilePayment();
      this.isCreditCardPayment = !this.isAccountPayment && !this.isMobilePayment;
      this.populatePaymentFrequency(this.vm.recurrenceFrequency);
      this.setCrossBorderPayment();
      this.paymentService.accountsDataObserver.subscribe(accounts => {
         this.accounts = accounts || [];
         this.completeAccountList = accounts;
         this.setAccountFrom();
         this.vm.selectedAccount = this.vm.selectedAccount || this.clientProfileDetailsService.getDefaultAccount(this.accounts)
            || (this.accounts.length ? this.accounts[0] : null);
         this.skeletonMode = false;
         this.validate();
      });
      this.isInstantPayAvailableForAcc = Constants.instantPayAllowedAccounts.includes(this.vm.selectedAccount.accountType);
      this.vm.availableTransferLimit = 0;
      this.vm.availableInstantTransferLimit = 0;
      this.vm.allowedTransferLimit = 0;
      // get payment limits
      this.paymentService.getPaymentLimits().subscribe(payLimits => {
         const paymentLimit = payLimits.find(limit => {
            return limit.limitType === Constants.VariableValues.settings.widgetTypes.payment;
         });
         const instantPaymentLimit = payLimits.find(limit => {
            return limit.limitType === Constants.VariableValues.settings.widgetTypes.instantpayment;
         });
         if (this.paymentService.isMobilePayment()) {
            const mobileLimit = payLimits.find(limit => {
               return limit.limitType === Constants.VariableValues.settings.widgetTypes.sendimali;
            });
            this.vm.availableTransferLimit = Math.min(paymentLimit.userAvailableDailyLimit, mobileLimit.userAvailableDailyLimit);
            this.isImaliLimitExceeded = (this.vm.availableTransferLimit === mobileLimit.userAvailableDailyLimit);
         } else {
            this.vm.availableTransferLimit = paymentLimit.userAvailableDailyLimit;
            this.vm.availableInstantTransferLimit = instantPaymentLimit.userAvailableDailyLimit;
            this.toIncreaseDailyLimit = this.vm.availableInstantTransferLimit > this.vm.availableTransferLimit;
         }
         this.vm.allowedTransferLimit = this.vm.availableTransferLimit;
         this.preFillAmount();
      });

      if (this.paymentService.isAccountPayment()) {
         // public holidays
         this.paymentService.getPublicHolidays()
            .finally(() => { this.allowInstantPaymentToggle = true; })
            .subscribe(response => {
               this.publicHolidays = response;
               this.validateInstantPayment();
            }, (error => {}));
      }
      this.repeatTypeValues = CommonUtility.getRepeatType();
      this.selectedRepeatType(this.vm.repeatType);
   }
   setCrossBorderPayment() {
      if (this.payToVm.isCrossBorderPaymentActive) {
         this.currencies.push({ name: this.payToVm.crossBorderPayment.beneficiaryDetails.beneficiaryCurrency + ' ' });
         this.vm.selectedCurrency = this.vm.selectedCurrency || this.currencies[0].name;
         this.vm.beneficiaryCurrency = this.payToVm.crossBorderPayment.beneficiaryDetails.beneficiaryCurrency;
         if (this.vm.transferAmount) {
            this.showCalculation = true;
         }
         this.showTwoButtons.emit(true);
      } else {
         this.vm.selectedCurrency = Constants.labels.currencySymbol;
      }
   }
   selectedRepeatType(value) {
      this.vm.repeatType = value ? value : Object.getOwnPropertyNames(this.repeatTypesConstant)[0];
   }
   onRepeatTypeChange(repeatTypeSelectedItem) {
      this.vm.repeatType = repeatTypeSelectedItem.value;
   }
   ngAfterViewInit() {
      this.payAmountForm.valueChanges
         .subscribe(values => this.validate());
   }

   setAccountFrom() {
      if (!this.vm.selectedAccount && this.vm.accountFromDashboard) {
         this.vm.selectedAccount = this.accounts.filter((ac) => {
            return ac.itemAccountId === this.vm.accountFromDashboard;
         })[0];
      }
   }

   setDate(value) {
      this.vm.paymentDate = value;
      this.minPaymentEndDate = CommonUtility.getNextDate(this.vm.paymentDate, 1, 'days');
      this.endConfig = CommonUtility.getConfig(this.minPaymentEndDate, this.formatEndDate);
      this.formatEndDate = moment(this.formatEndDate);
      this.vm.repeatDurationText = CommonUtility.getRepeatDurationText(this.vm.paymentDate, this.formatEndDate
         , this.selectedPaymentFrequency.code);
      if (value && this.todayDate) {
         this.isSameDate = CommonUtility.isSameDateAs(value, this.todayDate);
         if (this.isSameDate) {
            this.onPaymentFrequencyChanged(this.paymentRecurrenceFrequencies[0].value);
         }
      }
      this.validate();
   }
   setEndDate(value) {
      this.vm.endDate = value;
      this.vm.repeatDurationText = CommonUtility.getRepeatDurationText(this.vm.paymentDate, this.vm.endDate
         , this.selectedPaymentFrequency.code);
   }

   validate() {
      // TODO - patch fix for amount validation.
      // amount transaform needs to be updated and this code has to be cleaned
      let valid = this.vm.isValid && this.payAmountForm.valid && !this.vm.isTransferLimitExceeded && !this.isMinimumViolated
         && !this.crossBorderPaymentBelowLimit && (!this.vm.isInstantPay || !this.toIncreaseDailyLimit);
      if (!this.payToVm.isCrossBorderPaymentActive) {
         if (!this.vm.isInstantPay) {
            valid = valid && !this.isNumReccurencesInvalid();
         }

         if (!this.vm.selectedAccount) {
            valid = false;
         } else {
            this.insufficientFunds = (this.vm.transferAmount > 0) && (this.vm.transferAmount > this.vm.selectedAccount.availableBalance);
            if (!this.isSameDate) {
               this.insufficientFunds = false;
            }
            valid = valid && !this.insufficientFunds;
         }

         valid = valid && !this.skeletonMode;
      } else {
         valid = valid && this.vm.transferAmount > 0 && !this.skeletonMode && this.showCalculation;
      }
      this.isComponentValid.emit(valid);
   }

   onInstantPayClick(tooltip) {
      if (this.isInstantPaymentValid) {
         this.toggleInstantPayment();
      } else {
         this.showTooltip(tooltip);
      }
   }


   // toggle instant pay option
   toggleInstantPayment() {
      this.vm.isInstantPay = !this.vm.isInstantPay;
      if (this.vm.isInstantPay) {
         this.accounts = this.accounts.filter((acc) => {
            return (Constants.instantPayAllowedAccounts.includes(acc.accountType));
         });
      } else {
         this.accounts = this.completeAccountList;
      }
      this.onAmountChange(this.vm.transferAmount);
   }

   // handle amount change
   onAmountChange(value) {
      this.showCalculation = false;
      this.vm.transferAmount = value;
      this.vm.allowedTransferLimit = this.vm.isInstantPay ?
         (this.vm.availableInstantTransferLimit - this.vm.transferAmount) : (this.vm.availableTransferLimit - this.vm.transferAmount);
      this.vm.isTransferLimitExceeded = this.vm.allowedTransferLimit < 0;
      this.vm.isValid = !this.vm.isTransferLimitExceeded && this.vm.transferAmount > 0;
      this.isTransferAmountValid = this.vm.transferAmount && this.vm.transferAmount > 0;
      this.isMinimumViolated = this.vm.transferAmount < this.allowedMinimumValue && this.vm.transferAmount > 0;
      this.manageTransferLimitForCrossBorderPayment();
      this.validate();
   }

   // handle account selection
   onAccountSelection(account: IAccountDetail) {
      this.vm.selectedAccount = account;
      this.validate();
      if (Constants.instantPayAllowedAccounts.includes(this.vm.selectedAccount.accountType)) {
         this.isInstantPayAvailableForAcc = true;
         this.hideTooltip(this.customTooltip);
      } else {
         this.isInstantPayAvailableForAcc = false;
      }
      this.validateInstantPayment();
   }

   // toggle Overlay
   activeOverlay() {
      this.isVisible = !this.isVisible;
   }

   // hide Overlay
   hideOverlay(value) {
      this.isVisible = value;
   }

   // toggle tooltip Active
   showTooltip(pop) {
      this.instantPayUnavailableMsg = this.isInstantPayAvailableForBank() ?
         (this.isInstantPayAvailableForAcc ? this.labels.instantPay.timeErrorMessage : this.labels.instantPay.accountErrorMessage) :
         (this.isInstantPayAvailableForAcc ? this.labels.instantPay.bankErrorMessage : this.labels.instantPay.accountErrorMessage);
      pop.show();
   }

   hideTooltip(pop) {
      pop.hide();
   }

   onPaymentFrequencyChanged(paymentFrequency: ITransactionFrequency) {
      this.selectedPaymentFrequency = paymentFrequency;
      if (this.selectedPaymentFrequency.code !== null) {
         this.vm.repeatDurationText = CommonUtility.getRepeatDurationText(this.vm.paymentDate, this.vm.endDate
            , this.selectedPaymentFrequency.code);
      }
      if (this.payAmountForm.form.controls.numRecurrence) {
         this.payAmountForm.form.controls.numRecurrence.reset();
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
         return isRecurrenceSelected && (!this.vm.numRecurrence || this.vm.numRecurrence <= 0);
      }
   }

   isMonthlyRecurrenceInvalid(): boolean {
      const isMonthlyRecurrence = this.selectedPaymentFrequency === Constants.VariableValues.paymentRecurrenceFrequency.monthly;
      return isMonthlyRecurrence
         && this.vm.numRecurrence
         && this.vm.numRecurrence > Constants.VariableValues.paymentRecurrenceFrequency.monthly.maxValue;
   }

   isWeeklyRecurrenceInvalid(): boolean {
      const isWeeklyReccurence = this.selectedPaymentFrequency === Constants.VariableValues.paymentRecurrenceFrequency.weekly;
      return isWeeklyReccurence
         && this.vm.numRecurrence
         && this.vm.numRecurrence > Constants.VariableValues.paymentRecurrenceFrequency.weekly.maxValue;
   }

   nextClick(currentStep: number) {
      this.vm.recurrenceFrequency = this.selectedPaymentFrequency.code;
      if (this.vm.recurrenceFrequency === Constants.VariableValues.paymentRecurrenceFrequency.none.code) {
         this.vm.numRecurrence = null;
      }
      this.sendEvent('pay_amount_and_account_click_on_next');
      this.paymentService.savePayAmountInfo(this.vm);
   }
   declineClick() {
      this.vm.selectedCurrency = this.defaultCurrency;
      this.vm.transferAmount = null;
      this.showCalculation = false;
   }
   populatePaymentFrequency(recurrenceFrequency: string) {
      switch (recurrenceFrequency) {
         case Constants.VariableValues.paymentRecurrenceFrequency.none.code:
            this.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.none;
            break;
         case Constants.VariableValues.paymentRecurrenceFrequency.monthly.code:
            this.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.monthly;
            break;
         case Constants.VariableValues.paymentRecurrenceFrequency.weekly.code:
            this.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.weekly;
            break;
         default:
            throw Error('invalid paymenet recurrence frequency');
      }
   }

   stepClick(stepInfo: IStepInfo) {
   }

   validateInstantPayment() {
      let isValid = true;
      if (!this.isInstantPayAvailableForBank()) {
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

   isInstantPayAvailableForBank() {
      return this.payToVm.bank && this.payToVm.bank.universalCode && this.payToVm.bank.rTC;
   }

   isSaturday(): boolean {
      return Constants.days.allDays[this.currentDate.getDay()] === Constants.days.saturday;
   }

   isSunday(): boolean {
      return Constants.days.allDays[this.currentDate.getDay()] === Constants.days.sunday;
   }

   isWeekDay(): boolean {
      return !this.isSaturday() && !this.isSunday();
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

   isPublicHoliday(): IPublicHoliday {
      const todayDateString = this.currentDate.toDateString();
      return this.publicHolidays.find(holiday => new Date(holiday.date).toDateString() === todayDateString);
   }

   onCurrencyChange(event: Event, selected: any) {
      this.vm.selectedCurrency = selected.name;
      this.showCalculation = false;
      this.manageTransferLimitForCrossBorderPayment();
   }

   manageTransferLimitForCrossBorderPayment() {
      if (this.payToVm.isCrossBorderPaymentActive) {
         if (this.vm.selectedCurrency !== this.defaultCurrency) {
            this.vm.isTransferLimitExceeded = false;
            this.crossBorderPaymentBelowLimit = false;
            this.vm.isValid = !this.vm.isTransferLimitExceeded && this.vm.transferAmount > 0;
         } else {
            this.vm.isTransferLimitExceeded = this.vm.allowedTransferLimit < 0;
            this.vm.isValid = !this.vm.isTransferLimitExceeded && this.vm.transferAmount > 0;
            this.crossBorderPaymentBelowLimit = this.vm.transferAmount < this.crossBorderAmountMinimumLimit;
         }
      }
   }

   onCalculate() {
      this.showCalculation = false;
      this.isComponentValid.emit(false);
      this.showloader = true;
      this.showLimitExceedingError = false;
      const data: ICrossBorderQuoteCalculate = {
         beneficiaryCountry: this.payToVm.crossBorderPayment.country.code.trim(),
         beneficiaryCurrency: this.payToVm.crossBorderPayment.beneficiaryDetails.beneficiaryCurrency.trim(),
         paymentCurrency: this.vm.selectedCurrency.trim(),
         residentialStatus: this.payToVm.crossBorderPayment.beneficiaryDetails.residentialStatus,
         transactionID: this.payToVm.crossBorderPayment.beneficiaryDetails.transactionID
      };
      this.vm.transferAmount = this.convertStringToNumber(String(this.vm.transferAmount));
      if (data.beneficiaryCurrency === this.vm.selectedCurrency.trim()) {
         data.beneficiaryAmount = this.vm.transferAmount;
      } else {
         data.paymentAmount = this.vm.transferAmount;
      }
      this.paymentService.calculateQuote(data)
         .subscribe(result => {
            const transactionStatus = CommonUtility.getTransactionStatus(result && result.metadata, Constants.metadataKeys.transaction);
            if (transactionStatus.isValid) {
               this.crossBorderPaymentResult = result.data;
               this.vm.crossBorderPaymentAmount = result.data.totalPaymentAmount;
               this.vm.beneficiaryAmount = result.data.beneficiaryAmount;
               this.vm.paymentExchangeRate = result.data.paymentExchangeRate;
               this.vm.remittanceCharge = result.data.remittanceCharge || 0;
               this.vm.totalPaymentAmount = result.data.totalPaymentAmount;
               this.showloader = false;
               if ((result.data.totalPaymentAmount - result.data.remittanceCharge) < this.crossBorderAmountMinimumLimit) {
                  this.showCalculation = false;
                  this.showLimitExceedingError = true;
                  this.invalidLimitExceededMessage = Constants.labels.minimumDailyLimit;
                  this.isComponentValid.emit(false);
               } else {
                  this.showCalculation = true;
                  this.validate();
               }
            } else {
               // use transactionStatus.reason for error message
               this.showloader = false;
               this.showCalculation = false;
               this.showLimitExceedingError = true;
               this.invalidLimitExceededMessage = transactionStatus.reason;
               this.isComponentValid.emit(false);
            }
         },
            error => {
               this.showloader = false;
               this.showCalculation = false;
               this.apiErrorMsgShow = false;
               if (error.status >= 201 && error.status <= 299) {
                  this.apiErrorMsg = Constants.labels.apiStatus201To299ErrorMsg;
                  this.apiErrorMsgShow = true;
               } else if (error.status >= 300 && error.status <= 500) {
                  this.apiErrorMsg = Constants.labels.apiStatus300To500ErrorMsg;
                  this.apiErrorMsgShow = true;
               }
            });
   }

   preFillAmount() {
      if (this.preFillData && this.preFillData.settlementAmt) {
         this.vm.transferAmount = this.preFillData.settlementAmt;
         this.onAmountChange(this.vm.transferAmount);
         this.preFillData.settlementAmt = null;
      }
   }
}

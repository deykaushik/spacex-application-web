import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { OpenAccountService } from '../../../open-account.service';
import { IRadioButtonItem, IAccount, IDeposit, IApiResponse } from './../../../../core/services/models';
import { CommonUtility } from '../../../../core/utils/common';
import { Constants } from '../../../constants';

@Component({
   selector: 'app-recurring-payment',
   templateUrl: './recurring-payment.component.html',
   styleUrls: ['./recurring-payment.component.scss']
})
export class RecurringPaymentComponent implements OnInit {

   labels = Constants.labels.openAccount;
   openAccountMessages = Constants.messages.openNewAccount;
   openAccountValues = Constants.variableValues.openNewAccount;
   openAccountSymbols = Constants.symbols;
   amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;
   isRecuringPayments = true;
   paymentDurationList: IRadioButtonItem[];
   paymentDuration = {
      paymentType: this.openAccountMessages.paymentDuration
   };
   selectedPaymentDuration: string;
   note = true;
   selectedDay = this.labels.chooseDay;
   payoutDeposit: number;
   selectedAccount = this.labels.chooseAccount;
   days = [];
   accountList: IAccount;
   recurringDetails = [];
   productDetails: IDeposit;
   paymentOption: string;
   isWeekly: boolean;
   isMonthly: boolean;
   selectedMonth = 1;
   investmentEndDate: Date;
   accountNumber: string;
   isValidMonth = true;
   isDecrement: boolean;
   isIncrement = true;
   date: Date;
   day: number;
   totalDaysInMonth: number;
   remaningDays: number;
   isMaxAmount = true;
   isValidAmount: boolean;
   showLoader: boolean;
   frequencyDetails: IApiResponse;
   minimumAmount: number;
   recurringAccountType: string;
   isValidData: boolean;
   isAccountChange: boolean;
   isAmountValid: boolean;
   isSufficientBalance: boolean;
   selectedAmount: number;

   @Output() accountFlag = new EventEmitter<boolean>();
   @Output() recurringnext = new EventEmitter<boolean>();

   constructor(private openAccountService: OpenAccountService) { }

   ngOnInit() {
      this.isSufficientBalance = true;
      this.showLoader = true;
      this.isValidAmount = true;
      const date = moment();
      this.day = date.date();
      this.totalDaysInMonth = date.daysInMonth();
      this.remaningDays = this.totalDaysInMonth - this.day + this.selectedMonth;
      this.productDetails = this.openAccountService.getProductDetails();
      if (this.productDetails) {
         this.stopOrderFrequency(this.productDetails.productType);
      }
      this.days = this.openAccountValues.weekDays;
      this.initialDeposit();
      this.investmentEndDate = date.add(this.remaningDays, 'days').toDate();
   }

   recDetails(recurringDetails) {
      if (this.recurringDetails && this.recurringDetails[0] && this.recurringDetails[0].isRecurringYes) {
         this.payoutDeposit = this.recurringDetails[0].Amount;
         this.selectedAccount = this.recurringDetails[0].Account;
         if (this.recurringDetails[0].Day >= 1) {
            this.selectedMonth = this.recurringDetails[0].Day;
            this.isMonthly = true;
            this.isWeekly = false;
            this.selectedPaymentDuration = this.openAccountValues.monthly;
         } else {
            this.selectedDay = this.recurringDetails[0].Day;
            this.isWeekly = true;
            this.note = false;
            this.selectedPaymentDuration = this.openAccountValues.weekly;
         }
         this.isValidData = true;
         this.isAccountChange = true;
         this.isAmountValid = true;
      } else if (this.recurringDetails && this.recurringDetails[0] && this.recurringDetails[0]) {
         this.isRecuringPayments = this.recurringDetails[0].isRecurringYes;
         this.isValidInfo();
      }
   }

   isValidInfo() {
      this.isValidData = this.isRecuringPayments ? (this.isAmountValid && this.isAccountChange && this.isSufficientBalance
         && this.isValidMonth && ( this.isMonthly || this.selectedDay !== this.labels.chooseDay) ) : !this.isRecuringPayments;
   }

   stopOrderFrequency(productType) {
      this.showLoader = true;
      this.openAccountService.getPartWithdrawalAmount(productType)
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(response => {
            this.frequencyDetails = response;
            if (this.frequencyDetails && this.frequencyDetails[0]) {
               const freq1 = this.frequencyDetails[0].stopOrderFreq1;
               const freq2 = this.frequencyDetails[0].stopOrderFreq2;
               this.minimumAmount = this.frequencyDetails[0].minimumAdditionalDeposit;
               if (freq1 && freq2) {
                  this.isWeekly = true;
                  this.note = false;
                  this.paymentDurationList = [
                     {
                        label: this.openAccountValues.weekly,
                        value: this.openAccountValues.weekly
                     },
                     {
                        label: this.openAccountValues.monthly,
                        value: this.openAccountValues.monthly
                     }
                  ];
                  this.selectedPaymentDuration = this.openAccountValues.weekly;
               }
               if (freq1 && !freq2) {
                  if (freq1 === this.openAccountValues.weekly) {
                     this.isWeekly = true;
                     this.note = false;
                     this.paymentDurationList = [
                        {
                           label: this.openAccountValues.weekly,
                           value: this.openAccountValues.weekly
                        }
                     ];
                     this.selectedPaymentDuration = this.openAccountValues.weekly;
                  } else {
                     this.isMonthly = true;
                     this.note = true;
                     this.paymentDurationList = [
                        {
                           label: this.openAccountValues.monthly,
                           value: this.openAccountValues.monthly
                        }
                     ];
                  }
                  this.selectedPaymentDuration = this.openAccountValues.monthly;
               }
               if (!freq1 && freq2) {
                  if (freq2 === this.openAccountValues.weekly) {
                     this.isWeekly = true;
                     this.note = false;
                     this.paymentDurationList = [
                        {
                           label: this.openAccountValues.weekly,
                           value: this.openAccountValues.weekly
                        }
                     ];
                     this.selectedPaymentDuration = this.openAccountValues.weekly;
                  } else {
                     this.isMonthly = true;
                     this.paymentDurationList = [
                        {
                           label: this.openAccountValues.monthly,
                           value: this.openAccountValues.monthly
                        }
                     ];
                  }
                  this.selectedPaymentDuration = this.openAccountValues.monthly;
               }
            }
            this.recurringDetails = this.openAccountService.getRecurringDetails();
            if (this.recurringDetails && this.recurringDetails[0]) {
               this.recurringAccountType = this.recurringDetails[0].recurringAccountType;
               this.accountNumber = this.recurringDetails[0].accountNumber;
            }
            this.recDetails(this.recurringDetails);
         });
   }
   initialDeposit() {
      this.showLoader = true;
      this.openAccountService.getInitialDeposit()
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(response => {
            if (response) {
               this.accountList = response;
            }
         });
   }

   setFlag(incr: boolean, decr: boolean) {
      this.isIncrement = incr;
      this.isDecrement = decr;
   }

   onMonthChange(day: number) {
      const date = moment();
      if (day) {
         this.note = true;
         this.setDateNote(day);
      } else {
         this.note = false;
      }
      this.selectedMonth = day;
      this.isValidMonth = (this.selectedMonth >= this.openAccountValues.startDay && this.selectedMonth <= this.openAccountValues.endDay);
      if (this.isValidMonth) {
         this.note = true;
         this.setFlag(true, true);
      } else {
         this.note = false;
         this.setFlag(false, false);
      }
      this.isValidInfo();
   }

   recurringSubmit() {
      this.recurringnext.emit(true);
      if (this.isRecuringPayments) {
         const recurringDetails = [{
            Frequency: this.isMonthly ? this.openAccountValues.monthly : this.openAccountValues.weekly,
            Day: this.isMonthly ? this.selectedMonth : this.selectedDay,
            Amount: this.payoutDeposit,
            Account: this.selectedAccount,
            isRecurringYes: this.isRecuringPayments,
            recurringAccountType: this.recurringAccountType,
            accountNumber: this.accountNumber
         }];
         this.openAccountService.setRecurringDetails(recurringDetails);
         CommonUtility.topScroll();
      } else {
         const recurringDetails = [{
            isRecurringYes: this.isRecuringPayments,
         }];
         this.openAccountService.setRecurringDetails(recurringDetails);
      }
   }

   onAmountChange(value) {
      this.payoutDeposit = value;
      if (value) {
         this.payoutDeposit = value;
         this.isValidAmount = !(this.payoutDeposit < this.minimumAmount);
         this.isMaxAmount = !(this.payoutDeposit > this.openAccountValues.amountLimit);
         this.isAmountValid = this.isValidAmount;
         this.selectedAmount = value;
         this.isValidInfo();
      }
   }

   back() {
      const detailFlag: any = [{
         depositFlag: false,
         interestFlag: true,
         recurringFlag: false
      }];
      this.accountFlag.emit(detailFlag);
      CommonUtility.topScroll();
   }

   changeRecuringPayment(isRecuringPayment: boolean) {
      this.isRecuringPayments = isRecuringPayment;
      this.isValidInfo();
   }

   onPaymentDurationChange(paymentDuration: IRadioButtonItem) {
      this.selectedPaymentDuration = paymentDuration.value;
      if (this.selectedPaymentDuration === this.openAccountValues.monthly) {
         this.selectedMonth = 1;
         this.isMonthly = true;
         this.isWeekly = false;
         this.note = true;
         this.setDateNote(this.selectedMonth);
      } else {
         this.selectedDay = this.labels.chooseDay;
         this.isWeekly = true;
         this.isMonthly = false;
         this.note = false;
      }
   }

   onDayChange(day: string, index: number) {
      this.note = true;
      const selecetedIndex = index + 1;
      let displayDate;
      this.selectedDay = day;
      const date = moment();
      const currentDay = date.days();
      if (currentDay === selecetedIndex) {
         displayDate = 7;
      } else if (currentDay <= selecetedIndex) {
         displayDate = selecetedIndex - currentDay;
      } else {
         displayDate = (7 - currentDay) + selecetedIndex;
      }
      this.investmentEndDate = date.add(displayDate, 'days').toDate();
      this.isValidInfo();
   }

   onAccChange(account) {
      if (account) {
         this.accountNumber = account.accountNumber;
         this.selectedAccount = account.nickname + this.openAccountSymbols.hyphen + account.accountNumber;
         this.recurringAccountType = account.accountType;
         this.isAccountChange = true;
         this.isSufficientBalance = !(account.availableBalance < this.selectedAmount);
         this.isValidInfo();
      }
   }

   setDateNote(dateSelected: number) {
      this.selectedMonth = dateSelected;
      const date = moment();
      if (date.date() >= this.selectedMonth) {
         const selectedDay = this.remaningDays + (this.selectedMonth - 1);
         this.investmentEndDate = date.add(selectedDay, 'days').toDate();
      } else {
         const selectedDay = this.selectedMonth - date.date();
         this.investmentEndDate = date.add(selectedDay, 'days').toDate();
      }
   }

   decreaseDay() {
      const date = moment();
      this.selectedMonth = --this.selectedMonth;
      this.isDecrement = !(this.selectedMonth === this.openAccountValues.startDay);
      this.isIncrement = (this.selectedMonth < this.openAccountValues.endDay);
      this.setDateNote(this.selectedMonth);
   }

   increaseDay() {
      const date = moment();
      this.selectedMonth = ++this.selectedMonth;
      this.isDecrement = (this.selectedMonth > this.openAccountValues.startDay);
      this.isIncrement = !(this.selectedMonth === this.openAccountValues.endDay);
      this.setDateNote(this.selectedMonth);
   }
}

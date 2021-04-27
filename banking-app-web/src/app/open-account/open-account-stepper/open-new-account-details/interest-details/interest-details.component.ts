import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { OpenAccountService } from '../../../open-account.service';
import { IPayoutDetails, IAccountDetails } from '../../../../core/services/models';
import { Constants } from '../../../constants';

@Component({
   selector: 'app-interest-details',
   templateUrl: './interest-details.component.html',
   styleUrls: ['./interest-details.component.scss']
})
export class InterestDetailsComponent implements OnInit {

   labels = Constants.labels.openAccount;
   openAccountMessages = Constants.messages.openNewAccount;
   openAccountValues = Constants.variableValues.openNewAccount;
   openAccountSymbols = Constants.symbols;
   amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;
   account: any;
   selectedTerm = this.labels.chooseOptions;
   selectAccount = this.labels.selectAccount;
   allAccountsDetails: IPayoutDetails[];
   interestDetails = [];
   selectedMonth: number;
   accountDetail = [];
   investmentEndDate: Date;
   productName: string;
   interestRate: number;
   isNoticeDeposit: boolean;
   selectedDay = 1;
   isValidDay = true;
   note: boolean;
   showDay: boolean;
   payoutDay: number;
   isDecrement: boolean;
   isIncrement = true;
   depositdetails = [];
   showAlert: boolean;
   showLoader: boolean;
   accountNumber: string;
   accountType: string;
   isAccountChange: boolean;
   isAccountSelected: boolean;
   isValidData: boolean;

   @Output() accountFlag = new EventEmitter<boolean>();
   @Output() interestnext = new EventEmitter<boolean>();
   @Input() productInfo: any;

   constructor(private openAccountService: OpenAccountService) { }

   ngOnInit() {
      this.showAlert = false;
      if (this.productInfo) {
         this.productName = this.productInfo.name;
         this.interestRate = this.productInfo.realtimerate;
         this.isNoticeDeposit = (this.productInfo.noticeDeposit === this.labels.noticeDeposit);
      }
      const interestRate = this.openAccountService.getRealTimeInterestRate();
      if (interestRate) {
         this.interestRate = interestRate;
         this.showAlert = true;
      }
      this.getInterestPayout();
      this.depositdetails = this.openAccountService.getDepositDetails();
      this.selectedMonth = this.depositdetails[0].Months;
      if (this.selectedMonth) {
         if (this.selectedMonth === 1) {
            this.accountDetail = [this.openAccountValues.investmentEnd];
         } else if (this.selectedMonth === 2 || this.selectedMonth === 3) {
            this.accountDetail = [this.openAccountValues.monthly, this.openAccountValues.investmentEnd];
         } else if (this.selectedMonth > 3 && this.selectedMonth <= 6) {
            this.accountDetail = [this.openAccountValues.monthly, this.openAccountValues.quarterly,
            this.openAccountValues.investmentEnd];
         } else if (this.selectedMonth > 6 && this.selectedMonth <= 12) {
            this.accountDetail = [this.openAccountValues.monthly, this.openAccountValues.quarterly,
            this.openAccountValues.halfYearly, this.openAccountValues.investmentEnd];
         } else {
            this.accountDetail = [this.openAccountValues.monthly, this.openAccountValues.quarterly,
            this.openAccountValues.halfYearly, this.openAccountValues.yearly, this.openAccountValues.investmentEnd];
         }
      }
      this.interestDetails = this.openAccountService.getInterestDetails();
      if (this.interestDetails && this.interestDetails[0]) {
         this.selectAccount = this.interestDetails[0].payoutAccount;
         this.selectedDay = this.interestDetails[0].payoutDay;
         this.onDayChange(this.selectedDay);
         if (this.interestDetails[0].payoutOption) {
            this.onAccountChanged(this.interestDetails[0].payoutOption);
         }
         this.isAccountChange = true;
         this.isAccountSelected = true;
         this.isValidData = true;
      }
   }

   getInterestPayout() {
      this.showLoader = true;
      this.openAccountService.getInterestPayout()
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(result => {
            if (result) {
               this.allAccountsDetails = result;
            }
            if (this.isNoticeDeposit) {
               const investment = { nickname: this.openAccountValues.investmentType };
               this.allAccountsDetails.unshift(investment);
            }
         });
   }

   accountTerm(term: string) {
      if (this.allAccountsDetails) {
         if ((this.allAccountsDetails[0].nickname !== this.openAccountValues.investmentType) &&
            ((term === this.openAccountValues.investmentEnd))) {
            const investment = { nickname: this.openAccountValues.investmentType };
            this.allAccountsDetails.unshift(investment);
         } else if ((this.allAccountsDetails[0].nickname === this.openAccountValues.investmentType) &&
            (term !== this.openAccountValues.investmentEnd)) {
            this.allAccountsDetails.shift();
         }
      }
   }

   onAccountChanged(accDetails) {
      const date = moment();
      const day = new Date();
      this.payoutDay = day.getDate();
      if (accDetails !== this.labels.chooseOptions) {
         this.note = true;
         this.showDay = true;
         this.selectedDay = this.payoutDay;
         this.onDayChange(this.payoutDay);
      }
      this.selectedTerm = accDetails;
      switch (accDetails) {
         case this.openAccountValues.monthly:
            this.setRealTimeInterest(this.openAccountValues.monthlyPayment);
            this.investmentEndDate = date.add(1, 'months').toDate();
            break;
         case this.openAccountValues.quarterly:
            this.setRealTimeInterest(this.openAccountValues.quarter);
            this.investmentEndDate = date.add(3, 'months').toDate();
            break;
         case this.openAccountValues.halfYearly:
            this.setRealTimeInterest(this.openAccountValues.halfYear);
            this.investmentEndDate = date.add(6, 'months').toDate();
            break;
         case this.openAccountValues.yearly:
            this.setRealTimeInterest(this.openAccountValues.year);
            this.investmentEndDate = date.add(12, 'months').toDate();
            break;
         case this.openAccountValues.investmentEnd:
            this.setRealTimeInterest(this.openAccountValues.endInvestment);
            this.investmentEndDate = date.add(this.selectedMonth, 'months').toDate();
            this.showDay = false;
            break;
      }
      this.accountTerm(this.selectedTerm);
      this.isAccountChange = true;
      this.isValidInfo();
   }

   setRealTimeInterest(frequency: string) {
      this.showLoader = true;
      this.openAccountService.getFixedInterestRate(this.productInfo.productType, this.depositdetails[0].Amount,
         frequency, this.depositdetails[0].Months)
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(result => {
            if (result && result[0] && result[0].realtimerate) {
               const rate = result[0].realtimerate.toString();
               this.interestRate = (rate.length > this.openAccountValues.four) ? result[0].realtimerate : result[0].realtimerate.toFixed(2);
               this.openAccountService.setRealTimeInterestRate(this.interestRate);
               this.showAlert = true;
            }
         });
   }

   isValidInfo() {
      this.isValidData = this.isNoticeDeposit ? this.isAccountSelected && this.isValidDay
         : this.isAccountChange && this.isAccountSelected && this.isValidDay;
   }

   onAccountSelect(selectedAccount: IAccountDetails) {
      if (selectedAccount && selectedAccount.accountNumber) {
         this.selectAccount = selectedAccount.nickname + this.openAccountSymbols.hyphen + selectedAccount.accountNumber;
         this.accountNumber = selectedAccount.accountNumber;
         this.accountType = selectedAccount.accountType;
      } else {
         this.selectAccount = selectedAccount.nickname;
         this.accountNumber = '';
         this.accountType = this.openAccountValues.capitalizeAccount;
      }
      this.isAccountSelected = true;
      this.isValidInfo();
   }

   setFlag(incr: boolean, decr: boolean) {
      this.isIncrement = incr;
      this.isDecrement = decr;
   }

   onDayChange(value) {
      if (!this.isNoticeDeposit) {
         const day = this.selectedDay - this.payoutDay;
         this.showDate(day);
      }
      this.isValidDay = (value >= 1 && value <= 31);
      (this.isValidDay) ? this.setFlag(true, true) : this.setFlag(false, false);
      this.note = (this.isValidDay);
      this.isValidInfo();
   }

   onSubmit() {
      const interestDetails = [{
         payoutOption: this.selectedTerm,
         payoutDay: this.selectedDay,
         payoutAccount: this.accountNumber,
         payoutAccountType: this.accountType,
         Account: this.selectAccount
      }];
      this.openAccountService.setInterestDetails(interestDetails);
      if (this.isNoticeDeposit) {
         const detailFlag: any = [{
            depositFlag: false,
            interestFlag: false,
            recurringFlag: true
         }];
         this.accountFlag.emit(detailFlag);
         window.scrollTo(0, 0);
      } else {
         this.interestnext.emit(true);
      }
   }

   back() {
      const detailFlag: any = [{
         depositFlag: true,
         interestFlag: false,
         recurringFlag: false
      }];
      this.openAccountService.setRealTimeInterestRate(null);
      this.accountFlag.emit(detailFlag);
      window.scrollTo(0, 0);
   }

   showDate(day) {
      const date = moment();
      this.investmentEndDate = date.add(day, 'days').toDate();
      const newInvestmentDate = this.investmentEndDate;
      switch (this.selectedTerm) {
         case this.openAccountValues.monthly:
            if (day <= 0) {
               this.investmentEndDate = date.add(1, 'months').toDate();
            }
            break;
         case this.openAccountValues.quarterly:
            this.investmentEndDate = date.add(3, 'months').toDate();
            break;
         case this.openAccountValues.halfYearly:
            this.investmentEndDate = date.add(6, 'months').toDate();
            break;
         case this.openAccountValues.yearly:
            this.investmentEndDate = date.add(12, 'months').toDate();
            break;
         case this.openAccountValues.investmentEnd: this.investmentEndDate = date.add(this.selectedMonth, 'months').toDate();
            break;
      }
   }

   decreaseDay() {
      this.selectedDay = --this.selectedDay;
      this.isDecrement = !(this.selectedDay === this.openAccountValues.startDay);
      this.isIncrement = (this.selectedDay < this.openAccountValues.endDay);
      if (!this.isNoticeDeposit) {
         const day = this.selectedDay - this.payoutDay;
         this.showDate(day);
      }
   }

   increaseDay() {
      this.selectedDay = ++this.selectedDay;
      this.isDecrement = (this.selectedDay > this.openAccountValues.startDay);
      this.isIncrement = !(this.selectedDay === this.openAccountValues.endDay);
      if (!this.isNoticeDeposit) {
         const day = this.selectedDay - this.payoutDay;
         this.showDate(day);
      }
   }
}

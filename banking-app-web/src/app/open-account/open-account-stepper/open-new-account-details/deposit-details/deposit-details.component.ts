import { Component, OnInit, Output, EventEmitter, Input, Renderer2, Inject } from '@angular/core';
import { OpenAccountService } from '../../../open-account.service';
import { IDepositAccount } from '../../../../core/services/models';
import { Constants } from '../../../constants';
import { DOCUMENT } from '@angular/common';

@Component({
   selector: 'app-deposit-details',
   templateUrl: './deposit-details.component.html',
   styleUrls: ['./deposit-details.component.scss']
})
export class DepositDetailsComponent implements OnInit {
   labels = Constants.labels.openAccount;
   openAccountMessages = Constants.messages.openNewAccount;
   openAccountValues = Constants.variableValues.openNewAccount;
   openAccountSymbols = Constants.symbols;
   amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;
   allAccounts: any;
   account = this.labels.selectAccount;
   investorNumber = this.labels.investorNumber;
   allInvestorNumbers = [];
   isMoreInvestorNumber: boolean;
   selectedAmount: number;
   isDeposit: IDepositAccount[];
   noInvestorNumber: boolean;
   selectedMonth: number;
   accountType: string;
   minimumEntryAmount: number;
   isValidAmount: boolean;
   isMaxAmount = true;
   isSufficientBalance = true;
   productName: string;
   isNoticeDeposit: boolean;
   minMonth: number;
   maxMonth: number;
   isValidMonth = true;
   isDecrement: boolean;
   isIncrement = true;
   entryAmount: number;
   isRightOptions: boolean;
   showProducts: boolean;
   showLoader: boolean;
   monthChange = true;
   depositAccountNumber: string;
   isValidData: boolean;
   isAccountSelected: boolean;
   isInvestor: boolean;
   isAmountValid: boolean;
   errorMessage: string;

   @Output() accountFlag = new EventEmitter<boolean>();
   @Output() stepperback = new EventEmitter<boolean>();
   @Input() productInfo: any;

   constructor(private openAccountService: OpenAccountService, private render: Renderer2,
      @Inject(DOCUMENT) private document: Document) { }

   ngOnInit() {
      this.isValidAmount = true;
      this.render.setStyle(this.document.body, 'overflow-y', 'hidden');
      this.showLoader = true;
      this.selectedAmount = this.openAccountService.getAmountForOpenNewAccount();
      this.minimumEntryAmount = this.openAccountService.getMinimumEntryAmount();
      if (this.productInfo) {
         this.entryAmount = this.productInfo.entryValue;
         this.onAmountChange(this.selectedAmount);
         this.productName = this.productInfo.name;
         if (this.productInfo.noticeDeposit === this.labels.noticeDeposit) {
            this.isNoticeDeposit = true;
         } else {
            this.isNoticeDeposit = false;
            this.minMonth = this.productInfo.period1;
            this.selectedMonth = this.minMonth;
            this.maxMonth = this.productInfo.period2;
         }
      }
      this.getInvestor();
      this.getInitialDeposit();
      this.monthChange = (this.minMonth < this.maxMonth);
      this.onMonthChange(this.minMonth);
      this.isDeposit = this.openAccountService.getDepositDetails();
      if (this.isDeposit) {
         this.investorNumber = this.isDeposit[0].investorNumber;
         this.selectedAmount = this.isDeposit[0].Amount;
         this.account = this.isDeposit[0].depositAccount;
         this.selectedMonth = this.isDeposit[0].Months;
         this.isValidData = true;
         this.isAccountSelected = true;
         this.isInvestor = true;
         this.isAmountValid = true;
      }
   }

   getInvestor() {
      this.showLoader = true;
      this.openAccountService.getInvestor()
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(response => {
            if (response && response.length) {
               this.noInvestorNumber = false;
               if (response.length === 1) {
                  this.isMoreInvestorNumber = false;
                  this.investorNumber = response[0].investorNumber;
               }
               if (response.length > 1) {
                  this.isMoreInvestorNumber = true;
                  this.allInvestorNumbers = response;
               }
            } else {
               this.noInvestorNumber = true;
            }
         });
   }

   getInitialDeposit() {
      this.showLoader = true;
      this.openAccountService.getInitialDeposit()
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(response => {
            if (response) {
               this.allAccounts = response;
            }
         });
   }

   isValidInfo() {
      this.isValidData = (this.isAmountValid && this.isAccountSelected && this.isMaxAmount &&
         this.isSufficientBalance && this.isValidMonth && (this.isInvestor || !this.isMoreInvestorNumber));
   }

   onAccountChanged(accDetails) {
      if (accDetails) {
         this.account = accDetails.nickname + this.openAccountSymbols.hyphen + accDetails.accountNumber;
         this.accountType = accDetails.accountType;
         this.depositAccountNumber = accDetails.accountNumber;
         this.isSufficientBalance = !(accDetails.availableBalance < this.selectedAmount);
         this.isAccountSelected = this.isSufficientBalance;
         this.isValidInfo();
      }
   }

   onInvestorChanged(investorNumber) {
      this.isInvestor = true;
      this.investorNumber = investorNumber;
      const depositDetails = [{
         investorNumber: this.investorNumber
      }];
      this.saveDepositDetails(depositDetails);
      this.isValidInfo();
   }

   onAmountChange(value: number) {
      if (value) {
         if (this.productInfo.productType === this.openAccountValues.TaxFreeAccountType) {
            this.isMaxAmount = !(value > this.openAccountValues.taxFreeAmountLimit);
            this.errorMessage = this.openAccountMessages.taxFreeSavingsAccountMsg;
         } else {
            this.isMaxAmount = !(value > this.openAccountValues.amountLimit);
            this.errorMessage = this.openAccountMessages.amountShouldGreaterMessage;
         }
         this.selectedAmount = value;
         this.isValidAmount = !(this.selectedAmount < this.entryAmount);
         this.isAmountValid = this.isValidAmount;
         this.isValidInfo();
      }
   }

   setFlag(incr: boolean, decr: boolean) {
      this.isIncrement = incr;
      this.isDecrement = decr;
   }

   onMonthChange(value: number) {
      if (this.monthChange) {
         this.selectedMonth = value;
         this.isValidMonth = ((this.selectedMonth >= this.minMonth) && (this.selectedMonth <= this.maxMonth));
         this.setFlag(this.selectedMonth <= this.maxMonth, this.selectedMonth > this.minMonth);
      } else {
         this.setFlag(false, false);
      }
      this.isValidInfo();
   }

   saveDepositDetails(depositDetails) {
      this.openAccountService.setDepositDetails(depositDetails);
   }

   setInterestFlag() {
      const detailFlag: any = [{
         depositFlag: false,
         interestFlag: true,
         recurringFlag: false
      }];
      this.accountFlag.emit(detailFlag);
   }

   onSubmit() {
      const initialAmount = this.openAccountService.getAmountForOpenNewAccount();
      if (this.isNoticeDeposit && (initialAmount !== this.selectedAmount)) {
         this.showLoader = true;
         this.openAccountService.getInterestRate(this.productInfo.productType, this.selectedAmount,
            this.productInfo.period1).
            finally(() => {
               this.showLoader = false;
            }).subscribe(result => {
               this.openAccountService.setRealTimeInterestRate(result[0].realtimerate.toFixed(2));
               this.setInterestFlag();
            });
      } else {
         this.setInterestFlag();
      }

      if (this.investorNumber === this.labels.investorNumber) {
         this.investorNumber = this.openAccountValues.empty;
      }
      const depositDetails = [{
         investorNumber: this.investorNumber,
         Amount: this.selectedAmount,
         depositAccount: this.account,
         Months: this.selectedMonth,
         depositAccountType: this.accountType,
         productType: this.productInfo.productType,
         depositAccountNumber: this.depositAccountNumber
      }];
      this.saveDepositDetails(depositDetails);
   }

   back() {
      this.showProducts = true;
      this.isRightOptions = true;
   }
   // should decrease the selected month for open new account
   decreaseMonth() {
      if (this.monthChange) {
         this.selectedMonth = --this.selectedMonth;
         this.isDecrement = !(this.selectedMonth === this.minMonth);
         this.isIncrement = (this.selectedMonth < this.maxMonth);
      }
   }
   // should increase the selected month for open new account
   increaseMonth() {
      if (this.monthChange) {
         this.selectedMonth = ++this.selectedMonth;
         this.isDecrement = (this.selectedMonth > this.minMonth);
         this.isIncrement = !(this.selectedMonth === this.maxMonth);
      }
   }
}

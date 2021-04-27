import { Component, OnInit, ViewChild, Output, EventEmitter, Renderer2, OnDestroy, Inject } from '@angular/core';
import { Input } from '@angular/core';
import { OpenAccountService } from '../open-account.service';
import { IRadioButtonItem, IDeposit } from '../../core/services/models';
import { Constants } from '../constants';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
@Component({
   selector: 'app-right-options',
   templateUrl: './right-options.component.html',
   styleUrls: ['./right-options.component.scss']
})
export class RightOptionsComponent implements OnInit, OnDestroy {

   @ViewChild('IOform1') IOform1;
   @ViewChild('IOform2') IOform2;
   @ViewChild('IOform3') IOform3;
   @Output() transactionFlag = new EventEmitter<boolean>();
   @Input() showProducts: boolean;

   labels = Constants.labels.openAccount;
   openAccountMessages = Constants.messages.openNewAccount;
   openAccountValues = Constants.variableValues.openNewAccount;
   openAccountSymbol = Constants.symbols;
   amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;
   depositFlag = true;
   keepDepositFlag: boolean;
   accessMoneyFlag: boolean;
   isAmountValid: boolean;
   amountLimit: boolean;
   isStepper: boolean;
   isQuestionsPage = true;
   showNoticePeriodContent: boolean;
   showAllProduct: boolean;
   selectedProduct: number;
   isText: boolean;
   isMaxAmount = true;
   amount: number;
   initialDeposit = this.labels.initialDeposit;
   isDeposit: boolean;
   isAccessMoney: boolean;
   isNoticePeriod: boolean;
   minimumEntryAmount: number;
   additionalDeposit = this.labels.additionalDeposit;
   noticePeriod = this.labels.access;
   getAllProducts: any;
   productList: any;
   productListInitialValue = this.openAccountValues.optionText3;
   selectedOption: string;
   optionText = 1;
   productHeader: string;
   productSubHeader: string;
   noProducts: boolean;
   showLoader: boolean;
   payoutDetailsAmount: number;
   clientType: number;
   age: number;
   birthDate: Date;
   formatDate: any;
   headerOptions: boolean;
   secOfficerCd: number;
   allInvestmentProducts: boolean;
   filteredProducts: IDeposit;
   depFlagTypes: IRadioButtonItem[] = [
      {
         label: this.labels.yes,
         value: this.labels.yes
      },
      {
         label: this.labels.no,
         value: this.labels.no
      }
   ];
   depDetail = {
      depType: this.labels.depositType
   };
   depFlagType = this.depFlagTypes[0].value;
   accessMoneyPeriodList: IRadioButtonItem[] = [
      {
         label: this.labels.afterOneDay,
         value: this.labels.twentyFourHour
      },
      {
         label: this.labels.afterThirtyTwoDays,
         value: this.labels.thirtyTwoDay
      },
      {
         label: this.labels.endInvestment,
         value: this.openAccountMessages.end
      }
   ];
   moneyPeriodDetails = {
      time: this.openAccountMessages.moneyPeriod
   };

   moneyPeriodType = this.accessMoneyPeriodList[0].value;
   constructor(private openAccountService: OpenAccountService,
      private clientProfileDetailsService: ClientProfileDetailsService, private render: Renderer2,
      private router: Router, @Inject(DOCUMENT) private document: Document) { }
   ngOnInit() {
      this.render.setStyle(this.document.body, 'overflow-y', 'hidden');
      this.isText = true;
      this.isAmountValid = true;
      this.showLoader = true;
      this.allProducts();
      if (this.showProducts) {
         this.seeAllProducts();
      }
      this.openAccountService.getEntryAmount()
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(response => {
            this.minimumEntryAmount = parseInt(response, 10);
            this.openAccountService.setMinimumEntryAmount(this.minimumEntryAmount);
         });
   }

   addEmptyProducts(products) {
      if (products.length % 3 === 1) {
         this.productList.push({
            name: this.openAccountValues.empty,
         },
            {
               name: this.openAccountValues.empty,
            });
      } else if (products.length % 3 === 2) {
         this.productList.push({
            name: this.openAccountValues.empty,
         });
      }
   }

   calculateAge(dob) {
      const difference = Date.now() - dob.getTime();
      return Math.floor((difference / (1000 * 3600 * 24)) / 365);
   }

   getProductList(result) {
      if (result && result[0]) {
         result.forEach(function (items) {
            if (items.realTimeRate) {
               items.realTimeRate = items.realTimeRate.toFixed(2);
            }
         });
      }
      return result;
   }

   allProducts() {
      this.showLoader = true;
      this.noProducts = false;
      this.productHeader = this.openAccountMessages.ourInvestmentHeader;
      this.clientProfileDetailsService.clientDetailsObserver
         .subscribe(response => {
            if (response) {
               this.clientType = parseInt(response.ClientType, 10);
               this.secOfficerCd = parseInt(response.SecOfficerCd, 10);
               const firstWithdrawDate = response.BirthDate.split(this.labels.time);
               this.formatDate = (firstWithdrawDate[0]);
               this.age = this.calculateAge(new Date(this.formatDate));
               this.openAccountService.getAllProducts(this.secOfficerCd, this.age)
                  .finally(() => {
                     this.showLoader = false;
                  })
                  .subscribe(result => {
                     if (result) {
                        this.productList = this.getProductList(result);
                        this.addEmptyProducts(this.productList);
                        this.productListInitialValue = this.productList.length;
                     }
                  });
            }
         });
   }

   onDepositAmountChange(value: number) {
      if (value >= this.minimumEntryAmount) {
         this.amount = value;
         this.amountLimit = true;
         this.isAmountValid = true;
      } else {
         this.amountLimit = false;
         this.isAmountValid = false;
      }
      this.isMaxAmount = !(value > this.openAccountValues.amountLimit);
   }

   setFlag(deposit: boolean, keepDeposit: boolean, accessMoney: boolean) {
      this.depositFlag = deposit;
      this.keepDepositFlag = keepDeposit;
      this.accessMoneyFlag = accessMoney;
   }

   changeFlag(flagStr: string) {
      switch (flagStr) {
         case this.openAccountMessages.depositFlag: {
            this.setFlag(!this.depositFlag, false, false);
            break;
         }
         case this.openAccountMessages.keepDepositFlag: {
            this.setFlag(false, !this.keepDepositFlag, false);
            break;
         }
         case this.openAccountMessages.accessMoneyFlag: {
            this.setFlag(false, false, !this.accessMoneyFlag);
            break;
         }
      }
   }

   onDepFlagChange(event: IRadioButtonItem) {
      this.depFlagType = event.value;
   }

   onMoneyPeriodChange(event: IRadioButtonItem) {
      this.moneyPeriodType = event.value;
   }

   goToKeepDeposit(flagStr: string) {
      this.optionText = this.openAccountValues.optionText2;
      if (this.amount) {
         this.isText = false;
         this.openAccountService.setAmountForOpenNewAccount(this.amount);
         this.openAccountService.setMinimumEntryAmount(this.minimumEntryAmount);
         this.initialDeposit = this.openAccountValues.currency + this.amount;
         this.isDeposit = true;
         this.changeFlag(flagStr);
      }
   }

   goToAccessMoney(flagStr: string) {
      this.optionText = this.openAccountValues.optionText3;
      this.additionalDeposit = this.depFlagType;
      this.changeFlag(flagStr);
      this.isAccessMoney = true;
   }

   gotoNoticePeriod() {
      this.allInvestmentProducts = true;
      this.showLoader = true;
      this.productSubHeader = this.openAccountMessages.goodOptionSubHeader;
      this.productHeader = this.openAccountMessages.suggestionHeader;
      this.isNoticePeriod = true;
      this.noticePeriod = this.openAccountMessages.noticePeriod;
      this.showNoticePeriodContent = true;
      if (this.moneyPeriodType === this.labels.twentyFourHour) {
         this.selectedOption = this.openAccountMessages.option1;
      } else if (this.moneyPeriodType === this.labels.thirtyTwoDay) {
         this.selectedOption = this.openAccountMessages.option2;
      } else {
         this.selectedOption = this.openAccountMessages.option3;
      }
      let deposit;
      deposit = (this.depFlagType === this.labels.yes) ? this.openAccountValues.yes : this.openAccountValues.no;
      this.showNoticePeriodContent = true;
      this.openAccountService.getAllAccountTypeFilteredProduct(this.amount, deposit, this.selectedOption,
         this.age, this.secOfficerCd)
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(response => {
            this.showLoader = false;
            this.productList = this.getProductList(response);
            this.productListInitialValue = this.productList.length;
            if (this.productList.length) {
               this.addEmptyProducts(this.productList);
               this.noProducts = false;
               this.filteredProducts = this.productList;
            } else {
               this.productSubHeader = this.openAccountValues.empty;
               this.productHeader = this.openAccountMessages.noProducts;
               this.noProducts = true;
            }
            this.showLoader = false;
         });
      this.headerOptions = false;
   }

   openAccount(data) {
      this.isQuestionsPage = false;
      this.isStepper = true;
      this.openAccountService.setProductDetails(data);
   }

   closeOverlay(value) {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   seeAllOtherProducts() {
      this.headerOptions = true;
      this.showAllProduct = true;
      if (this.accessMoneyFlag) {
         this.allProducts();
      } else {
         this.productListInitialValue = this.productList.length;
      }
   }

   seeLessProduct() {
      this.productList = this.filteredProducts;
      this.showAllProduct = false;
      this.productListInitialValue = this.productList.length;
      this.selectedProduct = -1;
   }

   stepperBack(value: boolean) {
      this.isQuestionsPage = value;
      this.isStepper = false;
      this.showNoticePeriodContent = true;
   }

   seeAllProducts() {
      this.productHeader = this.openAccountMessages.ourInvestmentHeader;
      this.productSubHeader = this.openAccountValues.empty;
      this.showNoticePeriodContent = true;
      this.headerOptions = true;
   }

   selectProduct(value) {
      this.selectedProduct = value;
   }

   isInitialDeposit() {
      if (this.keepDepositFlag || this.accessMoneyFlag) {
         this.changeFlag(this.openAccountMessages.depositFlag);
      }
      this.payoutDetailsAmount = this.openAccountService.getAmountForOpenNewAccount();
   }

   accessMoney() {
      if (this.accessMoneyFlag) {
         this.changeFlag(this.openAccountMessages.keepDepositFlag);
      }
   }

   showRightOptions() {
      this.showNoticePeriodContent = false;
      this.headerOptions = false;
   }

   ngOnDestroy() {
      this.render.setStyle(this.document.body, 'overflow-y', 'auto');
   }
}

import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Constants } from './../../core/utils/constants';
import { AccountService } from '../account.service';
import { IDashboardAccounts, IDashboardAccount, ITravelCardPriorityDetails } from '../../core/services/models';
import { IAccountConfig } from './../dashboard.model';
import { ITransactionDetail, IAccountDetail } from '../../core/services/models';
import { transactionsData, accountData } from './../../core/data/skeleton-data';
import { BaseComponent } from '../../core/components/base/base.component';
import { CommonUtility } from '../../core/utils/common';
import { environment } from '../../../environments/environment';

@Component({
   selector: 'app-pocket-detail',
   templateUrl: './pocket-detail.component.html',
   styleUrls: ['./pocket-detail.component.scss']
})
export class PocketDetailComponent extends BaseComponent implements OnInit {
   accountId: number;
   pocketCurrency: string;
   transactions: ITransactionDetail[];
   graphTransactions: ITransactionDetail[];
   accountDetails: IAccountDetail;
   accountType: string;
   pocket: ITravelCardPriorityDetails;
   pockets: ITravelCardPriorityDetails[];
   balance: number;
   accountNumber: number;
   removeDebitOrderFlag: boolean;
   availableBalance: number;
   accountContainers: IDashboardAccounts[];
   skeletonMode: Boolean;
   featureVisible: Boolean;
   labels = Constants.labels;
   removeTypes = Constants.VariableValues.filterNonTransferAccounts;
   showTravelCardAccount = environment.features.travelCardAccount;
   showTravelCardTrips = environment.features.travelCardTrips;
   constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
      this.route.params.subscribe(params => this.pocketCurrency = params.pocketCurrency);
   }

   ngOnInit() {
      this.skeletonMode = true;
      this.getAccountData();
   }

   onAccountChange(account: IDashboardAccount) {
      this.accountNumber = account.AccountNumber;
      this.accountType = account.AccountType;
      this.accountId = parseInt(account.ItemAccountId, 10);
      if (this.accountType !== this.labels.travelCardAccountTypeShortName) {
          this.router.navigateByUrl(encodeURI('/dashboard/account/detail/' + this.accountId));
      } else {
         this.getPockets(account, this.accountNumber);
      }
   }

   getPocketBalance(currency: string) {
      if (currency) {
         this.pocket = this.pockets.find((key) =>  key.currency.currency  === currency);
         return this.pocket.currency.amount;
      } else {
         return 0;
      }
   }

   getPockets(account: IDashboardAccount, accountNumber: number) {
      return this.accountService.getPockets(this.accountNumber).subscribe((response) => {
         this.pockets = response;
         this.skeletonMode = true;
         this.balance = account.Balance;
         this.availableBalance = this.getPocketBalance(this.pocketCurrency);
         this.removeDebitOrderFlag = (this.accountType === Constants.VariableValues.accountTypes.creditCardAccountType.code);
         this.getFilteredTypeAccounts(this.accountType);
         this.getTransactionsData(this.pocketCurrency);
      });
   }

   isTravelCardActive(): boolean {
      // Only if account type is TC and feature is enabled in environent
      return this.showTravelCardAccount && this.accountType === Constants.labels.travelCardAccountTypeShortName;
   }
   isTrvelCardTripsActive(): boolean {
      return this.showTravelCardTrips;
   }
   getFilteredTypeAccounts(type) {
      this.featureVisible = this.removeTypes.indexOf(type) < 0;
   }
   getTransactionsData(currency) {
      // TODO - confirm how to handle scenarios when user manually enters an account in URL which is invalid
      this.transactions = transactionsData;
      this.graphTransactions = [];
      this.accountService.getGraphTransactions(this.accountId, this.accountType).subscribe((data) => {
         this.graphTransactions = this.updateRunningBalance(currency, data);
         this.transactions = [...this.graphTransactions].reverse();
         this.skeletonMode = false;
      });
   }

   updateRunningBalance(currency, transactions: ITransactionDetail[]) {
      if (transactions && transactions.length) {
         transactions = transactions.filter(function(transaction, index){
             if ( transaction.Currency === currency) {
                return transaction;
             }
         }).sort((t1, t2) => {
            return CommonUtility.sortTransactionToAscendingOrder(t1, t2);
         });

         let newBalance = this.getStartingBalance();
         [...transactions].reverse().forEach(transaction => {
            transaction.RunningBalance = newBalance;
            newBalance = newBalance - transaction.Amount;
         });
      }
      return transactions;
   }

   getStartingBalance(): number {
      let startingBalance = 0;
      switch (this.accountType) {
         case 'CA':
         case 'SA':
         case 'TD':
         case 'DS':
         case 'INV':
         case 'TC':
            startingBalance = this.availableBalance;
            break;
         default:
            startingBalance = this.balance;
      }
      return startingBalance;
   }

   getAccountData() {
      const cachedAccountsData = this.accountService.getDashboardAccountsData();
      if (cachedAccountsData) {
         this.manageAccountContainers(cachedAccountsData);
      } else {
         this.accountService.getDashboardAccounts().subscribe((accountContainers: IDashboardAccounts[]) => {
            this.manageAccountContainers(accountContainers);
         });
      }
   }

   manageAccountContainers(accountContainers: IDashboardAccounts[]) {
      this.accountContainers = accountContainers;
      this.updateAccountType(accountContainers);
   }

   updateAccountType(accountGroups: IDashboardAccounts[]) {
      accountGroups.forEach(accountGroup => {
         accountGroup.Accounts.forEach(account => {
            if (account && account.ItemAccountId && this.accountId.toString() === account.ItemAccountId.toString()) {
               this.onAccountChange(account);
            }
         });
      });
   }

   getCurrencySymbol(currency: string) {
      return currency ? Constants.currencies[currency].symbol : null;
   }
}

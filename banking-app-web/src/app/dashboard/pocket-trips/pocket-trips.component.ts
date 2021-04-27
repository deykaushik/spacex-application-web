import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Constants } from './../../core/utils/constants';
import { AccountService } from '../account.service';
import { IDashboardAccounts, IDashboardAccount } from '../../core/services/models';
import { IAccountConfig } from './../dashboard.model';
import { ITransactionDetail, IAccountDetail } from '../../core/services/models';
import { transactionsData, accountData } from './../../core/data/skeleton-data';
import { BaseComponent } from '../../core/components/base/base.component';
import { CommonUtility } from '../../core/utils/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pocket-trips',
  templateUrl: './pocket-trips.component.html',
  styleUrls: ['./pocket-trips.component.scss']
})
export class PocketTripsComponent implements OnInit {

   accountId: number;
   pocketCurrency: string;
   transactions: ITransactionDetail[];
   graphTransactions: ITransactionDetail[];
   account: IDashboardAccount;
   accountType: string;
   balance: number;
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
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.skeletonMode = true;
      this.getAccountData();
   }

   onAccountChange(account: IDashboardAccount) {
      this.account = account;
      this.accountType = account.AccountType;
      this.accountId = parseInt(account.ItemAccountId, 10);
      if (this.accountType !== this.labels.travelCardAccountTypeShortName) {
          this.router.navigateByUrl(encodeURI('/dashboard/account/detail/' + this.accountId));
      } else {
         this.skeletonMode = true;
         this.balance = account.Balance;
         this.removeDebitOrderFlag = (this.accountType === Constants.VariableValues.accountTypes.creditCardAccountType.code);
         this.getFilteredTypeAccounts(this.accountType);
      }
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

   getAccountData() {
      const cachedAccountsData = this.accountService.getDashboardAccountsData();
      if (cachedAccountsData) {
         this.manageAccountContainers(cachedAccountsData);
         this.skeletonMode = false;
      } else {
         this.accountService.getDashboardAccounts().subscribe((accountContainers: IDashboardAccounts[]) => {
            this.manageAccountContainers(accountContainers);
            this.skeletonMode = false;
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
}

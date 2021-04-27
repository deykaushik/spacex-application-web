import { Component, OnInit, Input, OnChanges, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Constants } from './../../core/utils/constants';
import { ITransactionDetail, ITransactionDetailsData, INotification, ITransactionAccountDetails } from '../../core/services/models';
import { AccountService } from '../account.service';
import { environment } from '../../../environments/environment';
import { CommonUtility } from '../../core/utils/common';
import { ITravelCardPriorityDetails } from '../../core/services/models';

@Component({
   selector: 'app-account-transactions',
   templateUrl: './account-transactions.component.html',
   styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent implements OnChanges {
   @Input() transactions: ITransactionDetail[];
   @Input() graphTransactions: ITransactionDetail[];
   @Input() accountType: string;
   @Input() accountNumber: number;
   @Input() pockets: ITravelCardPriorityDetails[];
   @Input() selectedPocket: ITravelCardPriorityDetails;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   labels = Constants.labels;
   @Input() parentSkeleton: boolean;
   @Input() currency: string;
   @Input() itemAccountId: number;
   @Input() containerName: number;

   skeletonMode = true;
   visibleTransactions: ITransactionDetail[];

   // uplift dormancy
   @Input() transactionDetailsData: ITransactionDetailsData;
   isDormantAccount: boolean;
   upliftDormancyValues = Constants.VariableValues.upliftDormancy;
   @Output() notifications: EventEmitter<INotification> = new EventEmitter<INotification>();
   showUpliftDormancy = environment.features.upliftDormancy;
   showTravelCardAccount = environment.features.travelCardAccount;

   // transaction search
   searchEnabled: boolean;
   showTransactionSearch = environment.features.transactionSearch;

   accountDetails: ITransactionAccountDetails;
   constructor(private accountService: AccountService) { }

   ngOnChanges(change) {
      this.accountService.transactionSearchModeEmitter.subscribe(response =>
         this.setSearchMode(response)
      );
      if (change.transactions && this.transactions) {
         this.skeletonMode = this.parentSkeleton;
         if (this.accountType !== Constants.labels.travelCardAccountTypeShortName) {
            if (!change.transactions.firstChange && !this.skeletonMode) {
               const transactions = this.accountService.getTransactionsForCASA().concat([...this.transactions]);
               this.accountService.setTransactionsForCASA(transactions);
            }
            this.visibleTransactions = this.accountService.getTransactionsForCASA();
         } else {
            this.visibleTransactions = [...this.transactions];
         }
         if (this.accountType === this.labels.dashboardRewardsAccountTitle) {
            // transaction description for rewards must be shown in short (the 2nd block of detailed description) in transaction listing
            this.visibleTransactions.forEach(transaction => { transaction.ShortDescription = transaction.Description; });
            this.setVisibileTransactionDescription();
         }
         this.searchEnabled = false;
      }
      if (!this.transactions) {
         this.visibleTransactions = [];
      }
      this.getAccountStatus();
      this.accountDetails = {
         accountType: this.accountType,
         parentSkeleton: this.parentSkeleton,
         itemAccountId: this.itemAccountId
      };
   }
   // transaction description for rewards must be shown full/in detail inside transaction details block.
   setVisibileTransactionDescription() {
      this.visibleTransactions.forEach((value) => {
         if (value.Description) {
            const fragment = value.Description.split(';')[1];
            value.ShortDescription = fragment ? fragment.trim() : value.Description.trim();
         }
      });
   }

   getAccountStatus() {
      if (this.transactionDetailsData) {
         this.itemAccountId = this.transactionDetailsData.itemAccountId;
         this.isDormantAccount = false;
         if (this.transactionDetailsData.accountContainers) {
            for (let i = 0; i < this.transactionDetailsData.accountContainers.length; i++) {
               if (this.upliftDormancyValues.containerName.indexOf(this.transactionDetailsData.accountContainers[i].ContainerName) !== -1) {
                  for (let j = 0; j < this.transactionDetailsData.accountContainers[i].Accounts.length; j++) {
                     const itemAccountIdInt = (parseInt(this.transactionDetailsData.accountContainers[i].Accounts[j].ItemAccountId, 10));
                     if (itemAccountIdInt === this.itemAccountId) {
                        this.isDormantAccount = this.transactionDetailsData.accountContainers[i].Accounts[j]
                           .AccountStatusCode === this.upliftDormancyValues.dormantAccountStatus;
                        break;
                     }
                  }
               }
            }
         }
      }
   }

   isTravelCardActive(): boolean {
      // Only if account type is TC and feature is enabled in environent
      return this.showTravelCardAccount && this.accountType === Constants.labels.travelCardAccountTypeShortName;
   }

   notification($event) {
      this.notifications.emit($event);
   }

   getCurrencyName(currency: string) {
      return currency ? Constants.currencies[currency].fullName : null;
   }

   getCurrencySymbol(currency: string) {
      return currency ? Constants.currencies[currency].symbol : null;
   }

   setSearchView() {
      this.searchEnabled = !this.searchEnabled;
      this.accountDetails.searchEnabled = this.searchEnabled;
      this.accountService.transactionSearchMode(this.searchEnabled);
   }

   isTransactionSearchApplicable() {
      return !(this.visibleTransactions && this.visibleTransactions.length === 0) &&
         CommonUtility.isTransactionSearchApplicable(this.accountType) && this.showTransactionSearch;
   }

   setSearchMode(value: boolean) {
      this.searchEnabled = value;
   }
}

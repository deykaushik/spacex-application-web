import { Component, OnChanges, Input, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccountService } from '../account.service';
import { ITransactionDetail, ITransactionAccountDetails } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { BaseComponent } from '../../core/components/base/base.component';
import { GAEvents } from '../../core/utils/ga-event';

@Component({
   selector: 'app-transaction-list',
   templateUrl: './transaction-list.component.html',
   styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends BaseComponent implements OnChanges {
   @Input() accountDetails: ITransactionAccountDetails;
   @Input() transactions: ITransactionDetail[];
   labels = Constants.labels.transactionHistory;
   skeletonMode = true;
   hasTransactionsAndDetailsForIS: boolean;
   showTransactionDetail = environment.features.transactionDetail;
   truncateLimit = Constants.truncateDescCharLimit.truncateLimit;
   selectedIndex: number;
   dateFormat = Constants.formats.ddMMMyyyy;
   amountPipeConfig;
   messages = Constants.messages.transactionSearch;

   constructor(private accountService: AccountService, injector: Injector) {
      super(injector);
   }

   ngOnChanges(change) {
      if (this.accountDetails.searchEnabled === undefined) {
         this.accountDetails.searchEnabled = false;
      }
      if (change.transactions && this.transactions) {
         this.skeletonMode = this.accountDetails.parentSkeleton;
         this.hasTransactionsAndDetailsForIS = this.accountService.hasTransactionsAndDetailsForIS(this.accountDetails.accountType);
      }
      if (this.accountDetails.accountType === Constants.labels.dashboardRewardsAccountTitle) {
         this.amountPipeConfig = Constants.amountPipeSettings.amountWithNoDecimal;
         this.transactions.map((transaction) => {
            transaction.Currency = transaction.Currency + Constants.symbols.spaceString;
         });
      } else {
         this.amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
      }
      // selected index set to null whenever user selects any other account
      // but for casa same account while lazy loading, should be able to see the last opened transaction
      this.selectedIndex = CommonUtility.isCasaAccount(this.accountDetails.accountType) &&
         !change.itemAccountId ? this.selectedIndex : null;
   }

   // for rewards and casa type of account, transaction details should be shown on click of any transaction. Also it is toggleable
   setTransactionDetails(index: number) {
      const transactionDetails = Object.assign({}, GAEvents.transactionHistory.transactionDetails);
      transactionDetails.label += CommonUtility.gaAccountType(this.accountDetails.accountType,
         this.accountService.getAccountData().ProductType);
      this.sendEvent(transactionDetails.eventAction, transactionDetails.label,
         null, transactionDetails.category);
      if (this.hasTransactionsAndDetailsForIS && this.showTransactionDetail) {
         const lastSelected = this.selectedIndex;
         this.selectedIndex = index;
         if (lastSelected === index) {
            this.selectedIndex = null;
         }
      }
   }
   // transaction details should be closed on click of close icon
   closeTransactionDetails(index) {
      this.setTransactionDetails(index);
   }
}

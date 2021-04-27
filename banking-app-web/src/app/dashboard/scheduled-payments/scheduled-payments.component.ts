import { Component, OnInit } from '@angular/core';
import { IAccountConfig } from './../dashboard.model';
import { AccountService } from '../account.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../core/utils/constants';
import { ActivatedRoute } from '@angular/router';
import { CommonUtility } from './../../core/utils/common';
import { BuyService } from '../../buy/buy-prepaid/buy.service';

@Component({
   selector: 'app-scheduled-payments',
   templateUrl: './scheduled-payments.component.html',
   styleUrls: ['./scheduled-payments.component.scss']
})
export class ScheduledPaymentsComponent implements OnInit {
   accountName: string;
   accountType: string;
   accountId: number;
   accountNumber: number;
   skeletonMode: Boolean;
   ItemAccountId: number;
   constructor(private accountService: AccountService, private route: ActivatedRoute, private buyService: BuyService) {
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }
   ngOnInit() {
      const selectedAccount = this.accountService.getAccountData();
      if (selectedAccount && selectedAccount.ItemAccountId === this.accountId) {
         this.accountNumber = selectedAccount.AccountNumber;
         this.accountType = CommonUtility.getAccountTypeName(selectedAccount.AccountType);
         this.accountName = selectedAccount.AccountName;
      } else {
         this.accountService.getDashboardAccounts().subscribe((result) => {
            const accountContainer = result.
               find(container => container.Accounts.some(a => a.ItemAccountId === this.accountId.toString()));
            const accountInfo = accountContainer.Accounts
               .find(account => account.ItemAccountId === this.accountId.toString());
            this.accountNumber = accountInfo.AccountNumber;
            this.accountType = CommonUtility.getAccountTypeName(accountInfo.AccountType);
            this.accountName = accountInfo.AccountName;
         });
      }
      this.ItemAccountId = this.accountId;
   }

}

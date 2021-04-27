import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';
import { IClientDetails } from '../../core/services/models';
import { CommonUtility } from './../../core/utils/common';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-account-view-more-detail',
   templateUrl: './account-view-more-detail.component.html',
   styleUrls: ['./account-view-more-detail.component.scss']
})
export class AccountViewMoreDetailComponent implements OnInit {

   accountId: string;
   accountNumber: number;
   accountType: string;
   accountName: string;

   constructor(private accountService: AccountService, private route: ActivatedRoute) {
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      const selectedAccount = this.accountService.getAccountData();
      if (selectedAccount && selectedAccount.ItemAccountId === this.accountId) {
         this.accountNumber = selectedAccount.AccountNumber;
         this.accountType = selectedAccount.AccountType;
         this.accountName = selectedAccount.AccountName;
      }
   }
}

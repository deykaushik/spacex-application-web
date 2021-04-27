import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from './../../core/utils/constants';
import { AccountService } from './../../dashboard/account.service';
import { CommonUtility } from '../../core/utils/common';

import { IDashboardAccounts, IDashboardAccount, ILinkableAccounts, IRefreshAccountsApiResult } from '../../core/services/models';

@Component({
   selector: 'app-link-accounts',
   templateUrl: './link-accounts.component.html',
   styleUrls: ['./link-accounts.component.scss']
})
export class LinkAccountsComponent implements OnInit {
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   labels = Constants.labels;

   linkedAccounts: IDashboardAccount[];
   linkableAccounts: ILinkableAccounts[];
   accountsToLink: ILinkableAccounts[] = [];

   showLoader = false;
   showErrorMsg = false;
   showSuccessMsg = false;

   constructor(private accountService: AccountService) { }

   ngOnInit() {
      this.loadData();
   }

   loadData() {
      this.getAccountData();
      this.getLinkedAccounts();
   }

   refreshAccountsAndLoadData() {
      this.refreshAccountsData();
      this.getLinkedAccounts();
   }

   getAccountData() {
      this.accountService.getDashboardAccounts().subscribe((accountContainers: IDashboardAccounts[]) => {
         this.linkedAccounts = [];
         accountContainers.forEach((accountContainer) => {
            Array.prototype.push.apply(this.linkedAccounts, accountContainer.Accounts);
         });
      });
   }

   getLinkedAccounts() {
      this.accountService.getLinkableAccounts().subscribe((linkableAccounts: ILinkableAccounts[]) => {
         this.linkableAccounts = linkableAccounts;
      });
   }

   refreshAccountsData() {
      this.accountService.refreshAccounts().subscribe((response: IRefreshAccountsApiResult) => {
         this.getAccountData();
      });

   }
   getAccountTypeStyle(accountType: string) {
      return CommonUtility.getAccountTypeStyle(accountType);
   }

   selectLinkCheckBox(linkableAccount) {
      if (this.accountsToLink.indexOf(linkableAccount) >= 0) {
         this.accountsToLink.splice(this.accountsToLink.indexOf(linkableAccount), 1);
      } else {
         this.accountsToLink.push(linkableAccount);
      }
   }

   linkAccounts() {
      this.showLoader = true;
      this.accountService.linkAccounts(this.accountsToLink).subscribe((response: any) => {
         if (this.isResponseValid(response, this.accountsToLink)) {
            this.showSuccess();
         } else {
            this.showError();
         }
      }, (error) => {
         this.showError();
      });
   }

   isResponseValid(response: any, accountsToLink: ILinkableAccounts[]): boolean {
      let isValid = true;
      if (response) {
         accountsToLink.forEach((accountToLink) => {
            if (response[accountToLink.AccountNumber]
               && response[accountToLink.AccountNumber].trim() !== this.labels.linkAccountLabels.linkSuccessfulCode) {
               isValid = false;
            }
         });
      } else {
         isValid = false;
      }
      return isValid;
   }

   showError() {
      this.showLoader = false;
      this.showSuccessMsg = false;
      this.showErrorMsg = true;
   }

   showSuccess() {
      this.accountsToLink = [];
      this.showLoader = false;
      this.showErrorMsg = false;
      this.showSuccessMsg = true;
      this.refreshAccountsAndLoadData();
   }

   onLinkAccountClick() {
      this.linkAccounts();
   }

   closeSuccessMessage() {
      this.showSuccessMsg = false;
   }

   tryAgainForLinkAccounts() {
      this.linkAccounts();
   }
}

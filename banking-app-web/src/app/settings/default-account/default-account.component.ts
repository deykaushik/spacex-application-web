import { Component, OnInit } from '@angular/core';
import { Constants } from '../../core/utils/constants';
import {
   IDashboardAccount, IDashboardAccounts, IRefreshAccountsApiResult,
   ILinkableAccounts, IRadioButtonItem, IPreferenceDetail, IClientPreferenceDetails, IClientDetails, IDefaultAccounts
} from '../../core/services/models';
import { AccountService } from '../../dashboard/account.service';
import { CommonUtility } from '../../core/utils/common';
import { Observable } from 'rxjs/Observable';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { accountData } from '../../core/data/skeleton-data';

@Component({
   selector: 'app-default-account',
   templateUrl: './default-account.component.html',
   styleUrls: ['./default-account.component.scss']
})
export class DefaultAccountComponent implements OnInit {

   constructor(private accountService: AccountService,
      private clientProfileDetailsService: ClientProfileDetailsService) {
      this.skeletonMode = true;
   }
   isSettingDefault = false;
   showErrorMsg = false;
   showSuccessMsg = false;
   skeletonMode = false;
   labels = Constants.labels;
   defaultAccounts: IDashboardAccount[] = [];
   eligibleAccounts: IDefaultAccounts[] = [];
   allBankingAccounts: IDashboardAccount[] = [];
   accountsToSetDefault: IDashboardAccount;
   selectedDefaultAccount: IDefaultAccounts;
   successAriaMessage = Constants.AriaMessages.setDefaultAccountSucessMsg;
   errorAriaMessage = Constants.AriaMessages.setDefaultAccountErrorMsg;
   ngOnInit() {
      this.setSkeletonData();
      this.getAccountData();
      this.refreshAccountsData();
   }
   onAccountSelect(account: IDashboardAccount) {
      this.accountsToSetDefault = account;
   }

   getAccountTypeStyle(accountType: string) {
      return CommonUtility.getAccountTypeStyle(accountType);
   }

   setDefaultAccount() {
      this.isSettingDefault = true;
      this.hideMessages();
      const preference: IPreferenceDetail[] =
         [{
            PreferenceKey: Constants.labels.defaultAccount.defaultAccountKey,
            PreferenceValue: this.accountsToSetDefault.ItemAccountId
         }];
      this.accountService.setDefaultAccount(preference).subscribe((response) => {
         if (response === 'OK') {
            this.showSuccess();
            // set default account Id to global space
            this.clientProfileDetailsService.setDefaultAccountId(this.accountsToSetDefault.ItemAccountId);
            this.selectedDefaultAccount = this.accountsToSetDefault;
            this.accountsToSetDefault = null;
            this.eligibleAccounts = this.allBankingAccounts.filter(m => m.ItemAccountId !== this.selectedDefaultAccount.ItemAccountId);
            this.setRadioButtonData();
         }
      }, (error) => {
         this.showError();
      });
   }
   private refreshAccountsData() {
      this.accountService.refreshAccounts().subscribe((response: IRefreshAccountsApiResult) => {
         this.getAccountData();
      });
   }
   private showError() {
      this.isSettingDefault = false;
      this.showSuccessMsg = false;
      this.showErrorMsg = true;
      setTimeout(() => {
         this.hideMessages();
      }, Constants.VariableValues.settings.messageHideTimeout);
   }
   private hideMessages() {
      this.showSuccessMsg = false;
      this.showErrorMsg = false;
   }
   private showSuccess() {
      this.isSettingDefault = false;
      this.showErrorMsg = false;
      this.showSuccessMsg = true;
      setTimeout(() => {
         this.hideMessages();
      }, Constants.VariableValues.settings.messageHideTimeout);
   }
   private getAccountData() {
      this.accountsToSetDefault = null;
      this.accountService.getDashboardAccounts().subscribe(response => {
         this.skeletonMode = false;
         this.selectedDefaultAccount = null;
         this.eligibleAccounts = null;
         if (response) {
            const everyDaybankingAcc = response.find(m =>
               m.ContainerName === Constants.VariableValues.accountContainers.bank);
            this.eligibleAccounts = this.allBankingAccounts = everyDaybankingAcc ? everyDaybankingAcc.Accounts : [];
            const clientDetails: IClientDetails = this.clientProfileDetailsService.getClientPreferenceDetails();
            if (clientDetails.DefaultAccountId) {
               this.selectedDefaultAccount = this.allBankingAccounts
                  .find(m => m.ItemAccountId === clientDetails.DefaultAccountId);
               this.eligibleAccounts = this.allBankingAccounts
                  .filter(m => m.ItemAccountId !== this.selectedDefaultAccount.ItemAccountId);
            }
            this.setRadioButtonData();
         }
      });
   }
   private setSkeletonData() {
      this.eligibleAccounts = accountData[0].Accounts.slice(0, 2);
      this.selectedDefaultAccount = accountData[0].Accounts[0];
   }
   private setRadioButtonData() {
      this.eligibleAccounts.forEach((eligibleAcc) => {
         eligibleAcc.radioList = [{ value: eligibleAcc.AccountNumber, label: '' }];
      });
      if (this.selectedDefaultAccount) {
         this.selectedDefaultAccount.radioList = [{ value: this.selectedDefaultAccount.AccountNumber, label: '' }];
      }
   }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IAccountDetail } from './../../../core/services/models';
import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';

@Component({
   selector: 'app-account-list',
   templateUrl: './account-list.component.html',
   styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
   @Input() selectedAccount: IAccountDetail;
   @Input() accounts: IAccountDetail[];
   @Input() title: string;
   @Input() insufficientFunds: boolean;
   @Output() onAccountSelection = new EventEmitter<IAccountDetail>();
   @Input() isToAccountFlag = false;

   isAccountZeroOrLess = false;
   accountStatusLabel = Constants.labels.accountListStatus;

   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   amountPipeConfigRewards = Constants.amountPipeSettings.amountWithLabelAndSignRewards;

   rewardsAccountType: string = Constants.VariableValues.accountTypes.rewardsAccountType.code;

   constructor(private clientProfileDetailsService: ClientProfileDetailsService) { }
   ngOnInit() {
      const clientDetails = this.clientProfileDetailsService.getClientPreferenceDetails();
      const defaultAccount = clientDetails && clientDetails.DefaultAccountId &&
         this.accounts && this.clientProfileDetailsService.getDefaultAccount(this.accounts);

      this.selectedAccount = (this.selectedAccount || defaultAccount || (this.accounts && this.accounts.length && this.accounts[0]));
   }
   isAccountZero(account) {
      return account && account.availableBalance <= 0 && !this.isToAccountFlag;
   }
   onAccountSelect(account: IAccountDetail) {
      this.selectedAccount = account;
      this.onAccountSelection.emit(this.selectedAccount);
   }

   isDisabled(account) {
      if (account) {
         return !(this.isToAccountFlag ? account.allowCredits : account.allowDebits);
      } else {
         return false;
      }
   }

   // TODO
   // move to enums/constant
   getStyle(accountType: string) {
      let cssClass;
      switch (accountType) {
         case 'CA':
            cssClass = Constants.accountTypeCssClasses.current;
            break;
         case 'SA':
            cssClass = Constants.accountTypeCssClasses.savings;
            break;
         case 'CC':
            cssClass = Constants.accountTypeCssClasses.creditCard;
            break;
         case 'NC':
         case 'IS':
         case 'HL':
            cssClass = Constants.accountTypeCssClasses.loan;
            break;
         case 'TD':
         case 'DS':
         case 'INV':
            cssClass = Constants.accountTypeCssClasses.investment;
            break;
         case 'Rewards':
            cssClass = Constants.accountTypeCssClasses.rewards;
            break;
         default:
            cssClass = Constants.accountTypeCssClasses.other;
      }
      return cssClass;
   }

   getID() {
      return CommonUtility.getID(this.title);
   }
}

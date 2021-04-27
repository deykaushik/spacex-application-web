import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { Subscription, Subject } from 'rxjs/Rx';
import { Constants } from './../../core/utils/constants';
import { AccountService } from './../../dashboard/account.service';
import { CommonUtility } from '../../core/utils/common';
import { environment } from '../../../environments/environment';
import {
   IDashboardAccounts, IDashboardAccount, ILinkableAccounts, IRefreshAccountsApiResult,
   ILinkedAccount, IAccountLists
} from '../../core/services/models';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { GAEvents } from '../../core/utils/ga-event';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
   selector: 'app-account-visibility',
   templateUrl: './account-visibility.component.html',
   styleUrls: ['./account-visibility.component.scss']
})
export class AccountVisibilityComponent extends BaseComponent implements OnInit {

   accounts: ILinkedAccount[];
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   labels = Constants.labels;
   linkableAccounts: ILinkableAccounts[];
   accountsToLink: ILinkableAccounts[] = [];
   accountsShowHide: ILinkedAccount[];
   notificationType = '';

   showErrorMsg = false;
   showSuccessMsg = false;
   statusMessage: string;
   isShowMessageBlock = false;
   isSuccess = false;
   editSkeletonMode = false;
   accountList: ILinkedAccount;
   accountsShowHideFeature = environment.features.accountsShowHideFeature;
   isNotification: boolean;
   skeletonMode = true;
   isEnabled = false;
   visibilityError: string;
   alertAction: string;
   alertType: string;
   defaultLabel = Constants.accountTypeCssClasses.other;

   constructor(private accountService: AccountService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.loadData();
      this.isNotification = false;
      this.setErrorMessage({
         message: Constants.showHideAccountsMsg.error,
         alertAction: AlertActionType.None, alertType: AlertMessageType.Error
      });
      const hideAndShowClick = GAEvents.hideAndShow.accountManagement;
      this.sendEvent(hideAndShowClick.eventAction, hideAndShowClick.label, null, hideAndShowClick.category);
   }

   loadData() {
      this.getAccountData();
      this.getLinkedAccounts();
   }

   getAccountData() {
      this.accountService.getHideShowAccounts().subscribe((accountContainers: ILinkedAccount[]) => {
         this.accountsShowHide = accountContainers;
         this.skeletonMode = false;
      });
   }

   getLinkedAccounts() {
      this.accountService.getLinkableAccounts().subscribe((linkableAccounts: ILinkableAccounts[]) => {
         this.linkableAccounts = linkableAccounts;
         this.skeletonMode = false;
      });
   }

   getAccountTypeStyle(accountType: string) {
      return CommonUtility.getAccountTypeStyle(accountType);
   }

   saveAccountVisibility(linkedAccount: ILinkedAccount) {
      linkedAccount.isFreezed = true;
      const preferenceKey = Constants.labels.linkAccountLabels.preferencesTextHidden;
      const payload: IAccountLists = {
         accountList: [{
            itemAccountId: linkedAccount.itemAccountId,
            accountNumber: linkedAccount.accountNumber,
            accountName: linkedAccount.accountName,
            accountType: linkedAccount.accountType,
            enabled: linkedAccount.enabled
         }]
      };

      if (this.isEnabled) {
         this.isEnabled = false;
      }
      for (let i = 0; i < this.accountsShowHide.length; i++) {
         if (this.accountsShowHide[i].enabled) {
            this.isEnabled = true;
            break;
         }
      }
      // last account cannot be hidden check
      if (this.isEnabled) {
         this.accountService.updateAccountEnable(payload, preferenceKey).subscribe((response) => {
            if (!response) {
               this.notificationType = Constants.visibilityNotification.error;
               this.isNotification = true;
               this.getAccountData();
               const changeSuccess = GAEvents.hideAndShow.success;
               this.sendEvent(changeSuccess.eventAction, changeSuccess.label, null, changeSuccess.category);
            }
         }, (error) => {
            this.notificationType = Constants.visibilityNotification.error;
            this.isNotification = true;
            this.getAccountData();
         },
            () => {
               linkedAccount.isFreezed = false;
            });
      } else {
         this.notificationType = Constants.visibilityNotification.error;
         this.isNotification = true;
         this.getAccountData();
         linkedAccount.isFreezed = false;
         const changeFail = GAEvents.hideAndShow.failed;
         this.sendEvent(changeFail.eventAction, changeFail.label, null, changeFail.category);
      }
   }
   setErrorMessage(errorMessage) {
      this.visibilityError = errorMessage.message;
      this.alertAction = errorMessage.alertAction;
      this.alertType = errorMessage.alertType;
   }
   onAlertLinkSelected(action: AlertActionType) {
      if (action) {
         switch (action) {
            case AlertActionType.Close: {
               this.isNotification = false;
               break;
            }
         }
      }
   }
}

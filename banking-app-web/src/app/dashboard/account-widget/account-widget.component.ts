import { Component, OnInit, Input, Injector, Renderer2, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../environments/environment';
import { Constants } from '../../core/utils/constants';
import { AccountService } from './../account.service';
import { SubmenuConstants } from '../../shared/constants';
import { ISubmenu } from '../../shared/models';
import { IAccountConfig } from './../dashboard.model';
import { IDashboardAccount, IClientDetails, IAccountRename, IRenameAccount, IPreApprovedOffers } from './../../core/services/models';
import { CommonUtility } from '../../core/utils/common';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { SystemErrorService } from './../../core/services/system-services.service';
import { GreenbacksEnrolmentService } from '../../core/services/greenbacks-enrolment.service';
import { GAEvents } from '../../core/utils/ga-event';
import { BaseComponent } from '../../core/components/base/base.component';
import { JoinGreenbacksComponent } from './../enrolment/join-greenbacks/join-greenbacks.component';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { IPayload } from '../../pre-approved-offers/pre-approved-offers.model';
@Component({
   selector: 'app-account-widget',
   templateUrl: './account-widget.component.html',
   styleUrls: ['./account-widget.component.scss']
})
export class AccountWidgetComponent extends BaseComponent implements OnInit {

   @Input() type: string;
   @Input() skeletonMode: Boolean;
   @Input() accounts: IDashboardAccount[];
   @Input() allowNavigation: Boolean;
   @Output() accountNameChange = new EventEmitter<IRenameAccount>();
   @Input() totalVisibleAccounts: number;
   @Output() onViewLoanoffer = new EventEmitter<IPreApprovedOffers>();
   defaultAccount: IDashboardAccount;
   bsModalRef: BsModalRef;
   public accountConfig: IAccountConfig;
   public isVisible = false;
   public labels = Constants.labels;
   public clientDetails: IClientDetails;
   forexAccount = Constants.forex;
   public sortedForexOrder = [this.forexAccount.dollar, this.forexAccount.euro, this.forexAccount.pound];
   sortedForexAccounts = [];
   accountBankContainer = Constants.VariableValues.accountContainers.bank;
   accountInvestmentContainer = Constants.VariableValues.accountContainers.investment;
   accountLoanContainer = Constants.VariableValues.accountContainers.loan;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   amountPipeConfigRewards = Constants.amountPipeSettings.amountWithNoDecimal;
   removeTypes = Constants.VariableValues.removePayBuyTransferTags;
   buySubMenuOptions: ISubmenu[];
   upliftDormancyValues = Constants.VariableValues.upliftDormancy;
   showUpliftDormancy = environment.features.upliftDormancy;
   visibleAccounts: IDashboardAccount[];
   unitTrustInvestmentAccountType = Constants.VariableValues.accountTypes.unitTrustInvestmentAccountType.code;
   personalLoanAccountType = Constants.VariableValues.accountTypes.personalLoanAccountType.code;
   rewardsAccountType = Constants.VariableValues.accountTypes.rewardsAccountType.code;
   forexAccountType = Constants.VariableValues.accountTypes.foreignCurrencyAccountType.code;
   mfcvafLoanAccountType = Constants.VariableValues.accountTypes.mfcvafLoanAccountType.code;
   viewOffer = Constants.VariableValues.ViewOffer;
   hasNgiInvestments = false;
   insertHeaderAt: number;
   renameLabels = Constants.accountRenameConst;
   editedAccountName: string;
   isAccountNameInvalid: boolean;
   renameAccount: IAccountRename;
   statusMessage: string;
   isShowMessageBlock: boolean;
   isSuccess: boolean;
   editSkeletonMode: boolean;
   accountNameLengthFlag: boolean;
   accountDescriptionRename = environment.features.accountRename;
   isPreApprovedOfferPresent: boolean;
   preApprovedLoanOfferAmount: number;
   preApprovedLoanOffer: IPreApprovedOffers;

   constructor(
      private router: Router, private accountService: AccountService,
      private clientPreferences: ClientProfileDetailsService,
      private modalService: BsModalService, injector: Injector,
      private renderer: Renderer2,
      private enrolmentService: GreenbacksEnrolmentService,
      private preApprovedOffersService: PreApprovedOffersService,
      private systemErrorService: SystemErrorService
   ) {
      super(injector);
   }

   ngOnInit() {
      // visibleAccounts property is to filter the accounts which has the property IsShow true.
      // The filtered accounts length is used to show whether the account container should be displayed or not in html level.
      this.visibleAccounts = this.accounts.filter(account => account.IsShow === true);
      this.accountConfig = this.accountService.getAccountConfig(this.type);
      if (this.type === Constants.labels.dashboardRewardsAccountTitle) {
         this.accountConfig.currentBalance = Constants.labels.rewardsBalance;
      }
      if (this.removeTypes.indexOf(this.accountConfig.type) >= 0) {
         this.isVisible = true;
      }
      this.getSortedAccountsWithDefault();
      if (this.type === this.accountInvestmentContainer) {
         this.getInvestmentHeaderAndSetAccounts();
      } else if (this.type === this.accountLoanContainer) {
         this.getLoanHeaderAndSetAccounts();
      }
      this.buySubMenuOptions = SubmenuConstants.VariableValues.buySubmenu;
      this.getSortedForexAccounts();
      this.isAccountNameInvalid = false;
      this.editSkeletonMode = false;
      this.accountNameLengthFlag = false;
   }
   getSortedForexAccounts() {
      if (this.accountConfig.type === this.forexAccount.foreign) {
         let sortedAccounts: IDashboardAccount[];
         sortedAccounts = [];
         for (const forex of this.sortedForexOrder) {
            sortedAccounts.push.apply(sortedAccounts, this.accounts.filter((items) => {
               return items.Currency === forex;
            }));
         }
         this.accounts = this.accounts.filter(m => this.sortedForexOrder.indexOf(m.Currency) === -1);
         this.accounts = sortedAccounts.concat(this.accounts);
      }
   }
   getSortedAccountsWithDefault() {
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      // find default account
      if (this.clientDetails && this.clientDetails.DefaultAccountId && this.type === this.accountBankContainer) {
         this.defaultAccount = this.accounts.find((acc) => acc.ItemAccountId === this.clientDetails.DefaultAccountId);
         this.accounts = this.accounts.filter((acc) => acc.ItemAccountId !== this.clientDetails.DefaultAccountId);
      }
      // Sort accounts in descending order
      this.accounts.sort((a, b) => {
         return b.Balance - a.Balance;
      });
      // If default account found, shift it to top.
      if (this.defaultAccount && this.type === this.accountBankContainer) {
         this.accounts.unshift(this.defaultAccount);
      }
   }
   getAccountTypeStyle(accountType: string) {
      return CommonUtility.getAccountTypeStyle(accountType, this.type);
   }
   getAccountEditableStyle(account: IDashboardAccount) {
      if (account.isEditInProcess) {
         return 'row-expand';
      }
   }
   onAccountClick(itemAccountId: string, accountStatusCode?: string) {
      if (itemAccountId && this.allowNavigation) {
         this.router.navigateByUrl(encodeURI('/dashboard/account/detail/' + itemAccountId));
      }
      if (accountStatusCode === this.upliftDormancyValues.dormantAccountStatus) {
         const viewDormantAccountGAEvent = GAEvents.dormantAccount.view;
         this.sendEvent(viewDormantAccountGAEvent.eventAction, viewDormantAccountGAEvent.label, null, viewDormantAccountGAEvent.category);
      }
   }
   getTitle() {
      return this.accountConfig.title.toLocaleLowerCase().replace(' ', '_');
   }

   // if investment containers has only Unit trust accounts, show header as market value
   // if investment containers has only non Unit trust accounts, show header as current and available balance
   // if investment containers has both Unit trust and non unit trust accounts, show headers before those accounts list
   getInvestmentHeaderAndSetAccounts() {
      const unitTrustAccounts = this.visibleAccounts.filter(account => account.AccountType === this.unitTrustInvestmentAccountType);
      const nonUnitTrustAccounts = this.visibleAccounts.filter(account => account.AccountType !== this.unitTrustInvestmentAccountType);
      let sortedInvAccounts = [];
      switch (this.visibleAccounts.length) {
         case unitTrustAccounts.length:
            this.accountConfig.currentBalance = this.labels.marketValue;
            this.accountConfig.availableBalance = '';
            break;
         case nonUnitTrustAccounts.length:
            this.accountConfig.currentBalance = this.labels.currentBalance;
            this.accountConfig.availableBalance = this.labels.availableBalance;
            break;
         default:
            this.accountConfig.currentBalance = this.labels.currentBalance;
            this.hasNgiInvestments = true;
            this.insertHeaderAt = nonUnitTrustAccounts.length;
            sortedInvAccounts = sortedInvAccounts.concat(nonUnitTrustAccounts).concat(unitTrustAccounts);
      }
      this.accounts = sortedInvAccounts.length ? sortedInvAccounts : this.visibleAccounts;
   }

   // if loan container has only PL and IS accounts, show header as Outstanding balance
   // if loan container has any other account along with PL and IS, show header as Outstanding and available balance
   getLoanHeaderAndSetAccounts() {
      const personalOrMfcvafAccounts = this.accounts.filter(account => account.AccountType === this.personalLoanAccountType
         || account.AccountType === this.mfcvafLoanAccountType);
      if (this.accounts.length === personalOrMfcvafAccounts.length) {
         this.accountConfig.currentBalance = this.labels.outstandingBalance;
         this.accountConfig.availableBalance = '';
      } else {
         this.accountConfig.currentBalance = this.labels.outstandingBalance;
         this.accountConfig.availableBalance = this.labels.availableBalance;
      }
   }

   onEditBtnClick(account: IDashboardAccount) {
      const pencilIconAction = GAEvents.accountRename.renameButtonClick;
      this.sendEvent(pencilIconAction.eventAction, pencilIconAction.label, null, pencilIconAction.category);
      this.isAccountNameInvalid = false;
      this.accounts.forEach((acc) => {
         this.editedAccountName = account.AccountName;
         acc['isEditInProcess'] = false;
      });
      account.isEditInProcess = true;
      setTimeout(() => {
         const element = this.renderer.selectRootElement('#acc_name');
         element.focus();
         element.select();
      }, 0);
   }

   onCancelBtnClick(account: IDashboardAccount) {
      this.changeAccountEditStatus(account);
      this.editedAccountName = '';
      this.accountNameLengthFlag = false;
   }

   onInputChanged(text) {
      if (text.length === 1 && text === ' ') {
         setTimeout(() => {
            this.editedAccountName = '';
         }, 0);
      }
      if (text.length < 21) { // account name should not be more than 21 characters
         this.accountNameLengthFlag = false;
      }
      const pattern = Constants.patterns.alphaNumericWithSpace;
      if (!pattern.test(this.editedAccountName)) {
         this.isAccountNameInvalid = true;
      } else {
         this.isAccountNameInvalid = false;
      }
      if (text.length === 21) { // account name should not be more than 21 characters
         this.accountNameLengthFlag = true;
      }
   }

   onConfirmBtnClick(updatedName: string, account: IDashboardAccount) {
      this.isShowMessageBlock = false;
      this.editSkeletonMode = true;
      this.renameAccount = {
         NickName: updatedName
      };
      this.accountService.saveAccountName(this.renameAccount, account.ItemAccountId).finally(() => {
         this.editSkeletonMode = false;
         this.changeAccountEditStatus(account);
         this.accountNameLengthFlag = false;
      }).subscribe((data) => {
         if (data && data.AccountNickName && data.AccountNickName.length) {
            const renameAccount = {} as IRenameAccount;
            renameAccount.AccountNickName = data.AccountNickName;
            renameAccount.AccountNumber = account.AccountNumber.toString();
            account.AccountName = data.AccountNickName;
            this.handleMessages(Constants.renameAccountMsg.success);
            this.isSuccess = true;
            this.accountNameChange.emit(renameAccount);
            const confirmButtonSuccess = GAEvents.accountRename.success;
            this.sendEvent(confirmButtonSuccess.eventAction, confirmButtonSuccess.label, null, confirmButtonSuccess.category);
         } else {
            const accountRenameFailure = GAEvents.accountRename.failure;
            this.sendEvent(accountRenameFailure.eventAction, accountRenameFailure.label, null, accountRenameFailure.category);
            this.handleErrorMessage();
         }
      }, (error) => {
         const accountRenameFailure = GAEvents.accountRename.failure;
         this.sendEvent(accountRenameFailure.eventAction, accountRenameFailure.label, null, accountRenameFailure.category);
         this.handleErrorMessage();
         this.systemErrorService.closeError();
      });
   }

   changeAccountEditStatus(account: IDashboardAccount) {
      this.accounts.forEach((acc) => {
         acc.isEditInProcess = false;
      });
   }

   handleMessages(message: string) {
      this.statusMessage = message;
      this.isShowMessageBlock = true;
   }

   closeMessageBlock() {
      this.isShowMessageBlock = false;
   }

   isMyPocketsAccount(accountType: string, productType: string): boolean {
      return CommonUtility.isMyPocketsAccount(accountType, productType);
   }

   handleErrorMessage() {
      this.handleMessages(Constants.renameAccountMsg.error);
      this.isSuccess = false;
   }

   /**
    * Show the enrolment popup to the user as full screen modal.
    *
    * @memberof AccountWidgetComponent
    */
   showEnrolmentPopup() {
      this.sendEvent('rewards_agree_to_join_gb_enrolment');
      this.bsModalRef = this.modalService
         .show(JoinGreenbacksComponent, Constants.fullScreenModalConfig);
   }

   /**
    * Show Join button for greenbacks enrolment
    * @memberof AccountWidgetComponent
    */
   canShowJoinGreenbacksEnrolment(): boolean {
      return !this.enrolmentService.isCustomerEnroled();
   }

   onKebabClick(account: IDashboardAccount) {
      account.kebabOpen = !account.kebabOpen;
   }
   viewLoanOffer() {
      const payLoad: IPayload = {
         status: Constants.preApprovedOffers.offerStatus.LOAN_OFFER_READ, reason: '',
         screen: Constants.preApprovedOffers.ScreenIdentifiers.DASHBOARD_SCREEN
      };
      const offerId = this.preApprovedOffersService.getPreApprovedPersonalLoan().id;
      this.preApprovedOffersService.changeOfferStatusById(payLoad, offerId).subscribe(response => {
         this.preApprovedOffersService.InitializeWorkFlow();
         this.router.navigateByUrl(Constants.routeUrls.offers + offerId);
      });
   }
}

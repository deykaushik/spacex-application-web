import { Component, OnInit, Input, Output, EventEmitter, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from './../../core/utils/constants';
import { SubmenuConstants } from '../../shared/constants';

import { CommonUtility } from './../../core/utils/common';
import {
   IDashboardAccount, IDashboardAccounts, ISettlementFeatureVisibleProps, IBalanceDetailProps,
   IAccountBalanceDetail,
   IViewNoticeDetails,
   IFicaResult
} from '../../core/services/models';
import { ISubmenu } from '../../shared/models';
import { IAccountConfig } from './../dashboard.model';

import { AccountService } from '../account.service';
import { PreFillService } from '../../core/services/preFill.service';

import { BaseComponent } from '../../core/components/base/base.component';
import { environment } from '../../../environments/environment';
import { GAEvents } from './../../core/utils/ga-event';
import { accountData } from './../../core/data/skeleton-data';

@Component({
   selector: 'app-account-card',
   templateUrl: './account-card.component.html',
   styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent extends BaseComponent implements OnInit {

   @Input() accountContainers: IDashboardAccounts[];
   @Input() itemAccountId: string;
   @Input() skeletonMode: Boolean;
   @Input() isOptionsVisible: Boolean;
   @Input() isNow: boolean;
   @Output() accountChange = new EventEmitter<IDashboardAccount>();
   @Input() settlementFeatureProps: ISettlementFeatureVisibleProps;
   @Input() isDormantAccount: boolean;
   @Input() buildingLoanAccount: IAccountBalanceDetail;

   @Output() noticeWithdrawalFlag = new EventEmitter<boolean>();
   @Output() selectedAccountInfo = new EventEmitter<IDashboardAccount>();
   @Input() allNotices: IViewNoticeDetails[];

   accountConfig: IAccountConfig;
   accountInfo: IDashboardAccount;
   accountContainer: IDashboardAccounts;
   labels = Constants.labels;
   noticeWithdrawalMessages = Constants.messages.noticeWithdrawal;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   amountPipeConfigRewards = Constants.amountPipeSettings.amountWithNoDecimal;
   selectedAccountName: string;
   selectedAccount: IDashboardAccount;
   dropdownAccounts: IDashboardAccount[];
   accountDropdownOpen = false;
   accountsOrder = ['current', 'savings', 'credit-card', 'club-accounts', 'loan', 'investment', 'foreign', 'rewards', 'default'];
   buySubMenuOptions: ISubmenu[];
   upliftDormancyValues = Constants.VariableValues.upliftDormancy;
   showUpliftDormancy = environment.features.upliftDormancy;
   accountTypes = Constants.VariableValues.accountTypes;
   showBalanceDetail = environment.features.balanceDetail;
   accountInvestmentContainer = Constants.VariableValues.accountContainers.investment;
   unitTrustInvestmentAccountType = Constants.VariableValues.accountTypes.unitTrustInvestmentAccountType.code;
   isBalanceDetailAvailable = false;
   balanceDetailProps: IBalanceDetailProps;
   settlementToggle = environment.features.settlement;
   unableToLoad = Constants.messages.settlement.unableToLoad;
   isWithdrawBtnShow = false;
   showReasonError = false;
   isNoticeFlag = environment.features.noticeOfWithdrawal;
   showPayOut = environment.features.requestBuildingLoanPayment;
   isSingleOrJointBond: boolean;
   symbols = Constants.symbols;
   noticeOfWithdrawalValues = Constants.VariableValues.noticeOfWithdrawalValues;

   constructor(private accountService: AccountService, private preFillService: PreFillService, injector: Injector,
      private router: Router) {
      super(injector);
   }
   ngOnInit() {
      this.processData();
      this.buySubMenuOptions = SubmenuConstants.VariableValues.buySubmenu;
      this.selectedAccountInfo.emit(this.accountInfo);
   }

   getAccountTypeStyle(accountType: string, containerName?: string) {
      return CommonUtility.getAccountTypeStyle(accountType, containerName);
   }

   isMyPocketsAccount(accountType: string, productType: string): boolean {
      return CommonUtility.isMyPocketsAccount(accountType, productType);
   }

   processData() {
      this.processAccountData();
      this.processDropdownData();
   }

   processAccountData() {
      this.accountContainer = this.accountContainers.
         find(ac => ac.Accounts.some(a => a.ItemAccountId === this.itemAccountId.toString()));
      this.accountInfo = this.accountContainer.Accounts
         .find(a => a.ItemAccountId === this.itemAccountId.toString());
      this.accountConfig = this.accountService.getAccountConfig(this.accountContainer.ContainerName);
      this.isDormantAccount = this.accountInfo.AccountStatusCode === this.upliftDormancyValues.dormantAccountStatus;
      if (this.accountConfig.type === this.accountInvestmentContainer ||
         this.accountConfig.type === this.labels.dashboardRewardsAccountTitle) {
         this.setHeaderForRewardsAndUnitTrust();
      }
      this.accountService.setAccountData(this.accountInfo);
      this.preFillService.selectedAccount = this.accountInfo;
      this.selectedAccount = this.accountInfo;
      this.checkIfBalanceDetailIsAvailable();
      this.balanceDetailProps = {
         itemAccountId: parseInt(this.accountInfo.ItemAccountId, 10),
         accountType: this.accountInfo.AccountType,
         containerName: this.accountContainer.ContainerName,
         isDormantAccount: this.isDormantAccount,
      };

      this.isNoticeofWithdrawal();
   }

   isNoticeofWithdrawal() {
      this.isWithdrawBtnShow = (this.isNow && (this.accountInfo.AccountType === this.accountTypes.investmentAccountType.code));
   }

   processDropdownData() {
      this.dropdownAccounts = [];
      let tempDropdownAccounts: IDashboardAccount[];
      tempDropdownAccounts = [];

      // create a temporary account array with account type name
      this.accountContainers.forEach(ac => {
         ac.Accounts.forEach(a => {
            a['AccountTypeName'] = CommonUtility.getAccountTypeStyle(a.AccountType, ac.ContainerName);
         });
         Array.prototype.push.apply(tempDropdownAccounts, ac.Accounts);
      });

      // sort the accounts
      this.accountsOrder.forEach(ao => {
         Array.prototype.push.apply(this.dropdownAccounts, tempDropdownAccounts.filter(temp => {
            return temp && temp['AccountTypeName'] === ao;
         }).sort((a, b) => a.AccountName.localeCompare(b.AccountName)));
      });
   }

   onAccountChange(account: IDashboardAccount) {
      this.accountChange.emit(account);
      this.selectedAccount = account;
      this.itemAccountId = account.ItemAccountId;
      this.selectedAccountName = account.AccountName;
      this.isWithdrawBtnShow = (account.AccountType === this.accountTypes.investmentAccountType.code);
      this.processAccountData();
   }
   checkIfBalanceDetailIsAvailable() {
      this.isBalanceDetailAvailable = this.accountService.hasTransactionsAndDetailsForIS(this.accountInfo.AccountType) &&
         this.accountInfo.AccountType !== this.accountTypes.rewardsAccountType.code;
   }

   setHeaderForRewardsAndUnitTrust() {
      switch (this.accountInfo.AccountType) {
         case this.labels.dashboardRewardsAccountTitle:
            this.accountInfo.Balance = this.accountInfo.AvailableBalance;
            if (this.accountInfo.RewardsProgram === this.labels.amextype) {
               this.accountConfig.currentBalance = this.labels.amexrewardsBalance;
            } else {
               this.accountConfig.currentBalance = this.labels.gbrewardsBalance;
            }
            break;
         case this.unitTrustInvestmentAccountType:
            this.accountConfig.currentBalance = this.labels.marketValue;
            break;
         default:
            this.accountConfig.currentBalance = this.labels.currentBalance;
            this.accountConfig.availableBalance = this.labels.availableBalance;
      }
   }

   onSettleLoanClick() {
      const settleLoanGAEvent = GAEvents.personalLoanSettlement.settleLoan;
      this.sendEvent(settleLoanGAEvent.eventAction, settleLoanGAEvent.label, null, settleLoanGAEvent.category);
      this.router.navigateByUrl(encodeURI(Constants.routeUrls.settlement.directPay + this.accountInfo.ItemAccountId));
   }

   // for unit trust, PL and IS accounts, available balance should not be shown
   hideAvailableBalance(accountType: string): boolean {
      return accountType !== this.accountTypes.unitTrustInvestmentAccountType.code
         && accountType !== this.accountTypes.personalLoanAccountType.code
         && accountType !== this.accountTypes.mfcvafLoanAccountType.code;
   }

   // handle settlement properties
   handleSettlementProps(): boolean {
      return this.settlementFeatureProps && (this.settlementFeatureProps.showError || this.settlementFeatureProps.showAmount);
   }

   showSettleLoan(): boolean {
      return this.settlementFeatureProps && this.settlementFeatureProps.showSettleLoanBtn;
   }
   noticeWithdrawal() {
      if (this.allNotices && (this.allNotices.length < this.noticeOfWithdrawalValues.sixValue)) {
      this.skeletonMode = true;
         this.accountService.getficaStatus().subscribe( (result: IFicaResult) => {
            this.skeletonMode = false;
            if (result && result.isFica) {
               this.noticeWithdrawalFlag.emit(true);
               this.selectedAccountInfo.emit(this.accountInfo);
            } else {
               this.showReasonError = true;
            }
         });
         CommonUtility.topScroll();
      }
   }

   closeOverlay(value) {
      this.showReasonError = value;
   }

   backToOverview() {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   isHomeLoan(): boolean {
      return CommonUtility.isHomeLoan(this.accountInfo.AccountType);
   }
   isBuildingLoan(): boolean {
      this.isSingleOrJointBond = this.buildingLoanAccount
         && (this.buildingLoanAccount.isSingleBond || this.buildingLoanAccount.isJointBond) ? true : false;
      return this.showPayOut && this.isHomeLoan() && this.isSingleOrJointBond;
   }
}

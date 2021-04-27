import { Component, OnInit, Input, OnChanges, Injector } from '@angular/core';
import { AccountService } from '../account.service';
import { BaseComponent } from '../../core/components/base/base.component';
import {
   IAccountBalanceDetail, IBalanceDetailsChangeLabel, IInvestmentDetailsList,
   IPropertyLabelsDetailedBalances, IPropertyToApplyFilter, IBalanceDetailProps
} from '../../core/services/models';
import { Constants } from './../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { GAEvents } from '../../core/utils/ga-event';
import { CommonModule } from '@angular/common/src/common_module';

@Component({
   selector: 'app-account-balance-detail',
   templateUrl: './account-balance-detail.component.html',
   styleUrls: ['./account-balance-detail.component.scss']
})
export class AccountBalanceDetailComponent extends BaseComponent implements OnInit, OnChanges {

   @Input() balanceDetailProps: IBalanceDetailProps;
   itemAccountId: number;
   accountType: string;
   containerName: string;
   isDormantAccount: boolean;

   isSkeletonMode: boolean;
   balanceDetail: IAccountBalanceDetail;
   labels = Constants.labels.account.balanceDetailLabels;
   showMaintainOverdraft = environment.features.maintainOverdraft;
   overdraftLimit = this.labels.fieldLabels.overdraftLimit;
   overdraftLink = this.labels.fieldLabels.overdraftLink;
   overdraftRouteUrls = Constants.routeUrls;
   titles = this.labels.titles;
   investmentType = this.labels.investmentType;
   isOpen: boolean;
   accountTypes = Constants.VariableValues.accountTypes;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   isOverDraft: boolean;
   title: string;
   toShowPropertiesOnView = [];
   propertyToApplyFilter: IPropertyToApplyFilter;
   propertyLabels: IPropertyLabelsDetailedBalances[] = [];
   // for linked and fixed DS investment, UI should display maturity date with value of payOutDate from API field
   changeLabel: IBalanceDetailsChangeLabel;
   payOutDate = this.labels.fieldLabels.payOutDateKey;
   totalInterestPaid = this.labels.fieldLabels.totalInterestPaidKey;
   paymentDueDate = this.labels.fieldLabels.paymentDueDateKey;
   isCollapsed = true;

   constructor(private accountService: AccountService, private router: Router, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.isSkeletonMode = true;
   }

   // To view and collapse balances
   handleBalanceDisplay(event) {
      this.isOpen = event.isCollapsed;
      if (!this.isOpen) {
         this.isSkeletonMode = true;
         this.title = this.titles.collapse;
         this.getAccountBalanceDetail();
         const viewMoreBalance = Object.assign({}, GAEvents.balanceEnquiry.viewMoreBalance);
         viewMoreBalance.label += CommonUtility.gaAccountType(this.accountType, this.accountService.getAccountData().ProductType);
         this.sendEvent(viewMoreBalance.eventAction, viewMoreBalance.label, null, viewMoreBalance.category);
      } else {
         this.title = this.titles.view;
      }
   }

   // A common utility function used across the application to get style of different account types
   getAccountTypeStyle(accountType: string, containerName?: string) {
      return CommonUtility.getAccountTypeStyle(accountType, containerName);
   }

   // Get the account balances details only when account is changed and view-more balances is not open
   ngOnChanges(change) {
      this.isOpen = false;
      this.title = this.titles.view;
      this.resetInvestmentView();
      this.isSkeletonMode = false;
      if (!change.balanceDetailProps.firstChange) {
         this.itemAccountId = change.balanceDetailProps.currentValue.itemAccountId;
         this.isSkeletonMode = true;
      } else {
         this.itemAccountId = this.balanceDetailProps.itemAccountId;
      }
      this.accountType = this.balanceDetailProps.accountType;
      this.containerName = this.balanceDetailProps.containerName;
      this.isDormantAccount = change.balanceDetailProps.currentValue.isDormantAccount;
   }

   // Get the balance details of account and check the overdraft flag
   getAccountBalanceDetail() {
      this.isOverDraft = false;
      this.accountService.getAccountBalanceDetail(this.itemAccountId).subscribe(response => {
         let balanceDetailValue: IAccountBalanceDetail;
         if (this.accountType === this.accountTypes.currentAccountType.code) {
            this.isOverDraft = this.accountService.isOverDraftAccount(response.overdraftLimit);
         }
         balanceDetailValue = response.investmentDetailsList && response.investmentDetailsList[0] ?
            response.investmentDetailsList[0] : response;
         this.setDetailedBalanceView(balanceDetailValue);
         this.balanceDetail = balanceDetailValue;
         this.isSkeletonMode = false;
      });
   }

   // on account change, reset the templates for investments
   resetInvestmentView() {
      this.isCollapsed = true;
      this.toShowPropertiesOnView = [];
      this.changeLabel = { label: null };
      this.isSkeletonMode = true;
   }
   /* fetches the templateDetails, filterToBeApplied and propertyLabels
   for different account types to be provided to pipe on UI */
   setDetailedBalanceView(balanceDetail: IAccountBalanceDetail) {
      let result;
      result = CommonUtility.getBalanceDetailsTemplate
         (this.accountType, balanceDetail.investmentAccountType, this.isOverDraft, this.containerName);
      switch (this.accountType) {
         case Constants.VariableValues.accountTypes.treasuryInvestmentAccountType.code:
            this.changeLabel = { label: [this.totalInterestPaid, this.labels.fieldLabels.interestPaidToDateKey] };
            break;
         case Constants.VariableValues.accountTypes.mfcvafLoanAccountType.code:
            this.changeLabel = { label: [this.paymentDueDate, this.labels.fieldLabels.balloonPaymentDueDateKey] };
            break;
         case Constants.VariableValues.accountTypes.investmentAccountType.code:
            switch (balanceDetail.investmentAccountType) {
               case this.investmentType.fixedInv:
                  this.changeLabel = { label: [this.payOutDate, this.labels.fieldLabels.maturityDateKey] };
                  break;
               case this.investmentType.linkedInv:
                  this.changeLabel = { label: [this.payOutDate, this.labels.fieldLabels.maturityDateKey] };
            }
      }
      this.toShowPropertiesOnView = result.templateDetails;
      this.propertyToApplyFilter = result.filterToBeApplied;
      this.propertyLabels = result.propertyLabels;
   }

   /* To navigate Overdraft screen once user click on Manage link which is available in View-More balances screen */
   onOverdraftClick() {
      const selectMODGAEvent = GAEvents.manageOverdraft.select;
      this.sendEvent(selectMODGAEvent.eventAction, selectMODGAEvent.label, null, selectMODGAEvent.category);
      this.router.navigateByUrl(encodeURI(this.overdraftRouteUrls.overdraftView + this.itemAccountId));
   }
}

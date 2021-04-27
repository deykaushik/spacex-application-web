import { GreenbacksEnrolmentService } from './../../core/services/greenbacks-enrolment.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';

import { Constants } from '../../core/utils/constants';
import { AccountService } from '../account.service';
import { environment } from '../../../environments/environment';

import { IDashboardAccounts, IRefreshAccountsApiResult, IRenameAccount } from '../../core/services/models';
import { accountData } from './../../core/data/skeleton-data';
import { CommonUtility } from '../../core/utils/common';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';

@Component({
   selector: 'app-accounts',
   templateUrl: './accounts.component.html',
   styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, AfterViewInit {
   accountContainers: IDashboardAccounts[];
   labels = Constants.labels;
   // flag for toggle functionality of new product - rewards
   showRewardsFeature = environment.features.rewardsFeature;
   canEnrolGreenbacks = environment.features.greenbackEnrolment;
   showPreApprovedOffers = environment.features.preApprovedOffers;
   skeletonMode: Boolean = true;

   constructor(private accountService: AccountService,
      private greenbacksEnrolmentService: GreenbacksEnrolmentService, private cd: ChangeDetectorRef,
      private preApprovedOffersService: PreApprovedOffersService) {
   }

   ngOnInit() {
      // clear cache accounts data in service
      this.accountService.resetDashboardAccountsData();
      this.accountService.accountsRefreshObservable.subscribe(
         value => {
            this.getAccountData();
         });
      this.accountContainers = accountData;
      this.getAccountData();
   }
   ngAfterViewInit() {
      this.cd.detectChanges();
   }
   getAccountData() {
      this.accountService.getDashboardAccounts().subscribe((accountContainers: IDashboardAccounts[]) => {
         // if rewards feature is turend off, filter other accounts/containers else keep the accountContainers as it is
         const accountslist = this.showRewardsFeature ? accountContainers :
            accountContainers.filter(acc => acc.ContainerName !== Constants.labels.dashboardRewardsAccountTitle);
         this.skeletonMode = false;
         // cache accounts data in service
         this.accountService.setDashboardAccountsData(accountslist);
         if (this.showRewardsFeature && this.canEnrolGreenbacks) {
            this.accountContainers = this.greenbacksEnrolmentService
               .updateForEnrolmentToGreenbacks(accountslist.slice());
         } else {
            this.accountContainers = accountslist;
         }
         if (this.showPreApprovedOffers) {
            this.accountContainers = this.preApprovedOffersService.updateForPreApproveOffers(accountslist);
         }
      });
   }
   /* When an investment account of an investor is updated,
      all the investment accounts nickname under the same investor
      should be updated as well
   */
   onAccountNameUpdate(renameAccount: IRenameAccount) {
      if (renameAccount) {
         this.accountContainers.forEach((acc) => {
            if (acc.ContainerName === Constants.VariableValues.accountContainers.investment) {
               acc.Accounts.forEach((account) => {
                  if (CommonUtility.getInvestorNumber(renameAccount.AccountNumber)
                     === CommonUtility.getInvestorNumber(account.AccountNumber.toString())) {
                     account.AccountName = renameAccount.AccountNickName;
                  }
               });
            }
         });
      }
   }
}

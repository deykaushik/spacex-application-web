import { Component, OnInit, Input, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { AccountService } from '../account.service';
import { BaseComponent } from '../../core/components/base/base.component';
import { CommonUtility } from './../../core/utils/common';
import { Constants } from '../../core/utils/constants';
import {
   IClientDetails, ISharedAccount, IApiResponse, IUniversalBranchCode,
   IAccountBalanceDetail, IDashboardAccount, IClientAccountDetail
} from '../../core/services/models';
import { GAEvents } from './../../core/utils/ga-event';

@Component({
   selector: 'app-account-share',
   templateUrl: './account-share.component.html',
   styleUrls: ['./account-share.component.scss']
})
export class AccountShareComponent extends BaseComponent implements OnInit {

   @Input() accountNumber: string;
   @Input() accountType: string;
   @Input() accountId: number;

   isSkeletonMode: boolean;
   clientDetails: IClientDetails;
   sharedAccountDetails: ISharedAccount;
   isShareAccount: boolean;
   isOverlayView: boolean;
   labels = Constants.labels.accountShare;
   accountTypes = Constants.VariableValues.accountTypes;
   buttonText: string;

   constructor(private clientPreferences: ClientProfileDetailsService, private router: Router, injector: Injector,
      private accountService: AccountService) {
      super(injector);
   }

   ngOnInit() {
      this.isSkeletonMode = true;
      this.getShareAccountDetails();
      this.verifyAccountShareType(this.accountType);
   }

   /* Get the account share inforamtion */
   getShareAccountDetails() {
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      if (this.clientDetails) {
         this.sharedAccountDetails = {
            accountName: '',
            accountNumber: this.accountNumber,
            accountType: this.getAccountTypeDesc(), // Get the account type description
            branchCode: ''
         };
         this.getUniversalBranchCodeAndHolderName(); // Get the universal branch code
      }
   }

   openAccountShareModal() {
      const selectShareProofOfAccEmailGAEvent = GAEvents.shareAccount.selectShareProofOfAccEmail;
      this.sendEvent(selectShareProofOfAccEmailGAEvent.eventAction, selectShareProofOfAccEmailGAEvent.label,
         null, selectShareProofOfAccEmailGAEvent.category);
      this.isOverlayView = true;
      this.buttonText = this.labels.cancelButtonText;
   }

   closeAccountShareModal() {
      const selectCancelGAEvent = GAEvents.shareAccount.selectCancel;
      this.sendEvent(selectCancelGAEvent.eventAction, selectCancelGAEvent.label,
         null, selectCancelGAEvent.category);
      this.isOverlayView = false;
      this.router.navigateByUrl(encodeURI(Constants.routeUrls.accountDetail + this.accountId));
   }

   /* Return Account Holder name
      1. Return first name and surname as Account holdeer name If both are valid
      2. Return first name only If first name is valid but not surname
      3. Return surname name only If surname name is valid but not firstname
      4. Return empty if both firstname and surname are not valid
   */
   getAccountHolderNameFromClientDetails(firstName: string, surName?: string): string {
      if ((firstName && firstName.trim().length > 0) && (surName && surName.trim().length > 0)) {
         return firstName.trim() + ' ' + surName.trim();
      } else if (firstName && firstName.trim().length > 0) {
         return firstName.trim();
      } else if (surName && surName.trim().length > 0) {
         return surName.trim();
      } else {
         return '';
      }
   }

   getAccountTypeDesc(): string {
      return CommonUtility.getAccountTypeDesc(this.accountType);
   }

   /* Get all universal branch codes and account holder name, find and update share account details branch code based on account type */
   getUniversalBranchCodeAndHolderName() {
      this.accountService.getUniversalBranchCodes().subscribe((universalBranchCodes: IUniversalBranchCode[]) => {
         const universalBranchCode = universalBranchCodes.find(ubc => ubc.accountType === this.accountType);
         if (universalBranchCode) {
            this.sharedAccountDetails.branchCode = universalBranchCode.branchCode;
         } else {
            this.sharedAccountDetails.branchCode = '';
         }
         this.getAccountHolderName(this.clientDetails.FirstName, this.clientDetails.Surname);
      });
   }

   /* This function is used to verify the business rule of account share,
      that is account type is not CASA, Home Loan or Personal loan
      then account share function must not appear. */
   verifyAccountShareType(accountType) {
      switch (accountType) {
         case this.accountTypes.currentAccountType.code:
         case this.accountTypes.savingAccountType.code:
         case this.accountTypes.homeLoanAccountType.code:
         case this.accountTypes.personalLoanAccountType.code:
            this.isShareAccount = true;
            break;
         default:
            this.isShareAccount = false;
      }
   }

   /* Find the account holder name */
   getAccountHolderName(firstName: string, surName?: string) {
      switch (this.accountType) {
         case this.accountTypes.currentAccountType.code:
         case this.accountTypes.savingAccountType.code:
         case this.accountTypes.personalLoanAccountType.code:
            if (this.accountService.isPrimaryAccount()) {
               this.sharedAccountDetails.accountName = this.getAccountHolderNameFromClientDetails(firstName, surName);
               this.isSkeletonMode = false;
            } else {
               if (this.accountType === this.accountTypes.personalLoanAccountType.code) {
                  this.getAccountHolderNameFromBalanceDetails();
               } else {
                  this.getAccountHolderNameFromAccountDetails();
               }
            }
            break;
         case this.accountTypes.homeLoanAccountType.code:
            this.getAccountHolderNameFromBalanceDetails();
            break;
         default:
            this.sharedAccountDetails.accountName = this.getAccountHolderNameFromClientDetails(firstName, surName);
            this.isSkeletonMode = false;
      }
   }

   getAccountHolderNameFromBalanceDetails() {
      this.accountService.getAccountBalanceDetail(this.accountId).subscribe((accountBalanceDetails: IAccountBalanceDetail) => {
         if (accountBalanceDetails && accountBalanceDetails.accountHolderName) {
            this.sharedAccountDetails.accountName = accountBalanceDetails.accountHolderName;
         } else {
            this.sharedAccountDetails.accountName = '';
         }
         this.isSkeletonMode = false;
      });
   }

   getAccountHolderNameFromAccountDetails() {
      this.accountService.getAccountDetails(this.accountId).subscribe((accountDetails: IClientAccountDetail) => {
         if (accountDetails && accountDetails.AccountHolderName) {
            this.sharedAccountDetails.accountName = accountDetails.AccountHolderName;
         } else {
            this.sharedAccountDetails.accountName = '';
         }
         this.isSkeletonMode = false;
      });
   }

   /* This method used to change overlay button text */
   onStatus(isStatus: boolean) {
      this.buttonText = isStatus ? this.labels.closeButtonText : this.labels.cancelButtonText;
   }

}

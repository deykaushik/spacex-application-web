import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { LoaderService } from '../../core/services/loader.service';
import { ILoanDebitOrderDetails, ITermsAndConditions } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { GAEvents } from '../../core/utils/ga-event';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
   selector: 'app-manage-payment-details',
   templateUrl: './manage-payment-details.component.html',
   styleUrls: ['./manage-payment-details.component.scss']
})
export class ManagePaymentDetailsComponent extends BaseComponent implements OnInit {
   showTermsView: string;
   accountId: string;
   loanDebitOrder: ILoanDebitOrderDetails[] | string;
   labels = Constants.labels.loanDebitOrder;
   showDetails = false;
   showList = true;
   loanAccountType: string;
   messages = Constants.messages.loanDebitOrder;
   isClosedLoan = false;
   loanDetails: ILoanDebitOrderDetails | string;
   dateFormat = Constants.formats.ddMMMyyyy;
   loanType: string;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   loanDebitOrderCopy = [];
   defaultDate = Constants.labels.account.balanceDetailLabels.defaultExpiryDate.toString();

   expiryDateFlag: boolean;
   infoMessage: string;

   constructor(private accountService: AccountService, private route: ActivatedRoute,
      private loader: LoaderService, private router: Router, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }
   ngOnInit() {
      this.loader.show();
      const selectedAccount = this.accountService.getAccountData();
      this.loanAccountType = selectedAccount && selectedAccount.AccountType ? selectedAccount.AccountType : false;
      this.getLoanDebitOrders(this.accountId);
      this.loanType = CommonUtility.isMfcvafLoan(this.loanAccountType) ?
         this.labels.mfcName : (CommonUtility.isHomeLoan(this.loanAccountType) ? this.labels.homeLoan : this.labels.personalLoan);
   }
   getLoanDebitOrders(accountId) {
      const metadataKeys = Constants.metadataKeys;
      const statusType = CommonUtility.isMfcvafLoan(this.loanAccountType) ? metadataKeys.dealInfoEnq :
         metadataKeys.debitOrderEnquiry;
      // assign skeleton data till actual data comes from service
      this.accountService.getLoanDebitOrders(accountId, statusType).subscribe((data) => {
         if (data === Constants.statusCode.errorCodeR02) {
            this.isClosedLoan = true;
         } else {
            if (data.length) {
               this.showList = true;
               this.loanDebitOrder = data;
               this.loader.hide();
               this.infoMessage = data.length > 1 ? this.messages.infoMessage : '';
               this.checkExpiry();
            }
         }
      });
   }
   checkExpiry() {
      if (this.loanDebitOrder && this.loanDebitOrder.length) {
         const loanDebitOrderOriginal = Object.assign([], this.loanDebitOrder);
         loanDebitOrderOriginal.forEach(loanDebitorder => {
            if (loanDebitorder.expiryDate && new Date(loanDebitorder.expiryDate).toString() === this.defaultDate) {
               loanDebitorder.expiryDate = '';
            }
            this.loanDebitOrderCopy.push(loanDebitorder);
         }
         );
      }
   }

   // navigate from terms view to details view
   goToPreviousPage() {
      if (this.showDetails) {
         this.showDetails = false;
         this.showList = true;
         const mfcDropOffDetails = Object.assign({}, GAEvents.managePaymentDetails.mfcPaymentDropOff);
         this.sendEvent(mfcDropOffDetails.eventAction, mfcDropOffDetails.label, null, mfcDropOffDetails.category);
      } else {
         this.router.navigateByUrl(encodeURI(Constants.routeUrls.accountDetail + this.accountId));
      }
   }

   showLoanDetails(index: number) {
      this.showDetails = true;
      this.showList = false;
      this.loanDetails = Object.assign({}, this.loanDebitOrder[index]);
      if (CommonUtility.isHomeLoan(this.loanAccountType)) {
         const personalLoanDetails = Object.assign({}, GAEvents.managePaymentDetails.personalLoanDetails);
         this.sendEvent(personalLoanDetails.eventAction, personalLoanDetails.label, null, personalLoanDetails.category);
      }
      if (CommonUtility.isPersonalLoan(this.loanAccountType)) {
         const homeLoanDetails = Object.assign({}, GAEvents.managePaymentDetails.homeLoanDetails);
         this.sendEvent(homeLoanDetails.eventAction, homeLoanDetails.label, null, homeLoanDetails.category);
      }
   }
}

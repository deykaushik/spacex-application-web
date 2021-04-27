import { Component, OnInit, Input, Injector, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { IResultStatus } from './../../../core/services/models';
import { BaseComponent } from '../../../core/components/base/base.component';

import { IUnitTrustsBuy } from './../unit-trusts.models';
import { UnitTrustsService } from './../unit-trusts.service';

/**
 * Unit trusts status component is responsible for notifying user about the
 * status of the transaction, show information about transaction and also has
 * feature for retry if the transaction fails for a specified number of times.
 *
 * @export
 * @class UnitTrustsStatusComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
   selector: 'app-unit-trusts-status',
   templateUrl: './unit-trusts-status.component.html',
   styleUrls: ['./unit-trusts-status.component.scss']
})
export class UnitTrustsStatusComponent extends BaseComponent implements OnInit, OnDestroy {
   /** Heading text shown in screen, update based on sucess/failure case. */
   public heading: string;
   /** Flag to whether transaction is successful or not. */
   public successful: boolean;
   /** Reference to labels decleared in constants. */
   public labels = Constants.labels;
   /** Flag for disabling retry button. */
   public disableRetryButton = false;
   /** Flag for notifyig pending request. */
   public requestInprogress = false;
   /** Flag for setting button loading state. */
   public isButtonLoader: boolean;
   /** Unit trusts byModel reference. */
   public buyVm: IUnitTrustsBuy;
   /** Error message shown at screen bottom. */
   public errorMessage: String;
   /** To account list text seperate by commas. */
   public accountList: string;
   /** Date formatter config. */
   public dateFormat: string = Constants.formats.ddMMMMyyyy;
   /** Currency formatter config. */
   public amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   /** Counter for payment retry. */
   private paymentRetryTimes = 1;

   /**
    * Creates an instance of UnitTrustsStatusComponent.
    * @param {Router} router
    * @param {UnitTrustsService} unitTrustsService
    * @memberof UnitTrustsStatusComponent
    */
   constructor(
      private router: Router, injector: Injector,
      private unitTrustsService: UnitTrustsService
   ) {
      super(injector);
   }

   /**
    * Update screen based on payment status and also add check for the
    * redirection if user directly naviate to status screen.
    *
    * @memberof UnitTrustsStatusComponent
    */
   ngOnInit() {
      CommonUtility.removePrintHeaderFooter();
      if (this.unitTrustsService.isStatusNavigationAllowed()) {
         this.buyVm = this.unitTrustsService.getBuyVm();
         const accounts = [];
         this.buyVm.toAccounts.forEach(account => {
            if (account.productCostRands > 0) {
               accounts.push(account.productPropertyList[1].propertyValue);
            }
         });
         this.accountList = accounts.join(', ');
         this.setTransactionSuccess(this.unitTrustsService.transactionStatus);
      } else {
         this.router.navigateByUrl(Constants.routeUrls.unitTrusts);
      }
   }

   /**
    * Navigate user to the unit trusts flow start and also
    * reset the model decleared in flow.
    *
    * @memberof UnitTrustsStatusComponent
    */
   newPurchase() {
      this.unitTrustsService.resetBuyModel();
      this.router.navigateByUrl(Constants.routeUrls.unitTrusts);
   }

   /**
    * Navigate user to the dashboard screen.
    *
    * @memberof UnitTrustsStatusComponent
    */
   navigateToDashboard() {
      this.unitTrustsService.resetBuyModel();
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   /**
    * Retry the payment for the specified number of time[decleared in constants]
    * and raise error if API call fails[status other than 200] and tried maxmimum
    * number of times without success.
    *
    * Show success screen if payment is successful in any attempt.
    *
    * @memberof UnitTrustsStatusComponent
    */
   retryPayment() {
      if (this.paymentRetryTimes <= Constants.VariableValues.maximumPaymentAttempts) {
         this.paymentRetryTimes++;
         this.requestInprogress = true;
         this.isButtonLoader = true;
         this.unitTrustsService.redemRewards(true).subscribe(res => {
            this.setTransactionSuccess(res);
            this.requestInprogress = false;
            this.isButtonLoader = false;
         }, err => {
            this.raiseSystemError();
         });
      } else {
         this.raiseSystemError();
      }
   }

   /**
    * Reset the page printing parts and model on destroy.
    *
    * @memberof UnitTrustsStatusComponent
    */
   ngOnDestroy() {
      CommonUtility.addPrintHeaderFooter();
      this.unitTrustsService.resetBuyModel();
   }

   /**
    * Set the transaction success/failure state, heading and
    * footer bar updated on the state of success.
    *
    * @private
    * @param {IResultStatus} result
    * @memberof UnitTrustsStatusComponent
    */
   private setTransactionSuccess(result: IResultStatus) {
      this.successful = result.isValid;
      if (this.successful) {
         this.sendEvent('gb_redeem_unit_trust');
         this.heading = Constants.labels.transactionSuccess;
         this.errorMessage = '';
      } else {
         this.heading = Constants.labels.transactionFailed;
         this.errorMessage = result.reason;
      }
   }

   /**
    * Raise the error at system level, shown near header part of app.
    * Also reset the loading state.
    *
    * @private
    * @memberof UnitTrustsStatusComponent
    */
   private raiseSystemError() {
      this.requestInprogress = false;
      this.isButtonLoader = false;
      this.disableRetryButton = true;
      this.errorMessage = this.labels.purchaseRetryMessage;
      this.unitTrustsService.raiseSystemError(true);
   }
}

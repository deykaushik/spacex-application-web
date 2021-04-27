import { Component, OnInit, Input, Injector, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { IResultStatus } from './../../../core/services/models';
import { BaseComponent } from '../../../core/components/base/base.component';
import { IChargesAndFeesPay } from './../charges-and-fees.models';
import { ChargesAndFeesService } from '../charges-and-fees.service';


@Component({
   selector: 'app-chrages-and-fees-status',
   templateUrl: './charges-and-fees-status.component.html',
   styleUrls: ['./charges-and-fees-status.component.scss']
})
export class ChargesAndFeesStatusComponent extends BaseComponent implements OnInit, OnDestroy {

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
   /** Fee and charges byModel reference. */
   public payVm: IChargesAndFeesPay;
   /** Error message shown at screen bottom. */
   public errorMessage: String;
   /** To account list text seperate by commas. */
   public accountList: string;
   /** Date formatter config. */
   public dateFormat: string = Constants.formats.ddMMYYYY;
   /** Currency formatter config. */
   public amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   /** Counter for payment retry. */
   private paymentRetryTimes = 1;

   /**
    * Creates an instance of ChargesAndFeesStatusComponent.
    * @param {Router} router
    * @param {chargesAndFeesService} chargesAndFeesService
    * @memberof ChargesAndFeesStatusComponent
    */
   constructor(
      private router: Router, injector: Injector,
      private chargesAndFeesService: ChargesAndFeesService
   ) {
      super(injector);
   }

   /**
    * Update screen based on payment status and also add check for the
    * redirection if user directly naviate to status screen.
    *
    * @memberof ChargesAndFeesStatusComponent
    */
   ngOnInit() {

      CommonUtility.removePrintHeaderFooter();
      if (this.chargesAndFeesService.isStatusNavigationAllowed()) {
         this.payVm = this.chargesAndFeesService.getPayVm();
         this.setTransactionSuccess(this.chargesAndFeesService.transactionStatus);
      } else {
         this.router.navigateByUrl(Constants.routeUrls.chargesAndFees);
      }
   }
   /**
    * Navigate user to the fee and charges flow start and also
    * reset the model decleared in flow.
    *
    * @memberof ChargesAndFeesStatusComponent
    */
    newRedeem() {
      this.chargesAndFeesService.resetPayModel();
      this.router.navigateByUrl(Constants.routeUrls.chargesAndFees);
   }

   /**
    * Navigate user to the dashboard screen.
    *
    * @memberof ChargesAndFeesStatusComponent
    */
   navigateToDashboard() {
      this.chargesAndFeesService.resetPayModel();
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   /**
    * Retry the payment for the specified number of time[decleared in constants]
    * and raise error if API call fails[status other than 200] and tried maxmimum
    * number of times without success.
    *
    * Show success screen if payment is successful in any attempt.
    *
    * @memberof ChargesAndFeesStatusComponent
    */
   retryPayment() {
      if (this.paymentRetryTimes <= Constants.VariableValues.maximumPaymentAttempts) {
         this.paymentRetryTimes++;
         this.requestInprogress = true;
         this.isButtonLoader = true;
         this.chargesAndFeesService.redemRewards(true).subscribe(res => {
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
    * @memberof ChargesAndFeesStatusComponent
    */
   ngOnDestroy() {
      CommonUtility.addPrintHeaderFooter();
      this.chargesAndFeesService.resetPayModel();
   }

   /**
    * Set the transaction success/failure state, heading and
    * footer bar updated on the state of success.
    *
    * @private
    * @param {IResultStatus} result
    * @memberof ChargesAndFeesStatusComponent
    */
   private setTransactionSuccess(result: IResultStatus) {
      this.successful = result.isValid;
      if (this.successful) {
         this.sendEvent('gb_redeem_bankcharges');
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
    * @memberof ChargesAndFeesStatusComponent
    */
   private raiseSystemError() {
      this.requestInprogress = false;
      this.isButtonLoader = false;
      this.disableRetryButton = true;
      this.errorMessage = this.labels.purchaseRetryMessage;
      this.chargesAndFeesService.raiseSystemError(true);
   }
}

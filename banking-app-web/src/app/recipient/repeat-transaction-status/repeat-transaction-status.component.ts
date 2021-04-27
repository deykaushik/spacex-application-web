import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../payment/payment.service';
import { IPaymentDetail } from '../../core/services/models';
import { IPayAmountVm, IPayToVm, IPayForVm } from '../../payment/payment.models';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-repeat-transaction-status',
   templateUrl: './repeat-transaction-status.component.html',
   styleUrls: ['./repeat-transaction-status.component.scss']
})
export class RepeatTransactionStatusComponent implements OnInit, OnDestroy {
   heading: any;
   successful: boolean;
   apiFailureMessage: string;
   paymentDetail: IPaymentDetail;
   accountNickName: any;
   payAmountVm: IPayAmountVm;
   payToVm: IPayToVm;
   payForVm: IPayForVm;
   labels = Constants.labels;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   constructor(private router: Router,
      private paymentService: PaymentService) { }

   ngOnInit() {
      this.paymentDetail = this.paymentService.getPaymentDetailInfo();
      this.payForVm = this.paymentService.getPayForVm();
      this.payToVm = this.paymentService.getPayToVm();
      this.payAmountVm = this.paymentService.getPayAmountVm();
      this.accountNickName = this.payAmountVm.selectedAccount.nickname;
      this.apiFailureMessage = this.paymentService.errorMessage;
      this.apiFailureMessage = this.paymentService.isInvalidRecipientSaved === Constants.Statuses.No
         ? Constants.labels.BenificiaryErrorMsg : this.paymentService.errorMessage;
      if (this.paymentService.getPaymentStatus()) {
         this.successful = true;
         this.paymentService.isPaymentSuccessful = true;
         this.heading = this.labels.paymentSuccess;
      } else {
         this.successful = false;
         this.heading = this.labels.paymentFailed;
         this.paymentService.isPaymentSuccessful = false;
      }
   }

   ngOnDestroy() {
      this.paymentService.clearPaymentDetails();
   }

   newPayment() {
      this.paymentService.clearPaymentDetails();
      this.router.navigateByUrl(Constants.routeUrls.payLanding);
   }
   navigateToDashboard() {
      this.paymentService.clearPaymentDetails();
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }
}

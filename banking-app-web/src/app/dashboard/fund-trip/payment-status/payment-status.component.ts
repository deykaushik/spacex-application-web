import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { IGetQuoteVm, IPaymentDetailsVm , IPaymentReviewVm} from '../fund-trip.model';
import { FundTripService } from '../fund-trip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {

   successful: boolean;
   labels = Constants.labels;
   isNoResponseReceived: boolean;
   heading: string;
   paymentDate: string;
   getQuoteVm: IGetQuoteVm;
   paymentDetailsVm: IPaymentDetailsVm;
   paymentReviewVm: IPaymentReviewVm;
   refId: string;
   errorMessage: string;
   dateFormat: string = Constants.formats.ddMMMMyyyy;
   amountPipeConfig  = Constants.amountPipeSettings.amountWithPrefix;
  constructor(private fundTripService: FundTripService, private router: Router) { }

  ngOnInit() {
      this.getQuoteVm = this.fundTripService.getGetQuoteVm();
      this.paymentDetailsVm = this.fundTripService.getPaymentDetailsVm();
      this.paymentReviewVm = this.fundTripService.getPaymentReviewVm();
      this.refId = this.paymentReviewVm.transactionReference;
      this.paymentDate = this.paymentReviewVm.transferDate;
      this.successful = true;
      this.isNoResponseReceived = false;
      this.heading = 'Payment successful';
  }

  navigateToTrips() {
      this.router.navigate(['dashboard/account/detail/trip/' + this.getQuoteVm.clientDetails.fromAccount.ItemAccountId]);
   }


}

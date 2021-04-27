import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { FundTripService } from '../fund-trip.service';
import { IGetQuoteVm, IPaymentDetailsVm , IPaymentReviewVm} from '../fund-trip.model';
import { Router } from '@angular/router';
import { ITermsAndConditions } from '../../../core/services/models';
import * as Pako from 'pako';
import { CommonUtility } from '../../../core/utils/common';


@Component({
  selector: 'app-review-payment',
  templateUrl: './review-payment.component.html',
  styleUrls: ['./review-payment.component.scss']
})
export class ReviewPaymentComponent implements OnInit {

   @Output() isComponentValid = new EventEmitter<boolean>();
   labels = Constants.labels;
   routerUrls = Constants.routeUrls;
   getQuoteVm: IGetQuoteVm;
   paymentDetailsVm: IPaymentDetailsVm;
   paymentReviewVm: IPaymentReviewVm;
   tnc: boolean;
   tncSarb: boolean;
   tncPDF: boolean;
   showSARBTerms: boolean;
   paymentDate: Date;
   buyError: string;
   dateFormat: string = Constants.formats.ddMMMMyyyy;
   @Output() isButtonLoader = new EventEmitter<boolean>();
   amountPipeConfig  = Constants.amountPipeSettings.amountWithPrefix;
   noticeContent: ITermsAndConditions;
   noticeFormat: string;
   noticeDetails: string;
   print = CommonUtility.print.bind(CommonUtility);

  constructor(private fundTripService: FundTripService, private router: Router) { }

  ngOnInit() {
   this.getQuoteVm = this.fundTripService.getGetQuoteVm();
   this.paymentDetailsVm = this.fundTripService.getPaymentDetailsVm();
   this.paymentReviewVm = this.fundTripService.getPaymentReviewVm();
   this.paymentDate = new Date();
   this.showSARBTerms = false;
   this.validate();
   this.fundTripService.getSarbTnc(this.labels.loadTripLabels.tncLatestLabel).subscribe(response => {
      if (response && response.noticeDetails) {
         this.setTncDescription(response);
      } else {
         this.fundTripService.getSarbTnc(this.labels.loadTripLabels.tncAcceptedLabel).subscribe(tncResponse => {
            this.setTncDescription(tncResponse);
         });
      }
   });
  }

  setTncDescription(data: ITermsAndConditions) {
   this.noticeContent = data;
   const decoded = atob(data.noticeDetails.noticeContent);
   this.noticeDetails = this.bytesToString(Pako.inflateRaw(decoded));
   this.noticeDetails = CommonUtility.convertTncToHtml(this.noticeDetails);
  }

  onClickSarbLink() {
   this.showSARBTerms = !this.showSARBTerms;
  }

  bytesToString(arr): string {
   let str = '';
   for (let i = 0; i < arr.length; i++) {
      str += String.fromCharCode(arr[i]);
   }
   return str;
}

  fundTrip() {
   this.isButtonLoader.emit(true);
   const fundTripData = {
      quotationReference: this.getQuoteVm.quotationReference,
      settlementAccount: {
        accountIdentifier: this.paymentDetailsVm.toAccount.accountNumber,
        accountType: this.paymentDetailsVm.toAccount.accountType
      },
      clientContactDetails: {
       firstName: '',
        lastName: '',
        phoneNumber: {
           phoneNumber: '+' + this.getQuoteVm && this.getQuoteVm.clientDetails && this.getQuoteVm.clientDetails.areaCode ?
           this.getQuoteVm.clientDetails.areaCode : '' + this.getQuoteVm.clientDetails.phoneNumber
       },
        eMail: this.getQuoteVm.clientDetails.email
      },
      senderReference: this.paymentDetailsVm.reference
    };
   this.fundTripService.fundTrip(fundTripData, this.getQuoteVm.clientDetails.fromAccount.AccountNumber).subscribe(response => {
      this.fundTripService.savePaymentReviewInfo(response);
      this.isButtonLoader.emit(false);
      this.router.navigateByUrl('/dashboard/fundtrip/status');
   }, (error) => {
      this.isButtonLoader.emit(false);
   });
  }
  nextClick() {
   this.fundTrip();
  }

  getConcatenatedAddress() {
   return `${this.getQuoteVm.clientDetails.floor ? this.getQuoteVm.clientDetails.floor + ',' : ''}
    ${this.getQuoteVm.clientDetails.building ? this.getQuoteVm.clientDetails.building + ',' : ''}
    ${this.getQuoteVm.clientDetails.streetNumber ? this.getQuoteVm.clientDetails.streetNumber + ',' : ''}
   ${this.getQuoteVm.clientDetails.streetName ? this.getQuoteVm.clientDetails.streetName + ',' : ''}
   ${this.getQuoteVm.clientDetails.suburb ? this.getQuoteVm.clientDetails.suburb + ',' : ''}
   ${this.getQuoteVm.clientDetails.city ? this.getQuoteVm.clientDetails.city + ',' : ''}
   ${this.getQuoteVm.clientDetails.postalCode}`;
  }

  validate() {
     let isValid = false;
     isValid = ((this.tnc && this.tncSarb) && this.tncPDF);
     this.isComponentValid.emit(isValid);
  }
}

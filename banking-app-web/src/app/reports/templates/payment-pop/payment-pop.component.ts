import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { IReportComponent } from '../../../core/services/models';

@Component({
   templateUrl: './payment-pop.component.html',
   styleUrls: ['./payment-pop.component.scss']
})
export class PaymentPopComponent implements OnInit, IReportComponent {

   reportData: any; /* input param for accepting data from service */
   isCrossBorderPayment: boolean;
   isAccountPayment: boolean;
   isMobilePayment: boolean;
   isCreditCardPayment: boolean;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   defaultCurrency = Constants.defaultCrossPlatformCurrency.name;
   constructor() { }

   ngOnInit() {
      this.isCrossBorderPayment = this.reportData.payToVm.isCrossBorderPaymentActive;
      this.isAccountPayment = this.reportData.isAccountPayment;
      this.isMobilePayment = this.reportData.isMobilePayment;
      this.isCreditCardPayment = !this.isAccountPayment && !this.isMobilePayment && !this.isCrossBorderPayment;
   }

}

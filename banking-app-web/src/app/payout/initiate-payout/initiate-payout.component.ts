import { Constants } from './../../core/utils/constants';
import { Component, ViewChild, Injector, OnInit } from '@angular/core';
import { PayoutService } from '../payout.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../core/components/base/base.component';
import { GAEvents } from '../../core/utils/ga-event';

@Component({
   selector: 'app-initiate-payout',
   templateUrl: 'initiate-payout.component.html',
   styleUrls: ['initiate-payout.component.scss']
})

export class InitiatePayoutComponent extends BaseComponent implements OnInit {
   initiatePaymentLabels = Constants.labels.buildingLoan.initiatePayment;
   initiatePaymentMessages = Constants.messages.buildingLoan.initiatePayment;
   accountId: string;
   routeUrls = Constants.routeUrls;
   constructor(private router: Router, private route: ActivatedRoute, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }
   ngOnInit() {
      const paymentRequestInitiated = GAEvents.requestPaymentAction.paymentRequestInitiated;
      this.sendEvent(paymentRequestInitiated.eventAction, paymentRequestInitiated.label, null, paymentRequestInitiated.category);
   }
   getStarted() {
      this.router.navigateByUrl(this.routeUrls.payout + this.accountId);
   }
   exitAction() {
      this.router.navigateByUrl(this.routeUrls.accountDetail + this.accountId);
      const getStartedPageExit = GAEvents.requestPaymentAction.getStartedPageExit;
      this.sendEvent(getStartedPageExit.eventAction, getStartedPageExit.label, null, getStartedPageExit.category);
   }
}

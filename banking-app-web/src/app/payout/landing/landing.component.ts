import { Component, OnInit, Injector } from '@angular/core';
import { AddStepItem } from './../../shared/components/stepper-work-flow/add-step-item';
import { IStep } from './../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from './../../core/utils/constants';
import { WorkflowService } from './../../core/services/stepper-work-flow-service';
import { PayOutTypeComponent } from '../pay-out-type/pay-out-type.component';
import { PayOutDetailsComponent } from '../pay-out-details/pay-out-details.component';
import { ContactPersonComponent } from '../contact-person/contact-person.component';
import { BaseComponent } from '../../core/components/base/base.component';
import { SummaryComponent } from '../summary/summary.component';
import { PayoutService } from '../payout.service';
import { PaymentService } from '../../payment/payment.service';
import { AccountService } from '../../dashboard/account.service';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { ActivatedRoute } from '@angular/router';
import { IBuildingPayout } from '../payout.models';
import { GAEvents } from '../../core/utils/ga-event';

@Component({
   selector: 'app-payout',
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})

export class LandingComponent extends BaseComponent implements OnInit {
   steppers: AddStepItem[];
   footerStepper: AddStepItem[];
   navigationSteps: string[];
   exitUrl: string;
   accountId: string;
   payoutStepData: IBuildingPayout;
   requestPaymentAction = GAEvents.requestPaymentAction;

   constructor(private workflowService: WorkflowService, private payoutService: PayoutService,
      private route: ActivatedRoute, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.exitUrl = Constants.routeUrls.accountDetail + this.accountId;
      this.payoutStepData = {} as IBuildingPayout;
      this.payoutService.payoutData = this.payoutStepData;
      this.payoutStepData = this.payoutService.payoutData;
      this.payoutStepData.accountId = this.accountId;
      this.payoutService.payoutData = this.payoutStepData;
      this.navigationSteps = [];
      this.steppers = [
         new AddStepItem(PayOutTypeComponent),
         new AddStepItem(PayOutDetailsComponent),
         new AddStepItem(ContactPersonComponent),
         new AddStepItem(SummaryComponent)
      ];
      this.navigationSteps = Constants.labels.buildingLoan.steps;
      this.workflowService.workflow = [{ step: this.navigationSteps[0], valid: false, isValueChanged: false },
      { step: this.navigationSteps[1], valid: false, isValueChanged: false },
      { step: this.navigationSteps[2], valid: false, isValueChanged: false },
      { step: this.navigationSteps[3], valid: false, isValueChanged: false }];
   }
   onCurrentStepIndex(event) {
      switch (event) {
         case 1:
            this.requestPaymentAction.paymentDetailsPageExit = GAEvents.requestPaymentAction.paymentDetailsPageExit;
            this.sendEvent(this.requestPaymentAction.paymentDetailsPageExit.eventAction,
               this.requestPaymentAction.paymentDetailsPageExit.label, null,
               this.requestPaymentAction.paymentDetailsPageExit.category);
            break;
         case 3:
            this.requestPaymentAction.summaryPageExit = GAEvents.requestPaymentAction.summaryPageExit;
            this.sendEvent(this.requestPaymentAction.summaryPageExit.eventAction,
               this.requestPaymentAction.summaryPageExit.label, null,
               this.requestPaymentAction.summaryPageExit.category);
            break;
      }
   }
}

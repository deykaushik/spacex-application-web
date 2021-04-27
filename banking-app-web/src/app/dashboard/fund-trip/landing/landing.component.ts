import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { Observable } from 'rxjs/Observable';
import { GetQuoteComponent } from '../get-quote/get-quote.component';
import { PaymentDetailsComponent } from '../payment-details/payment-details.component';
import { ReviewPaymentComponent } from '../review-payment/review-payment.component';
import { IWorkflowContainerComponent, IWorkflowStep, IStepInfo, IWorkflow } from '../../../shared/components/work-flow/work-flow.models';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../core/services/loader.service';
import { FundTripService} from '../fund-trip.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

   workflowInfo: IWorkflow;
   steps: IWorkflowStep[];
   labels = Constants.labels;
   constructor(private route: ActivatedRoute, private loader: LoaderService, public fundTripService: FundTripService) { }

   ngOnInit() {
      this.fundTripService.initializeFundTripWorkflow();
      this.intializeWorkFlowSteps();
      this.workflowInfo = <IWorkflow> {
         title : 'purchase',
         cancelButtonText : Constants.VariableValues.cancelButtonText,
         cancelRouteLink : Constants.routeUrls.dashboard
       };
   }

   private intializeWorkFlowSteps() {
      this.steps = [
         {
            summary: {
               title: this.labels.fundTripLabels.getQuoteTitle,
               isNavigated: true,
               sequenceId: 1
            },
            buttons: {
               next: this.fundTripService.buyToDoneButton,
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: GetQuoteComponent
         },
         {
            summary: {
               title: this.labels.fundTripLabels.paymentDetails,
               isNavigated: true,
               sequenceId: 2
            },
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: PaymentDetailsComponent
         },
         {
            summary: {
               title: this.labels.fundTripLabels.reviewPaymentDetails,
               isNavigated: true,
               sequenceId: 3
            },
            buttons: {
               next: {
                  text: Constants.labels.fundTripLabels.payButtonText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: ReviewPaymentComponent
         }
      ];
   }

}

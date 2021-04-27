import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PayReviewComponent } from './../pay-review/pay-review.component';
import { PayAmountComponent } from './../pay-amount/pay-amount.component';
import { PayToComponent } from './../pay-to/pay-to.component';
import { PayForComponent } from './../pay-for/pay-for.component';
import { Constants } from './../../core/utils/constants';
import { PaymentService } from '../payment.service';
import { PaymentStep } from '../payment.models';
import { IPayToVm, IPayAmountVm, IPayForVm } from './../payment.models';
import { IWorkflowStep, IWorkflowContainerComponent, IStepInfo, IWorkflow } from './../../shared/components/work-flow/work-flow.models';
import { ComponentCanDeactivate } from '../../core/guards/unsaved-changes-guard.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../core/services/loader.service';


@Component({
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, IWorkflowContainerComponent, ComponentCanDeactivate, OnDestroy {
   workflowInfo: IWorkflow;
   steps: IWorkflowStep[];
   isAccountsOverlay = false;
   isAccountsLoaded = false;
   accountNumberFromDashboard?: string;
   emptyStateUrl = Constants.links.nedBankEmptyStatePage;
   constructor(public paymentService: PaymentService, private route: ActivatedRoute, private loader: LoaderService) {
      this.route.params.subscribe(params => this.accountNumberFromDashboard = params.accountnumber);
   }

   canDeactivate(): Observable<boolean> | boolean {
      return !this.paymentService.checkDirtySteps();
   }
   ngOnInit() {
      this.loader.show();
      this.paymentService.accountsDataObserver.subscribe(accounts => {
         if (accounts) {
            this.loader.hide();
            this.isAccountsLoaded = true;
            if (!accounts.length) {
               this.isAccountsOverlay = true;
            }
         }
      });
      this.paymentService.initializePaymentWorkflow();
      this.intializeWorkFlowSteps();
      this.paymentService.paymentWorkflowSteps.payAmount.model.accountFromDashboard = this.accountNumberFromDashboard;

      this.workflowInfo = <IWorkflow>{
         title: 'payment',
         cancelButtonText: Constants.VariableValues.cancelButtonText,
         cancelRouteLink: '/dashboard'
      };
   }

   nextClick(currentStep: number) {
   }

   stepClick(stepInfo: IStepInfo) {
   }
   private intializeWorkFlowSteps() {
      this.steps = [
         {
            summary: this.paymentService.getStepSummary(PaymentStep.payTo, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: PayToComponent
         },
         {
            summary: this.paymentService.getStepSummary(PaymentStep.payAmount, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: PayAmountComponent
         },
         {
            summary: this.paymentService.getStepSummary(PaymentStep.payFor, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: PayForComponent
         },
         {
            summary: this.paymentService.getStepSummary(PaymentStep.review, true),

            buttons: {
               next: {
                  text: Constants.labels.pay
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: PayReviewComponent
         }
      ];
   }
   ngOnDestroy() {
      this.paymentService.refreshAccountData();
   }
}

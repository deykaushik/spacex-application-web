import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ComponentCanDeactivate } from '../../../core/guards/unsaved-changes-guard.service';
import { Observable } from 'rxjs/Observable';
import { BuyService } from '../buy.service';
import { BuyStep } from '../buy.models';
import { BuyToComponent } from '../buy-to/buy-to.component';
import { BuyReviewComponent } from '../buy-review/buy-review.component';
import { BuyAmountComponent } from './../buy-amount/buy-amount.component';
import { BuyStatusComponent } from './../buy-status/buy-status.component';
import { Constants } from '../../../core/utils/constants';
import { BuyForComponent } from '../buy-for/buy-for.component';
import { IWorkflowContainerComponent, IWorkflowStep, IStepInfo, IWorkflow } from '../../../shared/components/work-flow/work-flow.models';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../core/services/loader.service';


@Component({
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, IWorkflowContainerComponent, ComponentCanDeactivate, OnDestroy {
   workflowInfo: IWorkflow;
   steps: IWorkflowStep[];
   isAccountsOverlay = false;
   isAccountsLoaded = false;
   emptyStateUrl = Constants.links.nedBankEmptyStatePage;
   accountNumberFromDashboard?: string;

   constructor(public buyService: BuyService, private route: ActivatedRoute, private loader: LoaderService) {
      this.route.params.subscribe(params => this.accountNumberFromDashboard = params.accountnumber);
   }

   canDeactivate(): Observable<boolean> | boolean {
      return !this.buyService.checkDirtySteps();
   }
   ngOnInit() {
      this.loader.show();
      this.buyService.accountsDataObserver.subscribe(accounts => {
         if (accounts) {
            this.loader.hide();
            this.isAccountsLoaded = true;
            if (accounts.length === 0) {
               this.isAccountsOverlay = true;
            }
         }
      });
      this.buyService.initializeBuyWorkflow();
      this.intializeWorkFlowSteps();
      this.buyService.buyWorkflowSteps.buyAmount.model.accountNumberFromDashboard = this.accountNumberFromDashboard;
      this.workflowInfo = <IWorkflow> {
         title : 'purchase',
         cancelButtonText : Constants.VariableValues.cancelButtonText,
         cancelRouteLink : '/dashboard'
       };
   }

   nextClick(currentStep: number) {
   }

   stepClick(stepInfo: IStepInfo) {
   }

   private intializeWorkFlowSteps() {
      this.steps = [
         {
            summary: this.buyService.getStepSummary(BuyStep.buyTo, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: BuyToComponent
         },
         {
            summary: this.buyService.getStepSummary(BuyStep.buyAmount, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: BuyAmountComponent
         },
         {
            summary: this.buyService.getStepSummary(BuyStep.buyFor, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: BuyForComponent
         },
         {
            summary: this.buyService.getStepSummary(BuyStep.review, true),
            buttons: {
               next: {
                  text: Constants.labels.buyLabels.buyReviewBtnText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: BuyReviewComponent
         }
      ];
   }
   ngOnDestroy() {
      this.buyService.refreshAccountData();
   }
}

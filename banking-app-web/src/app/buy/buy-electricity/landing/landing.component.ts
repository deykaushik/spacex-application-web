import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ComponentCanDeactivate } from '../../../core/guards/unsaved-changes-guard.service';
import { Observable } from 'rxjs/Observable';
import { BuyElectricityService } from '../buy-electricity.service';
import { BuyElectricityStep } from '../buy-electricity.models';
import { BuyElectricityToComponent } from '../buy-electricity-to/buy-electricity-to.component';
import { BuyElectricityReviewComponent } from '../buy-electricity-review/buy-electricity-review.component';
import { BuyElectricityAmountComponent } from './../buy-electricity-amount/buy-electricity-amount.component';
import { BuyElectricityStatusComponent } from './../buy-electricity-status/buy-electricity-status.component';
import { Constants } from '../../../core/utils/constants';
import { BuyElectricityForComponent } from '../buy-electricity-for/buy-electricity-for.component';
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
   constructor(public buyService: BuyElectricityService, private route: ActivatedRoute, private loader: LoaderService) {
      this.route.params.subscribe(params => this.accountNumberFromDashboard = params.accountnumber);
   }

   canDeactivate(): Observable<boolean> | boolean {
      return !this.buyService.checkDirtySteps();
   }
   ngOnInit() {
      this.loader.show();
      this.buyService.accountsDataObserver.subscribe(accounts => {
         if (accounts) {
            this.isAccountsLoaded = true;
            this.loader.hide();
            if (accounts.length === 0) {
               this.isAccountsOverlay = true;
            }
         }
      });
      this.buyService.initializeBuyElectricityWorkflow();
      this.intializeWorkFlowSteps();
      this.buyService.electricityWorkflowSteps.buyAmount.model.accountNumberFromDashboard = this.accountNumberFromDashboard;
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
            summary: this.buyService.getStepSummary(BuyElectricityStep.buyTo, true),
            buttons: {
               next: this.buyService.buyToNextButton,
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: BuyElectricityToComponent
         },
         {
            summary: this.buyService.getStepSummary(BuyElectricityStep.buyAmount, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: BuyElectricityAmountComponent
         },
         {
            summary: this.buyService.getStepSummary(BuyElectricityStep.buyFor, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: BuyElectricityForComponent
         },
         {
            summary: this.buyService.getStepSummary(BuyElectricityStep.review, true),
            buttons: {
               next: {
                  text: Constants.labels.buyLabels.buyReviewBtnText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: BuyElectricityReviewComponent
         }
      ];
   }
   ngOnDestroy() {
      this.buyService.refreshAccountData();
   }
}

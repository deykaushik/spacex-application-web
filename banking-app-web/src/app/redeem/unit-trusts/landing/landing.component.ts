import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../../core/utils/constants';
import { LoaderService } from '../../../core/services/loader.service';
import { ComponentCanDeactivate } from '../../../core/guards/unsaved-changes-guard.service';
import { IWorkflowContainerComponent, IWorkflowStep, IStepInfo, IWorkflow } from '../../../shared/components/work-flow/work-flow.models';

import { UnitTrustsStep } from './../unit-trusts.models';
import { UnitTrustsService } from './../unit-trusts.service';
import { UnitTrustsBuyComponent } from './../unit-trusts-buy/unit-trusts-buy.component';
import { UnitTrustsReviewComponent } from './../unit-trusts-review/unit-trusts-review.component';

/**
 * Main component which is initiate unit trusts flow, act as
 * the container for the workflow and empty state which is shown
 * when there is no account to buy unit trusts.
 *
 * @export
 * @class LandingComponent
 * @implements {OnInit}
 * @implements {ComponentCanDeactivate}
 * @implements {OnDestroy}
 */
@Component({
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements
   OnInit, ComponentCanDeactivate, OnDestroy {
   /** Work flow info object to add information to header part. */
   public workflowInfo: IWorkflow;
   /** Work flow steps array to specify the available steps. */
   public steps: IWorkflowStep[];
   /** Whether to show account overlay stating the appropriate message or start the flow. */
   public isAccountsOverlay = false;
   /** URL to be shown on account overlay. */
   public emptyStateUrl = Constants.links.nedBankEmptyStatePage;
   /** Whether account is opened from the Dashboard or not. */
   public accountNumberFromDashboard?: string;

   /**
    * Creates an instance of LandingComponent.
    * @param {UnitTrustsService} unitTrustsService
    * @param {ActivatedRoute} route
    * @param {LoaderService} loader
    * @memberof LandingComponent
    */
   constructor(
      public unitTrustsService: UnitTrustsService,
      private route: ActivatedRoute,
      private loader: LoaderService
   ) {
      this.route.params.subscribe(params => this.accountNumberFromDashboard = params.accountnumber);
   }

   /**
    * Router guard for checking any unsaved changes before navigation
    * away from the unit trusts flow.
    *
    * @returns {(Observable<boolean> | boolean)}
    * @memberof LandingComponent
    */
   canDeactivate(): Observable<boolean> | boolean {
      return !this.unitTrustsService.checkDirtySteps();
   }

   /**
    * Responsible for fetching API data, iniitalize workflow and setting
    * it's info model on component load.
    *
    * @memberof LandingComponent
    */
   ngOnInit() {
      this.loader.show();
      this.unitTrustsService.accountsDataObserver.subscribe(res => {
         if (res && res.length === 0) {
            this.isAccountsOverlay = true;
         }
         this.loader.hide();
      });
      this.unitTrustsService.initializeUnitTrustsBuyWorkflow();
      this.intializeWorkFlowSteps();
      this.unitTrustsService.unitTrustsWorkFlowSteps.buy.model.accountNumberFromDashboard = this.accountNumberFromDashboard;
      this.workflowInfo = <IWorkflow> {
         title : Constants.labels.headingRedemption,
         cancelButtonText : Constants.VariableValues.cancelButtonText,
         cancelRouteLink : Constants.routeUrls.dashboard
      };
   }

   /**
    * Refresh account on navigation away from unit trusts flow.
    *
    * @memberof LandingComponent
    */
   ngOnDestroy() {
      this.unitTrustsService.refreshAccounts();
   }

   /** Work flow method to validate next click. */
   nextClick(currentStep: number) {
   }

   /** Work flow method to validate step click. */
   stepClick(stepInfo: IStepInfo) {
   }

   /**
    * Initializes the work flow steps by setting up the summaries,
    * button and components to be shown in variuos steps.
    *
    * @private
    * @memberof LandingComponent
    */
   private intializeWorkFlowSteps() {
      this.steps = [
         {
            summary: this.unitTrustsService.getStepSummary(UnitTrustsStep.buy, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: UnitTrustsBuyComponent
         },
         {
            summary: this.unitTrustsService.getStepSummary(UnitTrustsStep.review, false),
            buttons: {
               next: {
                  text: Constants.labels.fbeRedeem
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: UnitTrustsReviewComponent
         }
      ];
   }
}

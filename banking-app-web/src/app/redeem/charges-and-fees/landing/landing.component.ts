import { OnInit, OnDestroy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ComponentCanDeactivate } from '../../../core/guards/unsaved-changes-guard.service';
import { IWorkflow, IWorkflowStep, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { Constants } from '../../../core/utils/constants';
import { ChargesAndFeesService } from '../charges-and-fees.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../core/services/loader.service';
import { ChargesAndFeesReviewComponent } from '../charges-and-fees-review/charges-and-fees-review.component';
import { ChargesAndFeesPayComponent } from '../charges-and-fees-pay/charges-and-fees-pay.component';
import { ChargesAndFeesStep } from '../charges-and-fees.models';

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
    /** Label for URL on account overlay */
    public urlLabel = Constants.labels.chargesAndFees;
   /** Whether account is opened from the Dashboard or not. */
   public accountNumberFromDashboard?: string;

   private accountItemId: string;

   constructor(
      public chargesAndFeesService: ChargesAndFeesService,
      private route: ActivatedRoute,
      private loader: LoaderService,
      private router: Router
   ) {
       this.route.params.subscribe(params => this.accountNumberFromDashboard = params.accountnumber);
   }

   /**
    * Router guard for checking any unsaved changes before navigation
    * away from the charges and fees flow.
    *
    * @returns {(Observable<boolean> | boolean)}
    * @memberof LandingComponent
    */
   canDeactivate(): Observable<boolean> | boolean {
      return !this.chargesAndFeesService.checkDirtySteps();
   }

   /**
    * Responsible for fetching API data, iniitalize workflow and setting
    * it's info model on component load.
    *
    * @memberof LandingComponent
    */
   ngOnInit() {
      this.loader.show();
      this.chargesAndFeesService.accountAvailabilityObserver.subscribe((res) => {
          if (res) {
            this.isAccountsOverlay = true;
          }
      });

      this.chargesAndFeesService.rewardsAccountDataObserver.subscribe((res) => {
        if (res) {
          this.loader.hide();
          if (res.length === 0) {
            this.isAccountsOverlay = true;
          }else {
            this.accountItemId = res[0].itemAccountId;
          }
        }
      });
      this.chargesAndFeesService.initializeChargesAndFeesPayWorkflow();
      this.intializeWorkFlowSteps();
      this.workflowInfo = <IWorkflow> {
         title : Constants.labels.headingRedemption,
         cancelButtonText : Constants.VariableValues.cancelButtonText,
         cancelRouteLink : Constants.routeUrls.dashboard
      };
   }

   /**
    * Refresh account on navigation away from charges and fees flow.
    *
    * @memberof LandingComponent
    */
   ngOnDestroy() {
      this.chargesAndFeesService.refreshAccounts();
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
            summary: this.chargesAndFeesService.getStepSummary(ChargesAndFeesStep.pay, true),
            buttons: {
               next: {
                  text: Constants.labels.nextText
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: ChargesAndFeesPayComponent
         },
         {
            summary: this.chargesAndFeesService.getStepSummary(ChargesAndFeesStep.review, false),
            buttons: {
               next: {
                  text: Constants.labels.fbeRedeem
               },
               edit: {
                  text: Constants.labels.editText
               }
            },
            component: ChargesAndFeesReviewComponent
         }
      ];
   }
 /** Go back to privious page */
   goBack() {
     if (this.accountItemId) {
      this.router.navigateByUrl(encodeURI('/dashboard/account/detail/' + this.accountItemId));
     }else {
      this.router.navigateByUrl(encodeURI('/dashboard'));
     }
   }
}

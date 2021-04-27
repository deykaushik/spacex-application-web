import { Component, OnInit, Output, EventEmitter, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from '../../../core/utils/constants';
import { BaseComponent } from '../../../core/components/base/base.component';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { TermsAndConditionsComponent } from './../../../shared/terms-and-conditions/terms-and-conditions.component';

import { UnitTrustsService } from './../unit-trusts.service';
import { IUnitTrustsBuy } from './../unit-trusts.models';

/**
 * Review component for Unit Trusts by workflow, show user the summary of the
 * transaction items before actual transaction request from user.
 *
 * @export
 * @class UnitTrustsReviewComponent
 * @extends {BaseComponent}
 * @implements {OnInit}
 * @implements {IWorkflowChildComponent}
 */
@Component({
   templateUrl: './unit-trusts-review.component.html',
   styleUrls: ['./unit-trusts-review.component.scss']
})
export class UnitTrustsReviewComponent extends BaseComponent implements OnInit, IWorkflowChildComponent {
   /** Emitter for component validation used by workflow. */
   @Output() isComponentValid = new EventEmitter<boolean>();
   /** Emitter for component button loading state used by workflow. */
   @Output() isButtonLoader = new EventEmitter<boolean>();

   /** Labels used for constant and localization. */
   public labels = Constants.labels;
   /** Buy model creted in buy step of workflow. */
   public buyVm: IUnitTrustsBuy;
   /** Date formatter. */
   public dateFormat: string = Constants.formats.ddMMMMyyyy;
   /** Currency formatter. */
   public amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   /** Rewards currency formatter. */
   public amountPipeConfigRewards = Constants.amountPipeSettings.amountWithLabelAndSignRewards;

   /**
    * Creates an instance of UnitTrustsReviewComponent.
    * @param {Router} router
    * @param {Injector} injector
    * @param {UnitTrustsService} unitTrustsService
    * @memberof UnitTrustsReviewComponent
    */
   constructor(
      public router: Router, injector: Injector,
      private unitTrustsService: UnitTrustsService,
   ) {
      super(injector);
   }

   /**
    * Initialize component by setting up neccesery models and emitting events.
    *
    * @memberof UnitTrustsReviewComponent
    */
   ngOnInit() {
      this.buyVm = this.unitTrustsService.getBuyVm();
      this.isComponentValid.emit(true);
   }

   /**
    * Invoked by workflow in next button click in current steps,
    * responsible for performing action like making redemption call
    * and emitting event to workflow.
    *
    * @param {number} currentStep
    * @memberof UnitTrustsReviewComponent
    */
   nextClick(currentStep: number) {
      this.isButtonLoader.emit(true);
      this.unitTrustsService.redemRewards().subscribe(res => {
         this.router.navigateByUrl(Constants.routeUrls.unitTrustsStatus);
      }, err => {
         this.isButtonLoader.emit(false);
         this.isComponentValid.emit(false);
      });
   }

   /**
    * Invoked by workflow in step click from the header,
    * have no action for review component.
    *
    * @param {IStepInfo} stepInfo
    * @memberof UnitTrustsReviewComponent
    */
   stepClick(stepInfo: IStepInfo) {
   }
}

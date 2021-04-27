import { Component, OnInit, Output, EventEmitter, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from '../../../core/utils/constants';
import { BaseComponent } from '../../../core/components/base/base.component';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { TermsAndConditionsComponent } from './../../../shared/terms-and-conditions/terms-and-conditions.component';

import { ChargesAndFeesService } from './../charges-and-fees.service';
import { IChargesAndFeesPay } from '../charges-and-fees.models';

@Component({
   selector:  'app-charges-and-fees-review',
   templateUrl: './charges-and-fees-review.component.html',
   styleUrls: ['./charges-and-fees-review.component.scss']
})
export class ChargesAndFeesReviewComponent extends BaseComponent implements OnInit, IWorkflowChildComponent {
    /** Emitter for component validation used by workflow. */
    @Output() isComponentValid = new EventEmitter<boolean>();
    /** Emitter for component button loading state used by workflow. */
    @Output() isButtonLoader = new EventEmitter<boolean>();

    /** Labels used for constant and localization. */
    public labels = Constants.labels;
    /** redeem constants used for account type */
    public redeemProductType = Constants.VariableValues.redeemProductTypes;
    /** Buy model creted in buy step of workflow. */
    public payVm: IChargesAndFeesPay;
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
     * @param {ChargesAndFeesService} chargesAndFeesService
     * @memberof UnitTrustsReviewComponent
     */
    constructor(
       public router: Router, injector: Injector,
       private chargesAndFeesService: ChargesAndFeesService,
    ) {
       super(injector);
    }

    /**
     * Initialize component by setting up neccesery models and emitting events.
     *
     * @memberof UnitTrustsReviewComponent
     */
    ngOnInit() {
       this.payVm = this.chargesAndFeesService.getPayVm();
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
       this.chargesAndFeesService.redemRewards().subscribe(res => {
          this.router.navigateByUrl(Constants.routeUrls.chargesAndFeesStatus);
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

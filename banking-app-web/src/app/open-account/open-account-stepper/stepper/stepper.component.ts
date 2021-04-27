import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, Renderer2, Inject } from '@angular/core';
import { WorkflowService } from './../../../core/services/stepper-work-flow-service';
import { OpenAccountService } from '../../open-account.service';
import { ProductDetailsComponent } from './../product-details/product-details.component';
import { OpenNewAccountDetailsComponent } from './../open-new-account-details/open-new-account-details.component';
import { ReviewDetailsComponent } from './../review-details/review-details.component';
import { AddStepItem } from './../../../shared/components/stepper-work-flow/add-step-item';
import { IStepper } from './../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../constants';
import { DOCUMENT } from '@angular/common';
@Component({
   selector: 'app-stepper',
   templateUrl: './stepper.component.html',
   styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, OnDestroy {
   workflowSteps: IStepper[];
   steppers: AddStepItem[];
   footerStepper: AddStepItem[];
   navigationSteps: string[];
   isPopup: boolean;
   @Output() stepperback = new EventEmitter<boolean>();
   @Input() productDetails;

   constructor(private workflowService: WorkflowService,
      private openAccountService: OpenAccountService, private render: Renderer2,
      @Inject(DOCUMENT) private document: Document) { }

   ngOnInit() {

      this.steppers = [
         new AddStepItem(ProductDetailsComponent, { name: 'test', }),
         new AddStepItem(OpenNewAccountDetailsComponent, { name: 'test', productDetail: this.productDetails }),
         new AddStepItem(ReviewDetailsComponent, { name: 'test' })
      ];
      this.navigationSteps = Constants.messages.openNewAccount.steps;
      this.workflowService.setWorkflow([{ step: this.navigationSteps[0], valid: false, isValueChanged: false },
      { step: this.navigationSteps[1], valid: false, isValueChanged: false },
      { step: this.navigationSteps[2], valid: false, isValueChanged: false }]);
      setTimeout(() => {
         this.workflowSteps = this.workflowService.getWorkflow();
         this.workflowSteps[0] = { step: this.workflowSteps[0].step, valid: true, isValueChanged: false };
         this.workflowService.setWorkflow(this.workflowSteps);
         this.workflowService.stepClickEmitter.emit(this.workflowSteps[1].step);
      }, 50);
      this.openAccountService.setDepositDetails(null);
      this.openAccountService.setInterestDetails(null);
      this.openAccountService.setRecurringDetails(null);
      this.openAccountService.setRecurringEdit(null);
   }

   ngOnDestroy() {
      this.render.setStyle(this.document.body, 'overflow-y', 'auto');
   }

   setPopup(isPopup: boolean) {
     this.isPopup = isPopup;
   }
}

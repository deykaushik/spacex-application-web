import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { WorkflowService } from '../../../../core/services/stepper-work-flow-service';
import { IStepper } from '../../stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../../core/utils/constants';


@Component({
   selector: 'app-navigation-mobile',
   templateUrl: './stepper-nav-bar-mobile.component.html',
   styleUrls: ['./stepper-nav-bar-mobile.component.scss']
})

export class StepperMobileNavBarComponent {
   @Input() steps: string[];
   @Input() currentStep: number;
   @Output() currentStepEmitter = new EventEmitter<number>();
   @Input() showMobileNav: boolean;
   nextLabel = Constants.labels.nextText;

   constructor(private workFlowService: WorkflowService) {
   }
   mobileNextClick(stepLabel: number) {
      this.currentStepEmitter.emit(stepLabel);
   }
   showNextButton(stepIndex: number): boolean {
      const invalidStep = this.workFlowService.getFirstInvalidStep();
      if (stepIndex === invalidStep || ((stepIndex === this.workFlowService.workflow.length - 1)
         && invalidStep - stepIndex >= 0)) {
         return true;
      }
      return false;
   }
}

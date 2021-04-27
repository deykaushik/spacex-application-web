import { Constants } from './../../../../core/utils/constants';
import { Router } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WorkflowService } from './../../../../core/services/stepper-work-flow-service';

@Component({
   selector: 'app-navigation-bar',
   templateUrl: './stepper-nav-bar.component.html',
   styleUrls: ['./stepper-nav-bar.component.scss']
})

export class StepperNavBarComponent {
   @Input() currentStep: string;
   @Input() isVisible: boolean;
   @Input() steps: string[];
   @Output() clickedStep = new EventEmitter<number>();
   @Output() exit = new EventEmitter<boolean>();
   @Input() isMobile: boolean;
   @Input() alternateExitButton: boolean;
   @Input() showErrorOnInvalidSteps = false;

   constructor(private workflowService: WorkflowService, private router: Router) { }

   onStepClick(clickedStep: number) {
      this.clickedStep.emit(clickedStep);
   }
   exitStepper() {
      this.exit.emit(true);
   }
   goToDashboard() {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }
}

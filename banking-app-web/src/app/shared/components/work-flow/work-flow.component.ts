import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IWorkflowStep, IStepInfo, IWorkflowService, IWorkflow } from './work-flow.models';
import { StepDirective } from './step.directive';
import { WindowRefService } from './../../../core/services/window-ref.service';
import { CommonUtility } from './../../../core/utils/common';
import { NgForm } from '@angular/forms';
import { Constants } from '../../../core/utils/constants';
import { GaTrackingService } from '../../../core/services/ga.service';

@Component({
   selector: 'app-work-flow',
   templateUrl: './work-flow.component.html',
   styleUrls: ['./work-flow.component.scss']
})
export class WorkFlowComponent implements OnInit {
   public cancelButtonText = Constants.VariableValues.cancelButtonText;
   @Input() workFlowInfo: IWorkflow;
   @Input() steps: IWorkflowStep[];
   @Output() nextClick: EventEmitter<number> = new EventEmitter<number>();
   @Output() declineClick: EventEmitter<number> = new EventEmitter<number>();
   @Output() stepClick: EventEmitter<IStepInfo> = new EventEmitter<IStepInfo>();

   beforeSteps: IWorkflowStep[];
   afterSteps: IWorkflowStep[];
   currentStep: IWorkflowStep;
   isValid: boolean;
   isButtonLoader = false;
   componentRef;
   code: boolean;
   showTwoButtons = false;
   showNextButton = true;
   showCustomizableTwoButtons = false;
   @Input() activeStep = 1;
   @Input() workflowService: IWorkflowService;

   @ViewChild(StepDirective) stepHost: StepDirective;

   constructor(public router: Router, private componentFactoryResolver: ComponentFactoryResolver, private winRef: WindowRefService,
      @Inject(DOCUMENT) private document: Document, private gaTrackingService: GaTrackingService) {
   }

   ngOnInit() {
      this.isValid = true;
      this.loadComponent();
      this.updateStepLists();
   }

   loadComponent() {
      this.currentStep = this.steps[this.activeStep - 1];
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.currentStep.component);

      const viewContainerRef = this.stepHost.viewContainerRef;
      viewContainerRef.clear();

      this.componentRef = viewContainerRef.createComponent(componentFactory);

      // Validate child component and disable next button on validate emit from child
      if (this.componentRef.instance && this.componentRef.instance.hasOwnProperty('isComponentValid')) {
            this.isValid = false;
         this.componentRef.instance.isComponentValid.subscribe(valid => {
               this.isValid = valid;
            this.updateStepInitialSummary(this.currentStep);
         });
      }
      if (this.componentRef.instance && this.componentRef.instance.hasOwnProperty('isButtonLoader')) {
            this.isValid = false;
         this.componentRef.instance.isButtonLoader.subscribe(loading => {
            this.isButtonLoader = loading;
         });
      }
      if (this.componentRef.instance && this.componentRef.instance.hasOwnProperty('showTwoButtons')) {
         this.componentRef.instance.showTwoButtons.subscribe(value => {
            this.showTwoButtons = value;
         });
      } else {
         this.showTwoButtons = false;
      }
      if (this.componentRef.instance && this.componentRef.instance.hasOwnProperty('showCustomizableTwoButtons')) {
         this.componentRef.instance.showCustomizableTwoButtons.subscribe(value => {
            this.showCustomizableTwoButtons = value;
         });
      } else {
         this.showCustomizableTwoButtons = false;
      }
      if (this.componentRef.instance && this.componentRef.instance.hasOwnProperty('showNextButton')) {
         this.componentRef.instance.showNextButton.subscribe(value => {
            this.showNextButton = value;
         });
      } else {
         this.showNextButton = true;
      }
      this.gaTrackingService.notifySectionChange.next(this.currentStep.component.name);
   }

   validateNextClick() {
      if (this.componentRef.instance) {
         const component = this.componentRef.instance;
         for (const prop in component) {
            if (component[prop] instanceof NgForm) {
               CommonUtility.markFormControlsTouched(component[prop]);
            }
         }
      }

      if (this.isValid && !this.isButtonLoader) {
         this.onNextClick();
      }
   }
   onDeclineClick() {
      let declineClickObserver = null;
      if (this.componentRef.instance && 'declineClick' in this.componentRef.instance) {
         declineClickObserver = this.componentRef.instance.declineClick();
      }
      this.declineClick.emit();
   }

   onNextClick() {
      if (this.isValid) {
         let nextClickObserver = null;

         // Communicate next click to current child component
         if (this.componentRef.instance && 'nextClick' in this.componentRef.instance) {
            nextClickObserver = this.componentRef.instance.nextClick(this.activeStep);
         }

         // Communicate next click to parent and work flow
         if (nextClickObserver instanceof Observable) {
            nextClickObserver.subscribe(() => {
               this.nextClickContinue();
            });
         } else {
            this.nextClickContinue();
         }
      }
   }
   private nextClickContinue() {
      if (this.nextClick.observers.length) {
         this.nextClick.emit(this.activeStep);
      }

      // Work flow next click functionality
      if (this.activeStep < this.steps.length) {
         this.activeStep++;
         this.currentStep.summary.isNavigated = true;
         this.updateStepSummary(this.currentStep);
         this.loadComponent();
         this.updateStepLists();
         this.winRef.nativeWindow.scrollTo(0, 0);
      }
   }

   updateStepSummary(currentStep: IWorkflowStep) {
      this.workflowService.getStepInfo(currentStep);
   }

   updateStepInitialSummary(currentStep: IWorkflowStep) {
      this.workflowService.getStepInitialInfo(currentStep);
   }

   onStepClick(stepSequence: number) {
      let stepClickObservable = null;
      const stepInfo: IStepInfo = {
         activeStep: this.activeStep,
         stepClicked: stepSequence
      };

      // Communicate next click to current child component
      if (this.componentRef.instance && 'stepClick' in this.componentRef.instance) {
         stepClickObservable = this.componentRef.instance.stepClick(stepInfo);
      }

      if (stepClickObservable instanceof Observable) {
         stepClickObservable.subscribe(() => {
            this.stepClickContinue(stepInfo, stepSequence);
         });
      } else {
         this.stepClickContinue(stepInfo, stepSequence);
      }
   }

   private stepClickContinue(stepInfo, stepSequence) {
      // Communicate next click to parent
      if (this.stepClick.observers.length) {
         this.stepClick.emit(stepInfo);
      }

      this.activeStep = stepSequence;
      this.loadComponent();
      this.updateStepLists();
      this.updateStepInitialSummary(this.currentStep);
   }

   updateStepLists() {
      this.beforeSteps = this.steps.slice(0, this.activeStep - 1);
      this.afterSteps = this.steps.slice(this.activeStep);
   }

   getID(text, seqID) {
      return CommonUtility.getID(text) + '_' + seqID;
   }
}

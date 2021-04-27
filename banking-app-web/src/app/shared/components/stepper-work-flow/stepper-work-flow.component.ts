import {
   Component, ViewChild, ComponentFactoryResolver, OnInit,
   OnDestroy, Input, EventEmitter, HostListener, ViewContainerRef, ComponentRef, Output, Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { AddStepItem } from './add-step-item';
import { StepDirective } from './../work-flow/step.directive';
import { IStep } from './stepper-work-flow.models';
import { Constants } from './../../../core/utils/constants';
import { WindowRefService } from '../../../core/services/window-ref.service';
import { Router } from '@angular/router';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { SysErrorInstanceType } from './../../../core/utils/enums';

@Component({
   selector: 'app-stepper-workflow',
   templateUrl: './stepper-work-flow.component.html',
   styleUrls: ['./stepper-work-flow.component.scss']
})

export class StepperWorkFlowComponent implements OnInit, OnDestroy {
   @Input() steppers: AddStepItem[];
   @Input() exitStepperLink: string;
   @Input() restructureSteps: string[];
   @Output() onHide = new EventEmitter();
   @Output() onCurrentStepIndex = new EventEmitter<any>();
   sysErrorInstanceType = SysErrorInstanceType;
   @Input() alternateExitButton: boolean;
   @Input() showErrorOnInvalidSteps = false;
   @ViewChild('stepViewRef', { read: StepDirective }) stepHost: StepDirective;
   currentStepIndex = 0;
   localIndex = 0;
   showStep = true;
   isMobile: boolean;
   hideStepContainer: boolean;
   workflowStep: any;
   componentRef: ComponentRef<any>;

   constructor(private componentFactoryResolver: ComponentFactoryResolver, private workflowService: WorkflowService,
      private winRef: WindowRefService, private router: Router, @Inject(DOCUMENT) private document: Document) {
   }

   loadComponent(stepIndex, stepperArray: AddStepItem[], stepContainerRef: ViewContainerRef) {
      this.workflowService.workflow[stepIndex].isVisited = true;
      this.currentStepIndex = (stepIndex) % stepperArray.length;
      const stepItem = stepperArray[this.currentStepIndex];
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(stepItem.component);

      const viewContainerRef = stepContainerRef;
      viewContainerRef.clear();

      this.componentRef = viewContainerRef.createComponent(componentFactory);
      (<AddStepItem>this.componentRef.instance).data = stepItem.data;
      if ((<AddStepItem>this.componentRef.instance).discardContinueEmitter) {
         (<AddStepItem>this.componentRef.instance).discardContinueEmitter.subscribe(discardContinue => {
            this.onDiscardEmit();
         });
      }
   }
   ngOnInit() {
      this.workflowStep = this.workflowService.workflow;
      this.checkIfMobile();
      if (!this.isMobile) {
         this.hideStepContainer = false;
         this.loadComponent(this.currentStepIndex, this.steppers, this.stepHost.viewContainerRef);
      } else {
         this.hideStepContainer = true;
      }
      this.workflowService.stepClickEmitter.subscribe(step => {
         this.currentStepIndex = this.restructureSteps.indexOf(step);
         if (!this.isMobile && this.currentStepIndex !== -1) {
            this.hideStepContainer = false;
            this.loadComponent(this.restructureSteps.indexOf(step), this.steppers, this.stepHost.viewContainerRef);
         } else {
            this.hideStepContainer = true;
         }
      });
      this.workflowService.finalStepEditEmitter.subscribe(step => {
         this.currentStepIndex = this.restructureSteps.indexOf(step);
         if (this.isMobile) {
            this.hideStepContainer = false;
         }
         this.loadComponent(this.currentStepIndex, this.steppers, this.stepHost.viewContainerRef);
      });
      this.document.body.classList.add('overlay-no-scroll');
   }
   onStepClick(stepIndex) {
      this.localIndex = stepIndex;
      if (this.allowStepperNavigation(stepIndex)) {
         if (!this.workflowService.workflow[this.currentStepIndex].isValueChanged) {
            this.localIndex = this.currentStepIndex;
            this.loadComponent(stepIndex, this.steppers, this.stepHost.viewContainerRef);
         } else {
            this.workflowService.changesEmitter.emit(true);
         }
      }
   }
   onResize() {
      if (this.winRef.nativeWindow.innerWidth > Constants.uiBreakPoints.sm === this.isMobile) {
         this.isMobile = !(this.winRef.nativeWindow.innerWidth > Constants.uiBreakPoints.sm);
         if (!this.isMobile && this.hideStepContainer) {
            this.hideStepContainer = false;
            this.loadComponent(this.currentStepIndex, this.steppers, this.stepHost.viewContainerRef);
         }
      }
   }
   private checkIfMobile() {
      this.isMobile = true;
      if (this.winRef.nativeWindow.innerWidth > Constants.uiBreakPoints.sm) {
         this.isMobile = false;
      }
   }
   mobileStepClick(mobileStep: number) {
      this.hideStepContainer = false;
      this.loadComponent(mobileStep, this.steppers, this.stepHost.viewContainerRef);
   }
   exitStepper() {
      if (this.exitStepperLink) {
         this.router.navigateByUrl(this.exitStepperLink);
      } else {
         this.onHide.emit(false);
      }
      this.onCurrentStepIndex.emit(this.currentStepIndex);
   }
   allowStepperNavigation(clickedStep: number): boolean {
      const invalidStepIndex = this.workflowService.getFirstInvalidStep();
      if (clickedStep === invalidStepIndex || clickedStep < invalidStepIndex) {
         return true;
      }
      return false;
   }
   onDiscardEmit() {
      this.loadComponent(this.localIndex, this.steppers, this.stepHost.viewContainerRef);
   }
   ngOnDestroy() {
      this.document.body.classList.remove('overlay-no-scroll');
   }
}

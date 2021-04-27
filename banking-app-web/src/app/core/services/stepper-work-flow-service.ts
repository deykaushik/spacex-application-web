import { Injectable, EventEmitter } from '@angular/core';
import { AddStepItem } from './../../shared/components/stepper-work-flow/add-step-item';
import { IStep, IStepper } from './../../shared/components/stepper-work-flow/stepper-work-flow.models';

@Injectable()
export class WorkflowService {
   private workflowSteps: IStepper[] = [] as IStepper[];
   stepClickEmitter = new EventEmitter<string>();
   finalStepEditEmitter = new EventEmitter<string>();
   changesEmitter = new EventEmitter<boolean>();

   /** checks for the first invalid step and return the invalid step
   If not found will return the last step as invalid.* */
   getFirstInvalidStep(): number {
      let redirectToStep = this.workflowSteps.length + 1;
      for (let i = 0; i < this.workflowSteps.length; i++) {
         const item = this.workflowSteps[i];
         if (!item.valid) {
            redirectToStep = i;
            return redirectToStep;
         }
      }
      return redirectToStep;
   }
   /** return the workflowSteps object {step: string; valid: boolean;
   isValueChanged: boolean; } **/
   get workflow(): IStepper[] {
      return this.workflowSteps;
   }
   /** set the workflowSteps object{step: string; valid: boolean;
   isValueChanged: boolean; } **/
   set workflow(stepperWorkflow: IStepper[]) {
      this.workflowSteps = stepperWorkflow;
   }
   // to check if a specific step is valid or not
   isStepValid(stepValue: number): boolean {
      return this.workflowSteps[stepValue].valid;
   }

   getWorkflow() {
      return this.workflowSteps;
   }
   setWorkflow(stepperWorkflow: IStepper[]) {
      this.workflowSteps = stepperWorkflow;
   }
   isStepVisited(stepValue: number): boolean {
      return this.workflowSteps[stepValue].isVisited;
   }
}

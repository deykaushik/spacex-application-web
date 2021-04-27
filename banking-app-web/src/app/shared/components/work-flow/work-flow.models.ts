import { Type, EventEmitter } from '@angular/core';
import { IWorkflowButtons, IWorkflowStep, IStepInfo } from './work-flow.models';

export interface IWorkflowButton {
   text: string;
}

export interface IWorkflowButtons {
   next: IWorkflowButton;
   edit: IWorkflowButton;
}
export interface IWorkflowStepSummary {
   title: string;
   isNavigated: boolean;
   sequenceId: number;
}
export interface IWorkflowStep {
   summary: IWorkflowStepSummary;
   buttons: IWorkflowButtons;
   component: Type<any>;
}
 export interface IWorkflow {
    title: string;
    cancelRouteLink: string;
    cancelButtonText: string;
 }

export interface IStepInfo {
   activeStep: number;
   stepClicked: number;
}

export interface IWorkflowChildComponent {
   isComponentValid: EventEmitter<boolean>;
   nextClick(currentStep: number);
   stepClick(stepInfo: IStepInfo);
}

export interface IWorkflowChildComponentWithLoader extends IWorkflowChildComponent {
   isButtonLoader: EventEmitter<boolean>;
}

export interface IWorkflowContainerComponent {
   nextClick(currentStep: number);
   stepClick(stepInfo: IStepInfo);
}



export interface IWorkflowStepModel<T> {
   isNavigated: boolean;
   sequenceId: number;
   model: T;
   isDirty: boolean;
}

export interface IWorkflowService {
   getStepInfo(currentStep: IWorkflowStep): void;
   getStepInitialInfo(currentStep: IWorkflowStep): void;
}

export interface IWorkflowModel {
   getStepTitle(isNavigate: boolean, isDefault: boolean): string;
}

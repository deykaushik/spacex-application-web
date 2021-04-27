import { IStepper } from './stepper-work-flow.models';
import { Component, NgModule, EventEmitter, Output } from '@angular/core';
import { StepperMobileNavBarComponent } from './stepper-nav-bar-mobile/stepper-nav-bar-mobile.component';
import { StepperWorkFlowComponent } from './stepper-work-flow.component';
import { TestBed, async, ComponentFixture, fakeAsync, inject } from '@angular/core/testing';
import { ComponentFactoryResolver, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { Router } from '@angular/router';
import { WindowRefService } from '../../../core/services/window-ref.service';
import { StepperNavBarComponent } from './stepper-nav-bar/stepper-nav-bar.component';
import { StepDirective } from '../work-flow/step.directive';
import { AddStepItem } from './add-step-item';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from '../../../test-util';

@Component({
   selector: 'app-step-one-component',
   template: '<h1>{{title}}</h1>'
})
class StepOneComponent {
   @Output() discardContinueEmitter = new EventEmitter<boolean>();
   title = 'Step One';
   constructor() {
   }
}

@Component({
   selector: 'app-step-two-component',
   template: '<h1>{{title}}</h1>'
})
class StepTwoComponent {
   @Output() discardContinueEmitter = new EventEmitter<boolean>();
   title = 'Step Two';
   constructor() {
   }
}

@Component({
   selector: 'app-step-three-component',
   template: '<h1>{{title}}</h1>'
})
class StepThreeComponent {
   @Output() discardContinueEmitter = new EventEmitter<boolean>();
   title = 'Step Three';
   constructor() {
   }
}

@NgModule({
   entryComponents: [StepOneComponent, StepTwoComponent, StepThreeComponent],
   declarations: [StepOneComponent, StepTwoComponent, StepThreeComponent]
})
class StepModule { }

const navigationSteps = Constants.labels.buildingLoan.steps;
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

describe('StepperWorkflowComponent', () => {
   let component: StepperWorkFlowComponent;
   let fixture: ComponentFixture<StepperWorkFlowComponent>;
   let router: Router;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [StepModule, RouterTestingModule],
         declarations: [StepperWorkFlowComponent, StepperMobileNavBarComponent, StepperNavBarComponent, StepDirective],
         providers: [WorkflowService, WindowRefService, {
            provide: WindowRefService, useValue: {
               nativeWindow: {
                  innerWidth: 800
               }
            }
         }],
         schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
   }));
   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(StepperWorkFlowComponent);
      component = fixture.componentInstance;
      component.steppers = [
         new AddStepItem(StepOneComponent),
         new AddStepItem(StepTwoComponent),
         new AddStepItem(StepThreeComponent)
      ];
      component.restructureSteps = ['Payment type', 'Payment details', 'Contact person', 'Summary'];
      component.hideStepContainer = false;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
      router = TestBed.get(Router);
   }));
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should not load step component on load if mobile', inject([WindowRefService], (windowRefService: WindowRefService) => {
      windowRefService.nativeWindow.innerWidth = 555;
      component.ngOnInit();
      expect(component.hideStepContainer).toBe(true);
   }));
   it('should resize the screen for web view', () => {
      spyOn(component, 'loadComponent');
      component.isMobile = true;
      component.hideStepContainer = true;
      component.onResize();
      expect(component.hideStepContainer).toBe(false);
      expect(component.loadComponent).toHaveBeenCalled();
   });
   it('should exit the stepper', fakeAsync(() => {
      component.exitStepperLink = '/dashboard/account/detail/3';
      const spy = spyOn(router, 'navigateByUrl');
      spyOn(component, 'exitStepper').and.callThrough();
      component.exitStepper();
      const url = spy.calls.first().args[0];
      expect(url.toString()).toBe('/dashboard/account/detail/3');
   }));
   it('should hide the stepper', fakeAsync(() => {
      component.exitStepperLink = '';
      const spy = spyOn(component.onHide, 'emit');
      component.exitStepper();
      expect(spy).toHaveBeenCalledWith(false);
   }));
   it('should load component on mobile step click', () => {
      spyOn(component, 'loadComponent');
      component.mobileStepClick(1);
      expect(component.hideStepContainer).toBe(false);
      expect(component.loadComponent).toHaveBeenCalled();
   });
   it('should load the component on discard changes', () => {
      spyOn(component, 'loadComponent');
      component.onDiscardEmit();
      expect(component.loadComponent).toHaveBeenCalled();
   });
   it('should return false', () => {
      expect(component.allowStepperNavigation(1)).toBe(false);
   });
   it('should return true', () => {
      workflowService.workflow[0] = { step: navigationSteps[0], valid: true, isValueChanged: false };
      expect(component.allowStepperNavigation(0)).toBe(true);
   });
   it('should navigate on step click', () => {
      workflowService.workflow[0] = { step: navigationSteps[0], valid: true, isValueChanged: true };
      component.onStepClick(0);
      expect(component.allowStepperNavigation(0)).toBe(true);
   });
   it('should not navigate on step click', () => {
      workflowService.workflow[0] = { step: navigationSteps[0], valid: false, isValueChanged: false };
      component.onStepClick(0);
      expect(component.allowStepperNavigation(1)).toBe(false);
   });
   it('should not navigate on step click if value is changed', () => {
      workflowService.workflow[0] = { step: navigationSteps[0], valid: false, isValueChanged: true };
      component.onStepClick(0);
      expect(component.allowStepperNavigation(1)).toBe(false);
   });
   it('should subscribe and listen to service step click emitter and load component',
      inject([WorkflowService], (service: WorkflowService) => {
         spyOn(component, 'loadComponent');
         service.stepClickEmitter.emit(navigationSteps[0]);
         expect(component.hideStepContainer).toBe(false);
         expect(component.loadComponent).toHaveBeenCalled();
      }));
   it('should subscribe and listen to service step click emitter and not load component',
      inject([WorkflowService], (service: WorkflowService) => {
         component.isMobile = true;
         spyOn(component, 'loadComponent');
         service.stepClickEmitter.emit(navigationSteps[0]);
         expect(component.hideStepContainer).toBe(true);
         expect(component.loadComponent).not.toHaveBeenCalled();
      }));
   it('should subscribe and listen to service final step click emitter and not load component',
      inject([WorkflowService], (service: WorkflowService) => {
         component.isMobile = true;
         spyOn(component, 'loadComponent');
         service.finalStepEditEmitter.emit(navigationSteps[0]);
         expect(component.hideStepContainer).toBe(false);
         expect(component.loadComponent).toHaveBeenCalled();
      }));
   it('should subscribe and listen to component discard changes emitter', () => {
      component.componentRef.instance.discardContinueEmitter.emit(true);
   });
});


import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StepperMobileNavBarComponent } from './stepper-nav-bar-mobile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WorkflowService } from '../../../../core/services/stepper-work-flow-service';
import { Constants } from '../../../../core/utils/constants';
import { assertModuleFactoryCaching } from '../../../../test-util';

const navigationSteps = Constants.labels.buildingLoan.steps;

const mockWorkflowSteps = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

describe('StepperMobileNavBarComponent', () => {
   let component: StepperMobileNavBarComponent;
   let fixture: ComponentFixture<StepperMobileNavBarComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         declarations: [StepperMobileNavBarComponent],
         providers: [WorkflowService],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
      });
   });
   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(StepperMobileNavBarComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeDefined();
   });
   it('should emit the step click', () => {
      spyOn(component.currentStepEmitter, 'emit');
      component.mobileNextClick(1);
      expect(component.currentStepEmitter.emit).toHaveBeenCalled();
   });
   it('should show next button', () => {
      expect(component.showNextButton(0)).toBe(true);
   });
   it('should not show next button for the index passed', () => {
      expect(component.showNextButton(1)).toBe(false);
   });
});

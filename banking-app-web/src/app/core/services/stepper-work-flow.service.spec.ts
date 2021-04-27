import { WorkflowService } from './stepper-work-flow-service';
import { inject, async, TestBed } from '@angular/core/testing';
import { Constants } from '../utils/constants';

const navigationSteps = Constants.labels.buildingLoan.steps;
const workflowServiceStub = new WorkflowService();
workflowServiceStub.workflow = [{ step: navigationSteps[0], valid: true, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

describe('WorkflowService', () => {
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         providers: [{ provide: WorkflowService, useValue: workflowServiceStub }]
      });
   }));
   it('should be created', inject([WorkflowService], (service: WorkflowService) => {
      expect(service).toBeTruthy();
   }));
   it('should return the first invalid step', inject([WorkflowService], (service: WorkflowService) => {
      expect(service.getFirstInvalidStep()).toBe(1);
   }));
   it('should return if the step is valid or not', inject([WorkflowService], (service: WorkflowService) => {
      expect(service.isStepValid(0)).toBe(true);
      expect(service.isStepValid(1)).toBe(false);
   }));
   it('should get the workflow', inject([WorkflowService], (service: WorkflowService) => {
      const workflowValue = [{ step: navigationSteps[0], valid: true, isValueChanged: false },
      { step: navigationSteps[1], valid: false, isValueChanged: false },
      { step: navigationSteps[2], valid: false, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false }];
      expect(service.workflow).toEqual(workflowValue);
   }));
   it('should return the invalid step', inject([WorkflowService], (service: WorkflowService) => {
      service.workflow = [{ step: navigationSteps[0], valid: true, isValueChanged: false },
      { step: navigationSteps[1], valid: true, isValueChanged: false },
      { step: navigationSteps[2], valid: true, isValueChanged: false },
      { step: navigationSteps[3], valid: true, isValueChanged: false }];
      expect(service.getFirstInvalidStep()).toBe(5);
   }));
});


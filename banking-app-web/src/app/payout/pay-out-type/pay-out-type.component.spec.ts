import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from '../../test-util';
import { Constants } from '../../core/utils/constants';
import { PreFillService } from '../../core/services/preFill.service';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { IStepper } from './../../shared/components/stepper-work-flow/stepper-work-flow.models';

import { IBuildingPayout } from '../payout.models';
import { PayoutService } from './../payout.service';
import { PayOutTypeComponent } from './pay-out-type.component';

const navigationSteps = Constants.labels.buildingLoan.steps;

const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

describe('PayOutTypeComponent', () => {
   let fixture: ComponentFixture<PayOutTypeComponent>;
   let component: PayOutTypeComponent;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         declarations: [PayOutTypeComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: PayoutService, useValue: { payoutData: {} } },
            WorkflowService, PreFillService
         ],
      });
   });
   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(PayOutTypeComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      component.workflowSteps = [] as IStepper[];
      component.workflowSteps = [{ step: 'Payment type', valid: false, isValueChanged: false },
      { step: navigationSteps[1], valid: false, isValueChanged: false },
      { step: navigationSteps[2], valid: false, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false }];
      component.payoutStepData = {} as IBuildingPayout;
      fixture.detectChanges();
   }));

   it('should create the component', () => {
      expect(component).toBeDefined();
   });
   it('should set workflow steps inside afterviewchecked lifecycle hook', () => {
      component.showFinalPopup = true;
      component.ngAfterViewChecked();
      expect(workflowService.workflow[0].isValueChanged).toBe(true);
   });
   it('should set the payout type value as progress', () => {
      const payoutType = 'progress';
      component.onPayoutTypeSelect(payoutType);
   });

   it('should set the payout type value as final', () => {
      const payoutType = 'final';
      component.onPayoutTypeSelect(payoutType);
   });

   it('should close popup and set final value', () => {
      component.propertyAddress = 'address';
      component.payoutStepData.propertyAddress = '';
      const step = { step: 'Payment type', valid: true, isValueChanged: false };
      component.userAction('Next');
      expect(component.showFinalPopup).toBe(false);
      expect(component.payoutStepData.payOutType).toBe('Final');
      expect(component.payoutStepData.propertyAddress).toBe('address');
      expect(component.workflowSteps[0]).toEqual(step);
   });
   it('should close popup and not set final value', () => {
      component.userAction('Final');
      expect(component.showFinalPopup).toBe(false);
      expect(component.payoutStepData.payOutType).not.toBe('Final');
   });
});

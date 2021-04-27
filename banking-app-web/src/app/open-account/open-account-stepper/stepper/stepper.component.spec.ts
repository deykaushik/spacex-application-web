import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OpenAccountService } from '../../open-account.service';
import { StepperComponent } from './stepper.component';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { assertModuleFactoryCaching } from './../../../test-util';
import { Router } from '@angular/router';

const mockStepper: IStepper[] = [{
   step: '2',
   valid: true,
   isValueChanged: true
},
{
   step: '3',
   valid: true,
   isValueChanged: true
}];

const workflowServiceStub = {
   getWorkflow: jasmine.createSpy('getWorkflow').and.returnValue(mockStepper),
   setWorkflow: jasmine.createSpy('setWorkflow')
};

const accountServiceStub = {
   setDepositDetails: jasmine.createSpy('setDepositDetails'),
   setInterestDetails: jasmine.createSpy('setInterestDetails'),
   setRecurringDetails: jasmine.createSpy('setRecurringDetails'),
   setRecurringEdit: jasmine.createSpy('setRecurringEdit')
};

let router: Router;

describe('StepperComponent', () => {
   let component: StepperComponent;
   let fixture: ComponentFixture<StepperComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [StepperComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [Renderer2, { provide: WorkflowService, useValue: workflowServiceStub },
         { provide: OpenAccountService, useValue: accountServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StepperComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be display stepper page when we close cancel popup', () => {
      component.setPopup(false);
      expect(component.isPopup).toBe(false);
   });
});

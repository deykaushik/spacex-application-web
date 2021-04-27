import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../../test-util';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OpenAccountService } from '../../open-account.service';
import { OpenNewAccountDetailsComponent } from './open-new-account-details.component';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { IDeposit } from '../../../core/services/models';

const mockProductInfo: IDeposit = {
   noticeDeposit: 'Y',
   name: '32-days-notice',
   realtimerate: 7
};

const mockStepper: IStepper[] = [{
   step: '2',
   valid: true,
   isValueChanged: true
},
{
   step: '3',
   valid: true,
   isValueChanged: true
},
{
   step: '3',
   valid: true,
   isValueChanged: true
}];

const accountServiceStub = {
   getRecurringEdit: jasmine.createSpy('getRecurringEdit').and.returnValue(true),
   getInterestEdit: jasmine.createSpy('getInterestEdit').and.returnValue(true),
   getProductDetails: jasmine.createSpy('getProductDetails').and.returnValue(mockProductInfo)
};

const workflowServiceStub = {
   getWorkflow: jasmine.createSpy('getWorkflow').and.returnValue(mockStepper),
   setWorkflow: jasmine.createSpy('setWorkflow'),
   stepClickEmitter: new EventEmitter<string>()
};

describe('OpenNewAccountDetailsComponent', () => {
   let component: OpenNewAccountDetailsComponent;
   let fixture: ComponentFixture<OpenNewAccountDetailsComponent>;
   let workflowService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [OpenNewAccountDetailsComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: OpenAccountService, useValue: accountServiceStub },
         { provide: WorkflowService, useValue: workflowServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(OpenNewAccountDetailsComponent);
      component = fixture.componentInstance;
      workflowService = service;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be select deposit screen', () => {
      const data = [{
         depositFlag: true,
         interestFlag: false,
         recurringFlag: true
      }];
      component.accountFlags(data);
      expect(component.isDepositCompleted).toBe(false);
      expect(component.isInterestCompleted).toBe(true);
      expect(component.isInterestTab).toBe(false);
   });

   it('should be select interest account screen ', () => {
      const data = [{
         depositFlag: false,
         interestFlag: true,
         recurringFlag: false
      }];
      component.accountFlags(data);
      expect(component.isDepositCompleted).toBe(true);
      expect(component.isInterestCompleted).toBe(false);
      expect(component.isInterestTab).toBe(true);
   });

   it('should call depositClick when we click on deposit option ', () => {
      component.isDepositCompleted = true;
      component.depositClick();
      expect(component.isRecurringTab).toBe(false);
   });

   it('should call interestClick when we click on interest option ', () => {
      component.isInterestCompleted = true;
      component.interestClick();
      expect(component.interestDetails).toBe(true);
   });

   it('should call interestNext when we click on next option ', () => {
      component.interestNext();
      expect(component.workflowSteps[1].valid).toBe(true);
   });
});

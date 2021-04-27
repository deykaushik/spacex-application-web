import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OpenAccountService } from '../../open-account.service';
import { ProductDetailsComponent } from './product-details.component';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { assertModuleFactoryCaching } from './../../../test-util';

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
   setRecurringEdit: jasmine.createSpy('setRecurringEdit'),
   setInterestEdit: jasmine.createSpy('setInterestEdit'),
   setRealTimeInterestRate: jasmine.createSpy('setRealTimeInterestRate')
};

describe('ProductDetailsComponent', () => {
   let component: ProductDetailsComponent;
   let fixture: ComponentFixture<ProductDetailsComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ProductDetailsComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: WorkflowService, useValue: workflowServiceStub },
         { provide: OpenAccountService, useValue: accountServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ProductDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});

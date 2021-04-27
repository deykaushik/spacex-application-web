import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from '../../../test-util';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { CreditLimitService } from '../credit-limit.service';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { IncomeExpensesComponent } from './income-expenses.component';
import { CreditLimitMaintenance } from '../credit-limit-constants';

const creditLimitIncrease = {
   plasticId: 42,
   grossMonthlyIncome: 10,
   netMonthlyIncome: 10,
   otherIncome: 10,
   monthlyCommitment: 10,
   monthlyDebt: 10,
   bankName: 'Nedbank',
   branchNumber: '198765',
   accountNumber: '9876543',
   preferContactNumber: '123455',
   primaryClientDebtReview: 'N',
   spouseDebtReview: 'N',
   statementRetrival: true
};
const creditLimitServiceStub = {
   getCreditLimitMaintenanceDetails: jasmine.createSpy('getCreditLimitMaintenanceDetails').and.returnValue(creditLimitIncrease),
   setCreditLimitMaintenanceDetails: jasmine.createSpy('setCreditLimitMaintenanceDetails')
};
const navigationSteps = CreditLimitMaintenance.steps;
const tooltipOptions = CreditLimitMaintenance.tooltipValues.income;
describe('IncomeExpensesComponent', () => {
   let component: IncomeExpensesComponent;
   let fixture: ComponentFixture<IncomeExpensesComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [IncomeExpensesComponent, AmountTransformPipe],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CreditLimitService, useValue: creditLimitServiceStub }, WorkflowService]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(IncomeExpensesComponent);
      component = fixture.componentInstance;
      service.workflow = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
      { step: navigationSteps[1], valid: false, isValueChanged: false },
      { step: navigationSteps[2], valid: false, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false }];
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should be created in edit', () => {
      component.workflowSteps[0].valid = true;
      component.ngOnInit();
      expect(component.creditLimitDetails).toBe(creditLimitIncrease);
   });
   it('should call addOtherSource', () => {
      component.addOtherSource();
      expect(component.otherSource).toBe(true);
   });
   it('should call closeTooltips', () => {
      component.closeTooltips();
      expect(component.tooltipOptions[0].isOpen).toBe(false);
   });
   it('should call onFocus', () => {
      component.onFocus();
      expect(component.tooltipOptions[0].isOpen).toBe(false);
   });
   it('should call openTooltip', () => {
      component.openTooltip(tooltipOptions[0]);
      expect(component.tooltipOptions[0].isOpen).toBe(true);
   });
   it('should call goToDocuments', () => {
      component.goToDocuments(false);
      expect(component.workflowSteps[0].valid).toBe(true);
   });
   it('should call onGrossIncomeChange', () => {
      const event = { target: { value: 'R1 234' } };
      component.creditLimitDetails.netMonthlyIncome = 245;
      component.onGrossIncomeChange(event);
      expect(component.creditLimitDetails.grossMonthlyIncome).toBe(1234);
      expect(component.isValidNetIncome).toBe(true);
   });
   it('should call onGrossIncomeChange for false case', () => {
      const event = { target: { value: 'R1 234' } };
      component.creditLimitDetails.netMonthlyIncome = null;
      component.onGrossIncomeChange(event);
      expect(component.creditLimitDetails.grossMonthlyIncome).toBe(1234);
      expect(component.isValidNetIncome).toBe(true);
   });
   it('should call onNetIncomeChange', () => {
      const event = { target: { value: 'R2 254' } };
      component.creditLimitDetails.grossMonthlyIncome = 2364;
      component.onNetIncomeChange(event);
      expect(component.creditLimitDetails.netMonthlyIncome).toBe(2254);
      expect(component.isValidNetIncome).toBe(true);
   });
   it('should call onNetIncomeChange for false case', () => {
      const event = { target: { value: 'R2 254' } };
      component.creditLimitDetails.grossMonthlyIncome = null;
      component.onNetIncomeChange(event);
      expect(component.creditLimitDetails.netMonthlyIncome).toBe(2254);
      expect(component.isValidNetIncome).toBe(false);
   });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from '../../../test-util';
import { CreditLimitService } from '../credit-limit.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { CreditLandingComponent } from './credit-landing.component';
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
   setAccountId: jasmine.createSpy('setAccountId')
};
const navigationSteps = CreditLimitMaintenance.steps;
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
describe('CreditLandingComponent', () => {
   let component: CreditLandingComponent;
   let fixture: ComponentFixture<CreditLandingComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [CreditLandingComponent],
         imports: [FormsModule, RouterTestingModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CreditLimitService, useValue: creditLimitServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 1 }) } }, WorkflowService]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(CreditLandingComponent);
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
   it('should call changeRequestCreditLimit method', () => {
      component.changeRequestCreditLimit(true);
      expect(component.isProcessStarted).toBe(true);
   });
   it('should call changeRequestCreditLimit method', () => {
      component.changeRequestCreditLimit(false);
      expect(component.isProcessStarted).toBe(false);
   });
   it('should call changeProcessStarted method', () => {
      component.changeProcessStarted(false);
      expect(component.isProcessStarted).toBe(false);
   });
   it('should call onCurrentStepIndex method for drop off option 1 bank details', () => {
      component.creditLimitDetails.statementRetrival = true;
      component.onCurrentStepIndex(1);
      expect(component.dropOffEvents.dropOffFromBankDetails.eventAction)
         .toBe('credit_limit_increase_bank_details_drop_off_action');
   });
   it('should call onCurrentStepIndex method for drop off option 1 document consent', () => {
      component.creditLimitDetails.statementRetrival = false;
      component.onCurrentStepIndex(1);
      expect(component.dropOffEvents.dropOffFromDocumentConsent.eventAction)
         .toBe('credit_limit_increase_document_consent_drop_off_action');
   });
   it('should call onCurrentStepIndex method for drop off option 2 contact details', () => {
      component.onCurrentStepIndex(2);
      expect(component.dropOffEvents.dropOffFromContactDetails.eventAction)
         .toBe('credit_limit_increase_contact_details_drop_off_action');
   });
   it('should call onCurrentStepIndex method for drop off option 3 summary ', () => {
      component.onCurrentStepIndex(3);
      expect(component.dropOffEvents.dropOffFromSummary.eventAction).toBe('credit_limit_increase_summary_drop_off_action');
   });
   it('should call onCurrentStepIndex method for drop off option 0 income and expenses ', () => {
      component.onCurrentStepIndex(0);
      expect(component.dropOffEvents.dropOffFromIncomeAndExpenses.eventAction)
         .toBe('credit_limit_increase_income_expenses_drop_off_action');
   });
});

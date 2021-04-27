import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ApoService } from '../apo.service';
import { PaymentAmountComponent } from './payment-amount.component';
import { IAutoPayDetail } from '../apo.model';
import { ApoConstants } from '../apo-constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { assertModuleFactoryCaching } from '../../../test-util';
import { SharedModule } from '../../../shared/shared.module';
import { GaTrackingService } from '../../../core/services/ga.service';

const autoPayDetails: IAutoPayDetail = {
   payToAccount: '589846 076131664 5',
   payToAccountName: 'MR 1RICH GARFIELD',
   autoPayInd: true,
   statementDate: '2018-07-04T00:00:00',
   dueDate: '2018-07-29T00:00:00',
   camsAccType: 'NGB',
   autoPayMethod: 'F',
   autoPayAmount: '',
   branchOrUniversalCode: '123456',
   nedbankIdentifier: true,
   mandateAction: true,
   payFromAccount: '6666666666666',
   payFromAccountType: '2',
   monthlyPaymentDay: '19',
   autoPayTerm: '00',
   allowTermsAndCond: true
};
const operationMode = 'edit';
const autopayServiceStub = {
   getAutoPayDetails: jasmine.createSpy('getAutoPayDetails').and.returnValue(autoPayDetails),
   getMode: jasmine.createSpy('getMode').and.returnValue(operationMode),
   setAutoPayDetails: jasmine.createSpy('setAutoPayDetails')
};
const navigationSteps = ApoConstants.apo.steps;
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
describe('PaymentAmountComponent', () => {
   let component: PaymentAmountComponent;
   let fixture: ComponentFixture<PaymentAmountComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [PaymentAmountComponent],
         imports: [SharedModule],
         providers: [WorkflowService,
            { provide: ApoService, useValue: autopayServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(PaymentAmountComponent);
      component = fixture.componentInstance;
      component.paymentOptions = ApoConstants.apo.paymentAmountOptions;
      component.autoPay.values = ApoConstants.apo.values;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      component.workflowSteps = [] as IStepper[];
      component.workflowSteps = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should set details for edit details', () => {
      component.autoPay.values.edit = ApoConstants.apo.values.edit;
      component.ngOnInit();
      expect(component.model.preferredAmount).toBe('');
   });
   it('should set details for edit details in preferred option', () => {
      component.autoPay.values.edit = ApoConstants.apo.values.edit;
      component.autoPayModelDetails.autoPayMethod = 'A';
      component.autoPayModelDetails.autoPayAmount = '1000';
      component.ngOnInit();
      expect(component.model.preferredAmount).toBe(component.autoPayModelDetails.autoPayAmount);
   });
   it('should call add details', () => {
      component.autoPay.values.edit = ApoConstants.apo.values.add;
      component.operationMode = 'add';
      component.ngOnInit();
      expect(component).toBeTruthy();
   });
   it('should call validate function', () => {
      component.model = { preferredAmount: '100' };
      component.preferredAmountForm = { valid: true };
      component.operationMode = 'add';
      component.validate();
      expect(component.isFormValid).toBeTruthy();
   });
   it('should call validate function for false condition', () => {
      component.model = { preferredAmount: 'R' };
      component.preferredAmountForm = { valid: true };
      component.validate();
      expect(component.isFormValid).toBeFalsy();
   });
   it('should check for amount length with decimal value ', () => {
      const event = { target: { value: 'R12 345 678.10' }, key: '1' };
      component.inputKeyPress(event);
      expect(component.isAmountValid).toBe(true);
   });
   it('should check for amount length without decimal value ', () => {
      const event = { target: { value: 'R12 345 678' }, key: '1' };
      component.inputKeyPress(event);
      expect(component.isAmountValid).toBe(true);
   });
   it('should check for amount length without decimal value false case', () => {
      const event = { target: { value: 'R12 345 678 123' }, key: '1' };
      component.inputKeyPress(event);
      expect(component.isAmountValid).toBe(false);
   });
   it('should call inputKeyPress function for true key value', () => {
      const event = { target: { value: 'R12 345 678' }, key: '1' };
      expect(component.inputKeyPress(event)).toBe(true);
   });
   it('should call inputKeyPress function for false key value', () => {
      const event = { target: { value: 'R12 345 678' }, key: 'e' };
      expect(component.inputKeyPress(event)).toBe(false);
   });
   it('should call onAmountChange function ', () => {
      component.preferredAmountForm = { valid: true };
      component.operationMode = 'add';
      component.onAmountChange('345');
      expect(component.model.preferredAmount).toBe('345');
   });
   it('should call goToNextStep function ', () => {
      component.isFormValid = true;
      component.isValidSelection = true;
      component.isPreferredSelected = false;
      component.goToNextStep();
      expect(component.autoPayModelDetails.autoPayMethod).toBe('F');
   });
   it('should call goToNextStep function for Minumum amount option ', () => {
      component.isValidSelection = true;
      component.isFormValid = true;
      component.isPreferredSelected = false;
      component.selectedAmountOption = 'minimum';
      component.goToNextStep();
      expect(component.autoPayModelDetails.autoPayMethod).toBe('M');
   });
   it('should call goToNextStep function for preferred amount option ', () => {
      component.isValidSelection = true;
      component.isFormValid = true;
      component.isPreferredSelected = true;
      component.selectedAmountOption = 'preferred';
      component.model = { preferredAmount: '100' };
      component.goToNextStep();
      expect(component.autoPayModelDetails.autoPayMethod).toBe('A');
   });
});

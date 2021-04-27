import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ApoService } from '../apo.service';
import { PaymentDateComponent } from './payment-date.component';
import { IAutoPayDetail, IAutopayPaymentDate } from '../apo.model';
import { ApoConstants } from '../apo-constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { assertModuleFactoryCaching } from '../../../test-util';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DaySelectionTextPipe } from '../../../shared/pipes/day-selection-text.pipe';
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

const paymentDate: IAutopayPaymentDate = {
   day: 25,
   daySelectionFullText: 'The 25th of every month',
   isValid: true,
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('PaymentDateComponent', () => {
   let component: PaymentDateComponent;
   let fixture: ComponentFixture<PaymentDateComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [PaymentDateComponent, DaySelectionTextPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [WorkflowService,
            { provide: ApoService, useValue: autopayServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(PaymentDateComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      component.workflowSteps = [] as IStepper[];
      component.workflowSteps = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call setStatementDate for statement date 31', () => {
      component.autoPayModelDetails.statementDate = '2018-08-31';
      component.setStatementDate();
      expect(component.inrangeDateSelector.minDate).toBe('9/3/2018');
   });
   it('should call setStatementDate for statement date 30', () => {
      component.autoPayModelDetails.statementDate = '2018-08-30';
      component.setStatementDate();
      expect(component.inrangeDateSelector.minDate).toBe('9/2/2018');
   });
   it('should call setStatementDate for statement date 30', () => {
      component.autoPayModelDetails.statementDate = '2018-08-29';
      component.setStatementDate();
      expect(component.inrangeDateSelector.minDate).toBe('9/1/2018');
   });
   it('should call handleDayClickEvent function', () => {
      component.handleDayClickEvent(paymentDate);
      expect(component.isValidDaySelected).toBe(true);
   });
   it('should call populateFields method for monthlyPaymentDay as 25 ', () => {
      component.autoPayModelDetails.monthlyPaymentDay = '25';
      component.autoPayModelDetails.autoPayTerm = '00';
      component.populateFields();
      expect(component.selectedDate.day).toBe(25);
   });
   it('should call populateFields method for autopay term as 25 ', () => {
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '25';
      component.populateFields();
      expect(component.selectedDate.day).toBe(29);
   });
   it('should call populateFields method for autopay term as 24 ', () => {
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '24';
      component.populateFields();
      expect(component.selectedDate.day).toBe(28);
   });
   it('should call populateFields method for autopay term as 23 ', () => {
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '23';
      component.populateFields();
      expect(component.selectedDate.day).toBe(27);
   });
   it('should call populateFields method for autopay term as 24 and due day 1', () => {
      component.autoPayModelDetails.dueDate = '2018-08-1';
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '24';
      component.populateFields();
      expect(component.selectedDate.day).toBe(31);
   });
   it('should call populateFields method for autopay term as 24 and due day 2', () => {
      component.autoPayModelDetails.dueDate = '2018-08-2';
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '24';
      component.populateFields();
      expect(component.selectedDate.day).toBe(1);
   });
   it('should call populateFields method for autopay term as 23 and due day 1', () => {
      component.autoPayModelDetails.dueDate = '2018-08-1';
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '23';
      component.populateFields();
      expect(component.selectedDate.day).toBe(30);
   });
   it('should call populateFields method for autopay term as 23 and due day 2', () => {
      component.autoPayModelDetails.dueDate = '2018-08-2';
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '23';
      component.populateFields();
      expect(component.selectedDate.day).toBe(31);
   });
   it('should call setPaymentDate function', () => {
      component.inrangeDateSelector.minDate = '05/05/2018';
      component.inrangeDateSelector.maxDate = '05/25/2018';
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('25');
   });
   it('should call setPaymentDate function', () => {
      component.inrangeDateSelector.minDate = '05/05/2018';
      component.inrangeDateSelector.maxDate = '05/25/2018';
      paymentDate.day = 24;
      paymentDate.daySelectionFullText = 'The 24rd of every month';
      paymentDate.isValid = true;
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('24');
   });
   it('should call setPaymentDate function', () => {
      component.inrangeDateSelector.minDate = '05/05/2018';
      component.inrangeDateSelector.maxDate = '05/25/2018';
      paymentDate.day = 23;
      paymentDate.daySelectionFullText = 'The 23rd of every month';
      paymentDate.isValid = true;
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('23');
   });
   it('should call setPaymentDate function', () => {
      component.inrangeDateSelector.minDate = '05/05/2018';
      component.inrangeDateSelector.maxDate = '05/25/2018';
      paymentDate.day = 14;
      paymentDate.daySelectionFullText = 'The 14th of every month';
      paymentDate.isValid = true;
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('');
   });
   it('should call setPaymentDate method for autopay term as 25 where due day 1 ', () => {
      component.inrangeDateSelector.minDate = '05/10/2018';
      component.inrangeDateSelector.maxDate = '06/1/2018';
      paymentDate.day = 1;
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('25');
   });
   it('should call setPaymentDate method for autopay term as 24 where due day 1 ', () => {
      component.inrangeDateSelector.minDate = '05/10/2018';
      component.inrangeDateSelector.maxDate = '06/1/2018';
      paymentDate.day = 31;
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('24');
   });
   it('should call setPaymentDate method for autopay term as 23 where due day 1 ', () => {
      component.inrangeDateSelector.minDate = '05/10/2018';
      component.inrangeDateSelector.maxDate = '06/1/2018';
      paymentDate.day = 30;
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('23');
   });
   it('should call setPaymentDate method for autopay term as 25 where due day 2 ', () => {
      component.inrangeDateSelector.minDate = '05/10/2018';
      component.inrangeDateSelector.maxDate = '06/2/2018';
      paymentDate.day = 2;
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('25');
   });
   it('should call setPaymentDate method for autopay term as 24 where due day 2 ', () => {
      component.inrangeDateSelector.minDate = '05/10/2018';
      component.inrangeDateSelector.maxDate = '06/2/2018';
      paymentDate.day = 1;
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('24');
   });
   it('should call setPaymentDate method for autopay term as 23 where due day 2 ', () => {
      component.inrangeDateSelector.minDate = '05/10/2018';
      component.inrangeDateSelector.maxDate = '06/2/2018';
      paymentDate.day = 31;
      component.setPaymentDate(paymentDate);
      expect(component.autoPayModelDetails.autoPayTerm).toBe('23');
   });
   it('should call gotToNextStep function', () => {
      component.isValidDaySelected = true;
      component.gotToNextStep();
      expect(component.workflowSteps[2].valid).toBe(true);
   });
   it('should call navigateToNextStep function', () => {
      component.navigateToNextStep();
      expect(component.workflowSteps[2].valid).toBe(true);
   });
});

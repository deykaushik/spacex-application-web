import { NgForm, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from '../../test-util';
import { Constants } from '../../core/utils/constants';
import { IAccountBalanceDetail } from '../../core/services/models';
import { PreFillService } from '../../core/services/preFill.service';
import { IBank, IRadioButtonItem } from './../../core/services/models';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';

import { IBuildingPayout } from './../payout.models';
import { PayoutService } from '../payout.service';
import { PayOutDetailsComponent } from './pay-out-details.component';

const navigationSteps: string[] = Constants.labels.buildingLoan.steps;
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

const prefillService = new PreFillService();
prefillService.buildingBalanceData = {
   accountName: 'BOND A/C',
   accountNumber: '8605376000101',
   accountType: 'HL',
   currency: '&#x52;',
   outstandingBalance: 1.17,
   nextInstallmentAmount: 3519.45,
   amountInArrears: -181726.91,
   nextPaymentDue: 3519.45,
   nextPaymentDate: '2018-05-01T05:30:00+05:30',
   interestRate: 8.25,
   loanAmount: 405000,
   email: 'test@gmail.com',
   paymentTerm: '240',
   termRemaining: '64 months',
   balanceNotPaidOut: 10000,
   registeredAmount: 405000,
   accruedInterest: 0,
   isSingleBond: true,
   PropertyAddress: '6, WABOOM, 40672, Sandton',
   nameAndSurname: 'Mr Brian Bernard Sheinuk',
   contactNumber: '+27991365718'
};
const mockBanks: IBank[] = [{
   bankCode: '001',
   bankName: 'Test',
   rTC: true,
   universalCode: '100',
   branchCodes: [{
      branchCode: '001',
      branchName: 'Test'
   }]
}, {
   bankCode: '002',
   bankName: 'Test1',
   rTC: true,
   universalCode: '1000',
   branchCodes: [{
      branchCode: '002',
      branchName: 'Test1'
   }]
}];
const mockPayoutBlankData: IBuildingPayout = {
   propertyAddress: 'address line 1',
   payOutType: 'PROGRESS',
   amount: '',
   recipientName: '',
   bank: '',
   accountNumber: '',
   contactType: '',
   personName: '',
   personContactNumber: '',
   email: '',
   accountId: ''
};

const mockPayoutData: IBuildingPayout = {
   propertyAddress: 'address line 1',
   payOutType: 'PROGRESS',
   amount: '543543',
   recipientName: 'George James',
   bank: 'NEDBANK',
   accountNumber: '64523675627',
   contactType: '',
   personName: '',
   personContactNumber: '',
   email: '',
   accountId: '3'
};

const payoutServiceStub = {
   getBanks: jasmine.createSpy('getBanks').and.returnValue(Observable.of(mockBanks)),
   payoutData: jasmine.createSpy('payoutData').and.returnValue(mockPayoutBlankData)
};

const mockForm = <NgForm>{
   value: {
      amount: '763743',
      name: 'World'
   },
   dirty: false,
   valid: true
};

const mockDirtyForm = <NgForm>{
   value: {
      amount: '763743',
      name: 'World'
   },
   dirty: true,
   valid: false
};

describe('PayoutDetailComponent', () => {
   let component: PayOutDetailsComponent;
   let fixture: ComponentFixture<PayOutDetailsComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         declarations: [PayOutDetailsComponent, AmountTransformPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [FormsModule],
         providers: [
            { provide: PayoutService, useValue: payoutServiceStub },
            WorkflowService, PreFillService
         ],
      });
   });
   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(PayOutDetailsComponent);
      component = fixture.componentInstance;
      component.payoutStepData = {} as IBuildingPayout;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
   }));
   function updateForm() {
      component.payOutDetailsForm = new FormGroup({
         amount: new FormControl(),
         name: new FormControl(),
         payoutBank: new FormControl(),
         payoutAccNo: new FormControl()
      });
      component.payOutDetailsForm.controls['amount'].setValue('35434');
      component.payOutDetailsForm.controls['name'].setValue('George');
      component.payOutDetailsForm.controls['payoutBank'].setValue('NEDBANK');
      component.payOutDetailsForm.controls['payoutAccNo'].setValue('1324435343');
   }
   it('should be created', () => {
      expect(component).toBeDefined();
   });
   it('should initialize the values', inject([PayoutService], (service: PayoutService) => {
      service.payoutData = mockPayoutBlankData;
      component.ngOnInit();
   }));
   it('should initialize the values and set the values from model', inject([PayoutService], (service: PayoutService) => {
      service.payoutData = mockPayoutData;
      component.ngOnInit();
   }));
   it('should initialize the values and set the values from model', inject([WorkflowService], (service: WorkflowService) => {
      service.changesEmitter.emit(true);
   }));
   it('should set form as dirty', () => {
      component.payOutDetailsForm = mockForm;
      component.isFormDirty = false;
      component.ngAfterViewChecked();
   });
   it('should set form as dirty', () => {
      component.payOutDetailsForm = mockForm;
      component.isFormDirty = true;
      component.workflowSteps = workflowService.workflow;
      component.ngAfterViewChecked();
   });
   it('should set form as dirty', () => {
      component.payOutDetailsForm = mockDirtyForm;
      component.isFormDirty = false;
      component.ngAfterViewChecked();
   });
   it('should change the payout amount type', () => {
      component.onPayoutAmountChange(32423);
      component.availableTransferLimit = 40000;
      expect(component.payoutDetailsAmount).toBe('32423');
      expect(component.isTransferLimitExceeded).toBe(false);
      expect(component.isPayoutAmountEmpty).toBe(false);
   });
   it('should not allow space as first character for name', () => {
      component.payoutDetailsName = '';
      component.onPayoutNameChange(' ');
      expect(component.isPayoutNameValid).toBe(true);
      expect(component.isPayoutNameEmpty).toBe(false);
   });
   it('should validate bank name', () => {
      component.onPayoutDetailsBankChanged('NEDBANK');
      expect(component.displayPayoutDetailsSelectedBank).toBe('NEDBANK');
      expect(component.isPayoutBankValid).toBe(true);
      expect(component.isPayoutBankEmpty).toBe(false);
   });
   it('should allow backspace and number only', () => {
      expect(component.onAccountNumberKeyDown('Backspace')).toBe(true);
      expect(component.onAccountNumberKeyDown('1')).toBeUndefined();
      expect(component.onAccountNumberKeyDown('q')).toBe(false);
   });
   it('should not navigate to contact person page', () => {
      workflowService.workflow[1] = { step: navigationSteps[1], valid: false, isValueChanged: false };
      component.isMaxValue = false;
      component.selectedAmountType = 'Max';
      component.payoutDetailsAmount = '6432';
      component.payOutDetailsForm = mockDirtyForm;
      component.isPayoutBankEmpty = true;
      component.isTransferLimitExceeded = true;
      component.goToContactPerson();
      expect(workflowService.workflow[1].valid).toBe(false);
   });
   it('should navigate to contact person page', () => {
      workflowService.workflow[1] = { step: navigationSteps[1], valid: false, isValueChanged: false };
      component.isMaxValue = false;
      component.selectedAmountType = 'Max';
      component.payoutDetailsAmount = '6432';
      component.payOutDetailsForm = mockForm;
      component.isPayoutBankEmpty = false;
      component.isTransferLimitExceeded = false;
      component.payoutStepData = mockPayoutData;
      component.payoutStepData.amount = '';
      component.payoutDetailsAccNum = '784637863478';
      component.goToContactPerson();
      expect(workflowService.workflow[1].valid).toBe(true);
   });
   it('should validate the fields', () => {
      component.displayPayoutDetailsSelectedBank = 'NEDBANK';
      component.isAmountTypeSelected = true;
      updateForm();
      component.validatePayDetailsForm(component.payOutDetailsForm);
      expect(component.isAmountTypeSelected).toBe(true);
      expect(component.isPayoutBankValid).toBe(true);
      expect(component.isPayoutBankEmpty).toBe(false);
   });
   it('should set the payout data', () => {
      component.payoutStepData = mockPayoutData;
      component.setPayoutDetails();
   });
   it('should close the popup', () => {
      component.discardChangesPopup('close');
      expect(component.isDiscardChangesPopup).toBe(false);
      spyOn(component.discardContinueEmitter, 'emit');
      component.discardChangesPopup('next');
      expect(component.isDiscardChangesPopup).toBe(false);
      expect(component.discardContinueEmitter.emit).toHaveBeenCalled();
   });
   it('should change the amount type', () => {
      const amountType: IRadioButtonItem = { label: 'Maximum amount', value: 'Max' };
      component.onAmountTypeChange(amountType);
      expect(component.selectedAmountType).toBe('Max');
      expect(component.isMaxValue).toBe(true);
      expect(component.isAmountTypeSelected).toBe(true);
   });
});

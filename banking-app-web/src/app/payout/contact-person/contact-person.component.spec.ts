import { NgForm, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { PayoutService } from '../payout.service';
import { PreFillService } from '../../core/services/preFill.service';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { ContactPersonComponent } from './contact-person.component';
import { IBuildingPayout } from '../payout.models';
import { IRadioButtonItem } from '../../core/services/models';
import { IAccountBalanceDetail } from './../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { assertModuleFactoryCaching } from '../../test-util';

const navigationSteps = Constants.labels.buildingLoan.steps;
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

const mockbuildingBalanceData: IAccountBalanceDetail = {
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

const mockPayoutMyselfData: IBuildingPayout = {
   propertyAddress: 'address line 1',
   payOutType: 'PROGRESS',
   amount: '543543',
   recipientName: 'George James',
   bank: 'NEDBANK',
   accountNumber: '64523675627',
   contactType: 'MYSELF',
   personName: 'George James',
   personContactNumber: '+2754635463',
   email: 'georgeja@nedbank.co.za',
   accountId: '3'
};

const mockPayoutSpecifyData: IBuildingPayout = {
   propertyAddress: 'address line 1',
   payOutType: 'PROGRESS',
   amount: '543543',
   recipientName: 'George James',
   bank: 'NEDBANK',
   accountNumber: '64523675627',
   contactType: 'SPECIFICPERSON',
   personName: 'George James',
   personContactNumber: '+2754635463',
   email: 'georgeja@nedbank.co.za',
   accountId: '3'
};

describe('ContactPersonComponent', () => {
   let component: ContactPersonComponent;
   let fixture: ComponentFixture<ContactPersonComponent>;
   let workflowService: WorkflowService;
   let payoutService: PayoutService;
   let prefillService: PreFillService;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         declarations: [ContactPersonComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [FormsModule],
         providers: [
            { provide: PayoutService, useValue: { payoutData: { } } },
            WorkflowService, PreFillService
         ],
      });
   });

   beforeEach(inject([WorkflowService, PayoutService, PreFillService],
      (service: WorkflowService, service1: PayoutService, service2: PreFillService) => {
         fixture = TestBed.createComponent(ContactPersonComponent);
         component = fixture.componentInstance;
         component.payoutStepData = {} as IBuildingPayout;
         workflowService = service;
         payoutService = service1;
         prefillService = service2;
         prefillService.buildingBalanceData = mockbuildingBalanceData;
         workflowService.workflow = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
         { step: navigationSteps[1], valid: false, isValueChanged: false },
         { step: navigationSteps[2], valid: false, isValueChanged: false },
         { step: navigationSteps[3], valid: false, isValueChanged: false }];
         component.contactPersonForm = new FormGroup({
            contactNo: new FormControl(),
            name: new FormControl(),
            contactEmail: new FormControl()
         });
         fixture.detectChanges();
      }));
   function updateForm() {
      component.contactPersonForm.controls['contactNo'].setValue('+2754535434');
      component.contactPersonForm.controls['name'].setValue('George');
      component.contactPersonForm.controls['contactEmail'].setValue('georgeja@nedbank.co.za');
   }
   it('should be created', () => {
      expect(component).toBeDefined();
   });
   it('should initialize the values', () => {
      payoutService.payoutData = mockPayoutBlankData;
      component.ngOnInit();
   });
   it('should initialize the values and set the values from model', () => {
      payoutService.payoutData = mockPayoutSpecifyData;
      component.ngOnInit();
   });
   it('should initialize the values and set the values from model', () => {
      payoutService.payoutData = mockPayoutMyselfData;
      component.ngOnInit();
   });
   it('should initialize the values and set the values from model', () => {
      workflowService.changesEmitter.emit(true);
   });
   it('should set form as dirty', () => {
      component.contactPersonForm = mockForm;
      component.selectedVal = 'SPECIFICPERSON';
      component.payoutStepData = mockPayoutMyselfData;
      component.isFormValid = false;
      component.ngAfterViewChecked();
   });
   it('should set form as dirty', () => {
      component.contactPersonForm = mockForm;
      component.isFormValid = true;
      component.workflowSteps = workflowService.workflow;
      component.ngAfterViewChecked();
   });
   it('should set form as dirty', () => {
      component.contactPersonForm = mockDirtyForm;
      component.selectedVal = 'SPECIFICPERSON';
      component.isFormValid = false;
      component.ngAfterViewChecked();
   });
   it('should change the contact to specify person', () => {
      const contactType: IRadioButtonItem = { label: 'Specify person', value: 'SPECIFICPERSON' };
      component.onContactTypeChange(contactType);
      expect(component.type).toBe('Specify person');
      expect(component.contactPersonNumber).toBe('+27');
      expect(component.isMyselfSelected).toBe(false);
      expect(component.selectedVal).toBe('SPECIFICPERSON');
   });
   it('should change the contact to me', () => {
      const contactType: IRadioButtonItem = {
         label: 'Myself',
         value: 'MYSELF',
         subTitle: component.formatTelephone('+2767353524')
      };
      component.onContactTypeChange(contactType);
      expect(component.type).toBe('Myself');
      expect(component.isMyselfSelected).toBe(true);
      expect(component.isContactPersonNameValid).toBe(true);
      expect(component.isContactPersonNumberValid).toBe(true);
      expect(component.selectedVal).toBe('MYSELF');
   });
   it('should validate contact person name on change', () => {
      component.onContactPersonNameChange('Test');
      expect(component.contactPersonName).toBe('Test');
      expect(component.isContactPersonNameValid).toBe(true);
   });
   it('should validate contact person name on change', () => {
      component.onContactPersonNameChange('T');
      expect(component.contactPersonName).toBe('T');
      expect(component.isContactPersonNameValid).toBe(false);
   });
   it('should validate form for myself', () => {
      updateForm();
      component.validateContactPersonForm(component.contactPersonForm);
   });
   it('should validate form fro specify person', () => {
      updateForm();
      component.selectedVal = 'SPECIFICPERSON';
      component.contactPersonName = 'Geo';
      component.validateContactPersonForm(component.contactPersonForm);
   });
   it('should validate contact person name', () => {
      component.validateContactPersonName('Geo');
      expect(component.isContactPersonNameValid).toBe(true);
   });
   it('should validate contact person number', () => {
      updateForm();
      component.validateContactPersonNumber('+2764564653');
      expect(component.isContactPersonNumberValid).toBe(false);
   });
   it('should set Specify contact details', () => {
      component.selectedVal = 'SPECIFICPERSON';
      component.payoutStepData = mockPayoutSpecifyData;
      component.setRequestObject();
      fixture.detectChanges();
      expect(component.selectedVal).toBe('SPECIFICPERSON');
   });
   it('should set Myself contact details', () => {
      component.payoutStepData = mockPayoutMyselfData;
      component.setRequestObject();
      expect(component.selectedVal).toBe('MYSELF');
   });
   it('should initialize contact number', () => {
      updateForm();
      component.onContactNumberChange('');
      expect(component.contactPersonForm.controls.contactNo.value).toBe('+27');
   });
   it('should initialize the contact number', () => {
      component.initContactNumber();
      expect(component.contactPersonForm.controls.contactNo.value).toBe('+27');
      expect(component.isContactKeyDown).toBe(false);
   });
   it('should discard popup', () => {
      component.discardChangesPopup('close');
      expect(component.isDiscardChangesPopup).toBe(false);
   });
   it('should discard changes', () => {
      spyOn(component.discardContinueEmitter, 'emit');
      component.discardChangesPopup('cancel');
      expect(component.isDiscardChangesPopup).toBe(false);
      expect(component.discardContinueEmitter.emit).toHaveBeenCalled();
   });
   it('should not allow to delete internation code', () => {
      const eventValue = {
         key: 'Backspace', target: {
            value: '+274353'
         }
      };
      component.onContactNumberKeyDown(eventValue);
   });
   it('should not allow control key', () => {
      const event = {
         key: 'Backspace',
         target: { value: '+27' },
         ctrlKey: true,
         stopPropagation: function () { },
         preventDefault: function () { }
      };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      component.onContactNumberKeyDown(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
   });
   it('should return false if entered number', () => {
      const event = {
         key: 'q',
         target: { value: '+27' },
         ctrlKey: false
      };
      expect(component.onContactNumberKeyDown(event)).toBe(false);
   });
   it('should check if the email is valid', () => {
      component.contactPersonForm.controls['contactEmail'].setValue('nedbank@nedbank.co.za');
      expect(component.checkEmailValid(component.contactPersonForm, 'contactEmail')).toBe(true);
   });
});

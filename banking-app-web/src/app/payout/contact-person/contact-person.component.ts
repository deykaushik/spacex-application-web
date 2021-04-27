import { Component, OnInit, ViewChild, AfterViewChecked, EventEmitter, Output } from '@angular/core';
import { IRadioButtonItem } from '../../core/services/models';
import { IBuildingPayout } from '../payout.models';
import { PayoutService } from '../payout.service';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { FormGroup, Validators } from '@angular/forms';
import { PreFillService } from '../../core/services/preFill.service';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-contact-person',
   templateUrl: './contact-person.component.html',
   styleUrls: ['./contact-person.component.scss']
})

export class ContactPersonComponent implements OnInit, AfterViewChecked {
   @ViewChild('contactPersonForm') contactPersonForm;
   @Output() discardContinueEmitter = new EventEmitter<boolean>();
   registeredNum: string;
   registeredEmail: string;
   skeletonMode: Boolean;
   contactPersonName: string;
   isContactPersonNameValid = true;

   contactPersonNumber: string;
   isContactPersonNumberValid = true;
   payoutStepData: IBuildingPayout;
   isMyselfSelected = true;
   validKeys = Constants.labels.buildingLoan.validKeys;
   constantMessages = Constants.messages;
   contactConstants = Constants.labels.buildingLoan.contactPerson;
   contactMessages = this.constantMessages.buildingLoan.contactPerson;
   type: string;
   submitted: boolean;
   contactPersonType: IRadioButtonItem[];
   contactPersonDetail = {
      contactType: this.contactConstants.contactType
   };
   selectedVal: string;
   workflowSteps: IStepper[];
   isFormValid: boolean;
   isContactKeyDown = true;
   isDiscardChangesPopup: boolean;
   contactPersonEmail: string;
   patterns = Constants.patterns;
   mobilePattern = this.patterns.mobile;
   contactPersonTypeValue: IRadioButtonItem[];
   isContactEmailValid: boolean;
   constructor(private payoutService: PayoutService, private workflowService: WorkflowService, private prefillService: PreFillService) { }

   ngOnInit() {
      this.registeredNum = this.prefillService.buildingBalanceData ? this.prefillService.buildingBalanceData.contactNumber : '';
      this.registeredEmail = this.prefillService.buildingBalanceData ? this.prefillService.buildingBalanceData.email.toLowerCase() : '';
      this.contactPersonTypeValue = this.contactConstants.contactPersonType;
      this.contactPersonTypeValue[0].subTitle = this.formatTelephone(this.registeredNum);
      this.contactPersonType = this.prefillService.buildingBalanceData.contactNumber ?
         this.contactPersonTypeValue : this.contactPersonTypeValue.filter(contactType => {
            contactType.value = this.contactPersonType[1].value;
         });
      this.payoutStepData = this.payoutService.payoutData;
      if (this.payoutStepData.contactType && this.payoutStepData.contactType.length) {
         this.isMyselfSelected = this.payoutStepData.contactType === this.contactPersonTypeValue[0].value ? true : false;
      } else {
         this.isMyselfSelected = true;
      }
      this.submitted = false;
      this.workflowSteps = this.workflowService.workflow;
      this.selectedVal = this.payoutStepData.contactType ? this.payoutStepData.contactType : this.contactPersonType[0].value;
      if (this.payoutStepData.personName) {
         this.setContactDetails();
      }
      this.isFormValid = false;
      this.workflowService.changesEmitter.subscribe((isChanged: boolean) => {
         this.isDiscardChangesPopup = true;
      });
   }
   ngAfterViewChecked() {
      if (this.contactPersonForm && !this.isFormValid) {
         this.isFormValid = this.contactPersonForm.dirty;
         this.updateWorkflowSteps(this.isFormValid);
      }
      if (this.payoutStepData.contactType) {
         if (this.selectedVal !== this.payoutStepData.contactType) {
            this.updateWorkflowSteps(true);
         }
      } else {
         if (this.selectedVal !== this.contactPersonTypeValue[0].value) {
            this.updateWorkflowSteps(true);
         }
      }
   }
   updateWorkflowSteps(valueChanged: boolean) {
      this.workflowSteps[2].isValueChanged = valueChanged;
   }
   onContactTypeChange(contactType: IRadioButtonItem) {
      this.type = contactType.label;
      if (this.type === this.contactPersonTypeValue[1].label) {
         this.contactPersonNumber = this.contactPersonNumber ? this.contactPersonNumber : Constants.VariableValues.countryCode;
         this.isMyselfSelected = false;
         this.contactPersonForm.controls.name.setValidators([Validators.required, Validators.minLength(1)]);
         this.contactPersonForm.controls.name.updateValueAndValidity();
         this.contactPersonForm.controls.contactNo.setValidators([Validators.required, Validators.minLength(12)]);
         this.contactPersonForm.controls.contactNo.updateValueAndValidity();
         this.contactPersonForm.controls.contactEmail.setValidators([Validators.required, Validators.minLength(1),
         Validators.pattern(this.patterns.email)]);
         this.contactPersonForm.controls.contactEmail.updateValueAndValidity();
      } else {
         this.isMyselfSelected = true;
         this.isContactPersonNameValid = true;
         this.isContactPersonNumberValid = true;
         this.contactPersonForm.controls.name.clearValidators();
         this.contactPersonForm.controls.name.updateValueAndValidity();
         this.contactPersonForm.controls.contactEmail.clearValidators();
         this.contactPersonForm.controls.contactEmail.updateValueAndValidity();
         this.contactPersonForm.controls.contactNo.clearValidators();
         this.contactPersonForm.controls.contactNo.updateValueAndValidity();
      }
      this.selectedVal = contactType.value;
   }

   onContactPersonNameChange(nameSurname: string) {
      this.contactPersonName = nameSurname;
      this.isContactPersonNameValid = this.contactPersonName.length > 1;
   }

   validateContactPersonForm(contactForm: FormGroup) {
      this.validateAllFields(contactForm);
      this.submitted = true;
      if (this.selectedVal === this.contactPersonTypeValue[1].value) {
         this.validateContactPersonName(this.contactPersonName);
         this.validateContactPersonNumber(this.contactPersonNumber);
         if (this.contactPersonName) {
            if (contactForm.valid) {
               this.setRequestObject();
            }
         }
      } else {
         this.setRequestObject();
      }
   }
   setRequestObject() {
      this.payoutStepData.personName = this.selectedVal === this.contactPersonTypeValue[0].value ?
         this.prefillService.buildingBalanceData.nameAndSurname : this.contactPersonName;
      this.payoutStepData.personContactNumber = this.selectedVal === this.contactPersonTypeValue[0].value ?
         this.prefillService.buildingBalanceData.contactNumber : this.contactPersonNumber;
      this.payoutStepData.email = this.selectedVal === this.contactPersonTypeValue[0].value ?
         this.prefillService.buildingBalanceData.email :
         this.contactPersonEmail;
      this.payoutStepData.contactType = this.selectedVal;
      this.payoutService.payoutData = this.payoutStepData;
      this.workflowSteps[2] = { step: this.workflowSteps[2].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[3].step);
   }
   validateContactPersonName(name: string) {
      this.isContactPersonNameValid = name ? true : false;
   }

   validateContactPersonNumber(contactNum: string) {
      this.isContactPersonNumberValid = this.contactPersonForm.controls.contactNo.value.length < this.contactConstants.phoneNumberLength
         ? false : true;
   }

   setContactDetails() {
      this.selectedVal = this.payoutStepData.contactType;
      if (this.selectedVal !== this.contactPersonTypeValue[0].value) {
         this.contactPersonName = this.payoutStepData.personName;
         this.contactPersonNumber = this.payoutStepData.personContactNumber;
         this.contactPersonEmail = this.payoutStepData.email;
      } else {
         this.contactPersonName = '';
         this.contactPersonNumber = '';
      }
   }

   initContactNumber() {
      if (this.isContactKeyDown) {
         this.contactPersonForm.controls.contactNo.setValue(Constants.VariableValues.countryCode);
         this.isContactKeyDown = false;
      }
   }

   onContactNumberChange(contactInput: string) {
      if (contactInput.length < 3) {
         this.contactPersonForm.controls.contactNo.setValue(Constants.VariableValues.countryCode + contactInput);
      }
      this.isContactPersonNumberValid = contactInput.length === 12 ? true : false;
   }

   onContactNumberKeyDown(event: any) {
      const contactInput = event.target.value;
      if (event.key === this.contactConstants.backspace) {
         if (contactInput.length === 3) {
            event.preventDefault();
         }
      }
      if (event.ctrlKey) {
         event.preventDefault();
      }
      if (this.validKeys.indexOf(event.key) < 0) {
         if (event.key === this.contactConstants.backspace) {
            return true;
         }
         return false;
      }
   }
   discardChangesPopup(userDiscardAction: string) {
      if (userDiscardAction !== this.contactConstants.close) {
         this.discardContinueEmitter.emit(true);
      }
      this.isDiscardChangesPopup = false;
   }
   validateAllFields(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
         if (!this.contactPersonForm.controls[field].touched) {
            this.contactPersonForm.controls[field].markAsTouched({ onlySelf: true });
         }
      });
   }
   formatTelephone(contactNumber: string) {
      const internationalCode = Constants.VariableValues.countryCode + ' ';
      let contactNum = contactNumber.indexOf('(0)') === -1 ? contactNumber.replace(/[\s]/g, '')
         : (contactNumber.replace('(0)', '')).replace(/[\s]/g, '');
      contactNum = contactNum.replace(contactNum.substring(0, 3), contactNum.substring(0, 3) + ' ');
      contactNum = contactNum.replace(contactNum.substring
         (contactNum.indexOf(internationalCode), contactNum.indexOf(internationalCode) + 6), contactNum.substring
            (contactNum.indexOf(internationalCode), contactNum.indexOf(internationalCode) + 6) + ' ');
      contactNum = contactNum.replace(contactNum.substring(contactNum.indexOf(internationalCode),
         contactNum.indexOf(internationalCode) + 10)
         , contactNum.substring(contactNum.indexOf(internationalCode), contactNum.indexOf(internationalCode) + 10) + ' ');
      return contactNum;
   }
   checkEmailValid(formGroup: FormGroup, control: string): boolean {
      if (formGroup.controls[control] && formGroup.controls[control].errors &&
         formGroup.controls[control].errors.pattern) {
         return false;
      }
      return true;
   }
}

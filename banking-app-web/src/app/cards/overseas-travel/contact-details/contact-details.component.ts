import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { OverseaTravelService } from '../overseas-travel.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { IClientDetails, IOverseasTravelDetails, IContactPerson } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';


@Component({
   selector: 'app-contact-details',
   templateUrl: './contact-details.component.html',
   styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {

   labels = Constants.overseasTravel.labels;
   pattern = Constants.patterns;
   messages = Constants.messages;
   workflowSteps: IStepper[];
   minlength = Constants.overseasTravel.contactDetails.contactNoMinlength;
   maxlength = Constants.overseasTravel.contactDetails.contactNoMaxlength;
   emailMaxlength = Constants.overseasTravel.contactDetails.emailMaxlength;
   heading: string;
   isTooltipOpen: boolean;
   isContactDetailsOpen: boolean;
   contactDetails: IClientDetails;
   overseasTravelDetails: IOverseasTravelDetails;
   @ViewChild('contactDetailsForm') contactDetailsForm;
   constructor(private workflowService: WorkflowService, private clientPreferences: ClientProfileDetailsService,
      private overseaTravelService: OverseaTravelService) { }

   ngOnInit() {
      this.workflowSteps = this.workflowService.workflow;
      this.heading = this.labels.contactDetailsHeading1;
      this.overseasTravelDetails = this.overseaTravelService.getOverseasTravelDetails();
      this.isContactDetailsOpen = false;
      this.contactDetails = this.clientPreferences.getClientPreferenceDetails();
      this.isTooltipOpen = false;
      if (this.workflowSteps[3].valid) {
         this.isContactDetailsOpen = ((this.overseasTravelDetails.overseasContactPerson.name ||
            this.overseasTravelDetails.overseasContactPerson.number) ||
            (this.overseasTravelDetails.localContactPerson.name || this.overseasTravelDetails.localContactPerson.number)) ? true : false;
      } else {
         this.overseasTravelDetails.overseasContactPerson = {} as IContactPerson;
         this.overseasTravelDetails.localContactPerson = {} as IContactPerson;
         this.overseasTravelDetails.overseasContactPerson.name = '';
         this.overseasTravelDetails.overseasContactPerson.number = '';
         this.overseasTravelDetails.localContactPerson.name = '';
         this.overseasTravelDetails.localContactPerson.number = '';
         this.overseasTravelDetails.alteranteNumber = '';
      }
   }


   openOtherDetails() {
      this.isContactDetailsOpen = !this.isContactDetailsOpen;
      this.heading = this.isContactDetailsOpen ? this.labels.contactDetailsHeading1 : this.labels.contactDetailsHeading;
   }
   openTooltip() {
      this.isTooltipOpen = !this.isTooltipOpen;
   }

   checkEmailValid(formGroup: FormGroup, control: string): boolean {
      if (formGroup.controls[control] && formGroup.controls[control].errors &&
         formGroup.controls[control].errors.pattern) {
         return false;
      }
      return true;
   }

   checkSecondaryNumberValid(formGroup: FormGroup, control: string): boolean {
      return CommonUtility.isValidInput(formGroup, control);
   }

   checkContactPersonNumberValid(formGroup: FormGroup, control: string): boolean {
      return CommonUtility.isValidInput(formGroup, control);
   }

   checkForeignNameValid(formGroup: FormGroup, control: string): boolean {
      return CommonUtility.isValidInput(formGroup, control);
   }
   checkLocalNameValid(formGroup: FormGroup, control: string): boolean {
      return CommonUtility.isValidInput(formGroup, control);
   }
   checkLocalContactPersonNumberValid(formGroup: FormGroup, control: string): boolean {
      return CommonUtility.isValidInput(formGroup, control);
   }

   checkForeignContactPersonNumberValid(formGroup: FormGroup, control: string): boolean {
      return CommonUtility.isValidInput(formGroup, control);
   }

   isFormValid() {
      return this.contactDetailsForm && this.contactDetailsForm.valid ? true : false;
   }

   onNextClick() {
      this.overseasTravelDetails.primaryNumber = this.contactDetails.CellNumber;
      this.overseasTravelDetails.email = this.contactDetails.EmailAddress;
      this.overseaTravelService.setOverseasTravelDetails(this.overseasTravelDetails);
      this.workflowSteps[3] = { step: this.workflowSteps[3].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[4].step);
   }

}

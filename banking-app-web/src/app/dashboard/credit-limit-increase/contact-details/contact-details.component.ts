import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { CreditLimitService } from '../credit-limit.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { ICreditLimitMaintenance, IClientDetails, IPhoneNumber } from '../../../core/services/models';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';

@Component({
   selector: 'app-contact-details',
   templateUrl: './contact-details.component.html',
   styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {

   labels = CreditLimitMaintenance.labels;
   messages = CreditLimitMaintenance.messages;
   workflowSteps: IStepper[];
   creditLimitDetails: ICreditLimitMaintenance;
   isContactNumberValid: boolean;
   clientDetails: IClientDetails;

   constructor(private workflowService: WorkflowService, private creditLimitService: CreditLimitService,
      private clientPreferences: ClientProfileDetailsService) { }

   ngOnInit() {
      this.creditLimitDetails = this.creditLimitService.getCreditLimitMaintenanceDetails();
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      this.workflowSteps = this.workflowService.workflow;
      if (this.clientDetails && this.clientDetails.CellNumber) {
         this.creditLimitDetails.preferContactNumber = this.clientDetails.CellNumber;
         this.isContactNumberValid = true;
      }
   }
   getPhoneNumber(validPhoneNumber: IPhoneNumber) {
      this.creditLimitDetails.preferContactNumber = validPhoneNumber.phoneNumber;
      this.isContactNumberValid = validPhoneNumber.isValid;
   }
   goToSummary() {
      if (this.isContactNumberValid) {
         this.creditLimitService.setCreditLimitMaintenanceDetails(this.creditLimitDetails);
         this.workflowSteps[2] = { step: this.workflowSteps[2].step, valid: true, isValueChanged: false };
         this.workflowService.workflow = this.workflowSteps;
         this.workflowService.stepClickEmitter.emit(this.workflowSteps[3].step);
      }
   }
}

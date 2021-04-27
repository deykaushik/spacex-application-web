import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { CreditLimitService } from '../credit-limit.service';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { IClientDetails, ICreditLimitMaintenance } from '../../../core/services/models';

@Component({
   selector: 'app-request-credit-limit',
   templateUrl: './request-credit-limit.component.html',
   styleUrls: ['./request-credit-limit.component.scss']
})
export class RequestCreditLimitComponent implements OnInit {

   @Input() isRequestCreditLimit: boolean;
   @Output() changeRequestCreditLimit = new EventEmitter<boolean>();
   labels = CreditLimitMaintenance.labels;
   messages = CreditLimitMaintenance.messages;
   isTooltipOpen: boolean;
   isAccept: boolean;
   creditLimitDetails: ICreditLimitMaintenance;
   informations = CreditLimitMaintenance.informations;
   clientDetails: IClientDetails;
   isAllowToApply: boolean;
   maritalStatusCode: string[];
   declaration: string;

   constructor(private clientPreferences: ClientProfileDetailsService,
      private creditLimitService: CreditLimitService) { }

   ngOnInit() {
      this.creditLimitDetails = {} as ICreditLimitMaintenance;
      this.isTooltipOpen = false;
      this.isAccept = false;
      this.isAllowToApply = false;
      this.getClientPreferenceDetails();
   }
   onClose(event) {
      this.isRequestCreditLimit = event;
      this.changeRequestCreditLimit.emit(this.isRequestCreditLimit);
   }
   getClientPreferenceDetails() {
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      this.isAllowToApply = true;
      this.declaration = this.messages.declarationOnlyForMe;
      if (this.clientDetails.MaritalStatus === this.informations.maritalStatus[2].value) {
         if (this.clientDetails.MarriageType === this.informations.marriageType[1].value
            || this.clientDetails.MarriageType === this.informations.marriageType[2].value) {
            this.creditLimitDetails.primaryClientDebtReview = this.labels.debtReview;
            this.creditLimitDetails.spouseDebtReview = '';
         } else if (this.clientDetails.MarriageType === this.informations.marriageType[0].value) {
            this.creditLimitDetails.primaryClientDebtReview = this.labels.debtReview;
            this.creditLimitDetails.spouseDebtReview = this.labels.debtReview;
            this.declaration = this.messages.declarationForMeAndSpouse;
         } else {
            this.isAllowToApply = false;
         }
      } else {
         this.creditLimitDetails.primaryClientDebtReview = this.labels.debtReview;
         this.creditLimitDetails.spouseDebtReview = '';
      }
   }
   openTooltip() {
      this.isTooltipOpen = !this.isTooltipOpen;
   }
   onAccept() {
      if (this.isAllowToApply) {
         this.isAccept = !this.isAccept;
      }
   }
   getStarted() {
      if (this.isAccept) {
         this.creditLimitService.setCreditLimitMaintenanceDetails(this.creditLimitDetails);
         this.changeRequestCreditLimit.emit(this.isRequestCreditLimit);
      }
   }
}

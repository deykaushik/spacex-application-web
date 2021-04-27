import { Component, Input, Output, OnChanges, EventEmitter, Injector } from '@angular/core';
import { FormBuilder, Validators, NgModel } from '@angular/forms';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { IAccountBalanceDetail, IChangeOverdraftLimitRequest, IClientDetails, IPhoneNumber } from '../../../core/services/models';
import { AccountService } from '../../account.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-overdraft-limit-cancel',
   templateUrl: './overdraft-limit-cancel.component.html',
   styleUrls: ['./overdraft-limit-cancel.component.scss']
})
export class OverdraftLimitCancelComponent extends BaseComponent implements OnChanges {

   @Input() accountBalanceDetails: IAccountBalanceDetail;
   @Input() isVisible: boolean;
   @Input() itemAccountId: string;
   @Output() backToCard: EventEmitter<boolean> = new EventEmitter<boolean>();
   changeOverdraftLimitRequest: IChangeOverdraftLimitRequest;
   patterns = Constants.patterns;
   label = Constants.labels.overdraft;
   value = Constants.VariableValues.overdraft;
   message = Constants.messages;
   clientDetails: IClientDetails;
   changeLimitButton: boolean;
   isOverdraftSuccess: boolean;
   isFicaNotCompliant: boolean;
   isPhoneNumberValid: boolean;
   isEmailValid: boolean;
   showLoader: boolean;
   skeletonMode: boolean;
   emailAddress: string;
   cellNumber: string;
   reasonText: string;
   reasonLimit: number;
   reasonInfo: string;

   constructor(private accountService: AccountService, private clientPreferences: ClientProfileDetailsService, injector: Injector) {
      super(injector);
   }

   ngOnChanges() {
      this.reasonText = '';
      this.isOverdraftSuccess = false;
      this.isFicaNotCompliant = false;
      this.reasonLimit = this.value.maxCharacter;
      this.reasonInfo = this.reasonText.length + '/' + this.reasonLimit;
      this.getClientDetail();
   }

   /* Get client details to populate client default email and phone number */
   getClientDetail() {
      this.skeletonMode = true;
      this.reasonText = '';
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      this.cellNumber = this.clientDetails.CellNumber;
      this.emailAddress = this.clientDetails.EmailAddress;
      this.onEmailChange();
      this.skeletonMode = false;
   }

   closeOverlay(event: boolean) {
      this.backToCard.emit(event);
   }

   odChangeReason() {
      this.reasonInfo = this.reasonText.length + '/' + this.reasonLimit;
   }

   /* To cancel the overdraft limit */
   cancelAccountOverdraftLimit() {
      if (this.isPhoneNumberValid && this.isEmailValid && !this.showLoader) {
         const submitGAEvent = GAEvents.manageOverdraft.submit;
         this.sendEvent(submitGAEvent.eventAction, submitGAEvent.label, null, submitGAEvent.category);
         this.showLoader = true;
         this.changeOverdraftLimitRequest = {
            requestType: this.value.cancelRequestType,
            itemAccountId: this.itemAccountId,
            newOverdraftLimit: 0,
            currentOverdraftLimit: this.accountBalanceDetails.overdraftLimit,
            email: this.emailAddress,
            phoneNumber: this.cellNumber.replace(this.patterns.replaceSpace, ''),
            reason: this.reasonText
         };
         this.accountService.changeAccountOverdraftLimit(this.changeOverdraftLimitRequest)
            .subscribe((response) => {
               this.showLoader = false;
               if (response.result === this.value.successCode) {
                  this.isOverdraftSuccess = true;
               }
               if (response.result === this.value.ficaCode) {
                  this.isFicaNotCompliant = true;
               }
            }, error => {
               this.showLoader = false;
            });
      }
   }

   /* Get phone number with validation */
   getPhoneNumber(validPhoneNumber: IPhoneNumber) {
      this.cellNumber = validPhoneNumber.phoneNumber;
      this.isPhoneNumberValid = validPhoneNumber.isValid;
   }

   /* Validate email and return error if any */
   onEmailChange() {
      this.isEmailValid = CommonUtility.isValidEmail(this.emailAddress);
   }
}

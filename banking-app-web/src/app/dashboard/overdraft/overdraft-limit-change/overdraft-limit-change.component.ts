import { Component, Input, Output, OnChanges, EventEmitter, Injector } from '@angular/core';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { IAccountBalanceDetail, IChangeOverdraftLimitRequest, IClientDetails, IValidation } from '../../../core/services/models';
import { IRangeSliderConfig } from '../../../shared/models';
import { AccountService } from '../../account.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { NgModel } from '@angular/forms';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-overdraft-limit-change',
   templateUrl: './overdraft-limit-change.component.html',
   styleUrls: ['./overdraft-limit-change.component.scss']
})
export class OverdraftLimitChangeComponent extends BaseComponent implements OnChanges {
   @Input() accountBalanceDetails: IAccountBalanceDetail;
   @Input() isVisible: boolean;
   @Input() itemAccountId: string;

   @Output() backToCard: EventEmitter<boolean> = new EventEmitter<boolean>();
   newOverdraftLimit: number;
   config: IRangeSliderConfig;

   patterns = Constants.patterns;
   label = Constants.labels.overdraft;
   value = Constants.VariableValues.overdraft;
   message = Constants.messages;
   changeOverdraftLimitRequest: IChangeOverdraftLimitRequest;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   clientDetails: IClientDetails;
   isFicaNotCompliant: boolean;
   isOverdraftSuccess: boolean;
   emailAddress: string;
   cellNumber: string;
   multipleOfHundredMsg: boolean;
   invalidAmount: boolean;
   sameAmount: boolean;
   isPhoneNumberValid: boolean;
   isButtonDisable: boolean;
   isEmailValid: boolean;
   showLoader: boolean;
   skeletonMode: boolean;
   newLimitNumberLength: number;
   isNewOverdraftLimitValid: boolean;
   errorMessage: string;
   minOverdraftLimit: string;
   maxOverdraftLimit: string;

   constructor(private accountService: AccountService, private clientPreferences: ClientProfileDetailsService, injector: Injector) {
      super(injector);
   }

   ngOnChanges() {
      this.skeletonMode = true;
      this.getOverdraftValidations();
      this.isOverdraftSuccess = false;
      this.isFicaNotCompliant = false;
      this.isPhoneNumberValid = true;
      this.getClientDetail();
      // As per user story new overdraft value will be -1000 of current overdraft.
      this.newOverdraftLimit = this.accountBalanceDetails.overdraftLimit - this.value.newOverdraftLimitValue;
      this.newOverdraftLimitChange(this.newOverdraftLimit);
   }

   closeOverlay(event: boolean) {
      this.backToCard.emit(event);
   }

   /* Get validations */
   getOverdraftValidations() {
      const query = { 'validationType': 'Overdraft' };
      this.accountService.getOverdraftValidations(query).subscribe((validations: IValidation[]) => {
         validations[0].setting.filter(key => {
            if (key.validationKey === 'Minimum') { this.minOverdraftLimit = key.validationValue; }
            if (key.validationKey === 'Maximum') { this.maxOverdraftLimit = key.validationValue; }
         });
         this.config = {
            min: parseInt(this.minOverdraftLimit, 10),
            max: parseInt(this.maxOverdraftLimit, 10),
            step: 1000
         };
         this.skeletonMode = false;
      });
   }

   onSliderValueChanged(value) {
      this.newOverdraftLimit = value;
      this.newOverdraftLimitChange(value);
   }

   /* */
   newOverdraftLimitChange(value) {
      this.sameAmount = (Math.abs(parseInt(value, 10)) === this.accountBalanceDetails.overdraftLimit) ? true : false;
      this.invalidAmount = (parseInt(value, 10) > this.value.maxOverdraftLimit) || !(Number.isInteger(value / 100)) ? true : false;
      this.multipleOfHundredMsg = parseInt(value, 10) !== 0;
      this.isNewOverdraftLimitValid = (!this.multipleOfHundredMsg || this.invalidAmount || this.sameAmount) ? true : false;
      this.newOverdraftLimit = Math.abs(value);
   }

   /* Get client details to populate client default email and phone number */
   getClientDetail() {
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      this.cellNumber = this.clientDetails.CellNumber;
      this.emailAddress = this.clientDetails.EmailAddress;
      this.onEmailChange();
   }

   /* Change the overdraft limit */
   changeAccountOverdraftLimit() {
      if (this.isPhoneNumberValid && this.isEmailValid && !this.isNewOverdraftLimitValid && !this.showLoader) {
         const submitGAEvent = GAEvents.manageOverdraft.submit;
         this.sendEvent(submitGAEvent.eventAction, submitGAEvent.label, null, submitGAEvent.category);
         this.logEventForChangeLimit();
         this.showLoader = true;
         this.changeOverdraftLimitRequest = {
            requestType: this.value.changeRequestType,
            itemAccountId: this.itemAccountId,
            newOverdraftLimit: this.newOverdraftLimit,
            currentOverdraftLimit: this.accountBalanceDetails.overdraftLimit,
            email: this.emailAddress,
            phoneNumber: this.cellNumber.replace(this.patterns.replaceSpace, ''),
            reason: ''
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
   getPhoneNumber(validPhoneNumber) {
      this.cellNumber = validPhoneNumber.phoneNumber;
      this.isPhoneNumberValid = validPhoneNumber.isValid;
   }

   /* Validate email and return error if any */
   onEmailChange() {
      this.isEmailValid = CommonUtility.isValidEmail(this.emailAddress);
   }

   // This function to log an event for increse and decrese limit
   logEventForChangeLimit() {
      if (this.newOverdraftLimit < this.accountBalanceDetails.overdraftLimit) {
         const decreaseGAEvent = GAEvents.manageOverdraft.decrease;
         this.sendEvent(decreaseGAEvent.eventAction, decreaseGAEvent.label, null, decreaseGAEvent.category);
      } else {
         const increaseGAEvent = GAEvents.manageOverdraft.increase;
         this.sendEvent(increaseGAEvent.eventAction, increaseGAEvent.label, null, increaseGAEvent.category);
      }
   }
}

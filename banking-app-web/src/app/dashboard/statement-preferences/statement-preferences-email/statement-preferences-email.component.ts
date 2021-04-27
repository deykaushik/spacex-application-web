import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { StatementPreferencesConstants } from '../statement-preferences-constants';
import { IButtonGroup } from '../../../core/utils/models';
import { IStatementPreferences, IStatementDetails } from '../../../core/services/models';
import { AccountService } from '../../account.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { CommonUtility } from '../../../core/utils/common';

@Component({
   selector: 'app-statement-preferences-email',
   templateUrl: './statement-preferences-email.component.html',
   styleUrls: ['./statement-preferences-email.component.scss']
})
export class StatementPreferencesEmailComponent implements OnInit {

   constants = Constants.VariableValues;
   labels = StatementPreferencesConstants.labels;
   informations = StatementPreferencesConstants.informations;
   variableValues = StatementPreferencesConstants.variableValues;
   patterns = Constants.patterns;
   messages = Constants.messages;
   statementMessage = StatementPreferencesConstants.messages;
   @Input() statementDetails: IStatementDetails;
   @Input() buttonName: string;
   @Input() buttonGroup: IButtonGroup[];
   @Input() statementPreferencesDetails: IStatementPreferences;
   @Output() changeStatementPreferencesDetails = new EventEmitter<IStatementPreferences>();
   @Output() changeNotification = new EventEmitter<boolean>();
   secondaryEmailVisible = false;
   addSecondaryEmailOption = true;
   isCasa: boolean;
   isMfc: boolean;
   isValidPrimaryEmail: boolean;
   isValidSecondaryEmail: boolean;
   isRequired: boolean;
   checkSame: boolean;

   constructor() { }
   ngOnInit() {
      this.isCasa = false;
      this.isMfc = false;
      this.isRequired = false;
      this.isValidPrimaryEmail = false;
      this.isValidSecondaryEmail = false;
      if (this.statementPreferencesDetails) {
         if (!this.statementPreferencesDetails.email) {
            this.statementPreferencesDetails.email = [];
         } else if (this.statementPreferencesDetails.email[this.variableValues.one] &&
            this.statementPreferencesDetails.email[this.variableValues.one] !== '') {
            this.addSecondaryEmailOption = false;
            this.secondaryEmailVisible = true;
         } else {
            this.addSecondaryEmailOption = true;
            this.secondaryEmailVisible = false;
         }
      }

      if (CommonUtility.isCasaAccount(this.statementDetails.accountType)) {
         this.isCasa = true;
      } else if (this.statementDetails.accountType === this.constants.accountTypes.mfcvafLoanAccountType.code) {
         this.isMfc = true;
      }
   }

   // to update statement preferences details
   // to emit the details of statement preferences
   updateStatementPreferences(statementPreferencesDetails: NgForm) {
      const regEx = new RegExp(Constants.patterns.email);
      if (statementPreferencesDetails.value.primaryEmail &&
         regEx.test(statementPreferencesDetails.value.primaryEmail)) {
         if (!statementPreferencesDetails.value.secondaryEmail) {
            this.deleteSecondaryEmail();
         } else if (statementPreferencesDetails.value.secondaryEmail &&
            regEx.test(statementPreferencesDetails.value.secondaryEmail)) {
            this.statementPreferencesDetails.email[this.variableValues.one]
               = statementPreferencesDetails.value.secondaryEmail;
         } else {
            return false;
         }
         this.statementPreferencesDetails.email[this.variableValues.zero]
            = statementPreferencesDetails.value.primaryEmail;
         this.changeStatementPreferencesDetails.emit(this.statementPreferencesDetails);
         this.statementDetails.isGroupDisabled = true;
      } else {
         return false;
      }

   }

   // to add alternative mail
   // to open the alternative mail box.
   addSecondaryEmail() {
      this.onFocus();
      this.addSecondaryEmailOption = false;
      this.secondaryEmailVisible = true;
   }

   // to delete the alternative mail
   deleteSecondaryEmail() {
      this.onFocus();
      if (this.statementPreferencesDetails.email[this.variableValues.one]) {
         this.statementPreferencesDetails.email.pop();
      }
      this.addSecondaryEmailOption = true;
      this.secondaryEmailVisible = false;
   }
   // To enablw the edit mode when user placed the cursor in input field.
   onFocus() {
      this.changeNotification.emit(true);
      this.statementDetails.isGroupDisabled = false;
   }

   checkEqual(statementPreferencesEmailForm) {
      if (statementPreferencesEmailForm && statementPreferencesEmailForm.form
         && statementPreferencesEmailForm.form.controls.primaryEmail.value
         && statementPreferencesEmailForm.form.controls.secondaryEmail.value) {
         const pEmail = statementPreferencesEmailForm.form.controls.primaryEmail.value.toLowerCase();
         const sEmail = statementPreferencesEmailForm.form.controls.secondaryEmail.value.toLowerCase();
         if (pEmail === sEmail) {
            this.checkSame = true;
         } else {
            this.checkSame = false;
         }
      }
   }
   isDisable(event) {
      return (this.statementDetails.isGroupDisabled || !this.statementPreferencesDetails.deliveryMode
         || this.statementDetails.inProgress || event) ? true : false;
   }
   onPrimaryEmailChange(primaryEmail: string) {
      this.isRequired = primaryEmail ? false : true;
      this.isValidPrimaryEmail = CommonUtility.isValidEmail(primaryEmail);
   }
   onSecondaryEmailChange(secondaryEmail: string) {
      this.isValidSecondaryEmail = CommonUtility.isValidEmail(secondaryEmail);
   }
}

import { Component, OnInit, Input, Injector } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import * as moment from 'moment';
import { Moment } from 'moment';
import { IDatePickerConfig } from 'ng2-date-picker';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { IClientDetails, IDocumentSendRequest, IAlertMessage } from '../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { AccountService } from '../../account.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { AlertActionType, AlertMessageType } from '../../../shared/enums';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-statement',
   templateUrl: './statement.component.html',
   styleUrls: ['./statement.component.scss']
})
export class StatementComponent extends BaseComponent implements OnInit {
   @Input() itemAccountId: string;
   @Input() accountType: string;
   labels = Constants.labels.statementAndDocument.statements;
   values = Constants.VariableValues.statementAndDocument;
   messages = Constants.messages.statementAndDocument.statement;
   accountTypes = Constants.VariableValues.accountTypes;
   formats = Constants.formats;
   maxToDate: Moment;
   maxFromDate: Moment;
   toCalendarConfig: IDatePickerConfig;
   fromCalendarConfig: IDatePickerConfig;
   clientDetails: IClientDetails;
   email: string;
   pattern = Constants.patterns;
   isEmailValid: boolean;
   showLoader: boolean;
   infoMessage: string;
   request: IDocumentSendRequest;
   alertMessage: IAlertMessage;
   toDate: Date;
   fromDate: Date;
   validDate: boolean;
   isMfcStatement: boolean;
   title: string;

   constructor(private clientPreferences: ClientProfileDetailsService, private accountService: AccountService,
      private systemErrorService: SystemErrorService, injector: Injector) {
         super(injector);
   }

   ngOnInit() {
      this.validDate = true;
      this.infoMessage = this.accountType === this.accountTypes.homeLoanAccountType.code ? this.labels.infoForHl : this.labels.infoForPl;
      this.setCalendarConfig();
      this.getClientDetails();
      this.getMfcInfo();
   }
   getMfcInfo() {
      this.isMfcStatement = CommonUtility.isMfcvafLoan(this.accountType);
      if (this.isMfcStatement) {
         this.infoMessage = this.labels.infoForMfc;
         this.title = this.labels.mfcTitle;
      }
   }
   getClientDetails() {
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      if (this.clientDetails) {
         this.email = this.clientDetails.EmailAddress;
         this.emailChange();
      }
   }

   private setCalendarConfig() {
      this.maxToDate = moment();
      this.maxFromDate = moment().subtract(this.values.minMonth, 'months');
      this.toCalendarConfig = {
         format: Constants.formats.fullDate,
         disableKeypress: true,
         max: moment(),
         min: moment().subtract(this.values.minYears, 'years'),
         showGoToCurrent: false,
         monthFormat: Constants.formats.monthFormat,
         openOnFocus: false
      };
      this.fromCalendarConfig = {
         format: Constants.formats.fullDate,
         disableKeypress: true,
         max: moment(),
         min: moment().subtract(this.values.minYears, 'years'),
         showGoToCurrent: false,
         monthFormat: Constants.formats.monthFormat,
         openOnFocus: false
      };
   }

   emailChange() {
      this.isEmailValid = CommonUtility.isValidEmail(this.email);
   }

   setToDate(toDate) {
      this.toDate = toDate;
      this.validDate = this.toDate >= this.fromDate ? true : false;
   }

   setFromDate(fromDate) {
      this.fromDate = fromDate;
      this.validDate = this.toDate >= this.fromDate ? true : false;
   }

   sendStatementEmail() {
      if (!this.showLoader && this.isEmailValid && this.validDate) {
         this.showLoader = true;
         this.accountService.sendPaidUpLetter(this.getRequest())
            .finally(() => {
               this.showLoader = false;
            })
            .subscribe(response => {
               if (this.accountService.isTransactionDetailsSuccess(response)) {
                  this.statementSuccessEvent();
                  this.accountService.showAlertMessage(this.getSuccessMessage());
               } else {
                  this.accountService.showAlertMessage(this.getErrorMessage());
               }
            }, (error) => {
               this.systemErrorService.closeError();
               this.accountService.showAlertMessage(this.getErrorMessage());
            });
      }
   }

   getRequest() {
      if (this.isMfcStatement) {
         this.request = {
            documentType: this.values.mfcDocumentType,
            itemAccountId: this.itemAccountId,
            emailId: this.email
         };

      } else {
         this.request = {
            documentType: this.accountType === this.accountTypes.homeLoanAccountType.code ?
               this.values.hlDocumentType : this.values.plDocumentType,
            itemAccountId: this.itemAccountId,
            emailId: this.email,
            fromDate: this.fromDate,
            toDate: this.toDate
         };
      }
      return this.request;
   }

   getSuccessMessage() {
      if (this.isMfcStatement) {
         return this.alertMessage = {
            showAlert: true,
            displayMessageText: this.messages.mfcStatementSuccess,
            action: AlertActionType.Close,
            alertType: AlertMessageType.Success
         };
      } else {
         return this.alertMessage = {
            showAlert: true,
            displayMessageText: this.accountType === this.accountTypes.homeLoanAccountType.code ?
               this.messages.hlStatementSuccess : this.messages.plStatementSuccess,
            action: AlertActionType.Close,
            alertType: AlertMessageType.Success
         };
      }
   }

   getErrorMessage() {
      return this.alertMessage = {
         showAlert: true,
         displayMessageText: this.messages.plHlStatementError,
         action: AlertActionType.Close,
         alertType: AlertMessageType.Error
      };
   }

   statementSuccessEvent() {
      const category = CommonUtility.format(GAEvents.statementsAndDocuments.success.category,
         CommonUtility.isMfcvafLoan(this.accountType) ?
            Constants.VariableValues.statementAndDocument.mfc : this.accountType.toLowerCase());
      const eventAction = CommonUtility.format(GAEvents.statementsAndDocuments.success.eventAction,
         CommonUtility.isMfcvafLoan(this.accountType) ?
            Constants.VariableValues.statementAndDocument.mfc : this.accountType.toLowerCase(),
         Constants.VariableValues.statementAndDocument.statement.toLowerCase());
      this.sendEvent(eventAction, GAEvents.statementsAndDocuments.success.label, null, category);
   }
}

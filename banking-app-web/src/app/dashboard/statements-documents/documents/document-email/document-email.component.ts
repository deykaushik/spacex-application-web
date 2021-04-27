import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { IDatePickerConfig } from 'ng2-date-picker';
import { AccountService } from '../../../account.service';
import { SystemErrorService } from '../../../../core/services/system-services.service';
import { IAlertMessage, IDocumentSendRequest, IClientDetails } from '../../../../core/services/models';
import { Constants } from '../../../../core/utils/constants';
import { CommonUtility } from '../../../../core/utils/common';
import { AlertActionType, AlertMessageType } from '../../../../shared/enums';
import { GAEvents } from '../../../../core/utils/ga-event';
import { BaseComponent } from '../../../../core/components/base/base.component';

@Component({
   selector: 'app-document-email',
   templateUrl: './document-email.component.html',
   styleUrls: ['./document-email.component.scss']
})
export class DocumentEmailComponent extends BaseComponent implements OnInit {

   @Input() documentType: string;
   @Input() clientEmail: string;
   @Input() itemAccountId: string;
   @Input() index: number;
   @Input() title: string;
   @Input() accountType: string;
   @Output() toggleDocumentType: EventEmitter<number> = new EventEmitter<number>();

   labels = Constants.labels.statementAndDocument.documents;
   values = Constants.VariableValues.statementAndDocument;
   messages = Constants.messages.statementAndDocument.documents;
   formats = Constants.formats;
   accountTypes = Constants.VariableValues.accountTypes;
   maxToDate: Moment;
   maxFromDate: Moment;
   toCalendarConfig: IDatePickerConfig;
   fromCalendarConfig: IDatePickerConfig;
   clientDetails: IClientDetails;
   successMessage: string;
   errorMessage: string;
   pattern = Constants.patterns;
   infoMessage: string;
   isEmailValid: boolean;
   email: string;
   alertMessage: IAlertMessage;
   request: IDocumentSendRequest;
   showLoader: boolean;
   toDate: Date;
   fromDate: Date;
   validDate: boolean;
   isMfcTaxCertificate: boolean;

   constructor(private accountService: AccountService, private systemErrorService: SystemErrorService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.isMfcTaxCertificate = this.documentType === this.values.mfcTaxCertificate;
      this.setCalendarConfig();
      switch (this.accountType) {
         case this.accountTypes.homeLoanAccountType.code:
            this.infoMessage = CommonUtility.format(this.labels.hlInfo, this.title.toLowerCase());
            this.successMessage = CommonUtility.format(this.messages.hlSuccess, this.title.toLowerCase());
            this.errorMessage = CommonUtility.format(this.messages.hlError, this.title.toLowerCase());
            break;
         case this.accountTypes.personalLoanAccountType.code:
            this.infoMessage = this.labels.plInfo;
            this.successMessage = this.messages.plSuccess;
            this.errorMessage = this.messages.plError;
            break;
         case this.accountTypes.mfcvafLoanAccountType.code:
            this.infoMessage = CommonUtility.format(this.labels.mfcInfo, this.title.toLowerCase());
            this.successMessage = CommonUtility.format(this.messages.mfcSuccess, this.title.toLowerCase());
            this.errorMessage = CommonUtility.format(this.messages.mfcError, this.title.toLowerCase());
            break;
      }
   }

   emailChange() {
      this.isEmailValid = CommonUtility.isValidEmail(this.email);
   }

   closeToggleDocumentType(index) {
      this.toggleDocumentType.emit(index);
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

   setToDate(toDate) {
      this.toDate = toDate;
      this.validDate = this.toDate >= this.fromDate ? true : false;
   }

   setFromDate(fromDate) {
      this.fromDate = fromDate;
   }

   sendEmail() {
      if (!this.showLoader && this.isEmailValid) {
         this.showLoader = true;
         this.accountService.sendPaidUpLetter(this.getRequest())
            .finally(() => {
               this.showLoader = false;
            })
            .subscribe(response => {
               if (this.accountService.isTransactionDetailsSuccess(response)) {
                  this.accountService.showAlertMessage(this.getSuccessMessage());
                  this.toggleDocumentType.emit(this.index);
                  this.sendGAEvent();
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
      if (this.isMfcTaxCertificate) {
         this.request = {
            documentType: this.documentType,
            itemAccountId: this.itemAccountId,
            emailId: this.email,
            fromDate: this.fromDate,
            toDate: this.toDate
         };
      } else {
         this.request = {
            documentType: this.documentType,
            itemAccountId: this.itemAccountId,
            emailId: this.email
         };
      }
      return this.request;
   }

   getSuccessMessage() {
      return this.alertMessage = {
         showAlert: true,
         displayMessageText: this.successMessage,
         action: AlertActionType.Close,
         alertType: AlertMessageType.Success,
      };
   }

   getErrorMessage() {
      return this.alertMessage = {
         showAlert: true,
         displayMessageText: this.errorMessage,
         action: AlertActionType.Close,
         alertType: AlertMessageType.Error,
      };
   }

   sendGAEvent() {
      const category = CommonUtility.format(GAEvents.statementsAndDocuments.success.category,
         CommonUtility.isMfcvafLoan(this.accountType) ?
            Constants.VariableValues.statementAndDocument.mfc : this.accountType.toLowerCase());
      const eventAction = CommonUtility.format(GAEvents.statementsAndDocuments.success.eventAction,
         CommonUtility.isMfcvafLoan(this.accountType) ?
            Constants.VariableValues.statementAndDocument.mfc : this.accountType.toLowerCase(), this.title.toLowerCase());
      this.sendEvent(eventAction, GAEvents.statementsAndDocuments.success.label, null, category);
   }
}

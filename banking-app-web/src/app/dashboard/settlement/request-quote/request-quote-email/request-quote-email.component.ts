import { Component, OnInit, ViewChild, Output, Input, EventEmitter, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../../account.service';
import { SystemErrorService } from './../../../../core/services/system-services.service';
import { ClientProfileDetailsService } from '../../../../core/services/client-profile-details.service';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { Constants } from '../../../../core/utils/constants';
import { CommonUtility } from '../../../../core/utils/common';
import { IApiResponse, ISettlementQuote } from '../../../../core/services/models';
import { GAEvents } from '../../../../core/utils/ga-event';

@Component({
   selector: 'app-request-quote-email',
   templateUrl: './request-quote-email.component.html',
   styleUrls: ['./request-quote-email.component.scss']
})
export class RequestQuoteEmailComponent extends BaseComponent implements OnInit {

   @Input() accountId: string;
   @Input() accountType: string;
   @Input() navigateFrom: string;
   @Output() onClose = new EventEmitter<boolean>();

   @ViewChild('settlementQuoteForm') settlementQuoteForm;

   btnTxt: string;
   recipientEmail: string;
   isOverlay: boolean;
   isSettlementQuoteTemplate: boolean;
   isSuccessPage: boolean;
   isValidForm: boolean;
   retryLimitExceeded: boolean;
   retryCount = 0;
   requestInProgress: boolean;
   emailPattern = Constants.patterns.email;
   messages = Constants.messages.settlement.quoteRequest;
   labels = Constants.labels.settlement.quoteRequest;
   values = Constants.VariableValues.settlement;
   isValidEmail: boolean;
   placeHolder: string;
   retryBtnText = this.labels.tryAgain;
   isPLSettlementQuote = false;
   isMFCSettlementQuote = false;
   isHLSettlementQuote= false;

   constructor(private accountService: AccountService, private router: Router,
      private systemErrorService: SystemErrorService, injector: Injector,
      private clientPreferences: ClientProfileDetailsService) {
      super(injector);
   }

   ngOnInit() {
      this.isOverlay = true;
      this.retryLimitExceeded = false;
      this.requestInProgress = false;
      this.isSettlementQuoteTemplate = true;
      if (CommonUtility.isMfcvafLoan(this.accountType)) {
         this.isMFCSettlementQuote = true;
         this.btnTxt = Constants.labels.settlement.buttons.cancel;
      } else if (CommonUtility.isHomeLoan(this.accountType)) {
         this.isHLSettlementQuote = true;
         this.btnTxt = Constants.labels.settlement.buttons.cancel;
         this.getDefaultEmail();
      } else {
         this.isPLSettlementQuote = true;
         this.btnTxt = Constants.labels.settlement.buttons.close;
         this.getDefaultEmail();
      }
      this.getPlaceHolder();
   }

   getDefaultEmail() {
      const clientDetails = this.clientPreferences.getClientPreferenceDetails();
      this.recipientEmail = clientDetails && clientDetails.EmailAddress ? clientDetails.EmailAddress : '';
      this.onEmailChange(this.recipientEmail);
   }

   closeOverlay() {
      this.isOverlay = false;
      if (this.accountId && this.navigateFrom &&
         (this.navigateFrom === this.values.navigateFromDirectPay ||
            this.navigateFrom === this.values.navigateFromRequestQuote)
      ) {
         this.onClose.emit(true);
      } else {
         this.router.navigateByUrl(encodeURI(Constants.routeUrls.accountDetail + this.accountId));
      }
   }

   validate() {
      return this.settlementQuoteForm && this.settlementQuoteForm.valid
         && (this.recipientEmail ? CommonUtility.isValidEmail(this.recipientEmail) : false);
   }

   send(event: any) {
      if (event != null) {
         event.preventDefault();
         event.stopPropagation();
      }
      if (this.validate()) {
         this.sendSettlementQuote();
      }
   }

   settlementQuote() {
      const settlementQuote = {} as ISettlementQuote;
      settlementQuote.emailId = this.recipientEmail;
      settlementQuote.itemAccountId = this.accountId;
      return settlementQuote;
   }

   sendSettlementQuote() {
      if (this.retryCount <= this.values.quoteRequest.tryAgainLimit) {
         this.requestInProgress = true;
         this.accountService.sendSettlementQuote(this.settlementQuote(), this.accountType)
            .finally(() => {
               this.disableQuoteTemplate(false);
               this.retryLimitExceeded = this.retryCount === this.values.quoteRequest.tryAgainLimit;
               if (this.retryLimitExceeded && CommonUtility.isHomeLoan(this.accountType)) {
                  this.retryBtnText = this.labels.dismiss;
                  this.retryLimitExceeded = false;
               } else if (this.retryLimitExceeded && !CommonUtility.isHomeLoan(this.accountType)) {
                  this.closeOverlay();
               }
            })
            .subscribe((response: IApiResponse) => {
               const resp = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.settlementQuote);
               if (resp.isValid) {
                  this.isSuccessPage = true;
                  if (CommonUtility.isMfcvafLoan(this.accountType)) {
                     this.btnTxt = Constants.labels.settlement.buttons.close;
                     const sentEmailQuoteGAEvents = Constants.GAEventList.settlement.MFC.sentEmailQuote;
                     this.sendEvent(sentEmailQuoteGAEvents.action, sentEmailQuoteGAEvents.label, null, sentEmailQuoteGAEvents.category);
                  } else if (CommonUtility.isHomeLoan(this.accountType)) {
                     this.btnTxt = Constants.labels.settlement.buttons.close;
                     const sentEmailQuoteGAEvents = GAEvents.hlSettlement.quoteEmailSuccess;
                     this.sendEvent(sentEmailQuoteGAEvents.eventAction, sentEmailQuoteGAEvents.label, null,
                        sentEmailQuoteGAEvents.category);
                  } else {
                     const plsettlementQuoteSuccessGAEvents = GAEvents.personalLoanSettlement.settlementQuoteSuccess;
                     this.sendEvent(plsettlementQuoteSuccessGAEvents.eventAction, plsettlementQuoteSuccessGAEvents.label,
                        null, plsettlementQuoteSuccessGAEvents.category);
                  }
               } else {
                  this.isSuccessPage = false;
                  if (CommonUtility.isMfcvafLoan(this.accountType) || CommonUtility.isHomeLoan(this.accountType)) {
                     this.btnTxt = Constants.labels.settlement.buttons.close;
                  }
               }
               this.disableQuoteTemplate(false);
            }, (error) => {
               this.systemErrorService.closeError();
               this.isSuccessPage = false;
               if (CommonUtility.isMfcvafLoan(this.accountType) || CommonUtility.isHomeLoan(this.accountType)) {
                  this.btnTxt = Constants.labels.settlement.buttons.close;
               }
            });
      } else {
         this.retryLimitExceeded = true;
         this.closeOverlay();
      }
   }

   onRetryQuote() {
      this.retryCount++;
      this.sendSettlementQuote();
   }

   disableQuoteTemplate(value: boolean) {
      this.isSettlementQuoteTemplate = value;
      this.requestInProgress = value;
   }

   onEmailChange(recipientEmail: string) {
      this.isValidEmail = CommonUtility.isValidEmail(recipientEmail);
   }

   getPlaceHolder() {
      this.placeHolder = CommonUtility.isMfcvafLoan(this.accountType) ? this.labels.placeHolder : '';
   }

}

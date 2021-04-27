import { Component, Input, OnInit, TemplateRef, ViewChild, EventEmitter, Output, Injector, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AccountService } from '../../account.service';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { RequestQuoteEmailComponent } from './request-quote-email/request-quote-email.component';
import { SettlementTermsComponent } from '../direct-pay/settlement-terms/settlement-terms.component';
import { DirectPayComponent } from '../direct-pay/direct-pay.component';
import { BaseComponent } from '../../../core/components/base/base.component';
import { RequestQuoteStatusComponent } from './request-quote-status/request-quote-status.component';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { ISettlementDetail, IDashboardAccount, IApiResponse, ITransactionStatus } from '../../../core/services/models';
import { ISettlementNotificationTypes } from '../../../core/utils/enums';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-request-quote',
   templateUrl: './request-quote.component.html',
   styleUrls: ['./request-quote.component.scss']
})
export class RequestQuoteComponent extends BaseComponent implements OnInit, OnDestroy {

   @Input() accountId: string;
   @Input() navigateFrom: string;
   @Output() onClose = new EventEmitter<boolean>();

   selectedTemplate: TemplateRef<any>;
   settlementDetails: ISettlementDetail;
   selectedAccount: any;
   accountType: string;
   btnText: string;
   settlementDate: string;
   showLoader = false;
   isOverlayVisible: boolean;
   accountTypes = Constants.VariableValues.accountTypes;
   dateFormat = Constants.formats.momentDDMMMMYYYY;
   labels = Constants.labels.settlement.quoteRequest;
   navigateFromRequestQuote = Constants.VariableValues.settlement.navigateFromRequestQuote;
   values = Constants.VariableValues.settlement;
   query = this.values.termsSearchQuery;
   retryCount = 0;
   retryLimitExceeded = false;
   notificationTypes = ISettlementNotificationTypes;
   settlementQuoteStatus: ISettlementNotificationTypes = ISettlementNotificationTypes.None;
   isAccepted = false;
   isPLSettlementQuote: boolean;
   isMFCSettlementQuote: boolean;
   isHLSettlementQuote: boolean;
   accountHolderName: string;
   viewTCLink: string;
   loanDescription: string;

   @ViewChild('settlementQuoteTemplate') settlementQuoteTemplate: TemplateRef<RequestQuoteComponent>;
   @ViewChild('settlementQuoteEmailTemplate') settlementQuoteEmailTemplate: TemplateRef<RequestQuoteEmailComponent>;
   @ViewChild('termsTemplate') termsTemplate: TemplateRef<SettlementTermsComponent>;
   @ViewChild('directPayTemplate') directPayTemplate: TemplateRef<DirectPayComponent>;
   @ViewChild('settlementStatus') settlementStatus: TemplateRef<RequestQuoteStatusComponent>;
   @ViewChild('loadingTemplate') loadingTemplate: TemplateRef<any>;

   constructor(private route: ActivatedRoute, private accountService: AccountService, private router: Router,
      injector: Injector, private systemErrorService: SystemErrorService, private render: Renderer2) {
      super(injector);
      this.route.params.subscribe(params => {
         this.accountId = params.accountId;
      });
   }

   ngOnInit() {
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
      this.isPLSettlementQuote = false;
      this.isMFCSettlementQuote = false;
      this.isHLSettlementQuote = false;
      this.selectedAccount = this.accountService.getAccountData();
      if (this.selectedAccount && this.selectedAccount.ItemAccountId === this.accountId) {
         this.accountType = this.selectedAccount.AccountType;
      }
      this.findSettlementQuoteType();
   }

   findSettlementQuoteType() {
      switch (this.accountType) {
         case this.accountTypes.homeLoanAccountType.code:
            this.showHLSettlement();
            break;
         case this.accountTypes.mfcvafLoanAccountType.code:
            this.showMfcSettlement();
            break;
         case this.accountTypes.personalLoanAccountType.code:
            this.isPLSettlementQuote = true;
            break;
      }
   }

   showMfcSettlement() {
      this.isMFCSettlementQuote = true;
      this.isOverlayVisible = true;
      this.btnText = Constants.labels.settlement.buttons.cancel;
      this.selectedTemplate = this.loadingTemplate;
      this.viewTCLink = this.labels.viewTCLink;
      this.getSettlementDetails();
   }

   showHLSettlement() {
      this.isHLSettlementQuote = true;
      this.isOverlayVisible = true;
      this.btnText = Constants.labels.settlement.buttons.cancel;
      this.viewTCLink = this.labels.viewHLTCLink;
      this.accountHolderName = this.selectedAccount.accountHolderName;
      this.loanDescription = this.selectedAccount.loanDescription;
      this.selectedTemplate = this.loadingTemplate;
      this.getSettlementDetails();
   }

   getSettlementDetails() {
      if (this.retryCount <= this.values.quoteRequest.tryAgainLimit) {
         this.showLoader = true;
         this.accountService.getSettlementDetails(this.accountId)
            .finally(() => {
               this.disableShowLoader(false);
            })
            .subscribe((response: IApiResponse) => {
               if (response && response.data && response.metadata) {
                  const resp = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.settlementQuote);
                  this.handleSettlementData(resp, response);
               } else {
                  this.settlementQuoteStatus = this.notificationTypes.TechnicalError;
               }
            }, (error) => {
               this.systemErrorService.closeError();
               this.settlementQuoteStatus = this.notificationTypes.TechnicalError;
               this.showSettlementStatus();
            });
         this.retryLimitExceeded = this.retryCount === this.values.quoteRequest.tryAgainLimit;
      } else {
         this.retryLimitExceeded = true;
      }
   }

   handleSettlementData(status: ITransactionStatus, response: IApiResponse) {
      if (this.isMFCSettlementQuote) {
         if (status.isValid) {
            this.settlementDetails = response.data;
            if (this.settlementDetails.loanSettled) {
               this.settlementQuoteStatus = this.notificationTypes.ClosureProcess;
               this.showSettlementStatus();
            } else {
               this.setSettlementData();
            }
         } else if (status.result === Constants.statusCode.errorCodeR02) {
            this.settlementQuoteStatus = this.notificationTypes.QuoteGenerateError;
         } else if (status.result === Constants.statusCode.errorCodeR04) {
            this.settlementQuoteStatus = this.notificationTypes.TechnicalError;
         } else {
            this.settlementQuoteStatus = this.notificationTypes.TechnicalError;
         }
      } else if (this.isHLSettlementQuote) {
         if (status.isValid) {
            this.settlementDetails = response.data;
            this.setSettlementData();
         } else {
            this.settlementQuoteStatus = this.notificationTypes.TechnicalError;
         }
      }
   }

   disableShowLoader(value: boolean) {
      this.showLoader = value;
   }

   closeOverlay() {
      this.isOverlayVisible = false;
      if (this.isMFCSettlementQuote || this.isHLSettlementQuote) {
         this.router.navigateByUrl(encodeURI(Constants.routeUrls.accountDetail + this.accountId));
      }
   }

   showQuote() {
      this.selectedTemplate = this.settlementQuoteEmailTemplate;
   }

   showTerms() {
      this.selectedTemplate = this.termsTemplate;
   }

   showSettleLoan() {
      if (this.isMFCSettlementQuote) {
         const settlementLoanGAEvents = Constants.GAEventList.settlement.MFC.settleLoan;
         this.sendEvent(settlementLoanGAEvents.action, settlementLoanGAEvents.label, null, settlementLoanGAEvents.category);
      } else if (this.isHLSettlementQuote) {
         const settleLoanGAEvent = GAEvents.hlSettlement.settleLoan;
         this.sendEvent(settleLoanGAEvent.eventAction, settleLoanGAEvent.label, null, settleLoanGAEvent.category);
      }

      this.selectedTemplate = this.directPayTemplate;
   }

   showSettlementStatus() {
      this.btnText = Constants.labels.settlement.buttons.close;
      this.selectedTemplate = this.settlementStatus;
   }

   onEmailQuoteClose(isSettlementQuoteClose: boolean) {
      if (isSettlementQuoteClose) {
         this.selectedTemplate = this.settlementQuoteTemplate;
      }
   }

   onTermsClose(isTermsClose: boolean) {
      if (isTermsClose) {
         this.selectedTemplate = this.settlementQuoteTemplate;
      }
   }

   onDirectPayClose(isDirectPayClose: boolean) {
      if (isDirectPayClose) {
         this.selectedTemplate = this.settlementQuoteTemplate;
      }
   }

   setSettlementData() {
      this.btnText = Constants.labels.settlement.buttons.close;
      this.selectedTemplate = this.settlementQuoteTemplate;
      this.settlementDetails.accountToTransfer = this.selectedAccount;
      this.settlementDetails.accountToTransfer.AccountNumber = this.settlementDetails.loanAccountNumber;
      this.accountService.setSettlementData(this.settlementDetails);
      this.settlementDate = moment(this.settlementDetails.settlementDate).format(this.dateFormat);
      this.labels.validateDateInfo = CommonUtility.format(this.labels.validateDateInfo, this.settlementDate);
      if (this.isHLSettlementQuote) {
         this.settlementDetails.quoteRequestedOn = moment(this.settlementDetails.quoteRequestedOn).format(this.dateFormat);
         this.labels.quoteRequestedOn = CommonUtility.format(this.labels.quoteRequestedOn, this.settlementDetails.quoteRequestedOn);
         this.settlementDetails.quoteValidUntil = moment(this.settlementDetails.quoteValidUntil).format(this.dateFormat);
         this.labels.quoteValidUntil = CommonUtility.format(this.labels.quoteValidUntil, this.settlementDetails.quoteValidUntil);
      }
   }

   onRetrySettlementQuote(isRetried: boolean) {
      if (isRetried) {
         this.retryCount++;
         this.getSettlementDetails();
      } else {
         this.closeOverlay();
      }
   }

   getSettlementQuoteStatus(): boolean {
      return this.settlementQuoteStatus === this.notificationTypes.ClosureProcess ||
         this.settlementQuoteStatus === this.notificationTypes.TechnicalError ||
         this.settlementQuoteStatus === this.notificationTypes.QuoteGenerateError;
   }

   ngOnDestroy() {
      this.render.setStyle(document.body, 'overflow-y', 'auto');
   }
}

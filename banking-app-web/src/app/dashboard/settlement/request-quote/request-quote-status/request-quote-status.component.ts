import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../../../core/utils/constants';
import { ISettlementNotificationTypes } from '../../../../core/utils/enums';

@Component({
   selector: 'app-request-quote-status',
   templateUrl: './request-quote-status.component.html',
   styleUrls: ['./request-quote-status.component.scss']
})
export class RequestQuoteStatusComponent implements OnInit {

   @Input() settlementQuoteStatus: ISettlementNotificationTypes = ISettlementNotificationTypes.None;
   @Input() showLoader: boolean;
   @Input() retryLimitExceeded: boolean;
   @Output() onRetry = new EventEmitter<boolean>();

   messages = Constants.messages.settlement.quoteRequest;
   values = Constants.VariableValues.settlement.quoteRequest;
   labels = Constants.labels.settlement.quoteRequest;
   emailLink: string;
   emailValues = Constants.VariableValues.email;
   notificationTypes = ISettlementNotificationTypes;

   ngOnInit() {
      this.emailLink = this.emailValues.mailTo + this.values.emailForContactMFC;
   }

   onRetryQuote() {
      this.retryLimitExceeded ? this.onRetry.emit(false) : this.onRetry.emit(true);
   }
}

import { Component, Input, OnChanges } from '@angular/core';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';

@Component({
   selector: 'app-feedback-attempts',
   templateUrl: './feedback-attempts.component.html',
   styleUrls: ['./feedback-attempts.component.scss']
})

export class FeedbackAttemptsComponent implements OnChanges {
   @Input() remainingTime;
   label = Constants.labels.reportFraud;
   value = Constants.VariableValues.reportFraud;
   message = Constants.messages.reportFraud;
   attemptMsg: string;

   ngOnChanges() {
      this.attemptMsg = CommonUtility.format(this.message.attemptMsg, this.remainingTime,
         this.remainingTime === this.value.one ? this.value.hour : this.value.hours);
   }
}

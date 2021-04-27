import { Component, Input, OnChanges, Output, EventEmitter, Injector } from '@angular/core';
import { SystemErrorService } from '../../core/services/system-services.service';
import { FeedbackService } from '../feedback.service';
import { BaseComponent } from '../../core/components/base/base.component';
import { IReportSuspicious, IAlertMessage } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-feedback-try-again',
   templateUrl: './feedback-try-again.component.html',
   styleUrls: ['./feedback-try-again.component.scss']
})
export class FeedbackTryAgainComponent extends BaseComponent implements OnChanges {

   @Input() feedbackDetails: IReportSuspicious;
   @Output() alertMessage = new EventEmitter<IAlertMessage>();
   label = Constants.labels.reportFraud;
   message = Constants.messages.reportFraud;
   tryAgain: boolean;
   showLoader: boolean;
   numberOfAttempts: number;

   // Analytics
   GACategory = Constants.GAEventList.category.reportFraud;
   GAEvent = Constants.GAEventList.reportFraud.event;
   GALabel = Constants.GAEventList.reportFraud.label;

   constructor(private systemErrorService: SystemErrorService, private feedbackService: FeedbackService,
      injector: Injector) {
      super(injector);
   }
   ngOnChanges() {
      this.numberOfAttempts = 0;
      this.tryAgain = true;
   }

   closeOverlay($event) {
      this.tryAgain = false;
   }

   sendSuspiciousReport() {
      this.showLoader = true;
      this.numberOfAttempts++;
      this.feedbackService.reportSuspiciousSubmit(this.feedbackDetails).subscribe((response) => {
         if (response) {
            this.showLoader = false;
            this.tryAgain = false;
            this.alertMessage.emit({ showSuccess: true, showError: false, alertMessage: this.message.successMsg });
         }
      }, (error) => {
         this.systemErrorService.closeError();
         this.showLoader = false;
         this.tryAgain = true;
      });
   }
}

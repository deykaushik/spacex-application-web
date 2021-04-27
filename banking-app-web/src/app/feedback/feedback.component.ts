import { Component, OnInit } from '@angular/core';
import { IButtonGroup } from '../core/services/models';
import { Constants } from '../core/utils/constants';
import { CommonUtility } from '../core/utils/common';
import { environment } from '../../environments/environment';

@Component({
   selector: 'app-feedback',
   templateUrl: './feedback.component.html',
   styleUrls: ['./feedback.component.scss']
})

export class FeedbackComponent implements OnInit {
   showModal: boolean;
   showFeedbackModal: boolean;
   showError = false;
   showSuccess = false;
   successMessage: string;
   failureMessage: string;
   showLoader = false;
   label = Constants.labels.feedback;
   message = Constants.messages.feedback;
   value = Constants.VariableValues.feedback;
   overlayType: string;
   buttonGroup: IButtonGroup[] = Constants.labels.reportFraud.feedbackTypes;
   reportSuspiciousToggle: boolean = environment.features.reportSuspicious;

   constructor() {
   }

   ngOnInit() { }

   onCloseErrorMsg() {
      this.showError = false;
   }

   onCloseSuccessMsg() {
      this.showSuccess = false;
   }
   showCallMeBackPopup() {
      this.showModal = !this.showModal;
   }
   showFeedBackPopup(type) {
      this.overlayType = type;
      this.showFeedbackModal = !this.showFeedbackModal;
   }

   hideOverlay(value) {
      this.showModal = value;
      this.showFeedbackModal = value;
   }

   setAlertMessage(status: any) {
      if (status.showSuccess) {
         this.successMessage = status.alertMessage;
      } else if (status.showError) {
         this.failureMessage = status.alertMessage;
      }
      this.showError = status.showError;
      this.showSuccess = status.showSuccess;
      CommonUtility.topScroll();
   }
}

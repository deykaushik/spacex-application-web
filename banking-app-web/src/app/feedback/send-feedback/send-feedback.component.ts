import { Component, OnInit, ViewChild, ElementRef, Injector, Output, EventEmitter, Input } from '@angular/core';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { FeedbackService } from '../feedback.service';
import { BaseComponent } from '../../core/components/base/base.component';
import { IClientDetails, IFeedbackResult, IFeedbackDetail, ICallbackDetail, IDeviceInfo } from '../../core/services/models';
import { IButtonGroup, IAlertMessage, IToggleButtonGroup } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { environment } from '../../../environments/environment';

@Component({
   selector: 'app-send-feedback',
   templateUrl: './send-feedback.component.html',
   styleUrls: ['./send-feedback.component.scss']
})

export class SendFeedbackComponent extends BaseComponent implements OnInit {
   @Output() alertMessage = new EventEmitter<IAlertMessage>();
   @Output() hideOverlay = new EventEmitter<boolean>();
   showModal: boolean;
   @Input() overlayType;
   @ViewChild('mobileNumberElem') mobileNumberElem: ElementRef;
   callBackAllowed = false;
   label = Constants.labels.feedback;
   message = Constants.messages.feedback;
   value = Constants.VariableValues.feedback;
   placeholder = this.label.placeholder;
   feedbackTypes = this.value.FeedbackTypes;
   selectedFeedbackType = this.feedbackTypes[0];
   callTimings = Constants.VariableValues.feedback.feedbackCallTimings;
   selectedTime = this.callTimings[0];
   mobileNumber: string;
   mobilePattern = Constants.patterns.mobile;
   feedbackText = this.value.empty;
   feedbackLimit = this.value.maxLimit;
   feedbackInfo = this.feedbackText.length + this.label.slash + this.feedbackLimit;
   @Input() showError = false;
   @Input() showSuccess = false;
   isMobileNumberValid = false;
   deviceInfo: IDeviceInfo;
   successMessage: string;
   failureMessage: string;
   showLoader = false;
   isCellphoneEditMode = false;
   savedMobileNumber: string;
   buttonGroup: IButtonGroup[] = Constants.labels.reportFraud.feedbackTypes;
   contactType: string;
   buttonGroupWidth: number;
   toggleButtonGroup: IToggleButtonGroup;
   reportSuspiciousToggle: boolean = environment.features.reportSuspicious;

   constructor(private clientProfileDetailsService: ClientProfileDetailsService, private deviceService: Ng2DeviceService,
      injector: Injector, private feedbackService: FeedbackService) {
      super(injector);
      this.deviceInfo = this.deviceService.getDeviceInfo();
   }

   ngOnInit() {
      this.buttonGroupWidth = this.overlayType ? 172 : 212;
      this.contactType = this.overlayType ? this.overlayType : this.buttonGroup[0].value;
      this.subscribeClientDetails();
      this.toggleButtonGroup = {
         buttonGroup: this.buttonGroup,
         buttonGroupWidth: this.buttonGroupWidth,
         groupName: '',
         isGroupDisabled: false
      };
   }

   onTypeChange($event) {
      this.contactType = $event.value;
      if ($event.value === this.buttonGroup[1].value) {
         this.sendEvent(Constants.GAEventList.reportFraud.event.tapSelected,
            Constants.GAEventList.reportFraud.label.tapSelected, 'true', Constants.GAEventList.category.reportFraud);
      }
   }
   subscribeClientDetails() {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe((data: IClientDetails) => {
         if (data && data.CellNumber) {
            this.mobileNumber = data.CellNumber;
            this.mobileNumberChange();
         }
      });
   }

   onTimeChange(time) {
      this.selectedTime = time;
   }

   onFeedbackTypeChange(feedbackType) {
      this.selectedFeedbackType = feedbackType;
   }

   feedbackChange() {
      this.feedbackInfo = this.feedbackText.length + this.label.slash + this.feedbackLimit;
   }
   closeLoaderAndMessage() {
      this.showError = false;
      this.showLoader = false;
   }

   feedbackStatusHandler() {
      if (this.callBackAllowed) {
         this.feedbackService.submitCallback(this.getCallbackDetailInfo()).subscribe((callbackresponse) => {
            if (callbackresponse && callbackresponse.MetaData && callbackresponse.MetaData.Message
               && callbackresponse.MetaData.Message.toUpperCase() === Constants.metadataKeys.success) {
               this.successMessage = this.message.successMessageCallback;
               this.showLoader = false;
               this.alertMessage.emit({ showSuccess: true, showError: false, alertMessage: this.successMessage });
               this.hideOverlay.emit(false);
               this.clearFeedBackDetails();
            } else {
               this.onFailure();
            }
         }, (error) => {
            this.closeLoaderAndMessage();
         });
      } else {
         this.successMessage = this.message.successMessageFeedback;
         this.showLoader = false;
         this.alertMessage.emit({ showSuccess: true, showError: false, alertMessage: this.successMessage });
         this.hideOverlay.emit(false);
         this.clearFeedBackDetails();
      }
   }

   /* Call the below function for the feedback types complaints and compliments */
   sendCandCsFeedback() {
      this.feedbackService.submitCandCsFeedback(this.getFeedbackDetailInfo()).subscribe((response) => {
         const resp = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.feedback);
         if (resp.isValid) {
            this.feedbackStatusHandler();
         } else {
            this.onFailure();
         }
      }, (error) => {
         this.closeLoaderAndMessage();
      });
   }

   /* Call the below function for otherthan complaints and compliments feedback types */
   sendOtherFeedback() {
      this.feedbackService.submitFeedback(this.getFeedbackDetailInfo()).subscribe((response) => {
         if (response && response.MetaData && response.MetaData.Message
            && response.MetaData.Message.toUpperCase() === Constants.metadataKeys.success) {
            this.feedbackStatusHandler();
         } else {
            this.onFailure();
         }
      }, (error) => {
         this.closeLoaderAndMessage();
      });
   }

   /* Calling complaints and compliments API for the feedback types complaints and compliments, other feedback types
      using the existing API*/
   sendFeedBack() {
      this.showLoader = true;
      if (this.selectedFeedbackType === this.feedbackTypes[0] || this.selectedFeedbackType === this.feedbackTypes[2]) {
         this.sendCandCsFeedback();
      } else {
         this.sendOtherFeedback();
      }
   }

   onFailure() {
      this.failureMessage = this.message.failureMessage;
      this.showError = true;
      this.showLoader = false;
      CommonUtility.topScroll();
      this.alertMessage.emit({ showSuccess: false, showError: true, alertMessage: this.failureMessage });
   }

   clearFeedBackDetails() {
      this.feedbackText = this.value.empty;
      this.selectedFeedbackType = this.feedbackTypes[0];
      this.callBackAllowed = false;
      this.selectedTime = this.callTimings[0];
      this.subscribeClientDetails();
   }

   onTryAgain() {
      this.onCloseErrorMsg();
      this.sendFeedBack();
   }

   getFeedbackDetailInfo() {
      const feedbackInfo = {} as IFeedbackDetail;
      if (this.selectedFeedbackType === this.feedbackTypes[0] || this.selectedFeedbackType === this.feedbackTypes[2]) {
         feedbackInfo.feedbackType = this.selectedFeedbackType;
         feedbackInfo.description = this.feedbackText;
         feedbackInfo.browserType = this.deviceInfo.browser;
         feedbackInfo.webVersion = this.deviceInfo.browser_version;
      } else {
         feedbackInfo.FeedbackType = this.selectedFeedbackType;
         feedbackInfo.Description = this.feedbackText;
         feedbackInfo.BrowserType = this.deviceInfo.browser;
         feedbackInfo.WebVersion = this.deviceInfo.browser_version;
      }
      return feedbackInfo;
   }
   getCallbackDetailInfo() {
      const feedbackInfo: ICallbackDetail = {
         MobileNo: this.mobileNumber,
         CallbackTime: this.selectedTime,
         Description: this.feedbackText,
         BrowserType: this.deviceInfo.browser,
         WebVersion: this.deviceInfo.browser_version,
      };
      return feedbackInfo;
   }

   mobileNumberChange() {
      this.isMobileNumberValid = CommonUtility.isValidMobile(this.mobileNumber);
   }

   onEditClick() {
      this.isCellphoneEditMode = true;
      this.savedMobileNumber = this.mobileNumber;
      this.mobileNumber = this.value.empty;
      this.mobileNumberElem.nativeElement.focus();
   }

   onSaveClick() {
      if (CommonUtility.isValidMobile(this.mobileNumber)) {
         this.isCellphoneEditMode = false;
         this.savedMobileNumber = this.value.empty;
      }
   }

   onCancelClick() {
      this.isCellphoneEditMode = false;
      this.mobileNumber = this.savedMobileNumber;
      this.savedMobileNumber = this.value.empty;
   }

   onMobileFocusOut() {
      if (this.mobileNumber && this.mobileNumber.trim() !== this.value.empty) {
         this.onSaveClick();
      } else {
         if (this.savedMobileNumber && this.savedMobileNumber.trim() !== this.value.empty) {
            this.onCancelClick();
         }
      }
   }
   onCloseErrorMsg() {
      this.showError = false;
      this.alertMessage.emit({ showSuccess: false, showError: false, alertMessage: this.value.empty });
   }

   onCloseSuccessMsg() {
      this.alertMessage.emit({ showSuccess: false, showError: false, alertMessage: this.value.empty });
   }
   showCallMeBackPopup() {
      this.showModal = !this.showModal;
   }

   setAlertMessage($event) {
      this.alertMessage.emit($event);
   }
}

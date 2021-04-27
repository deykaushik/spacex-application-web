import { Component, OnInit, ElementRef, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ClientProfileDetailsService } from './../../core/services/client-profile-details.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { FeedbackService } from '../feedback.service';
import { BaseComponent } from './../../core/components/base/base.component';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { IClientDetails, IFeedbackResult, ICallbackDetail, IDeviceInfo } from '../../core/services/models';


@Component({
   selector: 'app-call-me-back',
   templateUrl: './call-me-back.component.html',
   styleUrls: ['./call-me-back.component.scss']
})
export class CallMeBackComponent extends BaseComponent implements OnInit {
   @ViewChild('mobileNumberElem') mobileNumberElem: ElementRef;
   mobilePattern = Constants.patterns.mobile;
   isMobileNumberValid = false;
   mobileNumber: string;
   isCellphoneEditMode = false;
   savedMobileNumber: string;
   label = Constants.labels.feedback;
   message = Constants.messages.feedback;
   value = Constants.VariableValues.feedback;
   placeholder = this.label.placeholder;
   feedbackText = this.value.empty;
   feedbackLimit = this.value.maxLimit;
   feedbackInfo = this.feedbackText.length + '/' + this.feedbackLimit;
   showLoader = false;
   deviceInfo: IDeviceInfo;
   successMessage: string;
   failureMessage: string;
   showError = false;
   showSuccess = false;
   showModal: boolean;
   callTimings = Constants.VariableValues.feedback.feedbackCallTimings;

   @Output() alertMessage = new EventEmitter<any>();
   @Output() hideOverlay = new EventEmitter<boolean>();
   selectedTime = this.callTimings[0];
   constructor(private clientProfileDetailsService: ClientProfileDetailsService, private deviceService: Ng2DeviceService,
      injector: Injector, private feedbackService: FeedbackService) {
      super(injector);
      this.deviceInfo = this.deviceService.getDeviceInfo();
   }

   ngOnInit() {
      this.subscribeClientDetails();
   }

   subscribeClientDetails() {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe((data: IClientDetails) => {
         if (data && data.CellNumber) {
            this.mobileNumber = data.CellNumber;
            this.mobileNumberChange();
         }
      });
   }
   mobileNumberChange() {
      this.isMobileNumberValid = CommonUtility.isValidMobile(this.mobileNumber);
   }
   onSaveClick() {
      if (CommonUtility.isValidMobile(this.mobileNumber)) {
         this.isCellphoneEditMode = false;
         this.savedMobileNumber = '';
      }
   }
   onCancelClick() {
      this.isCellphoneEditMode = false;
      this.mobileNumber = this.savedMobileNumber;
      this.savedMobileNumber = '';
   }
   onMobileFocusOut() {
      if (this.mobileNumber && this.mobileNumber.trim() !== '') {
         this.onSaveClick();
      } else {
         if (this.savedMobileNumber && this.savedMobileNumber.trim() !== '') {
            this.onCancelClick();
         }
      }
   }
   onEditClick() {
      this.isCellphoneEditMode = true;
      this.savedMobileNumber = this.mobileNumber;
      this.mobileNumber = '';
      this.mobileNumberElem.nativeElement.focus();
   }

   onTimeChange(time) {
      this.selectedTime = time;
   }
   feedbackChange() {
      this.feedbackInfo = this.feedbackText.length + '/' + this.feedbackLimit;
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
   onFailure() {
      this.failureMessage = this.message.failureCallback;
      this.showError = true;
      this.showLoader = false;
      this.alertMessage.emit({ showSuccess: false, showError: false, alertMessage: this.failureMessage });
      CommonUtility.topScroll();
   }
   sendCallMeBack() {
      this.showLoader = true;
      this.feedbackService.submitCallback(this.getCallbackDetailInfo()).subscribe((callbackresponse) => {
         if (callbackresponse && callbackresponse.MetaData && callbackresponse.MetaData.Message
            && callbackresponse.MetaData.Message.toUpperCase() === Constants.metadataKeys.success) {
            this.successMessage = this.message.successMessageCallback;
            this.showLoader = false;
            this.alertMessage.emit({ showSuccess: true, showError: false, alertMessage: this.successMessage });
            this.hideOverlay.emit(false);
         } else {
            this.onFailure();
         }
      }, (error) => {
         this.showError = false;
         this.showLoader = false;
      });
   }
   onCloseErrorMsg() {
      this.showError = false;
      this.alertMessage.emit({ showSuccess: false, showError: false, alertMessage: '' });
   }
   onTryAgain() {
      this.onCloseErrorMsg();
      this.sendCallMeBack();
   }
}

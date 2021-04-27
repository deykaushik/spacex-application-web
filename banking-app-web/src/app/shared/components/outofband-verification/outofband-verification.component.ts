import { ApiService } from './../../../core/services/api.service';
import {
   Component,
   OnInit,
   ViewChild,
   EventEmitter,
   AfterViewInit,
   Output,
   OnDestroy,
   ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { Constants } from '../../../core/utils/constants';
import { FormsModule } from '@angular/forms';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { CommonUtility } from '../../../core/utils/common';
import { IOutOfBandResponse } from '../../../core/services/models';

@Component({
   selector: 'app-outofband-verification',
   templateUrl: './outofband-verification.component.html',
   styleUrls: ['./outofband-verification.component.scss']
})
export class OutofbandVerificationComponent implements OnInit, OnDestroy, AfterViewInit {
   @ViewChild('approveItForm') approveItForm;
   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() getApproveItStatus = new EventEmitter();
   @Output() getOTPStatus = new EventEmitter<any>();
   @Output() resendApproveDetails = new EventEmitter();
   @Output() updateSuccess = new EventEmitter<boolean>();
   @Output() otpIsValid = new EventEmitter();
   @Output() updatePartialSuccess = new EventEmitter<any>();


   isValid: boolean;
   messages = Constants.messages;
   showLoader: boolean;
   countdownTimer: number;
   otpCounter = 0;
   otpMaxTries = 3;
   otpValidationError: string;
   showScreen: number;
   displayNumber: string;
   otpValue: string;
   serviceError: string;
   timeoutPeriod = 60;
   pollInterval = 3000;
   approveSubscription: ISubscription;
   approveStatusSubscription: ISubscription;
   pollServiceSubscription: ISubscription;
   pollServiceObservable: Observable<number>;
   pollScreenObservable: Observable<number>;
   pollScreenSubscription: ISubscription;
   approveSucessSubscription: ISubscription;
   approveItResponseSubscription: ISubscription;
   approveOTPResponseSubscription: ISubscription;
   resendApproveDetailsResponseSubscription: ISubscription;
   isPartialResponses = false;

   systemErrorMessage = `So sorry! Looks like something's wrong on our side.`;
   invalidOTPMessage = `This OTP is incorrect.`;

   private readonly Pending = 'PENDING';


   constructor(
      private router: Router,
      public bsModalRef: BsModalRef,
      private apiService: ApiService) { }

   servicePollTimerInterval() {
      this.pollServiceSubscription.unsubscribe();
      this.ApproveResponse();
   }

   screenPollTimerInterval() {
      if (this.countdownTimer > 0) {
         this.countdownTimer--;
      } else {
         this.UpdateScreen(6);
      }
   }

   ngOnInit() {
      this.countdownTimer = this.timeoutPeriod;
      this.showScreen = 1;
      this.otpValue = '';
      this.serviceError = '';
      this.displayNumber = '';
      this.pollServiceObservable = Observable.timer(
         this.pollInterval,
         this.pollInterval
      );
      this.pollServiceSubscription = this.pollServiceObservable.subscribe(() => {
         this.servicePollTimerInterval();
      });
      this.pollScreenObservable = Observable.timer(0, 1000);
      this.pollScreenSubscription = this.pollScreenObservable.subscribe(() => {
         this.screenPollTimerInterval();
      });
   }

   ngOnDestroy() {
      try {
         this.approveSubscription.unsubscribe();
      } catch (e) { }
      try {
         this.approveStatusSubscription.unsubscribe();
      } catch (e) { }
      try {
         this.pollServiceSubscription.unsubscribe();
      } catch (e) { }
      try {
         this.approveSucessSubscription.unsubscribe();
      } catch (e) { }
      try {
         this.approveItResponseSubscription.unsubscribe();
      } catch (e) { }
      try {
         this.resendApproveDetailsResponseSubscription.unsubscribe();
      } catch (e) { }
   }

   ApproveResponse() {
      this.serviceError = '';
      this.showLoader = true;

      // fire off event to parent. response will be subscribed in approveItResponse
      this.getApproveItStatus.emit();

   }

   public processApproveItResponse(response) {

      let responseStatus = '';

      if (response === '') {
         this.showLoader = false;
         return;
      }

      try {
         const transactionStatus = this.getTransactionStatus(response.metadata);
         responseStatus = transactionStatus.status;
      } catch (error) {
         this.showLoader = false;
      }
      if (responseStatus === 'SUCCESS') {
         this.ApproveSuccess();
         this.apiService.refreshAccounts.getAll().subscribe();
      } else if (responseStatus === 'FALLBACK') {
         this.UpdateScreen(3);
      } else if (responseStatus === 'DECLINED') {
         this.updateSuccess.emit(false);
         this.UpdateScreen(4);
      } else if (responseStatus === 'PENDING') {
         this.pollServiceSubscription = this.pollServiceObservable.subscribe(
            () => {
               this.servicePollTimerInterval();
            }
         );
      } else if (responseStatus === 'TIMEOUT') {
         this.UpdateScreen(6);
      } else {
         this.serviceError = this.systemErrorMessage;
         this.UpdateScreen(8);
      }
   }

   ApproveUserSMS() {
      this.serviceError = '';
      this.otpValidationError = '';
      this.showLoader = true;
      this.otpCounter++;

      if (this.otpCounter > this.otpMaxTries) {
         this.UpdateScreen(7);
         return;
      }

      this.getOTPStatus.emit(this.otpValue);

   }

   processApproveUserResponse(response) {

      try {
         this.otpValidationError = '';
         if (response.metadata.resultData[0].resultDetail[0].status === 'APPROVED') {
            this.otpIsValid.emit(true);
         } else {
            this.showLoader = false;
            const nrRetriesLeft = this.otpMaxTries - this.otpCounter;
            if (nrRetriesLeft > 0) {
               this.otpValidationError = this.invalidOTPMessage + ' You have ' + nrRetriesLeft.toString() +
                  ' attempt' + (nrRetriesLeft === 1 ? ' ' : 's ') + 'left.';
            } else {
               this.UpdateScreen(7);
            }
         }
      } catch (e) {
         this.showLoader = false;
      }
   }

   ResendApproveUser() {
      this.serviceError = '';
      this.countdownTimer = this.timeoutPeriod;
      this.UpdateScreen(1);
      if (this.isPartialResponses) {
         this.pollScreenSubscription = this.pollScreenObservable.subscribe(() => {
            this.screenPollTimerInterval();
         });
      }
      this.resendApproveDetails.emit();
   }

   ProcessApproveItLimitResponse(approveItResponse) {
      if (approveItResponse.metadata && approveItResponse.metadata.resultData &&
         approveItResponse.metadata.resultData.length > 0) {
         const isFailed = approveItResponse.metadata.resultData.some(i => i.transactionID &&
            isNaN(i.transactionID) && i.resultDetail[0].status ===
            Constants.VariableValues.settings.labels.FAILURE);
         if (isFailed) {
            const failureCases = approveItResponse.metadata.resultData.filter(i =>
               i.resultDetail[0].status === Constants.VariableValues.settings.labels.FAILURE);
            this.processPartialApproveItResponse(failureCases);
         } else {
            this.processApproveItResponse(approveItResponse);
         }
      }
   }

   processResendApproveLimitDetailsResponse(approveItResponse) {
      if (approveItResponse && approveItResponse.resultData && approveItResponse.resultData.length > 0) {
         const isFailed = approveItResponse.resultData.some(i => i.transactionID && isNaN(i.transactionID) &&
            i.resultDetail[0].status === Constants.VariableValues.settings.labels.FAILURE);
         if (isFailed) {
            const failureCases = approveItResponse.resultData.filter(i =>
               i.resultDetail[0].status === Constants.VariableValues.settings.labels.FAILURE);
            this.processPartialApproveItResponse(failureCases);
         } else {
            this.processResendApproveDetailsResponse(approveItResponse);
         }
      }
   }
   processResendApproveDetailsResponse(response) {
      let responseStatus = '';
      if (!this.isPartialResponses) {
         this.pollScreenSubscription = this.pollScreenObservable.subscribe(() => {
            this.screenPollTimerInterval();
         });
      }
      try {
         const transactionStatus = this.getTransactionStatus(response.metadata);
         responseStatus = transactionStatus.status;
      } catch (error) {
      }

      if (responseStatus !== '' && responseStatus === 'FALLBACK') {
         this.UpdateScreen(3);
      } else {
         this.pollServiceSubscription = this.pollServiceObservable.subscribe(
            () => {
               this.servicePollTimerInterval();
            }
         );

      }

   }

   ApproveSuccess() {
      this.updateSuccess.emit(true);
      this.UnsubscribeSubscriptions();
      this.navigateClose();
   }

   UnsubscribeSubscriptions() {
      try {
         this.approveSubscription.unsubscribe();
      } catch (e) { }
      try {
         this.approveStatusSubscription.unsubscribe();
      } catch (e) { }
      try {
         this.pollServiceSubscription.unsubscribe();
      } catch (e) { }
      try {
         this.approveSucessSubscription.unsubscribe();
      } catch (e) { }
      try {
         this.pollScreenSubscription.unsubscribe();
      } catch (e) { }
   }

   UpdateScreen(screenNumber: number) {
      this.showLoader = false;
      this.UnsubscribeSubscriptions();
      this.showScreen = screenNumber;
   }

   ngAfterViewInit() {
      this.approveItForm.valueChanges.subscribe(values => this.validate());
   }

   navigateCancel() {
      this.updateSuccess.emit(false);
      this.bsModalRef.hide();
   }

   navigateClose() {
      this.bsModalRef.hide();
   }

   validate() {
      this.isValid =
         this.showScreen === 3
            ? (this.otpValue ? this.approveItForm.valid : false)
            : true;
      this.isComponentValid.emit(this.isValid);
   }

   navigateNextDelayed() {
      this.bsModalRef.hide();
   }

   getTransactionStatus(metadata: any) {

      let status = { operationReference: '', result: '', status: '', reason: '' };
      try {
         status = metadata.resultData[0].resultDetail[metadata.resultData[0].resultDetail.length - 1];
      } catch (error) { }


      return status;

   }

   unsubscribeAll() {
      try {
         this.getApproveItStatus.unsubscribe();
      } catch (e) { }

      try {
         this.resendApproveDetails.unsubscribe();
      } catch (e) { }

      try {
         this.updateSuccess.unsubscribe();
      } catch (e) { }

      try {
         this.getOTPStatus.unsubscribe();
      } catch (e) { }

      try {
         this.otpIsValid.unsubscribe();
      } catch (e) { }
   }
   public processPartialApproveItResponse(response) {
      this.ApprovePartialSuccess(response);
   }
   ApprovePartialSuccess(response: any) {
      this.updatePartialSuccess.emit(response);
      this.UnsubscribeSubscriptions();
      this.navigateClose();
   }
}

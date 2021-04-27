import {
   Component,
   OnInit,
   ViewChild,
   EventEmitter,
   AfterViewInit,
   Output,
   OnDestroy,
   ViewEncapsulation,
   Injector
 } from '@angular/core';
 import { FormControl, FormGroup, Validators } from '@angular/forms';
 import { Router } from '@angular/router';
 import { BsModalRef } from 'ngx-bootstrap';
 import { BaseComponent } from '../../core/components/base/base.component';
 import { ConstantsRegister } from '../utils/constants';
 import { Constants } from '../../core/utils/constants';
 import { FormsModule } from '@angular/forms';
 import { RegisterService, ApprovalType } from '../register.service';
 import { ISubscription } from 'rxjs/Subscription';
 import { Observable } from 'rxjs/Observable';
 import { LoggerService } from '../../shared/logging/logger.service';
 import { View } from '../utils/enums';

 @Component({
   selector: 'app-approve-it',
   templateUrl: './approve-it.component.html',
   styleUrls: ['./approve-it.component.scss'],
   encapsulation: ViewEncapsulation.None
 })
 export class ApproveItComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
   @ViewChild('approveItForm') registerForm;
   @Output() isComponentValid = new EventEmitter<boolean>();
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
   isMobileNumberSupplied: boolean;

   constructor(
     private router: Router,
     public bsModalRef: BsModalRef,
     private service: RegisterService,
     private logger: LoggerService,
     injector: Injector) {
      super(injector);
      logger.log(false, 'ApproveItComponent.constructor');
   }
   servicePollTimerInterval() {
     this.logger.log(false, 'ApproveItComponent.servicePollTimerInterval');
     try {
       this.pollServiceSubscription.unsubscribe();
     } catch (e) { }
     this.ApproveUserResponse();
   }

   screenPollTimerInterval() {
     if (this.countdownTimer > 0) {
       this.countdownTimer--;
     } else {
       this.UpdateScreen(6);
     }
   }

   ngOnInit() {
     this.logger.log(false, 'ApproveItComponent.ngOnInit');
     this.countdownTimer = this.timeoutPeriod;
     this.showScreen = 1;
     this.otpValue = '';
     this.serviceError = '';
     this.displayNumber = this.service.userDetails.mobileNumber;
     this.isMobileNumberSupplied = (this.displayNumber && this.displayNumber.length > 0);
     this.service.approveItSucess = false;
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
     this.logger.log(false, 'ApproveItComponent.ngOnDestroy');
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
   }

   ApproveUserResponse() {
     this.logger.log(false, 'ApproveItComponent.ApproveUserResponse');
     this.serviceError = '';
     this.showLoader = true;

     this.approveStatusSubscription = this.service
       .ApproveStatus(this.service.verificationId)
       .finally(() => {
         this.showLoader = false;
       })
       .subscribe(
       response => {
         if (response.MetaData) {
           switch (response.MetaData.ResultCode) {
             case ConstantsRegister.errorCode.r00:
               {
                 // approve it accepted
                 if (this.service.approvalType === ApprovalType.ApproveUser) {
                  this.sendEvent(
                     ConstantsRegister.gaEvents.acceptApproveIt.eventAction,
                     ConstantsRegister.gaEvents.acceptApproveIt.label,
                     null,
                     ConstantsRegister.gaEvents.acceptApproveIt.category);
                 }
                 this.ApproveSuccess();
                 break;
               }
             case ConstantsRegister.errorCode.r15:
               {
                 // approve it rejected
                 if (this.service.approvalType === ApprovalType.ApproveUser) {
                  this.sendEvent(
                     ConstantsRegister.gaEvents.rejectedApproveIt.eventAction,
                     ConstantsRegister.gaEvents.rejectedApproveIt.label,
                     null,
                     ConstantsRegister.gaEvents.rejectedApproveIt.category);
                 }
                 this.UpdateScreen(4);
                 break;
               }
             case ConstantsRegister.errorCode.r25:
             case ConstantsRegister.errorCode.r10:
               {
                 // pending - keep polling
                 /* istanbul ignore next */
                 this.pollServiceSubscription = this.pollServiceObservable.subscribe(
                   () => {
                     this.servicePollTimerInterval();
                   }
                 );
                 break;
               }
             case ConstantsRegister.errorCode.r14:
               {
                 // SMS fallback
                 if (response.Data && response.Data.ApproveITInfo) {
                   this.service.verificationId =
                     response.Data.ApproveITInfo.ApproveITVerificationID;
                 }
                 this.UpdateScreen(3);
                 break;
               }
             case ConstantsRegister.errorCode.r26:
               {
                 // timeout - show resend screen
                 this.UpdateScreen(6);
                 break;
               }
             case ConstantsRegister.errorCode.r16:
             case ConstantsRegister.errorCode.r17:
               {
                 // timeout / fail - show resend screen
                 this.UpdateScreen(2);
                 break;
               }
             default:
               {
                 this.serviceError = ConstantsRegister.messages.communicationError;
                 this.UpdateScreen(2);
                 break;
               }
           }
         } else {
           this.serviceError = ConstantsRegister.messages.communicationError;
           this.UpdateScreen(2);
         }
       },
       (error: number) => {
         this.serviceError = ConstantsRegister.messages.communicationError;
         this.UpdateScreen(2);
       }
       );
   }

   ApproveUserSMS() {
     this.logger.log(false, 'ApproveItComponent.ApproveUserSMS');
     this.serviceError = '';
     this.otpValidationError = '';
     this.showLoader = true;

     if (this.otpCounter > this.otpMaxTries) {
       this.UpdateScreen(7);
       return;
     }

     this.approveSubscription = this.service
       .Approve(
       this.service.temporaryId,
       this.service.verificationId,
       +this.otpValue
       )
       .finally(() => {
         this.showLoader = false;
       })
       .subscribe(
       response => {

          switch (response.MetaData.ResultCode) {
             case ConstantsRegister.errorCode.r00: {
                // Success
                this.navigateNext();
                break;
             }
             case ConstantsRegister.errorCode.r27: {
                // Delayed
                this.navigateNextDelayed();
                break;
             }
             case ConstantsRegister.errorCode.r03:
             case ConstantsRegister.errorCode.r18: {
                // Invalid OTP
                this.otpCounter++;
                try {
                   const nrRetriesLeft = this.otpMaxTries - this.otpCounter;
                   if (nrRetriesLeft > 0) {
                      this.otpValidationError = ConstantsRegister.messages.invalidOTP +
                      ' You have ' + nrRetriesLeft.toString() +
                      ' attempt' + (nrRetriesLeft === 1 ? ' ' : 's ') + 'left.';
                   } else {
                      this.UpdateScreen(7);
                   }
                } catch (e) {
                   this.otpValidationError = ConstantsRegister.messages.invalidOTP;
                }
                break;
             }
             default: {
                this.navigateClose();
             }
          }
       },
       (error: number) => {
          this.navigateClose();
       }
       );
   }

   ResendApproveUser() {
     this.logger.log(false, 'ApproveItComponent.ResendApproveUser');
     this.serviceError = '';
     this.countdownTimer = this.timeoutPeriod;
     this.UpdateScreen(1);

     this.pollScreenSubscription = this.pollScreenObservable.subscribe(() => {
       this.screenPollTimerInterval();
     });
     this.approveSubscription = this.service
       .Approve(this.service.temporaryId, this.service.verificationId, 0)
       .finally(() => {
         this.showLoader = false;
       })
       .subscribe(
       response => {

         if (
           response.MetaData.ResultCode === ConstantsRegister.errorCode.r00 ||
           response.MetaData.ResultCode === ConstantsRegister.errorCode.r25
         ) {
           if (response.Data && response.Data.ApproveITInfo) {
             this.service.verificationId = response.Data.ApproveITInfo.ApproveITVerificationID;
           } else if (response.Data && response.Data.SecurityRequestID) {
                this.service.verificationId = response.Data.SecurityRequestID;
           }
           /* istanbul ignore next */
           this.pollServiceSubscription = this.pollServiceObservable.subscribe(
             () => {
               this.servicePollTimerInterval();
             }
           );
         } else if (
           response.MetaData.ResultCode === ConstantsRegister.errorCode.r14 ||
           response.MetaData.ResultCode === ConstantsRegister.errorCode.r17
         ) {
           // SMS fallback
           if (response.Data && response.Data.ApproveITInfo) {
             this.service.verificationId = response.Data.ApproveITInfo.ApproveITVerificationID;
           } else if (response.Data && response.Data.SecurityRequestID) {
                this.service.verificationId = response.Data.SecurityRequestID;
           }
           this.UpdateScreen(3);
         } else {
           this.navigateClose();
         }
       },
       (error: number) => {
          this.navigateClose();
       }
       );
   }

   ApproveSuccess() {
     this.logger.log(false, 'ApproveItComponent.ApproveSuccess');
     this.UpdateScreen(5);

     this.approveSucessSubscription = this.service
       .Approve(this.service.temporaryId, this.service.verificationId, 0)
       .finally(() => {
         this.showLoader = false;
       })
       .subscribe(
       response => {

         if (response.MetaData.ResultCode === ConstantsRegister.errorCode.r00) {
           this.navigateNext();
         } else if (response.MetaData.ResultCode === ConstantsRegister.errorCode.r27) {
           this.navigateNextDelayed();
         } else {
           this.serviceError = ConstantsRegister.messages.communicationError;
           this.navigateClose();
         }
       },
       (error: number) => {
         this.navigateClose();
       }
       );
   }

   UpdateScreen(screenNumber: number) {
     this.logger.log(false, 'ApproveItComponent.UpdateScreen');
     this.showLoader = false;

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

     this.showScreen = screenNumber;
   }

   ngAfterViewInit() {
     this.logger.log(false, 'ApproveItComponent.ngAfterViewInit');
     this.registerForm.valueChanges.subscribe(values => this.validate());
   }

   navigateCancel() {
     this.logger.log(false, 'ApproveItComponent.navigateCancel');
     this.bsModalRef.hide();
     this.service.makeFormDirty(false);
     this.router.navigate(['/auth']);
   }

   navigateClose() {
     this.logger.log(false, 'ApproveItComponent.navigateClose');
     this.service.makeFormDirty(false);
     this.bsModalRef.hide();
   }

   navigateNext() {
     this.logger.log(false, 'ApproveItComponent.navigateNext');
     this.bsModalRef.hide();
     this.service.approveItSucess = true;
   }

   navigateNextDelayed() {
     this.logger.log(false, 'ApproveItComponent.navigateNextDelayed');
     this.bsModalRef.hide();
     this.service.SetActiveView(View.NedIdCreate, View.NedIdDelayed);
   }

   validate() {
     this.logger.log(false, 'ApproveItComponent.validate');
     this.isValid =
       this.showScreen === 3
         ? this.otpValue ? this.registerForm.valid : false
         : true;
     this.isComponentValid.emit(this.isValid);
   }
 }

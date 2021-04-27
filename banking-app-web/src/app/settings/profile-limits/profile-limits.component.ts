import { Component, OnInit, Injector, EventEmitter, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { OutofbandVerificationComponent } from './../../shared/components/outofband-verification/outofband-verification.component';

import { Constants } from '../../core/utils/constants';
import { ProfileLimitsService } from './profile-limits.service';

import { ILimitDetail, INotificationModel, IChangedLimitDetail } from './../../core/services/models';
import { NotificationTypes } from '../../core/utils/enums';
import { profileLimitSkeletonData } from '../../core/data/skeleton-data';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { BaseComponent } from '../../core/components/base/base.component';
import { SystemErrorService } from '../../core/services/system-services.service';
import { LoaderService } from '../../core/services/loader.service';
import { IFailureLimits } from './profile-limits.models';

@Component({
   selector: 'app-profile-limits',
   templateUrl: './profile-limits.component.html',
   styleUrls: ['./profile-limits.component.scss']
})
export class ProfileLimitsComponent extends BaseComponent implements OnInit {

   widgetTypes = Constants.VariableValues.settings.widgetTypes;
   originallimitDetails: ILimitDetail[];
   notifystatusToChild: Subject<INotificationModel> = new Subject();
   showLoader = false;
   skeletonMode = false;
   bsModalRef: BsModalRef;
   modalSubscription: ISubscription;
   @Output() limitUpdateResponse = new EventEmitter();


   constructor(private service: ProfileLimitsService,
      private modalService: BsModalService,
      private headerMenuService: HeaderMenuService,
      injector: Injector, private systemErrorService: SystemErrorService, private loader: LoaderService) {
      super(injector);
      this.skeletonMode = true;
      this.originallimitDetails = profileLimitSkeletonData;
   }

   ngOnInit() {
      this.showLoader = true;
      this.service.updateMultipleLimit = new Subject<boolean>();
      this.setIsProfileLimits();
      this.service.resetResponse();
      this.service.notifyLimitChange();
      this.service.getAllLimits().subscribe((response) => {
         this.showLoader = false;
         this.skeletonMode = false;
         this.originallimitDetails = response.filter(m => Constants.VariableValues.settings.widgetTypes[m.limitType]);
         this.service.setOriginalLimits(this.originallimitDetails);
         this.service.updateMultipleLimit.subscribe((val) => {
            this.updateBulkLimit();
         });
         this.service.cancelToOriginalLimitDetail.subscribe(i => {
            this.ResetToOriginalLimits();
         });

      });
   }

   private ResetToOriginalLimits() {
      if (this.service.updatedlimits && this.service.updatedlimits.limits && this.service.updatedlimits.limits.length > 0) {
         for (let limitNo = 0; limitNo < this.originallimitDetails.length; limitNo++) {
            if (this.service.updatedlimits.limits.some(j => j.limitDetail.limitType === this.service.baselimitDetails[limitNo].limitType)) {
               this.originallimitDetails[limitNo] = JSON.parse(JSON.stringify(this.service.baselimitDetails[limitNo]));
            }
         }
      }
   }

   private raiseSystemError() {
      this.systemErrorService.raiseError({ error: Constants.VariableValues.sytemErrorMessages.transactionMessage });
   }

   getReasonFromResponse(response: any): string {
      return response.resultData && response.resultData.length > 0 &&
         response.resultData[0].resultDetail && response.resultData[0].resultDetail.length > 0 &&
         response.resultData[0].resultDetail[0].reason ? response.resultData[0].resultDetail[0].reason : '';
   }

   getErrorFromResponse(err: any): string {
      return err.error && err.error.Exception && err.error.Exception.Message ? err.error.Exception.Message : '';
   }
   openSettingsMenu(menuText: string) {
      this.headerMenuService.openHeaderMenu(menuText);
   }
   updateOldLimitDetails(limitDetail: ILimitDetail) {
      limitDetail.dailyLimit = limitDetail.newLimit;
      if (limitDetail.isTempLimit) {
         limitDetail.tempDailyLimit = limitDetail.newLimit;
      }
   }
   private notifyChildren(type: NotificationTypes, message?: string, sectionName?: string, serviceErrorMessage?: string) {
      const notification: INotificationModel = {
         type: type, message: message, sectionName: sectionName,
         serviceErrorMessage: serviceErrorMessage
      };
      this.notifystatusToChild.next(notification);
   }
   resendBulkApprovalDetails() {
      this.service.updateBulkLimit()
         .subscribe((paymentResponse) => {

            this.service.updateBulkTransactionID(paymentResponse.resultData[0].transactionID);
            this.bsModalRef.content.processResendApproveLimitDetailsResponse(paymentResponse);
         }, (error: any) => {
            this.raiseSystemError();
         });
   }
   updateOldLimitsDetails(limitDetails: IChangedLimitDetail[]) {
      this.service.updateOriginalLimits(limitDetails);
   }
   updateBulkLimit() {
      if (this.service.successFullLimits && this.service.successFullLimits.length > 0) {
         for (let limitNo = 0; limitNo < this.originallimitDetails.length; limitNo++) {
            if (this.service.successFullLimits.some(j => j.limitDetail.limitType === this.service.baselimitDetails[limitNo].limitType)) {
               this.originallimitDetails[limitNo] = JSON.parse(JSON.stringify(this.service.baselimitDetails[limitNo]));
            }
         }
      }
      this.loader.show();
      this.service.isChangeSuccessful = false;
      if (this.modalSubscription) {
         this.modalSubscription.unsubscribe();
      }
      this.service.updateBulkLimit().subscribe((response) => {
         let responseStatus = '';
         const resStatus = response.resultData[0].resultDetail.find(item =>
            item.operationReference === 'SECURETRANSACTION' || item.operationReference === 'TRANSACTION');
         responseStatus = resStatus ? resStatus.status : '';
         this.loader.hide();
         if (responseStatus === 'PENDING') {
            this.service.updateBulkTransactionID(response.resultData[0].transactionID);
            this.bsModalRef = this.modalService.show(
               OutofbandVerificationComponent,
               Object.assign(
                  {},
                  {
                     animated: true,
                     keyboard: false,
                     backdrop: true,
                     ignoreBackdropClick: true
                  },
                  { class: '' }
               )
            );


            this.bsModalRef.content.isPartialResponses = true;
            this.bsModalRef.content.getApproveItStatus.subscribe(() => {
               try {
                  this.service.getBulkApproveItStatus().subscribe(approveItResponse => {
                     this.bsModalRef.content.isPartialResponses = true;
                     if (approveItResponse.metadata.resultData.some(i =>
                        i.resultDetail[0].status === Constants.VariableValues.settings.labels.FAILURE)) {
                        const failedCases = approveItResponse.metadata.resultData.filter(i => i.resultDetail[0].status === 'FAILURE');
                        if (failedCases && failedCases.length > 0) {
                           this.service.failedLimits = [];
                           failedCases.map(i => {
                              if (i.transactionID) {
                                 this.service.failedLimits.push({
                                    limittype: i.transactionID, status: Constants.VariableValues.settings.labels.FAILURE,
                                    reason: i.resultDetail && i.resultDetail.length > 0 &&
                                       i.resultDetail[0].Reason ? i.resultDetail.length > 0 && i.resultDetail[0].Reason : ''
                                 });
                              }
                           });
                        }
                     }
                     this.bsModalRef.content.ProcessApproveItLimitResponse(approveItResponse);
                  }, (error: any) => {
                     this.raiseSystemError();
                  });
               } catch (e) {
               }

            }, (error: any) => {
               this.raiseSystemError();
            });

            this.bsModalRef.content.updateSuccess.subscribe(value => {

               if (value) {
                  if (this.service.changedLimits && this.service.changedLimits.length > 0) {
                     for (let i = 0; i < this.service.changedLimits.length; i++) {
                        this.notifyChildren(NotificationTypes.Success,
                           Constants.VariableValues.settings.labels.SuccessfullyUpdated,
                           this.service.changedLimits[i].limitDetail.limitType);
                     }
                  }
                  this.service.notifyResponse(Constants.VariableValues.settings.updateStatus.Success);
                  this.service.failedLimits = [];
               } else {

                  if (this.service.failedLimits && (this.service.failedLimits.length === 0)) {
                     this.service.updatedlimits.limits.map(i => {
                        this.service.failedLimits.push({
                           limittype: i.limitDetail.limitType, status: Constants.VariableValues.settings.labels.FAILURE,
                           reason: ''
                        });
                     });
                  }
                  this.NotifyFailedLimits(this.service.failedLimits);
               }
            }, (error: any) => {
               this.raiseSystemError();
            });
            this.bsModalRef.content.updatePartialSuccess.subscribe(failedLimits => {

               const failedLimit: IFailureLimits[] = [];

               failedLimits.map(i => failedLimit.push({
                  limittype: i.transactionID, reason: i.resultDetail && i.resultDetail.length > 0 &&
                     i.resultDetail[0].Reason ? i.resultDetail[0].Reason : ''
               }));
               this.NotifyFailedLimits(failedLimit);
            }, (error: any) => {
               this.raiseSystemError();
            });

            this.bsModalRef.content.resendApproveDetails.subscribe(() => {

               this.resendBulkApprovalDetails();
            }, (error: any) => {
               this.raiseSystemError();
            });

            this.bsModalRef.content.getOTPStatus.subscribe(otpValue => {

               this.service.getApproveItOtpStatus(otpValue, this.service.updatedlimits.transactionId)
                  .subscribe(otpResponse => {
                     this.bsModalRef.content.processApproveUserResponse(otpResponse);
                  }, (error: any) => {
                     this.raiseSystemError();
                  });
            }, (error: any) => {
               this.raiseSystemError();
            });

            this.bsModalRef.content.otpIsValid.subscribe(() => {
               this.service.getApproveItStatus().subscribe(approveItResponse => {
                  this.bsModalRef.content.ProcessApproveItLimitResponse(approveItResponse);
               }, (error: any) => {
                  this.raiseSystemError();
               });
            }, (error: any) => {
               this.raiseSystemError();
            });

            this.modalSubscription = this.modalService.onHidden.asObservable()
               .subscribe(() => {
                  this.updateOldLimitsDetails(this.service.successFullLimits);
                  try {
                     this.bsModalRef.content.otpIsValid.unSubscribe();
                  } catch (e) { }
                  try {
                     this.bsModalRef.content.getApproveItStatus.unSubscribe();
                  } catch (e) { }

                  try {
                     this.bsModalRef.content.resendApproveDetails.unSubscribe();
                  } catch (e) { }

                  try {
                     this.bsModalRef.content.updateSuccess.unSubscribe();
                  } catch (e) { }

                  try {
                     this.bsModalRef.content.getOTPStatus.unSubscribe();
                  } catch (e) { }

               }, (err: any) => {
                  this.raiseSystemError();
               });
         } else if (responseStatus === 'SUCCESS') {

            if (this.service.isTransactionStatusValid(response)) {
               this.updateOldLimitsDetails(this.service.updatedlimits.limits);
            } else {
               const reason = this.getReasonFromResponse(response);
               this.service.isChangeSuccessful = false;
               this.service.notifyResponse(Constants.VariableValues.settings.updateStatus.Partial);
               for (let i = 0; i < this.service.failedLimits.length; i++) {
                  this.notifyChildren(NotificationTypes.Error,
                     Constants.VariableValues.settings.labels.Failed, this.service.failedLimits[i].limittype, reason);
               }
            }

         } else {
            this.service.isChangeSuccessful = false;
            const reason = this.getReasonFromResponse(response);
            this.service.notifyResponse(Constants.VariableValues.settings.updateStatus.Partial);
            for (let i = 0; i < this.service.failedLimits.length; i++) {
               this.notifyChildren(NotificationTypes.Error,
                  Constants.VariableValues.settings.labels.Failed, this.service.failedLimits[i].limittype, reason);
            }
         }
      }, (error: any) => {
         this.raiseSystemError();
      });
   }
   private NotifyFailedLimits(failedLimits: IFailureLimits[]) {
      this.service.failedLimits = failedLimits;
      if (failedLimits.length === this.service.changedLimits.length) {
         this.service.notifyResponse(Constants.VariableValues.settings.updateStatus.Failure);
         for (let i = 0; i < failedLimits.length; i++) {
            this.notifyChildren(NotificationTypes.Error,
               Constants.VariableValues.settings.labels.Failed, failedLimits[i].limittype, failedLimits[i].reason);
         }
      } else {
         this.service.notifyResponse(Constants.VariableValues.settings.updateStatus.Partial);
         for (let i = 0; i < failedLimits.length; i++) {
            this.notifyChildren(NotificationTypes.Error,
               Constants.VariableValues.settings.labels.Failed, failedLimits[i].limittype, failedLimits[i].reason);
         }

         for (let j = 0; j < this.service.successFullLimits.length; j++) {
            this.notifyChildren(NotificationTypes.Success, Constants.VariableValues.settings.labels.SuccessfullyUpdated,
               this.service.successFullLimits[j].limitDetail.limitType);
         }
      }
   }

   setIsProfileLimits() {
      this.service.isProfileLimits = true;
   }
}


interface ILimitPayload {
   newLimit: number;
   isTempLimit: boolean;
   tempLimitEnd?: string;
}

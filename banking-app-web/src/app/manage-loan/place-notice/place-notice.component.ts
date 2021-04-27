import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreFillService } from '../../core/services/preFill.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ManageLoanService } from '../manage-loan.service';
import { Constants } from '../../core/utils/constants';
import {
   IApiResponse, ILoanCancelRequest, IHomeLoanStatus, ITransactionStatus, IStatusDetail
} from '../../core/services/models';
import { CommonUtility } from '../../core/utils/common';
import { NotificationTypes } from '../../core/utils/enums';
import { ManageLoanConstants } from '../constants';

@Component({
   selector: 'app-place-notice',
   templateUrl: './place-notice.component.html',
   styleUrls: ['./place-notice.component.scss']
})
export class PlaceNoticeComponent implements OnInit {

   homeLoanStatusData: IHomeLoanStatus;
   accountId: string;
   status: NotificationTypes = NotificationTypes.None;
   notificationTypes = NotificationTypes;
   labels = ManageLoanConstants.labels.placeNotice;
   statusLables = ManageLoanConstants.labels.status;
   isOverlayVisible: boolean;
   btnText = Constants.labels.settlement.buttons.close;
   confirmPopup: boolean;
   isJointBondAccount: boolean;
   requestInProgress: boolean;
   retryLimitExceeded: boolean;
   messages = ManageLoanConstants.messages.placeNotice;
   values = ManageLoanConstants.values;

   statusDetail: IStatusDetail;
   isFromPlaceNotice = true;
   retryCount = 0;
   showCloseBtn = true;

   selectedTemplate: TemplateRef<any>;
   @ViewChild('statusTemplate') statusTemplate: TemplateRef<any>;
   @ViewChild('placeNoticeTemplate') placeNoticeTemplate: TemplateRef<any>;
   @ViewChild('noticeExist') noticeExist: TemplateRef<any>;
   @ViewChild('noticeInProgress') noticeInProgress: TemplateRef<any>;

   constructor(private router: Router,
      private route: ActivatedRoute,
      private preFillService: PreFillService,
      private manageLoanService: ManageLoanService,
      private systemErrorService: SystemErrorService) {
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.getHomeLoanStatusData();
      this.isOverlayVisible = true;
      this.selectedTemplate = this.placeNoticeTemplate;
      this.statusDetail = {} as IStatusDetail;
   }

   getHomeLoanStatusData() {
      this.homeLoanStatusData = this.preFillService.homeLoanStatusData;
      this.isJointBondAccount = this.homeLoanStatusData && this.homeLoanStatusData.isJointBondEnabled;
   }

   showHideConfirmPopup() {
      this.confirmPopup = !this.confirmPopup;
   }

   submitPlaceNotice() {
      if (this.retryCount <= this.values.tryAgainLimit) {
         this.requestInProgress = true;
         this.manageLoanService.cancelLoan(this.createLoanRequest(this.accountId), this.values.cancelLoanTypes.cancelNotices)
            .finally(() => {
               this.requestInProgress = false;
               this.confirmPopup = false;
            })
            .subscribe((response: IApiResponse) => {
               if (response && response.metadata) {
                  const status = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.loanProductsManagement);
                  this.handleStatus(status);
               } else {
                  this.handleStatus(null);
               }
            }, (error) => {
               this.systemErrorService.closeError();
               this.handleStatus(null);
            });
         this.retryLimitExceeded = this.retryCount === this.values.tryAgainLimit;
      } else {
         this.retryLimitExceeded = true;
      }
   }

   createLoanRequest(accountId: string): ILoanCancelRequest {
      const loanRequest = {} as ILoanCancelRequest;
      loanRequest.itemaccountid = accountId;
      return loanRequest;
   }

   onRetry(isRetried: boolean) {
      if (isRetried) {
         this.retryCount++;
         this.submitPlaceNotice();
      } else {
         this.closeOverlay();
      }
   }

   handleStatus(status: ITransactionStatus) {
      if (status && (status.isValid || status.result === Constants.statusCode.errorCodeR03)) {
         this.status = this.notificationTypes.Success;
         this.statusDetail.title = this.messages.success.title;
         this.statusDetail.description = this.messages.success.description;
         this.showCloseBtn = false;
         this.selectedTemplate = this.statusTemplate;
      } else if (status && (status.result === Constants.statusCode.errorCodeR01
         || status.result === Constants.statusCode.errorCodeR04)) {
         this.setErrorDetails();
      } else if (status && status.result === Constants.statusCode.errorCodeR02) {
         this.selectedTemplate = this.noticeInProgress;
      } else if (status && status.result === Constants.statusCode.errorCodeR05) {
         this.selectedTemplate = this.noticeExist;
      } else {
         this.setErrorDetails();
      }
   }

   setErrorDetails() {
      this.status = this.notificationTypes.Error;
      this.statusDetail.title = this.messages.error.title;
      if (this.retryLimitExceeded) {
         this.statusDetail.description = this.statusLables.contactUsOn;
         this.statusDetail.description2 = this.values.contactNo;
      }
      this.selectedTemplate = this.statusTemplate;
   }

   closeOverlay() {
      this.isOverlayVisible = false;
      this.router.navigateByUrl(encodeURI(Constants.routeUrls.manageLoan + this.accountId));
   }

   userActionClick(actionValue: string) {
      if (actionValue === ManageLoanConstants.labels.confirmModal.yesButton) {
         this.submitPlaceNotice();
      } else {
         this.showHideConfirmPopup();
      }
   }
}

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreFillService } from '../../core/services/preFill.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ManageLoanService } from '../manage-loan.service';
import { IApiResponse, ILoanCancelRequest, IHomeLoanStatus, ITransactionStatus, IStatusDetail } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { ManageLoanConstants } from '../constants';
import { CommonUtility } from '../../core/utils/common';
import { NotificationTypes } from '../../core/utils/enums';

@Component({
   selector: 'app-cancel-loan',
   templateUrl: './cancel-loan.component.html',
   styleUrls: ['./cancel-loan.component.scss']
})
export class CancelLoanComponent implements OnInit {

   accountId: string;
   statusDetail: IStatusDetail;
   recipientEmail: string;
   homeLoanStatusData: IHomeLoanStatus;
   retryCount = 0;

   btnText = Constants.labels.settlement.buttons.close;
   labels = ManageLoanConstants.labels.cancelLoan;
   statusLables = ManageLoanConstants.labels.status;
   values = ManageLoanConstants.values;
   messages = ManageLoanConstants.messages.cancelLoan;
   cancellationFeeTextQuery = this.values.cancellationFeeTextQuery;

   isValidEmail: boolean;
   isAccepted: boolean;
   confirmPopup: boolean;
   isJointBondEnabled: boolean;
   isLoanPaidUp: boolean;
   isOverlayVisible: boolean;
   requestInProgress: boolean;
   retryLimitExceeded: boolean;
   isNinetyDaysNoticeEnabled: boolean;
   applyCancellationFee: boolean;

   status: NotificationTypes = NotificationTypes.None;
   notificationTypes = NotificationTypes;
   emailPattern = Constants.patterns.email;

   selectedTemplate: TemplateRef<any>;
   @ViewChild('cancelLoanTemplate') cancelLoanTemplate: TemplateRef<any>;
   @ViewChild('statusTemplate') statusTemplate: TemplateRef<any>;
   @ViewChild('successTemplate') successTemplate: TemplateRef<any>;
   @ViewChild('cancelReqInProgressTemplate') cancelReqInProgressTemplate: TemplateRef<any>;
   @ViewChild('cancelReqReceivedTemplate') cancelReqReceivedTemplate: TemplateRef<any>;

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
      this.selectedTemplate = this.cancelLoanTemplate;
      this.statusDetail = {} as IStatusDetail;
   }

   getHomeLoanStatusData() {
      this.homeLoanStatusData = this.preFillService.homeLoanStatusData;
      if (this.homeLoanStatusData) {
         this.isLoanPaidUp = this.homeLoanStatusData.isLoanPaidUp;
         this.isJointBondEnabled = this.homeLoanStatusData.isJointBondEnabled;
         this.isNinetyDaysNoticeEnabled = this.homeLoanStatusData.isNinetyDaysNoticeEnabled;
      }
   }

   showHideConfirmPopup() {
      this.confirmPopup = !this.confirmPopup;
   }

   reqCancelNotice() {
      if (this.retryCount <= this.values.tryAgainLimit) {
         this.requestInProgress = true;
         this.manageLoanService.cancelLoan(this.createLoanRequest(this.accountId, this.recipientEmail),
            this.values.cancelLoanTypes.cancellationRequests)
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

   handleStatus(status: ITransactionStatus) {
      if (status) {
         if (status.isValid || status.result === Constants.statusCode.errorCodeR03) {
            this.selectedTemplate = this.successTemplate;
         } else if (status.result === Constants.statusCode.errorCodeR01
            || status.result === Constants.statusCode.errorCodeR04) {
            this.setErrorDetails();
         } else if (status.result === Constants.statusCode.errorCodeR02) {
            this.selectedTemplate = this.cancelReqInProgressTemplate;
         } else if (status.result === Constants.statusCode.errorCodeR05) {
            this.selectedTemplate = this.cancelReqReceivedTemplate;
         } else {
            this.setErrorDetails();
         }
      } else {
         this.setErrorDetails();
      }
   }

   setErrorDetails() {
      this.status = this.notificationTypes.Error;
      this.statusDetail.title = this.messages.error.title;
      if (this.retryLimitExceeded) {
         this.statusDetail.description = this.labels.contactUs;
         this.statusDetail.description2 = this.values.contactNo;
         this.statusDetail.description3 = this.values.cancellationsEmail;
      }
      this.selectedTemplate = this.statusTemplate;
   }

   createLoanRequest(accountId: string, recipientEmail: string): ILoanCancelRequest {
      const loanRequest = {} as ILoanCancelRequest;
      loanRequest.itemaccountid = accountId;
      loanRequest.emailid = recipientEmail;
      return loanRequest;
   }

   onRetry(isRetried: boolean) {
      if (isRetried) {
         this.retryCount++;
         this.reqCancelNotice();
      } else {
         this.closeOverlay();
      }
   }

   onEmailChange(recipientEmail: string) {
      this.isValidEmail = CommonUtility.isValidEmail(recipientEmail);
   }

   onClickPlaceNotice() {
      this.router.navigateByUrl(encodeURI(Constants.routeUrls.placeNotice + this.accountId));
   }

   closeOverlay() {
      this.isOverlayVisible = false;
      this.router.navigateByUrl(encodeURI(Constants.routeUrls.manageLoan + this.accountId));
   }

   userActionClick(actionValue: string) {
      if (actionValue === ManageLoanConstants.labels.confirmModal.yesButton) {
         this.reqCancelNotice();
      } else {
         this.showHideConfirmPopup();
      }
   }

   onEarlyTerminationFee(event: boolean) {
      this.applyCancellationFee = event;
   }
}

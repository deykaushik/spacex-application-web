import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Constants } from '../../../core/utils/constants';
import { AccountService } from '../../../dashboard/account.service';
import { IScheduledTransaction } from '../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-view-schedule-payment',
   templateUrl: './view-schedule-payment.component.html',
   styleUrls: ['./view-schedule-payment.component.scss']
})
export class ViewSchedulePaymentComponent extends BaseComponent implements OnInit {
   skeletonMode = true;
   accountId: number;
   isDeleteInProcess: boolean;
   iconClass: string;
   transactionID: number;
   transactionType: string;
   transactionDetail: IScheduledTransaction;
   heading: string;
   dateFormat: string = Constants.formats.ddMMYYYY;
   isShowSuccessMessage = false;
   isDeleteOverlay: boolean;
   labels = Constants.viewSchedulePaymentLabels;
   isDeleteFailed: boolean;
   retryMaxCount = Constants.VariableValues.maximumPaymentAttempts;
   retryCount = -1;
   paymentFailedMsg = this.labels.paymentFailedMsg;
   showCantBeDeletedMsg: boolean;
   showModal = false;
   backUrl: string;
   scheduleType = Constants.SchedulePaymentType;
   disableBtnErrorMsg = true;


   constructor(private route: ActivatedRoute, private accountService: AccountService,
      private locationService: Location, private router: Router, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => {
         this.transactionType = params.transactionType;
         this.transactionID = parseInt(params.transactionID, 10);
         this.accountId = params.accountId;
      });
   }

   ngOnInit() {
      this.getScheduleTransaction();
      this.setBackUrl();
   }
   setBackUrl() {
      if (this.accountId) {
         this.backUrl = CommonUtility.format(Constants.path.schedulePayment, this.accountId);
      } else {
         this.backUrl = Constants.path.recipient;
      }
   }
   getScheduleTransaction() {
      switch (this.transactionType) {
         case Constants.SchedulePaymentType.transfer.name:
            this.accountService.getScheduledTransferDetail(this.transactionID).subscribe(response => this.populateData(response));
            this.heading = Constants.SchedulePaymentType.transfer.heading;
            this.iconClass = Constants.SchedulePaymentType.transfer.icon;
            break;
         case Constants.SchedulePaymentType.prepaid.name:
            this.accountService.getScheduledPrepaidDetail(this.transactionID).subscribe(response => this.populateData(response));
            this.heading = Constants.SchedulePaymentType.prepaid.heading;
            this.iconClass = Constants.SchedulePaymentType.prepaid.icon;
            break;
         case Constants.SchedulePaymentType.payment.name:
            this.accountService.getScheduledPaymentDetail(this.transactionID).subscribe(response => this.populateData(response));
            this.heading = Constants.SchedulePaymentType.payment.heading;
            this.iconClass = Constants.SchedulePaymentType.payment.icon;
            break;
      }
   }
   setSuccessState() {
      const state = this.accountService.getSuccessState();
      if (state && state.transaction && state.transaction.transactionID === this.transactionID) {
         this.isShowSuccessMessage = true;
         this.transactionDetail = undefined;
         this.skeletonMode = true;
         this.getScheduleTransaction();
         this.accountService.resetSuccessState();
      }
   }

   populateData(transactionDetail: IScheduledTransaction) {
      this.transactionDetail = transactionDetail;
      this.showCantBeDeletedMsg = this.isNonEditable();
      this.skeletonMode = false;
   }

   isNonEditable(): boolean {
      const timeDiffinMs = +new Date(this.transactionDetail.nextTransDate) - Date.now();
      const oneHourInMs = 60 * 60 * 1000;
      if (timeDiffinMs < oneHourInMs) {
         return true;
      } else {
         return false;
      }
   }

   goBack() {
      this.router.navigateByUrl(this.backUrl);
   }

   goToEdit() {
      this.showModal = true;
   }

   hideOverlay(value) {
      this.showModal = value;
      this.isShowSuccessMessage = false;
   }

   removeScheduleTransaction() {
      this.retryCount++;
      if (this.retryCount > 3) {
         this.paymentFailedMsg = this.labels.paymentRetryfailedMsg;
         return;
      }
      this.isDeleteOverlay = false;
      let recurringId = null, transactionID: number;
      this.isDeleteInProcess = true;
      transactionID = this.transactionID;
      if (this.transactionDetail.reoccurrenceItem) {
         recurringId = { recinstrid: this.transactionDetail.reoccurrenceItem.recInstrID };
      } else if (this.transactionType === Constants.SchedulePaymentType.prepaid.name) {
         recurringId = { batchId: this.transactionDetail.batchID };
      } else {
         transactionID = this.transactionDetail.batchID;
      }

      switch (this.transactionType) {
         case Constants.SchedulePaymentType.transfer.name:
            this.accountService.removeScheduledTransferDetail(transactionID, recurringId)
               .subscribe(response => this.checkResponse(response), err => this.handleError(err));
            break;
         case Constants.SchedulePaymentType.prepaid.name:
            this.accountService.removeScheduledPrepaidDetail(transactionID, recurringId)
               .subscribe(response => this.checkResponse(response), err => this.handleError(err));
            break;
         case Constants.SchedulePaymentType.payment.name:
            this.accountService.removeScheduledPaymentDetail(transactionID, recurringId)
               .subscribe(response => this.checkResponse(response), err => this.handleError(err));
            break;
      }
   }
   openDeleteOverlay() {
      this.isDeleteOverlay = true;
      this.sendEvent('click_on_delete_scheduled_payment_on_view');
   }

   handleError(err) {
      this.isDeleteInProcess = false;
      this.isDeleteFailed = true;
   }

   checkResponse(response): any {
      this.isDeleteInProcess = false;
      if (this.accountService.isTransactionStatusValid(response)) {
         this.router.navigateByUrl(this.backUrl);
      } else {
         this.isDeleteFailed = true;
      }
   }

   closeDeleteOverlay() {
      this.isDeleteOverlay = false;
      this.isDeleteInProcess = false;
   }

   refreshPayment() {
      this.setSuccessState();
      this.showModal = false;
   }
}

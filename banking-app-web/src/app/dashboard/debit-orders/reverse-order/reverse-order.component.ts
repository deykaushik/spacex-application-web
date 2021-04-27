import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, Injector } from '@angular/core';

import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { IDropdownItem } from '../../../core/utils/models';
import { AccountService } from '../../account.service';
import { IDisputeOrderPost, IDebitOrder, IDebitOrderReasons } from '../../../core/services/models';
import { NotificationTypes } from '../../../core/utils/enums';
import { BaseComponent } from '../../../core/components/base/base.component';
import { SystemErrorService } from '../../../core/services/system-services.service';

@Component({
   selector: 'app-reverse-order',
   templateUrl: './reverse-order.component.html',
   styleUrls: ['./reverse-order.component.scss']
})
export class ReverseOrderComponent extends BaseComponent implements OnInit, AfterViewInit {
   @Input() orderInfo: IDebitOrder;
   @Input() accountType: String;
   @Output() onHide = new EventEmitter();
   @Output() changeButtonText = new EventEmitter<boolean>();
   @Output() stopDebitOrderClicked = new EventEmitter();

   @ViewChild('reverseOrderForm') reverseOrderForm;

   reasons = [];
   selectedReason: IDebitOrderReasons;
   currentStatus: NotificationTypes = NotificationTypes.None;
   notificationTypes = NotificationTypes;
   isLoading: Boolean = false;
   retryLimitExceeded: Boolean = false;
   otherDescription = '';
   isValid = false;
   isSuccess = false;
   debitOrderVariableValues = Constants.VariableValues.debitOrder;
   descLimit = this.debitOrderVariableValues.otherReasonCharLength;
   descInfo = '';
   retryCount = 0;
   labels = Constants.labels.debitOrder;
   messages = Constants.messages.debitOrders;
   reasonType = this.debitOrderVariableValues.reasonOrderType.reversePaymentReasons;
   reasonsLoader = false;
   showStopOnSuccess = false;

   constructor(private service: AccountService, injector: Injector, private systemErrorService: SystemErrorService) {
      super(injector);
   }

   ngOnInit() {
      this.descInfo = this.descChange();
      this.getReasons();
   }
   descChange() {
      return this.otherDescription.length + '/' + this.descLimit;
   }
   ngAfterViewInit() {
      this.reverseOrderForm.valueChanges
         .subscribe(values => this.validate());
   }
   validate() {
      this.isValid = (this.selectedReason.description ?
         this.selectedReason.description === this.labels.other ?
            (!!this.otherDescription) : true : false);
   }
   onReasonChanged(index: number) {
      this.selectedReason = this.reasons[index];
      this.validate();
   }
   disputeOrder() {
      const data: IDisputeOrderPost = {
         transactionReference: this.orderInfo.contractReferenceNr,
         installmentAmount: this.orderInfo.installmentAmount,
         lastDebitDate: this.orderInfo.lastDebitDate,
         reason: this.selectedReason.code,
         description: this.otherDescription,
         subTranCode: this.orderInfo.subTranCode
      };
      this.isLoading = true;
      this.retryCount++;
      if (this.retryCount <= (Constants.VariableValues.maximumDebitReverseAttempts + 1)) {
         this.service.disputeAnOrder(this.orderInfo.itemAccountId, data).subscribe(
            (isSuccess: boolean) => {
               this.changeButtonText.emit(true);
               this.currentStatus = isSuccess ? NotificationTypes.Success : NotificationTypes.Error;
               this.isLoading = false;
               this.retryLimitExceeded = (this.retryCount === (Constants.VariableValues.maximumDebitReverseAttempts + 1));
               this.isSuccess = isSuccess;
               this.showStopOnSuccess = this.orderInfo.installmentAmount < this.debitOrderVariableValues.installmentAmountValue
                  ? true : false;
            }, () => {
               this.isSuccess = false;
               this.currentStatus = NotificationTypes.Error;
               this.retryLimitExceeded = (this.retryCount === (Constants.VariableValues.maximumDebitReverseAttempts + 1));
               this.isLoading = false;
            });
      } else {
         this.retryLimitExceeded = true;
      }
   }
   onRetryDispute() {
      this.disputeOrder();
   }
   onDone(isReversed: boolean) {
      this.onHide.emit();
   }

   getReasons() {
      this.reasonsLoader = true;
      this.service.getDebitOrderReasons(this.reasonType).subscribe((reasons: IDebitOrderReasons[]) => {
         this.reasons = reasons;
         this.reasonsLoader = false;
      }, (error) => this.handleError());
   }

   handleError() {
      this.systemErrorService.closeError();
   }
   stopDebitOrderClickedFromReverse() {
      this.stopDebitOrderClicked.emit();
   }

}

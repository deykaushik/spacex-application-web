import { Component, OnInit, Output, EventEmitter, Input, Injector } from '@angular/core';
import { AccountService } from '../../account.service';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { IDropdownItem } from '../../../core/utils/models';
import { IDebitOrder, IDebitOrderReasons, IStopOrderPost } from '../../../core/services/models';
import { GAEvents } from '../../../core/utils/ga-event';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-stop-debit-order',
   templateUrl: './stop-debit-order.component.html',
   styleUrls: ['./stop-debit-order.component.scss']
})
export class StopDebitOrderComponent extends BaseComponent implements OnInit {
   @Input() orderDetails: IDebitOrder;
   @Input() accountType: string;
   @Output() changeButtonText = new EventEmitter<boolean>();
   @Output() onHide = new EventEmitter();

   reasons: IDebitOrderReasons[] = [{ code: '', description: '' }];
   selectedReason: IDebitOrderReasons;
   labels = Constants.labels.debitOrder;
   messages = Constants.messages.debitOrders;
   debitOrderStopped = false;
   otherReasonDescription: string;
   otherReasonCode = Constants.VariableValues.debitOrder.otherReasonCode;
   maxLength = Constants.VariableValues.debitOrder.otherReasonCharLength;
   remainingLength = this.maxLength;
   isValid = false;
   reasonType = Constants.VariableValues.debitOrder.reasonOrderType.stopPaymentReasons;
   showLoader = false;
   reasonsLoader = false;

   constructor(private accountService: AccountService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.getReasons();
   }

   stopDebitOrder() {
      this.showLoader = true;
      const details: IStopOrderPost[] = [{
         lastDebitDate: this.orderDetails.lastDebitDate,
         tranCode: this.orderDetails.tranCode,
         installmentAmount: this.orderDetails.installmentAmount,
         creditorName: this.orderDetails.contractReferenceNr,
         statementNumber: this.orderDetails.statementNumber,
         statementLineNumber: this.orderDetails.statementLineNumber,
         statementDate: this.orderDetails.statementDate,
         reasonCode: this.selectedReason.code,
         contractReferenceNr: this.orderDetails.contractReferenceNr,
         chargeAmount: this.orderDetails.chargeAmount,
         subTranCode: this.orderDetails.subTranCode
      }];
      this.accountService.stopDebitOrder(this.orderDetails.itemAccountId, details)
         .subscribe((response: boolean) => {
            this.debitOrderStopped = response ? true : false;
            this.changeButtonText.emit(response);
            this.showLoader = false;
         });
      const stopDebitOrderButton = Object.assign({}, GAEvents.debitOrder.stopDebitOrderButton);
      stopDebitOrderButton.label += this.accountType;
      this.sendEvent(stopDebitOrderButton.eventAction, stopDebitOrderButton.label, null, stopDebitOrderButton.category);
   }

   closeStopDebitOrder() {
      this.onHide.emit();
   }

   onReasonChanged(index: number) {
      this.selectedReason = this.reasons[index];
      this.validate();
   }

   getReasons() {
      this.reasonsLoader = true;
      this.accountService.getDebitOrderReasons(this.reasonType).subscribe((reasons: IDebitOrderReasons[]) => {
         const data: IDebitOrderReasons[] = reasons.filter(reason => {
            return reason.channelTechType === Constants.VariableValues.debitOrder.channelTechType;
         });
         this.reasons = data;
         this.reasonsLoader = false;
      });
   }

   reasonTextChanged(length: number) {
      this.remainingLength = this.maxLength - length;
      this.validate();
   }

   validate() {
      if (this.selectedReason.code) {
         this.isValid = true;
         if (this.selectedReason.code === this.otherReasonCode) {
            this.isValid = (this.remainingLength < this.maxLength) ? true : false;
         }
      }
   }
}

import { Component, Output, EventEmitter, Input, Injector, OnInit } from '@angular/core';
import { AccountService } from '../../account.service';
import { IDebitOrder, ICancelStopOrderPost } from '../../../core/services/models';
import { BaseComponent } from '../../../core/components/base/base.component';
import { Constants } from '../../../core/utils/constants';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-cancel-stop-order',
   templateUrl: './cancel-stop-order.component.html',
   styleUrls: ['./cancel-stop-order.component.scss']
})
export class CancelStopOrderComponent extends BaseComponent {
   @Input() orderDetails: IDebitOrder;
   @Input() accountType: string;
   @Output() changeButtonText = new EventEmitter<boolean>();
   @Output() onHide = new EventEmitter();

   labels = Constants.labels.debitOrder;
   messages = Constants.messages.debitOrders;
   checkboxValue = false;
   stopOrderCancelled = false;
   showLoader = false;

   constructor(private accountService: AccountService, injector: Injector) {
      super(injector);
   }

   cancelStopDebitOrder() {
      this.showLoader = true;
      const orderInfo: ICancelStopOrderPost = {
         installmentAmount: this.orderDetails.installmentAmount,
         tranCode: this.orderDetails.tranCode,
         lastDebitDate: this.orderDetails.stoppedDate,
         sequenceNumber: this.orderDetails.sequenceNumber
      };
      this.accountService.cancelStopDebitOrder(this.orderDetails.itemAccountId, orderInfo).subscribe((response: boolean) => {
         this.stopOrderCancelled = response ? true : false;
         this.changeButtonText.emit(response);
         this.showLoader = false;
      });
      const cancelButtonClickedAction = Object.assign({}, GAEvents.debitOrder.cancelButtonClickedAction);
      cancelButtonClickedAction.label += this.accountType;
      this.sendEvent(cancelButtonClickedAction.eventAction, cancelButtonClickedAction.label,
         null, cancelButtonClickedAction.category);
      cancelButtonClickedAction.label = '';
   }
   checkBoxClick(event: boolean) {
      this.checkboxValue = event;
   }
   closeCancelStopDebitOrder() {
      this.onHide.emit();
   }
}

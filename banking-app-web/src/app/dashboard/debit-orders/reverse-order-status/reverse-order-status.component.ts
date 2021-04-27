import { Component, Input, EventEmitter, Output, OnInit, Injector } from '@angular/core';
import { NotificationTypes } from '../../../core/utils/enums';
import { Constants } from '../../../core/utils/constants';
import { GAEvents } from '../../../core/utils/ga-event';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-reverse-order-status',
   templateUrl: './reverse-order-status.component.html',
   styleUrls: ['./reverse-order-status.component.scss']
})
export class ReverseOrderStatusComponent extends BaseComponent {
   @Input() status: NotificationTypes = NotificationTypes.None;
   @Input() accountType: string;
   @Output() onRetry = new EventEmitter();
   @Output() onDone = new EventEmitter<boolean>();
   @Input() isLoading: Boolean = false;
   @Input() retryLimitExceeded;
   @Input() isSuccess: boolean;
   @Input() showStopDebitOrder: boolean;
   @Output() stopDebitOrderClicked = new EventEmitter();
   debitReverseHelplineText: string = Constants.VariableValues.debitReverseHelplineText;
   notificationTypes = NotificationTypes;
   isRetried: Boolean = false;
   messages = Constants.messages.debitOrders.reverseDebitOrder;
   labels = Constants.labels.debitOrder;

   constructor(injector: Injector) {
      super(injector);
   }
   onClose() {
      this.onDone.emit(true);
   }
   onRetrybuttonClick() {
      this.isRetried = true;
      this.onRetry.emit();
   }
   stopDebitOrder() {
      const stopDebitOrderSuccessPage = Object.assign({}, GAEvents.debitOrder.stopDebitOrderSuccessPage);
      stopDebitOrderSuccessPage.label += this.accountType;
      this.sendEvent(stopDebitOrderSuccessPage.eventAction, stopDebitOrderSuccessPage.label,
         null, stopDebitOrderSuccessPage.category);
      this.stopDebitOrderClicked.emit();
   }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-popup-stepper',
   templateUrl: './popup.component.html',
   styleUrls: ['./popup.component.scss']
})

export class PopupComponent {
   @Output() userActionClick = new EventEmitter<string>();
   payoutTypeLabels = Constants.labels.buildingLoan.paymentType;
   payoutTypeMessages = Constants.messages.buildingLoan.paymentType;
   confirmlabel= this.payoutTypeLabels.confirm;
   userAction(actionValue: string) {
      this.userActionClick.emit(actionValue);
   }
}

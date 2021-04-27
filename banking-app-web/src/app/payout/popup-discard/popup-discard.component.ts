import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-popup-discard-stepper',
   templateUrl: './popup-discard.component.html',
   styleUrls: ['./popup-discard.component.scss']
})

export class PopupDiscardComponent {
   @Input() showPopup: boolean;
   @Output() userActionClick = new EventEmitter<string>();
   discardMessages = Constants.messages.buildingLoan;
   discardLabels = Constants.labels.buildingLoan;

   discardAction(actionValue: string) {
      this.userActionClick.emit(actionValue);
   }
}

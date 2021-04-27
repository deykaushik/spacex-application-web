import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../../core/utils/constants';

@Component({
   selector: 'app-overdraft-limit-success',
   templateUrl: './overdraft-limit-success.component.html',
   styleUrls: ['./overdraft-limit-success.component.scss']
})
export class OverdraftLimitSuccessComponent {
   @Input() isVisible: boolean;
   @Output() backToCard: EventEmitter<boolean> = new EventEmitter<boolean>();
   label = Constants.labels.overdraft;

   closeOverlay(event: boolean) {
      this.backToCard.emit(event);
   }
}

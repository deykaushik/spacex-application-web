import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Constants } from '../../../core/utils/constants';

@Component({
   selector: 'app-overdraft-limit-fica',
   templateUrl: './overdraft-limit-fica.component.html',
   styleUrls: ['./overdraft-limit-fica.component.scss']
})
export class OverdraftLimitFicaComponent {
   @Input() isVisible: boolean;
   @Output() backToCard: EventEmitter<boolean> = new EventEmitter<boolean>();
   label = Constants.labels.overdraft;

   closeOverlay(event: boolean) {
      this.backToCard.emit(event);
   }
}

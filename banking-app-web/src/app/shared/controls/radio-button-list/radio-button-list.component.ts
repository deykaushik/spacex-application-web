import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IRadioButtonItem } from './../../../core/services/models';

@Component({
   selector: 'app-radio-button-list',
   templateUrl: './radio-button-list.component.html',
   styleUrls: ['./radio-button-list.component.scss']
})
export class RadioButtonListComponent implements OnInit {

   @Input() radioList: IRadioButtonItem[];
   @Output('onSelectionChange') onSelectionChange: EventEmitter<IRadioButtonItem> = new EventEmitter<IRadioButtonItem>();
   @Input() selectedValue;
   @Input() groupName;
   @Input() isVertical = false;
   @Input() isToolTipEnabled: boolean;
   constructor() { }

   onRadioItemSelection(radioItem: IRadioButtonItem) {
      if (this.isToolTipEnabled) {
         this.radioList.forEach((item, index) => {
            item.isTooltipActive = false;
         });
         radioItem.isTooltipActive = false;
      }
      this.onSelectionChange.emit(radioItem);
   }
   showSelectedItemTooltip(radioItem: IRadioButtonItem) {
      this.radioList.forEach((item, index) => {
         item.isTooltipActive = (item.value === radioItem.value && (!item.isTooltipActive)) ? true : false;
      });
   }
   ngOnInit() {
   }
}

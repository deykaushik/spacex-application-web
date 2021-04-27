import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IButtonGroup, IToggleButtonGroup } from '../../../core/services/models';

@Component({
   selector: 'app-toggle-tab-group',
   templateUrl: './toggle-tab-group.component.html',
   styleUrls: ['./toggle-tab-group.component.scss']
})
export class ToggleTabGroupComponent implements OnInit {

   @Input() toggleButtonGroup: IToggleButtonGroup;
   @Input() selectedButtonValue: string;
   @Output('onSelectionChange') onSelectionChange: EventEmitter<IButtonGroup> = new EventEmitter<IButtonGroup>();
   buttonGroup: IButtonGroup[];
   groupName?: string;
   isGroupDisabled: boolean;
   buttonGroupWidth: number;

   constructor() { }

   ngOnInit() {
      if (this.toggleButtonGroup) {
         this.buttonGroup = this.toggleButtonGroup.buttonGroup;
         this.groupName = this.toggleButtonGroup.groupName;
         this.isGroupDisabled = this.toggleButtonGroup.isGroupDisabled;
         this.buttonGroupWidth = this.toggleButtonGroup.buttonGroupWidth;
      }
   }

   onRadioItemSelection(radioItem: IButtonGroup) {
      if (!this.isGroupDisabled) {
         this.onSelectionChange.emit(radioItem);
      }
   }

}

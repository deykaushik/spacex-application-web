import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { CommonUtility } from './../../../core/utils/common';

@Component({
   selector: 'app-bottom-button',
   templateUrl: './bottom-button.component.html',
   styleUrls: ['./bottom-button.component.scss']
})
export class BottomButtonComponent implements OnInit {

   @Output() clickEmitter = new EventEmitter();
   @Input() text: string;
   @Input() showLoader = false;
   @Input() disableButton = false;
   @Input() alternateTheme = false;
   @Input() cssClass;
   @Input()  ariaMsg: string;
   @Input()  showAria  =  false;

   onClick(): void {
      this.clickEmitter.emit();
   }

   constructor() { }

   ngOnInit() {
   }

   getID() {
      return CommonUtility.getID(this.text);
   }
}

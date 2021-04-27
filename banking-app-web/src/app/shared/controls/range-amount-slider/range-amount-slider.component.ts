import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { IRangeSliderConfig, IRangeSliderMessages, IRangeSliderEmitModel } from '../../models';
import { AmountFieldComponent } from './../amount-field/amount-field.component';


@Component({
   selector: 'app-range-amount-slider',
   templateUrl: './range-amount-slider.component.html',
   styleUrls: ['./range-amount-slider.component.scss']
})
export class RangeAmountSliderComponent implements OnInit {
   @Input() currentLimit = 0;
   @Input() minValue;
   @Input() config: IRangeSliderConfig;
   @Input() errorMessages: IRangeSliderMessages;
   @Output() change = new EventEmitter<IRangeSliderEmitModel>();
   @Output() onEnd = new EventEmitter<IRangeSliderEmitModel>();
   @Input() isValid: boolean;
   constructor() { }

   ngOnInit() {
   }

   onValueChanged(amountObj: IRangeSliderEmitModel) {
      this.currentLimit = amountObj.value;
      this.change.emit(amountObj);
   }
   onAmountBlur(amountObj: IRangeSliderEmitModel) {
      this.onEnd.emit(amountObj);
   }
   onSliderValueChanged(value) {
      this.currentLimit = value;
      this.change.emit({ isValid: true, value: value });
   }
   onSliderBlur(value) {
      this.currentLimit = value;
      this.onEnd.emit({ isValid: true, value: value });
   }
}

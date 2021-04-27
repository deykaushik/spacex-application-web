import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AmountTransformPipe } from './../../pipes/amount-transform.pipe';
import { IRangeSliderMessages, IRangeSliderEmitModel } from './../../models';
@Component({
   selector: 'app-amount-field',
   templateUrl: './amount-field.component.html',
   styleUrls: ['./amount-field.component.scss']
})
export class AmountFieldComponent implements OnInit {
   divisibleByN: boolean;
   public isValid: boolean;
   @Input() value: number;
   @Input() divisbleBy = 1;
   @Input() alternate = false;
   @Input() maxValue = 0;
   @Input() minValue;
   @Input() errorMessages: IRangeSliderMessages;
   @Output() onAmountChangeEmitter = new EventEmitter<IRangeSliderEmitModel>();
   @Output() onEnd = new EventEmitter<IRangeSliderEmitModel>();
   isAmountExceedsLimit: boolean;
   isAmountLessThanMin: boolean;

   constructor(private amountTransform: AmountTransformPipe) { }

   ngOnInit() {
      if (!this.errorMessages) {
         this.errorMessages = <IRangeSliderMessages>{
            divisibleMsg: '*Amount must be in increments of ',
            maximumMsg: '*Entered value is greater than max.',
            requiredMsg: '*Amount is required.',
            minAmountMsg: `*Amount should be greater than ${this.minValue}`
         };
      }
   }

   onAmountChange(amount: string) {
      this.onAmountChangeEmitter.emit(this.parseAmount(amount));
   }
   onAmountBlur(event: any) {
      this.onEnd.emit(this.parseAmount(event.currentTarget.value));
   }
   parseAmount(amount: string): IRangeSliderEmitModel {
      const parsed_value = parseInt(this.amountTransform.parse(amount), 10);
      this.isAmountExceedsLimit = this.maxValue - parsed_value >= 0 ? false : true;
      this.divisibleByN = parsed_value % this.divisbleBy === 0 ? true : false;
      this.isValid = (!this.isAmountExceedsLimit) && this.divisibleByN;
      if (this.minValue) {
         this.isAmountLessThanMin = (parsed_value < this.minValue);
         this.isValid = this.isValid && !this.isAmountLessThanMin;
      }
      const amountParsed: IRangeSliderEmitModel = { value: parsed_value, isValid: this.isValid };
      return amountParsed;
   }
}

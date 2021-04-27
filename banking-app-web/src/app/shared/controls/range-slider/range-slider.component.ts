import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { IRangeSliderConfig } from '../../models';
import { NouiFormatter } from 'ng2-nouislider';
import { AmountTransformPipe } from '../../pipes/amount-transform.pipe';

@Component({
   selector: 'app-range-slider',
   templateUrl: './range-slider.component.html',
   styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent implements OnChanges, OnInit {
   @Input() config: IRangeSliderConfig;
   @Input() value: number;
   @Input() showTooltip = false;
   @Output() change = new EventEmitter<number>();
   @Output() onEnd = new EventEmitter<number>();
   amountTransform = new AmountTransformPipe();
   amountPipeConfig =  {
      isLabel: true,
      showSign: true
   };
   tipFormatter: any = false;
   shownValue = 0;
   currentValue = 0;

   ngOnInit() {
      if (this.showTooltip) {
      this.tipFormatter = { to: (value: number): string => this.amountTransform.transform(value.toString(), this.amountPipeConfig),
      from: (value: string): number => parseFloat(this.amountTransform.parse(value)) } as NouiFormatter;
      }
   }
   ngOnChanges() {
      if (this.currentValue !== this.value) {
         setTimeout(() => {
            this.shownValue = this.currentValue = this.value;
         }, 50);
      }
   }

   onChange(value: number) {
      this.currentValue = value;
      this.change.emit(value);
   }
   onSliderEnd(value: number) {
      this.currentValue = value;
      this.onEnd.emit(value);
   }
}

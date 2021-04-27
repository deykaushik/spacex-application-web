import { Directive, HostListener, ElementRef, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { AmountTransformPipe } from '../pipes/amount-transform.pipe';
import { Constants } from '../../core/utils/constants';
@Directive({
   selector: '[appAmountFormatMask]'
})
export class AmountFormatDirective implements OnInit {
   @Input() ngModel;
   @Output() ngModelChange = new EventEmitter();
   @Input() hidePrefix = false;
   @Input() noDecimal = false;
   @Input() prefixValue?: string;
   private el: ElementRef;
   code: number;

   constructor(private elementRef: ElementRef, private amountTransform: AmountTransformPipe) {
      this.el = this.elementRef;
   }

   ngOnInit() {
      const formatted_value = this.amountTransform.transform(this.ngModel.toString(), {
         hidePrefix: this.hidePrefix,
         noDecimal: this.noDecimal,
         prefixValue: this.prefixValue
      });
      this.el.nativeElement.value = formatted_value;
   }

   @HostListener('keydown', ['$event'])
   onkeydown(event) {
      this.code = event.keyCode || event.charCode;
   }
   @HostListener('input', ['$event.target.value'])
   onInput(value) {
      const formatted_value = this.amountTransform.transform(value.toString(), {
         hidePrefix: this.hidePrefix, noDecimal: this.noDecimal, prefixValue: this.prefixValue
      });
      const parsed_value = this.amountTransform.parse(formatted_value);
      let startselection = this.el.nativeElement.selectionStart;
      if (value.length < formatted_value.length && (this.code !== Constants.keyCode.delete)) {
         startselection += formatted_value.length - value.length;
      }
      if (value.length > formatted_value.length && startselection > 1) {
         startselection -= value.length - formatted_value.length;
      }
      if (formatted_value[startselection - 1] === ' ' && (this.code !== Constants.keyCode.delete) ) {
           startselection--;
      }
      if (formatted_value[startselection] === ' ' && (this.code === Constants.keyCode.delete) ) {
            startselection++;
      }
      if (startselection === 0) {
       startselection = 1;
      }
      this.el.nativeElement.value = formatted_value;
      if (this.el.nativeElement.setSelectionRange) {
         this.el.nativeElement.setSelectionRange(startselection, startselection);
      }
      this.ngModelChange.emit(parsed_value);
   }
}

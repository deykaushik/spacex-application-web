import { NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive, Input, OnInit, OnChanges } from '@angular/core';
import { AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

@Directive({
   selector: '[appMaxAmount][ngModel]',
   providers: [
      { provide: NG_VALIDATORS, useExisting: ValidateMaxAmountDirective, multi: true }
   ]
})
export class ValidateMaxAmountDirective implements Validator, OnInit, OnChanges {

   @Input() appMaxAmount: number;
   validator: ValidatorFn;
   constructor() {
   }

   ngOnInit() {
      this.validator = validateMaxAmount(this.appMaxAmount);
   }
   validate(control: FormControl) {
      return this.validator(control);
   }

   ngOnChanges() {
      this.validator = validateMaxAmount(this.appMaxAmount);
   }
}


export function validateMaxAmount(maxAmount: number): ValidatorFn {
   return (control: AbstractControl) => {
      let isValid = false;

      if (maxAmount === 0) {
         return null;
      }

      if (control && control.value) {
         const controlvalue = control.value.toString().replace(/R/g, '').replace(/ /g, '');
         if (isNaN(controlvalue)) {
            return {
               NotANumber: {
                  valid: false
               }
            };
         }


         isValid = maxAmount - controlvalue >= 0 ? true : false;

         if (isValid) {
            return null;
         } else {
            return {
               maxAmount: {
                  valid: false
               }
            };
         }
      }
   };
}


import { NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive, Input, OnChanges } from '@angular/core';
import { AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

@Directive({
   selector: '[appValidateMultipleFifty][ngModel]',
   providers: [
      { provide: NG_VALIDATORS, useExisting: ValidateMultipleFiftyDirective, multi: true }
   ]
})
export class ValidateMultipleFiftyDirective implements Validator, OnChanges {
   @Input() doValidation: boolean;

   validator: ValidatorFn;
   constructor() {
   }

   ngOnChanges() {
      this.validator = validateMultipleFifty(this.doValidation);
   }
   validate(control: FormControl) {
      return this.validator(control);
   }
}

// validation function
export function validateMultipleFifty(doValidation: boolean): ValidatorFn {
   return (control: AbstractControl) => {
      let isValid = false;

      if (control && control.value) {
         let divident = control.value.replace(/R/g, '').replace(/ /g, '');
         const divisor = 50;
         const partLength = 10;

         while (divident.length > partLength) {
            const part = divident.substring(0, partLength);
            divident = (part % divisor) + divident.substring(partLength);
         }
         isValid = divident && divident % divisor === 0;
      } else {
         isValid = false;
      }
      if (isValid || !doValidation) {
         return null;
      } else {
         return {
            multipleFifty: {
               valid: false
            }
         };
      }
   };
}



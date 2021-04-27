import { NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

@Directive({
   selector: '[appValidateMultipleN][ngModel]',
   providers: [
      { provide: NG_VALIDATORS, useExisting: ValidateMultipleNDirective, multi: true }
   ]
})
export class ValidateMultipleNDirective implements Validator, OnInit {
   @Input() appValidateMultipleN: number;

   validator: ValidatorFn;
   constructor() {
   }

   ngOnInit() {
      this.validator = validateMultipleN(this.appValidateMultipleN);
   }
   validate(control: FormControl) {
      return this.validator(control);
   }
}

export function validateMultipleN(divisorN: number): ValidatorFn {
   return (control: AbstractControl) => {
      let isValid = false;

      if (control && control.value) {
         let divident = control.value.toString().replace(/R/g, '').replace(/ /g, '');
         if (parseInt(divident, 10) === 1) {
            return null;
         }
         const divisor = divisorN;
         const partLength = 10;

         while (divident.length > partLength) {
            const part = divident.substring(0, partLength);
            divident = (part % divisor) + divident.substring(partLength);
         }
         isValid = divident && divident % divisor === 0;
      } else {
         isValid = false;
      }
      if (isValid) {
         return null;
      } else {
         return {
            multipleOfN: {
               valid: false
            }
         };
      }
   };
}



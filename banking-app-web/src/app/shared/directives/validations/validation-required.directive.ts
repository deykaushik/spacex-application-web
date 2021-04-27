import { NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

@Directive({
   selector: '[appValidateRequired][ngModel]',
   providers: [
      { provide: NG_VALIDATORS, useExisting: ValidateRequiredDirective, multi: true }
   ]
})
export class ValidateRequiredDirective implements Validator, OnInit {

   @Input() amount: boolean;
   validator: ValidatorFn;
   constructor() {
   }

   ngOnInit() {
      this.validator = validateRequired(this.amount);
   }
   validate(control: FormControl) {
      return this.validator(control);
   }
}

// validation function
export function validateRequired(amount = false): ValidatorFn {
   return (control: AbstractControl) => {
      let isInvalid = false;

      if (!amount && control && control.value && control.value.toString().trim().length > 0) {
         isInvalid = false;
      }else if (amount && control && control.value && control.value.replace(/\D/g, '').toString().trim().length > 0) {
         isInvalid = false;
      }else {
         isInvalid = true;
      }
      if (!isInvalid) {
         return null;
      } else {
         return {
            required: {
               valid: false
            }
         };
      }
   };
}



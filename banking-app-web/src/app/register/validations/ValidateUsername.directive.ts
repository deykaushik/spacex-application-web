import { NG_VALIDATORS, Validator } from '@angular/forms';
import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

@Directive({
    selector: '[appValidateUsername][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: ValidateUsernameDirective, multi: true }
    ]
})
export class ValidateUsernameDirective implements Validator, OnInit {
    validator: ValidatorFn;

    constructor() {
    }

    ngOnInit() {
        this.validator = validateUsername();
    }
    validate(control: FormControl) {
        return this.validator(control);
    }
}

export function validateUsername(): ValidatorFn {
    return (control: AbstractControl) => {
        let isValid = false;

        if (control && control.value && control.value.length > 0) {
            const regEx = new RegExp(/^[a-zA-Z0-9@+().-]*$/);
            isValid = regEx.test(control.value);
        } else {
            isValid = true;
        }

        if (isValid) {
            return null;
        } else {
            return {
                username: {
                    valid: false
                }
            };
        }
    };
}

import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

/* Directive for allowing validation only on blur of cotrol , and not on as it gets dirty */
/* if we want validations after control leave  */
@Directive({
    selector: '[appValidateOnblur]'
})
export class ValidateOnBlurDirective {
    private validators: any;
    private asyncValidators: any;
    private wasChanged: any;
    constructor(public formControl: NgControl) {
    }

    @HostListener('focus')
    onFocus($event) {
        this.wasChanged = false;
        this.validators = this.formControl.control.validator;
        this.asyncValidators = this.formControl.control.asyncValidator;
        this.formControl.control.clearAsyncValidators();
        this.formControl.control.clearValidators();
    }
    @HostListener('keyup')
    onKeyup($event) {
        this.wasChanged = true; // keyboard change
    }
    @HostListener('change')
    onChange($event) {
        this.wasChanged = true; // copypaste change
    }
    @HostListener('ngModelChange')
    onNgModelChange($event) {
        this.wasChanged = true; // ng-value change
    }

    @HostListener('blur', ['$event'])
    onBlur($event) {
        this.formControl.control.setAsyncValidators(this.asyncValidators);
        this.formControl.control.setValidators(this.validators);
        if (this.wasChanged) {
            this.formControl.control.setValue($event.target.value);
            this.formControl.control.updateValueAndValidity();
        }
    }
}

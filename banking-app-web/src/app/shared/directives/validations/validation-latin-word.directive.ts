import { Directive, Input, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';
import { CommonUtility } from '../../../core/utils/common';

@Directive({
  selector: '[appValidationLatinWord]'
})
export class ValidationLatinWordDirective {
  @Input() ngModel;

  constructor(private model: NgModel) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value) {
    this.model.control.setValue(CommonUtility.replaceAccentCharacters(value));
  }
}

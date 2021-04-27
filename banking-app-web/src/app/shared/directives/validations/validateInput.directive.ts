import { Directive, ViewContainerRef, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgModel } from '@angular/forms';

import { Constants } from '../../../core/utils/constants';

@Directive({
   selector: '[appValidateInput]',
})
export class ValidateInputDirective {
   elemRef: ElementRef;
   pattern;

   validateForAlphabet: String = 'alphabet';
   validateForNumber: String = 'number';
   validateForAlphaNumeric: String = 'alphanumeric';
   validateForAlphaNumericSpace: String = 'alphanumericwithspace';
   validateForName = 'name'; // validation for name comprises of name + white spaces
   validateForMobile = 'mobile';

   alphabetPattern = Constants.patterns.alphabet;
   numberPattern = Constants.patterns.number;
   namePattern = Constants.patterns.name;
   alphaNumericWithSpacePattern = Constants.patterns.alphaNumericWithSpace;
   alphaNumericPattern = Constants.patterns.alphaNumeric;
   mobileNumberPattern = Constants.patterns.mobile;

   dummyMobileNumbers = {
      mobileNumberWithCountryCode: '+27111111111',
      mobileNumberWithCountryCodeAndSymbol: '27111111111',
      mobileNumberWithZero: '0111111111',
      mobileNumberWithoutInitialZero: '111111111'
   };

   @Input() validateFor: string;
   @Input() maxLimit: number;
   @Input() ngModel;

   @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

   constructor(private el: ElementRef, private model: NgModel) {
      this.elemRef = el;
   }

   @HostListener('input', ['$event.target.value'])
   onInput(value) {
      if (this.maxLimit && (value.length > this.maxLimit)) {
         value = value.substring(0, this.maxLimit);
      }

      switch (this.validateFor) {
         case this.validateForAlphabet: {
            this.pattern = this.alphabetPattern;
            break;
         }
         case this.validateForNumber: {
            this.pattern = this.numberPattern;
            break;
         }
         case this.validateForName: {
            this.pattern = this.namePattern;
            break;
         }
         case this.validateForAlphaNumeric: {
            this.pattern = this.alphaNumericPattern;
            break;
         }
         case this.validateForAlphaNumericSpace: {
            this.pattern = this.alphaNumericWithSpacePattern;
            break;
         }
         case this.validateForMobile: {
            this.pattern = this.mobileNumberPattern;
         }
      }
      const regexStr = new RegExp(this.pattern);
      const regEx = new RegExp(regexStr);

      while (value.length > 0 && !regEx.test(this.getValueForTest(value, this.validateFor))) {
         value = value.substring(0, value.length - 1);
      }
      // this.el.nativeElement.value = value;
      // this.ngModelChange.emit(value);
      if ( this.validateFor === this.validateForMobile && value.startsWith('27')) {
         value = '+' + value;
      }
      this.model.control.setValue(value);
   }

   getValueForTest(value: string, validateFor: string): string {
      let valueForTest;
      if (validateFor === this.validateForMobile) {
         if (value.startsWith('+')) {
            valueForTest = value + this.dummyMobileNumbers.mobileNumberWithCountryCode.substring(value.length);
         } else if (value.startsWith('27')) {
            valueForTest = value + this.dummyMobileNumbers.mobileNumberWithCountryCodeAndSymbol.substring(value.length);
         } else if (value.startsWith('0')) {
            valueForTest = value + this.dummyMobileNumbers.mobileNumberWithZero.substring(value.length);
         } else {
            valueForTest = 0 + value + this.dummyMobileNumbers.mobileNumberWithoutInitialZero.substring(value.length);
         }
      } else {
         valueForTest = value;
      }
      return valueForTest;
   }

   @HostListener('keydown', ['$event']) onKeyDown(event) {
      const e = <KeyboardEvent>event;
      if (this.validateFor === this.validateForNumber) {
         if (e.keyCode === 190) {
            e.preventDefault();
         }
      }
   }
}

import { Component, Input, Output, EventEmitter, OnChanges, HostListener } from '@angular/core';
import { IPhoneNumber } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';

@Component({
   selector: 'app-phone-number-validator',
   templateUrl: './phone-number-validator.component.html',
   styleUrls: ['./phone-number-validator.component.scss']
})
export class PhoneNumberValidatorComponent implements OnChanges {
   @Input() phoneNumberValue: string;
   @Input() phoneNumberLabel: string;
   @Output() returnPhoneNumber = new EventEmitter<IPhoneNumber>();
   maxLengthError: boolean;
   phoneNumber: string;
   countryCode: string;
   phoneNumberLength: number;
   phoneNumberField: string;
   phoneNumberFieldLength: number;
   label = Constants.labels.overdraft;
   messages = Constants.messages;
   value = Constants.VariableValues;
   placeholder = this.phoneNumberValue;
   pattern = Constants.patterns;
   validPhoneNumber: IPhoneNumber;
   invalidPhoneNumber: boolean;

   ngOnChanges() {
      this.maxLengthError = false;
      this.splitPhoneNumber(this.phoneNumberValue);
      this.phoneNumberFieldLength = this.countryCode.length + 1 + this.phoneNumberLength;
      this.validatePhoneNumber();
   }

   validatePhoneNumber() {
      this.validPhoneNumber = {
         phoneNumber: this.phoneNumberField,
         isValid: this.isPhoneNumberValid()
      };
      this.returnPhoneNumber.emit(this.validPhoneNumber);
   }
   splitPhoneNumber(value: string) {
      this.countryCode = this.value.countryCode;
      this.phoneNumberLength = Constants.VariableValues.phoneNumberLength;
      if (value !== undefined) {
         value = value.replace(this.pattern.replaceSpace, '').replace(this.value.countryCode, '');
         this.placeholder = value.split('').reverse().join('').substring(0, 9).split('').reverse().join('');
      } else {
         this.placeholder = '';
      }
      this.phoneNumberField = this.countryCode + ' ' + this.placeholder.substr(0, 2) + ' '
         + this.placeholder.substr(2, 3) + ' ' + this.placeholder.substr(5, 4);

      this.maxLengthError = !this.isPhoneNumberValid();
   }

   onFocusOut() {
      this.validatePhoneNumber();
   }

   @HostListener('input', ['$event'])
   onInputTermValidator(event) {
      this.maxLengthError = !this.isPhoneNumberValid();
      if (this.phoneNumberField.indexOf(this.countryCode + ' ') === -1) {
         if ((this.phoneNumberField.length - (this.countryCode.length + 1)) < this.countryCode.length + 1) {
            event.target.value = this.countryCode + ' ';
         }
      }
      if (this.invalidPhoneNumber) {
         event.target.value = this.phoneNumberField;
      }
      if ((this.phoneNumberField.replace(this.pattern.replaceSpace, '').length - (this.countryCode.length)) === this.phoneNumberLength) {
         this.splitPhoneNumber(this.phoneNumberField);
         this.validatePhoneNumber();
      }
   }

   onInputKeyPressValidator(event) {
      if (event.length > 3) {
         event = event.replace(this.pattern.replaceSpace, '').substr(3, event.length - 3);
         if (!Constants.patterns.number.test(event)) {
            this.invalidPhoneNumber = true;
            this.phoneNumberField = this.phoneNumberField.substring(0, this.phoneNumberField.length - 1);
         } else {
            this.phoneNumberField = this.countryCode + ' ' + event.replace(this.pattern.replaceSpace, '');
            this.invalidPhoneNumber = true;
         }
      } else {
         this.invalidPhoneNumber = false;
      }
   }

   isPhoneNumberValid(): boolean {
      return ((this.phoneNumberField.replace(this.pattern.replaceSpace, '')
         .length - (this.countryCode.length)) === this.phoneNumberLength) &&
         (Constants.patterns.mobile.test(this.phoneNumberField.replace(this.pattern.replaceSpace, '')));
   }
}

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'app-password-strength-meter',
  templateUrl: './password-strength-meter.component.html',
  styleUrls: ['./password-strength-meter.component.scss'],
})
export class PasswordStrengthMeterComponent implements OnInit, OnChanges {
  public isPasswordValid: boolean;
  @Input() passwordValue: string;
  @Input() showPasswordMeter: boolean;
  @Output() onPasswordVerified = new EventEmitter<boolean>();
  hasUpperAndLowerCase: boolean;
  hasNumbers: boolean;
  hasNonAlphas: boolean;
  hasMinFourAlpha: boolean;
  hasValidMinMax: boolean;

  constructor() { }

  ngOnInit() {
    this.resetValues();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.isPasswordValid = false;
    if (this.passwordValue && this.passwordValue.length > 0) {
      const hasUpperCase = /[A-Z]/.test(this.passwordValue);
      const hasLowerCase = /[a-z]/.test(this.passwordValue);
      this.hasNumbers = /\d/.test(this.passwordValue);
      this.hasNonAlphas = /\W/.test(this.passwordValue);
      /* this.hasMinFourAlpha = /([A-Za-z]){4,}/.test(this.passwordValue); */
      this.hasValidMinMax = this.passwordValue.length >= 8 && this.passwordValue.length <= 16;
      this.hasUpperAndLowerCase = hasUpperCase && hasLowerCase;

      const hasWhiteSpace = /\s/.test(this.passwordValue);
      if (hasWhiteSpace) {
        this.hasNonAlphas = false;
      }

      let count = 0;
      for (const charValue of this.passwordValue) {
        if (/[A-Za-z]/.test(charValue)) {
          count++;
        }
      }
      this.hasMinFourAlpha = count > 3;

    } else {
      this.resetValues();
    }

    this.isPasswordValid =
      this.hasUpperAndLowerCase &&
      this.hasNumbers &&
      this.hasNonAlphas &&
      this.hasMinFourAlpha &&
      this.hasValidMinMax;

    this.onPasswordVerified.emit(this.isPasswordValid);
  }

  resetValues() {
    this.hasUpperAndLowerCase = false;
    this.hasNumbers = false;
    this.hasNonAlphas = false;
    this.hasMinFourAlpha = false;
    this.hasValidMinMax = false;
  }
}

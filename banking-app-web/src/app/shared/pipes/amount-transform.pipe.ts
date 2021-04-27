import { Pipe, PipeTransform } from '@angular/core';
import { AmountUtility } from '../../core/utils/amount';
import { Constants } from '../../core/utils/constants';

@Pipe({ name: 'amountTransform', pure: false })
export class AmountTransformPipe implements PipeTransform {

   private PREFIX: string;
   private DECIMAL_SEPARATOR: string;
   private THOUSANDS_SEPARATOR: string;
   private SUFFIX: string;
   private PRECISION: number;

   constructor() {
      this.PREFIX = 'R';
      this.DECIMAL_SEPARATOR = '.';
      this.THOUSANDS_SEPARATOR = ' ';
      this.SUFFIX = '';
      this.PRECISION = 2;
   }

   transform(value: string, param?: any, currency?: any, setEmptyToZero = false): string {
      let formattedValue, sign;
      let isLabel: boolean;
      let showSign: boolean;
      let hidePrefix: boolean;
      let noDecimal: boolean;
      let isSpaceRequire: boolean;
      if (param) {
         isLabel = param.isLabel || false;
         showSign = param.showSign || false;
         hidePrefix = param.hidePrefix || false;
         noDecimal = param.noDecimal || false;
         isSpaceRequire = param.isSpaceRequire || false;
         this.PREFIX = param.prefixValue || Constants.labels.currencySymbol;
      }
      this.PREFIX = hidePrefix ? '' : currency || this.PREFIX;
      if (isSpaceRequire) {
         this.PREFIX = this.PREFIX + ' ';
      }
      sign = parseFloat(value) < 0 ? '- ' : '';
      value = value || '';
      if (value === '') {
         return this.PREFIX + (isLabel ? '0.00' : setEmptyToZero ? '0' : '') + this.SUFFIX;
      }
      let onlynumber = AmountUtility.amountOnly(value.toString());
      if (!onlynumber) {
         return this.PREFIX + this.SUFFIX;
      }
      if (isLabel) {
         onlynumber = parseFloat(onlynumber).toFixed(2);
      }
      if (noDecimal) {
         onlynumber = parseInt(onlynumber, 10).toString();
         onlynumber = onlynumber === 'NaN' ? '' : onlynumber;
      }
      if (onlynumber.indexOf(this.DECIMAL_SEPARATOR) >= 0) {
         const twoDecimalNumber = onlynumber.substr(0, onlynumber.indexOf(this.DECIMAL_SEPARATOR) + this.PRECISION + 1);
         let integerPart = twoDecimalNumber.substr(0, twoDecimalNumber.indexOf(this.DECIMAL_SEPARATOR));
         integerPart = AmountUtility.amountSplit(integerPart, this.THOUSANDS_SEPARATOR);
         let decimalPart = twoDecimalNumber.substr(twoDecimalNumber.indexOf(this.DECIMAL_SEPARATOR) + 1, twoDecimalNumber.length + 1);
         decimalPart = AmountUtility.removeDecimal(decimalPart);
         formattedValue = integerPart + this.DECIMAL_SEPARATOR + decimalPart;
      } else {
         formattedValue = AmountUtility.amountSplit(onlynumber, this.THOUSANDS_SEPARATOR);
      }
      if (!formattedValue || formattedValue === '0') {
         return this.PREFIX + this.SUFFIX;
      } else {
         return (showSign ? sign : '') + this.PREFIX + formattedValue + this.SUFFIX;
      }
   }

   parse(value: string): string {
      value = value || '';
      value = AmountUtility.amountOnly((value || '').toString());
      value = value.replace(this.PREFIX, '').replace(this.SUFFIX, '');
      let [integer, fraction = ''] = value.split(this.DECIMAL_SEPARATOR);

      integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');

      fraction = parseInt(fraction, 10) > 0 && this.PRECISION > 0
         ? this.DECIMAL_SEPARATOR + (fraction).substring(0, this.PRECISION)
         : '';
      if (!(integer + fraction)) {
         return '0';
      } else {
         return integer + fraction;
      }
   }
}

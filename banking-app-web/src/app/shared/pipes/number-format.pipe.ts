import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

   transform(value: string, lastDigits: number): any {
      return value ? this.numberMask(value, lastDigits) : value;
   }

   private numberMask(mobileNumber, lastDigits) {
      return mobileNumber.substring(0, mobileNumber.length - 4).
         replace(/[a-zA-Z0-9]/g, '*').replace(/[+]/g, '')
         + mobileNumber.substring(mobileNumber.length - 4, mobileNumber.length);
   }
}

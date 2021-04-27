import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'mobileNumberMask'
})
export class MobileNumberMaskPipe implements PipeTransform {

   transform(value: string, lastDigits: number): any {
      return value ? this.mobileNumberMask(value, lastDigits) : value;
   }

   private mobileNumberMask(mobileNumber, lastDigits) {
      return mobileNumber.substring(0, mobileNumber.length - 4).
      replace(/\B(?=(\d{3})+(?!\d))/g, ' ').replace(/[0-9]/g, '*').replace(/[+]/g, '')
      + mobileNumber.substring(mobileNumber.length - 4, mobileNumber.length);
   }
}

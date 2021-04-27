import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'formatMobileNumber'
})

export class FormatMobileNumberPipe implements PipeTransform {

   transform(value: any, args?: any): any {
      if (!value) {
         value = '';
      }
      try {
         const temp: string = value.toString();
         if (temp) {
            return '***' + String.fromCharCode(160) + '***' + String.fromCharCode(160) + temp.substr(temp.length - 4, 4);
         } else {
            return temp;
         }
      } catch (e) {
         return value.toString();
      }
   }
}

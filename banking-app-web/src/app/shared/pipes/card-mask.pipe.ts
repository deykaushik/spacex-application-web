import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'cardMask'
})
export class CardMaskPipe implements PipeTransform {

   transform(value: string, firstDigits: number, lastDigits: number): any {
      return value ? this.cardMask(value, firstDigits, lastDigits) : value;
   }

   private cardMask(cardNumber, firstDigits, lastDigits) {
      const firstBreakPoint = firstDigits;
      const lastBreakPoint = cardNumber.length - lastDigits;
      let last = cardNumber.substring(lastBreakPoint);
      let middle = cardNumber.substring(firstBreakPoint, lastBreakPoint);
      let first = cardNumber.substring(0, firstBreakPoint);

      const lastSpacesCount = last.split(' ').length - 1;
      const firstSpacesCount = first.split(' ').length - 1;

      if (lastSpacesCount) {
         last = cardNumber.substring(lastBreakPoint - lastSpacesCount);
         middle = cardNumber.substring(firstBreakPoint, lastBreakPoint - lastSpacesCount);
      }

      if (firstSpacesCount) {
         middle = cardNumber.substring(firstBreakPoint + firstSpacesCount, lastBreakPoint - lastSpacesCount);
         first = cardNumber.substring(0, firstBreakPoint + firstSpacesCount);
      }

      return first + middle.replace(/\d/g, '*') + last;
   }
}

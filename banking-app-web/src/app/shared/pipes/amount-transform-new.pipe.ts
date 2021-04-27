import { Pipe, PipeTransform } from '@angular/core';
import { AmountUtility } from '../../core/utils/amount';

@Pipe({ name: 'currencyFormat', pure: false })
export class CurrencyFormat implements PipeTransform {

   transform(value: string, param?: any, currency?: any): string {
      return value.replace('.', ',');
   }

}

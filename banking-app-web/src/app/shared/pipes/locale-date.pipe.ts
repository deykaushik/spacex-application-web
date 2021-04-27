import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'localeDate'
})
export class LocaleDatePipe implements PipeTransform {
   transform(value: any, args?: any): any {
      return new Date(value.replace(/-/g, '/'));
   }
}

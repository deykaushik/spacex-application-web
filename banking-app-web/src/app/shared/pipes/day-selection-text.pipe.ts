import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { ApoConstants } from '../../cards/apo/apo-constants';

@Pipe({
   name: 'daySelectionText'
})
export class DaySelectionTextPipe implements PipeTransform {
   private selectedDay: number;
   private startDay: number;
   private endDay: number;
   private daySelectionText: string;
   private minDate: string;
   private maxDate: string;
   private isAutoPayTerm: boolean;
   private values = ApoConstants.apo.values;

   transform(value: string, minDate: string, maxDate: string, isAutoPayTerm?: boolean): any {
      return value ? this.setSelectedDay(value, minDate, maxDate, isAutoPayTerm) : value;
   }

   private setSelectedDay(day: string, minDate: string, maxDate: string, isAutoPayTerm?: boolean) {
      this.selectedDay = parseInt(day, 10);
      this.isAutoPayTerm = isAutoPayTerm ? true : false;
      this.minDate = minDate;
      this.maxDate = maxDate;
      this.startDay = parseInt(moment(this.minDate).format(this.values.monthFormat), 10);
      this.endDay = parseInt(moment(this.maxDate).format(this.values.monthFormat), 10);
      this.daySelectionText = this.getDaySelectionText(this.selectedDay, this.startDay, this.endDay, this.isAutoPayTerm);
      return this.daySelectionText;
   }
   private isDayValid(day) {
      const minDay = parseInt(moment(this.minDate).format(this.values.monthFormat), 10);
      const maxDay = parseInt(moment(this.maxDate).format(this.values.monthFormat), 10);
      const value = ((minDay - maxDay) > 0) ? ((day >= minDay && day <= 31) || (day <= maxDay && day >= 1)) ? true : false
      : ((day >= minDay && day <= maxDay)) ? true : false;
      return value;
   }
   private getDaySelectionText(day, startDay, endDay, isAutoPayTerm) {
      let suffix = this.values.emptyString;
      let daySelectionText = this.values.emptyString;
      if (endDay === 1 && (this.values.selectedDayForOne.indexOf(day) !== -1)) {
         isAutoPayTerm = true;
      } else if ((endDay === 2) && (this.values.selectedDayForTwo.indexOf(day) !== -1)) {
         isAutoPayTerm = true;
      } else {
         isAutoPayTerm = ((endDay - day) <= 2 && (endDay - day) >= 0) ? true : false;
      }
      if (!this.isDayValid(day)) {
         daySelectionText = '';
      } else if (isAutoPayTerm) {
         if (endDay === 1 && (this.values.selectedDayForOne.indexOf(day) !== -1)) {
            switch (day) {
               case this.values.selectedDayForOne[0]:
                  daySelectionText = this.values.after23;
                  break;
               case this.values.selectedDayForOne[1]:
                  daySelectionText = this.values.after24;
                  break;
               default:
                  daySelectionText = this.values.the + ' ' + this.values.dueDate + ' ' + this.values.everyMonth;
            }
         } else if ((endDay === 2) && (this.values.selectedDayForTwo.indexOf(day) !== -1)) {
            switch (day) {
               case this.values.selectedDayForTwo[0]:
                  daySelectionText = this.values.after23;
                  break;
               case this.values.selectedDayForTwo[1]:
                  daySelectionText = this.values.after24;
                  break;
               default:
                  daySelectionText = this.values.the + ' ' + this.values.dueDate + ' ' + this.values.everyMonth;
            }
         } else {
            switch (endDay - day) {
               case this.values.cases[0]:
                  daySelectionText = this.values.after24;
                  break;
               case this.values.cases[1]:
                  daySelectionText = this.values.after23;
                  break;
               default:
                  daySelectionText = this.values.the + ' ' + this.values.dueDate + ' ' + this.values.everyMonth;
            }
         }
      } else if (!(day > 10 && day <= 20)) {
         switch (day % 10) {
            case this.values.cases[0]:
               suffix = this.values.suffixSt;
               break;
            case this.values.cases[1]:
               suffix = this.values.suffixNd;
               break;
            case this.values.cases[2]:
               suffix = this.values.suffixRd;
               break;
            default:
               suffix = this.values.suffixTh;
         }
         daySelectionText = this.values.the + ' ' + day + suffix + ' ' + this.values.everyMonth;
      } else {
         daySelectionText = this.values.the + ' ' + day + this.values.suffixTh
            + ' ' + this.values.everyMonth;
      }
      return daySelectionText;
   }
}

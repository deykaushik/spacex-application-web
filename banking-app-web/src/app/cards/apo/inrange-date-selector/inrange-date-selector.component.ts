import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { IAutopayPaymentDate, IInrangeDateSeletor } from '../apo.model';
import { DaySelectionTextPipe } from '../../../shared/pipes/day-selection-text.pipe';
import { ApoConstants } from '../apo-constants';


@Component({
   selector: 'app-inrange-date-selector',
   templateUrl: './inrange-date-selector.component.html',
   styleUrls: ['./inrange-date-selector.component.scss']
})
export class InRangeDateSelectorComponent implements OnInit {
   @Input() inrangeDateSelector: IInrangeDateSeletor;
   @Input() selectedDate: IAutopayPaymentDate;
   @Input() isAutoPayTerm: boolean;
   @Output() dayClicked = new EventEmitter();
   daySelectionText = new DaySelectionTextPipe();
   paymentDueDate: string;

   days: number[];
   selectedDay: number;
   showCalendar: boolean;
   isValidDaySelected: boolean;
   errorFlag: boolean;
   statementDate: string;
   dueDate: string;
   values = ApoConstants.apo.values;

   ngOnInit() {
      this.showCalendar = false;
      this.days = ApoConstants.inRangeDateSelector.apo.days;
      this.errorFlag = false;
      this.statementDate = moment(this.inrangeDateSelector.minDate).format(this.values.dateFormat);
      this.dueDate = moment(this.inrangeDateSelector.maxDate).format(this.values.dateFormat);
      if (this.selectedDate && this.selectedDate.day) {
         this.setSelectedDay(this.selectedDate.day);
      }
   }

   /* Setting all the selected day object and emitting to the payment date component */
   public setSelectedDay(day) {
      this.selectedDay = day;
      const paymentDueDateSelection = this.daySelectionText.transform(this.selectedDay.toString(), this.inrangeDateSelector.minDate,
         this.inrangeDateSelector.maxDate);
      if (paymentDueDateSelection === this.values.dueDateOfEveryMonth) {
         this.paymentDueDate = this.values.paymentDueDate;
      } else {
         this.paymentDueDate = paymentDueDateSelection;
      }
      const emittedClickedDayObj = {
         day: this.selectedDay,
         isValid: this.checkDaySelectionError(day),
      };
      this.dayClicked.emit(emittedClickedDayObj);
      if (emittedClickedDayObj.isValid) {
         this.toggleCalendar();
      }
   }

   /* Toggle calendar open and close on clicking calendar icon */
   public toggleCalendar() {
      this.showCalendar = !this.showCalendar;
   }
   /* Check selected day is valid and if not set the error flag */
   public checkDaySelectionError(day) {
      if (day === this.selectedDay) {
         this.errorFlag = !this.isDayValid(day) ? true : false;
         return this.isDayValid(day);
      }
   }

   /* Check selected day is valid or not with the min date  and max date values */
   public isDayValid(day) {
      const minDay = parseInt(moment(this.inrangeDateSelector.minDate).format(this.values.monthFormat), 10);
      const maxDay = parseInt(moment(this.inrangeDateSelector.maxDate).format(this.values.monthFormat), 10);
      return ((minDay - maxDay) > 0) ? ((day >= minDay && day <= 31) || (day <= maxDay && day >= 1)) ? true : false
         : ((day >= minDay && day <= maxDay)) ? true : false;
   }
}

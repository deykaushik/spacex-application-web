import { element } from 'protractor';
import * as moment from 'moment';
import { DatePickerComponent, DatePickerDirective, IDatePickerConfig, DpDatePickerModule } from 'ng2-date-picker';
import {
   Component, OnInit, AfterViewInit, ViewChild, Input, EventEmitter, Output, HostListener, Inject, ChangeDetectorRef
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
   selector: 'app-custom-date-picker',
   templateUrl: './custom-date-picker.component.html',
   styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent implements OnInit, AfterViewInit {
   @ViewChild('datePicker') datePicker: DatePickerComponent;
   @ViewChild('dayCalendar') dayCalendar: any;
   @Input() date;
   @Input() maxDate;
   @Input() minDate;
   @Input() config;
   @Output() dateChanged = new EventEmitter();
   isDatePickerOpen = false;
   @Input() disabled = false;
   olddate;
   constructor( @Inject(DOCUMENT) private document: Document, private ref: ChangeDetectorRef) {

   }

   ngOnInit() {
   }
   ngAfterViewInit() {
      this.datePicker.inputElementContainer.addEventListener('click', ($event) => {
         if (!this.disabled) {
            this.openCalendar($event);
         }
      });
   }
   @HostListener('document:click', ['$event'])
   documentClick($event) {
      $event.stopPropagation();
      this.datePicker.api.close();
      this.closed();
   }
   openCalendar($event) {
      $event.stopPropagation();
      if (this.datePicker) {
         if (!this.isDatePickerOpen) {
            this.datePicker.dayCalendarRef.api.moveCalendarsBy(moment(this.date));
            this.datePicker.api.open();
            this.isDatePickerOpen = true;
         } else {
            this.datePicker.api.close();
            this.closed();
         }
      } else {
         this.closed();
      }
   }
   datePickerOverlayClick($event) {
      $event.stopPropagation();
   }
   closed() {
      this.isDatePickerOpen = false;
   }

   log(item) {
      if (item) {
         this.olddate = this.date;
         this.dateChanged.emit(new Date(this.date.toString()));
      } else {
         if (this.olddate) {
            this.date = this.olddate;
            this.datePicker.selected = [this.date];
            this.ref.detectChanges();
         }
      }
   }
}

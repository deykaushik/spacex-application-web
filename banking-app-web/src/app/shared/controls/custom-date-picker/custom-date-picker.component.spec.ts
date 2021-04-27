import * as moment from 'moment';
import { DpDatePickerModule } from 'ng2-date-picker';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { assertModuleFactoryCaching } from './../../../test-util';
import { CustomDatePickerComponent } from './custom-date-picker.component';

describe('CustomDatePickerComponent', () => {
   let component: CustomDatePickerComponent;
   let fixture: ComponentFixture<CustomDatePickerComponent>;
   const eventObject = { stopPropagation: () => { } };
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [DpDatePickerModule, FormsModule],
         declarations: [CustomDatePickerComponent]
      }).compileComponents();

   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CustomDatePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should open the datepicker', () => {
      component.openCalendar(eventObject);
      expect(component.isDatePickerOpen).toBe(true);
   });
   it('should close the datepicker if opened on again clicking the icon', () => {
      component.openCalendar(eventObject);
      component.openCalendar(eventObject);
      expect(component.isDatePickerOpen).toBe(false);
   });
   it('should not toggle calendar if no datepicker is founf', () => {
      component.datePicker = null;
      component.openCalendar(eventObject);
      expect(component.isDatePickerOpen).toBe(false);
   });

   it('should emit the date', () => {
      component.date = moment();
      component.log(component.date);
   });
   it('should not emit the date', () => {
      component.datePickerOverlayClick(eventObject);
      component.log(null);
   });

   it('should set calendar not open property on closed', () => {
      component.closed();
      expect(component.isDatePickerOpen).toBe(false);
   });
   it('should close on document click', () => {
      component.documentClick(eventObject);
      expect(component.isDatePickerOpen).toBe(false);
   });
   it('should open on textbox click, if not disabled', () => {
      component.isDatePickerOpen = false;
      component.disabled = false;
      component.datePicker.inputElementContainer.click();
      expect(component.isDatePickerOpen).toBe(true);
   });
   it('should not open on textbox click, if disabled', () => {
      component.isDatePickerOpen = false;
      component.disabled = true;
      component.datePicker.inputElementContainer.click();
      expect(component.isDatePickerOpen).toBe(false);
   });
});

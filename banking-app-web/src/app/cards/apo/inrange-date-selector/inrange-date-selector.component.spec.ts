import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InRangeDateSelectorComponent } from './inrange-date-selector.component';
import { IAutopayPaymentDate, IInrangeDateSeletor } from '../apo.model';
import { DaySelectionTextPipe } from '../../../shared/pipes/day-selection-text.pipe';
import { assertModuleFactoryCaching } from '../../../test-util';

const selectedDate: IAutopayPaymentDate = {
   day: 17,
   daySelectionFullText: '17th of every month',
   isValid: true
};
const paymentDate: IAutopayPaymentDate = {
   day: 30,
   daySelectionFullText: '17th of every month',
   isValid: true
};
const inrangeDateSelector: IInrangeDateSeletor = {
   warningMsg: '',
   minDate: '05/05/2018',
   maxDate: '05/30/2018',
   title: ''
};
describe('InRangeDateSelectorComponent', () => {
   let component: InRangeDateSelectorComponent;
   let fixture: ComponentFixture<InRangeDateSelectorComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [InRangeDateSelectorComponent, DaySelectionTextPipe]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(InRangeDateSelectorComponent);
      component = fixture.componentInstance;
      component.selectedDate = selectedDate;
      component.inrangeDateSelector = inrangeDateSelector;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call set selected day function', () => {
      component.setSelectedDay(selectedDate.day);
      expect(component.selectedDay).toBe(17);
   });
   it('should call set selected day function for payment date', () => {
      component.setSelectedDay(paymentDate.day);
      expect(component.paymentDueDate).toBe('Payment due date');
   });
   it('should call toggle calander function', () => {
      component.showCalendar = true;
      component.toggleCalendar();
      expect(component.showCalendar).toBe(false);
   });
   it('should call get day selection text  function for selecting invalid day for error flag', () => {
      component.inrangeDateSelector.minDate = '05/05/2018';
      component.inrangeDateSelector.maxDate = '05/31/2018';
      component.selectedDay = 4;
      component.checkDaySelectionError(4);
      expect(component.errorFlag).toBe(true);
   });
   it('should call method is day valid', () => {
      component.inrangeDateSelector.minDate = '05/27/2018';
      component.inrangeDateSelector.maxDate = '05/14/2018';
      component.selectedDay = 13;
      expect(component.isDayValid(component.selectedDay)).toBe(true);
   });
   it('should call method is day valid and check for both conditions', () => {
      component.inrangeDateSelector.minDate = '05/27/2018';
      component.inrangeDateSelector.maxDate = '05/14/2018';
      component.selectedDay = 31;
      expect(component.isDayValid(component.selectedDay)).toBe(true);
   });
});

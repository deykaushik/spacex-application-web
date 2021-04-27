import { TestBed, ComponentFixture, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { AmountFormatDirective } from './amount-format.directive';
import { AmountTransformPipe } from '../pipes/amount-transform.pipe';
import { Component, DebugElement, ElementRef, NgZone } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../test-util';

@Component({
   template: `<input id='amount' #amount type='text' name='amount' appAmountFormatMask [ngModel]='data.amount | amountTransform'
    (ngModelChange)='onAmountChange($event)'/>`
})
class TestAmountFormatComponent {
   data = { amount: 0 };
   onAmountChange(val) {
      this.data.amount = val;
   }
}

describe('Directive: AmountFormat', () => {
   let component: TestAmountFormatComponent;
   let fixture: ComponentFixture<TestAmountFormatComponent>;
   let inputEl: DebugElement;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [TestAmountFormatComponent, AmountFormatDirective, AmountTransformPipe],
         providers: [AmountTransformPipe]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TestAmountFormatComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css('input'));
      fixture.detectChanges();
   });

   function setInputValue(value: number | string, selectionRange?: number) {
      fixture.detectChanges();
      tick();
      const el = inputEl.nativeElement;
      el.value = value;
      if (selectionRange) {
         inputEl.nativeElement.setSelectionRange(selectionRange, selectionRange);
      }
      el.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();
      return fixture.whenStable();
   }

   it('should create an instance', () => {
      const amountTransform: AmountTransformPipe = new AmountTransformPipe();
      const amountFormatDirective = new AmountFormatDirective(inputEl, amountTransform);
      expect(amountFormatDirective).toBeTruthy();
      amountFormatDirective.onInput('3456');
      expect(inputEl.nativeElement.value).toBe('R3 456');
      expect(amountTransform.parse(inputEl.nativeElement.value)).toBe('3456');
   });

   it('format 0 value to empty value in input', () => {
      const el = inputEl.nativeElement;
      el.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(el.value).toBe('R');
      });
   });
   it('format decimal value in input', fakeAsync(() => {
      setInputValue(567.34).then(() => {
         const el = inputEl.nativeElement;
         expect(el.value).toBe('R567.34');
      });
   }));
   it('format large decimal value on input', fakeAsync(() => {
      setInputValue(123456.34).then(() => {
         const el = inputEl.nativeElement;
         expect(el.value).toBe('R123 456.34');
      });

   }));
   it('format large value on input', fakeAsync(() => {
      setInputValue(123456.34).then(() => {
         const el = inputEl.nativeElement;
         expect(el.value).toBe('R123 456.34');
      });
   }));

   it('format large value on input', fakeAsync(() => {
      setInputValue('R123 ').then(() => {
         const el = inputEl.nativeElement;
         expect(el.value).toBe('R123');
      });
   }));

   it('format large value on input', fakeAsync(() => {
      inputEl.nativeElement.setSelectionRange = null;
      setInputValue('R123 45').then(() => {
         const el = inputEl.nativeElement;
         expect(el.value).toBe('R12 345');
      });
   }));

   it('delete space should set the focus to next digit', fakeAsync(() => {
      inputEl.triggerEventHandler('keydown', { keyCode: 46 });
      const el = inputEl.nativeElement;
      setInputValue('R1000', 2).then(() => {
         expect(el.value).toBe('R1 000');
      });
   }));
   it('delete on "R" should set the focus to next digit', fakeAsync(() => {
      inputEl.triggerEventHandler('keydown', { charCode: 46 });
      const el = inputEl.nativeElement;
      setInputValue('', 0).then(() => {
         expect(el.value).toBe('R');
      });
   }));
   it('should evaluatte prefix value if present', fakeAsync(() => {
      inputEl.triggerEventHandler('keydown', { charCode: 46 });
      const el = inputEl.nativeElement;
      setInputValue('', 0).then(() => {
         expect(el.value).toBe('R');
      });
   }));

});

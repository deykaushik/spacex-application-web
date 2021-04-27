import { Component, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, NgForm } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../../test-util/cached-mf-test-suite';
import { ValidateMaxAmountDirective } from './validation-maxAmount';

@Component({
   template: ' <form> <input name="userinput" type="text" appMaxAmount=100 [ngModel]="input">  </form>'

})
export class TestComponent {
   input: number;
}

describe('ValidateMaxAmountDirctive', () => {
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [ValidateMaxAmountDirective, TestComponent]
      }).compileComponents().then(() => {
      });
   });

   it('should create an instance', () => {
      const validateDirective = new ValidateMaxAmountDirective();
      expect(validateDirective).toBeTruthy();
   });

   it('should validate on init', fakeAsync(() => {
      const validateDirective = new ValidateMaxAmountDirective();
      validateDirective.appMaxAmount = 1000;
      validateDirective.ngOnInit();
      expect(validateDirective).toBeTruthy();
   }));

   it('should show error for all value greater than appMaxAmount', async(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const comp = fixture.componentInstance;
      const debug = fixture.debugElement;
      const input = debug.query(By.css('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
      input.nativeElement.value = 123;
         input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

         const form: NgForm = debug.children[0].injector.get(NgForm);
         const control = form.control.get('userinput');
         expect(control.hasError('maxAmount')).toBe(true);
         expect(form.control.valid).toEqual(false);
      });
   }));

   it('should show error for NaN', async(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const comp = fixture.componentInstance;
      const debug = fixture.debugElement;
      const input = debug.query(By.css('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         input.nativeElement.value = 'abc';
         input.nativeElement.dispatchEvent(new Event('input'));
         fixture.detectChanges();

         const form: NgForm = debug.children[0].injector.get(NgForm);
         const control = form.control.get('userinput');
         expect(control.hasError('NotANumber')).toBe(true);
         expect(form.control.valid).toEqual(false);
      });
   }));

   it('should show no error for value less than max', async(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const comp = fixture.componentInstance;
      const debug = fixture.debugElement;
      const input = debug.query(By.css('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         input.nativeElement.value = 99;
         input.nativeElement.dispatchEvent(new Event('input'));
         fixture.detectChanges();

         const form: NgForm = debug.children[0].injector.get(NgForm);
         const control = form.control.get('userinput');
         expect(control.hasError('maxAmount')).toBe(false);
         expect(form.control.valid).toEqual(true);
      });
   }));
});

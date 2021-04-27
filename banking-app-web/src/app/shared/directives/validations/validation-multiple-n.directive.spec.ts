import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, FormControl, NgForm } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../../test-util';
import { ValidateMultipleNDirective } from './vallidation-multiple-n.directive';

@Component({
   template: `
                <form>
                    <input name="userinput" type="text" appValidateMultipleN=100
                     [ngModel]="input">
                </form>
              `
})
class TestComponent {
   input: number;
}

describe('ValidateMultipleNDirective', () => {
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [
            TestComponent,
            ValidateMultipleNDirective]
      }).compileComponents().then(() => {
      });
   });

   it('should create an instance', () => {
      const validateDirective = new ValidateMultipleNDirective();
      expect(validateDirective).toBeTruthy();
   });

   it('should show error for non N multiple values', async(() => {
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
         expect(control.hasError('multipleOfN')).toBe(true);
         expect(form.control.valid).toEqual(false);
      });
   }));

   it('should not show error for N multiple values', async(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const comp = fixture.componentInstance;
      const debug = fixture.debugElement;
      const input = debug.query(By.css('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         input.nativeElement.value = 12345678500;
         input.nativeElement.dispatchEvent(new Event('input'));
         fixture.detectChanges();

         const form: NgForm = debug.children[0].injector.get(NgForm);
         const control = form.control.get('userinput');
         expect(control.hasError('multipleOfN')).toBe(false);
         expect(form.control.valid).toEqual(true);
      });
   }));

   it('should not show error for value 1', async(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const comp = fixture.componentInstance;
      const debug = fixture.debugElement;
      const input = debug.query(By.css('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         input.nativeElement.value = 1;
         input.nativeElement.dispatchEvent(new Event('input'));
         fixture.detectChanges();

         const form: NgForm = debug.children[0].injector.get(NgForm);
         const control = form.control.get('userinput');
         expect(control.hasError('multipleOfN')).toBe(false);
         expect(form.control.valid).toEqual(true);
      });
   }));
});

import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, FormControl, NgForm } from '@angular/forms';
import { ValidateMultipleFiftyDirective } from './validation-multiplefifty.directive';
import { assertModuleFactoryCaching } from './../../../test-util';

@Component({
   template: `
                <form>
                    <input name="userinput" type="text" appValidateMultipleFifty
                    [doValidation]=true [ngModel]="input">
                </form>
              `
})
class TestComponent {
   input: number;
}

describe('ValidateMultipleFiftyDirective', () => {
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [
            TestComponent,
            ValidateMultipleFiftyDirective]
      }).compileComponents().then(() => {
      });
   });

   it('should create an instance', () => {
      const validateDirective = new ValidateMultipleFiftyDirective();
      expect(validateDirective).toBeTruthy();
   });

   it('should show error for non 50 multiple values', async(() => {
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
         expect(control.hasError('multipleFifty')).toBe(true);
         expect(form.control.valid).toEqual(false);
      });
   }));

   it('should not show error for 50 multiple values', async(() => {
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
         expect(control.hasError('multipleFifty')).toBe(false);
         expect(form.control.valid).toEqual(true);
      });
   }));
});

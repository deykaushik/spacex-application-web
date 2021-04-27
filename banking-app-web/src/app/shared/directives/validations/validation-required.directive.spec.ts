import { Component, DebugElement, OnInit } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, FormControl, NgForm } from '@angular/forms';
import { ValidateRequiredDirective } from './validation-required.directive';
import { assertModuleFactoryCaching } from './../../../test-util';

@Component({
   template: `
                <form>
                    <input name="userinput" type="text" appValidateRequired
                    [ngModel]="input">
                </form>
              `
})
class TestComponent {
   input: number;
}

@Component({
    template: `
                 <form>
                     <input name="userinput" [amount]="isamount" type="text" appValidateRequired
                     [ngModel]="input">
                 </form>
               `
 })
class Test2Component implements OnInit {
    input: number;
    isamount: boolean;

    ngOnInit() {
        this.isamount = true;
    }
}

describe('ValidateRequiredDirective', () => {
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [
            TestComponent,
            Test2Component,
            ValidateRequiredDirective]
      }).compileComponents().then(() => {
      });
   });

   it('should create an instance', () => {
      const validateDirective = new ValidateRequiredDirective();
      expect(validateDirective).toBeTruthy();
   });

   it('should show error for white space values', async(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const comp = fixture.componentInstance;
      const debug = fixture.debugElement;
      const input = debug.query(By.css('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         input.nativeElement.value = '   ';
         input.nativeElement.dispatchEvent(new Event('input'));
         fixture.detectChanges();

         const form: NgForm = debug.children[0].injector.get(NgForm);
         const control = form.control.get('userinput');
         expect(control.hasError('required')).toBe(true);
         expect(form.control.valid).toEqual(false);
      });
   }));

   it('should not show error for no-white space values', async(() => {
      const fixture = TestBed.createComponent(TestComponent);
      const comp = fixture.componentInstance;
      const debug = fixture.debugElement;
      const input = debug.query(By.css('input'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         input.nativeElement.value = '12345678500';
         input.nativeElement.dispatchEvent(new Event('input'));
         fixture.detectChanges();

         const form: NgForm = debug.children[0].injector.get(NgForm);
         const control = form.control.get('userinput');
         expect(control.hasError('required')).toBe(false);
         expect(form.control.valid).toEqual(true);
      });
   }));

   it('should not show error for amount field true', async(() => {
    const fixture = TestBed.createComponent(Test2Component);
    const comp = fixture.componentInstance;
    const debug = fixture.debugElement;
    const input = debug.query(By.css('input'));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
       input.nativeElement.value = 'R12345678500';
       input.nativeElement.dispatchEvent(new Event('input'));
       fixture.detectChanges();

       const form: NgForm = debug.children[0].injector.get(NgForm);
       const control = form.control.get('userinput');
       expect(control.hasError('required')).toBe(false);
       expect(form.control.valid).toEqual(true);
    });
 }));
});

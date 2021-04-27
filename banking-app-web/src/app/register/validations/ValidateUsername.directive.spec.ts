import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, FormControl, NgForm } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../test-util/cached-mf-test-suite';
import { ValidateUsernameDirective } from './ValidateUsername.directive';

@Component({
   template: `
                <form>
                    <input name="userinput" type="text" appValidateUsername [ngModel]="input" class="input">
                </form>
              `
})
class TestComponent {
   input: string;
}

describe('ValidateUsernameDirective', () => {
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [TestComponent, ValidateUsernameDirective]
      })
         .compileComponents()
         .then(() => { });
   });

   it('should create an instance', () => {
      const validateDirective = new ValidateUsernameDirective();
      expect(validateDirective).toBeTruthy();
   });

   it(
      'should ignore empty value',
      async(() => {
         const fixture = TestBed.createComponent(TestComponent);
         const comp = fixture.componentInstance;
         const debug = fixture.debugElement;
         const input = debug.query(By.css('input'));

         fixture.detectChanges();
         fixture.whenStable().then(() => {
            input.nativeElement.value = '';
            input.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const form: NgForm = debug.children[0].injector.get(NgForm);
            const control = form.control.get('userinput');
            expect(control.hasError('username')).toBe(false);
         });
      })
   );

   it(
      'should show error for invalid username - contains invalid special characters',
      async(() => {
         const fixture = TestBed.createComponent(TestComponent);
         const comp = fixture.componentInstance;
         const debug = fixture.debugElement;
         const input = debug.query(By.css('input'));

         fixture.detectChanges();
         fixture.whenStable().then(() => {
            input.nativeElement.value = 'usern*ame';
            input.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const form: NgForm = debug.children[0].injector.get(NgForm);
            const control = form.control.get('userinput');
            expect(control.hasError('username')).toBe(true);
         });
      })
   );

   it(
      'should show error for invalid username - contains space',
      async(() => {
         const fixture = TestBed.createComponent(TestComponent);
         const comp = fixture.componentInstance;
         const debug = fixture.debugElement;
         const input = debug.query(By.css('input'));

         fixture.detectChanges();
         fixture.whenStable().then(() => {
            input.nativeElement.value = 'usern ame';
            input.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const form: NgForm = debug.children[0].injector.get(NgForm);
            const control = form.control.get('userinput');
            expect(control.hasError('username')).toBe(true);
         });
      })
   );

   it(
      'should not show error valid username - contains valid special chacters',
      async(() => {
         const fixture = TestBed.createComponent(TestComponent);
         const comp = fixture.componentInstance;
         const debug = fixture.debugElement;
         const input = debug.query(By.css('input'));

         fixture.detectChanges();
         fixture.whenStable().then(() => {
            input.nativeElement.value = 'User@Test1-8.a(b)c+';
            input.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const form: NgForm = debug.children[0].injector.get(NgForm);
            const control = form.control.get('userinput');
            expect(control.hasError('username')).toBe(false);
         });
      })
   );

   it(
      'should not show error valid username - contains no special characters',
      async(() => {
         const fixture = TestBed.createComponent(TestComponent);
         const comp = fixture.componentInstance;
         const debug = fixture.debugElement;
         const input = debug.query(By.css('input'));

         fixture.detectChanges();
         fixture.whenStable().then(() => {
            input.nativeElement.value = 'UserTest1';
            input.nativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const form: NgForm = debug.children[0].injector.get(NgForm);
            const control = form.control.get('userinput');
            expect(control.hasError('username')).toBe(false);
         });
      })
   );
});

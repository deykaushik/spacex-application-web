import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../../test-util';

import { ValidateOnBlurDirective } from './validation-onblur.directive';
import { Constants } from '../../../core/utils/constants';

@Component({
   template: `<input type="text" appValidateOnblur [(ngModel)]="inputValue">`
})
class TestComponent {
   inputValue = '';
}

describe('ValidateOnBlurDirective', () => {
   let component: TestComponent;
   let fixture: ComponentFixture<TestComponent>;
   let inputEl: DebugElement;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [
            TestComponent,
            ValidateOnBlurDirective]
      });
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css('input'));
      fixture.detectChanges();
   });

   it('should create an instance', () => {
      const validateDirective = new ValidateOnBlurDirective(null);
      expect(validateDirective).toBeTruthy();
   });

   it('should validate on blur only, should have ng-touched after blur event only', () => {
      inputEl.triggerEventHandler('focus', null);
      inputEl.nativeElement.inputValue = 'Text Value 676767';
      inputEl.triggerEventHandler('change', null);
      inputEl.triggerEventHandler('ngModelChange', null);
      inputEl.triggerEventHandler('keyup', null);
      fixture.detectChanges();

      const classes = inputEl.nativeElement.getAttribute('class');
      expect(classes.indexOf('ng-touched')).toBe(-1);
      inputEl.triggerEventHandler('blur', { target: { value: inputEl.nativeElement.inputValue } });
      fixture.detectChanges();

      const newClasses = inputEl.nativeElement.getAttribute('class');
      expect(newClasses.indexOf('ng-touched')).toBeGreaterThan(-1);
   });

   it('should validate empty control', () => {
      inputEl.triggerEventHandler('focus', null);
      fixture.detectChanges();
      const classes = inputEl.nativeElement.getAttribute('class');
      expect(classes.indexOf('ng-touched')).toBe(-1);

      inputEl.triggerEventHandler('blur', { target: { value: '' } });
      fixture.detectChanges();
      const newClasses = inputEl.nativeElement.getAttribute('class');
      expect(newClasses.indexOf('ng-touched')).toBeGreaterThan(-1);
   });
});


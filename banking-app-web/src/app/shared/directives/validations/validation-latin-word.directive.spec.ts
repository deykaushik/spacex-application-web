import { ValidationLatinWordDirective } from './validation-latin-word.directive';
import { NgModel, FormsModule } from '@angular/forms';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { assertModuleFactoryCaching } from './../../../test-util';

@Component({
   selector: 'app-latin-word',
   template: `<input type="text" appValidationLatinWord [(ngModel)]="inputValue">`
})
class LatinWordComponent {
   inputValue = '';
}

describe('ValidationLatinWordDirective', () => {
   let component: LatinWordComponent;
   let fixture: ComponentFixture<LatinWordComponent>;
   let inputEl: DebugElement;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [
            LatinWordComponent,
            ValidationLatinWordDirective]
      });
      fixture = TestBed.createComponent(LatinWordComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css('input'));
      fixture.detectChanges();

   });
   it('should create an instance', () => {
      const directive = new ValidationLatinWordDirective(null);
      expect(directive).toBeTruthy();
   });
   it('should not accept for accented words only component', async(() => {
      inputEl.nativeElement.value = 'áüñ';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(fixture.componentInstance.inputValue).toBe('');
      });
   }));
   it('should not accept single quote or esc only component', async(() => {
      inputEl.nativeElement.value = 'a`bc';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(fixture.componentInstance.inputValue).toBe('abc');
      });
   }));
});

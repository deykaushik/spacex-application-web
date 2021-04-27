import { assertModuleFactoryCaching } from './../../test-util';
import { ClearFieldDirective } from './clear-field.directive';
import { Component, DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';



@Component({
   template: `<div class='clear-field-block'>
  <input id='search' type='search' name='search' [(ngModel)]='query' (ngModelChange)='onInputChange($event)' appClearField/>
  </div>`
})
class TestclearFieldComponent {
   query;
   onInputChange(val) {
      this.query = val;
   }
}
describe('ClearFieldDirective', () => {
   let component: TestclearFieldComponent;
   let fixture: ComponentFixture<TestclearFieldComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [TestclearFieldComponent, ClearFieldDirective]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TestclearFieldComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create an instance', () => {
      expect(component).toBeTruthy();
   });
   it('should show clear field option when there is value in ngmodel', () => {
      component.query = 'test';
      const clearElement = document.getElementById('clear-field');
      fixture.detectChanges();
      expect(clearElement).toBeDefined();
   });
   it('should clear ngModel of input when clicked on cross', () => {
      const clearElement = document.getElementById('clear-field');
      clearElement.click();
      fixture.detectChanges();
      expect(component.query).toBe('');
   });
});

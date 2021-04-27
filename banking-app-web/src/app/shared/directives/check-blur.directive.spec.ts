import { CheckBlurDirective } from './check-blur.directive';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { assertModuleFactoryCaching } from './../../test-util';

@Component({
  template: `<input id='amount' #amount='ngModel' type='text' name='amount' appCheckBlur [ngModel]='data'/>`
})
class TestCheckBlurComponent {
  data: string;
  @ViewChild('amount') amountRef;
}

describe('CheckBlurDirective', () => {
  let component: TestCheckBlurComponent;
  let fixture: ComponentFixture<TestCheckBlurComponent>;
  let inputEl: DebugElement;

  assertModuleFactoryCaching();
  beforeEach(async(() => {
     TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [TestCheckBlurComponent, CheckBlurDirective],
     }).compileComponents();
  }));

  beforeEach(() => {
   fixture = TestBed.createComponent(TestCheckBlurComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css('input'));
      fixture.detectChanges();
   });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should append isBlurred', () => {
    inputEl.triggerEventHandler('focus', null);
    expect(component.amountRef.isBlurred).toBeFalsy();
    inputEl.triggerEventHandler('blur', null);
    expect(component.amountRef.isBlurred).toBeTruthy();
  });

});

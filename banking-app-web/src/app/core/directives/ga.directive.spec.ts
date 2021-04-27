import { TestBed, ComponentFixture, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { GADirective } from './ga.directive';
import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../test-util';
import { GaTrackingService } from '../services/ga.service';

@Component({
   template: `
   <input id='amount' appGA type='text' name='amount' [ngModel]='data.amount' ga-event-label="label" ga-event-name="pay-amount" />
   <h1 ga-event-name="pay-h1-amount"> test </h1>
   <h2>test</h2>
   `
})
class TestGADirectiveComponent {
   data = { amount: 0 };
   @ViewChild(GADirective) directive: GADirective;
}

describe('Directive: AmountFormat', () => {
   let component: TestGADirectiveComponent;
   let fixture: ComponentFixture<TestGADirectiveComponent>;
   let inputEl: DebugElement;
   let headerSmall: DebugElement;
   let headerLarge: DebugElement;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [TestGADirectiveComponent, GADirective],
         providers: [{
            provide: GaTrackingService, useValue: {
               sendEvent: jasmine.createSpy('sendEvent')
            }
         }]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TestGADirectiveComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css('input'));
      headerLarge = fixture.debugElement.query(By.css('h1'));
      headerSmall = fixture.debugElement.query(By.css('h2'));
      fixture.detectChanges();
   });

   it('should handle onclick and onchange for input element with ga-event-* attribute', fakeAsync(() => {
      const event = {
         target: inputEl.nativeElement
      };
      component.directive.onChange(event);
      component.directive.onClick(event);
      expect(component).toBeTruthy();
   }));
   it('should not handle onclick and onchange for any element without ga-event-* attribute', fakeAsync(() => {
      const event = {
         target: headerSmall.nativeElement
      };
      component.directive.onClick(event);
      component.directive.onChange(event);
      expect(component).toBeTruthy();
   }));
   it('should handle onclick and onchange for non-input element with ga-event-* attribute', fakeAsync(() => {
      const event = {
         target: headerLarge.nativeElement
      };
      component.directive.onClick(event);
      component.directive.onChange(event);
      expect(component).toBeTruthy();
   }));

});

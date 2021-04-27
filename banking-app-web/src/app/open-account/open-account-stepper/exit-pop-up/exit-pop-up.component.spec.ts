import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitPopUpComponent } from './exit-pop-up.component';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from './../../../test-util';

let router: Router;

describe('ExitPopUpComponent', () => {
   let component: ExitPopUpComponent;
   let fixture: ComponentFixture<ExitPopUpComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ExitPopUpComponent],
         imports: [RouterTestingModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [Renderer2]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ExitPopUpComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should display dashboard page when we click on yes button', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.onYesClicked();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   });

   it('should hide the pop page when we click on close button', () => {
      component.closeOverlay();
      component.stepperPage.subscribe(data => {
         expect(data).toBe(true);
      });
   });
});

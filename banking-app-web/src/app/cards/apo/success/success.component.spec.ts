import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { SuccessComponent } from './success.component';
import { assertModuleFactoryCaching } from '../../../test-util';
import { ColoredOverlayComponent } from '../../../shared/overlays/colored-overlay/overlay.component';
import { BottomButtonComponent } from '../../../shared/controls/buttons/bottom-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SuccessComponent', () => {
   let component: SuccessComponent;
   let fixture: ComponentFixture<SuccessComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SuccessComponent, ColoredOverlayComponent, BottomButtonComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SuccessComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call exitOverview', () => {
      component.exitOverview();
      expect(component.showSuccess).toBe(false);
   });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { assertModuleFactoryCaching } from '../../test-util';

import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
   let component: PopupComponent;
   let fixture: ComponentFixture<PopupComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [PopupComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
   }));
   beforeEach(() => {
      fixture = TestBed.createComponent(PopupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should emit on discard', () => {
      spyOn(component.userActionClick, 'emit');
      component.userAction('close');
      expect(component.userActionClick.emit).toHaveBeenCalled();
   });
});

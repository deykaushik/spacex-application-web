import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { assertModuleFactoryCaching } from '../../test-util';
import { SharedModule } from './../../shared/shared.module';
import { PopupDiscardComponent } from './popup-discard.component';

describe('PopupDiscardComponent', () => {
   let component: PopupDiscardComponent;
   let fixture: ComponentFixture<PopupDiscardComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [PopupDiscardComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
   }));
   beforeEach(() => {
      fixture = TestBed.createComponent(PopupDiscardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should emit on discard', () => {
      spyOn(component.userActionClick, 'emit');
      component.discardAction('close');
      expect(component.userActionClick.emit).toHaveBeenCalled();
   });
});

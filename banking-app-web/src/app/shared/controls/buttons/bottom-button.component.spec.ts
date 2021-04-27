import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { BottomButtonComponent } from './bottom-button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BottomButtonComponent', () => {
   let component: BottomButtonComponent;
   let fixture: ComponentFixture<BottomButtonComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BottomButtonComponent],
         schemas: [NO_ERRORS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BottomButtonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should emit click event', () => {
      component.onClick();
      fixture.detectChanges();
      component.clickEmitter.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   });

   it('should return unique ID', () => {
      component.text = 'Try Again';
      const id = component.getID();
      expect(id).toBe('try_again');
   });
});

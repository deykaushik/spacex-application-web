import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../../test-util';
import { OverdraftLimitSuccessComponent } from './overdraft-limit-success.component';

describe('OverdraftLimitSuccessComponent', () => {
   let component: OverdraftLimitSuccessComponent;
   let fixture: ComponentFixture<OverdraftLimitSuccessComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [OverdraftLimitSuccessComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(OverdraftLimitSuccessComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should close overdraft window', () => {
      spyOn(component.backToCard, 'emit');
      component.closeOverlay(true);
      expect(component.backToCard.emit).toHaveBeenCalled();
   });
});

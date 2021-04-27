import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../../test-util';
import { OverdraftLimitFicaComponent } from './overdraft-limit-fica.component';

describe('OverdraftLimitFicaComponent', () => {
   let component: OverdraftLimitFicaComponent;
   let fixture: ComponentFixture<OverdraftLimitFicaComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [OverdraftLimitFicaComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(OverdraftLimitFicaComponent);
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

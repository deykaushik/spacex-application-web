import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../../test-util';
import { AccountShareStatusComponent } from './account-share-status.component';

describe('AccountShareStatusComponent', () => {
   let component: AccountShareStatusComponent;
   let fixture: ComponentFixture<AccountShareStatusComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [AccountShareStatusComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountShareStatusComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call retry', () => {
      spyOn(component.onRetry, 'emit');
      component.onRetrybuttonClick();
      expect(component.onRetry.emit).toHaveBeenCalledWith(true);
   });
});

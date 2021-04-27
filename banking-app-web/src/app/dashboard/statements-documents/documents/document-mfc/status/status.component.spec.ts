import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from '../../../../../test-util';
import { StatusComponent } from './status.component';

describe('StatusComponent', () => {
   let component: StatusComponent;
   let fixture: ComponentFixture<StatusComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [StatusComponent]
      })
      .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StatusComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should emit true if retry limit not exceeded while retrying settlement quote', () => {
      spyOn(component.onRetry, 'emit');
      component.retryLimitExceeded = false;
      component.onRetryRequest();
      expect(component.onRetry.emit).toHaveBeenCalledWith(true);
   });

   it('should emit false if retry limit exceeded while retrying settlement quote', () => {
      spyOn(component.onRetry, 'emit');
      component.retryLimitExceeded = true;
      component.onRetryRequest();
      expect(component.onRetry.emit).toHaveBeenCalledWith(false);
   });

});

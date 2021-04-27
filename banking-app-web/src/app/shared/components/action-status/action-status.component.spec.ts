import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../../test-util';
import { ActionStatusComponent } from './action-status.component';

describe('ActionStatusComponent', () => {
   let component: ActionStatusComponent;
   let fixture: ComponentFixture<ActionStatusComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ActionStatusComponent],
         schemas: [NO_ERRORS_SCHEMA],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ActionStatusComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should emit true if retry limit not exceeded while retrying', () => {
      spyOn(component.onRetry, 'emit');
      component.retryLimitExceeded = false;
      component.onTryAgain();
      expect(component.onRetry.emit).toHaveBeenCalledWith(true);
   });

   it('should emit false if retry limit is exceeded while retrying', () => {
      spyOn(component.onRetry, 'emit');
      component.retryLimitExceeded = true;
      component.onTryAgain();
      expect(component.onRetry.emit).toHaveBeenCalledWith(false);
   });

   it('should emit when done is clicked', () => {
      spyOn(component.onDone, 'emit');
      component.onDoneClick();
      expect(component.onDone.emit).toHaveBeenCalled();
   });

});

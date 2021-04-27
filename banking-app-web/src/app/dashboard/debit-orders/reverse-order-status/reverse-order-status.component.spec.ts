import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../../test-util';
import { ReverseOrderStatusComponent } from './reverse-order-status.component';
import { NotificationTypes } from '../../../core/utils/enums';
import { GaTrackingService } from '../../../core/services/ga.service';

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
describe('ReverseOrderStatusComponent', () => {
   let component: ReverseOrderStatusComponent;
   let fixture: ComponentFixture<ReverseOrderStatusComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [NO_ERRORS_SCHEMA],
         declarations: [ReverseOrderStatusComponent],
         providers: [{ provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ReverseOrderStatusComponent);
      component = fixture.componentInstance;
      component.status = NotificationTypes.None;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should handle On Done close event', () => {
      component.onDone.subscribe((isSuccess: boolean) => {
         expect(isSuccess).toBeTruthy();
      });
      component.onClose();
   });

   it('should handle On Retry event', () => {
      component.onRetry.subscribe(() => {
         expect(component.isRetried).toBeTruthy();
      });
      component.onRetrybuttonClick();
   });
   it('should emit value to track stop order clicked/triggered from reverse order success screen', () => {
      spyOn(component.stopDebitOrderClicked, 'emit');
      component.stopDebitOrder();
      expect(component.stopDebitOrderClicked.emit).toHaveBeenCalled();
   });
});

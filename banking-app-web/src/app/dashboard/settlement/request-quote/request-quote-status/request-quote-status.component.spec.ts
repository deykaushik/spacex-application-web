import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestQuoteStatusComponent } from './request-quote-status.component';
import { assertModuleFactoryCaching } from './../../../../test-util';

describe('RequestQuoteStatusComponent', () => {
   let component: RequestQuoteStatusComponent;
   let fixture: ComponentFixture<RequestQuoteStatusComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [RequestQuoteStatusComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RequestQuoteStatusComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should emit true if retry limit not exceeded while retrying settlement quote', () => {
      spyOn(component.onRetry, 'emit');
      component.retryLimitExceeded = false;
      component.onRetryQuote();
      expect(component.onRetry.emit).toHaveBeenCalledWith(true);
   });

   it('should emit false if retry limit exceeded while retrying settlement quote', () => {
      spyOn(component.onRetry, 'emit');
      component.retryLimitExceeded = true;
      component.onRetryQuote();
      expect(component.onRetry.emit).toHaveBeenCalledWith(false);
   });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SystemErrorService } from '../../core/services/system-services.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { WindowRefService } from '../../core/services/window-ref.service';
import { FeedbackService } from '../feedback.service';
import { FeedbackTryAgainComponent } from './feedback-try-again.component';
import { SharedModule } from '../../shared/shared.module';
import { assertModuleFactoryCaching } from '../../test-util';

const returnValueFeedback = Observable.of({
   data: {
      attempts: 0,
      remainingTime: '0',
      attemptsCompletedFlag: false
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'Suspicious Activity',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'SUCCESS'
               }
            ]
         }
      ]
   }
});

const feedbackServiceStub = {
   reportSuspiciousSubmit: jasmine.createSpy('reportSuspiciousSubmit').and.callFake(function () {
      return returnValueFeedback;
   })
};

describe('FeedbackTryAgainComponent', () => {
   let component: FeedbackTryAgainComponent;
   let fixture: ComponentFixture<FeedbackTryAgainComponent>;
   let feedbackService: FeedbackService;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [FeedbackTryAgainComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [GaTrackingService, WindowRefService, SystemErrorService, {
            provide: FeedbackService, useValue: feedbackServiceStub
         }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(FeedbackTryAgainComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      feedbackService = fixture.debugElement.injector.get(FeedbackService);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be created', () => {
      component.ngOnChanges();
      expect(component.tryAgain).toBe(true);
      expect(component.numberOfAttempts).toBe(0);
   });

   it('should close overlay', () => {
      const event = '';
      component.closeOverlay(event);
      expect(component.tryAgain).toBe(false);
   });

   it('should submit the  suspicious report', () => {
      component.sendSuspiciousReport();
      expect(component.tryAgain).toBe(false);
   });

   it('should not show loader if  reportSuspiciousSubmit API fails', () => {
      feedbackService.reportSuspiciousSubmit = jasmine.createSpy('reportSuspiciousSubmit').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.sendSuspiciousReport();
      expect(component.showLoader).toBe(false);
   });
});

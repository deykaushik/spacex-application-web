import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ClientProfileDetailsService } from '../core/services/client-profile-details.service';
import { ApiService } from '../core/services/api.service';
import { FeedbackComponent } from './feedback.component';
import { assertModuleFactoryCaching } from './../test-util';

const ClientProfileDetailsServiceStub = {
   clientDetailsObserver: new Subject(),
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue([])
};
const ng2DeviceService = {
   browser: 'Chrome',
   browser_version: '60'
};
const returnValueFeedback = Observable.of({
   MetaData: {
      ResultCode: 'R00',
      Message: 'Success',
      InvalidFieldList: null,
      result: {
         'resultCode': 0,
         'resultMessage': ''
      }
   },
   Data: null
});
const returnValueFeedbackWithoutSuccess = Observable.of({
   MetaData: {
      ResultCode: 'R00',
      Message: 'NoSuccess',
      InvalidFieldList: null,
      result: {
         'resultCode': 0,
         'resultMessage': ''
      }
   },
   Data: null
});
const returnFailFeedback = Observable.of({
   MetaData: {
      ResultCode: 'FV01',
      Message: 'FAILURE',
      InvalidFieldList: null,
      result: {
         'resultCode': 0,
         'resultMessage': ''
      }
   },
   Data: null
});
const submitFeedback = jasmine.createSpy('submitFeedback').and.callFake(function () {
   return returnValueFeedback;
});
const submitCallback = jasmine.createSpy('submitCallback').and.callFake(function (pass = true) {
   return returnValueFeedback;
});

describe('FeedbackComponent', () => {
   let component: FeedbackComponent;
   let fixture: ComponentFixture<FeedbackComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [FeedbackComponent],
         imports: [FormsModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{
            provide: ClientProfileDetailsService, useValue: ClientProfileDetailsServiceStub,
         },
         {
            provide: ApiService, useValue: {
               Feedback: {
                  create: submitFeedback
               },
               Callback: {
                  create: submitCallback
               },
            }
         }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(FeedbackComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set show error and show success', () => {
      component.onCloseErrorMsg();
      fixture.detectChanges();
      expect(component.showError).toBe(false);
      component.onCloseSuccessMsg();
      fixture.detectChanges();
      expect(component.showSuccess).toBe(false);
   });
   it('should open feedback popup', () => {
      component.showFeedBackPopup('type');
   });
   it('should open call me back popup', () => {
      component.showCallMeBackPopup();
   });
   it('should set the sucess message', () => {
      const status = ({ showSuccess: true, showError: false, alertMessage: component.message.successMessageFeedback });
      component.setAlertMessage(status);
      expect(component.successMessage).toBe(status.alertMessage);
   });
   it('should set the error message', () => {
      const status = ({ showSuccess: false, showError: true, alertMessage: component.message.failureMessage });
      component.setAlertMessage(status);
      expect(component.failureMessage).toBe(status.alertMessage);
   });
   it('should set visible visible on hide overlay', () => {
      component.hideOverlay(true);
      expect(component.showModal).toBe(true);
   });
});

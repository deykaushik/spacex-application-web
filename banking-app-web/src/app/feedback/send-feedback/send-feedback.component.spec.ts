import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Ng2DeviceService } from 'ng2-device-detector';

import { assertModuleFactoryCaching } from './../../test-util';
import { GaTrackingService } from '../../core/services/ga.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { MobileNumberMaskPipe } from './../../shared/pipes/mobile-number-mask.pipe';

import { FeedbackService } from '../feedback.service';
import { SendFeedbackComponent } from './send-feedback.component';
import { IFeedbackResult } from '../../core/services/models';

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

const returnValueCandCsFeedback = Observable.of({
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'FEEDBACK',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   }
});

const returnValueCandCsFailFeedback = Observable.of({
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'FEEDBACK',
                  result: 'FV01',
                  status: 'FAILURE',
                  reason: ''
               }
            ]
         }
      ]
   }
});

const feedbackServiceStub = {
   submitFeedback: jasmine.createSpy('submitFeedback').and.callFake(function () {
      return returnValueFeedback;
   }),
   submitCallback: jasmine.createSpy('submitCallback').and.callFake(function () {
      return returnValueFeedback;
   }),
   submitCandCsFeedback: jasmine.createSpy('submitCandCsFeedback').and.callFake(function () {
      return returnValueCandCsFeedback;
   })
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};


describe('SendFeedbackComponent', () => {
   let component: SendFeedbackComponent;
   let fixture: ComponentFixture<SendFeedbackComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SendFeedbackComponent, MobileNumberMaskPipe],
         imports: [FormsModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: ClientProfileDetailsService, useValue: ClientProfileDetailsServiceStub },
         { provide: Ng2DeviceService, useValue: { getDeviceInfo() { return ng2DeviceService; } } },
         { provide: FeedbackService, useValue: feedbackServiceStub }
         ]
      })
         .compileComponents();
   }));
   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(SendFeedbackComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should set time', () => {
      const time = 'Morning';
      component.onTimeChange(time);
      fixture.detectChanges();
      expect(component.selectedTime).toBe(time);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should set time', () => {
      const time = 'Morning';
      component.onTimeChange(time);
      fixture.detectChanges();
      expect(component.selectedTime).toBe(time);
   });

   it('should set FeedbackType on Change', () => {
      const feedbackType = component.feedbackTypes[1];
      component.onFeedbackTypeChange(feedbackType);
      fixture.detectChanges();
      expect(component.selectedFeedbackType).toBe(feedbackType);
   });

   it('should set show error and show success', () => {
      component.onCloseErrorMsg();
      fixture.detectChanges();
      expect(component.showError).toBe(false);
      component.onCloseSuccessMsg();
      fixture.detectChanges();
      expect(component.showSuccess).toBe(false);
   });

   it('should set feedback limit info on Change', () => {
      const feedbackText = 'This is some random feedback';
      component.feedbackText = feedbackText;
      component.feedbackLimit = 100;
      component.feedbackChange();
      fixture.detectChanges();
      expect(component.feedbackText.length + '/' + component.feedbackLimit).toBe('28/100');
   });

   it('should set success if both feedback and callback api hits', () => {
      component.callBackAllowed = true;
      component.sendFeedBack();
      fixture.detectChanges();
      expect(component.successMessage).toBe(component.message.successMessageCallback);
   });

   it('should set success if only feedback allowed', () => {
      component.callBackAllowed = false;
      component.sendFeedBack();
      fixture.detectChanges();
      expect(component.successMessage).toBe(component.message.successMessageFeedback);
   });

   it('should set error if feedback failed', inject([FeedbackService], (feedbackService: FeedbackService) => {
      feedbackService.submitCandCsFeedback = jasmine.createSpy('submitCandCsFeedback').and.callFake(function () {
         return returnValueCandCsFailFeedback;
      });
      component.sendFeedBack();
      fixture.detectChanges();
      expect(component.showError).toBe(true);
      expect(component.failureMessage).toBe(component.message.failureMessage);
   }));

   it('should set error if callback API failed', inject([FeedbackService], (feedbackService: FeedbackService) => {
      feedbackService.submitCandCsFeedback = jasmine.createSpy('submitCandCsFeedback').and.callFake(function () {
         return returnFailFeedback;
      });
      component.sendFeedBack();
      fixture.detectChanges();
      expect(component.showError).toBe(true);
      expect(component.failureMessage).toBe(component.message.failureMessage);
   }));

   it('should set error if feedback API pass with NO success message', inject([FeedbackService], (feedbackService: FeedbackService) => {
      feedbackService.submitCandCsFeedback = jasmine.createSpy('submitCandCsFeedback').and.callFake(function () {
         return returnValueFeedbackWithoutSuccess;
      });
      component.sendFeedBack();
      fixture.detectChanges();
      expect(component.showError).toBe(true);
      expect(component.failureMessage).toBe(component.message.failureMessage);
   }));

   it('should set error if callback API pass with NO success message', inject([FeedbackService], (feedbackService: FeedbackService) => {
      component.callBackAllowed = true;
      feedbackService.submitCallback = jasmine.createSpy('submitCallback').and.callFake(function () {
         return returnValueFeedbackWithoutSuccess;
      });
      component.sendFeedBack();
      fixture.detectChanges();
      expect(component.showError).toBe(true);
      expect(component.failureMessage).toBe(component.message.failureMessage);
   }));

   it('should handle api failure ', inject([FeedbackService], (feedbackService: FeedbackService) => {
      feedbackService.submitCandCsFeedback = jasmine.createSpy('submitFeedback').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         });
      });
      component.sendFeedBack();
      fixture.detectChanges();
      expect(component.showError).toBe(false);
      expect(component.showLoader).toBe(false);
   }));

   it('should handle api failure ', inject([FeedbackService], (feedbackService: FeedbackService) => {
      component.callBackAllowed = true;
      feedbackService.submitCandCsFeedback = jasmine.createSpy('submitCallback').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         });
      });
      component.sendFeedBack();
      fixture.detectChanges();
      expect(component.showError).toBe(false);
      expect(component.showLoader).toBe(false);
   }));

   it('should validate mobile number', () => {
      component.mobileNumber = '3333333333';
      component.mobileNumberChange();
      fixture.detectChanges();
      expect(component.isMobileNumberValid).toBe(true);
   });

   it('should populate existing user mobile no', () => {
      ClientProfileDetailsServiceStub.clientDetailsObserver.next({ CellNumber: '999999999' });
      expect(component.mobileNumber).toBe('999999999');
   });

   it('should not populate user mobile no if user does not  contains it', () => {
      const tempNo = component.mobileNumber;
      ClientProfileDetailsServiceStub.clientDetailsObserver.next({ CellNumber: '' });
      expect(component.mobileNumber).toBe(tempNo);
   });

   it('should call sendFeedback on try again', () => {
      spyOn(component, 'sendFeedBack');
      component.onTryAgain();
      fixture.detectChanges();
      expect(component.sendFeedBack).toHaveBeenCalled();
   });

   it('should set isCellphoneEditMode if mobile number exist and valid on onMobileFocusOut', () => {
      component.mobileNumber = '1234567890';
      component.onMobileFocusOut();
      fixture.detectChanges();
      expect(component.isCellphoneEditMode).toBeFalsy();
   });

   it('should not set isCellphoneEditMode to false if mobile number not valid onMobileFocusOut', () => {
      component.mobileNumber = '12345';
      component.isCellphoneEditMode = true;
      component.onMobileFocusOut();
      fixture.detectChanges();
      expect(component.isCellphoneEditMode).toBeTruthy();
   });

   it('should not set savedMobileNumber on edit Number Click', () => {
      component.savedMobileNumber = '';
      component.mobileNumber = '1234567890';
      fixture.whenStable().then(() => {
         component.onEditClick();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.savedMobileNumber).toBe('1234567890');
         });
      });
   });

   it('should set isCellphoneEditMode if mobile number not exist on onMobileFocusOut', () => {
      component.mobileNumber = '';
      component.savedMobileNumber = '1234567890';
      fixture.detectChanges();
      component.onMobileFocusOut();
      fixture.detectChanges();
      expect(component.mobileNumber).toBe('1234567890');
      component.mobileNumber = '';
      component.savedMobileNumber = '';
      component.onMobileFocusOut();
      fixture.detectChanges();
      expect(component.mobileNumber).toBe('');
   });

   it('should open call me back popup', () => {
      component.showCallMeBackPopup();
   });
   it('should stop loader', () => {
      component.closeLoaderAndMessage();
   });

   it('should change the toggle button', () => {
      const event = {
         key: 'Report',
         value: 'REPORT'
      };
      component.onTypeChange(event);
      expect(component.contactType).toBe('REPORT');
   });

   it('should emit alert message', () => {
      spyOn(component.alertMessage, 'emit');
      component.setAlertMessage('event');
      expect(component.alertMessage.emit).toHaveBeenCalled();
   });
});

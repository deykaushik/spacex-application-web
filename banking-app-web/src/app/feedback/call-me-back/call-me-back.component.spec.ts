import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Ng2DeviceService } from 'ng2-device-detector';

import { assertModuleFactoryCaching } from './../../test-util';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { MobileNumberMaskPipe } from './../../shared/pipes/mobile-number-mask.pipe';

import { FeedbackService } from '../feedback.service';
import { CallMeBackComponent } from './call-me-back.component';

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

const feedbackServiceStub = {
   submitFeedback: jasmine.createSpy('submitFeedback').and.callFake(function () {
      return returnValueFeedback;
   }),
   submitCallback: jasmine.createSpy('submitCallback').and.callFake(function () {
      return returnValueFeedback;
   })
};

describe('CallMeBackComponent', () => {
   let component: CallMeBackComponent;
   let fixture: ComponentFixture<CallMeBackComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [CallMeBackComponent, MobileNumberMaskPipe],
         imports: [FormsModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            { provide: ClientProfileDetailsService, useValue: ClientProfileDetailsServiceStub },
            { provide: FeedbackService, useValue: feedbackServiceStub },
            { provide: Ng2DeviceService, useValue: { getDeviceInfo() { return ng2DeviceService; } } },
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(CallMeBackComponent);
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
   it('should set feedback limit info on Change', () => {
      const feedbackText = 'This is some random feedback';
      component.feedbackText = feedbackText;
      component.feedbackLimit = 100;
      component.feedbackChange();
      fixture.detectChanges();
      expect(component.feedbackText.length + '/' + component.feedbackLimit).toBe('28/100');
   });
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
   it('should set success if both feedback and callback api hits', () => {
      component.sendCallMeBack();
      fixture.detectChanges();
      expect(component.showLoader).toBe(false);
      expect(component.successMessage).toBe(component.message.successMessageCallback);
   });

   it('should set error if callback API pass with NO success message', inject([FeedbackService], (feedbackService: FeedbackService) => {
      feedbackService.submitCallback = jasmine.createSpy('submitCallback').and.callFake(function () {
         return returnValueFeedbackWithoutSuccess;
      });
      component.sendCallMeBack();
      fixture.detectChanges();
      expect(component.showError).toBe(true);
      expect(component.failureMessage).toBe(component.message.failureCallback);
   }));

   it('should handle api failure ', inject([FeedbackService], (feedbackService: FeedbackService) => {
      feedbackService.submitCallback = jasmine.createSpy('submitCallback').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         });
      });
      component.sendCallMeBack();
      fixture.detectChanges();
      expect(component.showError).toBe(false);
      expect(component.showError).toBe(false);
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

   it('should call sendCallBack on try again', () => {
      spyOn(component, 'sendCallMeBack');
      component.onTryAgain();
      fixture.detectChanges();
      expect(component.sendCallMeBack).toHaveBeenCalled();
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
   it('should set show error and show success', () => {
      component.onCloseErrorMsg();
      fixture.detectChanges();
      expect(component.showError).toBe(false);
   });

   it('should clear fields', () => {
      component.onEditClick();
      expect(component.isCellphoneEditMode).toBe(true);
   });
});

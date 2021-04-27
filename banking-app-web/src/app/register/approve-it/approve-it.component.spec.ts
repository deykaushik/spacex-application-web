import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApproveItComponent } from './approve-it.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
   BsModalService,
   BsModalRef,
   ComponentLoaderFactory,
   PositioningService
} from 'ngx-bootstrap';
import { assertModuleFactoryCaching } from './../../test-util';
import { SharedModule } from '../../shared/shared.module';
import { ApiService } from '../../core/services/api.service';
import { RegisterService } from '../register.service';
import { ISubscription } from 'rxjs/Subscription';
import { Constants } from '../../core/utils/constants';
import { LoggerService } from '../../shared/logging/logger.service';
import {
   MetaData,
   IApprove,
   ISecurityStatusResponse,
   ISecurityStatuData
} from '../../core/services/auth-models';
import { inject } from '@angular/core/testing';
import { FormatMobileNumberPipe } from '../pipes/format-mobile-number.pipe';
import { TokenManagementService } from '../../core/services/token-management.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { ConstantsRegister } from '../utils/constants';
import { SystemErrorService } from '../../core/services/system-services.service';
import { GaTrackingService } from '../../core/services/ga.service';

const enum serviceResultType {
   CallSuccess = 1,
   CallFailed
}

describe('ApproveItComponent', () => {
   let component: ApproveItComponent;
   let fixture: ComponentFixture<ApproveItComponent>;
   let approveStatus: any;
   let approve: any;
   let registerService: RegisterService;
   let serviceResType: serviceResultType;
   const de: DebugElement = null;
   const el: HTMLElement = null;
   let activeView: any;

   const metaDataResult: MetaData = {
      ResultCode: '',
      Message: ''
   };



   const router = {
      navigate: jasmine.createSpy('navigate')
   };

   approveStatus = jasmine.createSpy('ApproveStatus').and.callFake(function () {
      switch (serviceResType) {
         case serviceResultType.CallSuccess: {
            return Observable.of({
               MetaData: metaDataResult,
               Data: {
                  TemporaryID: 99,
                  ApproveITInfo: {
                     ApproveITMethod: 'ApproveStatus',
                     ApproveITVerificationID: 4321,
                     OTP: 1234
                  }
               }
            });
         }
         case serviceResultType.CallFailed: {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
         default: {
            return Observable.of(metaDataResult);
         }
      }
   });

   approve = jasmine.createSpy('Approve').and.callFake(function () {
      switch (serviceResType) {
         case serviceResultType.CallSuccess: {
            return Observable.of({
               MetaData: metaDataResult,
               Data: {
                  TemporaryID: 99,
                  ApproveITInfo: {
                     ApproveITMethod: 'Approve',
                     ApproveITVerificationID: 4321,
                     OTP: 1234
                  }
               }
            });
         }
         case serviceResultType.CallFailed: {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
         default: {
            return Observable.of(metaDataResult);
         }
      }
   });

   const gaTrackingServiceStub = {
      sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
   };

   assertModuleFactoryCaching();
   activeView = jasmine.createSpy('SetActiveView');

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [ApproveItComponent, FormatMobileNumberPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            HttpClient,
            HttpHandler,
            LoggerService,
            BsModalRef,
            BsModalService,
            ApiService,
            RegisterService,
            TokenManagementService,
            ComponentLoaderFactory,
            PositioningService,
            SystemErrorService,
            TokenRenewalService,
            { provide: Router, useValue: router },
            {
               provide: RegisterService,
               useValue: {
                  ApproveStatus: approveStatus,
                  Approve: approve,
                  SetActiveView: activeView,
                  makeFormDirty: jasmine.createSpy('makeFormDirty').and.callFake((param) => {
                     return param;
                  })
               }
            },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      }).compileComponents();
   })
   );

   beforeEach(() => {
      fixture = TestBed.createComponent(ApproveItComponent);
      component = fixture.componentInstance;
      registerService = TestBed.get(RegisterService);
      registerService.temporaryId = 1;
      registerService.userDetails = {
         profile: '3012102011',
         pin: '298392',
         password: '89232jdkj',
         nedbankIdUserName: 'test user',
         nedbankIdPassword: 'djskjweqe',
         mobileNumber: '0712456382'
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      metaDataResult.ResultCode = 'R00';
      serviceResType = serviceResultType.CallSuccess;
      expect(component).toBeTruthy();
   });

   it('should navigate to close page', () => {
      spyOn(component, 'navigateClose').and.callThrough();
      component.navigateClose();
      expect(component.navigateClose).toHaveBeenCalled();
   });

   it(
      'should navigate to next page',
      inject([BsModalService], (modalService: BsModalService) => {
         spyOn(component, 'navigateNext').and.callThrough();
         component.navigateNext();
         expect(component.navigateNext).toHaveBeenCalled();
      })
   );

   it(
      'should navigate to next delayed page',
      inject([BsModalService], (modalService: BsModalService) => {
         spyOn(component, 'navigateNextDelayed').and.callThrough();
         component.navigateNextDelayed();
         expect(component.navigateNextDelayed).toHaveBeenCalled();
      })
   );

   it('should navigate to cancel page', () => {
      spyOn(component, 'navigateCancel').and.callThrough();
      component.navigateCancel();
      expect(router.navigate).toHaveBeenCalled();
   });

   it('should fail OTP validation', () => {
      component.showScreen = 3;
      component.otpValue = '';
      fixture.detectChanges();
      component.validate();
      expect(component.isValid.valueOf() === false);
   });

   it('should pass OTP validation', () => {
      component.showScreen = 3;
      component.otpValue = '1234';
      fixture.detectChanges();
      component.validate();
      expect(component.isValid.valueOf() === true);
   });

   it('should pass OTP validation automatically if OTP input not shown', () => {
      component.showScreen = 1;
      fixture.detectChanges();
      component.validate();
      expect(component.isValid.valueOf() === true);
   });

   it('should call ApproveStatus and handle R00 - Success', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R00';

      spyOn(component, 'navigateNext').and.callThrough();
      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).toBe('');
      expect(component.navigateNext).toHaveBeenCalled();
   });

   it('should call ApproveStatus and handle R15 - Reject', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R15';

      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).toBe('');
   });

   it('should call ApproveStatus and handle R25 - Keep Polling', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R25';

      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).toBe('');
      expect(component.pollServiceSubscription).toBeDefined();
   });

   it('should call ApproveStatus and handle R10 - Keep Polling', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R10';

      spyOn(component, 'servicePollTimerInterval').and.callThrough();
      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).toBe('');
      expect(component.pollServiceSubscription).toBeDefined();
   });

   it('should call ApproveStatus and handle R14 - Keep Polling', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R14';

      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).toBe('');
      expect(component.showScreen).toBe(3);
   });

   it('should call ApproveStatus and handle R26 - Show resend screen', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R26';

      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).toBe('');
      expect(component.showScreen).toBe(6);
   });

   it('should call ApproveStatus and handle R16 - Show resend screen', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R16';

      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).toBe('');
      expect(component.showScreen).toBe(2);
   });

   it('should call ApproveStatus and handle R17 - Show resend screen', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R17';

      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).toBe('');
      expect(component.showScreen).toBe(2);
   });

   it('should call ApproveStatus and handle unknown error - Show resend screen', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R999';

      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).toBe(
         'An error has ocurred while communicating with Nedbank.'
      );
      expect(component.showScreen).toBe(2);
   });

   it('should fail ApproveStatus call', () => {
      serviceResType = serviceResultType.CallFailed;

      spyOn(component, 'ApproveUserResponse').and.callThrough();
      component.ApproveUserResponse();

      expect(component.serviceError).not.toBe('');
      expect(component.serviceError).toContain(
         'An error has ocurred while communicating with Nedbank'
      );
   });

   it('on User SMS should call Approve and handle R00 - Success', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R00';

      spyOn(component, 'navigateNext').and.callThrough();
      spyOn(component, 'ApproveUserSMS').and.callThrough();
      component.ApproveUserSMS();

      expect(component.serviceError).toBe('');
      expect(component.navigateNext).toHaveBeenCalled();
   });

   it('on User SMS should call Approve and handle R27 - Delayed Federation', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R27';

      spyOn(component, 'navigateNextDelayed').and.callThrough();
      spyOn(component, 'ApproveUserSMS').and.callThrough();
      component.ApproveUserSMS();

      expect(component.serviceError).toBe('');
      expect(component.navigateNextDelayed).toHaveBeenCalled();
   });

   it('on User SMS should call Approve and handle R03 - Invalid OTP', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R03';
      component.otpCounter = 0;
      fixture.detectChanges();

      spyOn(component, 'ApproveUserSMS').and.callThrough();
      component.ApproveUserSMS();

      expect(component.otpValidationError).toContain(ConstantsRegister.messages.invalidOTP);
   });

   it('on User SMS should call Approve and handle R18 - Invalid OTP', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R18';
      component.otpCounter = 1;
      fixture.detectChanges();

      spyOn(component, 'ApproveUserSMS').and.callThrough();
      component.ApproveUserSMS();

      expect(component.otpValidationError).toContain(ConstantsRegister.messages.invalidOTP);
   });

   it('on User SMS should call Approve and handle unknown error', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R99';
      component.otpCounter = 1;
      fixture.detectChanges();

      spyOn(component, 'navigateClose').and.callThrough();
      spyOn(component, 'ApproveUserSMS').and.callThrough();
      component.ApproveUserSMS();

      expect(component.navigateClose).toHaveBeenCalled();
   });

   it('on User SMS should call Approve and handle Max invalid OTP error', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R98';
      component.otpCounter = 4;
      fixture.detectChanges();

      spyOn(component, 'ApproveUserSMS').and.callThrough();
      component.ApproveUserSMS();

      expect(component.showScreen).toBe(7);
   });

   it('on User SMS should fail Approve call', () => {
      serviceResType = serviceResultType.CallFailed;

      spyOn(component, 'navigateClose').and.callThrough();
      spyOn(component, 'ApproveUserSMS').and.callThrough();
      component.ApproveUserSMS();

      expect(component.navigateClose).toHaveBeenCalled();
   });

   it('on Resend should call Approve and handle R00 - Success', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R00';

      spyOn(component, 'navigateNext').and.callThrough();
      spyOn(component, 'ResendApproveUser').and.callThrough();
      component.ResendApproveUser();

      expect(component.serviceError).toBe('');
      expect(component.pollServiceSubscription).toBeTruthy();
      expect(registerService.verificationId.valueOf() === 4321);
   });

   it('on Resend should call Approve and handle R25 - Success', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R25';

      spyOn(component, 'navigateNext').and.callThrough();
      spyOn(component, 'ResendApproveUser').and.callThrough();
      component.ResendApproveUser();

      expect(component.serviceError).toBe('');
      expect(component.pollServiceSubscription).toBeTruthy();
      expect(registerService.verificationId.valueOf() === 4321);
   });

   it('on Resend should call Approve and handle R14 - SMS fallback', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R14';

      spyOn(component, 'navigateNext').and.callThrough();
      spyOn(component, 'ResendApproveUser').and.callThrough();
      component.ResendApproveUser();

      expect(component.serviceError).toBe('');
      expect(component.pollServiceSubscription).toBeTruthy();
      expect(registerService.verificationId.valueOf() === 4321);
      expect(component.showScreen).toBe(3);
   });

   it('on Resend should call Approve and handle unknown error', () => {
      serviceResType = serviceResultType.CallSuccess;
      metaDataResult.ResultCode = 'R99';

      spyOn(component, 'navigateClose').and.callThrough();
      spyOn(component, 'ResendApproveUser').and.callThrough();
      component.ResendApproveUser();

      expect(component.navigateClose).toHaveBeenCalled();
   });

   it('on Resend should fail Approve call', () => {
      serviceResType = serviceResultType.CallFailed;

      spyOn(component, 'navigateClose').and.callThrough();
      spyOn(component, 'ResendApproveUser').and.callThrough();
      component.ResendApproveUser();

      expect(component.navigateClose).toHaveBeenCalled();
   });
});

class RouterStub {
   navigateByUrl(url: string) {
      return url;
   }
}

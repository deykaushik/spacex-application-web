import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
   BsModalService,
   BsModalRef,
   ComponentLoaderFactory,
   PositioningService
} from 'ngx-bootstrap';
import { ISubscription } from 'rxjs/Subscription';
import { Constants } from '../../../core/utils/constants';

import { assertModuleFactoryCaching } from './../../../test-util';
import { OutofbandVerificationComponent } from './outofband-verification.component';
import { IOutOfBandResponse } from '../../../core/services/models';
import { inject } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { tick } from '@angular/core/testing';
import { ApiService } from '../../../core/services/api.service';

describe('OutofbandVerificationComponent', () => {
   let component: OutofbandVerificationComponent;
   let fixture: ComponentFixture<OutofbandVerificationComponent>;

   const MockResponse = {
      metadata: {
         resultData: [
            {
               transactionID: '1',
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'FV01',
                     status: 'SUCCESS',
                     reason: ''
                  }
               ]
            }
         ]
      }
   };
   const MockLimitDetailResponse = {
      resultData: [
         {
            transactionID: 'transfer',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV01',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   };

   const MockPartialResponse = {
      metadata: {
         resultData: [
            {
               transactionID: 'transfer',
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'FV01',
                     status: 'SUCCESS',
                     reason: ''
                  }
               ]
            },
            {
               transactionID: 'payment',
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'FV02',
                     status: 'FAILURE',
                     reason: ''
                  }
               ]
            }
         ]
      }
   };
   const MockLimitDetailPartialResponse = {
      resultData: [
         {
            transactionID: '1',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV01',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         },
         {
            transactionID: '2',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV02',
                  status: 'FAILURE',
                  reason: ''
               }
            ]
         }
      ]
   };

   const router = {
      navigate: jasmine.createSpy('navigate')
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [OutofbandVerificationComponent],
         imports: [FormsModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            HttpClient,
            HttpHandler,
            BsModalRef,
            BsModalService,
            { provide: Router, useValue: router },
            {
               provide: ApiService, useValue: {
                  refreshAccounts: {
                     getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of({}))
                  }
               }
            }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(OutofbandVerificationComponent);
      component = fixture.componentInstance;
      component.isPartialResponses = true;
      fixture.detectChanges();

      try {
         component.approveSubscription.unsubscribe();
      } catch (e) { }

      try {
         component.approveStatusSubscription.unsubscribe();
      } catch (e) { }

      try {
         component.pollServiceSubscription.unsubscribe();
      } catch (e) { }

      try {
         component.approveSucessSubscription.unsubscribe();
      } catch (e) { }

      try {
         component.pollScreenSubscription.unsubscribe();
      } catch (e) { }

      try {
         component.approveItResponseSubscription.unsubscribe();
      } catch (e) { }

      try {
         component.approveOTPResponseSubscription.unsubscribe();
      } catch (e) { }

      try {
         component.resendApproveDetailsResponseSubscription.unsubscribe();
      } catch (e) { }
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should navigate to cancel page', () => {
      inject([BsModalService], (modalService: BsModalService) => {
         spyOn(component, 'navigateCancel').and.callThrough();
         component.navigateCancel();
         expect(modalService._hideModal).toHaveBeenCalled();
      });
   });

   it('should navigate to close page', fakeAsync(() => {
      inject([BsModalService], (modalService: BsModalService) => {
         spyOn(component, 'navigateClose').and.callThrough();
         component.navigateClose();
         expect(modalService._hideModal).toHaveBeenCalled();
      });
   }));

   it('should screenPollTimerInterval', () => {
      component.countdownTimer = 0;
      component.screenPollTimerInterval();
      expect(component.showScreen).toEqual(6);
   });

   it('should emit getApproveItStatus', fakeAsync(() => {
      spyOn(component.getApproveItStatus, 'emit');
      component.ApproveResponse();
      tick(1);
      expect(component.showLoader).toBeTruthy();
      expect(component.getApproveItStatus.emit).toHaveBeenCalled();
   }));

   it('should emit isComponentValid', fakeAsync(() => {
      spyOn(component.isComponentValid, 'emit');
      component.validate();
      tick(1);
      expect(component.isComponentValid.emit).toHaveBeenCalled();
      expect(component.isComponentValid.emit).toHaveBeenCalledWith(true);
   }));

   it('should process ApproveItResponse - empty response', fakeAsync(() => {
      spyOn(component, 'ApproveSuccess');
      component.processApproveItResponse('');
      expect(component.ApproveSuccess).not.toHaveBeenCalled();
   }));

   it('should process ApproveItResponse - SUCCESS', fakeAsync(() => {
      spyOn(component, 'ApproveSuccess');
      component.processApproveItResponse(MockResponse);
      expect(component.ApproveSuccess).toHaveBeenCalled();
   }));

   it('should process ApproveItResponse - DECLINED', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'DECLINED';
      component.processApproveItResponse(MockResponse);
      expect(component.showScreen).toEqual(4);
   });

   it('should unsubscribe subscriptions', () => {
      component.UnsubscribeSubscriptions();
      expect(component.approveSubscription).toBeUndefined();
   });

   it('should process ApproveItResponse - PENDING', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'PENDING';
      component.processApproveItResponse(MockResponse);
      expect(component.showScreen).toEqual(1);
      component.pollServiceObservable.do(() => { }, () => { });
   });

   it('should process ApproveItResponse - TIMEOUT', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'TIMEOUT';
      component.processApproveItResponse(MockResponse);
      expect(component.showScreen).toEqual(6);
   });

   it('should process ApproveItResponse - UNKNOWN', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'UNKNOWN';
      component.processApproveItResponse(MockResponse);
      expect(component.serviceError).toEqual(component.systemErrorMessage);
      expect(component.showScreen).toEqual(8);
   });

   it('should process ApproveItResponse - FALLBACK', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'FALLBACK';
      component.processApproveItResponse(MockResponse);
      expect(component.showScreen).toEqual(3);
   });

   it('should call ApproveUserSMS - Otp Counter < 3', fakeAsync(() => {
      spyOn(component.getOTPStatus, 'emit');
      component.otpCounter = 0;
      component.otpValue = '1234';
      fixture.detectChanges();
      component.ApproveUserSMS();
      tick(1);
      expect(component.getOTPStatus.emit).toHaveBeenCalled();
      expect(component.getOTPStatus.emit).toHaveBeenCalledWith(component.otpValue);
   }));

   it('should call ApproveUserSMS - Otp Counter > 3', () => {
      component.otpCounter = 4;
      fixture.detectChanges();
      component.ApproveUserSMS();
      expect(component.showScreen).toEqual(7);
   });

   it('should process ApproveUserResponse - APPROVED', fakeAsync(() => {
      spyOn(component.otpIsValid, 'emit');
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'APPROVED';
      component.processApproveUserResponse(MockResponse);
      tick(1);
      expect(component.otpIsValid.emit).toHaveBeenCalled();
   }));

   it('should process ApproveUserResponse - OTHER', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'UNKNOWN';
      component.otpCounter = 2;
      fixture.detectChanges();
      component.processApproveUserResponse(MockResponse);
      expect(component.otpValidationError).toContain(component.invalidOTPMessage);
   });

   it('should process ApproveUserResponse - OTHER - Otp max retries', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'UNKNOWN';
      component.otpCounter = 3;
      fixture.detectChanges();
      component.processApproveUserResponse(MockResponse);
      expect(component.showScreen).toEqual(7);
   });

   it('should call ResendApproveUser', () => {
      component.ResendApproveUser();
      expect(component.showScreen).toEqual(1);
   });

   it('should process ResendApproveDetailsResponse - OTHER', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'UNKNOWN';
      component.isPartialResponses = false;
      component.processResendApproveDetailsResponse(MockResponse);
      expect(component.showScreen).not.toEqual(3);
   });

   it('should process ResendApproveDetailsResponse - FALLBACK', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'FALLBACK';
      component.isPartialResponses = false;
      component.processResendApproveDetailsResponse(MockResponse);
      expect(component.showScreen).toEqual(3);
   });

   it('should validate OTP - True', () => {
      component.showScreen = 3;
      component.otpValue = '1234';
      component.validate();
      expect(component.isValid).toEqual(true);
      component.showScreen = 1;
      component.validate();
      expect(component.isValid).toEqual(true);
   });

   it('should validate OTP - False', () => {
      component.showScreen = 3;
      component.otpValue = '';
      component.validate();
      expect(component.isValid).toEqual(false);
   });
   it('should call navidate cancel', () => {
      component.updateSuccess.subscribe((flag: boolean) => {
         expect(flag).toBe(false);
      });
      component.navigateClose();
      component.navigateNextDelayed();
      component.navigateCancel();
   });
   it('should unsubscribe all observables', () => {
      component.unsubscribeAll();
      expect(component.getApproveItStatus.observers).toBeNull();
      expect(component.resendApproveDetails.observers).toBeNull();
      expect(component.updateSuccess.observers).toBeNull();
      expect(component.getOTPStatus.observers).toBeNull();
      expect(component.otpIsValid.observers).toBeNull();
   });
   it('should reinitiate timer', () => {
      component.servicePollTimerInterval();
      expect(component.pollServiceSubscription.closed).toBe(true);
      expect(component.showLoader).toBe(true);
   });
   it('should process ApproveItResponse - NULL', () => {
      component.getTransactionStatus = jasmine.createSpy('getTransactionStatus').and.throwError('error');
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'ANYTHINGELSE';
      component.processApproveItResponse(MockResponse);
      expect(component.showScreen).toEqual(8);
      component.pollServiceObservable.do(() => { }, () => { });
   });
   it('should call ApproveSuccess', () => {
      spyOn(component, 'navigateClose');
      component.ApproveSuccess();
      expect(component.navigateClose).toHaveBeenCalled();
   });


   it('should process ProcessApproveItLimitResponse - empty response', fakeAsync(() => {
      spyOn(component, 'ApproveSuccess');
      component.ProcessApproveItLimitResponse('');
      expect(component.ApproveSuccess).not.toHaveBeenCalled();
   }));

   it('should process ProcessApproveItLimitResponse - SUCCESS', fakeAsync(() => {
      spyOn(component, 'ApproveSuccess');
      component.ProcessApproveItLimitResponse(MockResponse);
      // expect(component.ApproveSuccess).toHaveBeenCalled();
   }));

   it('should process ApproveItResponse - DECLINED', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'DECLINED';
      component.ProcessApproveItLimitResponse(MockResponse);
      expect(component.showScreen).toEqual(4);
   });
   it('should process ProcessApproveItLimitResponse - SUCCESS', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'SUCCESS';
      component.ProcessApproveItLimitResponse(MockResponse);
      expect(component.showScreen).toEqual(1);
      component.pollServiceObservable.do(() => { }, () => { });
   });

   it('should process ProcessApproveItLimitResponse - FAILURE', () => {

      MockResponse.metadata.resultData[0].resultDetail[0].status = 'FAILURE';
      component.ProcessApproveItLimitResponse(MockResponse);
   });
   it('should process ProcessApproveItLimitResponse - TIMEOUT', () => {

      component.ProcessApproveItLimitResponse(MockPartialResponse);
   });

   it('should process ProcessApproveItLimitResponse - UNKNOWN', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'UNKNOWN';
      component.ProcessApproveItLimitResponse(MockResponse);
      expect(component.serviceError).toEqual(component.systemErrorMessage);
      expect(component.showScreen).toEqual(8);
   });

   it('should process ProcessApproveItLimitResponse in case of fallback', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'FALLBACK';
      component.ProcessApproveItLimitResponse(MockResponse);
      expect(component.showScreen).toEqual(3);
   });

   it('should process ProcessApproveItLimitResponse in case of partial response', () => {
      component.ProcessApproveItLimitResponse(MockLimitDetailPartialResponse);
      expect(component.showScreen).toEqual(1);
   });

   it('should process ProcessApproveItLimitResponse in case of error', () => {
      component.getTransactionStatus = jasmine.createSpy('getTransactionStatus').and.throwError('error');
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'ANYTHINGELSE';
      component.ProcessApproveItLimitResponse(MockResponse);
      expect(component.showScreen).toEqual(8);
      component.pollServiceObservable.do(() => { }, () => { });
   });
   it('should process result if one of responses are success', () => {
      MockLimitDetailResponse.resultData[0].resultDetail[0].status = 'SUCCESS';
      component.processResendApproveLimitDetailsResponse(MockLimitDetailResponse);
      expect(component.showScreen).not.toEqual(3);
   });

   it('should process result if one of responses are unknown', () => {
      MockLimitDetailResponse.resultData[0].resultDetail[0].status = 'UNKNOWN';
      component.processResendApproveLimitDetailsResponse(MockLimitDetailResponse);
      expect(component.showScreen).not.toEqual(3);
   });

   it('should process result if one of responses are failure', () => {
      MockLimitDetailResponse.resultData[0].resultDetail[0].status = 'FAILURE';
      component.processResendApproveLimitDetailsResponse(MockLimitDetailResponse);
   });
   it('should process partial response for resend approval details', () => {
      component.processResendApproveLimitDetailsResponse(MockLimitDetailPartialResponse);
   });
   it('process partial response', () => {
      MockResponse.metadata.resultData[0].resultDetail[0].status = 'FALLBACK';
      component.processPartialApproveItResponse(MockResponse);
   });
});

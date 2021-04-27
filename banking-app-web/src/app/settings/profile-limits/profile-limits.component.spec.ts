import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap';

import { assertModuleFactoryCaching } from './../../test-util';
import { ISubscription } from 'rxjs/Subscription';
import { RouterTestingModule } from '@angular/router/testing';

import { ProfileLimitsComponent } from './profile-limits.component';
import { Constants } from '../../core/utils/constants';
import { ProfileLimitsService } from './profile-limits.service';
import { ILimitDetail } from '../../core/services/models';
import { CommonUtility } from '../../core/utils/common';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { LoaderService } from '../../core/services/loader.service';
import { Subject } from 'rxjs/Subject';
const limits: ILimitDetail[] = ([
   {
      limitType: 'transfer', dailyLimit: 150000, userAvailableDailyLimit: 150000, maxDailyLimit: 150000, isTempLimit: false,
      maxTmpDateRangeLimit: 30
   },
   {
      limitType: 'payment', dailyLimit: 150000, userAvailableDailyLimit: 150000, maxDailyLimit: 150000,
      isTempLimit: false, maxTmpDateRangeLimit: 30
   },
   {
      limitType: 'LOTTO', dailyLimit: 599, userAvailableDailyLimit: 599, maxDailyLimit: 1000, isTempLimit: false,
      maxTmpDateRangeLimit: 30
   },
   {
      limitType: 'sendimali', dailyLimit: 2500, userAvailableDailyLimit: 2500, maxDailyLimit: 2500, isTempLimit: false,
      'maxTmpDateRangeLimit': 30
   },
   {
      limitType: 'prepaid', dailyLimit: 3000, userAvailableDailyLimit: 3000, maxDailyLimit: 3000, isTempLimit: false,
      maxTmpDateRangeLimit: 30
   },
   {
      limitType: 'instantpayment', dailyLimit: 9600, userAvailableDailyLimit: 9600, maxDailyLimit: 10000, isTempLimit: true,
      tempLimitStart: '2017-08-17T00:00:00', tempLimitEnd: '2017-08-22T00:00:00', tempDailyLimit: 9600, tempAvailableDailyLimit: 9600,
      lastPermanentLimit: 1000, maxTmpDateRangeLimit: 30
   }]);

const mockupdatedLimitDetails = {
   limits: [
      { limitDetail: limits[0], status: '' },
      { limitDetail: limits[1], status: '' },
      { limitDetail: limits[2], status: '' }
   ]
   , transactionId: ''
};
const mockTransactionswithFailedStatus = {
   metadata: {
      resultData: [
         {
            transactionID: 'instantpayment',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'FAILURE',
                  Reason: 'Invalid Value'
               }
            ]
         }
      ]
   }
};
const mockTransactionswithFailedStatusWithoutReason = {
   metadata: {
      resultData: [
         {
            transactionID: 'instantpayment',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'FAILURE'
               }
            ]
         }
      ]
   }
};
const mockfailedLimits = [{ limittype: 'transfer', reason: '', status: 'FAILURE' },
{ limittype: 'payment', reason: '', status: 'FAILURE' }];
const updatedLimitDetails = {
   limits: [
      { limitDetail: limits[0], status: '' },
      { limitDetail: limits[1], status: '' },
      { limitDetail: limits[2], status: '' },
      { limitDetail: limits[3], status: '' }
   ]
   , transactionId: ''
};
const singleupdatedLimitDetails = {
   limits: [
      { limitDetail: limits[0], status: '' }
   ]
   , transactionId: ''
};

const updateMeteadata = {
   resultData: [
      {
         transactionID: 'instantpayment',
         resultDetail: [
            {
               operationReference: 'SECURETRANSACTION',
               result: 'R00',
               status: 'PENDING'
            }
         ]
      }
   ]
};
const updateMeteadataNonSec = {
   resultData: [
      {
         transactionID: 'instantpayment',
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'R00',
               status: 'PENDING'
            }
         ]
      }
   ]
};
const updateMeteadataSuccess = {
   resultData: [
      {
         transactionID: 'instantpayment',
         resultDetail: [
            {
               operationReference: 'SECURETRANSACTION',
               result: 'R00',
               status: 'SUCCESS'
            }
         ]
      }
   ]
};
const updateMeteadataError = {
   resultData: [
      {
         transactionID: 'instantpayment',
         resultDetail: [
            {
               operationReference: 'SECURETRANSACTION',
               result: 'R00',
               status: 'Failure'
            }
         ]
      }
   ]
};

const mockTransactions = {
   metadata: {
      resultData: [
         {
            transactionID: 'instantpayment',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'SUCCESS'
               }
            ]
         }
      ]
   }
};


const systemServcieStub = {
   raiseError: jasmine.createSpy('raiseError').and.callFake(function () { })
};

const ProfileLimitsServiceStub = {
   getAllLimits: jasmine.createSpy('getAllLimits').and.returnValue(Observable.of([].concat(limits[0]))),
   getLimitsWidgetVm: jasmine.createSpy('getLimitsWidgetVm').and.returnValue(
      Constants.VariableValues.settings.widgetsDetails.find(m => m.type === Constants.VariableValues.settings.widgetTypes.transfer)),
   updateLimit: jasmine.createSpy('updateLimit').and.returnValue(Observable.of(updateMeteadata)),
   isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.callFake((metadata) => {
      return CommonUtility.isTransactionStatusValid(metadata);
   }),
   updateTransactionID: jasmine.createSpy('updateTransactionID'),
   failedLimits: mockfailedLimits,
   notifyResponse: jasmine.createSpy('notifyResponse').and.callFake(function () { }),
   updateBulkTransactionID: jasmine.createSpy('updateBulkTransactionID').and.callFake(function () { }),
   updateBulkLimit: jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata)),
   updateOriginalLimits: jasmine.createSpy('updateOriginalLimits').and.callFake(function () { }),
   setOriginalLimits: jasmine.createSpy('setOriginalLimits').and.callFake(function () { }),
   updateMultipleLimit: new Subject<boolean>(),
   updateSingleLimitDetail: new Subject<ILimitDetail>(),
   cancelToOriginalLimitDetail: new Subject<boolean>(),
   validChangedLimits: updatedLimitDetails.limits,
   successFullLimits: updatedLimitDetails.limits,
   changedLimits: singleupdatedLimitDetails.limits,
   updatedlimits: updatedLimitDetails,
   getBulkApproveItStatus: jasmine.createSpy('getBulkApproveItStatus').and.returnValue(Observable.of(mockTransactions)),
   getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of(mockTransactions)),
   getApproveItOtpStatus: jasmine.createSpy('getApproveItOtpStatus').and.returnValue(Observable.of({
      transactionVerificationCode: 'TVCCODE', verificationReferenceId: '213'
   })),
   resetResponse: jasmine.createSpy('resetResponse').and.callFake(function () { }),
   notifyLimitChange: jasmine.createSpy('notifyLimitChange').and.callFake(function () { }),
   isProfileLimits: true,
   baselimitDetails: limits
};
const loaderService = {
   show: jasmine.createSpy('show'),
   hide: jasmine.createSpy('hide'),
};
const bsModalServiceStub = {
   show: jasmine.createSpy('getApproveItStatus').and.callFake(function () {
      return {
         content: {
            getApproveItStatus: new EventEmitter(),
            resendApproveDetails: new EventEmitter(),
            getOTPStatus: new EventEmitter(),
            otpIsValid: new EventEmitter(),
            updateSuccess: new EventEmitter(),
            processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
            processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
            processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
            processResendApproveLimitDetailsResponse: jasmine.createSpy('processResendApproveLimitDetailsResponse')
               .and.callFake(function () { }),
            updatePartialSuccess: new EventEmitter(),
            ProcessApproveItLimitResponse: jasmine.createSpy('ProcessApproveItLimitResponse').
               and.callFake(function () { }),
         }
      };
   }),
   onShow: jasmine.createSpy('onShow'),
   onShown: jasmine.createSpy('onShown'),
   onHide: jasmine.createSpy('onHide'),
   onHidden: {
      asObservable: jasmine.createSpy('onHidden asObservable').and.callFake(function () {
         return Observable.of(true);
      })
   },
};

describe('ProfileLimitsComponent', () => {
   let component: ProfileLimitsComponent;
   let fixture: ComponentFixture<ProfileLimitsComponent>;
   let profileService: ProfileLimitsService;
   let systemErrorService: SystemErrorService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         schemas: [NO_ERRORS_SCHEMA],
         declarations: [ProfileLimitsComponent],
         providers: [
            HeaderMenuService,
            { provide: SystemErrorService, useValue: systemServcieStub },
            { provide: BsModalService, useValue: bsModalServiceStub },
            { provide: LoaderService, useValue: loaderService },
            { provide: ProfileLimitsService, useValue: ProfileLimitsServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ProfileLimitsComponent);
      component = fixture.componentInstance;
      component.modalSubscription = null;
      profileService = TestBed.get(ProfileLimitsService);
      systemErrorService = TestBed.get(SystemErrorService);
      try {
         component.bsModalRef.content.getApproveItStatus.unsubscribe();
      } catch (e) { }
      try {
         component.bsModalRef.content.getBulkApproveItStatus.unsubscribe();
      } catch (e) { }
      try {
         component.bsModalRef.content.updateSuccess.unsubscribe();
      } catch (e) { }
      try {
         component.bsModalRef.content.updatePartialSuccess.unsubscribe();
      } catch (e) { }
      try {
         component.bsModalRef.content.resendApproveDetails.unsubscribe();
      } catch (e) { }
      try {
         component.bsModalRef.content.getOTPStatus.unsubscribe();
      } catch (e) { }
      try {
         component.bsModalRef.content.otpIsValid.unsubscribe();
      } catch (e) { }
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('Should open header menu on mobile back button', inject([ProfileLimitsService], (service: ProfileLimitsService) => {

      service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').and
         .returnValue(Observable.of(mockTransactionswithFailedStatusWithoutReason));
      component.originallimitDetails = limits;
      service.cancelToOriginalLimitDetail.next(true);
   }));


   it('should update old limit values after saving limit',
      inject([ProfileLimitsService], (service: ProfileLimitsService) => {
         const limitDetails: ILimitDetail = {
            limitType: 'transfer',
            dailyLimit: 1200,
            userAvailableDailyLimit: 1200,
            maxDailyLimit: 12000,
            isTempLimit: false,
            newLimit: 1000
         };
         component.updateOldLimitDetails(limitDetails);
         expect(limitDetails.dailyLimit).toBe(limitDetails.newLimit);
         const limitDetailsTemp: ILimitDetail = {
            limitType: 'transfer',
            dailyLimit: 1200,
            userAvailableDailyLimit: 1200,
            maxDailyLimit: 12000,
            isTempLimit: true,
            tempDailyLimit: 200,
            newLimit: 1000
         };
         component.updateOldLimitDetails(limitDetailsTemp);
         expect(limitDetailsTemp.tempDailyLimit).toBe(limitDetailsTemp.newLimit);
      }));



   it('should return valid reason message', () => {
      const obj = {
         resultData: [
            {
               resultDetail: [
                  {
                     reason: 'mock reason'
                  }
               ]
            }
         ]
      };

      expect(component.getReasonFromResponse(obj)).toBe('mock reason');
   });

   it('should return valid error message', () => {
      const err = {
         error: {
            Exception: {
               Message: 'mock error message'
            }
         }
      };
      expect(component.getErrorFromResponse(err)).toBe('mock error message');
   });
   it('Should open header menu on mobile back button', inject([HeaderMenuService], (service: HeaderMenuService) => {
      service.headerMenuOpener().subscribe((menuText) => {
         expect(menuText).toBe('Settings');
      });
      component.openSettingsMenu('Settings');
   }));

   it('Should handle pending case with updateSuccess with false', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {
         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.of(mockTransactionswithFailedStatus));
         component.originallimitDetails = limits;
         this.modalSubscription = bsModalService.onHidden.asObservable()
            .subscribe(() => { });
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.resendApproveDetails.emit();
         component.bsModalRef.content.getApproveItStatus.emit();
         component.bsModalRef.content.getOTPStatus.emit('testOTP');
         component.bsModalRef.content.otpIsValid.emit('testOTP');
         service.failedLimits = mockfailedLimits;
         component.bsModalRef.content.updateSuccess.emit(true);
         service.isChangeSuccessful = true;
         expect(service.failedLimits.length).toBe(0);
      }));

   it('Should handle pending case with updateSuccess with false and single failed limit',
      inject([ProfileLimitsService], (service: ProfileLimitsService) => {

         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.of(mockTransactionswithFailedStatus));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.resendApproveDetails.emit();
         component.bsModalRef.content.getApproveItStatus.emit();
         component.bsModalRef.content.getOTPStatus.emit('testOTP');
         component.bsModalRef.content.otpIsValid.emit('testOTP');
         service.failedLimits = [mockfailedLimits[0]];
         component.bsModalRef.content.updateSuccess.emit(true);
         service.isChangeSuccessful = true;
         expect(service.failedLimits.length).toBe(0);
      }));
   it('Should handle pending case with updateSuccess', inject([ProfileLimitsService],
      (service: ProfileLimitsService) => {

         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.of(mockTransactionswithFailedStatusWithoutReason));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);

         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.resendApproveDetails.emit();
         component.bsModalRef.content.getApproveItStatus.emit();
         component.bsModalRef.content.getOTPStatus.emit('testOTP');
         component.bsModalRef.content.otpIsValid.emit('testOTP');
         service.failedLimits = [{ limittype: 'transfer', reason: 'Invalid data', status: 'Failed' }
            , { limittype: 'payment', reason: 'Invalid data', status: 'Failed' }];
         component.bsModalRef.content.updateSuccess.emit(false);
         service.isChangeSuccessful = true;
         expect(service.failedLimits.length).toBe(2);
      }));
   it('Should handle partial success without provided reason', inject([ProfileLimitsService],
      (service: ProfileLimitsService) => {

         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.of(mockTransactionswithFailedStatusWithoutReason));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);

         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.resendApproveDetails.emit();
         component.bsModalRef.content.getApproveItStatus.emit();
         component.bsModalRef.content.getOTPStatus.emit('testOTP');
         component.bsModalRef.content.otpIsValid.emit('testOTP');
         service.failedLimits = [];
         service.updatedlimits = mockupdatedLimitDetails;
         component.bsModalRef.content.updateSuccess.emit(false);
         service.isChangeSuccessful = true;
         component.bsModalRef.content.updatePartialSuccess.emit([mockTransactionswithFailedStatusWithoutReason.metadata.resultData]);
         expect(service.failedLimits.length).toBe(1);
      }));
   it('Should handle bulk approve in case of error ', inject([ProfileLimitsService],
      (service: ProfileLimitsService) => {
         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.throw(''));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);

         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.resendApproveDetails.emit();
         component.bsModalRef.content.getApproveItStatus.emit();
         component.bsModalRef.content.updatePartialSuccess.emit([mockTransactionswithFailedStatusWithoutReason.metadata.resultData]);
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));


   it('handle partial update on partialLimitFailure', inject([ProfileLimitsService],
      (service: ProfileLimitsService) => {
         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.of(mockTransactionswithFailedStatusWithoutReason));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);
         service.updatedlimits = singleupdatedLimitDetails;
         component.bsModalRef.content.updatePartialSuccess.emit(mockTransactionswithFailedStatus.metadata.resultData);
         expect(service.failedLimits.length).toBe(1);
      }));
   it('Should handle success with failed Limits', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
         and.returnValue(Observable.of(mockTransactionswithFailedStatus));
      component.originallimitDetails = limits;
      service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').
         and.returnValue(Observable.of(updateMeteadataSuccess));
      service.failedLimits = mockfailedLimits;
      service.updateMultipleLimit.next(true);
      expect(service.failedLimits.length).toBe(2);
   }));

   it('Should handle success status for updateBulkLimit', inject([ProfileLimitsService], (service: ProfileLimitsService) => {
      service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
         and.returnValue(Observable.of(mockTransactionswithFailedStatus));
      component.originallimitDetails = limits;
      service.isTransactionStatusValid = jasmine.createSpy('isTransactionStatusValid').and.returnValue(true),
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadataSuccess));
      service.updateMultipleLimit.next(true);
      expect(service.updateOriginalLimits).toHaveBeenCalled();
   }));
   it('Should handle failed status for updateBulkLimit', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {
         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').and.
            returnValue(Observable.of(mockTransactionswithFailedStatus));
         component.originallimitDetails = limits;
         service.failedLimits = mockfailedLimits;
         component.modalSubscription = bsModalService.onHidden.asObservable()
            .subscribe(() => { });
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadataError));
         service.updateMultipleLimit.next(true);
         expect(service.isChangeSuccessful).toBeFalsy();
      }));

   it('Should handle error for updateBulkLimit after resendApproveDetails', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {

         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.of(mockTransactionswithFailedStatus));
         component.originallimitDetails = limits;
         this.modalSubscription = bsModalService.onHidden.asObservable()
            .subscribe(() => { });
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         service.updateMultipleLimit.next(true);
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.throw(''));
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.resendApproveDetails.emit();
      }));

   it('Should handle error for resendapprovaldetails', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.of(mockTransactionswithFailedStatus));
         component.originallimitDetails = limits;
         this.modalSubscription = bsModalService.onHidden.asObservable()
            .subscribe(() => { });
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.resendApproveDetails.error('');
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));
   it('Should handle error for otpIsValid', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.of(mockTransactionswithFailedStatus));
         component.originallimitDetails = limits;
         this.modalSubscription = bsModalService.onHidden.asObservable()
            .subscribe(() => { });
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.otpIsValid.error('');
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));

   it('Should handle error for getApproveItStatus', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {

         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         service.getBulkApproveItStatus = jasmine.createSpy('getBulkApproveItStatus').
            and.returnValue(Observable.of(mockTransactionswithFailedStatus));
         component.originallimitDetails = limits;
         this.modalSubscription = bsModalService.onHidden.asObservable()
            .subscribe(() => { });
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.getApproveItStatus.error('');
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));

   it('Should handle error for updatesuccess', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {

         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         component.originallimitDetails = limits;
         this.modalSubscription = bsModalService.onHidden.asObservable()
            .subscribe(() => { });
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.updateSuccess.error('');
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));

   it('Should handle error for partial failure', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {

         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         component.originallimitDetails = limits;
         this.modalSubscription = bsModalService.onHidden.asObservable()
            .subscribe(() => { });
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.updatePartialSuccess.error('');
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));
   it('Should handle getOTPStatus with error ', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {

         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         component.originallimitDetails = limits;
         this.modalSubscription = bsModalService.onHidden.asObservable()
            .subscribe(() => { });
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.getOTPStatus.error('');
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));

   it('Should handle getApproveItStatus', inject([ProfileLimitsService],
      (service: ProfileLimitsService) => {
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.getApproveItStatus.emit();
      }));

   it('Should handle error for getApproveItStatus', inject([ProfileLimitsService],
      (service: ProfileLimitsService) => {
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);
         service.profileLimitDetails = { transactionID: '', newLimit: 0, isTemp: 'Temporary' };
         component.bsModalRef.content.getApproveItStatus.error('');
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));
   it('Should handle error for getApproveItStatus after otp is valid', inject([ProfileLimitsService],
      (service: ProfileLimitsService) => {
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);
         service.getApproveItStatus = jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.throw(''));
         component.bsModalRef.content.otpIsValid.emit('testOTP');
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));


   it('Should handle error for getApproveItOtpStatus', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);
         service.getApproveItOtpStatus = jasmine.createSpy('getApproveItOtpStatus').and.returnValue(Observable.throw(''));
         component.bsModalRef.content.getOTPStatus.emit('testOTP');
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));

   it('Should handle error for bsModal on hide', inject([ProfileLimitsService, BsModalService],
      (service: ProfileLimitsService, bsModalService: BsModalService) => {
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.of(updateMeteadata));
         component.originallimitDetails = limits;
         bsModalService.onHidden.asObservable = jasmine.createSpy('').and.returnValue(Observable.throw(''));
         service.updateMultipleLimit.next(true);
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));


   it('Should handle error for updateBulkLimit', inject([ProfileLimitsService],
      (service: ProfileLimitsService) => {
         service.updateBulkLimit = jasmine.createSpy('updateBulkLimit').and.returnValue(Observable.throw(''));
         component.originallimitDetails = limits;
         service.updateMultipleLimit.next(true);
         expect(systemErrorService.raiseError).toHaveBeenCalled();
      }));
});

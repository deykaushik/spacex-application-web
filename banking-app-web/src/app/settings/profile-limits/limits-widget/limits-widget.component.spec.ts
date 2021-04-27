import { RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';

import { assertModuleFactoryCaching } from './../../../test-util';
import { LimitsWidgetComponent } from './limits-widget.component';
import { Constants } from '../../../core/utils/constants';
import { ProfileLimitsService } from '../profile-limits.service';
import { NotificationTypes } from '../../../core/utils/enums';


import { IRadioButtonItem, ILimitDetail, INotificationModel } from '../../../core/services/models';
import { SkeletonLoaderPipe } from '../../../shared/pipes/skeleton-loader.pipe';
import { ProfileService } from '../../../profile/profile.service';

const limits: ILimitDetail[] = ([
   {
      limitType: 'transfer', dailyLimit: 150000, userAvailableDailyLimit: 150000, maxDailyLimit: 150000, isTempLimit: true,
      maxTmpDateRangeLimit: 30
   },
   {
      limitType: 'payment', dailyLimit: 150000, userAvailableDailyLimit: 150000, maxDailyLimit: 150000,
      isTempLimit: false, maxTmpDateRangeLimit: 30
   },
   {
      limitType: 'lotto', dailyLimit: 599, userAvailableDailyLimit: 599, maxDailyLimit: 1000, isTempLimit: false,
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

const updateMeteadata = Observable.of({
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
});
const mockfailedLimits = [{ limittype: 'transfer', reason: '', status: 'FAILURE' },
{ limittype: 'payment', reason: '', status: 'FAILURE' }];
const bulkupdateResponse: Subject<string> = new Subject<string>();
const mockupdatedLimitDetails = {
   limits: [
      { limitDetail: limits[0], status: '' },
      { limitDetail: limits[1], status: '' },
      { limitDetail: limits[2], status: '' }
   ]
   , transactionId: ''
};
const ProfileLimitsServiceStub = {
   getAllLimits: jasmine.createSpy('getAllLimits').and.returnValue(Observable.of(limits)),
   getLimitsWidgetVm: jasmine.createSpy('getLimitsWidgetVm').and.returnValue(
      Constants.VariableValues.settings.widgetsDetails.find(m => m.type === Constants.VariableValues.settings.widgetTypes.transfer)),
   updateLimit: jasmine.createSpy('updateLimit').and.returnValue(Observable.of(updateMeteadata)),
   isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.returnValue(true),
   NotifyupdatedLimitChange: jasmine.createSpy('NotifyupdatedLimitChange').and.callFake(function () { }),
   updatedlimits: mockupdatedLimitDetails,
   validChangedLimits: mockupdatedLimitDetails.limits,
   successFullLimits: mockupdatedLimitDetails.limits,
   changedLimits: mockupdatedLimitDetails.limits,
   failedLimits: mockfailedLimits,
   originallimitDetails: limits,
   bulkupdateResponse: bulkupdateResponse,
   getLimitEndDateDetail: jasmine.createSpy('getLimitEndDateDetail').and.returnValue(''),
   getLimitTypeDetail: jasmine.createSpy('getLimitTypeDetail').and.returnValue(''),
};
describe('LimitsWidgetComponent', () => {
   let component: LimitsWidgetComponent;
   let fixture: ComponentFixture<LimitsWidgetComponent>;
   let profileService: ProfileLimitsService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterModule, FormsModule],
         schemas: [NO_ERRORS_SCHEMA],
         declarations: [LimitsWidgetComponent, SkeletonLoaderPipe],
         providers: [{ provide: ProfileLimitsService, useValue: ProfileLimitsServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LimitsWidgetComponent);
      component = fixture.componentInstance;
      component.limitDetail = limits[0];
      component.allLimits = limits;
      component.notifystatusToChild = new Subject();
      profileService = TestBed.get(ProfileLimitsService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should define radion button ', () => {
      expect(component.onLimitTypeChange).toBeDefined();
   });
   it('radio button list change event works properly ', () => {
      const limitType: IRadioButtonItem = { label: 'Permanent', value: 'Permanent' };
      component.onLimitTypeChange(limitType);
      expect(component.vm.limitTypeSelected).toBe(limitType.value);
   });
   it('radio button option is Temporary ', () => {
      const limitType: IRadioButtonItem = { label: 'Temporary', value: 'Temporary' };
      spyOn(component, 'setStartDate').and.callThrough();
      component.onLimitTypeChange(limitType);
      expect(component.vm.limitTypeSelected).toBe(limitType.value);
      expect(component.setStartDate).toHaveBeenCalled();
   });
   it('Should save limit successfully for Permanent Limit Type', () => {
      component.onLimitChange({ value: 2000, isValid: true });
      const notification: INotificationModel = {
         type: NotificationTypes.Success,
         message: 'Successfully updated', sectionName: 'transfer'
      };
      component.notifystatusToChild.next(notification);
      expect(component.notification).toBeDefined();
   });

   it('Should save limit successfully and notify only transfer module', () => {
      component.onLimitChange({ value: 2000, isValid: true });
      const notification: INotificationModel = {
         type: NotificationTypes.Success,
         message: 'Successfully updated',
         sectionName: 'payment'
      };
      component.notifystatusToChild.next(notification);
      expect(component.notification).toBeUndefined();
   });

   it('Should not save limit successfully for Permanent Limit Type', () => {
      component.limitDetail.newLimit = 1000;
      component.onLimitChange({ value: 1000, isValid: true });
      expect(component.limitDetail.newLimit).toEqual(1000);
   });

   it('Should save limit successfully for Temporary type', () => {
      component.limitDetail.isTempLimit = true;
      component.limitDetail.tempDailyLimit = 100;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      component.setDate(tomorrow);
      component.onLimitChange({ value: 1200, isValid: true });
      component.saveTemporaryLimit();
      const notification: INotificationModel = {
         type: NotificationTypes.Success,
         message: 'Successfully updated', sectionName: 'transfer', serviceErrorMessage: 'Message from service'
      };
      component.notifystatusToChild.next(notification);
      expect(component.notification).toBeDefined();
   });
   it('Should not save Temporary type limit for invalid limit value ', () => {
      component.limitDetail.isTempLimit = true;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      component.setDate(tomorrow);
      component.limitDetail.tempDailyLimit = 999999;
      component.limitDetail.limitType = Constants.VariableValues.settings.widgetTypes.lotto;
      component.onLimitChange({ value: 2000, isValid: false });
      component.saveTemporaryLimit();
      const notification: INotificationModel = {
         type: NotificationTypes.Success,
         message: 'Successfully updated', sectionName: 'transfer'
      };
      component.notifystatusToChild.next(notification);
      expect(component.notification).toBeUndefined();
   });
   it('Calendar should save date properly', () => {
      const today = new Date();
      component.setDate(today);
      expect(component.limitDetail.tempLimitEnd).toBeDefined();
   });

   it('should handle if maxDailyLimit is not provided', () => {
      const fixtureNew = TestBed.createComponent(LimitsWidgetComponent);
      const componentCopy = fixtureNew.componentInstance;
      componentCopy.limitDetail = limits[0];
      componentCopy.limitDetail.isTempLimit = false;
      componentCopy.limitDetail.dailyLimit = null;
      componentCopy.allLimits = limits;
      componentCopy.notifystatusToChild = new Subject();
      fixtureNew.detectChanges();
      expect(componentCopy.limitSliderConfig.max).toBe(150000);
   });
   it('should validate lotto,sendimali,prepaid,Instant Payment limit limit , should not be more than Payment limit', () => {
      component.limitDetail = limits[2];
      expect(component.validateLimitValue(160000)).toBe(false);
      component.limitDetail = limits[3];
      expect(component.validateLimitValue(2600000)).toBe(false);
      component.limitDetail = limits[4];
      component.limitDetail.isTempLimit = false;
      component.limitDetail.dailyLimit = null;
      component.allLimits[1].isTempLimit = true;
      component.allLimits[1].tempDailyLimit = null;
      expect(component.validateLimitValue(2600000)).toBe(false);
      component.limitDetail = limits[5];
      component.limitDetail.isTempLimit = true;
      component.limitDetail.tempDailyLimit = null;
      component.allLimits[1].isTempLimit = false;
      component.allLimits[1].dailyLimit = null;
      expect(component.validateLimitValue(2600000)).toBe(false);
   });

   it('should validate payment limit , should be greater than lotto,sendImali,Instant limit and prepaid limit', () => {
      component.limitDetail = limits[1];
      component.allLimits[3].isTempLimit = true;
      component.allLimits[3].tempDailyLimit = null;
      expect(component.validateLimitValue(0)).toBe(false);
      component.allLimits[4].isTempLimit = false;
      component.allLimits[4].dailyLimit = null;
      expect(component.validateLimitValue(0)).toBe(false);
   });
   it('Slider limit change should not save invalid value', () => {
      component.onLimitChange({ value: null, isValid: false });
      expect(component.limitDetail.tempLimitEnd).toBeDefined();
   });
   it('Should emit event for permanent limit if amount is valid', () => {
      component.limitDetail.isTempLimit = false;
      component.addUpdatedLimits({ value: 1200, isValid: true });
      component.limitDetail.isTempLimit = true;
      component.addUpdatedLimits({ value: 1200, isValid: true });
      expect(component.limitDetail.newLimit).toBe(1200);
      component.onLimitChange({ value: 1400, isValid: true });
   });
   it('Should have default vm if skeleton mode is there', () => {
      component.skeletonMode = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.vm).toBeDefined();
      });
   });
   it('Should show error panel on error', () => {
      component.limitDetail.isTempLimit = true;
      component.errorMessages.serviceErrorMessage = 'some error';
      component.onCloseMessage(true);
      expect(component.isMessageOpened).toBe(true);
      component.onCloseMessage(false);
      expect(component.isMessageOpened).toBe(false);
   });
   it('Should save data when slider end only', () => {
      component.limitDetail.isTempLimit = false;
      component.errorMessages.serviceErrorMessage = 'some error';
      const mockAmount = { isValid: true, value: 100 };
      component.onSliderEnd(mockAmount);
      expect(component.isValid).toBeFalsy();
   });
   it('Should not save data when slider value is invalid', () => {
      component.limitDetail.isTempLimit = false;
      component.errorMessages.serviceErrorMessage = 'some error';
      const mockAmount = { isValid: false, value: null };
      component.onSliderEnd(mockAmount);
      expect(component.isValid).toBe(false);
   });
   it('Should not save data amount is invalid', () => {
      component.limitDetail.isTempLimit = false;
      component.errorMessages.serviceErrorMessage = 'some error';
      const mockAmount = { isValid: false, value: 100000 };
      expect(component.addUpdatedLimits(mockAmount)).toBeUndefined();
   });
   it('Should hide message after save limit successfully for Permanent Limit Type', () => {
      component.onLimitChange({ value: 2000, isValid: true });
      const notification: INotificationModel = {
         type: NotificationTypes.None,
         message: '', sectionName: 'transfer'
      };
      component.limitDetail.limitType = notification.sectionName;
      component.notifystatusToChild.next(notification);
      expect(component.isMessageOpened).toBe(false);
   });

   it('Calendar should save date properly', () => {
      const today = new Date();
      profileService.getLimitEndDateDetail = jasmine.createSpy('getLimitEndDateDetail').and.returnValue(today);
      component.setDate(today.getDate() + 1);
      expect(component.limitDetail.tempLimitEnd).toBeDefined();
   });
});

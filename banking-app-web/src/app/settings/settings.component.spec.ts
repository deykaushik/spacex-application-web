import { assertModuleFactoryCaching } from './../test-util';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '../core/core.module';
import { SkeletonLoaderPipe } from '../shared/pipes/skeleton-loader.pipe';
import { ProfileLimitsService } from './profile-limits/profile-limits.service';
import { Constants } from '../core/utils/constants';
import { ILimitDetail, IChangedLimitDetail } from '../core/services/models';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

class MockRouter {
   public ne = new NavigationEnd(0, '/', '/' + Constants.VariableValues.settings.labels.ProfileLimitRoute);
   public events = new Observable(observer => {
      observer.next(this.ne);
      observer.complete();
   });
}
describe('SettingsComponent', () => {
   let component: SettingsComponent;
   let fixture: ComponentFixture<SettingsComponent>;
   let profileService: ProfileLimitsService;
   let routerService: Router;
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

   const ProfileLimitsServiceStub = {

      notifyUpdatedList: jasmine.createSpy('notifyUpdatedList').and.returnValue(Observable.of(new Subject<IChangedLimitDetail[]>())),
      updateMultipleLimit: jasmine.createSpy('updateMultipleLimit').and.returnValue(Observable.of(new Subject<boolean[]>())),
      updateSingleLimitDetail: jasmine.createSpy('updateSingleLimitDetail').and.returnValue(Observable.of(new Subject<ILimitDetail>())),
      bulkupdateResponse: jasmine.createSpy('bulkupdateResponse').and.returnValue(Observable.of(new Subject<string>())),
      isBulkChangeSuccessful: false,
      isPartialChangeSuccessful: false,
      updatedlimits: { limits: [], transactionId: '' },
      partialLimitFailure: [],
      failedLimits: [],
      payload: { limits: [] },
      notifyLimitChange: jasmine.createSpy('notifyLimitChange'),
      getAllLimits: jasmine.createSpy('getAllLimits').and.returnValue(Observable.of(limits)),
      getLimitsWidgetVm: jasmine.createSpy('getLimitsWidgetVm').and.returnValue(
         Constants.VariableValues.settings.widgetsDetails.find(m => m.type === Constants.VariableValues.settings.widgetTypes.transfer)),
      updateLimit: jasmine.createSpy('updateLimit').and.returnValue(Observable.of(updateMeteadata)),
      isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.returnValue(true),
      cancelToOriginalLimitDetail: new Subject<boolean>(),
      resetResponse: jasmine.createSpy('resetResponse').and.callFake(function () { }),
      isProfileLimits: true,
      changedLimits: limits
   };
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterModule, RouterTestingModule, CoreModule],
         schemas: [NO_ERRORS_SCHEMA],
         declarations: [SettingsComponent, SkeletonLoaderPipe],
         providers: [
            { provide: ProfileLimitsService, useValue: ProfileLimitsServiceStub },
            {
               provide: Router,
               useClass: MockRouter
            }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SettingsComponent);
      profileService = TestBed.get(ProfileLimitsService);
      component = fixture.componentInstance;
      routerService = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set status message in case of multiple limit is changed', () => {
      const changedlimits: IChangedLimitDetail[] = [];

      const value = {
         limitDetail: {
            limitType: 'payment',
            dailyLimit: 1000, userAvailableDailyLimit: 1000, maxDailyLimit: 1000, isTempLimit: true,
         }, status: ''
      };
      const value1 = {
         limitDetail: {
            limitType: 'transfer',
            dailyLimit: 1000, userAvailableDailyLimit: 1000, maxDailyLimit: 1000, isTempLimit: true,
         }, status: ''
      };
      const value2 = {
         limitDetail: {
            limitType: 'send Imali',
            dailyLimit: 1000, userAvailableDailyLimit: 1000, maxDailyLimit: 1000, isTempLimit: true,
         }, status: ''
      };
      const value3 = {
         limitDetail: {
            limitType: 'instant payment',
            dailyLimit: 1000, userAvailableDailyLimit: 1000, maxDailyLimit: 1000, isTempLimit: true,
         }, status: ''
      };
      changedlimits.push(value);
      changedlimits.push(value1);
      changedlimits.push(value2);
      changedlimits.push(value3);

      profileService.notifyUpdatedList.next(changedlimits);
   });

   it('should update message if payment list is changed', () => {
      const changedLimits: IChangedLimitDetail[] = [];

      const value = {
         limitDetail: {
            limitType: 'payment', dailyLimit: 1000,
            userAvailableDailyLimit: 1000, maxDailyLimit: 1000, isTempLimit: true,
         }, status: ''
      };
      changedLimits.push(value);
      profileService.notifyUpdatedList.next(changedLimits);
   });

   it('should update status message', () => {
      const changedlimits: IChangedLimitDetail[] = [];
      profileService.notifyUpdatedList.next(changedlimits);
   });
   it('should update response in case of Single Limit Success', () => {
      profileService.bulkupdateResponse.next(Constants.VariableValues.settings.updateStatus.SuccessSingle);
   });

   it('should update response in case of SUCCESS', () => {

      profileService.bulkupdateResponse.next(Constants.VariableValues.settings.updateStatus.Success);
   });

   it('should update response in case of FAILURE', () => {
      profileService.bulkupdateResponse.next(Constants.VariableValues.settings.updateStatus.Failure);

   });

   it('should update response in case of Partial FAILURE', () => {
      profileService.bulkupdateResponse.next(Constants.VariableValues.settings.updateStatus.Partial);

   });

   it('should update response in case of FAILURE', () => {
      profileService.bulkupdateResponse.next('');

   });

   it('should be update profile limit on update button click', () => {

      component.updatebtnClick();
   });

   it('should be cancel Limit Update', () => {
      component.cancelLimitUpdate();
   });

   it('should be able to close notification message', () => {
      component.onCloseMessage(true);
      expect(component.limitResponseMessage).toBe('');
   });

   it('should be able to close notification message if there is some updated limits', () => {

      component.onCloseMessage(true);
      expect(component.limitResponseMessage).toBe('');
   });

   it('should get is profile Limits', () => {
      expect(component.isProfileLimits).toBeTruthy();
   });

});

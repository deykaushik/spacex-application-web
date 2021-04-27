import { FormsModule } from '@angular/forms';
import { AnnualCreditReviewComponent } from './annual-credit-review.component';
import { AccountService } from '../../dashboard/account.service';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { GaTrackingService } from './../../core/services/ga.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IApiResponse, IUnilateralIndicator } from '../../core/services/models';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Constants } from './../../core/utils/constants';
import { assertModuleFactoryCaching } from './../../test-util';
import { CommonUtility } from '../../core/utils/common';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { SharedModule } from '../../shared/shared.module';
import { ApiService } from '../../core/services/api.service';
import { AlertActionType, AlertMessageType } from '../../shared/enums';

const mockUnilateralLimitIndicator: IApiResponse = {
   data: [{
      unilateralLimitIndicator: true,
      isAvailable: true,
      accountName: 'CC',
      plastics: [
         { plasticId: '2', plasticNumber: '377095500181958' },
         { plasticId: '13', plasticNumber: '5412830000809351' }
      ]
   }],
   metadata: {
      resultData: [{
         resultDetail: [
            { operationReference: 'TRANSACTION', result: 'R00', status: 'SUCCESS', reason: 'Success' }
         ]
      }]
   }
};

const mockEmptyUnilateralLimitIndicator: IApiResponse = {
   data: [],
   metadata: {
      resultData: []
   }
};

const mockCreditCardAccounts: IUnilateralIndicator[] = [
   {
      'unilateralLimitIndicator': true,
      'isAvailable': true,
      'AccountName': 'CC',
      'plastics': [
         {
            'plasticId': 2,
            'plasticNumber': '377095500181958'
         },
         {
            'plasticId': 13,
            'plasticNumber': '5412830000809351'
         }
      ]
   },
   {
      'unilateralLimitIndicator': true,
      'isAvailable': true,
      'AccountName': 'CC',
      'plastics': [{ 'plasticId': 3, 'plasticNumber': '377095500283135' }]
   },
   {
      'unilateralLimitIndicator': true,
      'isAvailable': true,
      'AccountName': 'CC',
      'plastics': [{
         'plasticId': 8,
         'plasticNumber': '5412814000932611'
      }]
   }];

const mockCreditCardAccountsFalseIndicator: IApiResponse = {
   data: [{
      unilateralLimitIndicator: false,
      isAvailable: true,
      accountName: 'CC',
      plastics: [
         { plasticId: '2', plasticNumber: '377095500181958' },
         { plasticId: '13', plasticNumber: '5412830000809351' }
      ]
   },
   {
      unilateralLimitIndicator: false,
      isAvailable: true,
      accountName: 'CC',
      plastics: [
         { plasticId: '2', plasticNumber: '377095500181958' },
         { plasticId: '13', plasticNumber: '5412830000809351' }
      ]
   }
],
   metadata: {
      resultData: [{
         resultDetail: [
            { operationReference: 'TRANSACTION', result: 'R00', status: 'SUCCESS', reason: 'Success' }
         ]
      }]
   }
};

const mockUpdateUnilateralIndicatorMaster: IApiResponse = {
      'metadata': {
         'resultData': [
            {
               'transactionID': '0',
               'resultDetail': [
                  {
                     'operationReference': 'TRANSACTION',
                     'result': 'R00',
                     'status': 'SUCCESS',
                     'reason': 'Success'
                  }
               ]
            }
         ]
      }
};

const mockMenuText = Constants.VariableValues.settings.title;

const accountServiceStub = {
   getUnilateralLimitIndicator: jasmine.createSpy('getUnilateralLimitIndicator')
      .and.returnValue(Observable.of(mockUnilateralLimitIndicator)),
   updateUnilateralMasterToggleIndicator: jasmine.createSpy('updateUnilateralMasterToggleIndicator').and.
      returnValue(Observable.of(mockUpdateUnilateralIndicatorMaster)),
   updateUnilateralLimitIndicator: jasmine.createSpy('updateUnilateralLimitIndicator').and.
      returnValue(Observable.of(mockUpdateUnilateralIndicatorMaster))
};

const headerMenuServiceStub = {
   openHeaderMenu: jasmine.createSpy('openHeaderMenu').and.returnValue(mockMenuText)
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('AnnualCreditReviewComponent', () => {
   let component: AnnualCreditReviewComponent;
   let fixture: ComponentFixture<AnnualCreditReviewComponent>;
   let service: AccountService;
   let headerMenuService: HeaderMenuService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [AnnualCreditReviewComponent, SkeletonLoaderPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            HeaderMenuService,
            { provide: AccountService, useValue: accountServiceStub },
            { provide: HeaderMenuService, useValue: headerMenuServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AnnualCreditReviewComponent);
      component = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AccountService);
      headerMenuService = fixture.debugElement.injector.get(HeaderMenuService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set isCreditCardAvailable property false when unilateral details response is empty', () => {
      service.getUnilateralLimitIndicator =
         jasmine.createSpy('getUnilateralLimitIndicator')
            .and.returnValue(Observable.of(mockEmptyUnilateralLimitIndicator));
      fixture.detectChanges();
      component.getUnilateralDetails();
      expect(component.isCreditCardAvailable).toBe(false);
   });

   it('should close the alert message onAlertLinkSelected', () => {
      component.onAlertLinkSelected(AlertActionType.Close);
      expect(component.isShowAlert).toBe(false);
   });

   it('should call onMasterChange method and if master toggle is turned to  on, toggle on all the individual accounts ', () => {
      component.isUnilateralLimitIndicator = true;
      component.allCreditCardAccounts = mockCreditCardAccounts;
      component.onMasterChange();
      expect(component.allCreditCardAccounts[0].unilateralLimitIndicator).toBe(true);
   });

   it('should set different alert message for master toggle on/off when response is success', () => {
      component.isUnilateralLimitIndicatorMaster = true;
      Constants.labels.annualCreditReviewLabels.annualCreditReviewSuccessfulCode = mockUpdateUnilateralIndicatorMaster.
      metadata.resultData[0].resultDetail[0].result;
      component.onMasterChange();
      expect(component.alertMessage).toEqual(Constants.labels.annualCreditReviewLabels.thankYouWeWillReviewText);
      component.isUnilateralLimitIndicatorMaster = false;
      component.onMasterChange();
      expect(component.alertMessage).toEqual(Constants.labels.annualCreditReviewLabels.thankYouWeHaveUpdatedText);
   });

   it('should call onIndividualAccountToggleChange method when individual account is toggled on/off', () => {
      const event = true;
      component.onIndividualAccountToggleChange(mockCreditCardAccounts[0], event);
      expect(component.alertMessage).toEqual(Constants.labels.annualCreditReviewLabels.thankYouWeHaveUpdatedText);

   });

   it('should open header menu', () => {
      component.openSettingsMenu(mockMenuText);
      expect(headerMenuService.openHeaderMenu).toHaveBeenCalled();
   });

   it('should set master toggle false if none of the accounts unilateral indicators are true', () => {
      component.allCreditCardAccounts = mockCreditCardAccountsFalseIndicator.data;
      component.updateMasterToggle();
      expect(component.isUnilateralLimitIndicatorMaster).toBe(false);
   });
});

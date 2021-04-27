import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { OverdraftLimitCancelComponent } from './overdraft-limit-cancel.component';
import { SkeletonLoaderPipe } from './../../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe, } from '../../../shared/pipes/amount-transform.pipe';
import { DecimalPipe } from '@angular/common';
import { AmountFormatDirective, } from '../../../shared/directives/amount-format.directive';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
   IAccountBalanceDetail, IOverdraftAttempts, IChangeOverdraftLimitRequest,
   IClientDetails, IPhoneNumber
} from '../../../core/services/models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { AccountService } from '../../account.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { HttpErrorResponse } from '@angular/common/http';

const mockClientDetails: IClientDetails = {
   DefaultAccountId: '2',
   CisNumber: 12000036423,
   FirstName: 'June',
   SecondName: 'Bernadette',
   Surname: 'Metherell',
   FullNames: 'Mrs June Bernadette Metherell',
   CellNumber: '+27994583427',
   EmailAddress: '',
   BirthDate: '1957-04-04T22:00:00Z',
   FicaStatus: 701,
   SegmentId: 'CEBZZZ',
   IdOrTaxIdNo: 5704050086083,
   SecOfficerCd: '11905',
   AdditionalPhoneList: [{
      AdditionalPhoneType: 'BUS',
      AdditionalPhoneNumber: '(011) 4729828'
   }, {
      AdditionalPhoneType: 'CELL',
      AdditionalPhoneNumber: '+27994583427'
   }, {
      AdditionalPhoneType: 'HOME',
      AdditionalPhoneNumber: '(011) 4729828'
   }],
   Address: {
      AddressLines: [{
         AddressLine: '4 OLGA STREET'
      }, {
         AddressLine: 'FLORIDA EXT 4'
      }, {
         AddressLine: 'FLORIDA'
      }],
      AddressPostalCode: '01709'
   }
};

const mockBalanceDetail: IAccountBalanceDetail = {
   currentBalance: 2618759.14,
   overdraftLimit: 15900.0,
   dbInterestRate: 9.25,
   movementsDue: -10000.0,
   unclearedEffects: 0.0,
   accruedFees: 0.0,
   pledgedAmount: 0.0,
   crInterestDue: 1482.96,
   crInterestRate: 1.0,
   dbInterestDue: 0.0
};

const mockChangeOverdraftLimitRequest: IChangeOverdraftLimitRequest = {
   requestType: '',
   itemAccountId: '1',
   newOverdraftLimit: 0,
   currentOverdraftLimit: 0,
   email: '',
   phoneNumber: '',
   reason: ''
};

const successMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'POA',
               result: 'R00',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const failureMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'POA',
               result: 'HV05',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const updateOverdraftData = {
   data: [],
   metadata: successMetadata
};

const getAccountBalanceDetail = {

};

const updateFailureOverdraftData = {
   data: [],
   metadata: failureMetadata
};

const clientProfileDetailsSuccessServiceStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(mockClientDetails),
};

const accountServiceStub = {
   changeAccountOverdraftLimit: jasmine.createSpy('changeAccountOverdraftLimit')
      .and.returnValue(Observable.of(updateOverdraftData.metadata.resultData[0].resultDetail[0]))
};

const PhoneNumberStub: IPhoneNumber = {
   phoneNumber: '+27123456789',
   isValid: true
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('OverdraftLimitCancelComponent', () => {
   let component: OverdraftLimitCancelComponent;
   let fixture: ComponentFixture<OverdraftLimitCancelComponent>;
   let service: AccountService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [
            FormsModule,
            ReactiveFormsModule
         ],
         declarations: [OverdraftLimitCancelComponent, SkeletonLoaderPipe, AmountTransformPipe, AmountFormatDirective],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [DecimalPipe,
            { provide: AccountService, useValue: accountServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsSuccessServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(OverdraftLimitCancelComponent);
      component = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
      component.accountBalanceDetails = mockBalanceDetail;
      component.ngOnChanges();
   });

   it('should close overdraft window', () => {
      spyOn(component.backToCard, 'emit');
      component.closeOverlay(true);
      expect(component.backToCard.emit).toHaveBeenCalled();
   });

   it('should change the overdraft limit', () => {
      component.isPhoneNumberValid = true;
      component.isEmailValid = true;
      component.showLoader = false;
      component.changeOverdraftLimitRequest = mockChangeOverdraftLimitRequest;
      component.accountBalanceDetails = mockBalanceDetail;
      component.cellNumber = PhoneNumberStub.phoneNumber;
      component.cancelAccountOverdraftLimit();
      expect(component.isOverdraftSuccess).toBeTruthy();
   });

   it('should change the reason', () => {
      component.reasonText = 'Test';
      component.reasonLimit = 100;
      fixture.detectChanges();
      component.odChangeReason();
      expect(component.reasonInfo).toEqual('4/100');
   });

   it('should not change the overdraft limit', () => {
      component.isPhoneNumberValid = true;
      component.isEmailValid = true;
      component.showLoader = false;
      component.changeOverdraftLimitRequest = mockChangeOverdraftLimitRequest;
      component.accountBalanceDetails = mockBalanceDetail;
      component.cellNumber = PhoneNumberStub.phoneNumber;
      service.changeAccountOverdraftLimit =
         jasmine.createSpy('changeAccountOverdraftLimit')
            .and.returnValue(Observable.of(updateFailureOverdraftData.metadata.resultData[0].resultDetail[0]));
      component.cancelAccountOverdraftLimit();
      expect(component.isFicaNotCompliant).toBeTruthy();
   });

   it('should accept vaild email address', () => {
      component.emailAddress = '';
      component.onEmailChange();
      expect(component.isEmailValid).toBe(false);
   });

   it('should accept valid phone number', () => {
      component.getPhoneNumber(PhoneNumberStub);
      expect(component.cellNumber).toBe('+27123456789');
      expect(component.isPhoneNumberValid).toBeTruthy();
   });

   it('should show skeleton mode false if  changeAccountOverdraftLimit API fails', () => {
      service.changeAccountOverdraftLimit = jasmine.createSpy('changeAccountOverdraftLimit').and.callFake(function () {
         return Observable.create(observer => {
            observer.error(new HttpErrorResponse({ error: null, headers: null, status: 204, statusText: '', url: '' }));
            observer.complete();
         });
      });
      component.isPhoneNumberValid = true;
      component.isEmailValid = true;
      component.showLoader = false;
      component.changeOverdraftLimitRequest = mockChangeOverdraftLimitRequest;
      component.accountBalanceDetails = mockBalanceDetail;
      component.cellNumber = PhoneNumberStub.phoneNumber;
      component.cancelAccountOverdraftLimit();
      expect(component.showLoader).toBeFalsy();
   });

});

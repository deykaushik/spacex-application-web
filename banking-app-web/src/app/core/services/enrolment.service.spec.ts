import { TestBed, inject } from '@angular/core/testing';

import { EnrolmentService, ServiceResultType } from './enrolment.service';
import { ApiAuthService } from './api.auth-service';
import { TokenManagementService } from './token-management.service';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { AuthGuardService } from '../guards/auth-guard.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ClientProfileDetailsService } from './client-profile-details.service';
import { RegisterService } from '../../register/register.service';
import { Observable } from 'rxjs/Observable';
import { IAuthorizeResponse } from './models';
import { EventEmitter } from '@angular/core';
import { WindowRefService } from './window-ref.service';

const tokenStub = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiQmVhcmVyIiwibGFzdE5hbWUiOiJUZXN0IiwiQXV0aG5Db250ZX' +
'h0Q2xhc3NSZWYiOiJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YWM6Y2xhc3NlczpQYXNzd29yZCIsImlzcyI6ImlkcC5pdC5uZWRuZXQuY28uemEiLCJhdWQiOiJjZjc5Y' +
'jIxYy0xYWEzLTRiY2UtYWJmMS00NmRlY2M0Mzg0ODMiLCJuYmYiOjE1MTA1NzYzMDksImZpcnN0TmFtZSI6IlRlc3QiLCJlbWFpbCI6Im5vZW1haWxAbmVkYmFuay5jby56YSIsI' +
'mlhdCI6MTUxMDU3NjM2OSwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImV4cCI6MTU3MzY0ODM2OSwic2NvcGVzIjpbXSwianRpIjoiMDZhNDBiMDA4ZGJiNGYxM' +
'WFjNzk3NWQ1MzBjMmU4NWQifQ.NjPefcpEN_5WYdWsRZM_4HMJL4bMJyJ_PskOkaLEL8RkFMru7xwfzBzIt0mjS-JJAmo5G75e59sOTckpO-I217nn1utsx-gX3lDjz6NvoEfN44' +
'RXgvAVjawYIgtapI5vkcpG64QBcSxz8x2iZllYKTj5hzYeW7U3xil_uPur8zAc6zup-kHmRcZlr-kZUeccVFzzBiduClE_Aq3WeCfK0E0xJmt6Zijjn1n0Dj2ZhR9gKXZ3ViNR9y' +
'jtkC_ZwiarpBQ5tgEC4y2yVH6FyuroP04meRMidfY_7Ukd9wSBiajEo_VBT2S2N8Hms72KDk6ugb86xjKzctqneoQniP2UHA';
const mockUserResponse: IAuthorizeResponse = {
   Data: {
      TokenValue: '2323232'
   },
   MetaData: {
      ResultCode: 'R00',
      Message: '',
      InvalidFieldList: []
   }
};

const mockUserData = jasmine.createSpy('create').and.callFake(function () {
   return Observable.of(mockUserResponse);
});

const TokenManagementServiceStub = {
   tokenManagementService: jasmine.createSpy('tokenManagementService'),
   setAuthToken: jasmine.createSpy('tokenManagementService'),
   setUnfederatedToken: jasmine.createSpy('tokenManagementService'),
   getAuthToken: jasmine.createSpy('getAuthToken'),
   removeAuthToken: jasmine.createSpy('getAuthToken'),
};

const mockRetrieveAlias = jasmine.createSpy('RetrieveAlias').and.callFake(function () {
   return Observable.of({ Data: ['dummy'], MetaData: { ResultCode: 'R00' } });
});

const getNedIdTermsStub = jasmine.createSpy('getNedIdTermsStub').and.callFake(function () {
   return Observable.of({ Content: 'dummy' });
});
const mockGetTerms = jasmine.createSpy('RetrieveAlias').and.callFake(function () {
   return Observable.of({ data: ['dummy'], MetaData: { ResultCode: 'R00' } });
});
const bsModalServiceStub = {
   show: jasmine.createSpy('getApproveItStatus').and.callFake(function () {
      return {
         content: {
            getApproveItStatus: Observable.of(true),
            resendApproveDetails: Observable.of(true),
            getOTPStatus: Observable.of(true),
            otpIsValid: Observable.of(true),
            updateSuccess: Observable.of(true),
            processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
            processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
            processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
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

const RegisterServiceStub = {
   resetUserDetails: jasmine.createSpy('resetUserDetails'),
   userDetails: {
      profile: '9003123456',
      pin: '1234',
      password: 'pw1',
      nedbankIdUserName: 'Test@Nedbank',
      nedbankIdPassword: 'P@ssword1!',
      mobileNumber: '0829999999'
   },
   isFederated: jasmine.createSpy('isFederated'),
   retrieveAlias: mockRetrieveAlias,
   Approve: mockRetrieveAlias,
   approveItSucess: true,
   makeFormDirty: jasmine.createSpy('makeFormDirty')
};

const isAuthenticatedEmiter = new EventEmitter<boolean>();

describe('EnrolmentService', () => {
   // let registerService: RegisterService;
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [EnrolmentService, WindowRefService,
            {
               provide: ApiAuthService, useValue: {
                  AuthorizeNedbankId: {
                     create: mockUserData
                  },
                  RefreshAccounts: {
                     getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of({}))
                  },
                  CheckLogin: {
                     getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of('OK'))
                  }
               }
            },
            {
               provide: TokenManagementService,
               useValue: TokenManagementServiceStub
            },
            {
               provide: TermsService,
               useValue: {
                  getTerms: mockGetTerms,
                  getNedIdTerms: getNedIdTermsStub,
                  getLatestAcceptedNedIdTerms: jasmine.createSpy('getLatestAcceptedNedIdTerms').and.returnValue(
                     Observable.of(mockUserResponse)),
                  filterTerms: jasmine.createSpy('filterTerms').and.returnValue(['dummy term']),
                  decodeTerms: jasmine.createSpy('decodeTerms').and.returnValue('dummy term'),
                  convertToSingleTerm: jasmine.createSpy('convertToSingleTerm'),
                  accept: jasmine.createSpy('accept').and.returnValue(Observable.of(['dummy term']))
               }
            },
            {
               provide: AuthGuardService,
               useValue: {
                  isAuthenticated: isAuthenticatedEmiter
               }
            },
            {
               provide: Router,
               useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            { provide: BsModalService, useValue: bsModalServiceStub },
            {
               provide: ClientProfileDetailsService,
               useValue: { getClientDetail: jasmine.createSpy('getClientDetail') }
            },
            {
               provide: RegisterService,
               useValue: RegisterServiceStub
            }
         ]
      });
   });
   it('should be created', inject([EnrolmentService], (service: EnrolmentService) => {
      expect(service).toBeTruthy();
   }));

   it('should check setForgotDetailsFlow', inject([EnrolmentService], (service: EnrolmentService) => {
      service.setForgotDetailsFlow(true);
      expect(service.forgotDetailsFlow).toBeTruthy();
   }));

   it('should check getServiceResultType', inject([EnrolmentService], (service: EnrolmentService) => {
      expect(service.getServiceResultType('R00')).toBe(ServiceResultType.Success);
      expect(service.getServiceResultType('R01')).toBe(ServiceResultType.DataValidationError);
      expect(service.getServiceResultType('R02')).toBe(ServiceResultType.InvalidCustomerDetails);
      expect(service.getServiceResultType('R05')).toBe(ServiceResultType.IncorrectCredentials);
      expect(service.getServiceResultType('R30')).toBe(ServiceResultType.IncorrectCredentials);
      expect(service.getServiceResultType('R31')).toBe(ServiceResultType.IncorrectCredentials);
      expect(service.getServiceResultType('R12')).toBe(ServiceResultType.UnknownUser);
      expect(service.getServiceResultType('R32')).toBe(ServiceResultType.UnknownUser);
      expect(service.getServiceResultType('R06')).toBe(ServiceResultType.IdentityLocked);
      expect(service.getServiceResultType('R33')).toBe(ServiceResultType.IdentityLocked);
      expect(service.getServiceResultType('R07')).toBe(ServiceResultType.IdentitySuspended);
      expect(service.getServiceResultType('R34')).toBe(ServiceResultType.IdentitySuspended);
      expect(service.getServiceResultType('R08')).toBe(ServiceResultType.NedIdExistOrFederated);
      expect(service.getServiceResultType('R19')).toBe(ServiceResultType.NedIdExistOrFederated);
      expect(service.getServiceResultType('R77')).toBe(ServiceResultType.NedIdExistOrFederated);
      expect(service.getServiceResultType('R73')).toBe(ServiceResultType.SecretPolicyViolation);
      expect(service.getServiceResultType('111')).toBe(ServiceResultType.Other);
      expect(service.getServiceResultType('R76')).toBe(ServiceResultType.NotRetailCustomer);
      expect(service.getServiceResultType('R27')).toBe(ServiceResultType.LinkAliasError);
      expect(service.getServiceResultType('R125')).toBe(ServiceResultType.DuplicateIdentity);
      expect(service.getServiceResultType('R20')).toBe(ServiceResultType.InvalidFeature);
      expect(service.getServiceResultType('R137')).toBe(ServiceResultType.InvalidFeature);
   }));

   it('should trigger event for updateServiceResult', inject([EnrolmentService], (service: EnrolmentService) => {
      service.serviceResponse.subscribe((msg) => {
         expect(msg.data).toBe('hi');
      });
      service.updateServiceResult({ data: 'hi' });
   }));

   it('should check onAutoLogin', inject([EnrolmentService], (service: EnrolmentService) => {
      const sub = isAuthenticatedEmiter.subscribe((msg) => {
         expect(msg).toBeFalsy();
         sub.unsubscribe();
      });
      service.onAutoLogin();
   }));

   it('should check onAutoLogin for non fedrated', inject([EnrolmentService], (service: EnrolmentService) => {
      const sub2 = isAuthenticatedEmiter.subscribe((msg) => {
         expect(msg).toBeFalsy();
         sub2.unsubscribe();
      });
      mockRetrieveAlias.and.callFake(function () {
         return Observable.of({ Data: { MobileNumber: '0829999999' }, MetaData: { ResultCode: 'R00' } });
      });
      TokenManagementServiceStub.getAuthToken.and.returnValue(tokenStub);
      service.onAutoLogin();
   }));

   it('should check EncryptString  ', inject([EnrolmentService], (service: EnrolmentService) => {
      expect(service.EncryptString('')).toBe('UdTYIKn7hoU=');
   }));

   it('should check onAutoLogin', inject([EnrolmentService], (service: EnrolmentService) => {
      mockUserData.and.callFake(function () {
         return Observable.of({});
      });
      const sub = isAuthenticatedEmiter.subscribe((msg) => {
         expect(msg).toBeTruthy();
         sub.unsubscribe();
      });
      service.onAutoLogin();
   }));
});

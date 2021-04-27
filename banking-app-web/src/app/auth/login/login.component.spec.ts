import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DebugElement, ElementRef } from '@angular/core';
import { Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { By } from '@angular/platform-browser';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { assertModuleFactoryCaching } from './../../test-util';
import { LoginComponent } from './login.component';
import { ApiService } from './../../core/services/api.service';
import { ApiAuthService } from './../../core/services/api.auth-service';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { AuthService } from '../auth.service';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { RegisterService } from '../../register/register.service';
import { TermsAndConditionsComponent } from '../../shared/terms-and-conditions/terms-and-conditions.component';
import { Constants } from '../../core/utils/constants';
import { AuthConstants } from '../utils/constants';
import { IUser, ITermsAndConditions, IAuthorizeResponse, IClientDetails } from '../../core/services/models';
import { ClientProfileDetailsService } from './../../core/services/client-profile-details.service';
import { TokenManagementService } from './../../core/services/token-management.service';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { AlertActionType } from '../../shared/enums';
import { GaTrackingService } from '../../core/services/ga.service';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { ColoredOverlayComponent } from '../../shared/overlays/colored-overlay/overlay.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { SystemErrorComponent } from '../../shared/components/system-services/system-services.component';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';

describe('LoginComponent', () => {
   let component: LoginComponent;
   let fixture: ComponentFixture<LoginComponent>;
   let router: Router;
   let termsService: TermsService;
   let registerService: RegisterService;
   const mockUserData = getMockUserData();
   const mockTermsData = getMockTermsData();
   let getTerms: any;
   let logon: any;
   let getNedbankIdAnonymousToken: any;
   let downloadPDF: any;
   let filterTerms: any;
   let acceptTerms: any;
   let returnEmptyTerms: Boolean = false;
   let returnEmptyLogon: Boolean = false;
   const returnEmptyLogonData: Boolean = false;
   let returnErrorLogon: Boolean = false;
   let returnEmptyFilteredTerms: Boolean = false;
   let returnDeclineResponse: Boolean = false;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      getTerms = jasmine.createSpy('getTerms').and.callFake(function () {
         if (returnEmptyTerms) {
            return Observable.of([]);
         } else {
            return Observable.of({ data: [mockTermsData] });
         }
      });

      downloadPDF = jasmine.createSpy('downloadPDF').and.callFake(function () {
         return Observable.of(new Blob(['my text'], { type: 'text/plain;charset=utf-8' }));
      });

      filterTerms = jasmine.createSpy('filterTerms').and.callFake(function () {
         if (returnEmptyFilteredTerms) {
            return [];
         } else {
            return [mockTermsData];
         }
      });

      acceptTerms = jasmine.createSpy('accept').and.callFake(function () {
         if (returnDeclineResponse) {
            return Observable.of({ value: Constants.statusDescriptions });
         } else {
            return Observable.of({ value: Constants.statusDescriptions.successful });
         }
      });

      logon = jasmine.createSpy('logon').and.callFake(function () {
         if (returnErrorLogon) {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         } else {
            if (returnEmptyLogon) {
               return Observable.of(null);
            } else {
               if (returnEmptyLogonData) {
                  return {
                     Data: null,
                     MetaData: null
                  };
               } else {
                  return Observable.of(mockUserResponse);
               }
            }
         }
      });

      getNedbankIdAnonymousToken = jasmine.createSpy('getNedbankIdAnonymousToken').and.callFake(function () {
         if (returnErrorLogon) {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         } else {
            if (returnDeclineResponse) {
               mockSaluteResponse.MetaData.ResultCode = '99';
            }
            return Observable.of(mockSaluteResponse);
         }
      });

      jasmine.createSpy('jwt_decode').and.callFake(function () {
         return Observable.of({ sub: '38298298' });
      });
      const clientDetails: IClientDetails = {
         FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
         CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
         EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
         Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
      };

      const gaTrackingServiceStub = {
         sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
      };

      TestBed.configureTestingModule({
         imports: [FormsModule, ModalModule, AlertModule],
         declarations: [LoginComponent, TermsAndConditionsComponent, MessageAlertComponent,
            SystemErrorComponent, BottomButtonComponent, ColoredOverlayComponent, SpinnerComponent],
         providers: [BsModalService,
            BsModalRef,
            ComponentLoaderFactory,
            ModalBackdropComponent,
            PositioningService,
            AuthGuardService,
            { provide: PreApprovedOffersService, useValue: {} },
            {
               provide: TokenManagementService, useValue: {
                  setAuthToken: jasmine.createSpy('setAuthToken').and.stub,
                  setNedbankIdAnonymousToken: jasmine.createSpy('setNedbankIdAnonymousToken').and.stub,
                  setUnfederatedToken: jasmine.createSpy('setUnfederatedToken').and.stub,
                  removeAuthToken: jasmine.createSpy('setUnfederatedToken').and.stub,
                  removeNedbankIdAnonymousToken: jasmine.createSpy('setUnfederatedToken').and.stub,
               }
            },
            {
               provide: ClientProfileDetailsService, useValue: {
                  getClientDetail: jasmine.createSpy('getClientDetail'),
                  getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
                  getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
               }
            },
            {
               provide: TermsService, useValue: {
                  getTerms: getTerms,
                  downloadPDF: downloadPDF,
                  filterTerms: filterTerms,
                  accept: acceptTerms
               }
            },
            {
               provide: AuthService, useValue: {
                  logon: logon,
                  getNedbankIdAnonymousToken: getNedbankIdAnonymousToken
               }
            },
            {
               provide: Router,
               useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            {
               provide: RegisterService,
               useClass: class {
                  isFederated = jasmine.createSpy('isFederated');
                  resetUserDetails = jasmine.createSpy('resetUserDetails').and.callThrough();
                  ResetVariables = jasmine.createSpy('ResetVariables').and.callThrough();
                  retrieveAlias = jasmine.createSpy('retrieveAlias').and.returnValue(Observable.of(mockUserResponse));
               }
            },
            {
               provide: EnrolmentService,
               useValue: {
                  setForgotDetailsFlow: jasmine.createSpy('setForgotDetailsFlow'),
                  autoAcceptTerms: jasmine.createSpy('autoAcceptTerms'),
                  getServiceResultType: jasmine.createSpy('getServiceResultType').and.callThrough(),
                  getNedbankUserId: jasmine.createSpy('getNedbankUserId').and.returnValue(9),
                  ShowTerms: jasmine.createSpy('ShowTerms').and.returnValue(Observable.of(''))
               }
            },
            {
               provide: ApiService, useValue: {
                  refreshAccounts: {
                     getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of({}))
                  }
               }
            },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }],
         schemas: []
      },
      ).overrideModule(BrowserDynamicTestingModule, {
         set: {
            entryComponents: [TermsAndConditionsComponent]
         }
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      component.user = getMockUserData();
      router = TestBed.get(Router);
      registerService = TestBed.get(RegisterService);
      registerService.userDetails = {
         nedbankIdPassword: '',
         nedbankIdUserName: '',
         password: '',
         pin: '',
         profile: '',
         mobileNumber: ''
      };
      termsService = fixture.debugElement.injector.get(TermsService);
      fixture.detectChanges();
   });

   function getMockUserData() {
      return {
         user: 'nedbank',
         password: 'password',
         token: ''
      };
   }

   const mockUserResponse: any = {
      Data: {
         TokenValue: '2323232',
         token: '32429384'
      },
      MetaData: {
         ResultCode: 'R00',
         Message: '',
         InvalidFieldList: []
      }
   };

   const mockSaluteResponse: any = {
      Data: {
         TokenValue: '2323232',
         token: '32429384'
      },
      MetaData: {
         ResultCode: '0',
         Message: '',
         InvalidFieldList: []
      }
   };

   function getMockTermsData() {
      return {
         noticeTitle: 'Imali',
         noticeType: 'IMN',
         versionNumber: 1.23,
         newVersionNumber: 1.25,
         acceptedDateTime: '2017-09-01 09:08:22 AM',
         noticeDetails: {
            noticeContent: 'Imali Terms and Conditions',
            versionDate: '2017-08-01 11:23:11 AM'
         }
      };
   }

   it('should be created', () => {
      expect(component).toBeTruthy();
      expect(component.el).toBeDefined();
      expect(component.toggler).toBeDefined();
   });

   it('form should be validated with valid field data ', () => {
      component.user.password = 'test password';
      component.user.username = 'test username';
      component.user.token = 'test token';
      component.validate();
      expect(component.isFormValid).toBeTruthy();
   });

   it('form should be validated with empty password field ', () => {
      component.user.password = '';
      component.user.username = 'test username';
      component.validate();
      expect(component.isFormValid).toBe(false);
   });

   it('form should be validated with empty username field ', () => {
      component.user.password = 'test password';
      component.user.username = '';
      component.validate();
      expect(component.isFormValid).toBe(false);
   });

   it('should Logon successfully with valid user', inject([BsModalService], (modalService: BsModalService) => {
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      component.user = getMockUserData();
      component.onLogon(event);
      fixture.detectChanges();
      expect(component.validCredentials).toBe(true);
      expect(component.loginError).toBe('');
   }));

   it('should Logon successfully but accept unsuccessful', () => {
      component.user = getMockUserData();
      returnDeclineResponse = true;
      component.onLogon(null);
      fixture.detectChanges();
      expect(component.validCredentials).toBe(true);
      expect(component.loginError).toBe('');
      returnDeclineResponse = false;
   });

   it('should Logon successfully with no filtered terms and conditions', () => {
      component.user = getMockUserData();
      returnEmptyFilteredTerms = true;
      component.onLogon(null);
      fixture.detectChanges();
      expect(component.loginError).toBe('');
      expect(component.validCredentials).toBe(true);
   });

   it('should handle Logon error', () => {
      component.user = getMockUserData();
      returnErrorLogon = true;
      component.onLogon(null);
      fixture.detectChanges();
      expect(component.loginError).toBe('');
      returnErrorLogon = false;
   });

   it('should fail Logon empty with respone', () => {
      component.user = getMockUserData();
      returnEmptyLogon = true;
      component.onLogon(null);
      fixture.detectChanges();
      expect(component.loginError).toBe('');
   });

   it('should Logon successfully with no terms', () => {
      component.user = getMockUserData();
      returnEmptyTerms = true;
      returnEmptyLogon = false;
      component.onLogon(null);
      fixture.detectChanges();
      expect(component.validCredentials).toBe(true);
      expect(component.loginError).toBe('');
   });

   it('should toggle password field', () => {
      component.user.password = 'test password';
      component.user.username = 'Nedbank';
      component.ngAfterViewInit();

      component.toggler.nativeElement.dispatchEvent(new Event('click'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.el.nativeElement.componentInstance.attributes['type']).toBe('text');
      });

      component.toggler.nativeElement.dispatchEvent(new Event('click'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.el.nativeElement.componentInstance.attributes['type']).toBe('password');
      });

      component.toggler.nativeElement.dispatchEvent(new Event('touchstart'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.el.nativeElement.componentInstance.attributes['type']).toBe('text');
      });

      component.toggler.nativeElement.dispatchEvent(new Event('touchend'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.el.nativeElement.componentInstance.attributes['type']).toBe('password');
      });
   });

   it('should call downloadpdf', () => {
      const fs = require('file-saver/FileSaver');
      spyOn(component, 'downloadTerms').and.callThrough();
      spyOn(fs, 'saveAs');
      component.downloadTerms();
      expect(component.downloadTerms).toHaveBeenCalled();
      expect(fs.saveAs).toHaveBeenCalled();
   });

   it('should clear error message', () => {
      spyOn(component, 'onInputChanged').and.callThrough();
      component.onInputChanged('');
      expect(component.loginError).toEqual('');
   });

   it('should handle alert link select', () => {
      spyOn(component, 'onLogon').and.callThrough();
      spyOn(component, 'onSalute').and.callThrough();
      expect(component.onAlertLinkSelected(null)).toBeUndefined();
      expect(component.onAlertLinkSelected(AlertActionType.Close)).toBeUndefined();

      component.isFormValid = true;
      component.saluteFailure = false;
      component.onAlertLinkSelected(AlertActionType.TryAgain);
      expect(component.showLoader).toBe(false);
      expect(component.onLogon).toHaveBeenCalled();

      component.saluteFailure = true;
      component.onAlertLinkSelected(AlertActionType.TryAgain);
      expect(component.onSalute).toHaveBeenCalled();

      expect(component.onAlertLinkSelected(AlertActionType.ForgotDetails)).toBeUndefined();
      expect(component.onAlertLinkSelected(AlertActionType.Help)).toBeUndefined();

      expect(component.onAlertLinkSelected(AlertActionType.None)).toBeUndefined();
   });

   it('should handle navigateRegister if salute failed', () => {
      spyOn(component, 'onSalute').and.callThrough();
      component.saluteFailure = true;
      component.navigateRegister();
      fixture.detectChanges();
      expect(component.onSalute).toHaveBeenCalled();
   });

   it('should handle navigateRegister if salute was successful', () => {
      spyOn(component, 'onSalute').and.callThrough();
      component.saluteFailure = false;
      component.navigateRegister();
      fixture.detectChanges();
      expect(component.onSalute).not.toHaveBeenCalled();
   });

   it('should handle loginSuccess', () => {
      component.loginSuccess(mockUserResponse);
      fixture.detectChanges();
      expect(registerService.retrieveAlias).toHaveBeenCalled();
   });

   it('should handle getNedbankIdAnonymousToken success', () => {
      component.user = getMockUserData();
      returnDeclineResponse = false;
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.saluteFailure).toBeFalsy();
   });

   it('should handle getNedbankIdAnonymousToken failure', () => {
      component.user = getMockUserData();
      returnDeclineResponse = true;
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.saluteFailure).toBeTruthy();
   });

   it('should call ShowTerms when navigating to terms and conditions', inject([EnrolmentService], (enrolmentService: EnrolmentService) => {

      component.user = getMockUserData();

      component.navigateToTerms();

      expect(enrolmentService.ShowTerms).toHaveBeenCalled();
   }));

   it('should call getClientDetail', inject([ClientProfileDetailsService], (clientProfileDetailsService: ClientProfileDetailsService) => {
      component.setUserDetailsObserver();
      expect(clientProfileDetailsService.getClientDetail).toHaveBeenCalled();
   }));

});

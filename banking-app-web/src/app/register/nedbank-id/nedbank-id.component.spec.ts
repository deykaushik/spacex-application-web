import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import {
   FormsModule,
   FormControl,
   FormGroup,
   Validators
} from '@angular/forms';
import { async, fakeAsync } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { inject } from '@angular/core/testing';
import { BsModalService, ComponentLoaderFactory, BsModalRef } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operator/takeWhile';
import { never } from 'rxjs/observable/never';

import { assertModuleFactoryCaching } from './../../test-util';
import { RegisterService } from '../register.service';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { NedbankIdComponent } from './nedbank-id.component';
import { Constants } from '../../core/utils/constants';
import { ConstantsRegister } from '../utils/constants';
import { IApiResponse } from '../../core/services/models';
import { GaTrackingService } from '../../core/services/ga.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { PasswordStrengthMeterComponent } from '../password-strength-meter/password-strength-meter.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';

export class FakeBsModalService {
   onHidden: EventEmitter<any>;
   constructor() { this.onHidden = new EventEmitter<any>(); }
   show(): BsModalRef {
      return new BsModalRef();
   }
}

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('NedbankIdComponent', () => {
   let comp: NedbankIdComponent;
   let fixture: ComponentFixture<NedbankIdComponent>;
   let router: Router;
   let registerService: RegisterService;
   let enrolmentService: EnrolmentService;
   let serviceResponseType: ServiceResult;
   let modalService: BsModalService;

   const mockApiResponse: IApiResponse = {
      MetaData: {
         ResultCode: 'R00',
         Message: '',
         InvalidFieldList: []
      }
   };

   const mockApproveItResponse = {
      MetaData: {
         ResultCode: 'R00'
      },
      Data: {
         ApproveITInfo: { ApproveITVerificationID: 1 }
      }
   };

   const enum ServiceResult {
      CallSuccess = 1,
      CallFailed,
      CallError
   }

   function mockResponse() {
      switch (serviceResponseType) {
         case ServiceResult.CallSuccess:
            return Observable.of({ MetaData: { ResultCode: 'R00' } });

         case ServiceResult.CallFailed:
            return Observable.of({ MetaData: { ResultCode: 'R01' } });

         case ServiceResult.CallError:
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
      }
   }

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [NedbankIdComponent, SpinnerComponent, MessageAlertComponent,
            PasswordStrengthMeterComponent, BottomButtonComponent],
         schemas: [],
         imports: [RouterTestingModule, FormsModule],
         providers: [ComponentLoaderFactory,
            {
               provide: BsModalService, useClass: FakeBsModalService
            },
            { provide: TermsService, useValue: {} },
            {
               provide: RegisterService,
               useValue: {
                  Approve: jasmine.createSpy('Approve').and.returnValue(Observable.of(mockApproveItResponse)),
                  SetActiveView: jasmine.createSpy('setActiveView'),
                  makeFormDirty: jasmine.createSpy('makeFormDirty').and.callFake((param) => {
                     return param;
                  }),
                  UpdateUser: jasmine.createSpy('UpdateUser').and.callFake(mockResponse),
                  checkUsernameAvailable: jasmine.createSpy('checkUsernameAvailable').and.callFake(mockResponse),
                  userDetails: {
                     profile: '9003123456',
                     pin: '1234',
                     password: 'pw1',
                     nedbankIdUserName: 'Test@Nedbank',
                     nedbankIdPassword: 'P@ssword1!',
                     mobileNumber: '0829999999'
                  }
               }
            },
            {
               provide: EnrolmentService,
               useValue: {
                  updateServiceResult: jasmine.createSpy('updateServiceResult'),
                  onAutoLogin: jasmine.createSpy('onAutoLogin').and.callFake(function () {
                     enrolmentService.serviceResponse = new Subject<IApiResponse>();
                  }),
                  serviceResponse: {
                     takeWhile: () => ({
                        subscribe: (callback: Function) => {
                           callback(function () {
                              const resp = new Subject<IApiResponse>();
                              resp.next(mockApiResponse);
                              resp.complete();
                              return (resp);
                           });
                        }
                     })
                  },
                  getServiceResultType: jasmine.createSpy('getServiceResultType').and.callThrough,
                  logOnUser: () => ({})
               }
            },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      });
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NedbankIdComponent);
      comp = fixture.componentInstance;
      router = TestBed.get(Router);
      registerService = TestBed.get(RegisterService);
      enrolmentService = TestBed.get(EnrolmentService);
      serviceResponseType = ServiceResult.CallSuccess;
      modalService = TestBed.get(BsModalService);

      comp.isComponentActive = true;
      registerService.userDetails = {
         profile: '9001234567', pin: '1234', password: 'TestPassword',
         nedbankIdUserName: 'Nedbank123@test', nedbankIdPassword: 'nedIdPassword', mobileNumber: '0812345678'
      };
      fixture.detectChanges();
   });

   it('can load instance', () => {
      expect(comp).toBeTruthy();
   });

   describe('onAlertLinkSelected', () => {
      it('makes expected calls with null parameter', () => {
         spyOn(comp, 'navigateNext');
         comp.onAlertLinkSelected(null);
         expect(comp.navigateNext).not.toHaveBeenCalled();
      });

      it('makes expected calls with Close parameter', () => {
         spyOn(comp, 'navigateNext');
         comp.onAlertLinkSelected(AlertActionType.Close);
         expect(comp.navigateNext).not.toHaveBeenCalled();
      });

      it('makes expected calls with ForgotDetails parameter', () => {
         const registerServiceStub: RegisterService = fixture.debugElement.injector.get(RegisterService);
         comp.onAlertLinkSelected(AlertActionType.ForgotDetails);
         expect(registerServiceStub.SetActiveView).toHaveBeenCalled();
      });

      it('makes expected calls with Help parameter', () => {
         spyOn(comp, 'navigateNext');
         comp.onAlertLinkSelected(AlertActionType.Help);
         expect(comp.navigateNext).not.toHaveBeenCalled();
      });

      it('makes expected calls with TryAgain parameter', () => {
         spyOn(comp, 'navigateNext');
         comp.onAlertLinkSelected(AlertActionType.TryAgain);
         expect(comp.navigateNext).toHaveBeenCalled();
      });

      it('makes expected calls with None parameter', () => {
         spyOn(comp, 'navigateNext');
         comp.onAlertLinkSelected(AlertActionType.None);
         expect(comp.navigateNext).not.toHaveBeenCalled();
      });
   });

   describe('ngOnInit', () => {
      it('makes expected calls', () => {
         spyOn(comp, 'setErrorMessage');
         comp.ngOnInit();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });
   });

   describe('ngAfterViewInit', () => {
      it('togglerPassword handles click event for text type', () => {
         comp.togglerPassword.nativeElement.dispatchEvent(new Event('click'));
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(comp.togglerPassword.nativeElement.componentInstance.attributes['type']).toBe('text');
         });

         comp.togglerPassword.nativeElement.dispatchEvent(new Event('click'));
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(comp.togglerPassword.nativeElement.componentInstance.attributes['type']).toBe('password');
         });
      });

      it('togglerVerifyPassword handles click event for text type', () => {
         comp.togglerVerifyPassword.nativeElement.dispatchEvent(new Event('click'));
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(comp.togglerVerifyPassword.nativeElement.componentInstance.attributes['type']).toBe('text');
         });

         comp.togglerVerifyPassword.nativeElement.dispatchEvent(new Event('click'));
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(comp.togglerVerifyPassword.nativeElement.componentInstance.attributes['type']).toBe('password');
         });
      });
   });

   describe('onAutoLogin', () => {
      it('should handle successful Result', () => {
         const spy = spyOn(router, 'navigateByUrl');
         spyOn(comp, 'onServiceResultSuccess').and.returnValue(true);
         comp.isComponentActive = true;
         comp.onAutoLogin();
         fixture.whenStable().then(() => {
            expect(comp.showLoader).toBe(false);
            const url = spy.calls.first().args[0];
            expect(url.toString()).toBe('/');
         });
      });
   });

   describe('setErrorMessage', () => {
      it('should set error messages', () => {
         const errorMessage = {
            message: 'Test Message', linkText: 'Test Text',
            alertAction: AlertActionType.TryAgain, alertType: AlertMessageType.Error
         };
         spyOn(comp, 'setErrorMessage').and.callThrough();
         comp.setErrorMessage(errorMessage);
         expect(comp.serviceError).toEqual('Test Message');
         expect(comp.errorLinkText).toEqual('Test Text');
         expect(comp.alertAction.toString()).toEqual(AlertActionType.TryAgain.toString());
         expect(comp.alertType.toString()).toEqual(AlertMessageType.Error.toString());
      });

      it('should be clear error messages on input change ', () => {
         spyOn(comp, 'onInputChanged').and.callThrough();
         comp.onInputChanged(null);
         expect(comp.serviceError).toEqual('');
         expect(comp.errorLinkText).toEqual('');
         expect(comp.alertAction.toString()).toEqual(AlertActionType.None.toString());
         expect(comp.alertType.toString()).toEqual(AlertMessageType.Error.toString());
      });
   });

   describe('onServiceResultSuccess', () => {
      it('should return true Success - no error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.Success);
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeTruthy();
      });

      it('should return false DataValidationError - invalidDetails error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DataValidationError);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false IncorrectCredentials - resetPWInvalidUsername error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IncorrectCredentials);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false NedIdExistOrFederated - NedIDUserNameExists error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NedIdExistOrFederated);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false IdentityLocked - resetPWUserLocked error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentityLocked);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false SecretPolicyViolation - resetPWSecretPolicyViolation error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.SecretPolicyViolation);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false IdentitySuspended', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentitySuspended);
         spyOn(router, 'navigate').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(router.navigate).toHaveBeenCalled();
      });

      it('should return false UnknownUser', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.UnknownUser);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false NotRetailCustomer', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NotRetailCustomer);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false FederationInProgress', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.FederationInProgress);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false LinkAliasError', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.LinkAliasError);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false DuplicateIdentity', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DuplicateIdentity);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false InvalidCustomerDetails', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.InvalidCustomerDetails);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles InvalidFeature result', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.InvalidFeature);
         spyOn(comp, 'setErrorMessage').and.stub();
         expect(comp.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });
   });

   it('should navigate to next component', () => {
      spyOn(comp, 'checkUsernameAvailable').and.stub();
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      comp.isValid = true;
      comp.navigateNext(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
   });

   it('should validate Password', () => {
      comp.vm.password = 'Test';
      comp.vm.verifyPassword = 'Test';
      comp.onPasswordVerify(null);
      expect(comp.isPasswordMatch).toBeTruthy();

      comp.vm.verifyPassword = 'TestX';
      comp.onPasswordVerify(null);
      expect(comp.isPasswordMatch).toBeFalsy();
   });

   it('should check if Password verified', () => {
      comp.onPasswordVerified(true);
      expect(comp.isPasswordValid).toBeTruthy();

      comp.onPasswordVerified(false);
      expect(comp.isPasswordValid).toBeFalsy();
   });

   describe('UpdateUser', () => {
      it('should CallUpdateUser', () => {
         const registerServiceStub: RegisterService = fixture.debugElement.injector.get(RegisterService);
         registerServiceStub.temporaryId = 1;
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.Success);
         spyOn(comp, 'CallUpdateUser').and.stub();
         comp.UpdateUser();
         expect(comp.CallUpdateUser).toHaveBeenCalled();
      });

      it('should setErrorMessage on UpdateUserFail', () => {
         const registerServiceStub: RegisterService = fixture.debugElement.injector.get(RegisterService);
         registerServiceStub.temporaryId = 0;
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentityLocked);
         spyOn(comp, 'setErrorMessage');
         comp.UpdateUser();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('should setErrorMessage on empty temporaryId', () => {
         const registerServiceStub: RegisterService = fixture.debugElement.injector.get(RegisterService);
         registerServiceStub.temporaryId = 0;
         spyOn(comp, 'setErrorMessage').and.stub();
         comp.UpdateUser();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });
   });

   describe('CallUpdateUser', () => {
      it('should handle R00 result', () => {
         spyOn(comp, 'ApproveUser').and.callThrough();
         spyOn(comp, 'onServiceResultSuccess').and.returnValue(true);
         spyOn(modalService.onHidden, 'asObservable').and.returnValue(Observable.of(''));
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.Success);
         serviceResponseType = ServiceResult.CallSuccess;
         comp.CallUpdateUser();
         expect(comp.ApproveUser).toHaveBeenCalled();
      });

      it('should handle error', () => {
         serviceResponseType = ServiceResult.CallError;
         comp.CallUpdateUser();
         expect(comp.showLoader).toBeFalsy();
      });

      it('should handle R01 result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DataValidationError);
         serviceResponseType = ServiceResult.CallFailed;
         comp.CallUpdateUser();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });
   });

   describe('checkUsernameAvailable', () => {
      it('should handle R00 result', () => {
         spyOn(comp, 'UpdateUser').and.stub();
         serviceResponseType = ServiceResult.CallSuccess;
         comp.checkUsernameAvailable();
         expect(comp.UpdateUser).toHaveBeenCalled();
      });

      it('should handle error', () => {
         serviceResponseType = ServiceResult.CallError;
         comp.checkUsernameAvailable();
         expect(comp.showLoader).toBeFalsy();
      });

      it('should handle R01 result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         serviceResponseType = ServiceResult.CallFailed;
         comp.checkUsernameAvailable();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });
   });
});

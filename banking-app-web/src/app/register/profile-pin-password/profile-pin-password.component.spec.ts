import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import {
   FormsModule,
   FormControl,
   FormGroup,
   Validators
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';

import { assertModuleFactoryCaching } from './../../test-util';
import { RegisterService, ApprovalType } from '../register.service';
import { LoggerService } from '../../shared/logging/logger.service';
import { ProfilePinPasswordComponent } from './profile-pin-password.component';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { IApiResponse } from '../../core/services/models';
import { GaTrackingService } from '../../core/services/ga.service';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { NedbankIdHelpComponent } from '../nedbank-id-help/nedbank-id-help.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

const enum serviceResultType {
   Success = 1,
   ValidResult,
   CallFailed,
   R19
}
const testComponent = class { };
const routerTestingParam = [
   { path: 'auth', component: testComponent }
];
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('ProfilePinPasswordComponent', () => {
   let component: ProfilePinPasswordComponent;
   let fixture: ComponentFixture<ProfilePinPasswordComponent>;
   let validateProfile: any;
   let encryptString: any;
   let logger: any;
   let modalService: any;
   let serviceResType: serviceResultType;
   let registerService: RegisterService;
   let enrolmentService: EnrolmentService;

   const response = {
      MetaData: {
         ResultCode: 'R00',
         Message: ''
      },
      Data: {
         TemporaryID: 1,
         MobileNumber: '012345678'
      }
   };

   const responseFail = {
      MetaData: {
         ResultCode: 'R01',
         Message: 'Error'
      },
      Data: {
         TemporaryID: 1,
         MobileNumber: '012345678'
      }
   };
   assertModuleFactoryCaching();
   beforeEach(async(() => {
         const shouldReturnEmptyResponse = false;
         serviceResType = serviceResultType.Success;

         validateProfile = jasmine
            .createSpy('validateProfile')
            .and.callFake(function () {
               switch (serviceResType) {
                  case serviceResultType.Success: {
                     return Observable.of(response);
                  }
                  case serviceResultType.ValidResult: {
                     const res = response;
                     res.MetaData.ResultCode = 'R01';
                     res.MetaData.Message = 'Error';
                     return Observable.of(res);
                  }
                  case serviceResultType.R19: {
                     const res = response;
                     res.MetaData.ResultCode = 'R19';
                     res.MetaData.Message = 'Error';
                     return Observable.of(res);
                  }
                  case serviceResultType.CallFailed: {
                     return Observable.create(observer => {
                        observer.error(new Error('error'));
                        observer.complete();
                     });
                  }
                  default: {
                     return Observable.of(response);
                  }
               }
            });

         encryptString = jasmine
            .createSpy('EncryptString')
            .and.callFake(function () {
               return Observable.of('12345');
            });

         logger = jasmine.createSpy('log').and.stub();

         const bsModalRef = new BsModalRef();
         bsModalRef.content = {};
         modalService = jasmine.createSpy('show').and.returnValue(bsModalRef);

         TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingParam)],
            declarations: [ProfilePinPasswordComponent, MessageAlertComponent,
               BottomButtonComponent, NedbankIdHelpComponent, SpinnerComponent],
            providers: [BsModalService,
               {
                  provide: RegisterService,
                  useValue: {
                     validateProfile: validateProfile,
                     EncryptString: encryptString,
                     SetActiveView: jasmine.createSpy('SetActiveView'),
                     makeFormDirty: jasmine.createSpy('makeFormDirty').and.callThrough
                  }
               },
               {
                  provide: LoggerService,
                  useValue: {
                     log: logger
                  }
               },
               {
                  provide: BsModalService,
                  useValue: {
                     show: modalService
                  }
               },
               {
                  provide: Router,
                  useClass: class {
                     navigate = jasmine.createSpy('navigate');
                  }
               },
               {
                  provide: EnrolmentService,
                  useValue: { getServiceResultType: jasmine.createSpy('getServiceResultType').and.callThrough },
                  onAutoLogin: jasmine.createSpy('onAutoLogin').and.callFake(function () {
                     enrolmentService.serviceResponse = new Subject<IApiResponse>();
                  }),
                  serviceResponse: {
                     takeWhile: () => ({
                        subscribe: (callback: Function) => {
                           callback(function () {
                              const resp = new Subject<IApiResponse>();
                              resp.next(response);
                              resp.complete();
                              return (resp);
                           });
                        }
                     })
                  },
               },
               { provide: GaTrackingService, useValue: gaTrackingServiceStub }
            ],
            schemas: []
         }).compileComponents();
      }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ProfilePinPasswordComponent);
      component = fixture.componentInstance;
      registerService = TestBed.get(RegisterService);
      registerService.userDetails = {
         nedbankIdUserName: 'eiwuewiue',
         profile: '',
         password: '',
         nedbankIdPassword: '',
         pin: '',
         mobileNumber: ''
      };

      enrolmentService = TestBed.get(EnrolmentService);

      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be initialized', () => {
      registerService.previousView = View.NedIdHelp;
      registerService.approvalType = ApprovalType.FederateUser;
      component.ngOnInit();
      expect(component.headingText).toContain('Confirm your accounts');
   });

   it('should navigate to next component with event parameter', () => {
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      component.navigateNext(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
   });

   it('should navigate next', () => {
      component.vm.password = 'Sf9oIemkeXtR1NggqfuGhQ==';
      component.vm.pin = 'NR/eZkZfp94=';
      component.vm.profile = '3000009990';
      component.isValid = true;
      spyOn(component, 'onServiceResultSuccess').and.returnValue(true);

      registerService.approvalType = ApprovalType.ApproveUser;
      component.navigateNext(null);

      expect(registerService.validateProfile).toHaveBeenCalled();
   });

   it('should fail on navigate next - nedbankIdExist must be true', () => {
      component.vm.password = 'Sf9oIemkeXtR1NggqfuGhQ==';
      component.vm.pin = 'NR/eZkZfp94=';
      component.vm.profile = '3000009990';
      component.isValid = true;

      spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NedIdExistOrFederated);
      spyOn(component, 'navigateNext').and.callThrough();
      component.navigateNext(null);

      expect(registerService.nedbankIdExist).toBeTruthy();
   });

   it('should fail on navigate next with service result', () => {
      component.vm.password = 'Sf9oIemkeXtR1NggqfuGhQ==';
      component.vm.pin = 'NR/eZkZfp94=';
      component.vm.profile = '3000009990';
      component.isValid = true;
      registerService.approvalType = ApprovalType.ApproveUser;

      spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DataValidationError);
      spyOn(component, 'navigateNext').and.callThrough();
      component.navigateNext(null);

      expect(component.serviceError).toEqual('Sorry, the details you have provided are incorrect. Please revise and try again.');
   });

   it('should fail on navigate next with service error', () => {
      component.vm.password = 'Sf9oIemkeXtR1NggqfuGhQ==';
      component.vm.pin = 'NR/eZkZfp94=';
      component.vm.profile = '3000009990';
      component.isValid = true;
      registerService.approvalType = ApprovalType.ApproveUser;

      spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.Other);
      spyOn(component, 'navigateNext').and.callThrough();
      component.navigateNext(null);

      expect(component.serviceError).toEqual('So sorry! Looks like something\'s wrong on our side.');
   });

   it('should toggle password field', () => {
      component.vm.password = 'test password';
      component.ngAfterViewInit();

      component.togglerPassword.nativeElement.dispatchEvent(
         new Event('click')
      );

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.elPassword.nativeElement.componentInstance.attributes['type']
         ).toBe('text');
      });

      component.togglerPassword.nativeElement.dispatchEvent(new Event('click'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.elPassword.nativeElement.componentInstance.attributes['type']
         ).toBe('password');
      });
   });

   it('should toggle pin field', () => {
      component.vm.pin = 'test password';
      component.ngAfterViewInit();

      component.togglerPin.nativeElement.dispatchEvent(new Event('click'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.elPassword.nativeElement.componentInstance.attributes['type']
         ).toBe('text');
      });

      component.togglerPin.nativeElement.dispatchEvent(new Event('click'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.elPassword.nativeElement.componentInstance.attributes['type']
         ).toBe('password');
      });
   });

   it('should toggle password field on touchstart', () => {
      component.vm.password = 'test password';
      component.ngAfterViewInit();

      component.togglerPassword.nativeElement.dispatchEvent(new Event('touchstart')
      );

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.elPassword.nativeElement.componentInstance.attributes['type']
         ).toBe('text');
      });

      component.togglerPassword.nativeElement.dispatchEvent(new Event('touchend'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.elPassword.nativeElement.componentInstance.attributes['type']
         ).toBe('password');
      });
   });

   it('should toggle pin field on touchstart', () => {
      component.vm.pin = 'test password';
      component.ngAfterViewInit();

      component.togglerPin.nativeElement.dispatchEvent(new Event('touchstart'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.elPassword.nativeElement.componentInstance.attributes['type']
         ).toBe('text');
      });

      component.togglerPin.nativeElement.dispatchEvent(new Event('touchend'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.elPassword.nativeElement.componentInstance.attributes['type']
         ).toBe('password');
      });
   });

   it('should handle onInputChanged', () => {
      spyOn(component, 'onInputChanged').and.callThrough();
      spyOn(component, 'setErrorMessage').and.callThrough();
      component.onInputChanged(null);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(component.serviceError).toEqual('');
   });

   it('should handle onClearValidationErrors', () => {
      spyOn(component, 'onClearValidationErrors').and.callThrough();
      component.onClearValidationErrors(null);
      expect(component.profilePatternValid).toBeTruthy();
      expect(component.pinPatternValid).toBeTruthy();
   });

   it('should handle onToggleHelp', () => {
      component.onToggleHelp(true);
      expect(component.showHelp ).toBeTruthy();
      component.onToggleHelp(false);
      expect(component.showHelp ).toBeFalsy();
   });

   it('should handle onProfileKeyPress', () => {
      // Char code for d is 100
      component.onProfileKeyPress({ charCode: 100 });
      expect(component.profilePatternValid).toBeFalsy();
   });

   it('should handle onPinKeyPress', () => {
      // Char code for d is 100
      component.onPinKeyPress({ charCode: 100 });
      expect(component.pinPatternValid).toBeFalsy();
   });

   describe('alert link select', () => {
      it('should handle null', () => {
         spyOn(component, 'setErrorMessage').and.stub();
         component.onAlertLinkSelected(null);
         expect(component.showLoader).toBe(false);
      });

      it('should handle Close', () => {
         spyOn(component, 'setErrorMessage').and.stub();
         component.onAlertLinkSelected(AlertActionType.Close);
         expect(component.showLoader).toBe(false);
      });

      it('should handle TryAgain', () => {
         spyOn(component, 'navigateNext').and.stub();
         component.onAlertLinkSelected(AlertActionType.TryAgain);
         expect(component.navigateNext).toHaveBeenCalled();
      });

      it('should handle ForgotDetails', () => {
         spyOn(component, 'setErrorMessage').and.stub();
         component.onAlertLinkSelected(AlertActionType.ForgotDetails);
         expect(registerService.SetActiveView).toHaveBeenCalled();
      });

      it('should handle Help', () => {
         spyOn(component, 'needHelp').and.callThrough();
         component.onAlertLinkSelected(AlertActionType.Help);
         expect(component.needHelp).toHaveBeenCalled();
      });

      it('should handle Default', () => {
         spyOn(component, 'setErrorMessage').and.stub();
         component.onAlertLinkSelected(AlertActionType.ResendDetails);
         expect(component.showLoader).toBe(false);
      });
   });

   describe('onServiceResultSuccess', () => {
      it('should return true Success - no error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.Success);
         expect(component.onServiceResultSuccess(response, false)).toBeTruthy();
      });

      it('should return false DataValidationError - invalidDetails error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DataValidationError);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false IncorrectCredentials - resetPWInvalidUsername error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IncorrectCredentials);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false IdentityLocked - resetPWUserLocked error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentityLocked);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false IdentitySuspended', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentitySuspended);
         spyOn(registerService, 'makeFormDirty').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(registerService.makeFormDirty).toHaveBeenCalled();
      });

      it('should return false UnknownUser', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.UnknownUser);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false NotRetailCustomer', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NotRetailCustomer);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return true NedIdExistOrFederated', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NedIdExistOrFederated);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeTruthy();
         expect(component.setErrorMessage).not.toHaveBeenCalled();
      });

      it('should return false NedIdExistOrFederated', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NedIdExistOrFederated);
         expect(component.onServiceResultSuccess(response, true)).toBeFalsy();
      });

      it('should return false DuplicateIdentity', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DuplicateIdentity);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false LinkAliasError', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.LinkAliasError);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false InvalidCustomerDetails', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.InvalidCustomerDetails);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false InvalidFeature', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.InvalidFeature);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(response, false)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });
   });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { FormatMobileNumberPipe } from '../pipes/format-mobile-number.pipe';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { RegisterService } from '../register.service';
import { NedbankIdForgotPwdShowUsernameComponent } from './forgot-pwd-show-username.component';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

describe('NedbankIdForgotPwdShowUsernameComponent', () => {
  let component: NedbankIdForgotPwdShowUsernameComponent;
  let fixture: ComponentFixture<NedbankIdForgotPwdShowUsernameComponent>;
  let router: Router;
  let enrolmentService: EnrolmentService;
  let registerService: RegisterService;
  let serviceResponseType: ServiceResultType;

  const mockServiceResponse = {
    MetaData:
      {
        'ResultCode': 'R00', 'Message': 'Success', 'InvalidFieldList': null,
        'result': { 'resultCode': 0, 'resultMessage': '' }
      },
    Data: { result: true }
  };

  const mockUserDetails = {
    profile: '9003123456',
    pin: '1234',
    password: 'pw1',
    nedbankIdUserName: 'Test@Nedbank',
    nedbankIdPassword: 'P@ssword1!',
    mobileNumber: '0829999999'
  };

  const enum ServiceResultType {
    CallSuccess = 1,
    CallFailed,
    CallError
  }
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, FormsModule],
        declarations: [NedbankIdForgotPwdShowUsernameComponent, FormatMobileNumberPipe,
         MessageAlertComponent, BottomButtonComponent, SpinnerComponent],
        providers: [
          {
            provide: RegisterService,
            useValue: {
              checkUsernameAvailable: jasmine.createSpy('checkUsernameAvailable').and.callFake(function () {

                switch (serviceResponseType) {
                  case ServiceResultType.CallSuccess:
                    return Observable.of(mockServiceResponse);

                  case ServiceResultType.CallFailed:
                    mockServiceResponse.MetaData.ResultCode = 'R01';
                    return Observable.of(mockServiceResponse);

                  case ServiceResultType.CallError:
                    return Observable.create(observer => {
                      observer.error(new Error('error'));
                      observer.complete();
                    });
                }
              }),
              SetActiveView: jasmine.createSpy('SetActiveView').and.callThrough(),
              userDetails: mockUserDetails
            }
          },
          {
            provide: EnrolmentService,
            useClass: class { }
          }
        ],
        schemas: []
      }).compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NedbankIdForgotPwdShowUsernameComponent);
    component = fixture.componentInstance;
    component.isComponentActive = true;
    router = TestBed.get(Router);
    enrolmentService = TestBed.get(EnrolmentService);
    registerService = TestBed.get(RegisterService);
    serviceResponseType = ServiceResultType.CallSuccess;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle ngOnInit with username', () => {
    component.ngOnInit();
    expect(component.userName).toEqual(registerService.userDetails.nedbankIdUserName);
    expect(component.displayNumber).toEqual(registerService.userDetails.mobileNumber);
    expect(component.hasUserName).toBeTruthy();
  });

  it('should handle ngOnInit with no username', () => {
    registerService.userDetails.nedbankIdUserName = '';
    component.ngOnInit();
    expect(component.userName).toEqual('');
    expect(component.displayNumber).toEqual(registerService.userDetails.mobileNumber);
    expect(component.hasUserName).toBeFalsy();
  });

  it('should handle ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component.isComponentActive).toBeFalsy();
  });

  describe('validation', () => {
    it('should handle valid username', () => {
      component.userName = 'ValidUsername';
      component.validate();
      expect(component.isValid).toBeTruthy();
    });

    it('should handle invalid username', () => {
      component.userName = '';
      component.validate();
      expect(component.isValid).toBeFalsy();
    });
  });

  describe('navigateResetPassword', () => {
    it('should navigate if form is valid', () => {
      component.isValid = true;
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      spyOn(component, 'checkUsernameAvailable').and.callThrough();
      component.navigateResetPassword(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.checkUsernameAvailable).toHaveBeenCalledWith(false);
    });

    it('should not navigate if form is invalid', () => {
      component.isValid = false;
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      spyOn(component, 'checkUsernameAvailable').and.callThrough();
      component.navigateResetPassword(null);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(component.checkUsernameAvailable).not.toHaveBeenCalled();
    });
  });

  describe('navigateLogon', () => {
    it('should navigate if form is valid', () => {
      component.isValid = true;
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      spyOn(component, 'checkUsernameAvailable').and.callThrough();
      component.navigateLogon(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.checkUsernameAvailable).toHaveBeenCalledWith(true);
    });

    it('should not navigate if form is invalid', () => {
      component.isValid = false;
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      spyOn(component, 'checkUsernameAvailable').and.callThrough();
      component.navigateLogon(null);
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
      expect(component.checkUsernameAvailable).not.toHaveBeenCalled();
    });
  });

  describe('setErrorMessage', () => {
    it('should set error messages', () => {
      const errorMessage = {
        message: 'Test Message', linkText: 'Test Text',
        alertAction: AlertActionType.TryAgain, alertType: AlertMessageType.Error
      };
      spyOn(component, 'setErrorMessage').and.callThrough();
      component.setErrorMessage(errorMessage);
      expect(component.serviceError).toEqual('Test Message');
      expect(component.errorLinkText).toEqual('Test Text');
      expect(component.alertAction.toString()).toEqual(AlertActionType.TryAgain.toString());
      expect(component.alertType.toString()).toEqual(AlertMessageType.Error.toString());
    });

    it('should clear error messages on input change ', () => {
      spyOn(component, 'onInputChanged').and.callThrough();
      component.onInputChanged(null);
      expect(component.serviceError).toEqual('');
      expect(component.errorLinkText).toEqual('');
      expect(component.alertAction.toString()).toEqual(AlertActionType.None.toString());
      expect(component.alertType.toString()).toEqual(AlertMessageType.Error.toString());
    });
  });

  describe('onAlertLinkSelected', () => {
    it('makes expected calls with null parameter', () => {
      component.onAlertLinkSelected(null);
      expect(registerService.SetActiveView).not.toHaveBeenCalled();
    });

    it('makes expected calls with None parameter', () => {
      component.onAlertLinkSelected(AlertActionType.None);
      expect(registerService.SetActiveView).not.toHaveBeenCalled();
    });

    it('makes expected calls with TryAgain parameter', () => {
      component.onAlertLinkSelected(AlertActionType.TryAgain);
      expect(registerService.SetActiveView).toHaveBeenCalledWith(View.ForgotPwdShowUsername, View.ForgotPwdGetidentity);
    });

    it('makes expected calls with ResendDetails parameter', () => {
      component.onAlertLinkSelected(AlertActionType.ResendDetails);
      expect(registerService.SetActiveView).toHaveBeenCalledWith(View.ForgotPwdShowUsername, View.ForgotPwdGetidentity);
    });

    it('makes expected calls with ForgotDetails parameter', () => {
      component.onAlertLinkSelected(AlertActionType.ForgotDetails);
      expect(registerService.SetActiveView).toHaveBeenCalledWith(View.ForgotPwdShowUsername, View.ForgotPwdResetoptions);
    });
  });

  describe('checkUsernameAvailable', () => {
    it('should handle error', () => {
      serviceResponseType = ServiceResultType.CallError;
      component.checkUsernameAvailable(false);
      expect(component.showLoader).toBeFalsy();
      expect(component.showLoaderLogin).toBeFalsy();
    });

    it('should handle R00 result', () => {
      spyOn(component, 'setErrorMessage').and.callThrough();
      serviceResponseType = ServiceResultType.CallSuccess;
      component.userName = 'New Test User';
      component.checkUsernameAvailable(true);
      expect(registerService.userDetails.nedbankIdUserName).not.toEqual(component.userName);
      expect(component.setErrorMessage).toHaveBeenCalled();
    });

    it('should handle R01 result and go to Login', () => {
      serviceResponseType = ServiceResultType.CallFailed;
      component.userName = 'New Test User';
      component.checkUsernameAvailable(true);
      expect(registerService.userDetails.nedbankIdUserName).toEqual(component.userName);
      expect(registerService.SetActiveView).toHaveBeenCalledWith(View.ForgotPwdShowUsername, View.NedIdLogin);
    });

    it('should handle R01 result and go to CreatePassword', () => {
      serviceResponseType = ServiceResultType.CallFailed;
      component.userName = 'New Test User';
      component.checkUsernameAvailable(false);
      expect(registerService.userDetails.nedbankIdUserName).toEqual(component.userName);
      expect(registerService.SetActiveView).toHaveBeenCalledWith(View.ForgotPwdShowUsername, View.ForgotPwdCreatepwd);
    });
  });
});

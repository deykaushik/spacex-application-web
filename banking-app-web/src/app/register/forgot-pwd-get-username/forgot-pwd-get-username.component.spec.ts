
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { RegisterService } from '../register.service';
import { NedbankIdForgotPwdGetUsernameComponent } from './forgot-pwd-get-username.component';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

describe('NedbankIdForgotPwdGetUsernameComponent', () => {
  let component: NedbankIdForgotPwdGetUsernameComponent;
  let fixture: ComponentFixture<NedbankIdForgotPwdGetUsernameComponent>;
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
      declarations: [NedbankIdForgotPwdGetUsernameComponent,
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
            userDetails: mockUserDetails,
            makeFormDirty: jasmine.createSpy('makeFormDirty').and.callFake((param) => {
               return param;
            })
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
    fixture = TestBed.createComponent(NedbankIdForgotPwdGetUsernameComponent);
    component = fixture.componentInstance;
    component.isComponentActive = true;
    component.vm = { username: 'Test User', password: 'TestPw', verifyPassword: 'TestPw' };
    router = TestBed.get(Router);
    enrolmentService = TestBed.get(EnrolmentService);
    registerService = TestBed.get(RegisterService);
    serviceResponseType = ServiceResultType.CallSuccess;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle ngOnInit', () => {
    component.ngOnInit();
    expect(component.vm.username).toEqual('');
    expect(component.vm.password).toEqual('');
    expect(component.vm.verifyPassword).toEqual('');
  });

  it('should handle ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component.isComponentActive).toBeFalsy();
  });

  describe('validation', () => {
    it('should handle valid username', () => {
      component.vm.username = 'ValidUsername';
      component.validate();
      expect(component.isValid).toBeTruthy();
    });

    it('should handle invalid username', () => {
      component.vm.username = 'x';
      component.validate();
      expect(component.isValid).toBeFalsy();
    });

    it('should handle empty username', () => {
      component.vm.username = '';
      component.validate();
      expect(component.isValid).toBeFalsy();
    });
  });

  describe('navigateNext', () => {
    it('should navigate if form is valid', () => {
      component.isValid = true;
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      spyOn(component, 'checkUsernameAvailable').and.callThrough();
      component.navigateNext(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.checkUsernameAvailable).toHaveBeenCalled();
    });

    it('should not navigate if form is invalid', () => {
      component.isValid = false;
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      spyOn(component, 'checkUsernameAvailable').and.callThrough();
      component.navigateNext(null);
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
      spyOn(component, 'checkUsernameAvailable').and.callThrough();
      component.onAlertLinkSelected(null);
      expect(component.checkUsernameAvailable).not.toHaveBeenCalled();
      expect(registerService.SetActiveView).not.toHaveBeenCalled();
    });

    it('makes expected calls with None parameter', () => {
      spyOn(component, 'checkUsernameAvailable').and.callThrough();
      component.onAlertLinkSelected(AlertActionType.None);
      expect(component.checkUsernameAvailable).not.toHaveBeenCalled();
      expect(registerService.SetActiveView).not.toHaveBeenCalled();
    });

    it('makes expected calls with TryAgain parameter', () => {
      spyOn(component, 'checkUsernameAvailable').and.callThrough();
      component.onAlertLinkSelected(AlertActionType.TryAgain);
      expect(component.checkUsernameAvailable).toHaveBeenCalled();
    });

    it('makes expected calls with ResendDetails parameter', () => {
      component.onAlertLinkSelected(AlertActionType.ResendDetails);
      expect(registerService.SetActiveView).toHaveBeenCalledWith(View.ForgotPwdGetusername, View.ForgotPwdGetidentity);
    });

    it('makes expected calls with ForgotDetails parameter', () => {
      component.onAlertLinkSelected(AlertActionType.ForgotDetails);
      expect(registerService.SetActiveView).toHaveBeenCalledWith(View.ForgotPwdGetusername, View.ForgotPwdResetoptions);
    });

    it('makes expected calls with Help parameter', () => {
      component.onAlertLinkSelected(AlertActionType.Help);
      expect(registerService.SetActiveView).toHaveBeenCalledWith(View.ForgotPwdGetusername, View.NedIdHelp);
    });
  });

  describe('checkUsernameAvailable', () => {
    it('should handle error', () => {
      serviceResponseType = ServiceResultType.CallError;
      component.checkUsernameAvailable();
      expect(component.showLoader).toBeFalsy();
    });

    it('should handle R00 result', () => {
      spyOn(component, 'setErrorMessage').and.callThrough();
      serviceResponseType = ServiceResultType.CallSuccess;
      component.checkUsernameAvailable();
      expect(component.setErrorMessage).toHaveBeenCalled();
    });

    it('should handle R01 result', () => {
      serviceResponseType = ServiceResultType.CallFailed;
      component.vm.username = 'New Test User';
      component.checkUsernameAvailable();
      expect(registerService.userDetails.nedbankIdUserName).toEqual(component.vm.username);
    });
  });
});

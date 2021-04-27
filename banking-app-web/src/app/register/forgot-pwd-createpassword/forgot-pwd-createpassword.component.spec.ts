import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {
  BsModalService,
  BsModalRef,
  ComponentLoaderFactory,
  PositioningService,
  ModalBackdropComponent,
  ModalModule
} from 'ngx-bootstrap';
import { tryParse } from 'selenium-webdriver/http';
import { combineAll } from 'rxjs/operator/combineAll';
import { first } from 'rxjs/operator/first';
import { get } from 'http';

import { IPasswordRecoveryDetails } from '../register.models';
import { TokenManagementService } from './../../core/services/token-management.service';
import { RegisterService } from './../../register/register.service';
import { NedbankIdForgotPwdCreatePwdComponent } from './forgot-pwd-createpassword.component';
import { Constants } from './../../core/utils/constants';
import { assertModuleFactoryCaching } from './../../test-util';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { PasswordStrengthMeterComponent } from '../password-strength-meter/password-strength-meter.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

const enum serviceResultType {
  Success = 1,
  ValidResult,
  CallFailed
}

export interface IEnrolmentUser {
  profile: string;
  pin: string;
  password: string;
  nedbankIdUserName: string;
  nedbankIdPassword: string;
  mobileNumber: string;
}

export class FakeBsModalService {
  onHidden: EventEmitter<any>;

  constructor() { this.onHidden = new EventEmitter<any>(); }

  show(): BsModalRef {
    return new BsModalRef();
  }
}

export class FakeRegisterService {
  previousView: View;
  activeView: View;
  userDetails: IEnrolmentUser;
  makeFormDirty(param) {
    return param;
  }
  SetActiveView(currentView: View, activeView: View) {
    this.previousView = currentView;
    this.activeView = activeView;
  }

  recoverPassword(user: IPasswordRecoveryDetails): Observable<any> {
    return null;
  }
}

export class FakeEnrolmentService {
  getServiceResultType(resultCode: string) {
  }
}

export enum ServiceResultType {
  Success,
  DataValidationError,
  UnknownUser,
  IncorrectCredentials,
  IdentityLocked,
  IdentitySuspended,
  NedIdExistOrFederated,
  NotRetailCustomer,
  SecretPolicyViolation,
  InvalidFeature,
  Other
}

describe('NedbankIdForgotPwdCreatePwdComponent', () => {
  let component: NedbankIdForgotPwdCreatePwdComponent;
  let fixture: ComponentFixture<NedbankIdForgotPwdCreatePwdComponent>;
  let router: Router;
  let service: RegisterService;
  let enrolmentService: EnrolmentService;
  let modalService: BsModalService;

  const response = {
    MetaData: {
      ResultCode: 'R00'
    },
    Data: {
      SecurityRequestID: 1
    }
  };

  const responseApproveIt = {
    MetaData: {
      ResultCode: 'R00'
    },
    Data: {
      ApproveITInfo: { ApproveITVerificationID: 1 }
    }
  };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, FormsModule],
        declarations: [NedbankIdForgotPwdCreatePwdComponent, MessageAlertComponent,
         PasswordStrengthMeterComponent, BottomButtonComponent, SpinnerComponent],
        providers: [
          {
            provide: RegisterService,
            useClass: FakeRegisterService
          },
          {
            provide: BsModalService,
            useClass: FakeBsModalService
          },
          {
            provide: EnrolmentService,
            useClass: FakeEnrolmentService
          }
        ]
      }).compileComponents();
   }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NedbankIdForgotPwdCreatePwdComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    service = TestBed.get(RegisterService);
    enrolmentService = TestBed.get(EnrolmentService);
    modalService = TestBed.get(BsModalService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('setErrorMessage', () => {
    component.setErrorMessage('Dummy error');
    expect(component.serviceError).toEqual('');
    expect(component.errorLinkText).toEqual('');
    expect(component.alertAction).toBeUndefined();
    expect(component.alertType).toBeUndefined();

    const error: any = {
      message: 'error',
      linkText: 'error',
      alertAction: 'error',
      alertType: 'error'
    };

    component.setErrorMessage(error);
    expect(component.serviceError).toEqual('error');
    expect(component.errorLinkText).toEqual('error');
    expect(component.alertAction).toEqual('error');
    expect(component.alertType).toEqual('error');
  });

  it('onInputChanged', () => {
    component.onInputChanged('');
    expect(component.serviceError).toEqual('');
    expect(component.errorLinkText).toEqual('');
    expect(component.alertAction.toString()).toEqual(AlertActionType.None.toString());
    expect(component.alertType.toString()).toEqual(AlertMessageType.Error.toString());
  });

  it('onAlertLinkSelected should set active view to ForgotPwdGetusername', () => {
    component.onAlertLinkSelected(AlertActionType.TryAgain);
    expect(service.previousView).toEqual(View.ForgotPwdResetoptions);
    expect(service.activeView).toEqual(View.ForgotPwdGetusername);
  });

  it('onAlertLinkSelected should set active view to ForgotPwdGetidentity', () => {
    component.onAlertLinkSelected(AlertActionType.ResendDetails);
    expect(service.previousView).toEqual(View.ForgotPwdResetoptions);
    expect(service.activeView).toEqual(View.ForgotPwdGetidentity);
  });

  it('onAlertLinkSelected should set active view to undefined', () => {
    component.onAlertLinkSelected(AlertActionType.None);
    expect(service.previousView).toBeUndefined();
    expect(service.activeView).toBeUndefined();
  });

  it('onAlertLinkSelected should skip else path', () => {
    const spy = spyOn(component, 'onAlertLinkSelected').and.callThrough();
    component.onAlertLinkSelected(undefined);
    expect(spy).toHaveBeenCalled();
  });

  it('onPasswordVerified must validate to true', () => {
    component.onPasswordVerified(true);
    expect(component.isPasswordValid).toBeTruthy();
  });

  it('onPasswordVerified must validate to false', () => {
    component.onPasswordVerified(false);
    expect(component.isPasswordValid).toBeFalsy();
  });

  it('onPasswordVerify password to match', () => {
    component.vm.password = 'password';
    component.vm.verifyPassword = 'password';
    component.onPasswordVerify(null);
    expect(component.isPasswordMatch).toBeTruthy();
  });

  it('onPasswordVerify password to not match', () => {
    component.vm.password = undefined;
    component.onPasswordVerify(null);
    expect(component.isPasswordMatch).toBeFalsy();
  });

  it('onServiceResultSuccess return true Success - no error', () => {
    spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.Success);
    expect(component.onServiceResultSuccess(response)).toBeTruthy();
  });

  it('onServiceResultSuccess return false DataValidationError - invalidDetails error', () => {
    spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DataValidationError);
    spyOn(component, 'setErrorMessage').and.stub();
    expect(component.onServiceResultSuccess(response)).toBeFalsy();
    expect(component.setErrorMessage).toHaveBeenCalled();
  });

  it('onServiceResultSuccess return false IncorrectCredentials - resetPWInvalidUsername error', () => {
    spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IncorrectCredentials);
    spyOn(component, 'setErrorMessage').and.stub();
    expect(component.onServiceResultSuccess(response)).toBeFalsy();
    expect(component.setErrorMessage).toHaveBeenCalled();
  });

  it('onServiceResultSuccess return false UnknownUser - resetPWInvalidUsername error', () => {
    spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.UnknownUser);
    spyOn(component, 'setErrorMessage').and.stub();
    expect(component.onServiceResultSuccess(response)).toBeFalsy();
    expect(component.setErrorMessage).toHaveBeenCalled();
  });

  it('onServiceResultSuccess return false IdentityLocked - resetPWUserLocked error', () => {
    spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentityLocked);
    spyOn(component, 'setErrorMessage').and.stub();
    expect(component.onServiceResultSuccess(response)).toBeFalsy();
    expect(component.setErrorMessage).toHaveBeenCalled();
  });

  it('onServiceResultSuccess return false SecretPolicyViolation - resetPWSecretPolicyViolation error', () => {
    spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.SecretPolicyViolation);
    spyOn(component, 'setErrorMessage').and.stub();
    expect(component.onServiceResultSuccess(response)).toBeFalsy();
    expect(component.setErrorMessage).toHaveBeenCalled();
  });

  it('onServiceResultSuccess return false IdentitySuspended', () => {
    spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentitySuspended);
    spyOn(router, 'navigate').and.stub();
    expect(component.onServiceResultSuccess(response)).toBeFalsy();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('onServiceResultSuccess return false NedIdExistOrFederated - no error', () => {
    spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NedIdExistOrFederated);
    spyOn(component, 'setErrorMessage').and.stub();
    expect(component.onServiceResultSuccess(response)).toBeFalsy();
    expect(component.setErrorMessage).toHaveBeenCalled();
  });

  it('onServiceResultSuccess return false InvalidFeature', () => {
   spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.InvalidFeature);
   spyOn(component, 'setErrorMessage').and.stub();
   expect(component.onServiceResultSuccess(response)).toBeFalsy();
   expect(component.setErrorMessage).toHaveBeenCalled();
 });

  it('onServiceResultSuccess return false skip if', () => {
    expect(component.onServiceResultSuccess(null)).toBeFalsy();
  });

  it('navigateNext event is null and component not valid', () => {
    component.isValid = false;
    component.navigateNext(null);
    expect(component).toBeTruthy();
  });

  it('navigateNext event is not null and component not valid', () => {
    component.isValid = false;

    class ObjectToFake {
      preventDefault() { }
      stopPropagation() { }
    }

    const param: ObjectToFake = new ObjectToFake;
    component.navigateNext(param);
    expect(component).toBeTruthy();
  });

  it('navigateNext event is null and component is valid', () => {
    component.isValid = true;

    service.userDetails = {
      profile: '',
      mobileNumber: '',
      nedbankIdPassword: '',
      nedbankIdUserName: '',
      password: '',
      pin: ''
    };

    spyOn(component, 'onServiceResultSuccess').and.returnValue(true);
    spyOn(service, 'recoverPassword').and.returnValue(Observable.of(responseApproveIt));
    component.navigateNext(null);
    expect(component).toBeTruthy();
  });

  it('navigateNext event is null and component is valid and service call failed', () => {
    component.isValid = true;

    service.userDetails = {
      profile: '',
      mobileNumber: '',
      nedbankIdPassword: '',
      nedbankIdUserName: '',
      password: '',
      pin: ''
    };

    spyOn(component, 'onServiceResultSuccess').and.returnValue(false);
    spyOn(service, 'recoverPassword').and.returnValue(Observable.of(responseApproveIt));
    component.navigateNext(null);
    expect(component).toBeTruthy();
  });

  it('navigateNext event is null and component is valid subscriber error', () => {
    component.isValid = true;

    service.userDetails = {
      profile: '',
      mobileNumber: '',
      nedbankIdPassword: '',
      nedbankIdUserName: '',
      password: '',
      pin: ''
    };

    spyOn(component, 'onServiceResultSuccess').and.returnValue(true);
    spyOn(service, 'recoverPassword').and.returnValue(Observable.create(observer => {
      observer.error(new Error('error'));
      observer.complete();
    }));
    component.navigateNext(null);
    expect(component.showLoader).toBeFalsy();
  });

  it('navigateNext event is null and component is valid subscriber no error sub subscribe', () => {
    component.isValid = true;

    service.userDetails = {
      profile: '',
      mobileNumber: '',
      nedbankIdPassword: '',
      nedbankIdUserName: '',
      password: '',
      pin: ''
    };

    spyOn(component, 'onServiceResultSuccess').and.returnValue(true);
    spyOn(service, 'recoverPassword').and.returnValue(Observable.of(responseApproveIt));
    spyOn(modalService.onHidden, 'asObservable').and.returnValue(Observable.of(''));
    component.navigateNext(null);
    expect(component.showLoader).toBeFalsy();
  });

  it('navigateNext event is null and component is valid subscriber no error sub subscribe invalid hidden', () => {
    component.isValid = true;
    let firstCall = true;

    service.userDetails = {
      profile: '',
      mobileNumber: '',
      nedbankIdPassword: '',
      nedbankIdUserName: '',
      password: '',
      pin: ''
    };

    spyOn(component, 'onServiceResultSuccess').and.callFake(() => {
      if (firstCall) {
        firstCall = false;
        return true;
      } else {
        return false;
      }
    });
    spyOn(service, 'recoverPassword').and.returnValue(Observable.of(responseApproveIt));
    spyOn(modalService.onHidden, 'asObservable').and.returnValue(Observable.of(''));
    component.navigateNext(null);
    expect(component.showLoader).toBeFalsy();
  });

  it('ngAfterViewInit events', () => {
    component.togglerPassword.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.togglerPassword.nativeElement.componentInstance.attributes['type']).toBe('text');
    });

    component.togglerPassword.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.togglerPassword.nativeElement.componentInstance.attributes['type']).toBe('password');
    });

    component.togglerVerifyPassword.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.togglerVerifyPassword.nativeElement.componentInstance.attributes['type']).toBe('text');
    });

    component.togglerVerifyPassword.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.togglerVerifyPassword.nativeElement.componentInstance.attributes['type']).toBe('password');
    });
  });
});

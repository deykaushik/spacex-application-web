import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { inject } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeWhile } from 'rxjs/operators';

import { assertModuleFactoryCaching } from './../../test-util';
import { NedbankIdLoginComponent } from './nedbank-id-login.component';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { RegisterService } from '../register.service';
import { IApiResponse } from '../../core/services/models';
import { AlertActionType } from '../../shared/enums';
import { View } from '../utils/enums';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';


describe('NedbankIdLoginComponent', () => {
   let component: NedbankIdLoginComponent;
   let fixture: ComponentFixture<NedbankIdLoginComponent>;
   let registerService: RegisterService;
   let enrolmentService: EnrolmentService;

   const enum serviceResultType {
      Success = 1,
      InvalidProfileDetails
   }

   const mockApiResponse: IApiResponse = {
      MetaData: {
         ResultCode: 'R00',
         Message: '',
         InvalidFieldList: []
      }
   };

   const response = {
      MetaData: {
         ResultCode: 'R00',
         Message: ''
      },
      Data: {
         TemporaryID: 1,
         MobileNumber: '012345678'
      },
      result: serviceResultType.Success
   };

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      this.currentServiceResult = serviceResultType.Success;
      TestBed.configureTestingModule({
         imports: [RouterTestingModule, FormsModule],
         declarations: [NedbankIdLoginComponent, MessageAlertComponent,
            BottomButtonComponent, SpinnerComponent],
         providers: [
            {
               provide: RegisterService,
               useValue: {
                  SetActiveView: jasmine.createSpy('SetActiveView'),
                  makeFormDirty: jasmine.createSpy('makeFormDirty')
               }
            },
            {
               provide: EnrolmentService,
               useValue: {
                  updateServiceResult: jasmine.createSpy('updateServiceResult'),
                  getServiceResultType: jasmine.createSpy('getServiceResultType').and.callThrough,
                  logOnUser: () => ({}),
                  onAutoLogin: jasmine.createSpy('onAutoLogin'),
                  serviceResponse: {
                     takeWhile: () => ({
                        subscribe: () => {
                           const resp = new Subject<IApiResponse>();
                           resp.next(response);
                           resp.complete();
                           return (resp);
                        }
                     })
                  }
               }
            },
            {
               provide: Router,
               useClass: class { navigate = jasmine.createSpy('navigate'); }
            }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      this.currentServiceResult = serviceResultType.Success;
      fixture = TestBed.createComponent(NedbankIdLoginComponent);
      component = fixture.componentInstance;
      enrolmentService = TestBed.get(EnrolmentService);
      registerService = TestBed.get(RegisterService);
      registerService.userDetails = {
         nedbankIdUserName: 'eiwuewiue',
         profile: '',
         password: '',
         nedbankIdPassword: '',
         pin: '',
         mobileNumber: ''
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should toggle password field', () => {
      component.vm.password = 'test password';
      component.ngAfterViewInit();

      component.toggler.nativeElement.dispatchEvent(
         new Event('click')
      );

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.el.nativeElement.componentInstance.attributes['type']
         ).toBe('text');
      });

      component.toggler.nativeElement.dispatchEvent(new Event('click'));

      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(
            component.el.nativeElement.componentInstance.attributes['type']
         ).toBe('password');
      });
   });

   it('should handle onInputChanged', () => {
      spyOn(component, 'onInputChanged').and.callThrough();
      spyOn(component, 'setErrorMessage').and.callThrough();
      component.onInputChanged(null);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(component.loginError).toEqual('');
   });

   it('should emit failed validation', () => {
      component.vm.password = '';
      component.isComponentValid.subscribe(res => {
         expect(res).toBeFalsy();
      });
      component.validate();
   });

   it('should show forgot password page', () => {
      const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
      component.navigateForgotPassword(mockEvent);
      expect(registerService.SetActiveView).toHaveBeenCalledWith(View.NedIdLogin, View.ForgotPwdCreatepwd);
   });

   describe('onServiceResultSuccess', () => {

      it('should return true Success - no error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.Success);
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeTruthy();
      });

      it('should return false DataValidationError - invalidDetails error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DataValidationError);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false IncorrectCredentials - resetPWInvalidUsername error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IncorrectCredentials);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false IdentityLocked - resetPWUserLocked error', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentityLocked);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false UnknownUser', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.UnknownUser);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false NotRetailCustomer', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NotRetailCustomer);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false FederationInProgress', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.FederationInProgress);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false LinkAliasError', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.LinkAliasError);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false DuplicateIdentity', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DuplicateIdentity);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should return false InvalidCustomerDetails', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.InvalidCustomerDetails);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

      it('should route on IdentitySuspended', inject([Router], (router: Router) => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentitySuspended);
         component.onServiceResultSuccess(mockApiResponse);
         expect(router.navigate).toHaveBeenCalled();
      }));

      it('should return false InvalidFeature', () => {
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.InvalidFeature);
         spyOn(component, 'setErrorMessage').and.stub();
         expect(component.onServiceResultSuccess(mockApiResponse)).toBeFalsy();
         expect(component.setErrorMessage).toHaveBeenCalled();
      });

   });

   describe('onAlertLinkSelected', () => {

      it('should logon when try again was selected', () => {
         spyOn(component, 'onLogon');
         const action = AlertActionType.TryAgain;
         component.onAlertLinkSelected(action);
         expect(component.onLogon).toHaveBeenCalled();
      });

      it('should change views when Forgot details was selected', () => {
         const action = AlertActionType.ForgotDetails;
         component.onAlertLinkSelected(action);
         expect(registerService.SetActiveView).toHaveBeenCalled();
      });

      it('should change views when Help was selected', () => {
         const action = AlertActionType.Help;
         component.onAlertLinkSelected(action);
         expect(registerService.SetActiveView).toHaveBeenCalled();
      });

   });

   describe('onLogon', () => {

      it('should stop default event behaviour', () => {
         const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
         component.onLogon(mockEvent);
         expect(mockEvent.stopPropagation).toHaveBeenCalled();
      });

   });

});

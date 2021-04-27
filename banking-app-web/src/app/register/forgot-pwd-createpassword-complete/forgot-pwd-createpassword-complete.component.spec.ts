import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { async, fakeAsync } from '@angular/core/testing';
import {
   FormsModule,
   FormControl,
   FormGroup,
   Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { RegisterService } from '../register.service';
import { assertModuleFactoryCaching } from './../../test-util';
import { EnrolmentService, ServiceResultType, IEnrolmentUser } from '../../core/services/enrolment.service';
import { NedbankIdForgotPwdCreatePwdCompleteComponent } from './forgot-pwd-createpassword-complete.component';
import { ConstantsRegister } from '../utils/constants';
import { IApiResponse } from '../../core/services/models';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

const testComponent = class { };
const routerTestingParam = [
   { path: 'auth/profileBlocked', component: testComponent }
];

describe('NedbankIdForgotPwdCreatePwdCompleteComponent', () => {
   let comp: NedbankIdForgotPwdCreatePwdCompleteComponent;
   let fixture: ComponentFixture<NedbankIdForgotPwdCreatePwdCompleteComponent>;
   let router: Router;
   let registerService: RegisterService;
   let enrolmentService: EnrolmentService;

   const mockApiResponse: IApiResponse = {
      MetaData: {
         ResultCode: 'R00',
         Message: '',
         InvalidFieldList: []
      }
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [NedbankIdForgotPwdCreatePwdCompleteComponent,
            MessageAlertComponent, BottomButtonComponent,
            SpinnerComponent],
         imports: [RouterTestingModule.withRoutes(routerTestingParam), FormsModule],
         providers: [
            {
               provide: RegisterService,
               useValue: {
                  Approve: jasmine.createSpy('Approve'),
                  SetActiveView: jasmine.createSpy('setActiveView'),
                  makeFormDirty: jasmine.createSpy('makeFormDirty').and.callFake((param) => {
                      return param;
                  })
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
                     take: () => ({
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
                  getServiceResultType: () => ({}),
                  logOnUser: () => ({})
               }
            }
         ]
      });
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NedbankIdForgotPwdCreatePwdCompleteComponent);
      comp = fixture.componentInstance;
      router = TestBed.get(Router);
      registerService = TestBed.get(RegisterService);
      enrolmentService = TestBed.get(EnrolmentService);

      comp.isComponentActive = true;
      registerService.userDetails = {
         profile: '9001234567', pin: '1234', password: 'TestPassword',
         nedbankIdUserName: 'Nedbank123@test', nedbankIdPassword: 'nedIdPassword', mobileNumber: '0812345678'
      };
    });

   it('can load instance', () => {
      expect(comp).toBeTruthy();
   });

   it('messages defaults to: ConstantsRegister.messages', () => {
      expect(comp.messages).toEqual(ConstantsRegister.messages);
   });

   describe('onAlertLinkSelected', () => {
      it('makes expected calls with null parameter', () => {
         comp.onAlertLinkSelected(null);
         expect(registerService.SetActiveView).not.toHaveBeenCalled();
      });

      it('makes expected calls with Close parameter', () => {
         comp.onAlertLinkSelected(AlertActionType.Close);
         expect(registerService.SetActiveView).not.toHaveBeenCalled();
      });

      it('makes expected calls with ForgotDetails parameter', () => {
         comp.onAlertLinkSelected(AlertActionType.ForgotDetails);
         expect(registerService.SetActiveView).toHaveBeenCalled();
      });

      it('makes expected calls with Help parameter', () => {
         comp.onAlertLinkSelected(AlertActionType.Help);
         expect(registerService.SetActiveView).toHaveBeenCalled();
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

   it('should navigate to next component', () => {
      registerService.userDetails.profile = '';
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      comp.navigateNext(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(registerService.SetActiveView).toHaveBeenCalled();
   });

   it('should call auto login', () => {
      spyOn(comp, 'onAutoLogin').and.callThrough();
      comp.isComponentActive = true;
      comp.navigateNext(null);
      expect(comp.onAutoLogin).toHaveBeenCalled();
   });

   describe('onServiceResultSuccess', () => {
      it('handles null parameter', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         const success = comp.onServiceResultSuccess(null);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).not.toHaveBeenCalled();
      });

      it('handles Success result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.Success);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeTruthy();
         expect(comp.setErrorMessage).not.toHaveBeenCalled();
      });

      it('handles DataValidationError result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DataValidationError);

         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles IncorrectCredentials result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IncorrectCredentials);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles IdentityLocked result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentityLocked);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles IdentitySuspended result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.IdentitySuspended);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).not.toHaveBeenCalled();
      });

      it('handles UnknownUser result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.UnknownUser);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles NotRetailCustomer result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NotRetailCustomer);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles DuplicateIdentity result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.DuplicateIdentity);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles LinkAliasError result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.LinkAliasError);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles InvalidCustomerDetails result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.InvalidCustomerDetails);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles InvalidFeature result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.InvalidFeature);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });

      it('handles Other result', () => {
         spyOn(comp, 'setErrorMessage').and.stub();
         spyOn(enrolmentService, 'getServiceResultType').and.returnValue(ServiceResultType.NedIdExistOrFederated);
         const success = comp.onServiceResultSuccess(mockApiResponse);
         expect(success).toBeFalsy();
         expect(comp.setErrorMessage).toHaveBeenCalled();
      });
   });

   it('should navigate to auth component when Done is clicked', fakeAsync(() => {
      const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
      const spy = spyOn(router, 'navigateByUrl');
      spyOn(comp, 'navigateDone').and.callThrough();
      comp.navigateDone(null);
      expect(event.preventDefault).not.toHaveBeenCalled();

      comp.navigateDone(event);
      expect(event.preventDefault).toHaveBeenCalled();
      const url = spy.calls.first().args[0];
      expect(url.toString()).toBe('/auth');
   }));

   it('should be destroyed', () => {
      spyOn(comp, 'ngOnDestroy').and.callThrough();
      comp.ngOnDestroy();
      expect(comp.isComponentActive).toBeFalsy();
   });

});

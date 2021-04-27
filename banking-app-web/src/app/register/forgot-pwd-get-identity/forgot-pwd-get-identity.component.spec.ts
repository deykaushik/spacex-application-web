import { Observable } from 'rxjs/Observable';
import {
   async,
   ComponentFixture,
   TestBed,
   fakeAsync,
   tick
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { inject } from '@angular/core/testing';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { RegisterService } from '../register.service';
import { ConstantsRegister } from '../../register/utils/constants';
import { NedbankIdForgotPwdGetIdentityComponent } from './forgot-pwd-get-identity.component';
import { assertModuleFactoryCaching } from './../../test-util';
import { Constants } from './../../core/utils/constants';
import { AlertActionType } from '../../shared/enums';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

const enum serviceResultType {
   Success = 1,
   ValidResult,
   CallFailed
}
const enum responseType {
   ErrorRecoverUsername = 1,
   EmptyRecoverUsername,
   EmptyRecoverUsernameData,
   ReturnR00,
   ReturnR01,
   ReturnR05,
   ReturnR12,
   defaultreturn,
   returnNoMetadata,
   serviceError
}


const bsModalServiceStub = {
   show: jasmine.createSpy('getApproveItStatus')
};

const enrolmentStub = {
   getServiceResultType(resultCode: string) {
      let resultType = ServiceResultType.Other;
      switch (resultCode) {
         case ConstantsRegister.errorCode.r00: {
            resultType = ServiceResultType.Success;
            break;
         }
         case ConstantsRegister.errorCode.r01: {
            resultType = ServiceResultType.DataValidationError;
            break;
         }
         case ConstantsRegister.errorCode.r05:
         case ConstantsRegister.errorCode.r30:
         case ConstantsRegister.errorCode.r31: {
            resultType = ServiceResultType.IncorrectCredentials;
            break;
         }
         case ConstantsRegister.errorCode.r12:
         case ConstantsRegister.errorCode.r32: {
            resultType = ServiceResultType.UnknownUser;
            break;
         }
         default: {
            resultType = ServiceResultType.Other;
            break;
         }
      }
      return resultType;
   }
};

describe('NedbankIdForgotPwdGetIdentityComponent', () => {
   let component: NedbankIdForgotPwdGetIdentityComponent;
   let fixture: ComponentFixture<NedbankIdForgotPwdGetIdentityComponent>;
   let router: Router;
   let approve: any;
   let create: any;
   let recoverUsername: any;
   const serviceResTypeTerms: serviceResultType = serviceResultType.Success;
   const returnEmptyTerms: Boolean = false;
   const returnEmptyFilteredTerms: Boolean = false;
   let encryptString: any;
   let resetUserDetails: any;
   let setActiveView: any;
   let userDetails: any;
   const serviceResType: serviceResultType = serviceResultType.Success;
   const serviceResTypeLinkProfile: serviceResultType =
      serviceResultType.Success;
   let retResponseType: responseType = responseType.ReturnR00;
   const mockData = getMockData();
   const idTypeRsaId = 'RSAIDENTITY';
   const idTypePassport = 'PASSPORTNUMBER';
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

   const responseApproveItFail = {
      MetaData: {
         ResultCode: 'R01'
      },
      Data: {
         ApproveITInfo: { ApproveITVerificationID: 1 }
      }
   };

   function getMockData() {
      return {

         verificationId: '',
         approvalType: '',
         cellNumber: 0
      };
   }
   const mockUserResponse: any = {
      Data: {
         TokenValue: '2323232',
         token: '32429384',
         Password: '',
         MobileNumber: '',
         UserName: '',
         ApproveITInfo: { ApproveITMethod: '', ApproveITVerificationID: 76767, OTP: 0 }
      },
      MetaData: {
         ResultCode: 'R00',
         Message: ''
      }
   };
   const mockUserResponseForElse: any = {
      Data: {
         TokenValue: '2323232',
         token: '32429384',
         Password: '',
         MobileNumber: '',
         UserName: '',
         ApproveITInfo: { ApproveITMethod: '', ApproveITVerificationID: 76767, OTP: 0 }
      },

   };

   const mockUserResponseR01: any = {
      Data: {
         TokenValue: '2323232',
         token: '32429384',
         Password: '',
         MobileNumber: '',
         UserName: '',
         ApproveITInfo: { ApproveITMethod: '', ApproveITVerificationID: 76767, OTP: 0 }
      },
      MetaData: {
         ResultCode: 'R01',
         Message: ''
      }

   };

   const mockUserResponseR05: any = {
      Data: {
         TokenValue: '2323232',
         token: '32429384',
         Password: '',
         MobileNumber: '',
         UserName: '',
         ApproveITInfo: { ApproveITMethod: '', ApproveITVerificationID: 76767, OTP: 0 }
      },
      MetaData: {
         ResultCode: 'R05',
         Message: ''
      }

   };

   const mockUserResponseR12: any = {
      Data: {
         TokenValue: '2323232',
         token: '32429384',
         Password: '',
         MobileNumber: '',
         UserName: '',
         ApproveITInfo: { ApproveITMethod: '', ApproveITVerificationID: 76767, OTP: 0 }
      },
      MetaData: {
         ResultCode: 'R12',
         Message: ''
      }

   };


   const mockUserResponsedef: any = {
      Data: {
         TokenValue: '2323232',
         token: '32429384',
         Password: '',
         MobileNumber: '',
         UserName: '',
         ApproveITInfo: { ApproveITMethod: '', ApproveITVerificationID: 76767, OTP: 0 }
      },
      MetaData: {
         ResultCode: 'R50',
         Message: ''
      }
   };

   approve = jasmine.createSpy('Approve').and.callFake(function () {
      switch (serviceResType) {
         case serviceResultType.Success: {
            return Observable.of(responseApproveIt);
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

   resetUserDetails = jasmine
      .createSpy('resetUserDetails')
      .and.callFake(function () {
         return Observable.of('');
      });

   recoverUsername = jasmine
      .createSpy('recoverUsername')
      .and.callFake(function () {
         return Observable.of('John');
      });

   userDetails = jasmine
      .createSpy('userDetails')
      .and.callFake(function () {
         return {
            nedbankIdPassword: '',
            nedbankIdUserName: '',
            password: '',
            pin: '',
            profile: '',
            mobileNumber: ''
         };
      });

   setActiveView = jasmine
      .createSpy('setActiveView')
      .and.callFake(function () {
         return Observable.of('');
      });
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      recoverUsername = jasmine.createSpy('recoverUsername').and.callFake(function () {
         switch (retResponseType) {
            case responseType.EmptyRecoverUsername:
               {
                  return Observable.of(null);
               }
            case responseType.EmptyRecoverUsernameData:
               {
                  return {
                     Data: null,
                     MetaData: null
                  };
               }
            case responseType.ReturnR00:
               {
                  return Observable.of(mockUserResponse);
               }
            case responseType.ReturnR01:
               {
                  return Observable.of(mockUserResponseR01);
               }
            case responseType.ReturnR05:
               {
                  return Observable.of(mockUserResponseR05);
               }
            case responseType.ReturnR12:
               {
                  return Observable.of(mockUserResponseR12);
               }
            case responseType.returnNoMetadata:
               {
                  return Observable.of(mockUserResponseForElse);
               }
            case responseType.serviceError:
               {
                  return Observable.create(observer => {
                     observer.error(new Error('error'));
                     observer.complete();
                  });
               }
            default: {
               return Observable.of(mockUserResponsedef);
            }
         }
      });

      create = jasmine.createSpy('create').and.callFake(function () {
         if (returnEmptyTerms) {
            return Observable.of([]);
         } else {
            return Observable.of({ data: [mockData] });
         }

      });

      TestBed.configureTestingModule({
         imports: [RouterTestingModule, FormsModule, TypeaheadModule.forRoot()],
         declarations: [NedbankIdForgotPwdGetIdentityComponent,
            MessageAlertComponent, BottomButtonComponent,
            SpinnerComponent],
         providers: [
            { provide: EnrolmentService, useValue: enrolmentStub },
            { provide: BsModalService, useValue: bsModalServiceStub },
            {
               provide: RegisterService,
               useValue: {
                  EncryptString: encryptString,
                  resetUserDetails: resetUserDetails,
                  recoverUsername: recoverUsername,
                  userDetails: userDetails,
                  SetActiveView: setActiveView,
                  makeFormDirty: jasmine.createSpy('makeFormDirty').and.callFake((param) => {
                     return param;
                  })
               }
            }
         ],
         schemas: []
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NedbankIdForgotPwdGetIdentityComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call onOnDestroy', () => {
      component.isComponentActive = true;
      component.ngOnDestroy();
      expect(component.isComponentActive).toBeFalsy();
   });

   it('should call changeIdType', () => {
      component.changeIdType('someType');
      expect(component.vm.IdDetails.IdType).toBe('someType');

   });

   it('should call onInputvalueChange', () => {
      component.isValid = true;
      component.vm.IdDetails.IdType = idTypeRsaId;
      component.vm.IdDetails.IdNumber = 'invalidIdNumber';
      component.onInputvalueChange(1);
      expect(component.isValid).toBeFalsy();
   });

   it('should validate fail - id number', () => {
      component.vm.IdDetails.IdType = idTypePassport;
      component.vm.IdDetails.IdNumber = '1234';
      component.onInputvalueChange(1);
      expect(component.isValid).toBeFalsy();
   });

   it('should validate fail - passport number', () => {
      component.vm.IdDetails.IdType = idTypeRsaId;
      component.vm.IdDetails.IdNumber = '1234';
      component.onInputvalueChange(1);
      expect(component.isValid).toBeFalsy();
   });

   it('should validate mobilenumber', () => {
      component.vm.MobileNumber = '0820000000';
      expect(component.validateMobileNumber()).toBeTruthy();
   });

   it('should fail validate passport', () => {
      component.vm.IdDetails.IdType = idTypeRsaId;
      expect(component.validatePassportNumber()).toBeFalsy();
   });

   it('should call onAlertLinkSelected -TryAgain', () => {
      spyOn(component, 'navigateNext');
      const alertAction = AlertActionType.TryAgain;
      component.onAlertLinkSelected(alertAction);
      expect(component.navigateNext).toHaveBeenCalled();
   });

   it('should call onAlertLinkSelected - ForgotDetails', inject([RegisterService], (registerService: RegisterService) => {
      const alertAction = AlertActionType.ForgotDetails;
      component.onAlertLinkSelected(alertAction);
      expect(registerService.SetActiveView).toHaveBeenCalled();
   }));

   it('should call onAlertLinkSelected default', () => {
      spyOn(component, 'navigateNext');
      const alertAction = AlertActionType.None;
      component.onAlertLinkSelected(alertAction);
      expect(component.navigateNext).not.toHaveBeenCalled();
   });

   it('should set selected country on selectSouceType', () => {
      const country = { item: { code: 'ZA', name: 'South Africa' } };
      component.selectSouceType(country);
      expect(component.selectedCountry).toBe(country.item);
   });

   it('should clear country on empty selection', () => {
      component.blurCountry('');
      expect(component.selectedCountryName).toBe('');
   });

   it('should set country', () => {
      const country = { item: { code: 'ZA', name: 'South Africa' } };
      component.blurCountry(country);
      expect(component.selectedCountry).toBe(country.item);
   });

   it('should call noSourceResults', () => {
      const event = new Event('any');
      component.noSourceResults(event);
   });

   it('should navigate to next page', () => {
      spyOn(component, 'navigateNext').and.callThrough();
      const event = new Event('any');
      component.vm = { MobileNumber: '', IdDetails: { CountryCode: this.countryCodeRSA, IdNumber: '', IdType: this.idTypeRsaId } };
      component.isValid = true;
      component.navigateNext(event);
      expect(component.navigateNext).toHaveBeenCalled();
   });

   it('should show error on service error ', () => {
      spyOn(component, 'navigateNext').and.callThrough();
      const event = new Event('any');
      component.vm = { MobileNumber: '', IdDetails: { CountryCode: this.countryCodeRSA, IdNumber: '', IdType: this.idTypeRsaId } };
      component.isValid = true;
      retResponseType = responseType.serviceError;
      component.navigateNext(event);
      expect(component.navigateNext).toHaveBeenCalled();
   });

   it(
      'should show error on R01 ', () => {
         spyOn(component, 'navigateNext').and.callThrough();
         const event = new Event('any');
         component.vm = { MobileNumber: '', IdDetails: { CountryCode: this.countryCodeRSA, IdNumber: '', IdType: this.idTypeRsaId } };
         component.isValid = true;
         retResponseType = responseType.ReturnR01;
         component.navigateNext(event);
         expect(component.navigateNext).toHaveBeenCalled();
      });

   it(
      'should show error on R05 ', () => {
         spyOn(component, 'navigateNext').and.callThrough();
         const event = new Event('any');
         component.vm = { MobileNumber: '', IdDetails: { CountryCode: this.countryCodeRSA, IdNumber: '', IdType: this.idTypeRsaId } };
         component.isValid = true;
         retResponseType = responseType.ReturnR05;
         component.navigateNext(event);
         expect(component.navigateNext).toHaveBeenCalled();
      });

   it('should show error on R12 ', () => {
      spyOn(component, 'navigateNext').and.callThrough();
      const event = new Event('any');
      component.vm = { MobileNumber: '', IdDetails: { CountryCode: this.countryCodeRSA, IdNumber: '', IdType: this.idTypeRsaId } };
      component.isValid = true;
      retResponseType = responseType.ReturnR12;
      component.navigateNext(event);
      expect(component.navigateNext).toHaveBeenCalled();
   });


   it('should show error on default ', () => {
      spyOn(component, 'navigateNext').and.callThrough();
      const event = new Event('any');
      component.vm = { MobileNumber: '', IdDetails: { CountryCode: this.countryCodeRSA, IdNumber: '', IdType: this.idTypeRsaId } };
      component.isValid = true;
      retResponseType = responseType.defaultreturn;
      component.navigateNext(event);
      expect(component.navigateNext).toHaveBeenCalled();
   });

   it(
      'should navigate to else statement ', () => {
         spyOn(component, 'navigateNext').and.callThrough();
         const event = new Event('any');
         component.vm = { MobileNumber: '', IdDetails: { CountryCode: this.countryCodeRSA, IdNumber: '', IdType: this.idTypeRsaId } };
         component.isValid = true;
         retResponseType = responseType.returnNoMetadata;
         component.navigateNext(event);
         expect(component.navigateNext).toHaveBeenCalled();
      });
   it('should handle onClearValidationErrors', () => {
      spyOn(component, 'onClearValidationErrors').and.callThrough();
      component.onClearValidationErrors(null);
      expect(component.idPatternValid).toBeTruthy();
      expect(component.phonePatternValid).toBeTruthy();
   });
   it('should handle onProfileKeyPress', () => {
      // Char code for d is 100
      component.onProfileKeyPress({ charCode: 100 });
      expect(component.idPatternValid).toBe(false);
   });
   it('should handle onCellphonePress', () => {
      // Char code for d is 100
      component.onCellphonePress({ charCode: 100 });
      expect(component.phonePatternValid).toBe(false);
   });
});

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { RegisterService } from '../register.service';
import { ConstantsRegister } from '../utils/constants';
import { Router } from '@angular/router';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { IApiResponse } from '../../core/services/models';
import { Subscription } from 'rxjs/Subscription';

@Component({
   selector: 'app-nedbankid-forgotpwd-createpwd-complete',
   templateUrl: './forgot-pwd-createpassword-complete.component.html',
   styleUrls: ['./forgot-pwd-createpassword-complete.component.scss']
})

export class NedbankIdForgotPwdCreatePwdCompleteComponent implements OnInit, OnDestroy {
   messages = ConstantsRegister.messages;
   showLoader: boolean;
   serviceError: string;
   errorLinkText: string;
   alertAction: string;
   alertType: string;
   isComponentActive: boolean;
   recoverPassword: boolean;
   subscription: Subscription;

   constructor(private router: Router,
      private service: RegisterService,
      private enrolmentService: EnrolmentService) {
   }

   ngOnInit() {
      this.isComponentActive = true;
      this.recoverPassword = this.service.isPasswordRecovery === true;
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
   }

   ngOnDestroy() {
      this.isComponentActive = false;
      if (this.subscription) {
         this.subscription.unsubscribe();
      }
   }

   setErrorMessage(errorMessage) {
      this.serviceError = errorMessage.message ? errorMessage.message : '';
      this.errorLinkText = errorMessage.linkText ? errorMessage.linkText : '';
      this.alertAction = errorMessage.alertAction;
      this.alertType = errorMessage.alertType;
   }

   onInputChanged(event) {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
   }

   onAlertLinkSelected(action: AlertActionType) {
      if (action) {
         switch (action) {
            case AlertActionType.Close: {
               break;
            }
            case AlertActionType.TryAgain: {
               this.navigateNext(null);
               break;
            }
            case AlertActionType.ForgotDetails: {
               this.service.SetActiveView(View.ForgotPwdCreatepwdComplete, View.ForgotPwdResetoptions);
               break;
            }
            case AlertActionType.Help: {
               this.service.SetActiveView(View.ForgotPwdCreatepwdComplete, View.ForgotPwdResetoptions);
               break;
            }
            default: {
               break;
            }
         }
      }
   }

   navigateNext(event: any) {
      if (event != null) {
         event.preventDefault();
         event.stopPropagation();
      }

      if (this.service.userDetails.profile && this.service.userDetails.pin && this.service.userDetails.password) {
         this.onAutoLogin();
      } else {
         this.service.SetActiveView(View.ForgotPwdCreatepwdComplete, View.NedIdNotFederated);
      }
   }

   onAutoLogin() {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
      this.showLoader = true;
      this.subscription = this.enrolmentService.serviceResponse
         .take(1)
         .subscribe(response => {
            this.showLoader = false;

            if (this.onServiceResultSuccess(response)) {
               this.service.makeFormDirty(false);
               this.router.navigate(['/']);
            }
         });
      this.enrolmentService.onAutoLogin();
   }

   onServiceResultSuccess(response: IApiResponse) {
      let successResult = false;
      if (response && response.MetaData) {
         const resultType: ServiceResultType = this.enrolmentService.getServiceResultType(response.MetaData.ResultCode);

         switch (resultType) {
            case ServiceResultType.Success: {
               successResult = true;
               break;
            }
            case ServiceResultType.DataValidationError: {
               this.setErrorMessage(ConstantsRegister.errorMessages.invalidDetails);
               break;
            }
            case ServiceResultType.IncorrectCredentials: {
               this.setErrorMessage(ConstantsRegister.errorMessages.invalidDetails);
               break;
            }
            case ServiceResultType.IdentityLocked: {
               this.setErrorMessage(ConstantsRegister.errorMessages.resetPWUserLocked);
               break;
            }
            case ServiceResultType.IdentitySuspended: {
               this.service.makeFormDirty(false);
               this.router.navigate(['/auth/profileBlocked']);
               break;
            }
            case ServiceResultType.UnknownUser: {
               this.setErrorMessage(ConstantsRegister.errorMessages.PPPInvalidUsername);
               break;
            }
            case ServiceResultType.NotRetailCustomer: {
               this.setErrorMessage(ConstantsRegister.errorMessages.PPPBusinessEntry);
               break;
            }
            case ServiceResultType.DuplicateIdentity: {
               this.setErrorMessage(ConstantsRegister.errorMessages.duplicateIdentity);
               break;
            }
            case ServiceResultType.LinkAliasError: {
               this.setErrorMessage(ConstantsRegister.errorMessages.linkAliasError);
               break;
            }
            case ServiceResultType.InvalidCustomerDetails: {
               this.setErrorMessage(ConstantsRegister.errorMessages.invalidCustomerDetails);
               break;
            }
            case ServiceResultType.InvalidFeature: {
               this.setErrorMessage(ConstantsRegister.errorMessages.invalidFeature);
               break;
            }
            default: {
               this.setErrorMessage(ConstantsRegister.errorMessages.systemError);
               break;
            }
         }
      }
      return successResult;
   }

   navigateDone(event: any) {
      if (event != null) {
         event.preventDefault();
         event.stopPropagation();
      }
      this.service.makeFormDirty(false);
      this.router.navigate(['/auth']);
   }
}

import { CommonUtility } from './../../core/utils/common';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConstantsRegister } from '../utils/constants';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { RegisterService } from '../register.service';
import { IUser } from '../../core/services/models';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { INedbankIdVm } from '../register.models';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-nedbank-id-login',
   templateUrl: './nedbank-id-login.component.html',
   styleUrls: ['./nedbank-id-login.component.scss']
})
export class NedbankIdLoginComponent implements OnInit, OnDestroy, AfterViewInit {
   @ViewChild('nedIdLoginForm') nedIdLoginForm;
   @ViewChild('input') el: ElementRef;
   @ViewChild('toggler') toggler: ElementRef;
   @Input() placeholder: string;
   @Output() isComponentValid = new EventEmitter();

   isFormValid: any;
   showLoader: boolean;
   loginError: string;
   errorLinkText: string;
   alertAction: string;
   alertType: string;
   messages: any = ConstantsRegister.messages;
   vm: INedbankIdVm;
   isComponentActive = true;
   subscription: Subscription;
   isPasswordView = true;
   getPasswordField = CommonUtility.getPasswordField.bind(this);

   constructor(private router: Router, private service: EnrolmentService, private registerService: RegisterService) { }

   ngOnInit() {
      this.vm = { username: this.registerService.userDetails.nedbankIdUserName, password: '', verifyPassword: '' };
      this.showLoader = false;
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });

      if (this.registerService && this.registerService.previousView === View.ForgotPwdShowUsername) {
         this.registerService.SetImage('NedbankLogin_v5');
      }
   }

   ngOnDestroy() {
      this.isComponentActive = false;
      if (this.subscription) {
         this.subscription.unsubscribe();
      }
   }

   ngAfterViewInit() {
      this.nedIdLoginForm.valueChanges
         .takeWhile(() => this.isComponentActive === true)
         .subscribe(values => this.validate());

      const __this = this;
      const textbox = __this.el.nativeElement;
      const toggler = __this.toggler.nativeElement;
      const togglerIcon = toggler.childNodes[0];

      toggler.addEventListener('click', (e) => {
         this.isPasswordView = (textbox.type === 'text');
      });
   }

   setErrorMessage(errorMessage) {
      this.loginError = errorMessage.message ? errorMessage.message : '';
      this.errorLinkText = errorMessage.linkText ? errorMessage.linkText : '';
      this.alertAction = errorMessage.alertAction;
      this.alertType = errorMessage.alertType;
   }

   validate() {
      this.isFormValid = this.vm.password ? this.nedIdLoginForm.valid : false;
      this.isComponentValid.emit(this.isFormValid);
   }

   onInputChanged(event) {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
   }

   onAlertLinkSelected(action: AlertActionType) {
      if (action) {
         switch (action) {
            case AlertActionType.TryAgain: {
               this.onLogon(null);
               break;
            }
            case AlertActionType.ForgotDetails: {
               this.registerService.SetActiveView(View.NedIdLogin, View.ForgotPwdResetoptions);
               break;
            }
            case AlertActionType.Help: {
               this.registerService.SetActiveView(View.NedIdLogin, View.ForgotPwdResetoptions);
               break;
            }
            /* istanbul ignore next */
            default: {
               break;
            }
         }
      }
   }

   navigateForgotPassword(event: any) {
      if (event != null) {
         event.preventDefault();
         event.stopPropagation();
      }
      this.registerService.SetActiveView(View.NedIdLogin, View.ForgotPwdCreatepwd);
   }

   onLogon(event: any) {
      if (event != null) {
         event.preventDefault();
         event.stopPropagation();
      }

      this.setErrorMessage({
         message: '', errorLinkText: '',
         alertAction: AlertActionType.None, alertType: AlertMessageType.Error
      });
      this.registerService.userDetails.nedbankIdPassword = this.vm.password;

      this.showLoader = true;
      this.subscription = this.service.serviceResponse
         .takeWhile(() => this.isComponentActive === true)
         .subscribe(response => {
            this.showLoader = false;
            if (response.result && response.result === ServiceResultType.InvalidProfileDetails) {
               this.registerService.SetActiveView(View.NedIdLogin, View.NedIdNotFederated);
            } else {
               if (this.onServiceResultSuccess(response)) {
                  this.registerService.makeFormDirty(false);
                  this.router.navigate(['/']);
               }
            }
         },
         (error) => {
            this.showLoader = false;
         }
         );
      this.service.onAutoLogin();
   }

   onServiceResultSuccess(response: any) {
      let successResult = false;
      if (response && response.MetaData) {
         const resultType: ServiceResultType = this.service.getServiceResultType(response.MetaData.ResultCode);
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
               this.registerService.makeFormDirty(false);
               this.router.navigate(['/auth/profileBlocked']);
               break;
            }
            case ServiceResultType.UnknownUser: {
               this.setErrorMessage(ConstantsRegister.errorMessages.inputValidationError);
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
            case ServiceResultType.InvalidCustomerDetails: {
               this.setErrorMessage(ConstantsRegister.errorMessages.invalidCustomerDetails);
               break;
            }
            case ServiceResultType.LinkAliasError: {
               this.setErrorMessage(ConstantsRegister.errorMessages.linkAliasError);
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

}

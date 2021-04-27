import {
   Component,
   OnInit,
   OnDestroy,
   ViewChild,
   EventEmitter,
   AfterViewInit,
   Output,
   ElementRef,
   OnChanges,
   SimpleChanges,
   AfterViewChecked,
   Injector
} from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BaseComponent } from '../../core/components/base/base.component';
import { ApproveItComponent } from '../approve-it/approve-it.component';
import { RegisterService, ApprovalType } from '../register.service';
import { LoggerService } from '../../shared/logging/logger.service';
import { IRegisterVm } from '../register.models';
import { Constants } from '../../core/utils/constants';
import { ConstantsRegister } from '../utils/constants';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { Subscription } from 'rxjs/Subscription';
import { CommonUtility } from '../../core/utils/common';

@Component({
   selector: 'app-profile-pin-password',
   templateUrl: './profile-pin-password.component.html',
   styleUrls: ['./profile-pin-password.component.scss']
})
export class ProfilePinPasswordComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
   @ViewChild('registerForm') registerForm: NgForm;
   @ViewChild('inputPassword') elPassword: ElementRef;
   @ViewChild('inputPin') elPin: ElementRef;
   @ViewChild('togglerPassword') togglerPassword: ElementRef;
   @ViewChild('togglerPin') togglerPin: ElementRef;
   @Output() isComponentValid = new EventEmitter<boolean>();
   isValid: boolean;
   showLoader: boolean;
   showHelp: boolean;
   patterns = Constants.patterns;
   messages = ConstantsRegister.messages;
   vm: IRegisterVm;
   serviceError: string;
   errorLinkText: string;
   alertAction: string;
   alertType: string;
   bsModalRef: BsModalRef;
   isComponentActive: boolean;
   headingText: string;
   profilePatternValid: boolean;
   pinPatternValid: boolean;
   subscription: Subscription;
   isPasswordView = true;
   isPinPasswordView = true;
   getPasswordField = CommonUtility.getPasswordField.bind(this);

   constructor(
      private router: Router,
      private modalService: BsModalService,
      private service: RegisterService,
      private logger: LoggerService,
      private enrolmentService: EnrolmentService,
      injector: Injector) {
         super(injector);
      }

   ngOnInit() {
      this.logger.log(false, 'constructor');

      if (this.service.previousView && this.service.previousView === View.NedIdHelp) {
         this.vm = {
            profile: this.service.userDetails.profile, pin: this.service.userDetails.pin,
            password: this.service.userDetails.password
         };
      } else {
         this.vm = { password: '', profile: '', pin: '' };
      }
      this.showHelp = false;
      this.showLoader = false;
      this.isComponentActive = true;
      this.profilePatternValid = true;
      this.pinPatternValid = true;
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });

      if (this.service.approvalType === ApprovalType.FederateUser) {
         this.headingText = 'Confirm your accounts using your old internet banking details.';
      } else {
         this.headingText = 'Register with your old Nedbank internet banking login details.';
      }
   }

   ngOnDestroy() {
      this.isComponentActive = false;
      if (this.subscription) {
         this.subscription.unsubscribe();
      }
   }

   ngAfterViewInit() {
      this.registerForm.valueChanges
      .takeWhile(() => this.isComponentActive === true)
      .subscribe(values => this.validate());

    const __this = this;
    const textboxPassword = __this.elPassword.nativeElement;
    const togglerPassword = __this.togglerPassword.nativeElement;
    const togglerIcon = togglerPassword.childNodes[0];

    togglerPassword.addEventListener('click', e => {
      this.isPasswordView = (textboxPassword.type === 'text');
      if (!this.isPasswordView) {
         this.sendEvent(
            ConstantsRegister.gaEvents.passwordIconPPP.eventAction,
            ConstantsRegister.gaEvents.passwordIconPPP.label,
            null,
            ConstantsRegister.gaEvents.passwordIconPPP.category);
      }
    });
    const textboxPin = __this.elPin.nativeElement;
    const togglerPin = __this.togglerPin.nativeElement;
    const togglerPinIcon = togglerPin.childNodes[0];
    togglerPin.addEventListener('click', e => {
      this.isPinPasswordView = (textboxPin.type === 'text');
    });

   }
   onInputChanged(event) {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
   }

   onClearValidationErrors(event) {
      this.profilePatternValid = true;
      this.pinPatternValid = true;
   }

   onVerifyInput(inputValue: any) {
      let inputSuccess = true;
      try {
         const pattern = /[a-zA-Z]+/;
         if (pattern.test(inputValue)) {
            inputSuccess = false;
         }
      } catch (e) { }
      return inputSuccess;
   }

   onProfileKeyPress(event: any) {
      this.profilePatternValid = true;
      if (event && event.charCode) {
         const inputValue = String.fromCharCode(event.charCode);
         if (!this.onVerifyInput(inputValue)) {
            this.profilePatternValid = false;
         }
      }
   }

   onPinKeyPress(event: any) {
      this.pinPatternValid = true;
      if (event && event.charCode) {
         const inputValue = String.fromCharCode(event.charCode);
         if (!this.onVerifyInput(inputValue)) {
            this.pinPatternValid = false;
         }
      }
   }

   setErrorMessage(errorMessage) {
      this.serviceError = errorMessage.message ? errorMessage.message : '';
      this.errorLinkText = errorMessage.linkText ? errorMessage.linkText : '';
      this.alertAction = errorMessage.alertAction;
      this.alertType = errorMessage.alertType;
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
               this.service.SetActiveView(View.ProfilePinPassword, View.ForgotPwdResetoptions);
               break;
            }
            case AlertActionType.Help: {
               this.needHelp();
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
      if (this.isValid) {
         this.showLoader = true;
         this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });

         this.service.userDetails.profile = this.vm.profile;
         this.service.userDetails.pin = this.service.EncryptString(this.vm.pin);
         this.service.userDetails.password = this.service.EncryptString(this.vm.password);

         // PPP not federated - initiated from logon
         if (this.service.approvalType === ApprovalType.FederateUser) {
            this.LinkProfile();
         } else {
            this.sendEvent(
               ConstantsRegister.gaEvents.entersPPP.eventAction,
               ConstantsRegister.gaEvents.entersPPP.label,
               null,
               ConstantsRegister.gaEvents.entersPPP.category);
            this.validateProfile();
         }
      }
   }

   validateProfile() {
      this.service
         .validateProfile(
         this.vm.profile,
         this.service.EncryptString(this.vm.password),
         this.service.EncryptString(this.vm.pin)
         )
         .takeWhile(() => this.isComponentActive === true)
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(
         response => {
            if (this.onServiceResultSuccess(response, true)) {
               this.service.temporaryId = response.Data.TemporaryID;
               this.service.userDetails.mobileNumber = response.Data.MobileNumber;
               this.service.SetActiveView(View.ProfilePinPassword, View.NedIdState);
            }
         },
         (error: number) => {
            this.showLoader = false;
         }
         );
   }

   LinkProfile() {
      this.subscription = this.enrolmentService.serviceResponse
         .takeWhile(() => this.isComponentActive === true)
         .subscribe(response => {
            this.showLoader = false;
            if (this.onServiceResultSuccess(response, false)) {
               this.service.makeFormDirty(false);
               this.router.navigate(['/']);
            }
         },
         (error) => {
            this.showLoader = false;
         }
         );
      this.enrolmentService.onAutoLogin();
   }

   onServiceResultSuccess(response: any, isValidateProfile: boolean) {
      let successResult = false;
      if (response && response.MetaData) {
         const resultType: ServiceResultType = this.enrolmentService.getServiceResultType(response.MetaData.ResultCode);
         switch (resultType) {
            case ServiceResultType.Success: {
               successResult = true;
               break;
            }
            case ServiceResultType.DataValidationError: {
               this.sendEvent(
                  ConstantsRegister.gaEvents.incorrectPPP.eventAction,
                  ConstantsRegister.gaEvents.incorrectPPP.label,
                  null,
                  ConstantsRegister.gaEvents.incorrectPPP.category);
               this.setErrorMessage(ConstantsRegister.errorMessages.invalidDetails);
               break;
            }
            case ServiceResultType.IncorrectCredentials: {
               this.sendEvent(
                  ConstantsRegister.gaEvents.incorrectPPP.eventAction,
                  ConstantsRegister.gaEvents.incorrectPPP.label,
                  null,
                  ConstantsRegister.gaEvents.incorrectPPP.category);
               this.setErrorMessage(ConstantsRegister.errorMessages.PPPDetailsDontMatch);
               break;
            }
            case ServiceResultType.IdentityLocked: {
               this.setErrorMessage(ConstantsRegister.errorMessages.PPPDetailsDontMatchResolve);
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
            case ServiceResultType.NedIdExistOrFederated: {
               if (isValidateProfile) {
                  this.sendEvent(
                     ConstantsRegister.gaEvents.haveNedbankId.eventAction,
                     ConstantsRegister.gaEvents.haveNedbankId.label,
                     null,
                     ConstantsRegister.gaEvents.haveNedbankId.category);
                  this.service.nedbankIdExist = true;
                  this.service.userDetails.nedbankIdUserName = response.Data.Username;
                  this.service.SetActiveView(View.ProfilePinPassword, View.NedIdExist);
               } else {
                  successResult = true;
               }
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

   validate() {
      this.isValid =
         this.vm.pin && this.vm.profile && this.vm.password
            ? this.registerForm.valid
            : false;
      this.isComponentValid.emit(this.isValid);
      this.service.makeFormDirty(this.registerForm.dirty);
   }

   needHelp() {
      if (this.service && this.vm) {
         this.service.userDetails.profile = this.vm.profile;
         this.service.userDetails.pin = this.vm.pin;
         this.service.userDetails.password = this.vm.password;
      }
      this.onToggleHelp(true);
   }

   onToggleHelp(showHelpModal: boolean) {
      this.showHelp = showHelpModal;
   }
}

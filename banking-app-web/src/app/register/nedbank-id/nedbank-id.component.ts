import { CommonUtility } from './../../core/utils/common';
import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, AfterViewInit, Output, ElementRef, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BaseComponent } from '../../core/components/base/base.component';
import { ApproveItComponent } from '../approve-it/approve-it.component';
import { RegisterService } from '../register.service';
import { Constants } from '../../core/utils/constants';
import { ConstantsRegister } from '../utils/constants';
import { INedbankIdVm } from '../register.models';
import { TermsAndConditionsComponent } from '../../shared/terms-and-conditions/terms-and-conditions.component';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { IUser, ITermsAndConditions, ITermsNedbankId } from '../../core/services/models';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { TermsAndConditionsConstants } from '../../shared/terms-and-conditions/constants';
import { ISubscription } from 'rxjs/Subscription';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
   selector: 'app-nedbank-id',
   templateUrl: './nedbank-id.component.html',
   styleUrls: ['./nedbank-id.component.scss']
})
export class NedbankIdComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
   @ViewChild('nedIdForm') registerForm: NgForm;
   @ViewChild('inputPassword') elPassword: ElementRef;
   @ViewChild('inputVerifyPassword') elVerifyPassword: ElementRef;
   @ViewChild('togglerPassword') togglerPassword: ElementRef;
   @ViewChild('togglerVerifyPassword') togglerVerifyPassword: ElementRef;
   @Output() isComponentValid = new EventEmitter<boolean>();
   isValid: boolean;
   showLoader: boolean;
   showPasswordMeter: boolean;
   showPasswordVerify: boolean;
   isPasswordMatch: boolean;
   isPasswordValid: boolean;
   patterns = Constants.patterns;
   messages = ConstantsRegister.messages;
   vm: INedbankIdVm;
   serviceError: string;
   errorLinkText: string;
   alertAction: string;
   alertType: string;
   bsModalRef: BsModalRef;
   sectionTitle: string;
   buttonText: string;
   modalSubscription: ISubscription;
   isComponentActive: boolean;
   subscription: Subscription;
   isPasswordView = true;
   isPasswordVerifyView = true;
   getPasswordField = CommonUtility.getPasswordField.bind(this);

   constructor(
      private router: Router,
      private modalService: BsModalService,
      private service: RegisterService,
      private termsService: TermsService,
      private enrolmentService: EnrolmentService,
      injector: Injector) {
         super(injector);
      }

   ngOnInit() {
      this.vm = { username: '', password: '', verifyPassword: '' };
      this.isPasswordValid = true;
      this.isPasswordMatch = false;
      this.isComponentActive = true;
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
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
         if (this.isPasswordView === false) {
            this.sendEvent(
               ConstantsRegister.gaEvents.passwordIconNedbankId.eventAction,
               ConstantsRegister.gaEvents.passwordIconNedbankId.label,
               null,
               ConstantsRegister.gaEvents.passwordIconNedbankId.category);
         }
      });
      const textboxVerifyPassword = __this.elVerifyPassword.nativeElement;
      const togglerVerifyPassword = __this.togglerVerifyPassword.nativeElement;
      const togglerVerifyPasswordIcon = togglerVerifyPassword.childNodes[0];

      togglerVerifyPassword.addEventListener('click', e => {
         this.isPasswordVerifyView = (textboxVerifyPassword.type === 'text');
         if (this.isPasswordVerifyView === false) {
            this.sendEvent(
               ConstantsRegister.gaEvents.passwordIconNedbankId.eventAction,
               ConstantsRegister.gaEvents.passwordIconNedbankId.label,
               null,
               ConstantsRegister.gaEvents.passwordIconNedbankId.category);
         }
      });
   }

   onInputChanged(event) {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
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
               this.service.SetActiveView(View.ForgotPwdCreatepwdComplete, View.ForgotPwdResetoptions);
               break;
            }
            case AlertActionType.Help: {
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
         this.checkUsernameAvailable();
      }
   }

   ApproveUser() {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
      this.showLoader = true;

      this.service
         .Approve(this.service.temporaryId, 0, 0)
         /* istanbul ignore next */
         .takeWhile(() => this.isComponentActive === true)
         .finally(() => {
            this.showLoader = false;
         })
         .subscribe(
         response => {

            if (response.MetaData.ResultCode === ConstantsRegister.errorCode.r00) {
               this.service.verificationId =
                  response.Data.ApproveITInfo.ApproveITVerificationID;
               this.bsModalRef = this.modalService.show(
                  ApproveItComponent,
                  Object.assign(
                     {},
                     {
                        animated: true,
                        keyboard: false,
                        backdrop: true,
                        ignoreBackdropClick: true
                     },
                     { class: '' }
                  )
               );
               this.modalService.onHidden.asObservable()
                  .takeWhile(() => this.isComponentActive === true)
                  .subscribe(() => {
                     if (this.onServiceResultSuccess(this.service.serviceResponse) && this.service.approveItSucess) {
                        this.service.userDetails.nedbankIdUserName = this.vm.username;
                        this.service.userDetails.nedbankIdPassword = this.vm.password;
                        this.sendEvent(
                           ConstantsRegister.gaEvents.createdNedbankIdUser.eventAction,
                           ConstantsRegister.gaEvents.createdNedbankIdUser.label,
                           null,
                           ConstantsRegister.gaEvents.createdNedbankIdUser.category);
                           this.sendEvent(
                              ConstantsRegister.gaEvents.createdPassword.eventAction,
                              ConstantsRegister.gaEvents.createdPassword.label,
                              null,
                              ConstantsRegister.gaEvents.createdPassword.category);
                        this.onAutoLogin();
                     }
                  });
            } else {
               this.setErrorMessage(ConstantsRegister.errorMessages.systemError);
            }
         },
         (error: number) => {
            this.showLoader = false;
         }
         );
   }

   onAutoLogin() {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
      this.showLoader = true;
      this.subscription = this.enrolmentService.serviceResponse
         /* istanbul ignore next */
         .takeWhile(() => this.isComponentActive === true)
         .subscribe(response => {
            this.showLoader = false;

            if (response && response.result && response.result === ServiceResultType.FederationInProgress) {
               this.service.SetActiveView(View.NedIdCreate, View.NedIdDelayed);
            } else {
               if (this.onServiceResultSuccess(response)) {
                  this.service.makeFormDirty(false);
                  this.router.navigate(['/']);
               }
            }
         },
         (error) => {
            this.showLoader = false;
         }
         );
      this.enrolmentService.onAutoLogin(true);
   }

   onServiceResultSuccess(response: any) {
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
            case ServiceResultType.NedIdExistOrFederated: {
               this.setErrorMessage(ConstantsRegister.errorMessages.NedIDUserNameExists);
               break;
            }
            case ServiceResultType.SecretPolicyViolation: {
               this.sendEvent(
                  ConstantsRegister.gaEvents.passwordViolation.eventAction,
                  ConstantsRegister.gaEvents.passwordViolation.label,
                  null,
                  ConstantsRegister.gaEvents.passwordViolation.category);
               this.setErrorMessage(ConstantsRegister.errorMessages.resetPWSecretPolicyViolation);
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

   UpdateUser() {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });

      if (this.service.temporaryId > 0) {
         this.CallUpdateUser();
      } else {
         this.showLoader = false;
         this.setErrorMessage(ConstantsRegister.errorMessages.systemError);
      }
   }

   CallUpdateUser() {
      this.showLoader = true;

      this.service
         .UpdateUser(this.vm.username, this.vm.password, this.service.temporaryId)
         /* istanbul ignore next */
         .takeWhile(() => this.isComponentActive === true)
         .subscribe(
         response => {
            if (this.onServiceResultSuccess(response)) {
               this.ApproveUser();
            } else {
               this.showLoader = false;
            }
         },
         (error: number) => {
            this.showLoader = false;
         }
         );
   }

   checkUsernameAvailable() {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
      this.showLoader = true;

      this.service.checkUsernameAvailable(this.vm.username)
         /* istanbul ignore next */
         .takeWhile(() => this.isComponentActive === true)
         .subscribe(response => {

            if (response.MetaData.ResultCode === ConstantsRegister.errorCode.r00) {
               this.UpdateUser();
            } else {
               this.showLoader = false;
               this.setErrorMessage(ConstantsRegister.errorMessages.NedIDUserNameExists);
            }
         },
         (error: number) => {
            this.showLoader = false;
         }
         );
   }

   onPasswordVerified(validPasswordValue: boolean) {
      this.isPasswordValid = validPasswordValue;
      this.validate();
   }

   onPasswordVerify(event) {
      if (this.vm.password && this.vm.verifyPassword) {
         this.isPasswordMatch = this.vm.password === this.vm.verifyPassword;
      } else {
         this.isPasswordMatch = false;
      }
   }

   validate() {
      this.isValid =
         this.vm.username &&
            this.vm.password &&
            this.vm.verifyPassword &&
            this.isPasswordMatch &&
            this.isPasswordValid
            ? this.registerForm.valid
            : false;

      this.isComponentValid.emit(this.isValid);
   }
}

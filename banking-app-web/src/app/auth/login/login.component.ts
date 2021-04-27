import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, EventEmitter, Output, ViewChild, Injector } from '@angular/core';
import { Route, Router } from '@angular/router';
import { HttpParameterCodec } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { saveAs } from 'file-saver/FileSaver';
import * as jwt_decode from 'jwt-decode';
import { BaseComponent } from '../../core/components/base/base.component';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { AuthService } from '../auth.service';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Constants } from '../../core/utils/constants';
import { ValidateInputDirective } from './../../shared/directives/validations/validateInput.directive';
import { IUser, ITermsAndConditions, INedbankUser, IRefreshAccountsApiResult } from '../../core/services/models';
import { environment } from '../../../environments/environment';
import { AuthConstants } from '../utils/constants';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { TermsAndConditionsConstants } from '../../shared/terms-and-conditions/constants';
import { TokenManagementService } from '../../core/services/token-management.service';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { RegisterService, ApprovalType } from '../../register/register.service';
import { CommonUtility } from '../../core/utils/common';
import { ApiService } from '../../core/services/api.service';

@Component({
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss']
})

export class LoginComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
   @ViewChild('loginForm') loginForm;
   @ViewChild('input') el: ElementRef;
   @ViewChild('toggler') toggler: ElementRef;
   @ViewChild('downloadMoneyAppClick') downloadMoneyAppClick: ElementRef;
   @ViewChild('needSomeAssistanceClick') needSomeAssistanceClick: ElementRef;
   @ViewChild('tandcAboveLogonClick') tandcAboveLogonClick: ElementRef;
   @Input() placeholder: string;
   @Output() isComponentValid = new EventEmitter();

   showPPPEnrolment = environment.features.pppEnrolment;
   showForgotDetails = environment.features.forgotDetails;
   isFormValid: any;
   nedIdFederated: boolean;
   validCredentials: boolean;
   showLoader: boolean;
   saluteFailure: boolean;
   loginError: string;
   errorLinkText: string;
   alertAction: string;
   alertType: string;
   errorCount: number;
   messages: any = AuthConstants.messages;
   links: any = AuthConstants.links;
   images: any = AuthConstants.images;
   user: IUser = {};
   bsModalRef: BsModalRef;
   terms: ITermsAndConditions[] = [];
   termsAndConditionsPath = TermsAndConditionsConstants.TermsGeneralHtml;
   isComponentActive = true;
   isPasswordView = true;
   getPasswordField = CommonUtility.getPasswordField.bind(this);
   showAccessibilitySuccess = false;
   constructor(private auth: AuthService,
      private authGuard: AuthGuardService,
      private router: Router,
      private termsService: TermsService,
      private modalService: BsModalService,
      private clientProfileDetailsService: ClientProfileDetailsService,
      private tokenManagementService: TokenManagementService,
      private enrolmentService: EnrolmentService,
      private registerService: RegisterService,
      private apiService: ApiService,
      injector: Injector) {
         super(injector);
      }

   ngOnInit() {
      this.validCredentials = true;
      this.nedIdFederated = true;
      this.showLoader = false;
      this.saluteFailure = false;
      this.errorCount = 0;
      this.user = { username: '', password: '', token: '' };
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
      this.enrolmentService.setForgotDetailsFlow(false);
      this.enrolmentService.nedIdFederated = true;
      this.enrolmentService.termsShown = false;

      this.registerService.ResetVariables();
      this.onSalute(false);
   }

   ngOnDestroy() {
      this.isComponentActive = false;
      this.loginError = '';
   }

   ngAfterViewInit() {
      this.loginForm.valueChanges
         .takeWhile(() => this.isComponentActive === true)
         .subscribe(values => this.validate());

      const __this = this;
      const textbox = __this.el.nativeElement;
      const toggler = __this.toggler.nativeElement;
      const togglerIcon = toggler.childNodes[0];

      toggler.addEventListener('click', (e) => {
         this.isPasswordView = (textbox.type === 'text');
      });

      const downloadMoneyAppClick = __this.downloadMoneyAppClick.nativeElement;
      downloadMoneyAppClick.addEventListener('click', (e) => {
         this.sendEvent(
            AuthConstants.gaEvents.downloadMoney.eventAction,
            AuthConstants.gaEvents.downloadMoney.label,
            null,
            AuthConstants.gaEvents.downloadMoney.category);
      });

      const needSomeAssistanceClick = __this.needSomeAssistanceClick.nativeElement;
      needSomeAssistanceClick.addEventListener('click', (e) => {
         this.sendEvent(
            AuthConstants.gaEvents.needAssistance.eventAction,
            AuthConstants.gaEvents.needAssistance.label,
            null,
            AuthConstants.gaEvents.needAssistance.category);
      });

      const tandcAboveLogonClick = __this.tandcAboveLogonClick.nativeElement;
      tandcAboveLogonClick.addEventListener('click', (e) => {
         this.sendEvent(
            AuthConstants.gaEvents.clickedTandCs.eventAction,
            AuthConstants.gaEvents.clickedTandCs.label,
            null,
            AuthConstants.gaEvents.clickedTandCs.category);
      });

   }

   setErrorMessage(errorMessage) {
      this.showLoader = false;
      this.loginError = errorMessage.message ? errorMessage.message : '';
      this.errorLinkText = errorMessage.linkText ? errorMessage.linkText : '';
      this.alertAction = errorMessage.alertAction;
      this.alertType = errorMessage.alertType;
   }

   validate() {
      this.validCredentials = true;  // Credentials are valid until validated
      this.isFormValid = this.user && this.user.username && this.user.password ? this.loginForm.valid : false;
      if (this.isFormValid) {
         this.sendEvent(
            AuthConstants.gaEvents.enterNedIdAndPassword.eventAction,
            AuthConstants.gaEvents.enterNedIdAndPassword.label,
            null,
            AuthConstants.gaEvents.enterNedIdAndPassword.category);
      }
      this.isComponentValid.emit(this.isFormValid);
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
               if (this.saluteFailure) {
                  this.onSalute(false);
               } else {
                  this.onLogon(null);
               }
               break;
            }
            case AlertActionType.ForgotDetails: {
               this.navigateForgotDetails();
               break;
            }
            case AlertActionType.Help: {
               this.navigateForgotDetails();
               break;
            }
            default: {
               break;
            }
         }
      }
   }

   onSalute(navigateToPPP: boolean) {
      this.saluteFailure = false;
      this.tokenManagementService.removeAuthToken();
      this.tokenManagementService.removeNedbankIdAnonymousToken();
      this.auth.getNedbankIdAnonymousToken().subscribe(response => {
         if (response && response.MetaData && response.MetaData.ResultCode === '0') {
            this.tokenManagementService.setNedbankIdAnonymousToken(response.Data.TokenValue);

            if (navigateToPPP) {
               this.router.navigate(['/register']);
            }
         } else {
            this.saluteFailure = true;
            this.setErrorMessage(AuthConstants.errorMessages.systemError);
         }
      },
         error => {
            this.saluteFailure = true;
         });
   }

   onLogon(event: any): void {
      this.sendEvent(
         AuthConstants.gaEvents.clickLogonButton.eventAction,
         AuthConstants.gaEvents.clickLogonButton.label,
         null,
         AuthConstants.gaEvents.clickLogonButton.category);
      if (this.isFormValid) {
         CommonUtility.markFormControlsTouched(this.loginForm);
         this.validCredentials = false;
         this.setErrorMessage({
            message: '',
            errorLinkText: '',
            alertAction: AlertActionType.None,
            alertType: AlertMessageType.Error
         });
         this.loginError = '';

         if (this.saluteFailure) {
            this.onSalute(false);
         } else {
            this.showLoader = true;

            if (event != null) {
               event.preventDefault();
               event.stopPropagation();
            }

            localStorage.removeItem(AuthConstants.staticNames.loggedOnUser);

            this.user.appliesTo = environment.audience;
            this.user.secretType = AuthConstants.secretTypes.password;
            this.auth.logon(this.user)
               .takeWhile(() => this.isComponentActive === true)
               .subscribe(response => {
                  if (response && response.MetaData) {

                     const resultType: ServiceResultType =
                        this.enrolmentService.getServiceResultType(response.MetaData.ResultCode);

                     switch (resultType) {
                        case ServiceResultType.Success: {
                           this.validCredentials = true;
                           this.loginSuccess(response);
                           break;
                        }
                        case ServiceResultType.DataValidationError: {
                           this.setErrorMessage(AuthConstants.errorMessages.invalidDetails);
                           break;
                        }
                        case ServiceResultType.IncorrectCredentials: {
                           this.errorCount++;
                           const remainingErrorCount =
                              AuthConstants.constantValues.maxNumberOfLoginTries - this.errorCount;
                           let mesg: any;

                           if (remainingErrorCount <= 0) {
                              mesg = AuthConstants.errorMessages.loginDetailsDontMatchResolve;
                           } else {
                              if (remainingErrorCount >= (AuthConstants.constantValues.maxNumberOfLoginTries - 1)) {
                                 mesg = AuthConstants.errorMessages.loginDetailsDontMatch;
                              } else {
                                 const errMsg = AuthConstants.errorMessages.loginDetailsDontMatchRetry.message +
                                    ` You have ` + remainingErrorCount.toString() +
                                    (remainingErrorCount === 1 ? ` attempt` : 'attempts') + ' left.';
                                 mesg = {
                                    message: errMsg,
                                    linkText: AuthConstants.errorMessages.
                                       loginDetailsDontMatchRetry.linkText,
                                    alertAction: AuthConstants.errorMessages.
                                       loginDetailsDontMatchRetry.alertAction,
                                    alertType: AuthConstants.errorMessages.
                                       loginDetailsDontMatchRetry.alertType
                                 };
                              }
                           }

                           this.setErrorMessage(mesg);
                           break;
                        }
                        case ServiceResultType.IdentityLocked: {
                           this.setErrorMessage(AuthConstants.errorMessages.loginDetailsDontMatchResolve);
                           break;
                        }
                        case ServiceResultType.IdentitySuspended: {
                           this.router.navigate(['/auth/profileBlocked']);
                           break;
                        }
                        case ServiceResultType.UnknownUser: {
                           this.setErrorMessage(AuthConstants.errorMessages.loginInvalidUsername);
                           break;
                        }
                        case ServiceResultType.DuplicateIdentity: {
                           this.setErrorMessage(AuthConstants.errorMessages.duplicateIdentity);
                           break;
                        }
                        case ServiceResultType.InvalidCustomerDetails: {
                           this.setErrorMessage(AuthConstants.errorMessages.invalidCustomerDetails);
                           break;
                        }
                        default: {
                           this.setErrorMessage(AuthConstants.errorMessages.systemError);
                           break;
                        }
                     }
                  } else {
                     this.setErrorMessage(AuthConstants.errorMessages.systemError);
                  }
               },
               error => {
                  this.showLoader = false;
                  this.setErrorMessage(AuthConstants.errorMessages.systemError);
               });
         }
      }
   }

   loginSuccess(response) {
      const token = response.Data.TokenValue;

      this.tokenManagementService.setAuthToken(token);

      const nedbankUser: INedbankUser = { uniqueuserid: 0, partnerid: 20 };
      nedbankUser.uniqueuserid = this.enrolmentService.getNedbankUserId(token);
      this.registerService.retrieveAlias(nedbankUser)
         .take(1)
         .subscribe(aliasResponse => {
            if (aliasResponse && aliasResponse.MetaData && aliasResponse.MetaData.ResultCode === 'R00') {
               if (aliasResponse.Data && aliasResponse.Data.length > 0) {
                  this.navigateToTerms();
               } else {
                  // User not federated
                  this.tokenManagementService.setUnfederatedToken(response.Data.TokenValue);
                  this.showLoader = false;
                  this.registerService.approvalType = ApprovalType.FederateUser;
                  this.registerService.userDetails.nedbankIdUserName = this.user.username;
                  this.registerService.userDetails.nedbankIdPassword = this.user.password;
                  this.nedIdFederated = false;
               }
            } else {
               this.setErrorMessage(AuthConstants.errorMessages.systemError);
            }
         },
         error => {
            this.showLoader = false;
         });
   }

   downloadTerms(): void {
      this.termsService.downloadPDF()
         .takeWhile(() => this.isComponentActive === true)
         .subscribe(res => {
            saveAs(res, Constants.fileNames.termsAndConditions);
         });
   }

   scrollToLink(location: string): void {
      try {
         const selectedElement = document.querySelector(location);
         if (selectedElement) {
            selectedElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
         }
      } catch (err) { }
   }

   setUserDetailsObserver() {
      this.clientProfileDetailsService.getClientDetail();
   }

   navigateRegister() {
      this.sendEvent(
         AuthConstants.gaEvents.registerUsingPPP.eventAction,
         AuthConstants.gaEvents.registerUsingPPP.label,
         null,
         AuthConstants.gaEvents.registerUsingPPP.category);
      if (this.saluteFailure) {
         this.onSalute(true);
      } else {
         this.router.navigate(['/register']);
      }
   }

   navigateForgotDetails() {
      this.sendEvent(
         AuthConstants.gaEvents.selectForgotDetails.eventAction,
         AuthConstants.gaEvents.selectForgotDetails.label,
         null,
         AuthConstants.gaEvents.selectForgotDetails.category);
      this.enrolmentService.setForgotDetailsFlow(true);
      this.navigateRegister();
   }

   navigateToTerms() {
      this.showAccessibilitySuccess = false;
      this.registerService.userDetails.nedbankIdUserName = this.user.username;
      this.enrolmentService.ShowTerms()
         .subscribe(Response => {
            this.showAccessibilitySuccess = true;
            this.setErrorMessage(AuthConstants.errorMessages.loginSuccess);
            this.showLoader = true;
         },
         (error) => {
            this.showAccessibilitySuccess = false;
            this.showLoader = false;
         });
   }
}

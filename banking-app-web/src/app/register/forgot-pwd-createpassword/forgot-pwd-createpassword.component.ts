import { CommonUtility } from './../../core/utils/common';
import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, AfterViewInit, Output, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { RegisterService, ApprovalType } from '../../register/register.service';
import { AuthConstants } from '../../auth/utils/constants';

import { ConstantsRegister } from '../utils/constants';
import { View } from '../utils/enums';
import { Constants } from '../..//core/utils/constants';
import { INedbankIdVm } from '../../register/register.models';
import { ApproveItComponent } from '../../register/approve-it/approve-it.component';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { IPasswordRecoveryDetails } from '../register.models';

@Component({
    selector: 'app-nedbankid-forgotpwd-createpwd',
    templateUrl: './forgot-pwd-createpassword.component.html',
    styleUrls: ['./forgot-pwd-createpassword.component.scss']
})

export class NedbankIdForgotPwdCreatePwdComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('createPasswordForm') createPasswordForm: NgForm;
    @ViewChild('inputPassword') elPassword: ElementRef;
    @ViewChild('inputVerifyPassword') elVerifyPassword: ElementRef;
    @ViewChild('togglerPassword') togglerPassword: ElementRef;
    @ViewChild('togglerVerifyPassword') togglerVerifyPassword: ElementRef;
    @Output() isComponentValid = new EventEmitter<boolean>();

    vm: INedbankIdVm;
    messages = ConstantsRegister.messages;
    isValid: boolean;
    showLoader: boolean;
    showPasswordMeter: boolean;
    showPasswordVerify: boolean;
    isPasswordMatch: boolean;
    isPasswordValid: boolean;
    serviceError: string;
    errorLinkText: string;
    alertAction: string;
    alertType: string;
    bsModalRef: BsModalRef;
    isComponentActive: boolean;
    isPasswordView = true;
    isVerifyPasswordView = true;
    getPasswordField = CommonUtility.getPasswordField.bind(this);
    constructor(private router: Router,
        private service: RegisterService,
        private modalService: BsModalService,
        private enrolmentService: EnrolmentService) {
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
    }

    ngAfterViewInit() {
        this.createPasswordForm.valueChanges
            .takeWhile(() => this.isComponentActive === true)
            .subscribe(values => this.validate());

        const __this = this;
        const textboxPassword = __this.elPassword.nativeElement;
        const togglerPassword = __this.togglerPassword.nativeElement;
        const togglerIcon = togglerPassword.childNodes[0];

        togglerPassword.addEventListener('click', e => {
            this.isPasswordView = (textboxPassword.type === 'text');
        });

        const textboxVerifyPassword = __this.elVerifyPassword.nativeElement;
        const togglerVerifyPassword = __this.togglerVerifyPassword.nativeElement;
        const togglerVerifyPasswordIcon = togglerVerifyPassword.childNodes[0];

        togglerVerifyPassword.addEventListener('click', e => {
            this.isVerifyPasswordView = (textboxVerifyPassword.type === 'text');
        });
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
                case AlertActionType.TryAgain: {
                    this.service.SetActiveView(View.ForgotPwdResetoptions, View.ForgotPwdGetusername);
                    break;
                }
                case AlertActionType.ResendDetails: {
                    this.service.SetActiveView(View.ForgotPwdResetoptions, View.ForgotPwdGetidentity);
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
            this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
            this.showLoader = true;

            this.service.userDetails.nedbankIdPassword = this.vm.password;

            const passwordRecoveryDetails: IPasswordRecoveryDetails = {
                MobileNumber: '', UserName: this.service.userDetails.nedbankIdUserName,
                Password: this.service.userDetails.nedbankIdPassword,
                ApproveItInfo: { ApproveITMethod: 'USSD', ApproveITVerificationID: 0, OTP: 0 }
            };

            // this.enrolmentService.recoverPassword(this.service.passwordRecoveryDetails)
            this.service.recoverPassword(passwordRecoveryDetails)
                .takeWhile(() => this.isComponentActive === true)
                .finally(() => {
                    this.showLoader = false;
                })
                .subscribe(response => {
                    if (this.onServiceResultSuccess(response)) {
                        this.service.verificationId = response.Data.ApproveITInfo.ApproveITVerificationID;
                        this.service.approvalType = ApprovalType.RecoverPassword;
                        this.service.userDetails.mobileNumber = response.Data.MobileNumber;
                        this.service.userDetails = this.service.userDetails;
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
                                if (this.onServiceResultSuccess(this.service.serviceResponse)) {
                                    this.service.SetActiveView(View.ForgotPwdCreatepwd, View.ForgotPwdCreatepwdComplete);
                                }
                            });
                    }
                },
                error => {
                    this.showLoader = false;
                });
        }
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
                    this.setErrorMessage(ConstantsRegister.errorMessages.resetPWInvalidUsername);
                    break;
                }
                case ServiceResultType.UnknownUser: {
                    this.setErrorMessage(ConstantsRegister.errorMessages.resetPWInvalidUsername);
                    break;
                }
                case ServiceResultType.IdentityLocked: {
                    this.setErrorMessage(ConstantsRegister.errorMessages.resetPWUserLocked);
                    break;
                }
                case ServiceResultType.SecretPolicyViolation: {
                    this.setErrorMessage(ConstantsRegister.errorMessages.resetPWSecretPolicyViolation);
                    break;
                }
                case ServiceResultType.IdentitySuspended: {
                  this.service.makeFormDirty(false);
                  this.router.navigate(['/auth/profileBlocked']);
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
                case ServiceResultType.InvalidFeature: {
                  this.setErrorMessage(ConstantsRegister.errorMessages.invalidFeature);
                  break;
               }
                default: {
                    this.setErrorMessage(ConstantsRegister.errorMessages.resetPWSystemError);
                    break;
                }
            }
        } else {
            this.setErrorMessage(ConstantsRegister.errorMessages.resetPWSystemError);
        }
        return successResult;
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
            this.vm.password &&
                this.vm.verifyPassword &&
                this.isPasswordMatch &&
                this.isPasswordValid
                ? this.createPasswordForm.valid
                : false;

        this.isComponentValid.emit(this.isValid);
    }
}

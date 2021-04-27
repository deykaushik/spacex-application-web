import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, AfterViewInit, Output, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ConstantsRegister } from '../utils/constants';
import { Constants } from '../../core/utils/constants';
import { INedbankIdVm } from '../../register/register.models';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { RegisterService } from '../../register/register.service';
import { ApproveItComponent } from '../../register/approve-it/approve-it.component';
import { IUserRecoveryDetails } from '../../core/services/auth-models';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';

@Component({
    selector: 'app-nedbankid-forgotpwd-getusername',
    templateUrl: './forgot-pwd-get-username.component.html',
    styleUrls: ['./forgot-pwd-get-username.component.scss']
})

export class NedbankIdForgotPwdGetUsernameComponent implements OnInit, OnDestroy {
    @ViewChild('getUsernameForm') getUsernameForm: NgForm;
    vm: INedbankIdVm;
    isValid: boolean;
    serviceError: string;
    errorLinkText: string;
    alertAction: string;
    alertType: string;
    patterns = Constants.patterns;
    showLoader: boolean;
    messages: ConstantsRegister;
    isComponentActive = true;

    constructor(private router: Router,
        private registerService: RegisterService, private enrolmentService: EnrolmentService) {
    }

    ngOnInit() {
        this.vm = { username: '', password: '', verifyPassword: '' };
        this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
    }

    ngOnDestroy() {
        this.isComponentActive = false;
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
                case AlertActionType.TryAgain: {
                    this.checkUsernameAvailable();
                    break;
                }
                case AlertActionType.ResendDetails: {
                    this.registerService.SetActiveView(View.ForgotPwdGetusername, View.ForgotPwdGetidentity);
                    break;
                }
                case AlertActionType.ForgotDetails: {
                    this.registerService.SetActiveView(View.ForgotPwdGetusername, View.ForgotPwdResetoptions);
                    break;
                }
                case AlertActionType.Help: {
                    this.registerService.SetActiveView(View.ForgotPwdGetusername, View.NedIdHelp);
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

    onInputChanged(event) {
        this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
        this.validate();
    }

    validate() {
        this.isValid = this.vm.username && this.vm.username.length >= 7;
        this.registerService.makeFormDirty(this.getUsernameForm.dirty);
    }

    checkUsernameAvailable() {
        this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
        this.showLoader = true;

        this.registerService.checkUsernameAvailable(this.vm.username)
            .takeWhile(() => this.isComponentActive === true)
            .subscribe(
                response => {
                    this.showLoader = false;

                    if (response.MetaData.ResultCode === ConstantsRegister.errorCode.r00) {
                        // No error returned, so username is NOT in use, which means it doesn't exist
                        this.setErrorMessage(ConstantsRegister.errorMessages.resetPWUserInvalid);
                    } else {
                        this.showLoader = false;
                        this.registerService.userDetails.nedbankIdUserName = this.vm.username;
                        this.registerService.SetActiveView(View.ForgotPwdGetusername, View.ForgotPwdCreatepwd);
                    }
                },
                (error: number) => {
                    this.showLoader = false;
                }
            );
    }
}

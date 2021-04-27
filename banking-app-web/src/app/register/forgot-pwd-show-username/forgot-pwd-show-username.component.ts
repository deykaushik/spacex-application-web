import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { RegisterService } from '../register.service';
import { EnrolmentService } from '../../core/services/enrolment.service';

import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { Constants } from '../../core/utils/constants';
import { ConstantsRegister } from '../utils/constants';

@Component({
  selector: 'app-nedbankid-forgotpwd-showusername',
  templateUrl: './forgot-pwd-show-username.component.html',
  styleUrls: ['./forgot-pwd-show-username.component.scss']
})
export class NedbankIdForgotPwdShowUsernameComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private service: EnrolmentService, private registerService: RegisterService) { }
  @Output() isComponentValid = new EventEmitter<boolean>();
  @ViewChild('showUsernameForm') showUsernameForm;
  hasUserName: boolean;
  userName: string;
  displayNumber: string;
  isValid: boolean;
  serviceError: string;
  errorLinkText: string;
  alertAction: string;
  alertType: string;
  patterns = Constants.patterns;
  showLoader: boolean;
  showLoaderLogin: boolean;
  messages: ConstantsRegister;
  isComponentActive = true;

  ngOnInit() {
    this.userName = this.registerService.userDetails.nedbankIdUserName;
    this.displayNumber = this.registerService.userDetails.mobileNumber;
    this.hasUserName = this.userName ? true : false;
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
          this.registerService.SetActiveView(View.ForgotPwdShowUsername, View.ForgotPwdGetidentity);
          break;
        }
        case AlertActionType.ResendDetails: {
          this.registerService.SetActiveView(View.ForgotPwdShowUsername, View.ForgotPwdGetidentity);
          break;
        }
        case AlertActionType.ForgotDetails: {
          this.registerService.SetActiveView(View.ForgotPwdShowUsername, View.ForgotPwdResetoptions);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  onInputChanged(event) {
    this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
    this.validate();
  }

  validate() {
    this.isValid = this.userName ? this.showUsernameForm.valid : false;
    this.isComponentValid.emit(this.isValid);
  }

  checkUsernameAvailable(toLogin: boolean) {
    this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });

    this.registerService.checkUsernameAvailable(this.userName)
      .takeWhile(() => this.isComponentActive === true)
      .subscribe(
      response => {
        this.showLoaderLogin = false;
        this.showLoader = false;

        if (response.MetaData.ResultCode === ConstantsRegister.errorCode.r00) {
          // No error returned, so username is NOT in use, which means it doesn't exist
          this.setErrorMessage(ConstantsRegister.errorMessages.resetPWUserInvalid);
        } else {
          this.registerService.userDetails.nedbankIdUserName = this.userName;
          if (toLogin) {
            this.registerService.SetActiveView(View.ForgotPwdShowUsername, View.NedIdLogin);
          } else {
            this.registerService.SetActiveView(View.ForgotPwdShowUsername, View.ForgotPwdCreatepwd);
          }
        }
      },
      (error: number) => {
        this.showLoaderLogin = false;
        this.showLoader = false;
      }
      );
  }

  navigateResetPassword(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.isValid) {
      this.showLoader = true;
      this.checkUsernameAvailable(false);
    }
  }

  navigateLogon(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.isValid) {
      this.showLoaderLogin = true;
      this.checkUsernameAvailable(true);
    }
  }
}

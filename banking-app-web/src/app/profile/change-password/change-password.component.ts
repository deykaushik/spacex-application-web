import { CommonUtility } from './../../core/utils/common';
import { Constants } from './../../core/utils/constants';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Injector } from '@angular/core';
import { RegisterService } from '../../register/register.service';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { IChangePassword } from '../../core/services/auth-models';
import { ConstantsRegister } from '../../register/utils/constants';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('changePasswordForm') changePasswordForm;
  @ViewChild('inputOldPassword') elOldPassword: ElementRef;
  @ViewChild('inputPassword') elPassword: ElementRef;
  @ViewChild('inputVerifyPassword') elVerifyPassword: ElementRef;
  @ViewChild('togglerOldPassword') togglerOldPassword: ElementRef;
  @ViewChild('togglerPassword') togglerPassword: ElementRef;
  @ViewChild('togglerVerifyPassword') togglerVerifyPassword: ElementRef;

  isValid: boolean;
  showLoader: boolean;
  showPasswordMeter: boolean;
  showPasswordVerify: boolean;
  isPasswordMatch: boolean;
  isPasswordValid: boolean;
  patterns = Constants.patterns;
  messages = ConstantsRegister.messages;
  changePasswordDetails: IChangePassword;
  confirmNewPassword = '';
  isSuccess: boolean;
  isFailure: boolean;
  profileMenu = Constants.labels.headerMenuLables.profile;
  isOldPasswordView = true;
  isPasswordView = true;
  isVerifyPasswordView = true;
  getPasswordField = CommonUtility.getPasswordField.bind(this);
  constructor(private enrolmentService: EnrolmentService,
              private registerService: RegisterService,
              private headerMenuService: HeaderMenuService, injector: Injector) {
                super(injector);
             }

  ngOnInit() {
    this.changePasswordDetails = { Username: '', OldPassword: '', NewPassword: '' };
    this.changePasswordDetails.Username = this.registerService.userDetails.nedbankIdUserName;
    this.isSuccess = false;
    this.isFailure = false;
    this.showLoader = false;
  }

  ngAfterViewInit() {
    this.changePasswordForm.valueChanges.subscribe(values => this.validate());

    const __this = this;

    const textboxOldPassword = __this.elOldPassword.nativeElement;
    const togglerOldPassword = __this.togglerOldPassword.nativeElement;
    const togglerOldPasswordIcon = togglerOldPassword.childNodes[0];

    togglerOldPassword.addEventListener('click', e => {
      this.isOldPasswordView = (textboxOldPassword.type === 'text');
    });
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

  changePassword(event) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.isValid) {
      this.showLoader = true;
      this.registerService.changePassword(this.changePasswordDetails)
        .finally(() => {
          this.showLoader = false;
        })
        .subscribe(response => {
          if (response && response.MetaData && response.MetaData.ResultCode === 'R00') {
            this.isSuccess = true;
            this.isFailure = false;
          } else {
            this.isSuccess = false;
            this.isFailure = true;
          }
        },
        error => {
          this.isSuccess = false;
          this.isFailure = true;
        });
    }
  }

  onPasswordVerified(validPasswordValue: boolean) {
    this.isPasswordValid = validPasswordValue;
  }

  openProfileMenu(menuText: string) {
    this.headerMenuService.openHeaderMenu(menuText);
  }

  onPasswordVerify(event) {
    if (this.changePasswordDetails.NewPassword && this.confirmNewPassword) {
      this.isPasswordMatch = this.changePasswordDetails.NewPassword === this.confirmNewPassword;
    } else {
      this.isPasswordMatch = false;
    }
  }

  validate() {
    this.isValid =
      this.changePasswordDetails.OldPassword &&
        this.changePasswordDetails.NewPassword &&
        this.confirmNewPassword &&
        this.isPasswordMatch &&
        this.isPasswordValid
        ? this.changePasswordForm.valid
        : false;
  }

  public closeSuccessError() {
    this.isSuccess = false;
  }
  public closeFailureError() {
    this.isFailure = false;
  }

}

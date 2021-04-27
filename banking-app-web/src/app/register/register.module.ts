import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { SharedModule } from './../shared/shared.module';
import { RegisterRoutingModule } from './register-routing.module';
import { NedbankIdComponent } from './nedbank-id/nedbank-id.component';
import { ApproveItComponent } from './approve-it/approve-it.component';
import { ProfilePinPasswordComponent } from './profile-pin-password/profile-pin-password.component';
import { RegisterService } from './register.service';
import { NedbankIdStateComponent } from './nedbank-id-state/nedbank-id-state.component';
import { NedbankIdCompleteComponent } from './nedbank-id-complete/nedbank-id-complete.component';
import { LoggerService } from '../shared/logging/logger.service';
import { NedbankIdDelayedComponent } from './nedbank-id-delayed/nedbank-id-delayed.component';
import { RegisterLandingComponent } from './register-landing/register-landing.component';
import { NoDetailsComponent } from './no-details/no-details.component';
import { NedbankIdHelpComponent } from './nedbank-id-help/nedbank-id-help.component';
import { NedbankIdLoginComponent } from './nedbank-id-login/nedbank-id-login.component';
import { NedbankIdAlreadyExistComponent } from './nedbank-id-already-exist/nedbank-id-already-exist.component';
import { ValidateUsernameDirective } from './validations/ValidateUsername.directive';
import { NedbankIdForgotPwdResetOptionsComponent } from './forgot-pwd-reset-options/forgot-pwd-reset-options.component';
import { NedbankIdForgotPwdGetUsernameComponent } from './forgot-pwd-get-username/forgot-pwd-get-username.component';
import { NedbankIdForgotPwdGetIdentityComponent } from './forgot-pwd-get-identity/forgot-pwd-get-identity.component';
import { NedbankIdForgotPwdCreatePwdComponent } from './forgot-pwd-createpassword/forgot-pwd-createpassword.component';
// tslint:disable-next-line:import-spacing
import { NedbankIdForgotPwdCreatePwdCompleteComponent }
   from './forgot-pwd-createpassword-complete/forgot-pwd-createpassword-complete.component';
import { NedbankIdForgotPwdShowUsernameComponent } from './forgot-pwd-show-username/forgot-pwd-show-username.component';
import { NedbankIdNotFederatedComponent } from './nedbank-id-not-federated/nedbank-id-not-federated.component';

@NgModule({
   imports: [CommonModule, FormsModule, SharedModule, RegisterRoutingModule],
   declarations: [
      NedbankIdComponent,
      ProfilePinPasswordComponent,
      NedbankIdStateComponent,
      NedbankIdCompleteComponent,
      NedbankIdDelayedComponent,
      RegisterLandingComponent,
      NoDetailsComponent,
      NedbankIdHelpComponent,
      NedbankIdAlreadyExistComponent,
      NedbankIdLoginComponent,
      NedbankIdNotFederatedComponent,
      ValidateUsernameDirective,
      NedbankIdForgotPwdResetOptionsComponent,
      NedbankIdForgotPwdGetUsernameComponent,
      NedbankIdForgotPwdCreatePwdComponent,
      NedbankIdForgotPwdGetIdentityComponent,
      NedbankIdForgotPwdCreatePwdCompleteComponent,
      NedbankIdForgotPwdShowUsernameComponent
   ],
   entryComponents: [RegisterLandingComponent],
   providers: [BsModalService, BsModalRef, LoggerService],
   exports: []
})
export class RegisterModule { }

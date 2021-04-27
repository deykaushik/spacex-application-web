import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { SessionTimeoutService } from './session-timeout/session-timeout.service';
import { SharedModule } from './../shared/shared.module';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { TermsAndConditionsAuthComponent } from '../auth/terms-and-conditions/terms-and-conditions-auth.component';
import { TermsService } from '../shared/terms-and-conditions/terms.service';
import { RegisterService } from '../register/register.service';
import { LoggerService } from '../shared/logging/logger.service';
import { LogoffComponent } from './logoff/logoff.component';

import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ApproveItComponent } from '../register/approve-it/approve-it.component';

import { ProfileBlockedComponent } from './profile-blocked/profile-blocked.component';

@NgModule({
   imports: [
      CommonModule,
      AuthRoutingModule,
      SharedModule,
      NgIdleKeepaliveModule.forRoot()
   ],
   declarations: [LoginComponent,
      TermsAndConditionsAuthComponent,
      LogoffComponent,
      SessionTimeoutComponent,
      ProfileBlockedComponent
   ],
   providers: [AuthService,
      BsModalService,
      BsModalRef,
      LoggerService,
      TermsService,
      SessionTimeoutService,
      DatePipe],
   entryComponents: [TermsAndConditionsAuthComponent,
      SessionTimeoutComponent,
      ApproveItComponent]
})
export class AuthModule { }


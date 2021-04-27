import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './guards/auth-guard.service';
import { ApiService } from './services/api.service';
import { ApiAuthService } from './services/api.auth-service';
import { WindowRefService } from './services/window-ref.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SignalRModule } from 'ng2-signalr';
import { SignalRConfiguration } from 'ng2-signalr';

import { BeneficiaryService } from './services/beneficiary.service';
import { UnsavedChangesGuard } from './guards/unsaved-changes-guard.service';
import { SystemErrorService } from './services/system-services.service';
import { ClientProfileDetailsService } from './services/client-profile-details.service';
import { TokenManagementService } from './services/token-management.service';
import { GoBackGuard } from './guards/go-back-guard.service';
import { HeaderMenuService } from './services/header-menu.service';
import { PreFillService } from './services/preFill.service';
import { EnrolmentService } from './services/enrolment.service';
import { RefreshGuard } from './guards/refresh.guard';
import { AccountsService } from './services/accounts.service';
import { GaTrackingService } from './services/ga.service';

import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { TermsConditionGuard } from './guards/terms-condition.guard';
import { GADirective } from '../core/directives/ga.directive';
import { BaseComponent } from '../core/components/base/base.component';
import { RegisterService } from '../register/register.service';
import { FormsModule } from '@angular/forms';
import { CheckLoginGuard } from './guards/check-login.guard';
import { GreenbacksEnrolmentService } from './services/greenbacks-enrolment.service';
import { TokenRenewalService } from '../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { PreApprovedOffersService } from './services/pre-approved-offers.service';

@NgModule({
   imports: [
      CommonModule,
      HttpClientModule,
      RouterModule,
      FormsModule,
      BsDropdownModule.forRoot()
   ],
   declarations: [FooterComponent, LoaderComponent, GADirective],
   exports: [FooterComponent,
      HttpClientModule,
      BsDropdownModule, LoaderComponent, GADirective],
   providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
   },
      AuthInterceptorService,
      AuthGuardService,
      ApiService,
      ApiAuthService,
      WindowRefService,
      PreFillService,
      BeneficiaryService, UnsavedChangesGuard, SystemErrorService, GaTrackingService,
      ClientProfileDetailsService,
      TokenManagementService, GoBackGuard, HeaderMenuService,
      GreenbacksEnrolmentService,
      EnrolmentService,
      RegisterService,
      RefreshGuard,
      TermsConditionGuard,
      AccountsService, LoaderService, CheckLoginGuard,
      TokenRenewalService, PreApprovedOffersService]

})
export class CoreModule { }

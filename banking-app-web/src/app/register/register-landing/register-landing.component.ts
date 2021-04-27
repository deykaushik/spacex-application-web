import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { RegisterService, ApprovalType } from '../register.service';
import { View } from '../utils/enums';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { Router } from '@angular/router';
import { TokenManagementService } from '../../core/services/token-management.service';
import { Observable } from 'rxjs/Observable';
import { ComponentCanDeactivate } from '../../core/guards/unsaved-changes-guard.service';

@Component({
   selector: 'app-register-landing',
   templateUrl: './register-landing.component.html',
   styleUrls: ['./register-landing.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class RegisterLandingComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
   constructor(private registerService: RegisterService, private enrolmentService: EnrolmentService,
      private tokenManagementService: TokenManagementService, private router: Router) { }

   View: typeof View = View;
   service: RegisterService;
   ngOnInit() {
      this.service = this.registerService;
      const saluteToken = this.tokenManagementService.getNedbankIdAnonymousToken();
      if (!saluteToken) {
         this.router.navigate(['/auth']);
      }

      if (this.enrolmentService && this.enrolmentService.forgotDetailsFlow) {
         this.registerService.SetActiveView(View.ForgotPwdResetoptions, View.ForgotPwdResetoptions);
      } else {
         this.registerService.SetActiveView(View.RegisterLanding, View.ProfilePinPassword);
      }
   }
   canDeactivate(): Observable<boolean> | boolean {
      return !this.registerService.isFormDirty;
   }
   ngOnDestroy() {
      this.registerService.makeFormDirty(false);
   }
}

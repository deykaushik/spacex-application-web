import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { AuthConstants } from '../utils/constants';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { WindowRefService } from '../../core/services/window-ref.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { SessionTimeoutService } from '../session-timeout/session-timeout.service';

@Component({
   selector: 'app-logoff',
   templateUrl: './logoff.component.html',
   styleUrls: ['./logoff.component.scss']
})
export class LogoffComponent implements OnInit {

   constructor(private router: Router,
      private auth: AuthGuardService,
      private clientProfileDetailsService: ClientProfileDetailsService,
      private windowrefservice: WindowRefService,
      private SessionTimeoutService: SessionTimeoutService,
      private tokenManagementService: TokenManagementService) { }

   ngOnInit() {
      try {
         this.tokenManagementService.removeAuthToken();
         this.tokenManagementService.removeNedbankIdAnonymousToken();
         this.tokenManagementService.removeUnfederatedToken();
         this.auth.isAuthenticated.emit(false);
         this.SessionTimeoutService.stop();
         this.clientProfileDetailsService.clientDetailsObserver.next(null);
      } catch (e) {
         this.windowrefservice.nativeWindow.location.replace('/');
      }
      this.router.navigate(['../login']);
      this.windowrefservice.nativeWindow.setTimeout(() => {
         this.windowrefservice.nativeWindow.location.reload();
      }, 500);
   }
}

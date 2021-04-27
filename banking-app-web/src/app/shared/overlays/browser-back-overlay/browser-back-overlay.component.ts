import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, NavigationStart, Event as RouterEvent } from '@angular/router';

import { Constants } from './../../../core/utils/constants';
import { AuthConstants } from './../../../auth/utils/constants';
import { GoBackGuard } from './../../../core/guards/go-back-guard.service';
import { AuthGuardService } from '../../../core/guards/auth-guard.service';
import { RegisterService } from '../../../register/register.service';

@Component({
   selector: 'app-browser-back-overlay',
   templateUrl: './browser-back-overlay.component.html',
   styleUrls: ['./browser-back-overlay.component.scss']
})
export class BrowserBackOverlayComponent implements OnInit {
   @Input() isVisible = false;
   isloggedIn: Boolean = false;
   labels = this.isloggedIn ? Constants.labels.browserBackPopup : Constants.labels.browserBackPopupRegister;
   lastHash: string;
   constructor(@Inject(DOCUMENT) private document: Document, private backGuard: GoBackGuard,
      private router: Router, private auth: AuthGuardService, private registerService: RegisterService) { }

   ngOnInit() {
      this.backGuard.stopedBack.subscribe(() => {
         this.show();
      });
      this.auth.isAuthenticated.subscribe(isLogin => {
         this.isloggedIn = isLogin;
         this.labels = this.isloggedIn ? Constants.labels.browserBackPopup : Constants.labels.browserBackPopupRegister;
      });
      this.router.events.subscribe((event: RouterEvent) => {
         if (event instanceof NavigationStart) {
            this.lastHash = event.url;
         }
      });
   }

   close(reason) {
      this.isVisible = false;
      if (reason) {
         if (this.isloggedIn) {
            // logout if logged in
            this.router.navigate(['/' + this.labels.logoff]);
         } else {
            this.registerService.makeFormDirty(false);
            // go back to last URL
            this.router.navigate([this.lastHash]);
         }
      }
   }
   show() {
      this.isVisible = true;
   }

}

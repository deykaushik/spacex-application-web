
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Constants } from '../utils/constants';
import { UnsaveOverlayService } from './../../shared/overlays/unsave-overlay/unsave-overlay.service';
import { WindowRefService } from '../services/window-ref.service';
import { SessionTimeoutService } from '../../auth/session-timeout/session-timeout.service';
import { TokenManagementService } from '../../core/services/token-management.service';
export interface ComponentCanDeactivate {
   canDeactivate: () => boolean | Observable<boolean>;
}

export enum ModelStates {
   notOpened = 1,
   opend = 2,
   justClosed = 3
}

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
   preRoute: any;
   modalstate = ModelStates.notOpened;

   constructor(private overlayservice: UnsaveOverlayService,
      public router: Router,
      private windowrefservice: WindowRefService,
      private sessionTimeoutService: SessionTimeoutService,
      private tokenManagementService: TokenManagementService) {
      this.overlayservice.OverlayUoutEmitter.subscribe(val => {
         this.handleFromModal(val);
      });
   }

   canDeactivate(component: ComponentCanDeactivate, route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot, nextState: RouterStateSnapshot) {
      const can = component.canDeactivate();

      if (can || this.modalstate === ModelStates.justClosed ||
         this.sessionTimeoutService.timeoutShowing ||
         this.tokenManagementService.GetTokenExpired()) {
         this.modalstate = ModelStates.notOpened;
         return true;
      }

      if (this.windowrefservice.isSmallScreen()) {
         return this.windowrefservice.nativeWindow.confirm(Constants.labels.paymentGuardMessage);
      }

      this.preRoute = nextState;
      this.overlayservice.updateOverlay(true);
      this.modalstate = ModelStates.opend;
      return false;
   }

   handleFromModal(val) {
      this.modalstate = ModelStates.justClosed;
      if (val === 'cancel') {
         if (this.preRoute) {
            this.router.navigate([this.preRoute.url]);
         }
         this.preRoute = null;
      } else {
         this.modalstate = ModelStates.notOpened;
      }

   }
}

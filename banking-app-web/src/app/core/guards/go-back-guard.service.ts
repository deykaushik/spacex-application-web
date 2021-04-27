
import { Injectable, EventEmitter } from '@angular/core';
import {
   ActivatedRouteSnapshot, RouterStateSnapshot, NavigationStart,
   Router, CanDeactivate, CanLoad, Event as EventRuter
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Constants } from '../utils/constants';
import { UnsaveOverlayService } from './../../shared/overlays/unsave-overlay/unsave-overlay.service';
import { WindowRefService } from '../services/window-ref.service';
import { AuthGuardService } from './auth-guard.service';
import { RegisterService } from '../../register/register.service';
import { ISubscription } from 'rxjs/Subscription';

export interface ComponentCanDeactivate {
   canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class GoBackGuard implements CanDeactivate<ComponentCanDeactivate>, CanLoad {
   changeFromBack = false;
   stopedBack = new EventEmitter<boolean>();
   islogedin = false;
   routerSubcription: ISubscription;
   constructor(private windowRef: WindowRefService, private auth: AuthGuardService, private router: Router,
      private overlayservice: UnsaveOverlayService, private registerService: RegisterService) {

      this.registerforBackButtonStop();
      auth.isAuthenticated.subscribe(val => {
         this.islogedin = val;
         this.registerforBackButtonStop();
      });

      this.overlayservice.OverlayUoutEmitter.subscribe(val => {
         this.changeFromBack = false;
      });
   }
   canLoad() {
      this.changeFromBack = false;
      return true;
   }
   canDeactivate(component: ComponentCanDeactivate, route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot, nextState: RouterStateSnapshot) {
      let temp = this.changeFromBack;
      this.changeFromBack = false;
      if (!this.islogedin) {
         const isDirty = this.registerService.isFormDirty;
         if (temp && isDirty) {
            this.stopedBack.emit();
            this.windowRef.nativeWindow.history.pushState({ login: '/login' }, '', '#newState');
            return false;
         }
         return true;
      }
      if (component && component.canDeactivate) {
         const can = component.canDeactivate();
         if (!can) {
            temp = false;
         }
      }
      if (temp) {
         this.stopedBack.emit();
         this.windowRef.nativeWindow.history.pushState({ logoff: '/logoff' }, '', '#logoffState');
      }
      return !temp;
   }
   private registerforBackButtonStop() {
      if (this.routerSubcription) {
         this.routerSubcription.unsubscribe();
      }
      if (this.islogedin || !this.windowRef.isSmallScreen()) {
         this.windowRef.nativeWindow.onhashchange = () => {
            this.changeFromBack = true;
         };
      } else {
         this.routerSubcription = this.router.events.subscribe((event: EventRuter) => {
            if (event instanceof NavigationStart) {
               this.changeFromBack = true;
            }
         });
      }
   }
}

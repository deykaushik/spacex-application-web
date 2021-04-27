
import {
   Router,
   Event as RouterEvent,
   NavigationStart,
   NavigationEnd,
   NavigationCancel,
   NavigationError
} from '@angular/router';
import { Component, OnInit, Inject, HostListener, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { SysErrorInstanceType } from './core/utils/enums';

import { AuthGuardService } from './core/guards/auth-guard.service';
import { Constants } from './core/utils/constants';
import { WindowRefService } from './core/services/window-ref.service';
import { environment } from './../environments/environment';
import { SystemErrorService } from './core/services/system-services.service';
import { LoaderService } from './core/services/loader.service';
import { GaTrackingService } from './core/services/ga.service';
import { GADirective } from './core/directives/ga.directive';
import { RegisterService } from './register/register.service';
import { View } from './register/utils/enums';
import { ChatService } from './chat/chat.service';
import { TrusteerService } from './core/services/trusteer-service';
import { ISubscription } from '../../node_modules/rxjs/Subscription';
import { Observable } from '../../node_modules/rxjs/Observable';
import { BaseComponent } from './core/components/base/base.component';
import { AuthConstants } from './auth/utils/constants';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
   loading = false;
   sysErrorInstanceType = SysErrorInstanceType;
   isloggedIn = false;
   chatBox = false;
   showChat = environment.features.chat;
   showTrusteerSplash: boolean;
   pollScreenObservable: Observable<number>;
   pollScreenSubscription: ISubscription;
   count = 0;
   constructor(private router: Router, @Inject(DOCUMENT) public document: Document,
      public auth: AuthGuardService, private winRef: WindowRefService,
      private systemError: SystemErrorService,
      private loader: LoaderService,
      private GoogleAnalytics: GaTrackingService,
      private chatService: ChatService,
      private registerService: RegisterService,
      private trusteerService: TrusteerService,
      injector: Injector) {
      super(injector);
   }
   navigationInterceptor(event: RouterEvent): void {
      if (event instanceof NavigationStart) {
         this.showLoader(true);
      }
      if (event instanceof NavigationEnd) {
         this.showLoader(false);
         this.winRef.nativeWindow.scrollTo(0, 0);
         this.systemError.closeError();
         this.showTrusteerSplash = false;
         if (this.isloggedIn) {
            if (event.urlAfterRedirects === '/dashboard') {
               if (environment.features.trusteer && JSON.parse(localStorage.getItem('TrusteerInstalled')) === false) {
                  this.DoTrusteerCheck();
            } else {
                  this.showTrusteerSplash = false;
                  this.showChat = environment.features.chat;
                  this.trusteerService.CloseTrusteer();
               }
            } else {
                  this.showChat = environment.features.chat;
                  this.showTrusteerSplash = false;
                  this.trusteerService.CloseTrusteer();
            }
         }
      }
      if (event instanceof NavigationCancel) {
         this.showLoader(false);
      }
   }
   showLoader(isShown: boolean) {
      this.loading = isShown;
      if (isShown) {
         this.document.body.classList.add('no-scroll');
         this.loader.show();
      } else {
         this.document.body.classList.remove('no-scroll');
         this.loader.hide();
      }
   }
   @HostListener('window:beforeunload', ['$event'])
   beforeUnloadHander(event) {
      // Reloading browser, confirm on screen refresh(F5)
      if (this.isloggedIn && !this.trusteerService.trusteerDownloading ||
         (this.registerService.activeView && (this.registerService.activeView in View)
         && this.registerService.isFormDirty)) {
         this.chatBox = false;
         return event.returnValue = Constants.labels.browserRefreshText;
      }
   }
   manageTouchEvent() {
      this.document.body.addEventListener('touchstart', this.addCursor.bind(this));
      this.document.body.addEventListener('touchleave', this.removeCursor.bind(this));
   }
   removeCursor() {
      this.document.body.style.cursor = 'default';
   }
   addCursor() {
      this.document.body.style.cursor = 'pointer';
   }
   ngOnInit() {
      this.auth.isAuthenticated.subscribe(isLogin => {
         this.isloggedIn = isLogin;
         if (this.isloggedIn) {
            this.chatBox = false;
            this.chatService.setChatActive(this.chatBox);
            this.chatService.applyTransition('TransitionToAuthenticated');
         }
      });
      this.router.events.subscribe((event: RouterEvent) => {
         this.navigationInterceptor(event);
      });
      this.manageTouchEvent();
   }

   DoTrusteerCheck() {
         if (window.localStorage) {
               if (localStorage.getItem('Trusteer') === null) {
                     localStorage.setItem('Trusteer', 'true');
                  }
            }
            if (JSON.parse(localStorage.getItem('Trusteer')) &&
            JSON.parse(localStorage.getItem('TrusteerCount')) < environment.rapportSetting.showcount &&
            JSON.parse(localStorage.getItem('TrusteerInstalled')) === false) {
                  if (this.pollScreenSubscription) {
                        this.pollScreenSubscription.unsubscribe();
                  }
                  if (!environment.rapportSetting.popupdurationms ||
                  environment.rapportSetting.popupdurationms === 0) {
                        environment.rapportSetting.popupdurationms = 5;
                  }
                  if (JSON.parse(localStorage.getItem('Trusteer'))) {
                        this.pollScreenObservable = Observable.timer(environment.rapportSetting.popupdurationms);
                        this.pollScreenSubscription = this.pollScreenObservable.subscribe(() => {
                 this.screenPollTimerInterval();
               });
                const link = window['trusteerLink'];
                this.showTrusteerSplash = true;
                this.showChat = false;
                this.trusteerService.ShowTrusteer(true);
               } else {
                this.onCloseTrusteer(null);
                this.trusteerService.ShowTrusteer(false);
                this.trusteerService.CloseTrusteer();
             }
             localStorage.setItem('TrusteerCount', JSON.parse(localStorage.getItem('TrusteerCount')) + 1);
      } else {
         this.showTrusteerSplash = false ;
         this.showChat = environment.features.chat;
         this.onCloseTrusteer(null);
         this.trusteerService.CloseTrusteer();
      }
   }
   chatBoxOpen() {
      this.chatBox = !this.chatBox;
      this.chatService.setChatActive(this.chatBox);
      if (this.chatBox) {
         this.isloggedIn ? this.addAnalytics(AuthConstants.gaEvents.clickedOnChatAuth)
            : this.addAnalytics(AuthConstants.gaEvents.clickedOnChatUnAuth);
      }
   }

   closeChat(closeAction: boolean) {
      this.chatBox = closeAction ? true : false;
      this.chatService.setChatActive(this.chatBox);
   }

   addAnalytics(event) {
      this.sendEvent(event.eventAction, event.label, null, event.category);
   }
   screenPollTimerInterval() {
      if (this.count > 0) {
        this.count--;
      } else {
        this.onCloseTrusteer(null);
      }
    }
    onCloseTrusteer(event) {
      this.showTrusteerSplash = false;
      this.showChat = environment.features.chat;
      this.trusteerService.ShowTrusteer(false);
      localStorage.setItem('Trusteer', 'false');
      this.trusteerService.CloseTrusteer();
   }
}

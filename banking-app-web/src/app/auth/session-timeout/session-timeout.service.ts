import { Injectable, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { SessionTimeoutComponent } from './session-timeout.component';
import { environment } from '../../../environments/environment';
const ifvisible = require('ifvisible.js');
import { Observable } from 'rxjs/Observable';
import { WindowRefService } from '../../core/services/window-ref.service';
import { ChatService } from '../../chat/chat.service';
import { TokenManagementService } from '../../core/services/token-management.service';

@Injectable()
export class SessionTimeoutService implements OnInit, OnDestroy {

   bsModalRef: BsModalRef;
   idleState = 'Not started.';
   timedOut = false;
   lastPing?: Date = null;
   countDown: number;
   idleTime = environment.session.idleTime;
   timeoutWarningTime = environment.session.timeOutWarning;
   modalSubscription: ISubscription;
   timeoutShowing = false;
   lastWakeUpDate: Date;
   pollScreenObservable: Observable<number>;
   pollScreenSubscription: ISubscription;
   isIdleStarted = false;
   isAuthenticated = false;
   poupHiddenSubcription;
   domEvents: String = 'click mousemove focus keydown touchstart mousedown mousewheel DOMMouseScroll touchmove scroll';
   constructor(private router: Router, private modalService: BsModalService, private windowRefService: WindowRefService,
      private authGuard: AuthGuardService,
      private chatService: ChatService,
      private tokenManagementService: TokenManagementService) {
   }

   ngOnInit() {
      this.onUserActivity();
      this.pollScreenObservable = Observable.timer(0, 1000);
      this.lastWakeUpDate = new Date();
      // sets an idle timeout of 5 seconds, for testing purposes.
      ifvisible.setIdleDuration(this.idleTime);
      ifvisible.on('idle', () => {
         this.isIdleStarted = true;
      });

      ifvisible.on('wakeup', () => {
         // go back updating data
         this.isIdleStarted = false;
         this.lastWakeUpDate = new Date();
      });

      this.authGuard.isAuthenticated.subscribe(response => {
         this.isAuthenticated = response;
         if (response) {
            this.reset();
            this.startTimer();
         } else {
            this.stop();
            this.stopTimer();
            this.chatService.loggedOutEndChat();
         }
      });

      this.tokenManagementService.tokenExpired.subscribe(tokenExpired => {
         if (tokenExpired) {
            this.stop();
            this.stopTimer();
         }
      });
   }
   private startTimer() {
      // check every sec
      if (this.pollScreenSubscription) {
         this.pollScreenSubscription.unsubscribe();
      }
      this.pollScreenSubscription = this.pollScreenObservable.subscribe(() => {
         this.checkSession();
      });
   }
   private stopTimer() {
      if (this.pollScreenSubscription) {
         this.pollScreenSubscription.unsubscribe();
      }
      this.domEvents.split(' ').forEach((eventName) => {
         this.windowRefService.nativeWindow.document.removeEventListener(eventName, this.userActivity);
      });
   }
   private checkSession() {
      const lapsedSeconds = Math.floor(((new Date()).valueOf() - this.lastWakeUpDate.valueOf()) / 1000);
      if (this.isAuthenticated && !(this.bsModalRef && this.bsModalRef.content && this.bsModalRef.content.isModalOpen)) {
         if ((lapsedSeconds && lapsedSeconds >= (this.idleTime + this.timeoutWarningTime)) && this.isIdleStarted) {
            this.isAuthenticated = false;
            this.isIdleStarted = false;
            this.reset();
            this.stopTimer();
            this.router.navigate(['auth/logoff']);
         } else if ((lapsedSeconds && (lapsedSeconds >= this.idleTime) && this.isIdleStarted)) {
            this.stopTimer();
            this.showWarningPopup(this.timeoutWarningTime - (lapsedSeconds - this.idleTime));
         }
      }
   }
   showWarningPopup(countdown: number) {
      this.showWarning(countdown);
      if (this.poupHiddenSubcription) {
         this.poupHiddenSubcription.unsubscribe();
      }
      this.poupHiddenSubcription = this.modalService.onHidden.subscribe(() => {
         if (this.bsModalRef && this.bsModalRef.content &&
            this.bsModalRef.content.action === 'continue') {
            this.reset();
            this.startTimer();
         } else {
            this.stopTimer();
         }
         this.timeoutShowing = false;
      });
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
   }
   reset() {
      ifvisible.wakeup();
      this.isIdleStarted = false;
      this.lastWakeUpDate = new Date();
      this.idleState = 'Started.';
      this.timedOut = false;
   }

   stop() {
      ifvisible.wakeup();
      this.idleState = 'Stopped.';
      this.isIdleStarted = false;
      this.lastWakeUpDate = new Date();
      this.timedOut = false;
      if (this.bsModalRef &&
         this.bsModalRef.content &&
         this.bsModalRef.content.isModalOpen) {
         this.bsModalRef.hide();
      }
   }

   public showWarning(timeOut: number) {
      this.timeoutShowing = true;
      const config = { animated: true, keyboard: false, backdrop: true, ignoreBackdropClick: true };
      this.bsModalRef = this.modalService.show(SessionTimeoutComponent, Object.assign({}, config, { class: 'timeout-popup' }));
      this.bsModalRef.content.isModalOpen = true;
      this.bsModalRef.content.timeOut = timeOut;
   }

   private onUserActivity() {
      this.domEvents.split(' ').forEach((eventName) => {
         this.windowRefService.nativeWindow.document.removeEventListener(eventName, this.userActivity);
         this.windowRefService.nativeWindow.document.addEventListener(eventName, this.userActivity.bind(this));
      });

   }
   private userActivity() {
      this.reset();
   }
   ngOnDestroy() {
      if (this.pollScreenSubscription) {
         this.pollScreenSubscription.unsubscribe();
      }
   }
}

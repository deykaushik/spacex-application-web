import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { environment } from '../../../../environments/environment';

@Component({
   selector: 'app-token-renew-expiry',
   templateUrl: './token-renewal-expiry.component.html',
   styleUrls: ['./token-renewal-expiry.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class TokenRenewalExpiryComponent implements OnInit {

   pollScreenObservable: Observable<number>;
   pollScreenSubscription: ISubscription;

   private countdownSeconds: number;
   action: string;
   minutes: string;
   seconds: string;
   showLoader: boolean;

   constructor(private router: Router) {
      this.countdownSeconds = environment.session.tokenExpiryMessageDisplayTime;
   }

   ngOnInit() {
      this.pollScreenObservable = Observable.timer(0, 1000);
      this.pollScreenSubscription = this.pollScreenObservable.subscribe(() => {
         this.screenPollTimerInterval();
      });
      this.showLoader = false;
   }

   screenPollTimerInterval() {
      try {
         if (this.countdownSeconds > 0) {
            this.countdownSeconds--;
            this.convertToTime();
         } else {
            this.logoff(null);
         }
      } catch (e) {
         // Do not automatically close on error
      }
   }

   convertToTime() {
      const minutes: number = Math.floor(this.countdownSeconds / 60);
      this.minutes = ('0' + minutes).slice(-2);
      this.seconds = ('0' + (this.countdownSeconds - minutes * 60)).slice(-2);
   }

   logoff($event) {
      if ($event) {
         $event.stopPropagation();
      }
      this.showLoader = true;
      this.router.navigate(['auth/logoff']);
   }
}

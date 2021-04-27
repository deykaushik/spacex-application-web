import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { AuthConstants } from '../utils/constants';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { TokenManagementService } from '../../core/services/token-management.service';
import { WindowRefService } from '../../core/services/window-ref.service';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SessionTimeoutComponent implements OnInit {

  private countdown: number;
  public isModalOpen: boolean;
  action: string;
  minutes: string;
  seconds: string;

  pollScreenObservable: Observable<number>;
  pollScreenSubscription: ISubscription;

  set timeOut(value: number) {
    this.countdown = value;
  }
  get timeOut() {
    return this.countdown;
  }

  constructor(private router: Router,
    public bsModalRef: BsModalRef,
    private tokenManagementService: TokenManagementService, private windowRef: WindowRefService) {
  }

  ngOnInit() {
    this.action = 'timed out';
    this.pollScreenObservable = Observable.timer(0, 1000);
    this.pollScreenSubscription = this.pollScreenObservable.subscribe(() => {
      this.screenPollTimerInterval();
    });
  }

  screenPollTimerInterval() {
    if (this.countdown > 0) {
      this.countdown--;
      this.convertToTime();
    } else {
      this.logoff(null);
    }
  }

  convertToTime() {
    const minutes: number = Math.floor(this.countdown / 60);
    this.minutes = ('0' + minutes).slice(-2);
    this.seconds = ('0' + (this.countdown - minutes * 60)).slice(-2);
  }

  continue($event) {
    $event.stopPropagation();
    this.action = 'continue';
    this.isModalOpen = false;
    this.bsModalRef.hide();
    this.pollScreenSubscription.unsubscribe();
  }

  logoff($event) {
    if ($event) {
      $event.stopPropagation();
    }
    this.action = 'logoff';
    this.pollScreenSubscription.unsubscribe();
    this.isModalOpen = false;
    this.bsModalRef.hide();
    this.windowRef.nativeWindow.setTimeout(() => {
      this.router.navigate(['auth/logoff']);
    }, 0);
  }
}

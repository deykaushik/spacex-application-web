import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../open-account/constants';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  closeNotification() {
    this.router.navigateByUrl(Constants.routeUrls.dashboard);
  }
}

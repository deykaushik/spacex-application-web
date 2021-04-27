import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from './../../core/utils/constants';
import { ConstantsRegister } from '../utils/constants';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-nedbank-id-delayed',
  templateUrl: './nedbank-id-delayed.component.html',
  styleUrls: ['./nedbank-id-delayed.component.scss']
})
export class NedbankIdDelayedComponent implements OnInit {
  heading: string;
  successful: boolean;

  constructor(private router: Router, private service: RegisterService) { }

  ngOnInit() {
    this.successful = true;
    this.heading = ConstantsRegister.messages.headingCongrats;
    this.service.makeFormDirty(false);
  }

  navigateNext(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.router.navigate(['/login']);
  }
}

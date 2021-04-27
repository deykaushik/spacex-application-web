import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import { View } from '../utils/enums';

@Component({
  selector: 'app-nedbank-id-state',
  templateUrl: './nedbank-id-state.component.html',
  styleUrls: ['./nedbank-id-state.component.scss']
})
export class NedbankIdStateComponent {
  constructor(private router: Router, private service: RegisterService) {
    this.service.makeFormDirty(true);
  }

  navigateNext(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.service.SetActiveView(View.NedIdState, View.NedIdCreate);
  }
}

import { Component, OnInit } from '@angular/core';
import { Constants } from './../../core/utils/constants';
import { ConstantsRegister } from '../utils/constants';
import { RegisterService, ApprovalType } from '../register.service';
import { View } from '../utils/enums';

@Component({
  selector: 'app-nedbank-id-not-federated',
  templateUrl: './nedbank-id-not-federated.component.html',
  styleUrls: ['./nedbank-id-not-federated.component.scss']
})
export class NedbankIdNotFederatedComponent implements OnInit {
  constructor(private registerService: RegisterService) { }

  ngOnInit() {
  }

  navigateRegister(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.registerService.approvalType = ApprovalType.FederateUser;
    this.registerService.SetActiveView(View.NedIdNotFederated, View.ProfilePinPassword);
  }
}

import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../register.service';
import { View } from '../utils/enums';

@Component({
  selector: 'app-nedbank-id-already-exist',
  templateUrl: './nedbank-id-already-exist.component.html',
  styleUrls: ['./nedbank-id-already-exist.component.scss']
})
export class NedbankIdAlreadyExistComponent implements OnInit {

  constructor(private registerService: RegisterService) { }
  userName: string;

  ngOnInit() {
    this.userName = this.registerService.userDetails.nedbankIdUserName;
    this.registerService.isPasswordRecovery = true;
  }

  navigateResetPassword(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.registerService.SetActiveView(View.NedIdExist, View.ForgotPwdCreatepwd);
  }

  navigateLogon(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.registerService.SetActiveView(View.NedIdExist, View.NedIdLogin);
  }

}

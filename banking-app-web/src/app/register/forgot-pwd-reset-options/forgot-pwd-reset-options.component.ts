import { Component } from '@angular/core';
import { View } from '../utils/enums';
import { RegisterService } from '../register.service';

@Component({
    selector: 'app-nedbankid-forgotpwd-resetoptions',
    templateUrl: './forgot-pwd-reset-options.component.html',
    styleUrls: ['./forgot-pwd-reset-options.component.scss']
})

export class NedbankIdForgotPwdResetOptionsComponent {

    View: typeof View = View;

    constructor(private service: RegisterService) { }

    navigateNext(step: View) {
        this.service.SetActiveView(View.ForgotPwdResetoptions, step);
    }
}

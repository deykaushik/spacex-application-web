import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from './../../core/utils/constants';
import { ConstantsRegister } from '../utils/constants';
import { AuthConstants } from '../../auth/utils/constants';
import { RegisterService } from '../register.service';

@Component({
    selector: 'app-nedbank-id-complete',
    templateUrl: './nedbank-id-complete.component.html',
    styleUrls: ['./nedbank-id-complete.component.scss']
})
export class NedbankIdCompleteComponent implements OnInit {
    heading: string;
    successful: boolean;

    constructor(private router: Router, private service: RegisterService) { }

    ngOnInit() {
        this.successful = true;
        this.heading = ConstantsRegister.messages.headingCongrats;
    }

    navigateNext(event: any) {
        if (event != null) {
            event.preventDefault();
            event.stopPropagation();
        }

        // localStorage.removeItem(AuthConstants.staticNames.loggedOnUser);
        // this.tokenManagementService.removeAuthToken();
        this.service.makeFormDirty(false);
        this.router.navigate(['/login']);
    }
}

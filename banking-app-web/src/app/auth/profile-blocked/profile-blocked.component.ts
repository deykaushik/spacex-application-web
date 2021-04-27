import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../utils/constants';

@Component({
  selector: 'app-profile-blocked',
  templateUrl: './profile-blocked.component.html',
  styleUrls: ['./profile-blocked.component.scss']
})
export class ProfileBlockedComponent implements OnInit {
  ContactCentreEmail = AuthConstants.constantValues.contactCentreEmail;
  ContactCentreEmailMailto = 'mailto:' + AuthConstants.constantValues.contactCentreEmail;
  ContactCentrePhone = AuthConstants.constantValues.contactCentrePhone;

  constructor(private router: Router) { }

  ngOnInit() { }

  navigateClose() {
    this.router.navigate(['/auth']);
  }

  findBranch(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.router.navigate(['branchlocator']);
  }

}

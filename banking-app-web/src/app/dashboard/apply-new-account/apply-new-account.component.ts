import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-apply-new-account',
   templateUrl: './apply-new-account.component.html',
   styleUrls: ['./apply-new-account.component.scss']
})
export class ApplyNewAccountComponent {

   showReasonError: boolean;
   clientType: string;
   isValidClientType: boolean;
   applyBtn = Constants.labels.nowLabels.apply;

   constructor(private router: Router) { }

   apply() {
      this.router.navigateByUrl(Constants.routeUrls.openNewAccount);
   }
}

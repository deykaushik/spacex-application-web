import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../../core/utils/constants';

@Component({
   selector: 'app-locate-branch',
   templateUrl: './locate-branch.component.html',
   styleUrls: ['./locate-branch.component.scss']
})
export class LocateBranchComponent implements OnInit {

   itemAccountId: number;
   routeURL = Constants.routeUrls;
   constructor(private route: ActivatedRoute, private router: Router) {
   }

   ngOnInit() {
      this.route.params.subscribe(params => this.itemAccountId = params.accountId);
   }

   // Close overlay and navigate to account details page
   closeOverlay() {
      this.router.navigateByUrl(encodeURI(this.routeURL.accountDetail + this.itemAccountId));
   }
}

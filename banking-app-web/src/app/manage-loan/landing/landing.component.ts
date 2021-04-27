import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PreFillService } from '../../core/services/preFill.service';
import { Constants } from '../../../app/core/utils/constants';
import { ManageLoanConstants } from '../constants';
import { IHomeLoanStatus } from '../../core/services/models';
import { CommonUtility } from '../../core/utils/common';

@Component({
   selector: 'app-landing',
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

   isOverlayVisible: boolean;
   btnText: string;
   homeLoanStatusData: IHomeLoanStatus;
   accountId: number;
   isNinetyDaysNoticeEnabled: boolean;
   labels = ManageLoanConstants.labels.manageLoan;

   constructor(private router: Router, private route: ActivatedRoute, private preFillService: PreFillService) {
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.btnText = Constants.labels.settlement.buttons.close;
      this.isOverlayVisible = true;
      this.getHomeLoanStatusData();
   }

   getHomeLoanStatusData() {
      this.homeLoanStatusData = this.preFillService.homeLoanStatusData;
      this.isNinetyDaysNoticeEnabled = this.homeLoanStatusData && this.homeLoanStatusData.isNinetyDaysNoticeEnabled;
   }

   closeOverlay() {
      this.isOverlayVisible = false;
      this.router.navigateByUrl(encodeURI(Constants.routeUrls.accountDetail + this.accountId));
   }

   onClickPlaceNotice() {
      this.router.navigateByUrl(encodeURI(Constants.routeUrls.placeNotice + this.accountId));
   }

   onClickCancelLoan() {
      this.router.navigateByUrl(encodeURI(Constants.routeUrls.cancelLoan + this.accountId));
   }

}

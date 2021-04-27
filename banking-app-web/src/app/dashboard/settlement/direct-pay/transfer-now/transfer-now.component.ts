import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PreFillService } from '../../../../core/services/preFill.service';
import { Constants } from '../../../../core/utils/constants';
import { ISettlementDetail } from '../../../../core/services/models';

@Component({
   selector: 'app-transfer-now',
   templateUrl: './transfer-now.component.html',
   styleUrls: ['./transfer-now.component.scss']
})
export class TransferNowComponent implements OnInit {

   @Input() settlementDetails: ISettlementDetail;
   @Output() onClose = new EventEmitter<boolean>();
   isOverlayVisible: boolean;
   closeBtnText: string = Constants.labels.settlement.buttons.close;
   labels = Constants.labels.settlement.transferNow;
   proceedButton: string = Constants.labels.settlement.buttons.proceed;

   constructor(private router: Router, private preFillService: PreFillService) { }

   ngOnInit() {
      this.isOverlayVisible = true;
   }

   closeOverlay() {
      this.isOverlayVisible = false;
      this.onClose.emit(true);
   }

   proceedNext() {
      this.preFillService.settlementDetail = this.settlementDetails;
      this.router.navigateByUrl(Constants.routeUrls.transferLanding);
   }

}

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { ITermsAndConditions } from '../../core/services/models';
import { CommonUtility } from './../../core/utils/common';
import { Constants } from '../../core/utils/constants';
import { BaseComponent } from '../../core/components/base/base.component';
import { PayoutService } from '../payout.service';
import { WindowRefService } from '../../core/services/window-ref.service';

@Component({
   selector: 'app-payout-terms',
   templateUrl: './payout-terms.component.html',
   styleUrls: ['./payout-terms.component.scss']
})
export class PayoutTermsComponent extends BaseComponent implements OnInit, OnDestroy {
   windowService = new WindowRefService();
   hlnResponse: ITermsAndConditions;
   print = CommonUtility.print.bind(CommonUtility);
   labels = Constants.labels.buildingLoan;

   constructor(private payoutService: PayoutService,
      injector: Injector) {
      super(injector);
   }
   ngOnInit() {
      CommonUtility.removePrintHeaderFooter();
      this.removePrintable();
      this.showTermsAndConditions();
   }
   removePrintable() {
      const summaryContainer = this.windowService.nativeWindow.document.getElementsByClassName('summary-container')[0];
      const iconDiv = this.windowService.nativeWindow.document.getElementsByClassName('icon-div')[0];
      const stepsTable = this.windowService.nativeWindow.document.getElementsByClassName('steps-table')[0];
      const exitDiv = this.windowService.nativeWindow.document.getElementsByClassName('exit-div')[0];
      const divider = this.windowService.nativeWindow.document.getElementsByClassName('divider')[0];

      if (summaryContainer) {
         summaryContainer.classList.add('no-print');
      }
      if (iconDiv) {
         iconDiv.classList.add('no-print');
      }
      if (stepsTable) {
         stepsTable.classList.add('no-print');
      }
      if (exitDiv) {
         exitDiv.classList.add('no-print');
      }
      if (divider) {
         divider.classList.add('no-print');
      }
   }
   showTermsAndConditions() {
      this.payoutService.getTermsAndConditionsResult().subscribe(resp => {
         this.hlnResponse = resp;
      });
   }
   ngOnDestroy() {
      CommonUtility.addPrintHeaderFooter();
      const summaryContainer = this.windowService.nativeWindow.document.getElementsByClassName('summary-container')[0];
      const iconDiv = this.windowService.nativeWindow.document.getElementsByClassName('icon-div')[0];
      const stepsTable = this.windowService.nativeWindow.document.getElementsByClassName('steps-table')[0];
      const exitDiv = this.windowService.nativeWindow.document.getElementsByClassName('divider')[0];
      const divider = this.windowService.nativeWindow.document.getElementsByClassName('exit-div')[0];

      if (summaryContainer) {
         summaryContainer.classList.remove('no-print');
      }
      if (iconDiv) {
         iconDiv.classList.remove('no-print');
      }
      if (stepsTable) {
         stepsTable.classList.remove('no-print');
      }
      if (exitDiv) {
         exitDiv.classList.remove('no-print');
      }
      if (divider) {
         divider.classList.remove('no-print');
      }
   }
}

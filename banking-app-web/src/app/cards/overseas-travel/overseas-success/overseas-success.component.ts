import { Component, OnInit, Renderer2, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from '../../../core/utils/constants';
@Component({
   selector: 'app-overseas-success',
   templateUrl: './overseas-success.component.html',
   styleUrls: ['./overseas-success.component.scss']
})
export class OverseasSuccessComponent implements OnInit, OnDestroy {
   @Output() showSuccess = new EventEmitter();
   labels = Constants.overseasTravel.labels;
   isTooltipOpen: boolean;
   constructor(private router: Router, private render: Renderer2) {
   }

   ngOnInit() {
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
      this.isTooltipOpen = false;
   }

   openTooltip() {
      this.isTooltipOpen = !this.isTooltipOpen;
   }

   exitAction(event: boolean) {
      this.showSuccess.emit(event);
   }

   navigateToDashboard() {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   openBranchLocator() {
      this.router.navigate(['branchlocator']);
   }

   ngOnDestroy() {
      this.render.setStyle(document.body, 'overflow-y', 'auto');
   }
}

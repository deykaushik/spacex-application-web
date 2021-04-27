import { Component, OnDestroy, Inject, Renderer2, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';
import { Constants } from '../../constants';
import { DOCUMENT } from '@angular/common';

@Component({
   selector: 'app-exit-pop-up',
   templateUrl: './exit-pop-up.component.html',
   styleUrls: ['./exit-pop-up.component.scss']
})
export class ExitPopUpComponent implements OnDestroy {

   labels = Constants.labels.openAccount;
   openAccountMessages = Constants.messages.openNewAccount;

   @Output() stepperPage = new EventEmitter<boolean>();

   constructor(private router: Router, private render: Renderer2,
      @Inject(DOCUMENT) private document: Document) { }

   onYesClicked() {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   closeOverlay() {
      this.stepperPage.emit(true);
   }

   ngOnDestroy() {
      this.render.setStyle(this.document.body, 'overflow-y', 'auto');
   }

}

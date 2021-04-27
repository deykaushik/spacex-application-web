import { Component, Input, EventEmitter, Output, TemplateRef, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { UnsaveOverlayService } from './unsave-overlay.service';
import { Constants } from './../../../core/utils/constants';
import { AuthGuardService } from '../../../core/guards/auth-guard.service';

@Component({
   selector: 'app-unsave-overlay',
   templateUrl: './unsave-overlay.component.html',
   styleUrls: ['./unsave-overlay.component.scss']
})

export class UnsaveOverlayComponent implements OnInit {
   @Input() isVisible = false;
   @Output() onHide = new EventEmitter();
   isloggedIn: Boolean = false;
   labels = this.isloggedIn ? Constants.labels.unSavedPopup : Constants.labels.unSavedPopupRegister;
   constructor(@Inject(DOCUMENT) private document: Document, private overlayservice: UnsaveOverlayService,
      private auth: AuthGuardService) { }
   ngOnInit() {
      this.overlayservice.OverlayUpdateEmitter.subscribe(isLimitUpdated => {
         this.show();
      });
      this.auth.isAuthenticated.subscribe(isLogin => {
         this.isloggedIn = isLogin;
         this.labels = this.isloggedIn ? Constants.labels.unSavedPopup : Constants.labels.unSavedPopupRegister;
      });
   }
   close(reason) {
      this.isVisible = false;
      this.onHide.emit(reason);
      this.overlayservice.emitOut(reason);
   }
   show() {
      this.isVisible = true;
   }

}

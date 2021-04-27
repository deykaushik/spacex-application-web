import { Component, Input, EventEmitter, Output, TemplateRef, OnChanges, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { SysErrorInstanceType } from './../../../core/utils/enums';


@Component({
   selector: 'app-colored-overlay',
   templateUrl: './overlay.component.html',
   styleUrls: ['./overlay.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class ColoredOverlayComponent implements OnChanges, OnDestroy {
   @Input() isVisible: boolean;
   @Input() backOption: boolean;
   @Input() alternate = false;
   @Input() template: TemplateRef<any>;
   @Input() altButtonText: string;
   @Input() closeText = true;
   @Input() headerFixed: boolean;
   @Input() showCloseBtn = true;
   @Output() onHide = new EventEmitter();
   @Input() cancelable = true;
   sysErrorInstanceType = SysErrorInstanceType;
   alternateHeader: boolean;
   inactiveOverlay() {
      this.onHide.emit(!this.isVisible);
      this.document.body.classList.remove('overlay-no-scroll');
   }

   constructor( @Inject(DOCUMENT) private document: Document) { }

   ngOnChanges() {
      if (this.isVisible) {
         this.alternateHeader = this.alternate;
         this.document.body.classList.add('overlay-no-scroll');
      }
   }
   ngOnDestroy() {
      this.document.body.classList.remove('overlay-no-scroll');
   }
}

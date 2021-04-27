import { Directive, HostListener, Inject, Input } from '@angular/core';
import { DOCUMENT, By } from '@angular/platform-browser';

@Directive({
   selector: '[appClickScroll]'
})
export class ClickScrollDirective {

   @Input() target;
   @Input() scrollArea;

   setTarget: any;
   targetOffset: number;
   scrollAreaOffset: any;

   @HostListener('click', ['$event.target'])
   onClick(el) {
      this.setTarget = this.document.getElementById(this.target);
      this.scrollAreaOffset = this.scrollArea.offsetTop;
      if (this.setTarget) {
         this.targetOffset = this.setTarget.offsetTop;
         this.scrollArea.scrollTop = (this.targetOffset - this.scrollAreaOffset);
      }
   }

   constructor(
      @Inject(DOCUMENT) private document: Document
   ) { }

}

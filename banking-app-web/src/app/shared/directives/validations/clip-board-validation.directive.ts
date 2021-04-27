import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
   selector: '[appClipBoardValidation]'
})
export class ClipBoardValidationDirective {

   constructor(el: ElementRef) {
      const events = ['cut', 'copy', 'paste', 'contextmenu'];
      events.forEach(e =>
         el.nativeElement.addEventListener(e, (event) => {
            event.preventDefault();
         }));
   }
}

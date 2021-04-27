import { Directive, HostListener, ElementRef, Input } from '@angular/core';

/*
  Purpose :- Used to navigate dropdown submenu using navigation keys(LEFT,RIGHT,UP and DOWN)
*/
@Directive({
   selector: '[dropdown][appArrowNavigation]'
})
export class DpArrowNavigationDirective {

   constructor(private _elementRef: ElementRef) { }

   @Input() submenuindex = -1;
   @Input() dpRef;

   @HostListener('keydown.arrowDown', ['$event'])
   @HostListener('keydown.arrowUp', ['$event'])
   @HostListener('keydown.arrowRight', ['$event'])
   @HostListener('keydown.arrowLeft', ['$event'])
   @HostListener('keydown.tab', ['$event'])
   @HostListener('keydown.esc', ['$event'])
   @HostListener('keydown.shift.tab', ['$event'])
   navigationKeysClick(event: any): void {
      const allRef = this._elementRef.nativeElement.querySelectorAll('.sub-menu-item');
      if (allRef && allRef.length) {
         const firtsActive = this._elementRef.nativeElement.ownerDocument.activeElement;
         switch (event.keyCode) {
            case 37: // LEFT key
            case 38: // UP key
               event.preventDefault();
               this.DeactivateAllSubMenuItem(allRef);
               if (this.submenuindex > 0) {
                  this.submenuindex--;
               } else {
                  this.submenuindex = allRef.length - 1;
               }
               this.setActive(allRef[this.submenuindex]);
               break;
            case 39: // RIGHT key
            case 40: // DOWN key
               event.preventDefault();
               this.DeactivateAllSubMenuItem(allRef);
               if (this.submenuindex + 1 < allRef.length) {
                  this.submenuindex++;
               } else {
                  this.submenuindex = 0;
               }
               this.setActive(allRef[this.submenuindex]);
               break;
            case 9:  // TAB Out
            case 27: { // Escape key
               if (this.dpRef && allRef.length > 0) {
                  this.dpRef.hide();
               }
               break;
            }
            default:
         }
      }
   }

   private setActive(item: any) {
      item.classList.add('active');
      item.querySelectorAll('.submenu-anchor')[0].focus();
   }
   private DeactivateAllSubMenuItem(allItems: HTMLElement[]) {
      allItems.forEach(element => {
         element.classList.remove('active');
      });
   }
}

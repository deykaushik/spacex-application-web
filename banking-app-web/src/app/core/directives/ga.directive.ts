import { Directive, HostListener, ElementRef } from '@angular/core';
import { GaTrackingService } from '../services/ga.service';
import { element } from 'protractor';
import { IGaEvent } from '../services/models';

@Directive({
   selector: '[appGA]'
})
export class GADirective {
   private gaEventAttributeName = 'ga-event-name';
   private gaEventLabel = 'ga-event-label';

   constructor(private elementRef: ElementRef, private gaTrackingService: GaTrackingService) {
   }

   sendData(event) {
      if (event.target.hasAttribute(this.gaEventAttributeName)) {
         const gaEventName = event.target.getAttribute(this.gaEventAttributeName);
            let eventLabel: string;
            if (event.target.hasAttribute(this.gaEventLabel)) {
               eventLabel = event.target.getAttribute(this.gaEventLabel);
            }
            const eventType: IGaEvent = {action: gaEventName, label: eventLabel};
            this.gaTrackingService.sendEvent(eventType);
      }
   }

   @HostListener('document:click', ['$event'])
   onClick(event) {
      if (event.target.nodeName.toUpperCase() !== 'INPUT' && event.target.nodeName.toUpperCase() !== 'TEXTAREA') {
      this.sendData(event);
      }
   }

   @HostListener('document:change', ['$event'])
   onChange(event) {
      this.sendData(event);
   }
}

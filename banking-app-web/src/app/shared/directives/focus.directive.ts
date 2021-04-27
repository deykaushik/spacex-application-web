import { Directive, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { Ng2DeviceService } from 'ng2-device-detector';

import { Constants } from '../../core/utils/constants';

@Directive({
   selector: '[appFocus]'
})

export class DmFocusDirective implements AfterViewInit {
   noAutoFocusDevice = Constants.noAutoFocusDevice;
   constructor(private _el: ElementRef, private renderer: Renderer, private deviceService: Ng2DeviceService) {
   }

   ngAfterViewInit() {
      if (this.noAutoFocusDevice.indexOf(this.deviceService.device) === -1) {
         this.renderer.invokeElementMethod(this._el.nativeElement, 'focus');
      }
   }

}

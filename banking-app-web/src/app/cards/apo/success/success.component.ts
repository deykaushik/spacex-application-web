import { Component, OnInit, Output, EventEmitter, Renderer2 } from '@angular/core';
import { ApoConstants } from '../apo-constants';

@Component({
   selector: 'app-apo-success',
   templateUrl: './success.component.html',
   styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

   @Output() onHide = new EventEmitter();
   routeUrls = ApoConstants.apo.routeUrls;
   messages = ApoConstants.apo.messages;
   showSuccess: boolean;

   constructor(private render: Renderer2) {
   }

   ngOnInit() {
      this.showSuccess = true;
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
   }
   exitOverview() {
      this.render.setStyle(document.body, 'overflow-y', 'auto');
      this.showSuccess = false;
      this.onHide.emit(false);
   }
}

import { Component, OnInit, Input } from '@angular/core';


@Component({
   selector: 'app-nav-menu',
   templateUrl: './nav-menu.component.html',
   styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

   @Input() options;
   @Input() navTitle;

   constructor() { }

   ngOnInit() {
   }

}

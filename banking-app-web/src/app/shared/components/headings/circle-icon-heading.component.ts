import { Component, OnInit, Input } from '@angular/core';

@Component({
   selector: 'app-circle-icon-heading',
   templateUrl: './circle-icon-heading.component.html',
   styleUrls: ['./circle-icon-heading.component.scss']
})
export class CircleIconHeadingComponent implements OnInit {

   @Input() heading: string;
   @Input() successful: boolean;
   constructor() { }

   ngOnInit() { }

}

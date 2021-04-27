import { Component, Input, TemplateRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { SysErrorInstanceType } from './../../../core/utils/enums';

@Component({
   selector: 'app-small-overlay',
   templateUrl: './small-overlay.component.html',
   styleUrls: ['./small-overlay.component.scss']
})
export class SmallOverlayComponent {
   @Input() isVisible: boolean;
   @Input() alternate = false;
   @Input() template: TemplateRef<any>;
   sysErrorInstanceType = SysErrorInstanceType;
   constructor( @Inject(DOCUMENT) private document: Document) { }
}

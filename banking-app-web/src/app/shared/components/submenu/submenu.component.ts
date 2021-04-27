import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { TermsService } from './../../terms-and-conditions/terms.service';

import { TermsAndConditionsComponent } from './../../terms-and-conditions/terms-and-conditions.component';
import { Constants } from './../../../core/utils/constants';
import { ISubmenu } from './../../models';
import { BaseComponent } from '../../../core/components/base/base.component';
import { PreFillService } from '../../../core/services/preFill.service';

@Component({
   selector: 'app-submenu',
   templateUrl: './submenu.component.html',
   styleUrls: ['./submenu.component.scss']
})
export class SubmenuComponent extends BaseComponent implements OnInit {
   data: {};
   @Input() options;
   @Input() urlParam;
   @Input() selectedOption;
   @Output() itemClicked = new EventEmitter<boolean>();
   public elementRef;
   bsModalRef: BsModalRef;

   constructor(private router: Router,
      private termsService: TermsService,
      private modalService: BsModalService,
      private preFillService: PreFillService,
      injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.data = {
         isReplay: false,
      };
      if (this.preFillService.activeData) {
         this.preFillService.activeData = this.data;
      }
   }

   onSubmenuClick(event, option) {
      this.selectedOption = option;
      this.navigateNext();
   }

   navigateNext() {
      if (this.selectedOption.path) {
         this.router.navigate(['/' + this.selectedOption.path + (this.urlParam ? ('/' + this.urlParam) : '')]);
      }
      if (this.selectedOption.eventAction) {
         this.sendEvent(this.selectedOption.eventAction);
      }
   }
}

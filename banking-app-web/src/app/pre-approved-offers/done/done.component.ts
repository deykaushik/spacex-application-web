import { Component, OnInit, Input } from '@angular/core';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { Constants } from '../../core/utils/constants';
import { Router } from '@angular/router';

@Component({
   selector: 'app-done',
   templateUrl: './done.component.html',
   styleUrls: ['./done.component.scss']
})
export class DoneComponent implements OnInit {
   content: any;
   @Input() offerId: number;
   heading = Constants.preApprovedOffers.labels.doneScreen.HEADING;
   subHeading = Constants.preApprovedOffers.labels.doneScreen.SUB_HEADING;
   constructor(private preApprovedOffersService: PreApprovedOffersService, private router: Router) { }

   ngOnInit() {
      this.preApprovedOffersService.getScreenMessage(this.offerId, Constants.preApprovedOffers.ScreenIdentifiers.DONE_SCREEN)
         .subscribe(content => {
            this.content = content;
         });
   }
   getContent(content: string, value) {
      for (const key in value) {
         let match;
         const pattern = new RegExp('{' + key + '}', 'g');
         match = pattern.exec(content);
         if (match) {
            if (key === 'email') {
               const email = '<a href="mailto:' + value[key].value + '">';
               content = content.replace(pattern, email + value[key].value + '</a>');
            } else {
               content = content.replace(pattern, value[key].value);
            }
         }
      }
      return content;
   }

   done() {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

}

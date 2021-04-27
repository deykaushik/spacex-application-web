import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { Constants } from '../../core/utils/constants';
import { Router } from '@angular/router';

@Component({
   selector: 'app-wrong-information',
   templateUrl: './wrong-information.component.html',
   styleUrls: ['./wrong-information.component.scss']
})
export class WrongInformationComponent implements OnInit, AfterViewInit {
   isSubmitDisabled: boolean;
   content = [];
   heading = Constants.preApprovedOffers.labels.wrongInformationScreen.HEADING;
   @Input() offerId: number;
   options = [];
   @Output() hideOverlay: EventEmitter<boolean> = new EventEmitter<boolean>();
   constructor(private preApprovedOffersService: PreApprovedOffersService, private router: Router) { }

   ngOnInit() {
      this.preApprovedOffersService.getScreenContent(this.offerId,
         Constants.preApprovedOffers.ScreenIdentifiers.INFORMATION_INCORRECT_SCREEN)
         .subscribe(content => {
            this.content = content[0] ? content[0].content : [];
         });
   }
   getContent(content, value) {
      for (const key in value) {
         const pattern = /{(.*?)}/;
         let match;
         do {
            match = pattern.exec(content);
            if (match) {
               content = content.replace(pattern, value[match[1]].value);
            }
         } while (match);
      }
            return content;
   }

   submitFeedback() {
      const payload = { data: [] };
      const feedbackData = this.preApprovedOffersService.feedbackPayload;
      if (feedbackData.length) {
         payload.data = payload.data.concat(feedbackData);
      }
      this.content.forEach((content, index) => {
         if (this.options[index]) {
            payload.data.push({ id: content.id, content: content.content });
         }
      });

      this.preApprovedOffersService.sendUserContent(payload, this.offerId, Constants.preApprovedOffers.ScreenIdentifiers.DROP_OFF_REASONS)
         .subscribe(content => {
            this.router.navigateByUrl(Constants.routeUrls.dashboard);
         });
   }
   onOptionSelect() {
      this.isSubmitDisabled = !this.options.find(opt => opt === true);
   }
   ngAfterViewInit() {
      this.isSubmitDisabled = !this.options.find(opt => opt === true);
   }

   cancel() {
      this.hideOverlay.emit(true);
   }
}

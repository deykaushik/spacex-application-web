import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { Constants } from '../../core/utils/constants';
import { Router } from '@angular/router';

@Component({
   selector: 'app-feedback',
   templateUrl: './feedback.component.html',
   styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy, AfterViewInit {
   showWrongInfo = false;
   isSubmitDisabled: boolean;
   isDisabled: boolean;
   content = [];
   reasons = [];
   isWrongInfo: boolean;
   heading = Constants.preApprovedOffers.labels.feedbackScreen.HEADING;
   subHeading = Constants.preApprovedOffers.labels.feedbackScreen.SUB_HEADING;
   @Input() offerId: number;
   @Output() hideOverlay: EventEmitter<boolean> = new EventEmitter<boolean>();
      constructor(private preApprovedOffersService: PreApprovedOffersService, private router: Router,
             private changeDetectorRef: ChangeDetectorRef) { }

   ngOnInit() {
      this.preApprovedOffersService.getScreenContent(this.offerId, Constants.preApprovedOffers.ScreenIdentifiers.DROP_OFF_REASONS)
         .subscribe(content => {
            this.content = content[0] ? content[0].content : [];
         });
   }
   ngAfterViewInit() {
      this.isSubmitDisabled = !this.reasons.find(reason => reason === true);
      this.changeDetectorRef.detectChanges();
   }
   onCheckboxClick(index, reason) {
      if (reason.more) {
         this.isWrongInfo = this.reasons[index];
      }
      if (reason.exclusive) {
         this.isWrongInfo = false;
         this.isDisabled = this.reasons[index];
         if (this.reasons[index]) {
            this.reasons = this.reasons.map(a => false);
            this.reasons[index] = true;
         }
      }
      this.isSubmitDisabled = !this.reasons.find( option => option === true);
   }
   submitFeedback() {
      const payload = { data: [] };
      this.content.forEach((content, index) => {
         if (this.reasons[index]) {
            payload.data.push({ id: content.id, content: content.content });
         }
      });
      if (this.isWrongInfo) {
         this.showWrongInfo = true;
         this.preApprovedOffersService.feedbackPayload = payload.data;
      } else {
         this.isSubmitDisabled = true;
         this.preApprovedOffersService.sendUserContent(payload, this.offerId,
            Constants.preApprovedOffers.ScreenIdentifiers.DROP_OFF_REASONS)
            .subscribe(content => {
               this.isSubmitDisabled = false;
               this.router.navigateByUrl(Constants.routeUrls.dashboard);
            });
      }
   }

   ngOnDestroy() {
      this.preApprovedOffersService.feedbackPayload = [];
   }

   cancel() {
      this.hideOverlay.emit(true);
   }

   navigateToFeedback() {
      this.showWrongInfo = false;
   }
}

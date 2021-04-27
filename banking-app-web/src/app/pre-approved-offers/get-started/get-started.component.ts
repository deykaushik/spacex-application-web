import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../core/utils/constants';
import { IGetStarted } from '../pre-approved-offers.model';

@Component({
   selector: 'app-get-started',
   templateUrl: './get-started.component.html',
   styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnInit, AfterViewInit {
   showFeedbackScreen: boolean;
   getStartedVm: IGetStarted;
   isButtonDisabled: boolean;
   offerId: number;
   heading = Constants.preApprovedOffers.labels.getStartedScreen.HEADING;

   constructor(private preApprovedOffersService: PreApprovedOffersService, private route: ActivatedRoute,
      private router: Router) {
      this.route.params.subscribe(params => {
         this.offerId = params.offerid as number;
      });
   }
   ngOnInit() {
      this.getStartedVm = this.preApprovedOffersService.getGetStartedVm();
      if (this.getStartedVm.screen.length <= 0) {
         this.preApprovedOffersService.getScreenContent(this.offerId, Constants.preApprovedOffers.ScreenIdentifiers.EDUCATIONAL_SCREEN)
            .subscribe(content => {
               this.getStartedVm.screen = content[0] ? content[0].content : [];
            });
      }
   }
   ngAfterViewInit() {
      this.onOptionSelect();
   }
   onOptionSelect() {
      this.isButtonDisabled = !(this.getStartedVm.options[0] && this.getStartedVm.options[1]);
   }
   confirmLetsGetStarted() {
      this.isButtonDisabled = true;
      const payload = { data: [] };
      this.getStartedVm.screen.forEach(content => {
         payload.data.push({ id: content.id, content: content.content });
      });
      this.preApprovedOffersService.sendUserContent(payload, this.offerId, Constants.preApprovedOffers.ScreenIdentifiers.EDUCATIONAL_SCREEN)
         .subscribe(content => {
            this.preApprovedOffersService.updateGetStartedVm(this.getStartedVm);
            this.isButtonDisabled = false;
            this.router.navigate([this.router.url + '/apply']);
         });

   }

   exit() {
      this.showFeedbackScreen = true;
   }
   cancel() {
      this.showFeedbackScreen = false;
   }
   goBack() {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }
}

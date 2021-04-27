import { Component, OnInit } from '@angular/core';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { Constants } from '../../core/utils/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { IInformation } from '../pre-approved-offers.model';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';

@Component({
   selector: 'app-information',
   templateUrl: './information.component.html',
   styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
   showDoneScreen: boolean;
   workflowStep: IStepper[];
   informationVm: IInformation;
   isTooltip = [];
   offerId: number;
   showWrongInfo: boolean;
   heading = Constants.preApprovedOffers.labels.informationScreen.HEADING;
   pleaseNote = Constants.preApprovedOffers.labels.informationScreen.NOTE;

   constructor(private workflowService: WorkflowService, private preApprovedOffersService: PreApprovedOffersService,
   private route: ActivatedRoute,
      private router: Router) {
      this.route.params.subscribe(params => {
         this.offerId = params.offerid as number;
      });
   }
   ngOnInit() {
      this.informationVm = this.preApprovedOffersService.getGetInformationVm();
      if (this.informationVm.screen.length <= 0) {
         this.preApprovedOffersService.getInvolvedParties(this.offerId)
            .subscribe(content => {
               this.informationVm.screen = content;
            });
      }
      this.workflowStep = this.workflowService.workflow;
   }
   goBack() {
      this.router.navigate([Constants.routeUrls.offers + this.offerId]);
   }
   acceptClientDetails() {
      if (!this.informationVm.isInfoWrong) {
         const payLoad = {
            status: Constants.preApprovedOffers.offerStatus.CLIENT_DETAILS_ACCEPTED, reason: '',
            screen: Constants.preApprovedOffers.ScreenIdentifiers.CLIENT_DETAILS_SCREEN
         };
         this.preApprovedOffersService.changeOfferStatusById(payLoad, this.offerId).subscribe(response => {
            this.preApprovedOffersService.updateInformationVm(this.informationVm);
            this.workflowStep[0].isValueChanged = false;
            this.workflowStep[0].valid = true;
            this.workflowService.stepClickEmitter.emit(this.workflowStep[1].step);
         });
      } else {
         this.showWrongInfo = true;
      }
   }
   cancel() {
      this.showWrongInfo = false;
   }

}

import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { ActivatedRoute } from '@angular/router';
import { AddStepItem } from '../../shared/components/stepper-work-flow/add-step-item';
import { InformationComponent } from '../information/information.component';
import { Constants } from '../../core/utils/constants';
import { OfferComponent } from '../offer/offer.component';
import { ReviewComponent } from '../review/review.component';
import { DisclosuresComponent } from '../disclosures/disclosures.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  navigationSteps: Array<string>;
  steppers: AddStepItem[];
  offerId: number;
  showFeedbackScreen: boolean;
  constructor(private workflowService: WorkflowService,  private route: ActivatedRoute) {

    this.route.params.subscribe
    (params => this.offerId = params.offerid);
   }

  ngOnInit() {
    this.navigationSteps = [];
    this.steppers = [
       new AddStepItem(InformationComponent),
       new AddStepItem(OfferComponent),
       new AddStepItem(ReviewComponent),
       new AddStepItem(DisclosuresComponent)
    ];
    this.navigationSteps = Constants.preApprovedOffers.steps;
    this.workflowService.workflow = [{ step: this.navigationSteps[0], valid: false, isValueChanged: false },
    { step: this.navigationSteps[1], valid: false, isValueChanged: false },
    { step: this.navigationSteps[2], valid: false, isValueChanged: false },
    { step: this.navigationSteps[3], valid: false, isValueChanged: false }];
  }
  exitProcess() {
    this.showFeedbackScreen = true;
  }
  cancel() {
    this.showFeedbackScreen = false;
  }

}

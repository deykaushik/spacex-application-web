import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IReview, IFieldSection, IPayload } from '../pre-approved-offers.model';
import { Constants } from '../../core/utils/constants';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { CommonUtility } from '../../core/utils/common';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  offerId: number;
  reviewVm: IReview;
  workflowStep: IStepper[];

  heading = Constants.preApprovedOffers.labels.reviewScreen.HEADING;
  subHeading = Constants.preApprovedOffers.labels.reviewScreen.SUB_HEADING;
  note = Constants.preApprovedOffers.labels.reviewScreen.NOTE;
  lifeInsurance = Constants.preApprovedOffers.labels.reviewScreen.LIFE_INSURANCE;
  lifeInsuranceText = Constants.preApprovedOffers.labels.reviewScreen.LIFE_INSURANCE_TEXT;
  lifeInsuranceSubtext = Constants.preApprovedOffers.labels.reviewScreen.LIFE_INSURANCE_SUB_TEXT;
  acceptCredit = Constants.preApprovedOffers.labels.reviewScreen.ACCEPT_CREDIT;
  yes = Constants.preApprovedOffers.labels.reviewScreen.YES;
  no = Constants.preApprovedOffers.labels.reviewScreen.NO;
  pleaseNote = Constants.preApprovedOffers.labels.reviewScreen.PLEASE_NOTE;
  toolTipTxtOne = Constants.preApprovedOffers.labels.reviewScreen.TOOLTIP_TEXTLINE_ONE;
  toolTipTwo = Constants.preApprovedOffers.labels.reviewScreen.TOOLTIP_TEXTLINE_TWO;
  toolTipThree = Constants.preApprovedOffers.labels.reviewScreen.TOOLTIP_TEXTLINE_THREE;

  constructor(private workflowService: WorkflowService,
    private preApprovedOffersService: PreApprovedOffersService,
    private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.offerId = params.offerid;
    });
  }

  ngOnInit() {
    this.reviewVm = this.preApprovedOffersService.getGetReviewVm();
    if (this.reviewVm.fieldSections.length <= 0) {
      const offerVm = this.preApprovedOffersService.getGetOfferVm();
      this.reviewVm.fieldSections = offerVm.fieldSections;
      this.reviewVm.nedbankCreditInsuranceLink = offerVm.nedbankCreditInsuranceLink;
      this.reviewVm.exclusionsLink = offerVm.exclusionsLink;
      this.reviewVm.fieldSections[0].total = this.reviewVm.fieldSections[0].total.replace('/', '');
      this.initialieToolTip(this.reviewVm.fieldSections);
      // tslint:disable-next-line:max-line-length
      this.lifeInsuranceSubtext = CommonUtility.format(this.lifeInsuranceSubtext, this.reviewVm.nedbankCreditInsuranceLink, this.reviewVm.exclusionsLink);
    }
    this.workflowStep = this.workflowService.workflow;
  }

  initialieToolTip(tooltipdata: IFieldSection[]) {
      tooltipdata.forEach(field => {
        this.reviewVm.isToolTip.push([]);
      });
  }

  next() {
    if (this.reviewVm.acceptCredit) {
    const payLoad: IPayload = {
      status: Constants.preApprovedOffers.offerStatus.LOAN_DETAILS_ACCEPTED, reason: '',
      screen: Constants.preApprovedOffers.ScreenIdentifiers.REPAYMENT_REVIEW_SCREEN
    };
    this.preApprovedOffersService.changeOfferStatusById(payLoad, this.offerId).subscribe(response => {
      this.workflowStep[2].isValueChanged = false;
      this.workflowStep[2].valid = true;
      this.workflowService.stepClickEmitter.emit(this.workflowStep[3].step);
    });
    }else {
      this.goToDashboard();
    }
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}

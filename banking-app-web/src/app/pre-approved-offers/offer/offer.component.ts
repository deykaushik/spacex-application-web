import { Component, OnInit } from '@angular/core';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { ActivatedRoute } from '@angular/router';
import { IRangeSliderConfig } from '../../shared/models';
import { ILoanInformationRange, IOffer, IPayload } from '../pre-approved-offers.model';
import { Constants } from '../../core/utils/constants';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { Subject } from 'rxjs/Subject';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { CommonUtility } from '../../core/utils/common';

@Component({
   selector: 'app-offer',
   templateUrl: './offer.component.html',
   styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {
   isMin: boolean;
   isMax: boolean;
   monthlyPayment: number;
   offerId: number;
   workflowStep: IStepper[];
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   amountTransform = new AmountTransformPipe();
   loanAmountChange: Subject<any> = new Subject<any>();
   offerVm: IOffer;
   heading = Constants.preApprovedOffers.labels.offerScreen.HEADING;
   subHeading = Constants.preApprovedOffers.labels.offerScreen.SUB_HEADING;
   loanAmount = Constants.preApprovedOffers.labels.offerScreen.LOAN_AMOUNT;
   errorText = Constants.preApprovedOffers.labels.offerScreen.ERROR_TEXT;
   sliderTitle = Constants.preApprovedOffers.labels.offerScreen.SLIDER_TITLE;
   selectTerm = Constants.preApprovedOffers.labels.offerScreen.SELECT_TERM;
   selectOption = Constants.preApprovedOffers.labels.offerScreen.SELECT_OPTION;
   monthlyRepayment = Constants.preApprovedOffers.labels.offerScreen.MONTHLY_REPAYMENT;
   pleaseNote = Constants.preApprovedOffers.labels.offerScreen.PLEASE_NOTE;
   loanAmountInfo: string;
   sliderMin = Constants.preApprovedOffers.labels.offerScreen.SLIDER_MIN;
   sliderMax = Constants.preApprovedOffers.labels.offerScreen.SLIDER_MAX;
   noteText = Constants.preApprovedOffers.labels.offerScreen.NOTE_TEXT;
   noteSubText = Constants.preApprovedOffers.labels.offerScreen.NOTE_SUBTEXT;

   constructor(private workflowService: WorkflowService, private preApprovedOffersService: PreApprovedOffersService,
      private route: ActivatedRoute) {
      this.route.params.subscribe(params => {
         this.offerId = params.offerid as number;
      });
      this.loanAmountChange.debounceTime(100).subscribe(value => {
         this.offerVm.sliderValue = value;
      });
   }

   ngOnInit() {

      this.offerVm = this.preApprovedOffersService.getGetOfferVm();
      if (this.offerVm.terms.length <= 0) {
         this.preApprovedOffersService.getLoanInformation(this.offerId).subscribe(data => {
            this.offerVm.fieldSections = data.fieldSections;
            this.offerVm.terms = data.ranges.sort((a, b) => a.term - b.term);
            this.offerVm.selectedTerm = data.ranges[0];
            this.offerVm.monthlyPayment = data.totalMonthlyRepayment as number;
            this.offerVm.nedbankCreditInsuranceLink = data.NedbankCreditInsuranceLink;
            this.offerVm.exclusionsLink = data.ExclusionsLink;
            this.setControls();
            this.setTermsDropDown(this.offerVm.selectedTerm.maximum);
            this.offerVm.loanValue = this.amountTransform.transform(this.offerVm.selectedTerm.maximum.toString(), this.amountPipeConfig);
            this.offerVm.sliderValue = this.offerVm.loanValue;
            this.formatString();
         });
      } else {
         this.formatString();
      }
      this.workflowStep = this.workflowService.workflow;
   }

   formatString() {
      this.sliderMin = CommonUtility.format(
         this.sliderMin, this.amountTransform.transform(this.offerVm.config.min.toString(), this.amountPipeConfig));
      this.sliderMax = CommonUtility.format(this.sliderMax, this.amountTransform.transform(
         this.offerVm.config.max.toString(), this.amountPipeConfig));
   }

   onTermChange(value) {
      if (value.term !== this.offerVm.selectedTerm.term) {
         this.offerVm.selectedTerm = value;
         this.offerVm.showCalculate = true;
         const amount = parseFloat(this.amountTransform.parse(this.offerVm.loanValue.toString()));
         this.setTermsDropDown(amount);
      }
   }
   onSliderValueChanged(value) {
      this.offerVm.showCalculate = true;
      this.validate(value);
      this.checkForMinMax(value);
      this.offerVm.loanValue = this.amountTransform.transform(value.toString(), this.amountPipeConfig);
      this.loanAmountChange.next(value);
      this.setTermsDropDown(value);
   }
   onAmountChange(event) {
      this.offerVm.showCalculate = true;
      const value = parseFloat(this.amountTransform.parse(event.target.value));
      this.checkForMinMax(value);
      this.offerVm.loanValue = this.amountTransform.transform(value.toString(), this.amountPipeConfig);
      this.offerVm.sliderValue = this.offerVm.loanValue;
      if (!this.validate(value)) {
         this.setTermsDropDown(value);
      }
   }
   validate(value: number) {
      this.offerVm.amountInvalid = !(value >= this.offerVm.config.min && value <= this.offerVm.config.max);
      return this.offerVm.amountInvalid;
   }
   next() {
      const payLoad: IPayload = {
         status: Constants.preApprovedOffers.offerStatus.LOAN_OFFER_ACCEPTED, reason: '',
         screen: Constants.preApprovedOffers.ScreenIdentifiers.LOAN_OFFER_SCREEN
      };
      this.preApprovedOffersService.changeOfferStatusById(payLoad, this.offerId).subscribe(response => {
         this.workflowStep[1].isValueChanged = false;
         this.workflowStep[1].valid = true;
         this.workflowService.stepClickEmitter.emit(this.workflowStep[2].step);
      });
   }
   setTermsDropDown(value) {
      this.offerVm.termsAvailable = this.offerVm.terms.filter(term => value <= term.maximum
         && value >= term.minimum);
      this.offerVm.selectedTerm = this.offerVm.termsAvailable.find(term => term.term === this.offerVm.selectedTerm.term)
         || this.offerVm.termsAvailable[0];
      this.refreshInterest();
   }
   refreshInterest() {
      this.loanAmountInfo = CommonUtility.format(
         Constants.preApprovedOffers.labels.offerScreen.LOAN_AMOUNT_INFO, this.offerVm.selectedTerm.term,
         this.offerVm.selectedTerm.interestRate);
   }
   calculate() {
      this.offerVm.skeletonMode = true;
      const queryParam = {
         loanamount: this.amountTransform.parse(this.offerVm.loanValue.toString()),
         term: this.offerVm.selectedTerm.term
      };
      this.preApprovedOffersService.getLoanInformation(this.offerId, queryParam).subscribe(data => {
         this.offerVm.fieldSections = data.fieldSections;
         this.offerVm.showCalculate = false;
         this.offerVm.skeletonMode = false;
         this.offerVm.monthlyPayment = data.totalMonthlyRepayment as number;
      });
   }
   formatAmount(event) {
      this.offerVm.loanValue = parseFloat(this.amountTransform.parse(event.target.value));
   }
   private setControls() {
      let minimum = this.offerVm.selectedTerm.minimum, maximum = 0;
      this.offerVm.terms.forEach(element => {
         this.offerVm.selectedTerm = element.maximum > this.offerVm.selectedTerm.maximum ? element : this.offerVm.selectedTerm;
         maximum = this.offerVm.selectedTerm.maximum;
         minimum = Math.min(element.minimum, minimum);
      });
      this.offerVm.config.max = maximum;
      this.offerVm.config.min = minimum;
      this.checkForMinMax(maximum);
   }

   checkForMinMax(value: number) {
      const range = this.offerVm.config.max - this.offerVm.config.min;
      const percentage = (value / range) * 100;
      this.isMax = percentage > 90;
      this.isMin = percentage < 10;
   }

}

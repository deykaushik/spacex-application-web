import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { Moment } from 'moment';
import { OverseaTravelService } from '../overseas-travel.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { IOverseasTravelDetails } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
@Component({
   selector: 'app-select-dates',
   templateUrl: './select-dates.component.html',
   styleUrls: ['./select-dates.component.scss']
})
export class SelectDatesComponent implements OnInit {

   labels = Constants.overseasTravel.labels;
   dateValues = Constants.overseasTravel.dates;
   dateFormat = Constants.formats;
   formatStartDate: Moment;
   formatEndDate: Moment;
   startDate: Moment;
   endDate: Moment;
   selectedStartDate: string;
   selectedEndDate: string;
   minStartDate = moment();
   maxStartDate = CommonUtility.getNextDate(new Date(), this.dateValues.maxStartDate , this.dateValues.days);
   config = CommonUtility.getConfig(this.minStartDate, this.maxStartDate);
   minEndDate = CommonUtility.getNextDate(new Date(), 0, 'day');
   maxEndDate = CommonUtility.getNextDate(new Date(), this.dateValues.count, this.dateValues.years)
      .subtract(this.dateValues.count, <moment.unitOfTime.DurationConstructor>this.dateValues.days);
   endConfig = CommonUtility.getConfig(this.minEndDate, this.maxEndDate);
   workflowSteps: IStepper[];
   overseasTravelDetails: IOverseasTravelDetails;
   validForm: boolean;

   constructor(private workflowService: WorkflowService, private overseaTravelService: OverseaTravelService) { }

   ngOnInit() {
      this.validForm = true;
      this.overseasTravelDetails = this.overseaTravelService.getOverseasTravelDetails();
      this.workflowSteps = this.workflowService.workflow;
      this.formatStartDate = moment(new Date());
      this.formatEndDate = moment(new Date());
      if (this.workflowSteps[1].valid) {
         this.selectedStartDate = this.overseasTravelDetails.fromDate;
         this.selectedEndDate = this.overseasTravelDetails.toDate;
         this.formatStartDate = moment(this.selectedStartDate);
         this.formatEndDate = moment(this.selectedEndDate);
      }
   }

   setStartDate(value) {
      this.startDate = moment(value);
      this.endConfig = CommonUtility.getConfig(moment(),
         CommonUtility.getNextDate(this.startDate, this.dateValues.count, this.dateValues.years)
         .subtract(this.dateValues.count, <moment.unitOfTime.DurationConstructor>this.dateValues.days)
      );
      this.isFormValid();
      if (!(this.formatEndDate > this.startDate)) {
         this.formatEndDate = this.startDate;
      }
      const maxEndDate = CommonUtility.getNextDate(this.startDate, this.dateValues.count, this.dateValues.years)
      .subtract(this.dateValues.count, <moment.unitOfTime.DurationConstructor>this.dateValues.days);
      this.endConfig = CommonUtility.getConfig(this.startDate, maxEndDate);
   }
   setEndDate(value) {
      this.endDate = moment(value);
      this.isFormValid();
   }

   isFormValid() {
      this.validForm = this.startDate <= this.endDate ? true : false;
   }

   onNextClick() {
      this.overseasTravelDetails.fromDate = this.startDate.format(this.dateFormat.momentYYYYMMDD);
      this.overseasTravelDetails.toDate = this.endDate.format(this.dateFormat.momentYYYYMMDD);
      this.overseaTravelService.setOverseasTravelDetails(this.overseasTravelDetails);
      this.workflowSteps[1] = { step: this.workflowSteps[1].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[2].step);
   }

}

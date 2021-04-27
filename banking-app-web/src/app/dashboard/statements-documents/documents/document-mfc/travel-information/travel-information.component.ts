import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { IDatePickerConfig } from 'ng2-date-picker';
import { WorkflowService } from '../../../../../core/services/stepper-work-flow-service';
import { IStepper } from '../../../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../../../core/utils/constants';
import { ICountries, ICrossBorderRequest, ICrossBorder } from '../../../../../core/services/models';
import { AccountService } from '../../../../account.service';

@Component({
   selector: 'app-travel-information',
   templateUrl: './travel-information.component.html',
   styleUrls: ['./travel-information.component.scss']
})
export class TravelInformationComponent implements OnInit {

   labels = Constants.labels.statementAndDocument.documents.mfc.travelInformation;
   values = Constants.VariableValues.statementAndDocument.documents.mfc;
   messages = Constants.messages;
   workflowSteps: IStepper[];
   calendarConfig: IDatePickerConfig;
   formats = Constants.formats;
   selectedCountry: ICountries[] = [];
   dateOnReturn: Date;
   dateOfLeaving: Date;
   tempDateOnReturn: Moment;
   tempDateOfLeaving: Moment;
   mfcCrossBorderRequest: ICrossBorderRequest;
   crossBorder: ICrossBorder;
   insuranceCompanyName: string;
   insurancePolicyNumber: string;
   licensePlateNumber: string;
   isValueSelected = false;

   constructor(private workflowService: WorkflowService, private accountService: AccountService) {
   }

   ngOnInit() {
      this.selectedCountry = [];
      this.mfcCrossBorderRequest = this.accountService.getMfcCrossBorderRequest();
      const country = { name: this.labels.defaultCountry };
      this.workflowSteps = this.workflowService.workflow;
      if (this.mfcCrossBorderRequest.crossBorder) {
         this.selectedCountry = this.mfcCrossBorderRequest.crossBorder.countries;
         this.tempDateOnReturn = moment(this.mfcCrossBorderRequest.crossBorder.dateOfLeaving);
         this.tempDateOnReturn = moment(this.mfcCrossBorderRequest.crossBorder.dateOnReturn);
         this.licensePlateNumber = this.mfcCrossBorderRequest.crossBorder.licensePlateNumber;
         this.insuranceCompanyName = this.mfcCrossBorderRequest.crossBorder.insuranceCompanyName;
         this.insurancePolicyNumber = this.mfcCrossBorderRequest.crossBorder.insurancePolicyNumber;
      } else {
         this.selectedCountry.push(country);
         this.tempDateOfLeaving = moment();
         this.tempDateOnReturn = moment();
      }
      this.setCalendarConfig();
   }


   private setCalendarConfig() {
      this.calendarConfig = {
         format: Constants.formats.fullDate,
         disableKeypress: true,
         min: moment(),
         showGoToCurrent: false,
         monthFormat: Constants.formats.monthFormat,
         openOnFocus: false
      };
   }

   setLeavingDate(date) {
      this.dateOfLeaving = date;
   }

   setRetuningDate(date) {
      this.dateOnReturn = date;
   }

   onNextClick() {
      this.setMfcCrossBorderRequest();
      this.workflowSteps[0] = { step: this.workflowSteps[0].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[1].step);
   }

   onCountrySelect(currentItem, country) {
      this.isValueSelected = true;
      this.selectedCountry[currentItem].name = country;
   }

   addAnotherCountry() {
      this.isValueSelected = false;
      const country = { name: this.labels.defaultCountry };
      this.selectedCountry.push(country);
   }

   setMfcCrossBorderRequest() {
      this.crossBorder = {} as ICrossBorder;
      this.crossBorder.countries = {} as ICountries[];
      this.crossBorder.countries = this.selectedCountry;
      this.crossBorder.dateOfLeaving = moment(this.dateOfLeaving).format(this.formats.momentYYYYMMDD);
      this.crossBorder.dateOnReturn = moment(this.dateOnReturn).format(this.formats.momentYYYYMMDD);
      this.crossBorder.licensePlateNumber = this.licensePlateNumber;
      this.crossBorder.insuranceCompanyName = this.insuranceCompanyName;
      this.crossBorder.insurancePolicyNumber = this.insurancePolicyNumber;
      this.mfcCrossBorderRequest.crossBorder = this.crossBorder;
      this.accountService.setMfcCrossBorderRequest(this.mfcCrossBorderRequest);
   }

}

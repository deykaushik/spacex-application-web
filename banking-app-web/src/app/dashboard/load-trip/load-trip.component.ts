import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IDatePickerConfig } from 'ng2-date-picker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { CommonUtility } from './../../core/utils/common';
import { Constants } from '../../core/utils/constants';
import { AccountService } from '../account.service';
import { NgForm } from '@angular/forms';
import { ITripCountry, ITripData } from '../../core/services/models';


@Component({
  selector: 'app-load-trip',
  templateUrl: './load-trip.component.html',
  styleUrls: ['./load-trip.component.scss']
})
export class LoadTripComponent implements OnInit, AfterViewInit {
   @ViewChild('loadTripForm') loadTripForm;
   @Input() cardNumber: number;
   modeOfTransport: string;
   email: string;
   minPaymentDate = moment();
   maxPaymentDate = CommonUtility.getNextDate(new Date(), 1, 'years');
   config = CommonUtility.getConfig(this.minPaymentDate, this.maxPaymentDate);
   minPaymentEndDate = moment();
   maxPaymentEndDate = CommonUtility.getNextDate(new Date(), 1, 'years');
   endConfig = CommonUtility.getConfig(this.minPaymentEndDate, this.maxPaymentEndDate);
   patterns = Constants.patterns;
   labels = Constants.labels;
   listOfTripCountries: ITripCountry[];
   listOfBorderPosts: any;
   selectedCountry: ITripCountry;
   filteredBorderPosts: any;
   selectedBorderPost: any;
   tripCountry: string;
   tripBorderPost: any;
   modeOfTravel: any;
   startDate:  Moment;
   endDate: Moment;
   formatDate: Moment;
   formatEndDate: Moment;
   inProgress: boolean;
   loading: boolean;
   refId: number;
   dateFormats = Constants.formats;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
     this.loading = false;
     this.refId = + new Date(); // to generate current timestamp
     this.accountService.getTripCountryList().subscribe(response => {
        this.listOfTripCountries = response.data;
     });
     this.formatDate = moment(this.startDate);
     this.formatEndDate = moment(this.endDate);
  }

  ngAfterViewInit() {
    this.loadTripForm.valueChanges
      .subscribe(values => {
        this.validate();
      });
  }

  setStartDate(date) {
     this.startDate = date;
     this.minPaymentEndDate = moment(this.startDate);
  }

  setEndDate(date) {
      this.endDate = date;
      this.maxPaymentDate = moment(this.endDate);
   }

  selectCountry(country: any) {
    this.selectedCountry = country.item;
    this.getBorderPosts();
  }

  clearPreviousSelected() {
   this.selectedCountry = null;
  }

  validate() {
   if (this.modeOfTransport === this.labels.loadTripLabels.travelModeRoadText) {
      return this.modeOfTransport && this.loadTripForm.valid && this.selectedCountry && this.startDate && this.endDate &&
      this.showHideOnBasisOfModeOfTransport() && this.selectedBorderPost && this.dateValidate();
   } else {
      return this.modeOfTransport && this.loadTripForm.valid && this.selectedCountry && this.startDate && this.endDate &&
      this.showHideOnBasisOfModeOfTransport() && this.dateValidate();
   }
  }

  validateLoadTrip() {

    if (this.validate()) {
      this.inProgress = true;
      const tripData: ITripData = {
        tripReferenceNumber: 'NB-12-23-34',
        clientEmail: this.email,
        destination: this.selectedCountry.countryDesc,
        departureDate: moment(this.startDate).format(this.dateFormats.momentYYYYMMDD),
        returnDate: moment(this.endDate).format(this.dateFormats.momentYYYYMMDD),
        modeOfTransport: this.modeOfTransport.toUpperCase(),
        borderPost: this.selectedBorderPost ? this.selectedBorderPost.postName : '',
        tripStatus: 'NEW',
        clientReferenceNumber: 'W' + this.refId // prepending 'W' to get web related required format ex: W123455838
      };
      this.accountService.loadTrip(tripData, this.cardNumber).subscribe((response) => {
        this.inProgress = false;
      }, (error) => {
        if (error.status === 200) {
          this.accountService.loadTripStatusEmitter.emit(true);
          this.accountService.loadTripRefEmitter.emit('W' + this.refId);
        }
        this.inProgress = false;
      });
    }
  }

  getBorderPosts() {
     this.filteredBorderPosts = [];
     this.loading = true;
     if (this.modeOfTransport === this.labels.loadTripLabels.travelModeRoadText && this.selectedCountry) {
      this.accountService.getTripBorderPostList().subscribe(response => {
         this.listOfBorderPosts = response.data.map((post) => {post.postName.trim(); post.country.trim(); return post; });
         this.filteredBorderPosts = this.listOfBorderPosts.filter(post => {
            return post.country.trim() === this.selectedCountry.countryDesc;
         });
         this.loading = false;
         this.formatDate = moment(this.startDate);
         this.formatEndDate = moment(this.endDate);
      });
     }else {
         this.loading = false;
     }
  }

  showHideOnBasisOfModeOfTransport() {
    if (this.modeOfTransport === this.labels.loadTripLabels.travelModeRoadText) {
      return !((this.modeOfTransport === this.labels.loadTripLabels.travelModeRoadText) && (this.filteredBorderPosts.length === 0));
    } else if (this.modeOfTransport && this.modeOfTransport !== this.labels.loadTripLabels.travelModeRoadText) {
      return true;
    } else {
      return false;
    }
  }

  selectBorderPost(postName) {
    this.selectedBorderPost = postName;
  }

  dateValidate() {
     return (this.startDate > this.endDate) ? false : true;
  }

}

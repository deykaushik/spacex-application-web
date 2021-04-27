import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';

import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OverseaTravelService } from '../overseas-travel.service';
import { ICountryListCheckboxDetails, IOverseasTravelDetails, ICountriesSelected, ICountrycodes } from './../../../core/services/models';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../core/utils/constants';
@Component({
   selector: 'app-select-countries',
   templateUrl: './select-countries.component.html',
   styleUrls: ['./select-countries.component.scss']
})
export class SelectCountriesComponent implements OnInit {
   @ViewChild('input') input: ElementRef;
   labels = Constants.overseasTravel.labels;
   workflowSteps: IStepper[];
   countries: ICountryListCheckboxDetails[];
   CountriesValues: ICountryListCheckboxDetails;
   selectedCountry: ICountryListCheckboxDetails[];
   dropdownOpen: boolean;
   query: string;
   overseasTravelDetails: IOverseasTravelDetails;
   validForm: boolean;
   selectedArray: ICountriesSelected[];
   selectedArrayObj: ICountriesSelected;
   countriesLists: ICountrycodes[];

   constructor(private workflowService: WorkflowService, private overseaTravelService: OverseaTravelService, private renderer: Renderer) {
   }

   ngOnInit() {
      this.dropdownOpen = false;
      this.validForm = false;
      this.query = this.labels.chooseCountry;
      this.workflowSteps = this.workflowService.workflow;
      this.countries = [] as ICountryListCheckboxDetails[];
      this.CountriesValues = {} as ICountryListCheckboxDetails;
      this.selectedArray = [] as ICountriesSelected[];
      this.selectedArrayObj = {} as ICountriesSelected;
      this.selectedCountry = [] as ICountryListCheckboxDetails[];
      this.overseasTravelDetails = this.overseaTravelService.getOverseasTravelDetails();
      if (this.workflowSteps[2].valid) {
         this.overseasTravelDetails.countries.forEach(obj => {
            this.selectedArrayObj = {} as ICountriesSelected;
            this.selectedArrayObj.description = obj;
            this.selectedArrayObj.isChecked = true;
            this.selectedArray.push(this.selectedArrayObj);
         });
      } else {
         this.overseasTravelDetails.countries = [];
      }
      if (!this.workflowSteps[2].valid) {
        this.overseaTravelService.getCountryLists().subscribe(response => {
          this.overseaTravelService.setCountriesData(response);
          this.getCountryLists();
        });
      } else {
        this.getCountryLists();
      }
   }

   getCountryLists() {
      this.countriesLists = this.overseaTravelService.getCountriesData();
      this.countriesLists.forEach(country => {
            if (country.description !== this.labels.southAfrica) {
               this.CountriesValues = {} as ICountryListCheckboxDetails;
               this.CountriesValues.isChecked = false;
               this.CountriesValues.countries = country;
               this.countries.push(this.CountriesValues);
               this.countries.sort(function(a, b) {
                  const textA = a.countries.description.toUpperCase();
                  const textB = b.countries.description.toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
            }
            if (this.workflowSteps[2].valid) {
               this.countries.forEach(card => {
                  this.selectedArray.forEach(obj => {
                     if (obj.description === card.countries.description) {
                        card.isChecked = true;
                        this.onDoneClicked();
                     }
                  });
               });
            }
         });
      this.isFormValid();
   }

   searchQuery() {
      this.query = '';
   }

   setFocus() {
    this.query = '';
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
   }

   onCountrySelected(countrySelected) {
      const index = this.countries.findIndex(obj => obj.countries.code === countrySelected.countries.code);
      if (index !== -1 && !countrySelected.isChecked) {
         this.countries[index].isChecked = true;
      } else {
         this.countries[index].isChecked = false;
         if (this.workflowSteps[2].valid) {
          this.removeSelectedCountry(countrySelected);
         }
      }
      this.dropdownOpen = false;
   }
   isRemoveAll() {
      return this.countries.find(country => country.isChecked === true) ? true : false;
   }

   onCancelClicked() {
      this.countries.forEach(obj => {
         if (obj.isChecked === true && this.selectedCountry.length < 1) {
            obj.isChecked = false;
         } else {
            this.dropdownOpen = true;
         }
      });
      this.query = this.selectedCountry.length < 1 ? this.labels.chooseCountry : this.labels.addMoreCountries;
      this.isFormValid();
   }
   onDoneClicked() {
      this.selectedCountry = [] as ICountryListCheckboxDetails[];
      this.countries.forEach(country => {
         if (country.isChecked) {
            this.selectedCountry.push(country);
            this.query = this.labels.addMoreCountries;
         }
      });
      this.dropdownOpen = true;
      this.isFormValid();
   }

   removeSelectedCountry(country) {
      const index = this.selectedCountry.findIndex(obj => obj.countries.description === country.countries.description);
      this.selectedCountry.forEach(value => {
         if (value.countries.description === country.countries.description) {
            value.isChecked = false;
         }
      });
      if (this.selectedCountry.length <= 1) {
         this.countries.forEach(obj => obj.isChecked = false);
      }
      this.selectedCountry.splice(index, 1);
      this.isFormValid();
   }

   removeAllCheckedCountries() {
      if (!this.workflowSteps[2].valid) {
         this.countries.forEach(obj => obj.isChecked = false);
         this.selectedCountry = [] as ICountryListCheckboxDetails[];
         this.query = this.labels.chooseCountry;
         this.isFormValid();
      } else {
         this.countries.forEach(card => {
            this.selectedArray.forEach(obj => {
               if (obj.description === card.countries.description) {
                  card.isChecked = false;
                  this.selectedCountry = [] as ICountryListCheckboxDetails[];
                  this.query = this.labels.chooseCountry;
                  this.isFormValid();
               }
            });
         });
      }
      this.dropdownOpen = true;
   }

   isFormValid() {
      for (let index = 0; index < this.countries.length; index++) {
         if (this.countries[index].isChecked === true) {
            this.validForm = true;
            break;
         } else {
            this.validForm = false;
         }
      }
   }
   onNextClick() {
      this.overseasTravelDetails.countries = [];
      this.selectedCountry.forEach(country => {
        if (country.isChecked) {
          this.overseasTravelDetails.countries.push(country.countries.description);
        }
      });
      this.overseaTravelService.setOverseasTravelDetails(this.overseasTravelDetails);
      this.workflowSteps[2] = { step: this.workflowSteps[2].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[3].step);
   }

}

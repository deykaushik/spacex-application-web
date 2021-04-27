import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SelectCountriesComponent } from './select-countries.component';
import { OverseaTravelService } from '../overseas-travel.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import {
   IContactPerson, IOverseasTravelDetails,
   ICountrycodes, ICountryListCheckboxDetails, ICountriesSelected
} from '../../../core/services/models';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../core/utils/constants';
import { SearchPipe } from '../../../shared/pipes/search.pipe';
import { assertModuleFactoryCaching } from '../../../test-util';

const mockOverseasContactPerson: IContactPerson = {
   name: '',
   number: ''
};
const mockLocalContactPerson: IContactPerson = {
   name: '',
   number: ''
};
const mockOverseasTravelDetails: IOverseasTravelDetails = {
   fromDate: '',
   toDate: '',
   plasticId: [],
   countries: ['Peru', 'Canada', 'India'],
   primaryNumber: '',
   alteranteNumber: '',
   email: '',
   contactNumber: '',
   overseasContactPerson: mockOverseasContactPerson,
   localContactPerson: mockLocalContactPerson
};
const countryListDetails: ICountrycodes = {
   code: '1234',
   description: 'Canada'
};
const countryListDetails1: ICountrycodes = {
   code: '5678',
   description: 'India'
};
const countryListDetails2: ICountrycodes = {
   code: '4567',
   description: 'Cuba'
};

const mockCountryListsData: ICountrycodes[] = [
   {
      code: '1234',
      description: 'Canada'
   },
   {
      code: '5678',
      description: 'India'
   },
   {
      code: '4567',
      description: 'Cuba'
   }
];
const countryListCheckboxDetails: ICountryListCheckboxDetails[] = [{
   isChecked: false,
   countries: countryListDetails
},
{
   isChecked: true,
   countries: countryListDetails1
},
{
   isChecked: false,
   countries: countryListDetails2
}];

const mockCountryListCheckboxDetailsChecked: ICountryListCheckboxDetails[] = [{
   isChecked: false,
   countries: countryListDetails
},
{
   isChecked: true,
   countries: countryListDetails1
},
{
   isChecked: false,
   countries: countryListDetails2
}];


const mockEmptyCountryListCheckboxDetails: ICountryListCheckboxDetails[] = [
];
const selectedCountriesArray: ICountriesSelected[] = [{
   description: 'Canada',
   isChecked: true
},
{
   description: 'India',
   isChecked: true
},
{
   description: 'Cuba',
   isChecked: true
}];


const mockSelectedCountriesArray: ICountryListCheckboxDetails[] = [{
   isChecked: true,
   countries: countryListDetails
},
{
   isChecked: true,
   countries: countryListDetails1
},
{
   isChecked: true,
   countries: countryListDetails2
}];

const overseaTravelServiceStub = {
   setOverseasTravelDetails: jasmine.createSpy('setOverseasTravelDetails'),
   setCountriesData: jasmine.createSpy('setCountriesData'),
   getOverseasTravelDetails: jasmine.createSpy('getOverseasTravelDetails').and.returnValue(mockOverseasTravelDetails),
   getCountryLists: jasmine.createSpy('getCountryLists').and.returnValue(Observable.of(mockCountryListsData)),
   getCountriesData: jasmine.createSpy('getCountriesData').and.returnValue(mockCountryListsData)
};
const navigationSteps = Constants.overseasTravel.steps;

const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false },
{ step: navigationSteps[4], valid: false, isValueChanged: false }];

describe('SelectCountriesComponent', () => {
   let component: SelectCountriesComponent;
   let fixture: ComponentFixture<SelectCountriesComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
         declarations: [SelectCountriesComponent, SearchPipe],
         providers: [WorkflowService, { provide: OverseaTravelService, useValue: overseaTravelServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(SelectCountriesComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      component.selectedCountry = countryListCheckboxDetails;
      component.countries = countryListCheckboxDetails;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set selected countries array from api when workflow step is valid', () => {
      component.workflowSteps[2].valid = true;
      component.overseasTravelDetails = mockOverseasTravelDetails;
      component.overseasTravelDetails.countries = ['Peru', 'Canada'];
      component.selectedArray = selectedCountriesArray;
      component.ngOnInit();
      expect(component.workflowSteps[2].valid).toBe(true);
   });

   it('should set card property isChecked true when step is valid', () => {
      component.workflowSteps[2].valid = true;
      component.countries = countryListCheckboxDetails;
      component.selectedArray = selectedCountriesArray;
      component.countries[0].isChecked = true;
      component.onDoneClicked();
      component.ngOnInit();
      expect(component.workflowSteps[2].valid).toBe(true);
   });

   it('should call get countryList and set respective values', () => {
      component.workflowSteps[2].valid = true;
      component.overseasTravelDetails = mockOverseasTravelDetails;
      component.overseasTravelDetails.countries = mockOverseasTravelDetails.countries;
      component.selectedArray = selectedCountriesArray;
      component.ngOnInit();
      expect(component.workflowSteps[2].valid).toBe(true);
   });

   it('should call onCountrySelected and set isChecked property true when it is false', () => {
      component.countries = countryListCheckboxDetails;
      const index = 1;
      countryListCheckboxDetails[0].isChecked = false;
      component.countries[index].isChecked = true;
      component.onCountrySelected(countryListCheckboxDetails[0]);
      expect(component.countries).toBeDefined();
      expect(component.countries[index].isChecked).toBe(true);
   });

   it('should call onCountrySelected and set isChecked property false when it is true', () => {
      component.countries = mockCountryListCheckboxDetailsChecked;
      const index = 0;
      component.countries[index].isChecked = false;
      component.onCountrySelected(countryListCheckboxDetails[1]);
      expect(component.countries).toBeDefined();
      expect(component.countries[index].isChecked).toBe(false);
   });

   it('should call isRemoveAll for false value', () => {
      component.countries = countryListCheckboxDetails;
      expect(component.isRemoveAll()).toBe(true);
   });

   it('should call onCancelClicked ', () => {
      component.countries = countryListCheckboxDetails;
      component.selectedCountry = countryListCheckboxDetails;
      component.isFormValid();
      component.onCancelClicked();
      expect(component.dropdownOpen).toBe(true);
      expect(component.query).toEqual(Constants.overseasTravel.labels.addMoreCountries);
   });


   it('should call onCancelClicked for empty countries and when countries checked', () => {
      component.countries = countryListCheckboxDetails;
      component.countries[0].isChecked = false;
      component.selectedCountry = mockEmptyCountryListCheckboxDetails;
      component.isFormValid();
      component.onCancelClicked();
      expect(component.query).toEqual(Constants.overseasTravel.labels.chooseCountry);
   });

   it('should call onDoneClicked', () => {
      component.countries = mockCountryListCheckboxDetailsChecked;
      component.selectedCountry = [];
      component.query = Constants.overseasTravel.labels.addMoreCountries;
      component.isFormValid();
      component.onDoneClicked();
      expect(component.query).toEqual(Constants.overseasTravel.labels.addMoreCountries);
      expect(component.dropdownOpen).toEqual(true);
   });

   it('should call removeSelectedCountry ', () => {
      const index = 1;
      component.selectedCountry = countryListCheckboxDetails;
      component.removeSelectedCountry(countryListCheckboxDetails[0]);
      component.selectedCountry = [];
      component.removeSelectedCountry(countryListCheckboxDetails[0]);
      expect(component.query).toEqual(Constants.overseasTravel.labels.addMoreCountries);
   });

   it('should call removeAllCheckedCountries with step invalid', () => {
      component.workflowSteps[2].valid = false;
      component.countries = mockCountryListCheckboxDetailsChecked;
      component.countries[0].isChecked = false;
      component.selectedCountry = [] as ICountryListCheckboxDetails[];
      component.isFormValid();
      component.removeAllCheckedCountries();
      expect(component.query).toEqual(Constants.overseasTravel.labels.chooseCountry);
   });

   it('should call removeAllCheckedCountries with step valid', () => {
      component.workflowSteps[2].valid = true;
      component.countries = mockCountryListCheckboxDetailsChecked;
      component.selectedArray = selectedCountriesArray;
      component.countries[0].isChecked = false;
      component.isFormValid();
      component.removeAllCheckedCountries();
      expect(component.query).toEqual(Constants.overseasTravel.labels.chooseCountry);
   });

   it('should call onNextClick, set the countries details and go to next step', () => {
      component.overseasTravelDetails = mockOverseasTravelDetails;
      component.overseasTravelDetails.countries = [];
      component.selectedCountry = mockSelectedCountriesArray;
      component.onNextClick();
      expect(component.workflowSteps).toBeDefined();
   });

   it('should set query empty value on focus event', () => {
      component.searchQuery();
      expect(component.query).toEqual('');
   });

   it('should set query empty value on calling setFocus method', () => {
      component.setFocus();
      expect(component.query).toEqual('');
   });
});

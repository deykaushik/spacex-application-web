import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadTripComponent } from './load-trip.component';
import { AccountService } from '../account.service';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HighlightPipe } from '../../shared/pipes/highlight.pipe';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

const mockListOfCountry = [{
  countryCde: 'countryCde',
  countryDesc: 'countryDesc'
}];
const mockBorderPostList = [{
  country: 'countryDesc',
  postName: 'postName 1'
},
{
  country: 'abcd',
  postName: 'postName 2'
}];

const accountServiceStub = {
  getTripCountryList: jasmine.createSpy('getTripCountryList').and.returnValue(Observable.of({ data: mockListOfCountry })),
  getTripBorderPostList: jasmine.createSpy('getTripBorderPostList').and.returnValue(Observable.of({ data: mockBorderPostList })),
  loadTrip: jasmine.createSpy('loadTrip').and.returnValue(Observable.of({ loadtrip: 'mockData' }))
};

const accountServiceErrorStub = {
  getTripCountryList: jasmine.createSpy('getTripCountryList').and.returnValue(Observable.of({ data: mockListOfCountry })),
  getTripBorderPostList: jasmine.createSpy('getTripBorderPostList').and.returnValue(Observable.of({ data: mockBorderPostList })),
  loadTrip: jasmine.createSpy('loadTrip').and.returnValue(Observable.throw({ status: 200 })),
  loadTripStatusEmitter: {
    emit: jasmine.createSpy('emit').and.returnValue(Observable.of(true))
  },
  loadTripRefEmitter: {
   emit: jasmine.createSpy('emit').and.returnValue(Observable.of('W1234567'))
  }
};

describe('LoadTripComponent', () => {
  let component: LoadTripComponent;
  let fixture: ComponentFixture<LoadTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadTripComponent, HighlightPipe],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      providers: [{ provide: AccountService, useValue: accountServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function initializerFunction() {
    component.ngOnInit();
    component.setStartDate('Sep 14, 2018');
    component.setEndDate('Sep 14, 2018');
    component.modeOfTransport = 'Road';
    component.loadTripForm = {
      valid: true
    };
    component.selectCountry({ item: { countryCde: 'newcountryCde', countryDesc: 'newcountryDesc' } });
    // component.filteredBorderPosts = ['filteredBorderPosts']
  }


  it('should be created', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    accountServiceStub.getTripCountryList().subscribe();
    expect(component.listOfTripCountries[0].countryCde).toEqual('countryCde');
  });

  it('should set start date', () => {
    const date = new Date();
    const now = moment(date);
    component.setStartDate(now);
    expect(component.startDate).toEqual(now);
  });

  it('should set end date', () => {
    const date = new Date();
    const now = moment(date);
    component.setEndDate(now);
    expect(component.endDate).toEqual(now);
  });

  it('should select country', () => {
    component.selectCountry({ item: { countryCde: 'newcountryCde', countryDesc: 'newcountryDesc' } });
    expect(component.selectedCountry.countryCde).toEqual('newcountryCde');
  });

  it('should validate', () => {
    initializerFunction();
    expect(component.validate()).toBeFalsy();
  });

  it('should validate load trip', () => {
    initializerFunction();
    component.modeOfTransport = 'sdg';
    component.validateLoadTrip();
    accountServiceStub.loadTrip().subscribe(resp => {
      expect(component.inProgress).toBeFalsy();
    });
  });

  it('should get border posts', () => {
    initializerFunction();
    component.getBorderPosts();
    expect(component.listOfBorderPosts).toEqual(mockBorderPostList);
    accountServiceStub.getTripBorderPostList().subscribe();
    // expect(component.filteredBorderPosts[0].country).toEqual('countryDesc');
  });

  it('show/Hide On the Basis Of Mode Of Transport', () => {
    initializerFunction();
    expect(component.showHideOnBasisOfModeOfTransport()).toBeFalsy();
  });

  it('should update selected border post', () => {
    component.selectBorderPost({ postName: 'abcd' });
    expect(component.selectedBorderPost).toEqual({ postName: 'abcd' });
  });

  it('should clear previous selected', () => {
    component.clearPreviousSelected();
    expect(component.selectedCountry).toBeNull();
  });
});


describe('LoadTripComponent', () => {
  let component: LoadTripComponent;
  let fixture: ComponentFixture<LoadTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadTripComponent, HighlightPipe],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      providers: [{ provide: AccountService, useValue: accountServiceErrorStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function initializerFunction() {
    component.ngOnInit();
    component.setStartDate('Sep 14, 2018');
    component.setEndDate('Sep 14, 2018');
    component.modeOfTransport = 'Road';
    component.loadTripForm = {
      valid: true
    };
    component.selectCountry({ item: { countryCde: 'newcountryCde', countryDesc: 'newcountryDesc' } });
    // component.filteredBorderPosts = ['filteredBorderPosts']
  }

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should validate load trip with no data', () => {
    initializerFunction();
    component.modeOfTransport = 'sdg';
    component.validateLoadTrip();
    accountServiceErrorStub.loadTrip().subscribe(data => data, error => {
      expect(error.status).toEqual(200);
    } );
  });

});

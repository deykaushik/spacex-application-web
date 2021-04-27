import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoaderService } from '../../../core/services/loader.service';
import { FundTripService } from '../fund-trip.service';
import { ApiService } from '../../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../../core/utils/constants';

const fundtripServiceStub = {
  initializeFundTripWorkflow : jasmine.createSpy('initializeFundTripWorkflow')
};
const tempSummary = {
  title: Constants.labels.fundTripLabels.getQuoteTitle,
  isNavigated: true,
  sequenceId: 1
};

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers : [{ provide: ActivatedRoute, useValue:
         { params: Observable.of({ accountnumber: 1 }) } }, LoaderService, {provide : FundTripService, useValue : fundtripServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.steps[0].summary).toEqual(tempSummary);
    expect(fundtripServiceStub.initializeFundTripWorkflow).toHaveBeenCalled();
  });
});

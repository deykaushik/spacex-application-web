import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadTripStatusComponent } from './load-trip-status.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountService } from '../account.service';
import { Constants } from '../../core/utils/constants';
import { Observable } from 'rxjs/Observable';

const accountServiceStub = {
  referenceNumber: 'W123456768',
  loadTripStatusEmitter: {
    emit : jasmine.createSpy('emit').and.returnValue(Observable.of(false))
  }
};

describe('LoadTripStatusComponent', () => {

  let component: LoadTripStatusComponent;
  let fixture: ComponentFixture<LoadTripStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadTripStatusComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: AccountService, useValue: accountServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadTripStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.successful).toBeTruthy();
    expect(component.heading).toEqual(Constants.labels.loadTripLabels.loadTripSuccessText);
    expect(component.refId).toBeDefined();
  });

  it('should clone status', () => {
    component.closeStatus();
    expect(accountServiceStub.loadTripStatusEmitter.emit).toHaveBeenCalled();
  });
});

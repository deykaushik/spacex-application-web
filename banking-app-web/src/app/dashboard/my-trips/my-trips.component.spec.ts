import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTripsComponent } from './my-trips.component';
import { DataService } from '../fund-trip/data.service';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from './../../test-util';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';

const mockAccountData = {
  AccountName: 'AccountName',
  Balance: 1,
  AvailableBalance: 1,
  AccountNumber: 1234,
  AccountType: 'AccountType',
  AccountIcon: 'AccountIcon',
  NewAccount: true,
  LastUpdate: 'LastUpdate',
  InstitutionName: 'InstitutionName',
  Currency: 'Currency',
  SiteId: 'SiteId',
  ItemAccountId: 'ItemAccountId',
  InterestRate: 1
};

const routerStub = {
  navigate: jasmine.createSpy('navigate').and.returnValue(true)
};

const accountServiceStub = {
  getAllTrips: jasmine.createSpy('getAllTrips').and.returnValue(Observable.of({ trips: ['a', 'b'] })),
  loadTripStatusEmitter: Observable.of('mockData'),
  loadTripRefEmitter: Observable.of('W1234567')
};

const accountServiceErrorStub = {
   getAllTrips: jasmine.createSpy('getAllTrips').and.returnValue(Observable.throw({error: {resultCode: 'R99'}})),
   loadTripStatusEmitter: Observable.of('mockData'),
   loadTripRefEmitter: Observable.of('W1234567')
};

const dataServiceStub = {
  setData: jasmine.createSpy('setData')
};

describe('MyTripsComponent', () => {
  let component: MyTripsComponent;
  let fixture: ComponentFixture<MyTripsComponent>;

  assertModuleFactoryCaching();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyTripsComponent, SkeletonLoaderPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DataService, useValue: dataServiceStub },
        { provide: AccountService, useValue: accountServiceStub },
        { provide: Router, useValue: routerStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    accountServiceStub.loadTripStatusEmitter.subscribe();
    expect(component.trips[0]).toEqual('a');
    component.account = mockAccountData;
    expect(component.accountNumber).toEqual(mockAccountData.AccountNumber);
  });

  it('should show load trip status', () => {
    component.showLoadTripStatus(true);
    expect(component.loadTripOverlayVisible).toBeFalsy();
    expect(component.loadTripStatusOverlayVisible).toBeTruthy();
  });

  it('should open fund trip', () => {
    component.openFundTrip('a');
    expect(dataServiceStub.setData).toHaveBeenCalled();
    expect(routerStub.navigate).toHaveBeenCalled();
  });

  it('should open load trip', () => {
    component.openLoadTrip();
    expect(component.loadTripOverlayVisible).toBeTruthy();
  });

  it('should reset load trip', () => {
    component.resetLoadTrip();
    expect(component.loadTripOverlayVisible).toBeFalsy();
    expect(component.loadTripStatusOverlayVisible).toBeFalsy();
  });
});

const mockTripData = {tripStatus: 'ACTV', topupAllowed: 'Yes'};

describe('MyTripsComponent', () => {
   let component: MyTripsComponent;
   let fixture: ComponentFixture<MyTripsComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
     TestBed.configureTestingModule({
       declarations: [MyTripsComponent, SkeletonLoaderPipe],
       schemas: [NO_ERRORS_SCHEMA],
       providers: [
         { provide: DataService, useValue: dataServiceStub },
         { provide: AccountService, useValue: accountServiceErrorStub },
         { provide: Router, useValue: routerStub }]
     })
       .compileComponents();
   }));

   beforeEach(() => {
     fixture = TestBed.createComponent(MyTripsComponent);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });

   it('should be created with no trips', () => {
      expect(component).toBeTruthy();
   });
   it('should return true for show hide trips', () => {
      expect(component.showHideBuyCurrencyButton(mockTripData)).toBeTruthy();
   });
 });

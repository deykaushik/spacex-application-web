import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PocketTripsComponent } from './pocket-trips.component';
import { AccountService } from '../account.service';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { assertModuleFactoryCaching } from './../../test-util';

const mockDashboardAccountData = {
  ContainerName: 'ContainerName',
  Accounts: [{
    AccountName: 'AccountName',
    Balance: 1,
    AvailableBalance: 1,
    AccountNumber: 1234,
    AccountType: 'TC',
    AccountIcon: 'AccountIcon',
    NewAccount: true,
    LastUpdate: 'LastUpdate',
    InstitutionName: 'InstitutionName',
    Currency: 'Currency',
    SiteId: 'SiteId',
    ItemAccountId: '9876',
    InterestRate: 1
  }],
  ContainerIcon: 'ContainerIcon',
  Assets: 1
};

const routerStub = {
  navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(true)
};

const routeStub = {
  params: Observable.of({ accountId: 'jhgafhadf' })
};

describe('PocketTripsComponent', () => {
  let component: PocketTripsComponent;
  let fixture: ComponentFixture<PocketTripsComponent>;

  const accountServiceStub = {
    getDashboardAccountsData: jasmine.createSpy('getDashboardAccountsData').and.returnValue([mockDashboardAccountData]),
    getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of([mockDashboardAccountData]))
  };

  assertModuleFactoryCaching();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PocketTripsComponent, SkeletonLoaderPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: AccountService, useValue: accountServiceStub }, Injector,
         { provide: ActivatedRoute, useValue: routeStub }, { provide: Router, useValue: routerStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocketTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    routeStub.params.subscribe();
    expect(component.skeletonMode).toBeFalsy();
  });

  it('should change account data', () => {
    component.onAccountChange(mockDashboardAccountData.Accounts[0]);
    expect(component.accountType).toEqual(mockDashboardAccountData.Accounts[0].AccountType);
    expect(component.balance).toEqual(mockDashboardAccountData.Accounts[0].Balance);
    expect(component.removeDebitOrderFlag).toBeFalsy();
  });

  it('should return true if travel card is active', () => {
    component.onAccountChange(mockDashboardAccountData.Accounts[0]);
    expect(component.isTravelCardActive()).toBeTruthy();
  });

  it('should return false if travel card trips not active', () => {
    expect(component.isTrvelCardTripsActive()).toBeTruthy();
  });

  it('should get filtered type accounts', () => {
    component.getFilteredTypeAccounts('CFC');
    expect(component.featureVisible).toBeFalsy();
  });

  it('should get account data', () => {
    component.getAccountData();
    expect(component.accountContainers).toEqual([mockDashboardAccountData]);
  });

  it('should manage Account Containers', () => {
    component.manageAccountContainers([mockDashboardAccountData]);
    expect(component.accountContainers).toEqual([mockDashboardAccountData]);
  });

  it('should update account type', () => {
    component.onAccountChange(mockDashboardAccountData.Accounts[0]);
    component.updateAccountType([mockDashboardAccountData]);
    expect(component.balance).toEqual(mockDashboardAccountData.Accounts[0].Balance);
    expect(component.removeDebitOrderFlag).toBeFalsy();
  });
});
describe('PocketTripsComponent', () => {
  let component: PocketTripsComponent;
  let fixture: ComponentFixture<PocketTripsComponent>;
  const accountServiceStub = {
    getDashboardAccountsData: jasmine.createSpy('getDashboardAccountsData').and.returnValue(null),
    getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of([mockDashboardAccountData]))
  };
  const mockAccountData = {
    AccountName: 'AccountName',
    Balance: 1,
    AvailableBalance: 1,
    AccountNumber: 1234,
    AccountType: 'abcd',
    AccountIcon: 'AccountIcon',
    NewAccount: true,
    LastUpdate: 'LastUpdate',
    InstitutionName: 'InstitutionName',
    Currency: 'Currency',
    SiteId: 'SiteId',
    ItemAccountId: '9876',
    InterestRate: 1
  };

  assertModuleFactoryCaching();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PocketTripsComponent, SkeletonLoaderPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: AccountService, useValue: accountServiceStub }, Injector,
         { provide: ActivatedRoute, useValue: routeStub }, { provide: Router, useValue: routerStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocketTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    routeStub.params.subscribe();
    expect(component.skeletonMode).toBeFalsy();
  });

  it('should get account data', () => {
    component.getAccountData();
    expect(accountServiceStub.getDashboardAccounts).toHaveBeenCalled();
    accountServiceStub.getDashboardAccounts().subscribe();
    expect(component.accountContainers).toEqual([mockDashboardAccountData]);
  });

  it('should navigate if account type is not TC', () => {
    component.onAccountChange(mockAccountData);
    expect(routerStub.navigateByUrl).toHaveBeenCalled();
  });
});

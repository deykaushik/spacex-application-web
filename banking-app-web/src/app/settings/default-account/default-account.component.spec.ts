import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../test-util';
import { DefaultAccountComponent } from './default-account.component';
import { IClientDetails, IAccountDetail, IDashboardAccounts } from '../../core/services/models';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../core/utils/constants';
import { RadioButtonListComponent } from '../../shared/controls/radio-button-list/radio-button-list.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { AccountService } from '../../dashboard/account.service';

describe('DefaultAccountComponent', () => {
  let component: DefaultAccountComponent;
  let fixture: ComponentFixture<DefaultAccountComponent>;
  const clientDetails: IClientDetails = {
    FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
    CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
    EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
    Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
  };
  const defaultAccount = { accountType: 'test', accountNumber: '121313', accountName: 'test', itemAccountId: 2 };
  const clientProfileDetailsServiceStub = {
    setDefaultAccountId: jasmine.createSpy('setDefaultAccountId'),
    getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.callFake((accounts: IAccountDetail[]) => {
      return accounts.find(acc => acc.itemAccountId === defaultAccount.itemAccountId.toString());
    }),
    getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
  };
  const mockAccounts: IDashboardAccounts[] = [{
    'ContainerName': 'Bank', 'Accounts':
      [
        {
          'AccountName': 'STOP CHEQU',
          'Balance': 580303387,
          'AvailableBalance': 580287819.94,
          'AccountNumber': 1009000675,
          'AccountType': 'CA',
          'AccountIcon': 'glyphicon-account_current',
          'NewAccount': true,
          'LastUpdate': '2017-08-18 10:51:01 AM',
          'InstitutionName': 'Nedbank (South Africa)',
          'Currency': '&#x52;',
          'SiteId': '16390',
          'ItemAccountId': '1',
          'InterestRate': 0
        },
        {
          'AccountName': 'STOP CHEQU 2',
          'Balance': 580303387,
          'AvailableBalance': 580287819.94,
          'AccountNumber': 10090006753,
          'AccountType': 'CA',
          'AccountIcon': 'glyphicon-account_current',
          'NewAccount': true,
          'LastUpdate': '2017-08-18 10:51:01 AM',
          'InstitutionName': 'Nedbank (South Africa)',
          'Currency': '&#x52;',
          'SiteId': '16390',
          'ItemAccountId': '2',
          'InterestRate': 0
        }
      ],
    'ContainerIcon': 'glyphicon-account_current',
    'Assets': 179946723978.75
  }];
  const accountServiceStub = {
    getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockAccounts)),
    setDefaultAccount: jasmine.createSpy('setDefaultAccount').and.returnValue(Observable.of('OK')),
    refreshAccounts: jasmine.createSpy('refreshAccounts').and.returnValue(Observable.of(mockAccounts))
  };
  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultAccountComponent, RadioButtonListComponent, BottomButtonComponent,
        SpinnerComponent, SkeletonLoaderPipe],
      providers: [{ provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
      { provide: AccountService, useValue: accountServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  it('should select account ', () => {
    component.onAccountSelect(mockAccounts[0].Accounts[0]);
    expect(component.accountsToSetDefault).not.toBeUndefined();
    expect(component.accountsToSetDefault.ItemAccountId).toBe(mockAccounts[0].Accounts[0].ItemAccountId);
  });
  it('should set style for accounts ', () => {
    expect(component.getAccountTypeStyle('CA')).toBe(Constants.accountTypeCssClasses.current);
  });

  it('should set default account ', () => {
    component.accountsToSetDefault = mockAccounts[0].Accounts[0];
    component.setDefaultAccount();
    expect(component.accountsToSetDefault).toBeNull();
  });

  it('should not set default account if there is error ', inject([AccountService, ClientProfileDetailsService],
    (accountService: AccountService, clientService: ClientProfileDetailsService) => {
      accountService.setDefaultAccount = jasmine.createSpy('setDefaultAccount').and.returnValue(Observable.of('error'));
      component.accountsToSetDefault = mockAccounts[0].Accounts[0];
      component.setDefaultAccount();
      expect(component.accountsToSetDefault).not.toBeNull();
    }));
  it('should set default account and error occures ', inject([AccountService, ClientProfileDetailsService],
    (accountService: AccountService, clientService: ClientProfileDetailsService) => {
      accountService.setDefaultAccount = jasmine.createSpy('setDefaultAccount').and.callFake(() => {
        return Observable.create((observer) => {
          observer.error();
          observer.complete();
        });
      });
      component.accountsToSetDefault = mockAccounts[0].Accounts[0];
      component.setDefaultAccount();
      expect(component.accountsToSetDefault).not.toBeNull();
    }));
});

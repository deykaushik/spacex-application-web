import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from './../../test-util';
import { AccountService } from '../account.service';
import { AccountViewMoreDetailComponent } from './account-view-more-detail.component';
import { IDashboardAccount } from '../../core/services/models';

const mockAccountData: IDashboardAccount = {
   AccountName: 'Inv CA2',
   Balance: 1000.00,
   AvailableBalance: 900.00,
   AccountNumber: 1009017640,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
};

const accountServiceSuccessStub = {
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData)
};

const accountServiceFailedStub = {
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(undefined)
};

describe('AccountViewMoreDetailComponent', () => {
   let component: AccountViewMoreDetailComponent;
   let fixture: ComponentFixture<AccountViewMoreDetailComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [AccountViewMoreDetailComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            { provide: AccountService, useValue: accountServiceSuccessStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }), snapshot: {} } }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountViewMoreDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

});

describe('AccountViewMoreDetailComponent', () => {
   let component: AccountViewMoreDetailComponent;
   let fixture: ComponentFixture<AccountViewMoreDetailComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [AccountViewMoreDetailComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            { provide: AccountService, useValue: accountServiceFailedStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }), snapshot: {} } }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountViewMoreDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created when there is no data in service', () => {
      expect(component).toBeTruthy();
   });

});

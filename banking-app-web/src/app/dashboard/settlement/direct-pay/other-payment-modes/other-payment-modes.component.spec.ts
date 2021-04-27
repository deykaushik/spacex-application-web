import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from './../../../../test-util';
import { AccountService } from '../../../account.service';
import { OtherPaymentModesComponent } from './other-payment-modes.component';
import { SkeletonLoaderPipe } from './../../../../shared/pipes/skeleton-loader.pipe';
import { IUniversalBranchCode, ISettlementDetail, IDashboardAccount } from '../../../../core/services/models';

function getUniveralBranchCodes(): IUniversalBranchCode[] {
   return [{
      accountType: 'CA',
      branchCode: '198765'
   }, {
      accountType: 'SA',
      branchCode: '198765'
   }, {
      accountType: 'HL',
      branchCode: '170305'
   }, {
      accountType: 'PL',
      branchCode: '198765'
   }];
}

const mockAccountToTransfer: IDashboardAccount = {
   AccountName: 'PL-SL1',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 4009017640,
   AccountType: 'PL',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0,
   settlementAmt: 100
};

const mockMFCAccountToTransfer: IDashboardAccount = {
   AccountName: 'MFC-SL1',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 5009017640,
   AccountType: 'IS',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '2',
   InterestRate: 0,
   settlementAmt: 100
};

const mockSettlementData: ISettlementDetail = {
   settlementAmt: 100,
   settlementDate: '01-01-0001',
   accountToTransfer: mockAccountToTransfer
};

const mockMFCSettlementData: ISettlementDetail = {
   settlementAmt: 200,
   settlementDate: '01-01-0001',
   accountToTransfer: mockMFCAccountToTransfer
};

const mockUniversalBranchCodes: IUniversalBranchCode[] = getUniveralBranchCodes();

const accountServiceStub = {
   getUniversalBranchCodes: jasmine.createSpy('getUniversalBranchCodes').and.returnValue(Observable.of(mockUniversalBranchCodes)),
   getSettlementData: jasmine.createSpy('getSettlementData').and.returnValue(mockSettlementData)
};


describe('OtherPaymentModesComponent', () => {
   let component: OtherPaymentModesComponent;
   let fixture: ComponentFixture<OtherPaymentModesComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [OtherPaymentModesComponent, SkeletonLoaderPipe],
         providers: [{ provide: AccountService, useValue: accountServiceStub }],
         schemas: [NO_ERRORS_SCHEMA],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(OtherPaymentModesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should close overlay', () => {
      spyOn(component.onClose, 'emit');
      component.closeOverlay();
      expect(component.onClose.emit).toHaveBeenCalledWith(true);
      expect(component.isOverlayVisible).toBe(false);
   });

   it('branch code is undefined if account type is not matched', () => {
      component.accountType = 'INV';
      component.getUniversalBranchCode();
      expect(component.branchCode).toBe(undefined);
   });

   it('branch code is undefined if API returns empty response', () => {
      accountServiceStub.getUniversalBranchCodes.and.returnValue(Observable.of([]));
      component.getUniversalBranchCode();
      expect(component.branchCode).toBe(undefined);
   });

   it('should return MFC settlement as true for MFC settlement accounts', () => {
      accountServiceStub.getSettlementData.and.returnValue(mockMFCSettlementData);
      component.ngOnInit();
      expect(component.isMfCSettlement).toBe(true);
   });

   it('should return HL settlement as true for HL settlement accounts', () => {
      const mockHLSettlementData = mockMFCSettlementData;
      mockHLSettlementData.accountToTransfer.AccountType = 'HL';
      accountServiceStub.getSettlementData.and.returnValue(mockHLSettlementData);
      component.ngOnInit();
      expect(component.isHlSettlement).toBe(true);
   });

});

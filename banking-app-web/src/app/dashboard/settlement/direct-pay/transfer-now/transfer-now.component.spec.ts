import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { assertModuleFactoryCaching } from './../../../../test-util';
import { PreFillService } from '../../../../core/services/preFill.service';
import { TransferNowComponent } from './transfer-now.component';
import { IDashboardAccount, ISettlementDetail } from '../../../../core/services/models';

const accountToTransfer: IDashboardAccount = {
   AccountName: 'Inv CA0',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CA',
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

const mockSettlementData: ISettlementDetail = {
   settlementAmt: 100,
   settlementDate: '01-01-0001',
   accountToTransfer: accountToTransfer
};

const preFillServiceStub = new PreFillService();
preFillServiceStub.settlementDetail = mockSettlementData;

describe('TransferNowComponent', () => {
   let component: TransferNowComponent;
   let fixture: ComponentFixture<TransferNowComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [TransferNowComponent],
         providers: [{ provide: PreFillService, useValue: preFillServiceStub }],
         schemas: [NO_ERRORS_SCHEMA],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TransferNowComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should proceed next', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.proceedNext();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/transfer');
   });

   it('should close overlay', () => {
      spyOn(component.onClose, 'emit');
      component.closeOverlay();
      expect(component.onClose.emit).toHaveBeenCalledWith(true);
      expect(component.isOverlayVisible).toBe(false);
   });
});

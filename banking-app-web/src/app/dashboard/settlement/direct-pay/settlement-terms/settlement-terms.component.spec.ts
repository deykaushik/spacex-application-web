import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { assertModuleFactoryCaching } from './../../../../test-util';
import { HighlightPipe } from './../../../../shared/pipes/highlight.pipe';
import { SettlementTermsComponent } from './settlement-terms.component';
import { ISettlementDetail } from '../../../../core/services/models';

const mockMFCSettlementDetails: ISettlementDetail = {
   settlementAmt: 1200.00,
   settlementDate: '01-01-2018',
   loanSettled: false,
   typeOfProduct: 'IS'
};

const mockPLSettlementDetails: ISettlementDetail = {
   settlementAmt: 1200.00,
   settlementDate: '01-01-2018',
   loanSettled: false,
   typeOfProduct: 'PL'
};

describe('SettlementTermsComponent', () => {
   let component: SettlementTermsComponent;
   let fixture: ComponentFixture<SettlementTermsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SettlementTermsComponent, HighlightPipe],
         schemas: [NO_ERRORS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SettlementTermsComponent);
      component = fixture.componentInstance;
      component.settlementDetails = mockMFCSettlementDetails;
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

   it('should return MFC settlement as true for MFC settlement accounts', () => {
      component.settlementDetails.typeOfProduct = 'IS';
      component.ngOnInit();
      expect(component.isMfCSettlement).toBe(true);
   });

   it('should return MFC settlement as false for Non-MFC settlement accounts', () => {
      component.settlementDetails = mockPLSettlementDetails;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.isMfCSettlement).toBe(false);
   });

   it('should return HL settlement as true for HL settlement accounts', () => {
      component.settlementDetails.typeOfProduct = 'HL';
      component.ngOnInit();
      expect(component.isHlSettlement).toBe(true);
   });

});

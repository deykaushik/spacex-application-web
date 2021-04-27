import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from '../../../test-util';
import { DebitOrderDetailComponent } from './debit-order-detail.component';
import { SkeletonLoaderPipe } from '../../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { IDebitOrder } from '../../../core/services/models';
import { GaTrackingService } from '../../../core/services/ga.service';

const mockdebitOrder: IDebitOrder = {
   'itemAccountId': '2',
   'accountDebited': '1944082565',
   'chargeAmount': 55,
   'contractReferenceNr': ' ',
   'creditorName': 'OLDMUTCOL    19466228920180601',
   'debitOrderType': 'EXE',
   'disputed': false,
   'frequency': '2',
   'lastDebitDate': '2018-06-01T00:00:00',
   'statementDate': '2018-06-01T00:00:00',
   'statementLineNumber': 8,
   'statementNumber': 1017,
   'subTranCode': '00',
   'tranCode': '1424',
   'installmentAmount': 10
};

const mockdebitOrderStop: IDebitOrder = {
   'itemAccountId': '2',
   'accountDebited': '1944082565',
   'chargeAmount': 55,
   'contractReferenceNr': ' ',
   'creditorName': 'OLDMUTCOL    19466228920180601',
   'debitOrderType': 'STP',
   'disputed': false,
   'frequency': '2',
   'lastDebitDate': '2018-06-01T00:00:00',
   'statementDate': '2018-06-01T00:00:00',
   'statementLineNumber': 8,
   'statementNumber': 1017,
   'subTranCode': '00',
   'tranCode': '1424',
   'installmentAmount': 100
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('DebitOrderDetailComponent', () => {
   let component: DebitOrderDetailComponent;
   let fixture: ComponentFixture<DebitOrderDetailComponent>;

   assertModuleFactoryCaching();
   function resetFlags() {
      component.showReverseLink = false;
      component.showStopOrderLink = false;
      component.showCancelStopOrderLink = false;
   }
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [DebitOrderDetailComponent, SkeletonLoaderPipe, AmountTransformPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DebitOrderDetailComponent);
      component = fixture.componentInstance;
      component.selectedAccountDetails = mockdebitOrder;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set the links based on the criteria - successful', () => {
      expect(component.showReverseLink).toBe(true);
      expect(component.showStopOrderLink).toBe(true);
      expect(component.showCancelStopOrderLink).toBe(false);
   });
   it('should set the links based on the criteria - failure', () => {
      mockdebitOrder.installmentAmount = 100;
      resetFlags();
      component.ngOnInit();
      expect(component.showReverseLink).toBe(true);
      expect(component.showStopOrderLink).toBe(false);
      expect(component.showCancelStopOrderLink).toBe(false);
   });
   it('should set the cancel stop order link based on criteria', () => {
      component.selectedAccountDetails = mockdebitOrderStop;
      component.ngOnInit();
      expect(component.showReverseLink).toBe(false);
      expect(component.showStopOrderLink).toBe(false);
      expect(component.showCancelStopOrderLink).toBe(true);
   });
   it('should set the reversed icon based on the disputed flag', () => {
      mockdebitOrder.disputed = true;
      mockdebitOrder.installmentAmount = 10;
      component.selectedAccountDetails = mockdebitOrder;
      component.ngOnInit();
      expect(component.showReverseLink).toBe(false);
      expect(component.showStopOrderLink).toBe(true);
      expect(component.showCancelStopOrderLink).toBe(false);
   });
   it('should set the stopped indicator based on the stopped flag', () => {
      mockdebitOrder.stopped = true;
      mockdebitOrder.installmentAmount = 10;
      component.selectedAccountDetails = mockdebitOrder;
      component.ngOnInit();
      expect(component.showReverseLink).toBe(false);
      expect(component.showStopOrderLink).toBe(false);
      expect(component.showCancelStopOrderLink).toBe(false);
   });
   it('should open the cancel stop overlay', () => {
      component.openCancelStopOverlay();
      expect(component.overlayText).toBe('Cancel');
      expect(component.cancelStopDebitOrderVisible).toBe(true);
   });
   it('should open the stop order overlay', () => {
      component.openStopDebitOrderOverlay();
      expect(component.overlayText).toBe('Cancel');
      expect(component.stopDebitOrderVisible).toBe(true);
   });
   it('should open the reverse order overlay', () => {
      component.openReverseDebitOrderOverlay();
      expect(component.overlayText).toBe('Cancel');
      expect(component.reverseDebitOrderVisible).toBe(true);
   });
   it('should change the button text on overlay depending on successful action', () => {
      component.changeBtnText(false);
      expect(component.overlayText).toBe('Cancel');
      component.changeBtnText(true);
      expect(component.overlayText).toBe('Close');
   });
   it('should hide the reverse order overlay', () => {
      component.overlayText = 'Close';
      spyOn(component.onCloseDebitDetails, 'emit');
      component.hideDisputeOrderPopup();
      expect(component.onCloseDebitDetails.emit).toHaveBeenCalledWith(true);
      expect(component.reverseDebitOrderVisible).toBe(false);
   });
   it('should hide the cancel stopped order overlay', () => {
      component.overlayText = 'Cancel';
      spyOn(component.onCloseDebitDetails, 'emit');
      component.hideCancelStopDebitOrderPopup();
      expect(component.cancelStopDebitOrderVisible).toBe(false);
   });
   it('should hide the stop order overlay', () => {
      component.overlayText = 'Close';
      spyOn(component.onCloseDebitDetails, 'emit');
      component.hideStopDebitOrderPopup();
      expect(component.onCloseDebitDetails.emit).toHaveBeenCalledWith(true);
      expect(component.stopDebitOrderVisible).toBe(false);
   });

   it('should hide the stop order overlay and should take back to details screen', () => {
      component.overlayText = 'Cancel';
      spyOn(component.onCloseDebitDetails, 'emit');
      component.hideStopDebitOrderPopup();
      expect(component.stopDebitOrderVisible).toBe(false);
   });

   it('should be able to stop order from reverse order success overlay', () => {
      spyOn(component.onCloseDebitDetails, 'emit');
      component.goToStopDebitOrder();
      expect(component.reverseDebitOrderVisible).toBe(false);
      expect(component.onCloseDebitDetails.emit).toHaveBeenCalledWith(false);
      expect(component.showReverseLink).toBe(false);
      expect(component.showStopOrderLink).toBe(true);
      expect(component.stopDebitOrderVisible).toBe(true);
      expect(component.overlayText).toBe('Cancel');
   });
   it('should not show any links if criteria is not satisfied', () => {
      mockdebitOrder.subTranCode = '02';
      component.selectedAccountDetails = mockdebitOrder;
      component.ngOnInit();
      expect(component.showReverseLink).toBe(false);
      expect(component.showStopOrderLink).toBe(false);
      expect(component.showCancelStopOrderLink).toBe(false);
   });
});

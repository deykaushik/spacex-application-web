import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelStopOrderComponent } from './cancel-stop-order.component';
import { assertModuleFactoryCaching } from '../../../test-util';
import { IDebitOrder } from '../../../core/services/models';
import { AccountService } from '../../account.service';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GaTrackingService } from '../../../core/services/ga.service';

const mockdebitOrders: IDebitOrder = {
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
   'installmentAmount': 100
};
const accountServiceStub = {
   cancelStopDebitOrder: jasmine.createSpy('cancelStopDebitOrder').and.returnValue(Observable.of(true))
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
describe('CancelStopOrderComponent', () => {
   let component: CancelStopOrderComponent;
   let fixture: ComponentFixture<CancelStopOrderComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [CancelStopOrderComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: AccountService, useValue: accountServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CancelStopOrderComponent);
      component = fixture.componentInstance;
      component.orderDetails = mockdebitOrders;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call api to cancel the stopped debit order and when action is successful', () => {
      spyOn(component.changeButtonText, 'emit');
      component.cancelStopDebitOrder();
      expect(component.stopOrderCancelled).toBe(true);
      expect(component.changeButtonText.emit).toHaveBeenCalledWith(true);
   });
   it('should hide the overlay when close is clicked', () => {
      spyOn(component.onHide, 'emit');
      component.closeCancelStopDebitOrder();
      expect(component.onHide.emit).toHaveBeenCalled();
   });
   it('should set or unset checkbox', () => {
      component.checkBoxClick(true);
      expect(component.checkboxValue).toBe(true);
   });
});

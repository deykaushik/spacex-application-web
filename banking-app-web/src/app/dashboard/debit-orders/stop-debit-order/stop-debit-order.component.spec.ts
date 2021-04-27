import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../account.service';
import { StopDebitOrderComponent } from './stop-debit-order.component';
import { IDebitOrder, IDebitOrderReasons } from '../../../core/services/models';
import { assertModuleFactoryCaching } from '../../../test-util';
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
const mockReasons: IDebitOrderReasons[] = [
   {
      'channelTechType': '80',
      'code': '12',
      'description': 'CTEX'
   },
   {
      'channelTechType': '80',
      'code': '13',
      'description': 'CTAM'
   },
   {
      'channelTechType': '100',
      'code': '10',
      'description': 'I haven\'t authorized this debit on my account'
   },
   {
      'channelTechType': '100',
      'code': '11',
      'description': 'I was debited more than I agreed to'
   },
   {
      'channelTechType': '100',
      'code': '12',
      'description': 'I have cancelled the service '
   },
   {
      'channelTechType': '100',
      'code': '13',
      'description': 'The debit has been previously stopped'
   },
   {
      'channelTechType': '100',
      'code': '14',
      'description': 'Other'
   },
   {
      'channelTechType': '0',
      'code': '0',
      'description': ' '
   }
];

const accountServiceStub = {
   stopDebitOrder: jasmine.createSpy('stopDebitOrder').and.returnValue(Observable.of(true)),
   getDebitOrderReasons: jasmine.createSpy('getDebitOrderReasons').and.returnValue(Observable.of(mockReasons))
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('StopDebitOrderComponent', () => {
   let component: StopDebitOrderComponent;
   let fixture: ComponentFixture<StopDebitOrderComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: AccountService, useValue: accountServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }],
         declarations: [StopDebitOrderComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StopDebitOrderComponent);
      component = fixture.componentInstance;
      component.orderDetails = mockdebitOrders;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call api to stop debit order and when action is successful', () => {
      spyOn(component.changeButtonText, 'emit');
      component.selectedReason = mockReasons[3];
      component.stopDebitOrder();
      expect(component.debitOrderStopped).toBe(true);
      expect(component.changeButtonText.emit).toHaveBeenCalledWith(true);
   });
   it('should hide the overlay when close is clicked', () => {
      spyOn(component.onHide, 'emit');
      component.selectedReason = mockReasons[3];
      component.closeStopDebitOrder();
      expect(component.onHide.emit).toHaveBeenCalled();
   });
   it('should set selected reason for stopping debit order', () => {
      component.onReasonChanged(1);
      expect(component.selectedReason).toBe(mockReasons[3]);
      expect(component.isValid).toBe(true);
   });
   it('should set selected reason as other and no description for stopping debit order', () => {
      component.onReasonChanged(4);
      expect(component.selectedReason).toBe(mockReasons[6]);
      expect(component.isValid).toBe(false);
   });
   it('should set selected reason as other with description for stopping debit order', () => {
      component.onReasonChanged(4);
      expect(component.selectedReason).toBe(mockReasons[6]);
      expect(component.isValid).toBe(false);
      component.reasonTextChanged(12);
      expect(component.remainingLength).toBe(120 - 12);
      expect(component.isValid).toBe(true);
   });
});

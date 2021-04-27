import { async, ComponentFixture, TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';

import { assertModuleFactoryCaching } from './../../../test-util';
import { ReverseOrderComponent } from './reverse-order.component';
import { AccountService } from '../../account.service';
import { IDebitOrdersDetail, IDebitOrder, IDebitOrderReasons } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { NotificationTypes } from '../../../core/utils/enums';
import { SystemErrorService } from '../../../core/services/system-services.service';

const mockDebitOrder: IDebitOrder = {
   'itemAccountId': '4',
   'creditorName': 'BONLIFE    F001167444     2450',
   'installmentAmount': 39.07,
   'accountDebited': '1001006461',
   'lastDebitDate': '2018-05-25T00:00:00',
   'frequency': '',
   'contractReferenceNr': '',
   'debitOrderType': 'EXE',
   'statementNumber': 413,
   'statementLineNumber': 5,
   'statementDate': '2018-05-25T00:00:00',
   'tranCode': '1424',
   'chargeAmount': 55,
   'subTranCode': '00',
   'disputed': true,
   'stopped': false
};
const mockReasons: IDebitOrderReasons[] = [{
   'code': 'Code30',
   'description': 'I didn\'t authiorised the debit order'
},
{
   'code': 'Code32',
   'description': 'I was debited more than I agreed to'
},
{
   'code': 'Code34',
   'description': 'I\'ve cancelled the service'
},
{
   'code': 'Code36',
   'description': 'Other'
}];
const accountServiceStub = {
   disputeAnOrder: jasmine.createSpy('disputeAnOrder').and.returnValue(Observable.of(true)),
   getDebitOrderReasons: jasmine.createSpy('getDebitOrderReasons').and.returnValue(Observable.of(mockReasons))
};
const mockServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});
const systemErrorServiceStub = {
   closeError: jasmine.createSpy('closeError').and.returnValue(null)
};

describe('ReverseOrderComponent', () => {
   let component: ReverseOrderComponent;
   let fixture: ComponentFixture<ReverseOrderComponent>;
   let accountService: AccountService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [NO_ERRORS_SCHEMA],
         imports: [FormsModule],
         declarations: [ReverseOrderComponent],
         providers: [{ provide: AccountService, useValue: accountServiceStub },
         { provide: SystemErrorService, useValue: systemErrorServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ReverseOrderComponent);
      component = fixture.componentInstance;
      component.orderInfo = mockDebitOrder;
      accountService = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should go to success screen to when retry success', inject([AccountService], (service: AccountService) => {
      component.selectedReason = mockReasons[2];
      component.onReasonChanged(1);
      component.onRetryDispute();
      expect(component.currentStatus).toBe(NotificationTypes.Success);
   }));

   it('should go to Error screen to when retry fails', inject([AccountService], (service: AccountService) => {
      component.onReasonChanged(2);
      service.disputeAnOrder = jasmine.createSpy('disputeAnOrder').and.returnValue(Observable.create((observer) => {
         observer.error(new Error('any error'));
         observer.complete();
      }));
      component.onRetryDispute();
      expect(component.currentStatus).toBe(NotificationTypes.Error);
   }));
   it('should show message max retry button clicks', inject([AccountService], (service: AccountService) => {
      component.onReasonChanged(3);
      component.onRetryDispute();
      component.onRetryDispute();
      component.onRetryDispute();
      component.onRetryDispute();
      component.onRetryDispute();
      expect(component.retryLimitExceeded).toBe(true);
   }));
   it('should validate empty Description textbox', () => {
      component.onReasonChanged(3);
      component.otherDescription = '';
      component.validate();
      expect(component.isValid).toBe(false);
   });
   it('should close when pressed Done button', () => {
      spyOn(component.onHide, 'emit');
      component.onDone(true);
      expect(component.onHide.emit).toHaveBeenCalled();
   });
   it('should reflect values when reason changed', () => {
      component.onReasonChanged(1);
      expect(component.selectedReason).toBeDefined();
      expect(component.isValid).toBeTruthy();
   });
   it('should handle when API error occured', () => {
      accountService.disputeAnOrder = jasmine.createSpy('disputeAnOrder').and.returnValue(Observable.throw({ status: 404 }));
      component.selectedReason = mockReasons[3];
      component.otherDescription = 'test description';
      component.disputeOrder();
      expect(component.currentStatus).toBe(NotificationTypes.Error);
   });
   it('form should be invalid as default', () => {
      component.otherDescription = 'this is test description';
      component.selectedReason = { code: '', description: '' };
      component.validate();
      expect(component.isValid).toBeFalsy();
   });
   it('form to be validated on conrtols value change ', (() => {
      component.otherDescription = 'this is test description';
      component.selectedReason = mockReasons[3];
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.isValid).toBeTruthy();
      });
   }));

   it('form to be validated on conrtols value change ', (() => {
      component.otherDescription = 'this is test description';
      component.selectedReason = mockReasons[3];
      const message = component.descChange();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(message).toBe(component.otherDescription.length + '/' + component.descLimit);
      });
   }));

   it('should call api to get reasons for reversing debit order and when api is failure', () => {
      accountServiceStub.getDebitOrderReasons.and.returnValue(mockServiceError);
      component.getReasons();
      expect(systemErrorServiceStub.closeError).toHaveBeenCalled();
   });

   it('should emit event when stop order is triggered from reverse order success screen', () => {
      spyOn(component.stopDebitOrderClicked, 'emit');
      component.stopDebitOrderClickedFromReverse();
      expect(component.stopDebitOrderClicked.emit).toHaveBeenCalled();
   });
});

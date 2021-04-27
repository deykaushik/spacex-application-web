import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement, Component, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { UpdateCardLimitStatusComponent } from './update-card-limit-status.component';
import { CardService } from '../card.service';


const cardServiceStub = {
   updateCardLimit: jasmine.createSpy('updateCardLimit').and.callFake(() => {
      cardServiceStub.cardLimitUpdateEmitter.emit();
   }),
   updateDebitCardLimit: jasmine.createSpy('updateDebitCardLimit').and.callFake(() => {
      cardServiceStub.cardLimitUpdateEmitter.emit();
   }),
   cardLimitUpdateEmitter: new EventEmitter(),
   getCreditCardLimit: jasmine.createSpy('getCreditCardLimit').and.callFake((query, routeParams) => {
      return Observable.of({
         Data: {
            camsDailyAtmCash: 10000,
            camsAtmCashLimit: 100
         },
      });
   }),
   getDebitCardLimit: jasmine.createSpy('getDebitCardLimit').and.callFake((query, routeParams) => {
      return Observable.of({
         Data: 1500
      });
   })
};

describe('UpdateCardLimitStatusComponent', () => {
   let component: UpdateCardLimitStatusComponent;
   let fixture: ComponentFixture<UpdateCardLimitStatusComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [UpdateCardLimitStatusComponent, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: CardService, useValue: cardServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(UpdateCardLimitStatusComponent);
      component = fixture.componentInstance;
      component.limitUpdatedStatus = {
         isLimitUpdated: true,
         oldLimit: 100,
         newLimit: 1000,
         cardNumber: 'aa'
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should retry updating limit for credit card', () => {
      component.limitUpdatedStatus.DCIndicator = 'C';
      component.retryUpdateAtmLimit();
   });

   it('should retry updating limit fouth time', () => {
      component.retryCount = 3;
      component.retryUpdateAtmLimit();
   });
   it('should retry updating debit card limit', () => {
      component.limitUpdatedStatus.DCIndicator = 'D';
      component.limitUpdatedStatus.accountId = '123';
      component.retryUpdateAtmLimit();
   });
   it('should emit on hide', () => {
      component.onDone.subscribe((data) => {
         expect(data).toBe(true);
      });
      component.hide();
   });
});

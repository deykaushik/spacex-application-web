import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { UpdateCardLimitComponent } from './update-card-limit.component';
import { CardService } from '../card.service';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';

const cardServiceStub = {
   updateCardLimit: jasmine.createSpy('updateCardLimit'),
   updateDebitCardLimit: jasmine.createSpy('updateDebitCardLimit'),
   getCreditCardLimit: jasmine.createSpy('getCreditCardLimit').and.callFake((query, routeParams) => {
      return Observable.of({
         data: {
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

describe('UpdateCardLimitComponent', () => {
   let component: UpdateCardLimitComponent;
   let fixture: ComponentFixture<UpdateCardLimitComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [UpdateCardLimitComponent, SkeletonLoaderPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: CardService, useValue: cardServiceStub }]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(UpdateCardLimitComponent);
      component = fixture.componentInstance;
      component.cardInfo = {
         plasticId: 123,
         plasticNumber: '123456 0000 7891',
         plasticStatus: 'Blocked',
         plasticType: '',
         dcIndicator: 'C',
         plasticCustomerRelationshipCode: '',
         plasticStockCode: '',
         plasticCurrentStatusReasonCode: '',
         plasticBranchNumber: '1',
         nameLine: 'Master',
         expiryDate: '2020-11-12 12:00:00 AM',
         issueDate: '',
         plasticDescription: '',
         cardAccountNumber: '999',
         owner: false,
         availableBalance: 123,
         allowATMLimit: false,
         allowBranch: false,
         allowBlock: false,
         allowReplace: false,
         linkedAccountNumber: '123',
         isCardFreeze: false,
         F2FBranch: '',
         ItemAccountId: '1234'
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should check selected limit validation for various possibilities', () => {
      component.limitSliderConfig = {
         max: 10000,
         min: 5000,
         step: 1000
      };

      component.currentLimit = 8000;
      expect(component.validateSelectedLimit(12)).toBe(false);
      expect(component.validateSelectedLimit(100)).toBe(false);
      expect(component.validateSelectedLimit(11000)).toBe(false);
      expect(component.validateSelectedLimit(8000)).toBe(false);
      expect(component.validateSelectedLimit(0)).toBe(false);
      expect(component.validateSelectedLimit(7777)).toBe(false);
      expect(component.validateSelectedLimit(9000)).toBe(true);
   });

   it('should check call to update limit component', () => {
      expect(component.updateAtmLimit()).toBeUndefined();
   });

   it('should check changing of limit by calling onLimitChange', () => {
      component.limitSliderConfig = {
         max: 10000,
         min: 5000,
         step: 1000
      };

      component.currentLimit = 8000;
      component.onLimitChange({ value: 100, isValid: true });
      expect(component.isSelectedLimitValid).toBe(false);
      component.onLimitChange({ value: 9000, isValid: true });
      expect(component.isSelectedLimitValid).toBe(true);
   });
});

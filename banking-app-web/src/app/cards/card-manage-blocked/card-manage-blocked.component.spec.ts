import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../test-util';
import { CardManageBlockedComponent } from './card-manage-blocked.component';
import { HighlightPipe } from './../../shared/pipes/highlight.pipe';
import { Constants } from '../../core/utils/constants';
import { IPlasticCard } from '../../core/services/models';
import { CardService } from '../card.service';

import { ICardBlockResult, ICardBlockInfo, ICardReplaceInfo } from '../models';
import { SystemErrorService } from '../../core/services/system-services.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { WindowRefService } from '../../core/services/window-ref.service';

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
   trackPage: jasmine.createSpy('gtag').and.returnValue({})
};

describe('CardManageBlockedComponent', () => {
   let component: CardManageBlockedComponent;
   let fixture: ComponentFixture<CardManageBlockedComponent>;

   const mockCard: IPlasticCard = {
      plasticId: 1,
      plasticNumber: '123456 0000 7890',
      plasticStatus: 'Blocked',
      dcIndicator: 'C',
      plasticCustomerRelationshipCode: '',
      plasticStockCode: '',
      plasticCurrentStatusReasonCode: '',
      plasticBranchNumber: '1',
      nameLine: 'Master',
      expiryDate: '2020-11-12 12:00:00 AM',
      issueDate: '',
      plasticDescription: '',
      allowBlock: false,
      allowReplace: false,
      linkedAccountNumber: '123',
      cardAccountNumber: '999',
      ItemAccountId: '',
      isCardFreeze: false
   };

   const cardServiceStub = {
      cardLimitUpdateEmitter: new EventEmitter<boolean>(),
      cardBlockStatusEmitter: new EventEmitter<ICardBlockResult>(),
      retryCardBlockEmitter: new EventEmitter<ICardBlockInfo>(),
      replaceCardBranchLocatorEmitter: new EventEmitter<ICardReplaceInfo>(),
      cardReplaceStatusEmitter: new EventEmitter<ICardReplaceInfo>(),
      hideReplaceCardStatusEmitter: new EventEmitter<boolean>(),
      replaceBlockCardEmitter: new BehaviorSubject<boolean>(null),
      updateCardLimit: jasmine.createSpy('updateCardLimit')
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CardService, useValue: cardServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            SystemErrorService, WindowRefService],
         declarations: [CardManageBlockedComponent, HighlightPipe]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CardManageBlockedComponent);
      component = fixture.componentInstance;
      component.card = mockCard;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be show replace card popup', () => {
      component.cardReplaceInfo = {
         cardType: Constants.VariableValues.cardTypes.debit.text,
         branchCode: '9',
         branchName: 'nedbank branch',
         allowBranch: true,
         plasticId: 1,
         cardNumber: 'xxx',
         reason: 'lost'
      };

      component.showReplaceCardPopup();
      expect(component.replaceCardBranchLocatorVisible).toBe(true);
   });

   it('should be show replace card status popup', () => {
      component.card = mockCard;
      component.replaceCardStatus = {
         success: true,
         branchName: 'test branch',
         branchCode: '21',
         cardNumber: '1234567890'
      };

      component.showReplaceCardStatusPopup(component.replaceCardStatus);
      expect(component.replaceCardStatusVisible).toBe(true);
   });

   it('should be hide replace card popup', () => {
      component.hideReplaceCardBranchLocatorPopup();
      expect(component.replaceCardBranchLocatorVisible).toBe(false);
   });

   it('should be hide replace card status popup', () => {
      component.hideReplaceCardStatusPopup();
      expect(component.replaceCardStatusVisible).toBe(false);
   });

   it('should check effect of triggering replace card branch locator from service', () => {
      component.cardReplaceInfo = {
         plasticId: 1,
         cardNumber: component.card.plasticNumber,
         reason: Constants.VariableValues.cardBlockingReasong.lost.text,
         cardType: Constants.VariableValues.cardTypes.debit.text,
         branchCode: '9',
         branchName: 'nedbank branch'
      };

      fixture.detectChanges();
      cardServiceStub.cardReplaceStatusEmitter.emit(component.cardReplaceInfo);

      expect(component.replaceCardBranchLocatorVisible).toBe(false);
   });

   it('should hide replace card status popup after done click', () => {
      cardServiceStub.hideReplaceCardStatusEmitter.emit(false);
      expect(component.replaceCardStatusVisible).toBe(false);
   });

   it('should show replace card on block card', () => {
      cardServiceStub.replaceBlockCardEmitter.next(true);
      expect(component.replaceCardBranchLocatorVisible).toBe(true);
   });

});

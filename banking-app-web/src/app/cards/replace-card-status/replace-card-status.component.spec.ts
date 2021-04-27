import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../test-util';
import { CardService } from '../card.service';
import { ReplaceCardStatusComponent } from './replace-card-status.component';
import { Constants } from '../../core/utils/constants';

const cardServiceStub = {
   replaceCardBranchSelector: jasmine.createSpy('replaceCardBranchSelector'),
   retryReplaceCard: jasmine.createSpy('retryReplaceCard'),
   closeReplaceCardStatusPopup: jasmine.createSpy('closeReplaceCardStatusPopup'),
   branchLocator: jasmine.createSpy('branchLocator'),
   replaceCardPayload: {
      cardnumber: 'xxx',
      reason: 'lost',
      branchcode: Constants.VariableValues.courierCode.toString(),
      branchName: 'any thing',
      isCourier: true,
      allowBranch: true
   }
};

describe('ReplaceCardStatusComponent', () => {
   let component: ReplaceCardStatusComponent;
   let fixture: ComponentFixture<ReplaceCardStatusComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [ReplaceCardStatusComponent],
         providers: [{ provide: CardService, useValue: cardServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ReplaceCardStatusComponent);
      component = fixture.componentInstance;
      component.cardInfo = {
         cardNumber: 'xxx',
         cardType: Constants.VariableValues.cardTypes.debit.text,
         reason: null,
         branchCode: '9',
         branchName: 'nedbank branch',
         success: true
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be able to retry blocking card', () => {
      expect(component.retryReplaceCard()).toBeUndefined();
   });

   it('should be able to hide replacing card status popup', () => {
      expect(component.hideReplaceCardStatusPopup()).toBeUndefined();
   });

   it('should be able to retry 3 times for replacing card', () => {
      expect(component.onRetryReplaceCard()).toBeUndefined();
   });

   it('should be able to retry 3 times for replacing card and loader show', () => {
      component.onRetryReplaceCard();
      expect(component.requestInprogress).toBe(true);
      component.onRetryReplaceCard(); // clicked while old request is in progress so no count increased
      component.requestInprogress = false;
      expect(component.disableRetryButton).toBe(false);
      component.onRetryReplaceCard();
      component.requestInprogress = false;
      expect(component.disableRetryButton).toBe(false);
      component.onRetryReplaceCard();
      component.requestInprogress = false;
      expect(component.disableRetryButton).toBe(false);
      component.onRetryReplaceCard();
      component.requestInprogress = false;
      expect(component.disableRetryButton).toBe(true);
   });

   it('should be able to hide loading after retry 3 times for replacing card request', () => {
      component.onReplaceCard();
      expect(component.isButtonLoader).toBe(false);
      expect(component.requestInprogress).toBe(false);
   });

});

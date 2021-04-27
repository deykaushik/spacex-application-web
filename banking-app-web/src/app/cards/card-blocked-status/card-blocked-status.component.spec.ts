import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../test-util';
import { CardMaskPipe } from './../../shared/pipes/card-mask.pipe';
import { CardService } from '../card.service';
import { CardBlockedStatusComponent } from './card-blocked-status.component';

const cardServiceStub = {
   retryBlockingCard: jasmine.createSpy('retryBlockingCard'),
   closeBlockCardStatusPopup: jasmine.createSpy('closeBlockCardStatusPopup'),
   branchLocator: jasmine.createSpy('branchLocator'),
   replaceBlockCard: jasmine.createSpy('replaceBlockCard')
};

describe('CardBlockedStatusComponent', () => {
   let component: CardBlockedStatusComponent;
   let fixture: ComponentFixture<CardBlockedStatusComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [CardBlockedStatusComponent, CardMaskPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CardService, useValue: cardServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CardBlockedStatusComponent);
      component = fixture.componentInstance;
      component.blockStatus = {
         cardNumber: 'xxx',
         reason: null,
         success: false
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be able to retry blocking card', () => {
      expect(component.retryBlockingCard()).toBeUndefined();
   });

   it('should be able to hide blocking card status popup', () => {
      expect(component.hideBlockCardStatusPopup()).toBeUndefined();
   });

   it('should be able to replace blocking card', () => {
      component.replaceBlockCard();
      expect(cardServiceStub.replaceBlockCard).toHaveBeenCalled();
   });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../test-util';
import { CardMaskPipe } from './../../shared/pipes/card-mask.pipe';
import { BlockCardComponent } from './block-card.component';
import { CardService } from '../card.service';

const cardServiceStub = {
   blockCard: jasmine.createSpy('blockCard')
};

describe('BlockCardComponent', () => {
   let component: BlockCardComponent;
   let fixture: ComponentFixture<BlockCardComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [BlockCardComponent, CardMaskPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CardService, useValue: cardServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BlockCardComponent);
      component = fixture.componentInstance;
      component.cardInfo = {
         plasticId: 123,
         cardNumber: 'xxx',
         reason: 'stolen'
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should try setting reason code for various reasons', () => {

      component.onBlockReasonChanged('retain');
      expect(component.isDamaged).toBe(false);
      expect(component.selectedReason.code).toBe('retain');

      component.onBlockReasonChanged('stolen');
      expect(component.isDamaged).toBe(false);
      expect(component.selectedReason.code).toBe('stolen');

      component.onBlockReasonChanged('lost');
      expect(component.isDamaged).toBe(false);
      expect(component.selectedReason.code).toBe('lost');
   });

   it('should try initiating the component for various block reasons', () => {
      component.cardInfo = {
         plasticId: 123,
         cardNumber: 'xxx',
         reason: 'lost'
      };

      component.ngOnInit();
      expect(component.isDamaged).toBe(false);
   });

   it('should be able to block the card', () => {
      component.blockCard();
      component.blockCard();
      expect(cardServiceStub.blockCard).toHaveBeenCalled();
   });
});

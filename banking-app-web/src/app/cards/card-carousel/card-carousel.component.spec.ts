import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SwiperModule } from 'angular2-useful-swiper';

import 'hammerjs';

import { assertModuleFactoryCaching } from './../../test-util';
import { WindowRefService } from './../../core/services/window-ref.service';
import { CardCarouselComponent } from './card-carousel.component';
import { IPlasticCard } from './../../core/services/models';
import { CardService } from '../card.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const mockCards: IPlasticCard[] = [{
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
   isCardFreeze: false,
   isInitialCard: false
}, {
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
   isCardFreeze: false,
   isInitialCard: false
}, {
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
   isCardFreeze: false,
   isInitialCard: false
}];
const slideData: any = {
   'type': 'responsive', 'classText': 'ngxcarousel4EfyP1', 'deviceType': 'lg',
   'items': 1, 'load': 1, 'deviceWidth': 1536, 'carouselWidth': 1359, 'itemWidth': 1359,
   'visibleItems': { 'start': 1, 'end': 1 }, 'slideItems': 1, 'itemWidthPer': 0, 'itemLength': 4,
   'currentSlide': 2, 'easing': 'cubic-bezier(0, 0, 0.2, 1)', 'speed': 800,
   'transform': { 'xs': 100, 'sm': 100, 'md': 100, 'lg': 100, 'all': 0 },
   'loop': false, 'dexVal': 0, 'touchTransform': 0,
   'touch': { 'active': true, 'swipe': '', 'velocity': 0 }, 'isEnd': false, 'isFirst': false, 'isLast': false
};

describe('CardCarouselComponent - Mobile', () => {
   let component: CardCarouselComponent;
   let fixture: ComponentFixture<CardCarouselComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [
            SwiperModule
         ],
         declarations: [CardCarouselComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{
            provide: WindowRefService, useValue: {
               nativeWindow: {
                  innerWidth: 375
               }
            }
         }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CardCarouselComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should load the carousel with data', () => {
      component.cards = mockCards;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.carouselCards.length).toBe(3);
   });

   it('should change slide on move', () => {
      component.onmoveFn(slideData);
      expect(component.activeSlide).toBe(2);
   });

   it('should set active slide on ngAfterViewChecked', () => {
      component.cards = mockCards;
      component.ngOnChanges();
      fixture.detectChanges();
      component.ngOnInit();
      component.ngAfterViewChecked();
      expect(component.activeSlide).toBe(1);
   });

   it('should set the carousel with initial card', () => {
      component.cards = [mockCards[0]];
      component.ngOnInit();
      expect(component.carouselCards[0].isInitialCard).toBeTruthy();
   });
});

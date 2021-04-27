import { WindowRefService } from './../../core/services/window-ref.service';
import {
   Component, OnInit, Input, OnChanges, EventEmitter, Output,
   ViewChild, ElementRef, AfterViewChecked, ViewChildren
} from '@angular/core';

import { SwiperComponent } from 'angular2-useful-swiper';

import { IPlasticCard } from './../../core/services/models';
import { CardComponent } from '../card/card.component';

@Component({
   selector: 'app-card-carousel',
   templateUrl: './card-carousel.component.html',
   styleUrls: ['./card-carousel.component.scss']
})
export class CardCarouselComponent implements OnChanges, OnInit, AfterViewChecked {

   @Input() cards: Array<IPlasticCard> = [];
   @Output() selected = new EventEmitter<IPlasticCard>();
   public carouselCards: Array<IPlasticCard>;
   carouselConfig: SwiperOptions;
   resetCards = false;
   @ViewChild('usefulSwiper') usefulSwiper: SwiperComponent;
   @ViewChildren(CardComponent) cardComponents;
   public activeSlide: number;

   constructor(private winRef: WindowRefService) {
   }

   // Set the active slide
   private emitSelected() {
      this.selected.emit(this.carouselCards[this.activeSlide]);
   }

   // set the data
   private setData() {
      this.carouselCards = this.cards;
      if (this.carouselCards && this.carouselCards.length > 0) {
         this.carouselCards.length > 1 ? this.carouselCards[1].isInitialCard = true : this.carouselCards[0].isInitialCard = true;
      }
      if (this.usefulSwiper && this.usefulSwiper.swiper) {
         this.usefulSwiper.swiper.update();
      }
      this.emitSelected();
   }

   // fires when slide changes/move
   onmoveFn(data) {
      this.activeSlide = data.currentSlide;
      this.emitSelected();
   }

   // This method sets the intial configuration for the carousel
   private setCarouselConfig() {
      this.carouselConfig = {
         slidesPerView: 3,
         pagination: '.swiper-pagination',
         paginationClickable: true,
         centeredSlides: true,
         speed: 1000,
         initialSlide: 1,
         nextButton: '.swiper-button-next',
         prevButton: '.swiper-button-prev',
         allowSwipeToNext: true,
         allowSwipeToPrev: true,
         mousewheelControl: true,
         mousewheelSensitivity: 1,
         onSlideChangeEnd: () => this.resetCards = true,
         breakpoints: {
            767: {
               allowSwipeToNext: true,
               allowSwipeToPrev: true,
               slidesPerView: 1,
               slidesPerGroup: 1
            }
         },

      };
   }
   ngOnChanges() {
      this.setData();
   }
   ngOnInit() {
      this.setCarouselConfig();
      this.setData();
   }

   ngAfterViewChecked() {
      this.activeSlide = this.usefulSwiper.swiper.activeIndex;
      this.emitSelected();
   }
}

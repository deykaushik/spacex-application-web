import { Component, OnChanges, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

import { IPlasticCard } from './../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { environment } from '../../../environments/environment';

@Component({
   selector: 'app-card',
   templateUrl: './card.component.html',
   styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges, OnInit {
   expiryDate: string;
   truncateLimit = Constants.truncateDescCharLimit.truncateLimit;
   @Input() card: IPlasticCard;
   @Input() isActive: boolean;
   @Input() toReset: boolean;
   rotated = false;
   ImageLoading = true;
   isLoaded = false;
   URL = '';
   hideDetail = false;
   defaultImage = false;
   activateCardLabels = Constants.labels.activateCardLabels;
   creditCardIndicator = Constants.CardTypes.CreditCard;
   cardStatusText: string;
   wobbleFlag: boolean;
   @ViewChild('wrap') wrap: ElementRef;
   @ViewChild('frontCard') frontCard: ElementRef;
   @ViewChild('backCard') backCard: ElementRef;
   constructor() { }

   ngOnInit() {
      this.isActive = this.card.isInitialCard;
      if (this.isActive) {
         this.wrap.nativeElement.classList.add('wobble');
      }
   }

   ngOnChanges() {
      /* We are getting card expiry date in "2019-09-30 12:00:00 AM" format from API. IE requires date in
      "2019-04-30T05:30:00 format" as input to date pipe. Below code is written to support IE */
      if (this.card.expiryDate) {
         const formattedExpiryDate = new Date(this.card.expiryDate.substr(0, 10));
         this.expiryDate = moment(formattedExpiryDate).format();
      }
      this.defaultImage = (this.card.image === null ||
         this.card.image === '' ||
         this.card.image === Constants.CardImages.default);
      if (!this.defaultImage) {
         this.URL = environment.cardImageUrl + Constants.CardImages.resolution + this.card.image + '.png';
      }
      if (!this.isActive) {
         this.removeRotation();
      }
      if (this.toReset) {
         this.isLoaded = false;
         this.rotated = false;
         if (!this.isActive && this.wrap) {
            this.wrap.nativeElement.classList.remove('wobble');
         }
      }
   }

   private removeRotation() {
      this.frontCard.nativeElement.classList.remove('actual');
      this.frontCard.nativeElement.classList.remove('rotate');
      this.backCard.nativeElement.classList.remove('rotate');
      this.backCard.nativeElement.classList.remove('actual');
   }

   onCardClick() {
      if (this.isActive) {
         if (!this.isLoaded) {
            this.isLoaded = true;
            this.removeRotation();
            this.frontCard.nativeElement.classList.add('rotate');
            this.backCard.nativeElement.classList.add('actual');
         } else {
            this.toggleRotation();
         }
         this.rotated = !this.rotated;
      }
   }

   private toggleRotation() {
      if (this.frontCard.nativeElement.classList.contains('rotate')) {
         this.frontCard.nativeElement.classList.remove('rotate');
         this.frontCard.nativeElement.classList.add('actual');
      } else if (this.frontCard.nativeElement.classList.contains('actual')) {
         this.frontCard.nativeElement.classList.remove('actual');
         this.frontCard.nativeElement.classList.add('rotate');
      }
      if (this.backCard.nativeElement.classList.contains('rotate')) {
         this.backCard.nativeElement.classList.remove('rotate');
         this.backCard.nativeElement.classList.add('actual');
      } else if (this.backCard.nativeElement.classList.contains('actual')) {
         this.backCard.nativeElement.classList.remove('actual');
         this.backCard.nativeElement.classList.add('rotate');
      }
   }

   imageLoaded(isLoaded) {
      this.hideDetail = isLoaded;
      this.ImageLoading = false;
   }

   getStatus(): boolean {
      this.cardStatusText = (this.card.plasticStatus === 'Blocked' ? 'Blocked' :
         (this.card.isCardFreeze ? 'Frozen' : (!this.getCardInactiveStatus() ? 'Inactive' : '')));
      return (this.card.plasticStatus === 'Blocked' || this.card.isCardFreeze || !this.getCardInactiveStatus());
   }

   getCardInactiveStatus() {
      if ((this.card.dcIndicator === Constants.CardTypes.CreditCard) || (this.card.dcIndicator === Constants.CardTypes.DebitCard)) {
         const activateCardAction = this.card.actionListItem
            .find(actionItem => actionItem.action === Constants.labels.cardManageConstants.activateCardLabel);
         return activateCardAction.hasOwnProperty('result') ? activateCardAction.result : true;
      } else {
         return true;
      }
   }

}

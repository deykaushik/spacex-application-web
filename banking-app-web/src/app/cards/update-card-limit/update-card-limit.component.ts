import { Component, OnInit, Input } from '@angular/core';

import { IRangeSliderConfig, IRangeSliderEmitModel } from '../../shared/models';
import { CardService } from '../card.service';
import { ICardBlockInfo, ICardLimitInfo } from '../models';
import { Constants } from '../../core/utils/constants';
import { IPlasticCard } from '../../core/services/models';

@Component({
   selector: 'app-update-card-limit',
   templateUrl: './update-card-limit.component.html',
   styleUrls: ['./update-card-limit.component.scss']
})
export class UpdateCardLimitComponent implements OnInit {
   @Input() cardInfo: IPlasticCard;
   isLimitAvailable = false;
   currentLimit = 0;
   oldLimit: number;
   camsDailyAtmCash: number;
   isSelectedLimitValid = false;
   newLimit: number;
   isButtonLoader = false;
   limitSliderConfig: IRangeSliderConfig = {
      min: 100,
      max: 100,
      step: 100
   };
   errorMessages = Constants.labels.updateAtmLimitValidations;
   cardTypes = Constants.CardTypes;
   showLoader = false;
   skeletonMode = false;
   constructor(private cardService: CardService) {
   }

   ngOnInit() {
      this.showLoader = true;
      this.skeletonMode = true;
      if (this.cardInfo.dcIndicator === Constants.CardTypes.CreditCard) {
         this.cardService.getCreditCardLimit(this.cardInfo.plasticId).subscribe(response => {
            this.isLimitAvailable = true;
            this.showLoader = false;
            this.skeletonMode = false;
            this.updateCardInfo(response.data);
         });
      } else {
         this.cardService.getDebitCardLimit(this.cardInfo.ItemAccountId).subscribe(response => {
            this.isLimitAvailable = true;
            this.showLoader = false;
            this.skeletonMode = false;
            this.limitSliderConfig.max = Constants.VariableValues.maxDebitCardATMLimit;
            this.oldLimit = this.currentLimit = (response && response.Data) || 0;
         });
      }
   }

   updateCardInfo(cardInfo: ICardLimitInfo) {
      this.limitSliderConfig.max = Constants.VariableValues.maxDebitCardATMLimit;
      this.oldLimit = this.currentLimit = cardInfo.camsAtmCashLimit;
      this.camsDailyAtmCash = cardInfo.camsDailyAtmCash;
   }

   onLimitChange(rangeSliderModel: IRangeSliderEmitModel) {
      this.newLimit = rangeSliderModel.value;
      this.validateSelectedLimit(rangeSliderModel.value);
   }

   validateSelectedLimit(selectedLimit: number): boolean {
      const isValid = this.isLimitAvailable
         && selectedLimit
         && selectedLimit !== this.currentLimit
         && selectedLimit <= this.limitSliderConfig.max
         && selectedLimit >= this.limitSliderConfig.min
         && !(selectedLimit % this.limitSliderConfig.step);
      this.isSelectedLimitValid = !!isValid;
      return this.isSelectedLimitValid;
   }

   updateAtmLimit() {
      this.isButtonLoader = true;
      if (this.cardInfo.dcIndicator === Constants.CardTypes.CreditCard) {
         this.cardService.updateCardLimit(this.cardInfo.plasticNumber, this.newLimit, this.oldLimit, this.cardInfo.plasticId,
            this.camsDailyAtmCash);
      } else {
         this.cardService.updateDebitCardLimit(this.cardInfo.plasticNumber, this.newLimit, this.oldLimit, this.cardInfo.ItemAccountId);
      }
   }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OverseaTravelService } from '../overseas-travel.service';
import { Constants } from '../../../core/utils/constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { IPlasticCard, ICheckboxValuesOtn, IOverseasTravelDetails, ICardsSelected } from './../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { CardService } from '../../card.service';
@Component({
   selector: 'app-select-card',
   templateUrl: './select-card.component.html',
   styleUrls: ['./select-card.component.scss']
})
export class SelectCardComponent implements OnInit {

   labels = Constants.overseasTravel.labels;
   plasticLabels = Constants.labels;
   patterns = Constants.patterns;
   workflowSteps: IStepper[];
   plasticCards: IPlasticCard[];
   activeCard: ICheckboxValuesOtn[];
   plasticId: number;
   selectedArray: ICardsSelected[];
   selectedArrayObj: ICardsSelected;
   checkbox: ICheckboxValuesOtn;
   overseasTravelDetails: IOverseasTravelDetails;
   card: IPlasticCard[];
   validForm: boolean;
   showLoader: boolean;

   constructor(private workflowService: WorkflowService, private overseaTravelService: OverseaTravelService,
      private route: ActivatedRoute, private cardService: CardService) {
   }

   ngOnInit() {
      this.plasticId = this.overseaTravelService.getPlasticId();
      this.workflowSteps = this.workflowService.workflow;
      this.activeCard = [] as ICheckboxValuesOtn[];
      this.overseasTravelDetails = {} as IOverseasTravelDetails;
      this.card = [] as IPlasticCard[];
      this.selectedArray = [] as ICardsSelected[];
      this.selectedArrayObj = {} as ICardsSelected;
      this.overseasTravelDetails.plasticId = [];
      this.checkbox = {} as ICheckboxValuesOtn;
      if (!this.workflowSteps[0].valid) {
         this.showLoader = true;
         this.cardService.getPlasticCards().subscribe(response => {
            this.showLoader = false;
            this.plasticCards = response;
            this.overseaTravelService.setPlasticCards(this.plasticCards);
            this.getAllPlasticCards();
         });
      } else {
         this.getAllPlasticCards();
      }
   }

   getAllPlasticCards() {
      this.plasticCards = this.overseaTravelService.getPlasticCards();
      /* prepopulating selected cards on edit and stepper click */
      if (this.workflowSteps[0].valid) {
         this.overseasTravelDetails = this.overseaTravelService.getOverseasTravelDetails();
         this.plasticCards.forEach(obj => {
            this.overseasTravelDetails.plasticId.forEach(data => {
               if (obj.plasticId.toString() === data) {
                  this.selectedArrayObj = {} as ICardsSelected;
                  this.selectedArrayObj.plasticId = data;
                  this.selectedArrayObj.isChecked = true;
                  this.selectedArray.push(this.selectedArrayObj);
               }
            });
         });
      }

      this.plasticCards.forEach(card => {
         if (CommonUtility.isActiveCard(card) && !CommonUtility.isGarageCard(card)) {
            /* Pushing the selected card as first value into the active
            card array by using plastic id and pushing other cards in else part*/
            if (card.plasticId === this.plasticId && !this.workflowSteps[0].valid) {
               this.checkbox = {} as ICheckboxValuesOtn;
               this.checkbox.isChecked = true;
               this.checkbox.accounts = card;
               this.activeCard.splice(0, 0, this.checkbox);
            } else {
               this.checkbox = {} as ICheckboxValuesOtn;
               this.checkbox.isChecked = false;
               this.checkbox.accounts = card;
               this.activeCard.push(this.checkbox);
            }
         }
         if (this.workflowSteps[0].valid) {
            this.activeCard.forEach(activeCard => {
               this.selectedArray.forEach(obj => {
                  if (obj.plasticId === activeCard.accounts.plasticId.toString()) {
                     activeCard.isChecked = true;
                  }
               });
            });
         }
      });
      this.isFormValid();
   }

   onCheckboxClicked(card: ICheckboxValuesOtn) {
      const index = this.activeCard.findIndex(obj => obj.accounts.plasticId === card.accounts.plasticId);
      if (index !== -1 && !card.isChecked) {
         this.activeCard[index].isChecked = true;
      } else {
         this.activeCard[index].isChecked = false;
         if (this.workflowSteps[0].valid) {
            const plasticIdsIndex = this.overseasTravelDetails.plasticId.findIndex(obj => obj ===
               this.activeCard[index].accounts.plasticId.toString());
            const cardsIndex = this.card.findIndex(obj => obj.plasticId ===
               this.activeCard[index].accounts.plasticId);
            const selectedArrayIndex = this.selectedArray.findIndex(obj => obj.plasticId ===
               this.activeCard[index].accounts.plasticId.toString());
            this.selectedArray.splice(selectedArrayIndex);
            this.overseasTravelDetails.plasticId.splice(plasticIdsIndex);
            this.card.splice(cardsIndex);
         }
      }
      this.isFormValid();
   }

   isFormValid() {
      for (let index = 0; index < this.activeCard.length; index++) {
         if (this.activeCard[index].isChecked === true) {
            this.validForm = true;
            break;
         } else {
            this.validForm = false;
         }
      }
   }

   onNextClick() {
      this.overseasTravelDetails.plasticId = [];
      this.activeCard.forEach(obj => {
         if (obj.isChecked === true) {
            this.overseasTravelDetails.plasticId.push(obj.accounts.plasticId.toString());
            this.card.push(obj.accounts);
         }
      });
      this.overseaTravelService.setOverseasTravelDetails(this.overseasTravelDetails);
      this.overseaTravelService.setCardDetails(this.card);
      this.workflowSteps[0] = { step: this.workflowSteps[0].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[1].step);
   }
}

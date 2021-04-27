import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PreFillService } from '../../core/services/preFill.service';
import { IChatStar, IChatFeedback } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-chat-rating',
   templateUrl: './chat-rating.component.html',
   styleUrls: ['./chat-rating.component.scss']
})
export class ChatRatingComponent implements OnInit {
   questionNumber: number;
   stars = [];
   ratingSelected: boolean;
   maxStarLimit = 5;
   starObj: IChatStar;
   label = Constants.chatMessages;

   constructor(private prefillService: PreFillService) {
   }

   @Output()
   rating: EventEmitter<IChatFeedback> = new EventEmitter<IChatFeedback>();

   ngOnInit() {
      this.starObj = {
         state: 'disabled',
         counter: 0
      };
      this.label = Constants.chatMessages;
      this.ratingSelected = false;
      if (this.prefillService.chatData) {
         this.questionNumber = this.prefillService.chatData.showSecondQuestion ? 1 : 0;
      }
      this._setStarObject();
   }
   _getStarObj() {
      return JSON.parse(JSON.stringify(this.starObj));
   }

   _setStarObject() {
      for (let i = 0; i < this.maxStarLimit; i++) {
         const star = Object.assign({}, this._getStarObj(), { counter: i });
         this.stars.push(star);
      }
   }

   submitRating(rating: number) {
      this.questionNumber++;
      if (this.prefillService.chatData) {
         this.prefillService.chatData.questionNumber = this.questionNumber;
      }
      const feedback: IChatFeedback = {
         rating: rating,
         questionNumber: this.questionNumber
      };
      this.rating.emit(feedback);
   }

   setActiveStar(activeStar: IChatStar) {
      this.resetActiveStar();
      this.stars.map(item => {
         item.state = (item.counter <= activeStar.counter) ? this.label.activeStatus : this.label.disableStatus;
      });
   }
   resetActiveStar() {
      if (!this.ratingSelected) {
         this.stars.map(item => {
            item.state = this.label.disableStatus;
         });
      }
   }
   setActiveStarState(activeStar: IChatStar) {
      this.ratingSelected = true;
      this.setActiveStar(activeStar);
      this.submitRating(++activeStar.counter);
   }
}

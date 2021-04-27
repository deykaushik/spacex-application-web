import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CardService } from '../card.service';
import { IStatusWarning } from '../models';
import { Constants } from '../../core/utils/constants';
import { SystemErrorService } from '../../core/services/system-services.service';

@Component({
   selector: 'app-card-toggle-status',
   templateUrl: './card-toggle-status.component.html',
   styleUrls: ['./card-toggle-status.component.scss']
})

export class CardToggleStatusComponent implements OnInit {
   @Input() statusWarning: IStatusWarning;
   @Input() plasticNumber: number;
   @Output() cancel = new EventEmitter<boolean>();
   @Output() nextClick = new EventEmitter<boolean>();
   header: string;
   title: string;
   subTitle: string;
   showLoader: boolean;
   labels = Constants.labels.cardManageConstants;

   constructor(private cardService: CardService, private systemErrorService: SystemErrorService) {
   }

   ngOnInit() {
      this.header = this.statusWarning.header;
      this.subTitle = this.statusWarning.subTitle;
      this.title = this.statusWarning.title;
      this.showLoader = false;
   }

   /* when user clicks on 'Next' on popup, api call wil be made to update the toggle status.
   Depending on the api call's response (successfull or failure), the value will be emitted */
   onNext() {
      this.showLoader = true;
      this.cardService.updateCardActionList(this.plasticNumber, this.statusWarning.typeParam).subscribe(statusCode => {
         const emitValue = statusCode === this.labels.successStatusCode ? true : false;
         this.setResponseAction(emitValue);
      }, (error) => {
         this.systemErrorService.closeError();
         this.setResponseAction(false);
      });
   }

   /* When user clicks on cancel button, emit true */
   onCancel() {
      this.cancel.emit(true);
   }

   setResponseAction(emitValue: boolean) {
      this.nextClick.emit(emitValue);
      this.showLoader = false;
   }
}

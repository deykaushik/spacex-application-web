import { Component, Output, EventEmitter } from '@angular/core';
import { Constants } from '../constants';

@Component({
   selector: 'app-processing-time',
   templateUrl: './processing-time.component.html',
   styleUrls: ['./processing-time.component.scss']
})
export class ProcessingTimeComponent {

   @Output() successPage = new EventEmitter<boolean>();
   labels = Constants.labels.openAccount;
   openAccountMessages = Constants.messages.openNewAccount;
   openAccountValues = Constants.variableValues.openNewAccount;

   constructor() {}

   back() {
      this.successPage.emit(true);
   }
}

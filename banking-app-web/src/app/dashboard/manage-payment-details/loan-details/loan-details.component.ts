import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ILoanDebitOrderDetails, IAssetDetails, IActionSuccess, IAlertMessage, ISetAlertMessage } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { AlertActionType, AlertMessageType } from '../../../shared/enums';
@Component({
   selector: 'app-loan-details',
   templateUrl: './loan-details.component.html',
   styleUrls: ['./loan-details.component.scss']
})
export class LoanDetailsComponent implements OnInit, OnChanges {
   @Input() loanDebitOrder: ILoanDebitOrderDetails;
   @Input() status: IActionSuccess;
   loanAssetDetails: IAssetDetails;
   labels = Constants.labels.loanDebitOrder;
   symbols = Constants.symbols;
   dateFormat = Constants.formats.ddMMMMyyyy;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   message: string;
   isShowAlert: boolean;
   alertAction: AlertActionType;
   alertType: AlertMessageType;
   messages = Constants.messages.loanDebitOrder;

   constructor() { }

   ngOnInit() {
      if (this.loanDebitOrder) {
         this.loanAssetDetails = this.loanDebitOrder.assetDetails;
      }
   }
   setMessage(actionMsg: ISetAlertMessage) {
      this.message = actionMsg.message;
      this.alertAction = actionMsg.alertAction;
      this.alertType = actionMsg.alertType;
   }
   ngOnChanges() {
      if (this.status) {
         this.isShowAlert = true;
         if (this.status.isSuccess) {
            this.setMessage({
               message: this.messages.mfcSuccessMsg,
               alertAction: AlertActionType.None,
               alertType: AlertMessageType.Success
            });
         } else {
            this.setMessage({
               message: this.messages.mfcFailureMsg,
               alertAction: AlertActionType.None,
               alertType: AlertMessageType.Error
            });
         }
      }
   }
}

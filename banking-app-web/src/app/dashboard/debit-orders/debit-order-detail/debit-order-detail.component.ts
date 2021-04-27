import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { BaseComponent } from '../../../core/components/base/base.component';
import { environment } from '../../../../environments/environment';
import { Constants } from '../../../core/utils/constants';
import { IDebitOrder } from '../../../core/services/models';
import { GAEvents } from '../../../core/utils/ga-event';
import { IGAEvents } from '../../../core/utils/models';

@Component({
   selector: 'app-debit-order-detail',
   templateUrl: './debit-order-detail.component.html',
   styleUrls: ['./debit-order-detail.component.scss']
})
export class DebitOrderDetailComponent extends BaseComponent implements OnInit {
   @Input() selectedAccountDetails: IDebitOrder;
   @Input() accountType: string;
   @Output() onCloseDebitDetails = new EventEmitter<boolean>();
   labels = Constants.labels.debitOrder;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   dateFormat = Constants.formats.ddMMMMyyyy;
   skeletonLoader = true;
   showReverseLink: boolean;
   showStopOrderLink: boolean;
   showCancelStopOrderLink: boolean;
   debitOrder = Constants.VariableValues.debitOrder;
   cancelStopDebitOrderVisible = false;
   stopDebitOrderVisible = false;
   reverseDebitOrderVisible = false;
   overlayText = this.labels.cancelBtnText;
   stopDebitFeatureAvailable = environment.features.stopDebitOrder;
   cancelStopOrderFeatureAvailable = environment.features.cancelStopOrder;

   constructor(injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.skeletonLoader = false;
      if (this.selectedAccountDetails.debitOrderType !== this.debitOrder.orderType.stopped) {
         if (this.showDebitOrderActions()) {
            this.showReverseLink = true;
            if (this.selectedAccountDetails.installmentAmount < this.debitOrder.installmentAmountValue) {
               this.showStopOrderLink = true;
               this.showCancelStopOrderLink = false;
            }
            if (this.selectedAccountDetails.disputed) {
               this.showReverseLink = false;
            }
            if (this.selectedAccountDetails.stopped) {
               this.hideAllDebitOrderActions();
            }
         } else {
            this.hideAllDebitOrderActions();
         }
      } else {
         this.setCancelStop();
      }
   }

   setCancelStop() {
      this.showReverseLink = false;
      this.showStopOrderLink = false;
      this.showCancelStopOrderLink = true;
   }

   openCancelStopOverlay() {
      const cancelButtonClickedScreen = Object.assign({}, GAEvents.debitOrder.cancelButtonClickedScreen);
      cancelButtonClickedScreen.label += this.accountType;
      this.sendEvent(cancelButtonClickedScreen.eventAction, cancelButtonClickedScreen.label, null, cancelButtonClickedScreen.category);
      this.overlayText = this.labels.cancelBtnText;
      this.cancelStopDebitOrderVisible = true;
   }

   openStopDebitOrderOverlay() {
      const stopDebitOrderScreen = Object.assign({}, GAEvents.debitOrder.stopDebitOrderScreen);
      stopDebitOrderScreen.label += this.accountType;
      this.sendEvent(stopDebitOrderScreen.eventAction, stopDebitOrderScreen.label, null, stopDebitOrderScreen.category);
      this.overlayText = this.labels.cancelBtnText;
      this.stopDebitOrderVisible = true;
   }

   openReverseDebitOrderOverlay() {
      this.overlayText = this.labels.cancelBtnText;
      this.reverseDebitOrderVisible = true;
   }

   hideDisputeOrderPopup() {
      this.reverseDebitOrderVisible = false;
      this.showListing();
   }

   hideCancelStopDebitOrderPopup() {
      if (this.overlayText === this.labels.cancelBtnText) {
         this.sendDropOffGAEvent(GAEvents.debitOrder.cancelStopDebitOrder);
      }
      this.cancelStopDebitOrderVisible = false;
      this.showListing();
   }
   hideStopDebitOrderPopup() {
      if (this.overlayText === this.labels.cancelBtnText) {
         this.sendDropOffGAEvent(GAEvents.debitOrder.stopDebitOrder);
      }
      this.stopDebitOrderVisible = false;
      this.showListing();
   }

   // stop or cancel-stop action if successful, we show 'Close' on overlay, else 'Cancel'
   changeBtnText(event: boolean) {
      this.overlayText = event ? this.labels.closeBtnText : this.labels.cancelBtnText;
   }

   showListing() {
      // stop or cancel-stop or reverse action if successful, we show 'Close' on overlay
      if (this.overlayText === this.labels.closeBtnText) {
         this.onCloseDebitDetails.emit(true);
      }
   }

   showDebitOrderActions(): boolean {
      return (this.selectedAccountDetails.subTranCode === this.debitOrder.subTranCode.eft ||
         this.selectedAccountDetails.subTranCode === this.debitOrder.subTranCode.naedo) &&
         this.selectedAccountDetails.tranCode !== this.debitOrder.tranCode;
   }

   hideAllDebitOrderActions() {
      this.showReverseLink = false;
      this.showStopOrderLink = false;
      this.showCancelStopOrderLink = false;
   }
   // if order is reversed successfully, user is also allowed to stop order from the same screen, in that case handle scenario
   goToStopDebitOrder() {
      this.reverseDebitOrderVisible = false;
      this.onCloseDebitDetails.emit(false);
      this.showReverseLink = false;
      this.showStopOrderLink = true;
      this.openStopDebitOrderOverlay();
   }

   sendDropOffGAEvent(event: IGAEvents) {
      const currentEvent = Object.assign({}, event);
      currentEvent.label += this.accountType;
      this.sendEvent(currentEvent.eventAction, currentEvent.label, null, currentEvent.category);
   }
}

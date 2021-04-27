import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IProductItem } from './../../../core/services/models';
import { Constants } from '../../../core/utils/constants';

/**
 * Component for individual unit trust, It has input field to enter amount for particular
 * unit trust and checkbox which get set thourgh component itself if entered amount is valid
 * Valid amount should be a multiple of hundred and less than total amount provided to component.
 *
 * @export
 * @class UnitTrustWidgetComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
   selector: 'app-unit-trust-widget',
   templateUrl: './unit-trust-widget.component.html',
   styleUrls: ['./unit-trust-widget.component.scss']
})
export class UnitTrustWidgetComponent implements OnInit {
   @Input() account: IProductItem;
   @Input() totalRandValue: number;
   @Input() totalAmountConsumed: number;
   @Input() isDisabled: boolean;
   @Input() isSingleCellMode: boolean;
   @Output() OnUpdateUnitTrust = new EventEmitter<IProductItem>();

   /** Flag for multiple of hundred */
   get isMultipleOfHundred() {
      return this.randValue % 100 === 0;
   }
   /** flag of valid cost value */
   get isValidCost() {
      return (this.totalRandValue - this.totalAmountConsumed) >= 0;
   }

   /** Setter for amount value responsible for udpating the value in global fields */
   set amountValue(value: string) {
      this.randValue = this.getAmount(value);
      this.account.productCostRands = this.randValue;
      this.OnUpdateUnitTrust.emit(this.account);
   }

   /** Converted rand value in number */
   private randValue = 0;

   /** Flag for checkbox */
   accountChecked = false;

   /** Flag for amount input field */
   isAmountFieldOpen = false;

   /** Localization for amountWithLabel for amountPipeSettings */
   amountPipeSettings = Constants.amountPipeSettings.amountWithLabel;

   /**
    * Initialize component with check state and cell counts.
    *
    * @memberof UnitTrustWidgetComponent
    */
   ngOnInit() {
      if (this.account && this.account.productCostRands !== 0) {
         this.accountChecked = true;
      }
      this.isAmountFieldOpen = this.isSingleCellMode;
   }
   /**
    * Calculates left amount using total amount and total consumed rand amount
    *
    * @memberof UnitTrustWidgetComponent
    */
   getLeftAmount(): number {
      const leftAmount: number = this.totalRandValue - this.totalAmountConsumed;
      return leftAmount > 0 ? leftAmount : 0;
   }

   /**
    * Responsible for closing the input box and also for reseting the
    * field if any of the validation failed.
    *
    * @memberof UnitTrustWidgetComponent
    */
   closeAmountField() {
      if (!this.isSingleCellMode) {
         if (!this.isMultipleOfHundred || !this.isValidCost ||
            this.account.productCostRands === 0) {
            this.resetComponent();
         }
         this.isAmountFieldOpen = false;
      }
   }

   /**
    * Invoked on blur of the input field and responsible
    * for closing and validating the field.
    *
    * @memberof UnitTrustWidgetComponent
    */
   closeAmountFieldWithDelay() {
      setTimeout(() => {
         this.closeAmountField();
      }, 200);
   }

   /**
    * Invoked on check box click and responsible for opening the amount
    * field or reseting/closing the amount field.
    *
    * @param {boolean} value
    * @memberof UnitTrustWidgetComponent
    */
   onAccountChecked(value: boolean) {
      this.accountChecked = value;
      if (value) {
         this.isAmountFieldOpen = true;
      } else {
         this.resetComponent();
         this.isAmountFieldOpen = false;
      }
   }

   /**
    * Invoked by toggleShowAmount and from unitTrustsBuyConpmonent to
    * reset fields of the components
    *
    * @memberof UnitTrustWidgetComponent
    */
   resetComponent(): void {
      this.amountValue = '0';
      this.accountChecked = false;
   }

   /**
    * Get the amount value in number from string value.
    *
    * @private
    * @param {string} value
    * @returns {number}
    * @memberof UnitTrustWidgetComponent
    */
   private getAmount(value: string): number {
      let amount = +value;
      amount = isNaN(amount) ? 0 : amount;

      return amount;
   }
}

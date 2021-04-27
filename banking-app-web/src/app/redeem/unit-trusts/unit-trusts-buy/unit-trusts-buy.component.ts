import { Component, EventEmitter, Output, Injector, OnInit, ViewChildren, QueryList } from '@angular/core';
import { IDashboardAccount, IAccountDetail, IProductItem } from './../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { BaseComponent } from '../../../core/components/base/base.component';
import { IWorkflowChildComponent, IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { IUnitTrustsBuy } from './../unit-trusts.models';
import { UnitTrustsService } from './../unit-trusts.service';
import { UnitTrustWidgetComponent } from '../unit-trust-widget/unit-trust-widget.component';

/**
 * Component for Redemption of rewards for unit tursts. It has list of account from which redemption will
 * be made, also has list of unit trusts available to redem. Some other fields for amount to redem and
 * references for transaction tracking.
 *
 * @export
 * @class UnitTrustsBuyComponent
 * @extends {BaseComponent}
 * @implements {OnInit}
 * @implements {IWorkflowChildComponent}
 */
@Component({
   selector: 'app-unit-trusts-buy',
   templateUrl: './unit-trusts-buy.component.html',
   styleUrls: ['./unit-trusts-buy.component.scss']
})
export class UnitTrustsBuyComponent extends BaseComponent implements OnInit, IWorkflowChildComponent {
   @Output() isComponentValid = new EventEmitter<boolean>();
   @ViewChildren(UnitTrustWidgetComponent) unitTrustForms: QueryList<UnitTrustWidgetComponent>;

   /** List of from account. */
   public accounts: IAccountDetail[] = [];
   /** Rand to Rewards value conversion ratio. */
   public conversionRate: number;
   /** Flag for multiple of hundered . */
   public isMultipleOfHundredNotViolated: boolean;
   /** Flag whether rand value is valid or not. */
   public isValidRandValue: boolean;
   /** Flag whether form is valid or not.. */
   public isValid: boolean;
   /** Index of currently selected unit tursts widget. */
   public selectedUnitTrustIndex: number;
   /** List of unit trusts available for redemption. */
   public unitTrusts: IProductItem[];
   /** Total amount consumed by unit trusts. */
   public totalAmountConsumed: number;
   /** Localization object. */
   public constants = Constants.labels;
   /** VM to be used by component for data storage. */
   public vm: IUnitTrustsBuy;
   /** Flag for skeleton mode visibility. */
   public skeletonMode: boolean;

   /**
    * Creates an instance of UnitTrustsBuyComponent.
    * @param {UnitTrustsService} unitTrustsService
    * @param {Injector} injector
    * @memberof UnitTrustsBuyComponent
    */
   constructor(
      private unitTrustsService: UnitTrustsService,
      injector: Injector
   ) {
      super(injector);
   }

   /**
    * Initialize the component by registering to the observer required for
    * populating account and unit trusts list. Also register for the conversion
    * ratio used for Rand to Rewards conversion.
    *
    * @memberof UnitTrustsBuyComponent
    */
   ngOnInit() {
      this.skeletonMode = true;
      this.vm = this.unitTrustsService.getBuyVm();
      this.isMultipleOfHundredNotViolated = true;
      this.isValidRandValue = true;
      this.totalAmountConsumed = this.vm.randValue;
      this.isValid = this.vm.randValue ? true : false;

      this.unitTrustsService.rateDataObserver.subscribe(rate => {
         if (rate) {
            this.conversionRate = rate.programmeRate;
         }
      });
      this.unitTrustsService.accountsDataObserver.subscribe(accounts => {
         if (accounts) {
            this.accounts = accounts;
            this.vm.fromAccount = accounts[0];
            this.skeletonMode = false;
            this.validate();
         }
      });
      this.unitTrustsService.unitTrustsListDataObserver.subscribe(unitTrusts => {
         if (unitTrusts) {
            this.unitTrusts = unitTrusts;
         }
      });
   }

   /**
    * Invoked on account selection change in account list.
    * Responsible for updating account model in vm.
    *
    * @param {IAccountDetail} account
    * @memberof UnitTrustsBuyComponent
    */
   onAccountSelection(account: IAccountDetail) {
      this.vm.fromAccount = account;
      this.onRandValueChange(this.vm.randValue);
   }

   /**
    * Invoked on total rand value field change and responsible for updating/validating
    * the amount. It also update the corresponding rewards value and reset any selected
    * unit trusts.
    *
    * @param {*} value
    * @memberof UnitTrustsBuyComponent
    */
   onRandValueChange(value): void {
      if (!isNaN(parseInt(value, 10))) {
         const randValue: number = parseInt(value, 10);
         this.vm.randValue = randValue;
         this.isMultipleOfHundredNotViolated = randValue % 100 === 0;
         this.isValidRandValue = randValue > 0 && Math.round(randValue / this.conversionRate) <= this.vm.fromAccount.availableBalance;
         this.vm.gbValue = Math.round(randValue / this.conversionRate);
         this.isValid = this.isMultipleOfHundredNotViolated && this.isValidRandValue;
         this.validate();
         this.resetUnitTrusts();
      }
   }

   /**
    * Validates the all required criteria before allowing navigation
    * to review component.
    *
    * @memberof UnitTrustsBuyComponent
    */
   validate(): void {
      const isValid: boolean = this.isMultipleOfHundredNotViolated && this.isValidRandValue &&
         this.totalAmountConsumed === this.vm.randValue && this.totalAmountConsumed !== 0;
      this.isComponentValid.emit(isValid);
   }

   /**
    * Invoked on total rand value change and responsible for reseting the
    * content of all widgets.
    *
    * @memberof UnitTrustsBuyComponent
    */
   resetUnitTrusts(): void {
      this.totalAmountConsumed = 0;
      this.unitTrustForms.forEach((component: UnitTrustWidgetComponent) => {
         component.resetComponent();
      });
      this.validate();
   }

   /**
    * Invoked by unit trusts widget on any change, we are recalculating the
    * total amount and to account based on input in the widgets.
    *
    * @param {IProductItem} account
    * @memberof UnitTrustsBuyComponent
    */
   selectedUnitTrustsUpdated(account: IProductItem): void {
      const isValid = false;
      this.totalAmountConsumed = 0;
      this.vm.toAccounts = this.unitTrusts.filter((accountItem: IProductItem) => {
         this.totalAmountConsumed += accountItem.productCostRands;
         accountItem.productCostPoints = Math.round(accountItem.productCostRands / this.conversionRate);
         return accountItem.productCostRands && accountItem.productCostRands !== 0;
      });
      this.validate();
   }

   /**
    * Invoked by worflwo on next button click from footer,
    * Update the user inputs information to buy VM.
    *
    * @param {number} currentStep
    * @memberof UnitTrustsBuyComponent
    */
   nextClick(currentStep: number): void {
      this.unitTrustsService.saveBuyInfo(this.vm);
   }

   /**
    * Invoked by workflow on step click from the header,
    * have no action for this component.
    *
    * @param {IStepInfo} stepInfo
    * @memberof UnitTrustsBuyComponent
    */
   stepClick(stepInfo: IStepInfo) {
   }
}

import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import { BaseComponent } from '../../../core/components/base/base.component';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { ChargesAndFeesService } from '../charges-and-fees.service';
import { IAccountDetail } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { IChargesAndFeesPay, IProgramme, IProductCategory, IProduct } from '../charges-and-fees.models';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';

@Component({
   selector: 'app-charges-and-fees-pay',
   templateUrl: './charges-and-fees-pay.component.html',
   styleUrls: ['./charges-and-fees-pay.component.scss']
})
export class ChargesAndFeesPayComponent extends BaseComponent implements OnInit, IWorkflowChildComponent {
   @Output() isComponentValid = new EventEmitter<boolean>();

   /** Holds accounts to redeem for cards fees. */
   public bankAccounts: IAccountDetail[];

   public cardAccounts: IAccountDetail[];
   /** VM to be used by component for data storage. */
   public vm: IChargesAndFeesPay;
   /** Holds account data */
   public accounts: IAccountDetail[];
   /** Holds charges and fees programme data */
   public chargesAndFees: IProgramme;
   /** Holds products for selected category */
   public products: IProduct[];
   /** Holds constants for product categories */
   public productCategoriesConst = Constants.VariableValues.rewardsProductCategories;
   /** Holds constants for labels */
   public constantValues = Constants.labels;
   /** Holds constants for charges and fees labels */
   public constantChargesAndFees = Constants.labels.chargesAndFees;
   /** Variable will be using pipe */
   public setEmptyToZero  = true;
   /** Holds constants for amount pipe  */
   public amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;
   /** Holds constants for rewards/Greenback pipe  */
   public rewardsAmountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSignRewards;

   /** Flag for skeleton mode visibility. */
   public skeletonMode: boolean;
   public isOpen = false;

   constructor(injector: Injector, public chargesAndFeesService: ChargesAndFeesService,
      public clientProfileDetailsService: ClientProfileDetailsService) {
      super(injector);
   }

   /**
    * @memberof ChargesAndFeesPayComponent
    */
   ngOnInit() {
     this.skeletonMode = true;
      this.vm = this.chargesAndFeesService.getPayVm();
      this.chargesAndFeesService.rewardsAccountDataObserver.subscribe((accounts) => {
         if (accounts && accounts.length > 0) {
            this.accounts = accounts;
            this.vm.fromAccount =  accounts[0];
            this.skeletonMode = false;
            this.validate();
         }
      });
      this.chargesAndFeesService.bankAccountDataObserver.subscribe((accounts) => {
         if (accounts && accounts.length > 0) {
            this.bankAccounts = accounts;
         }
      });
      this.chargesAndFeesService.cardAccountDataObserver.subscribe((accounts) => {
         if (accounts && accounts.length > 0) {
            this.cardAccounts = accounts;
         }
      });
      this.chargesAndFeesService.chargesAndFeesObserver.subscribe((chargesAndFees) => {
         if (chargesAndFees) {
            this.chargesAndFees = chargesAndFees;
            this.setProductChargesOrFeesCost(this.getDefaultProductCategory(), false);
         }
      });
   }

   /**
    * This function gets default product category based on length of category account.
    */
   getDefaultProductCategory() {
      if (this.vm.productCategory) {
         return this.vm.productCategory;
      } else if (this.bankAccounts.length === 0 && this.cardAccounts.length > 0) {
         return this.productCategoriesConst.linkageFees.code;
      }
      return this.productCategoriesConst.bankCharges.code;
   }

   /**
    * This gets called on change of from account
    *
    * @param account
    */
   onAccountSelection(account: IAccountDetail) {
      this.vm.fromAccount = account;
   }

   /**
    * This get called on change of account and set
    * validity of form
    *
    * @param event
    */
   onForAccountSelection(account: IAccountDetail) {
      this.vm.forAccount = account;
      this.setDomicileBranchNumber(this.vm.forAccount.accountNumber);
   }

   /**
    *
    * @param productCategory
    */
   setProductChargesOrFeesCost(productCategory: string, resetValue:  boolean): void {
      if (this.vm.productCategory !== productCategory || !resetValue) {
         this.vm.productCategory = productCategory;
         if (resetValue) {
            this.vm.forAccount = undefined;
            this.onProductSelection(undefined);
         }
         this.setSelectedAccountsFor();
         const selectedCategory: IProductCategory = this.chargesAndFees.productCategories.find((category) => {
            return category.productCategoryCode === productCategory;
         });
         this.products = selectedCategory.products;
         if (productCategory === this.productCategoriesConst.linkageFees.code) {
            this.onProductSelection(this.products[0]);
         }
         this.validate();
         this.setCategoryInfoForReqPayLoad(selectedCategory);

      }
   }

     /**
    * Set selected category information like code and name
    */
   setCategoryInfoForReqPayLoad(selectedCategory: IProductCategory) {
     this.vm.supplierCode = selectedCategory.supplierCode;
     this.vm.supplierName = selectedCategory.supplierName || selectedCategory.supplierCode;
   }

   /**
    * This function sets selected account in forAccount
    * of vm.
    *
    * @param productCategory
    */
   setSelectedAccountsFor(): void {
      if (this.vm.productCategory === this.productCategoriesConst.bankCharges.code) {
         this.vm.forAccount = this.vm.forAccount || this.clientProfileDetailsService.getDefaultAccount(this.bankAccounts)
            || this.bankAccounts[0];
      } else {
         this.vm.forAccount = this.vm.forAccount || this.clientProfileDetailsService.getDefaultAccount(this.cardAccounts)
            || this.cardAccounts[0];
      }
      this.setDomicileBranchNumber(this.vm.forAccount.accountNumber);
   }

   /**
    *
    * @param product
    */
   onProductSelection(product: IProduct) {
      this.vm.costPoints = undefined;
      this.vm.costRands = undefined;
      if (product) {
         this.vm.costPoints = product.productCostPoints;
         this.vm.costRands = product.productCostRands;
         this.vm.productCode = product.productCode;
         this.vm.productName = product.productName;
      }
      this.validate();
   }

   /**
    * This validate vm properties and emit isComponentValid
    */
   validate() {
      this.isComponentValid.emit(false);
      if (this.vm.forAccount && this.vm.fromAccount && this.vm.domicileBranchNumber && this.vm.costPoints && this.vm.costRands &&
         this.vm.costPoints <= this.vm.fromAccount.availableBalance) {
         this.isComponentValid.emit(true);
      }
   }

   /**
    * Invoked by worflow on next button click from footer,
    * Update the user inputs information to pay VM.
    *
    * @param {number} currentStep
    * @memberof ChargesAndFeesComponent
    */
   nextClick(currentStep: number): void {
      this.chargesAndFeesService.savePayInfo(this.vm);
   }

    /**
    * Set the domicile branch number to model on basis of account number,
    * In case of error or resquest process, next button will be disabled.
    * @param accountId
    */
   setDomicileBranchNumber(accountId: string) {
    this.isComponentValid.emit(false);
    this.chargesAndFeesService.getDomicileBranchNumber(accountId).subscribe(
      domicileBNumber => {
        this.vm.domicileBranchNumber = domicileBNumber;
        this.validate();
      },
      err => {
        this.isComponentValid.emit(false);
      }
    );
   }

   /**
    * Invoked by workflow on step click from the header,
    * have no action for this component.
    *
    * @param {IStepInfo} stepInfo
    * @memberof ChargesAndFeesComponent
    */
   stepClick(stepInfo: IStepInfo) {
   }
}

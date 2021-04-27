import { Component, OnInit, AfterViewInit, Output, ViewChild, EventEmitter, Injector } from '@angular/core';

import { BuyService } from '../buy.service';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { IBuyToVm, IBuyForVm } from '../buy.models';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import {
   IServiceProvider, IBeneficiaryData, IAccountDetail,
   IContactCardDetail, IContactCard, IBankDefinedBeneficiary
} from '../../../core/services/models';
import { PreFillService } from '../../../core/services/preFill.service';
import { BaseComponent } from '../../../core/components/base/base.component';
@Component({
   selector: 'app-buy-to',
   templateUrl: './buy-to.component.html',
   styleUrls: ['./buy-to.component.scss']
})
export class BuyToComponent extends BaseComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {
   @Output() isComponentValid = new EventEmitter<boolean>();
   @ViewChild('buyToForm') buyToForm;

   vm: IBuyToVm;
   buyForVm: IBuyForVm;
   providers: IServiceProvider[];
   mobilePattern = Constants.patterns.mobile;
   allowedProviders = ['mtn', 'clc', 'tlk', 'vdc', 'vgn', '8ta'];
   isSearchRecipients = false;
   accounts: IAccountDetail[] = [];
   displaySelectedServiceProvider;
   beneficiaryData: IContactCard[];
   processedBeneficiaryData;
   selectedBeneficiary;
   benefeciarySearchResult = [];
   noBeneficiaryData = true;
   bankApprovedRecipients: IBankDefinedBeneficiary[];
   myRecipients: IContactCard[];
   preFillData;
   isOpen = false;
   buyPrepaidWarningNotification = Constants.labels.buyLabels.buyPrepaidWarningNotification;
   constructor(private buyService: BuyService, private preFillService: PreFillService, injector: Injector) {
      super(injector);
    }

   ngOnInit() {
      this.preFillData = this.preFillService.preFillBeneficiaryData;
      this.vm = this.buyService.getBuyToVm();
      this.buyService.accountsDataObserver.subscribe(accounts => {
         if (accounts) {
            this.accounts = accounts;
         }
      });
      this.buyService.getServiceProviders().subscribe((data) => {
         this.providers = data.filter(provider => this.allowedProviders.indexOf(provider.serviceProviderCode.toLowerCase()) !== -1);
         this.displaySelectedServiceProvider = this.vm.serviceProviderName
            || Constants.dropdownDefault.displayText;
         this.vm.serviceProvider = this.vm.serviceProvider;
      });
      if (this.preFillData) {
         this.handleBeneficiarySelection(this.preFillData);
         this.preFillData = null;
      }
   }

   ngAfterViewInit() {
      this.buyToForm.valueChanges
         .subscribe(values => this.validate());
   }

   checkDefaultSelected(value: string) {
         return value === Constants.dropdownDefault.displayText;
   }

   validate() {
      const isFormValid = this.buyToForm.valid && this.validateMobileNumber() && this.validateServiceProvider();
      if (this.buyToForm.dirty) {
            this.buyService.buyWorkflowSteps.buyTo.isDirty = true;
      }
      this.isComponentValid.emit(isFormValid);
   }

   validateServiceProvider() {
      return !(this.displaySelectedServiceProvider === Constants.dropdownDefault.displayText);
   }
   validateMobileNumber() {
      const regEx = new RegExp(this.mobilePattern);
      return regEx.test(this.vm.mobileNumber ? this.vm.mobileNumber.toString() : '');
   }

   onMobileNumberChange(number) {
      this.validate();
   }

   nextClick(currentStep: number) {
      this.sendEvent('buy_prepaid_recipient_and_provider_click_on_next');
      if (this.buyService.getBuyToVm().serviceProvider !== this.vm.serviceProvider) {
         const buyAmountVmObj = this.buyService.getBuyAmountVm();
         buyAmountVmObj.rechargeType = '';
         buyAmountVmObj.bundleType = '';
         this.buyService.saveBuyAmountInfo(buyAmountVmObj);
      }
      this.buyService.saveBuyToInfo(this.vm);
   }

   stepClick(stepInfo: IStepInfo) {
   }

   onProviderSelection(provider: IServiceProvider) {
      this.displaySelectedServiceProvider = provider.serviceProviderName;
      this.vm.serviceProviderName = provider.serviceProviderName;
      this.vm.serviceProvider = provider.serviceProviderCode;
      this.validate();
   }

   getProviderIconClass(providerCode: string) {
      return 'icon-' + providerCode.toLowerCase();
   }

   isProviderSelected(providerCode: string) {
      return this.vm.serviceProvider === providerCode;
   }

   // Show Search Recipients
   showSearchRecipients() {
      this.isSearchRecipients = true;
   }

   // Hide Search Recipients
   hideSearchRecipients() {
      this.isSearchRecipients = false;
   }

   getContactCards(recipientsData) {
      // myRecipientsData at second position
      this.myRecipients = recipientsData[1];
      this.createMyRecipients(this.myRecipients);
   }

   createMyRecipients(recipientsData) {
      this.processedBeneficiaryData = [];
      recipientsData.forEach((data) => {
         data.contactCardDetails.forEach((cardData) => {
            this.processedBeneficiaryData.push(cardData);
         });
      });
   }

   onRecipientNameChanged() {
      this.vm.isRecipientPicked = false;
   }

   selectBeneficiary(selectedBeneficiary) {
      this.beneficiaryChange(selectedBeneficiary);
   }

   private beneficiaryChange(beneficiary) {
      this.assignBeneficiary(beneficiary);
   }

   private assignBeneficiary(beneficiary) {
      this.selectedBeneficiary = beneficiary.item;
      this.vm.recipientName = beneficiary.value;
      const selectedBeneficiaryData = this.myRecipients.filter((data) => {
         let filterData = null;
         data.contactCardDetails.forEach(element => {
            if (element.beneficiaryID === this.selectedBeneficiary.beneficiaryID
               && element.beneficiaryName === this.selectedBeneficiary.beneficiaryName) {
               filterData = data;
            }
         });
         return filterData;
      }
      );
      if (selectedBeneficiaryData.length) {
         const contactCard = Object.assign({}, selectedBeneficiaryData[0]);
         contactCard.contactCardDetails = [];
         contactCard.contactCardDetails.push(this.selectedBeneficiary);
         const selectedProcessedBeneficiaryData = {
            contactCard: contactCard,
            contactCardDetails: {
               cardDetails: contactCard.contactCardDetails[0],
               isPrepaid: this.isPrepaidContact(contactCard),
            },
            bankDefinedBeneficiary: null
         };
         this.handleBeneficiarySelection(selectedProcessedBeneficiaryData);
      }
   }

   isPrepaidContact(contactCard: IContactCard): boolean {
      const contactCardDetails = contactCard.contactCardDetails && contactCard.contactCardDetails.filter((contactCardDetail) => {
         return this.isPrepaidContactCard(contactCardDetail);
      });
      return contactCardDetails.length > 0;
   }

   isPrepaidContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType === Constants.BeneficiaryType.Prepaid;
   }

   handleBeneficiarySelection(beneficiaryData: IBeneficiaryData) {
      const contactCardDetails = beneficiaryData.contactCardDetails;
      this.vm.recipientName = contactCardDetails.cardDetails.beneficiaryName;
      this.vm.mobileNumber = contactCardDetails.cardDetails.accountNumber;
      this.vm.beneficiaryID = contactCardDetails.cardDetails.beneficiaryID;
      this.vm.isRecipientPicked = true;
      this.buyForVm = this.buyService.getBuyForVm();
      this.buyForVm.yourReference = contactCardDetails.cardDetails.myReference;
      this.buyService.saveBuyForInfo(this.buyForVm);
      this.validateMobileNumber();
   }
}


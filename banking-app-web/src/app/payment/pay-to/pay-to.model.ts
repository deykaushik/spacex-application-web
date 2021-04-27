
import { Constants } from './../../core/utils/constants';
import { IBranch, IBank } from './../../core/services/models';
import { IWorkflowModel, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';
import { IPayToVm, ICrossBorderVm, ICrossBorderBank, ICrossBorderRecipientDetails } from '../payment.models';
import { IAccountDetail, IBeneficiaryData } from '../../core/services/models';
import { PaymentType } from '../../core/utils/enums';
import { environment } from '../../../environments/environment';


export class PayToModel implements IWorkflowModel {
   recipientName: string;
   accountNumber: string;
   bankName: string;
   branchName: string;
   bank: IBank;
   branch: IBranch;
   mobileNumber: string;
   paymentType = PaymentType.account;
   accountType: string;
   accountTypeName: string;
   beneficiaryData: IBeneficiaryData;
   isRecipientPicked?: boolean;
   isShowBankName?: boolean;
   isReadOnly?: boolean;
   creditCardNumber: string;
   country: string;
   countryDispalyName: string;
   currency: string;
   isCrossBorderAllowed = environment.features.crossBorderPayment;
   isCrossBorderPaymentActive: boolean;
   isCrossBorderPaymentServiceAvailable: boolean;
   recipientGender: string;
   recipientIdPassportNumber: string;
   recipientMobileNo: string;
   recipientAddress: string;
   recipientCityVillage: string;
   recipientStateProvince: string;
   recipientZip: string;
   crossBorderBankName = 'Ecobank';
   foreignBeneficiaryName: string;
   transactionID: string;
   beneficiaryAccountType?: string;
   beneficiaryCurrency?: string;
   residentialStatus?: string;
   checkReference?: string;

   isRecipientValid?: boolean;
   banks?: IBank[];
   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         if (this.paymentType === PaymentType.account) {
            if (this.bankName) {
               title = `You are paying ${this.recipientName} ${this.bankName}`;
            } else {
               title = `You are paying ${this.recipientName}`;
            }
            if (this.isShowBankName) {  // check bank approved beneficiaries
               title = this.accountNumber ? title.concat(` - ${this.accountNumber}`) : title;
            }
         } else if (this.paymentType === PaymentType.mobile) {
            title = `You are paying ${this.recipientName} - ${this.mobileNumber}`;
         } else if (this.paymentType === PaymentType.foreignBank) {
            title = `You are paying ${this.foreignBeneficiaryName} in ${this.countryDispalyName} in ${this.recipientCityVillage}`;
         } else {
            title = `You are paying ${this.recipientName} - ${this.creditCardNumber}`;
         }
      } else {
         title = Constants.labels.payToTitle;
      }
      return title;
   }

   getViewModel(): IPayToVm {
      return {
         recipientName: this.recipientName,
         accountNumber: this.accountNumber,
         bankName: this.bankName,
         branchName: this.branchName,
         bank: this.bank,
         branch: this.branch,
         mobileNumber: this.mobileNumber,
         accountType: this.accountType,
         accountTypeName: this.accountTypeName,
         beneficiaryData: this.beneficiaryData,
         isRecipientPicked: this.isRecipientPicked,
         isShowBankName: this.isShowBankName,
         isReadOnly: this.isReadOnly,
         paymentType: this.paymentType,
         creditCardNumber: this.creditCardNumber,
         isCrossBorderAllowed: this.isCrossBorderAllowed,
         isCrossBorderPaymentActive: this.isCrossBorderPaymentActive,
         isCrossBorderPaymentServiceAvailable: this.isCrossBorderPaymentServiceAvailable,
         crossBorderPayment: {
            country: {
               countryName: this.countryDispalyName,
               code: this.country
            },
            bank: {
               bankName: this.crossBorderBankName,
               accountNumber: this.accountNumber,
            },
            personalDetails: {
               gender: this.recipientGender,
               idPassportNumber: this.recipientIdPassportNumber,
               recipientMobileNo: this.recipientMobileNo,
               recipientAddress: this.recipientAddress,
               recipientCityVillage: this.recipientCityVillage,
               recipientStateProvince: this.recipientStateProvince,
               recipientZip: this.recipientZip
            },
            beneficiaryDetails: {
               beneficiaryAccountName: this.foreignBeneficiaryName,
               beneficiaryCurrency:  this.beneficiaryCurrency,
               beneficiaryAccountType: this.beneficiaryAccountType,
               residentialStatus: this.residentialStatus,
               transactionID: this.transactionID,
               checkReference: this.checkReference
            }
         },
         isRecipientValid: this.isRecipientValid,
         banks: this.banks,
      };
   }

   updateModel(vm: IPayToVm): void {
      this.recipientName = vm.recipientName;
      this.accountNumber = vm.accountNumber;
      this.bankName = vm.bankName;
      this.branchName = vm.branchName;
      this.bank = vm.bank;
      this.branch = vm.branch;
      this.mobileNumber = vm.mobileNumber;
      this.paymentType = vm.paymentType;
      this.accountType = vm.accountType;
      this.accountTypeName = vm.accountTypeName;
      this.beneficiaryData = vm.beneficiaryData;
      this.isRecipientPicked = vm.isRecipientPicked;
      this.isShowBankName = vm.isShowBankName;
      this.isReadOnly = vm.isReadOnly;
      this.creditCardNumber = vm.creditCardNumber;
      this.isRecipientValid = vm.isRecipientPicked && ((vm.beneficiaryData.contactCardDetails &&
         vm.beneficiaryData.contactCardDetails.cardDetails.valid) || !!vm.beneficiaryData.bankDefinedBeneficiary);
      this.banks = vm.banks;
      this.isCrossBorderPaymentActive = vm.isCrossBorderPaymentActive;
      // this.crossBorderPayment = vm.crossBorderPayment;
      if (vm.isCrossBorderPaymentActive) {
         // pay to
         this.isCrossBorderPaymentServiceAvailable = vm.isCrossBorderPaymentServiceAvailable;
         this.crossBorderBankName = vm.crossBorderPayment.bank.bankName;
         this.accountNumber = vm.crossBorderPayment.bank.accountNumber;
         this.country = vm.crossBorderPayment.country.code;
         this.countryDispalyName = vm.crossBorderPayment.country.countryName;
         this.recipientGender = vm.crossBorderPayment.personalDetails.gender;
         this.recipientIdPassportNumber = vm.crossBorderPayment.personalDetails.idPassportNumber;
         this.recipientMobileNo = vm.crossBorderPayment.personalDetails.recipientMobileNo;
         this.recipientAddress = vm.crossBorderPayment.personalDetails.recipientAddress;
         this.recipientCityVillage = vm.crossBorderPayment.personalDetails.recipientCityVillage;
         this.recipientStateProvince = vm.crossBorderPayment.personalDetails.recipientStateProvince;
         this.recipientZip = vm.crossBorderPayment.personalDetails.recipientZip;
         // pay amount
         this.foreignBeneficiaryName = vm.crossBorderPayment.beneficiaryDetails.beneficiaryAccountName;
         this.transactionID = vm.crossBorderPayment.beneficiaryDetails.transactionID;
         this.residentialStatus = vm.crossBorderPayment.beneficiaryDetails.residentialStatus;
         this.beneficiaryCurrency = vm.crossBorderPayment.beneficiaryDetails.beneficiaryCurrency;
         this.beneficiaryAccountType = vm.crossBorderPayment.beneficiaryDetails.beneficiaryAccountType;
         this.checkReference = vm.crossBorderPayment.beneficiaryDetails.checkReference;
      }
   }

   clearModel(vm: IPayToVm): void {
      vm.accountNumber = undefined;
      vm.bankName = undefined;
      vm.branchName = undefined;
      vm.bank = null;
      vm.branch = null;
      vm.mobileNumber = undefined;
      vm.accountType = undefined;
      vm.accountTypeName = undefined;
      vm.beneficiaryData = null;
      vm.isRecipientPicked = false;
      vm.isShowBankName = true;
      vm.isReadOnly = false;
      vm.creditCardNumber = undefined;
      vm.isRecipientValid = undefined;
   }
}

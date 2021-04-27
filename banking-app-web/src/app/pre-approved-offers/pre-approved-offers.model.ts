import { IRangeSliderConfig } from '../shared/models';
import { SrvRecord } from 'dns';



export enum PreApprovedStep {
   getStarted = 0,
   Information = 1,
   review = 4,
}

export interface IWorkFlowSteps {
   getStarted: IGetStarted;
   information: IInformation;
   offer: IOffer;
   review: IReview;
   disclosure: IDisclosure;
}

interface IScreenContent {
   type: string;
   id: number;
   content: string[];
   required?: boolean;
}
export interface IGetStarted {
   screen: IScreenContent[];
   options: boolean[];
}

interface IInvolvedParties {
   name: string;
   value: string;
   subText: string;
}

export interface IInformation {
   screen: IInvolvedParties[];
   isInfoWrong: boolean;
}

export class GetStarted implements IGetStarted {
   screen: IScreenContent[];
   options: boolean[];

   constructor() {
      this.screen = [];
      this.options = [];
   }
}

export class Information implements IInformation {
   screen: IInvolvedParties[];
   isInfoWrong: boolean;
   constructor() {
      this.screen = [];
      this.isInfoWrong = false;
   }
}

export interface ILoanInformationData {
   data: ILoanInformation;
}

export interface ILoanInformation {
   ranges: ILoanInformationRange[];
   fieldSections: FieldSection[];
   totalMonthlyRepayment: number;
   NedbankCreditInsuranceLink: string;
   ExclusionsLink: string;
}

export interface ILoanInformationRange {
   term: number;
   minimum: number;
   maximum: number;
   interestRate: number;
}

interface FieldSection {
   title: string;
   fields: FieldList[];
   total: string;
}
export interface FieldList {
   type: string;
   name?: string;
   value: string;
   helpText: string;
   subText: string;
}

export class Offer {
   isDropdownOpen: boolean;
   skeletonMode: boolean;
   monthlyPayment: number;
   config: IRangeSliderConfig;
   loanValue: string | number;
   sliderValue: string | number;
   selectedTerm: ILoanInformationRange;
   terms: ILoanInformationRange[];
   termsAvailable: ILoanInformationRange[];
   showCalculate: boolean;
   amountInvalid: boolean;
   fieldSections: IFieldSection[];
   nedbankCreditInsuranceLink: string;
   exclusionsLink: string;
   constructor() {
      this.config = { min: 10000, max: 550000, step: 1000 };
      this.terms = [];
      this.termsAvailable = [];
      this.fieldSections = [];
   }
}


export interface IOffer {
   isDropdownOpen: boolean;
   skeletonMode: boolean;
   monthlyPayment: number;
   config: IRangeSliderConfig;
   loanValue: string | number;
   sliderValue: string | number;
   selectedTerm: ILoanInformationRange;
   terms: ILoanInformationRange[];
   termsAvailable: ILoanInformationRange[];
   showCalculate: boolean;
   amountInvalid: boolean;
   fieldSections: IFieldSection[];
   nedbankCreditInsuranceLink: string;
   exclusionsLink: string;
}

export interface IField {
   name?: string;
   value: string;
   subText: string;
   helpText: string;
}

export interface IFieldSection {
   fields: IField[];
   title: string;
   total: string;
}

export interface IReview {
   fieldSections: IFieldSection[];
   isToolTip: Array<boolean>[][];
   acceptCredit: boolean;
   nedbankCreditInsuranceLink: string;
   exclusionsLink: string;
}

export class Review {
   fieldSections: IFieldSection[];
   isToolTip: Array<boolean>[][];
   acceptCredit: boolean;
   nedbankCreditInsuranceLink: string;
   exclusionsLink: string;
   constructor() {
      this.fieldSections = [];
      this.isToolTip = [];
      this.acceptCredit = true;
   }
}

export interface IDisclosureContent {
   type: string;
   id: number;
   title: string;
   content: string[];
   description?: string;
   required?: boolean;
   errorText?: string;
}

export interface IDisclosureData {
   name: string;
   content: IDisclosureContent[];
}

export interface IDisclosureMetadata {
   version: string;
   status: string;
   message: string;
   corid: number;
}

export interface IDisclosure {
   data: IDisclosureData[];
   metadata: IDisclosureMetadata;
   selectedType: string;
   isDropdownOpen: boolean;
   dropDownTitle: string;
   dropDownTerms: string[];
   toolTipText: string;
   viewAndAcceptText: string;
   emailText: string;
   errorText: string;
   disclosureContent: IDisclosureContent[];
   selectedTerm: string;
   showPage: boolean;
   email: string;
   termAndCondtions: boolean;
   errorTextBool: boolean;
   confirm: boolean;
   allIsValid: boolean;
   showDoneScreen: boolean;
}

export class Disclosure {
   data: IDisclosureData[];
   metadata: IDisclosureMetadata;
   selectedType: string;
   isDropdownOpen: boolean;
   dropDownTitle: string;
   dropDownTerms: string[];
   toolTipText: string;
   viewAndAcceptText: string;
   emailText: string;
   errorText: string;
   disclosureContent: IDisclosureContent[];
   selectedTerm: string;
   showPage: boolean;
   email: string;
   termAndCondtions: boolean;
   errorTextBool: boolean;
   confirm: boolean;
   allIsValid: boolean;
   showDoneScreen: boolean;

   constructor() {
      this.data = [];
      this.email = '';
      this.termAndCondtions = true;
      this.selectedType = '0';
   }
}

export interface IPayload {
   status: string;
   reason: string;
   screen: string;
}

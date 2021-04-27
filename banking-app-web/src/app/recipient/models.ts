export interface IBeneficiaryEmailInfo {
   email: string;
}

export interface IBeneficiaryMeterInfo {
   meter: string;
}

export interface IBeneficiaryFaxInfo {
   fax: string;
}

export interface IBeneficiaryCellphoneInfo {
   cellphone: string;
}

export interface IBeneficiaryAccountInfo {
   bankName: string;
   accountNumber: string;
}

export interface IBeneficiaryContactInfo {
   emails: IBeneficiaryEmailInfo[];
   cellphones: IBeneficiaryCellphoneInfo[];
   fax: IBeneficiaryFaxInfo[];
}

export interface IBeneficiaryDetails {
   contact: IBeneficiaryContactInfo;
   accounts: IBeneficiaryAccountInfo[];
   meters: IBeneficiaryMeterInfo[];
   references: {
      my: string;
      their: string;
   };
}

export enum RecipientOperation {
   showLimitExceeded = 1,
   showDeleteRecipient = 2,
   hideDeleteRecipient = 3,
   deleteRecipeint = 4
}

export enum ScheduleTypes {
   prepaid = 1,
   payment = 0
}

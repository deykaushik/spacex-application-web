
export interface IInrangeDateSeletor {
   warningMsg: string;
   minDate: string;
   maxDate: string;
   title: string;
}
export interface IPaymentAmountOptions {
   type: string;
   label: string;
   tooltip: string;
   value: string;
   isTooltipActive?: boolean;
}
export interface IAutopayPaymentDate {
   day: number;
   daySelectionFullText: string;
   isValid: boolean;
}
export interface IAutoPayDetail {
   payToAccount: string;
   payToAccountName: string;
   payFromAccount: string;
   payFromAccountType: string;
   monthlyPaymentDay: string;
   autoPayInd: boolean;
   autoPayTerm: string;
   statementDate: string;
   dueDate: string;
   autoPayAmount: string;
   camsAccType: string;
   branchOrUniversalCode: string;
   autoPayMethod: string;
   nedbankIdentifier: boolean;
   mandateAction: boolean;
   allowTermsAndCond: boolean;
}
export interface IAutoPaySummary {
   payToAccount: string;
   payToAccountName: string;
   payFromAccount: string;
   payFromAccountType: string;
   monthlyPaymentDay: string;
   autoPayInd: true;
   autoPayTerm: string;
   autoPayAmount: string;
   branchOrUniversalCode: string;
   autoPayMethod: string;
   nedbankIdentifier: boolean;
}
export interface IAvsCheck {
   account: IAvsCheckDetail;
}
export interface IAvsCheckDetail {
   accountNumber: string;
   branchCode: string;
   accountType: string;
   bankName: string;
}
export interface IVerificationResults {
   accountExists: string;
   identificationNumberMatched: string;
   accountActive: string;
   canDebitAccount: string;
}
export interface IAvsResponse {
   verificationResults: IVerificationResults;
}

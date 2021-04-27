import { IBoard } from './../../buy/game/models';
import { NotificationTypes } from '../utils/enums';
import { Moment } from 'moment';
import { ICardActionListsData } from '../../cards/models';
import { EventEmitter } from '@angular/core/src/event_emitter';
import { ISignalRConnection } from 'ng2-signalr/src/services/connection/i.signalr.connection';
import { AlertActionType, AlertMessageType } from '../../shared/enums';

export interface IApiResponse {
  data?: any;
  Data?: any;
  metadata?: any;
  MetaData?: any;
  result?: any;
  ErrorCode?: any;
}

export interface ILimitDetail {
  limitType: string;
  dailyLimit: number;
  userAvailableDailyLimit: number;
  maxDailyLimit: number;
  isTempLimit: boolean;
  tempLimitStart?: string;
  tempLimitEnd?: string;
  tempDailyLimit?: number;
  tempAvailableDailyLimit?: number;
  lastPermanentLimit?: number;
  maxTmpDateRangeLimit?: number;
  newLimit?: number;
  secureTransaction?: ISecureTransaction;
}

export interface IAccountDetail {
  itemAccountId: string;
  accountNumber: string;
  productCode: string;
  productDescription: string;
  isPlastic: boolean;
  accountType: string;
  nickname: string;
  sourceSystem: string;
  currency: string;
  availableBalance: number;
  currentBalance: number;
  profileAccountState: string;
  accountLevel: string;
  rewardsProgram?: string;
  viewAvailBal: boolean;
  viewStmnts: boolean;
  isRestricted: boolean;
  viewCurrBal: boolean;
  viewCredLim: boolean;
  viewMinAmtDue: boolean;
  isAlternateAccount: boolean;
  allowCredits: boolean;
  allowDebits: boolean;
  accountRules: {
    instantPayFrom: boolean;
    onceOffPayFrom: boolean;
    futureOnceOffPayFrom: boolean;
    recurringPayFrom: boolean;
    recurringBDFPayFrom: boolean;
    onceOffTransferFrom: boolean;
    onceOffTransferTo: boolean;
    futureTransferFrom: boolean;
    futureTransferTo: boolean;
    recurringTransferFrom: boolean;
    recurringTransferTo: boolean;
    onceOffPrepaidFrom: boolean;
    futurePrepaidFrom: boolean;
    recurringPrepaidFrom: boolean;
    onceOffElectricityFrom: boolean;
    onceOffLottoFrom: boolean;
    onceOffiMaliFrom: boolean;
    InternationalRemittance?: boolean;
  };
  TransferAccountRules?: ITransferTo;
}

interface ITransferTo {
  TransferTo?: ITransferRule[];
}
interface ITransferRule {
  ProductAccessType: string;
  AccountType: string;
  ProductCodes: string[];
}
export interface IPrepaidServiceProviderProducts {
  productCode: string;
  productDescription: string;
  minAmount: number;
  maxAmount: number;
  allowPurchaseNow: boolean;
  allowFutureDated: boolean;
  allowRecurring: boolean;
  voucherTopupInstructions: string;
  productDetails: IPrepaidServiceProviderProductsDetail[];
}

export interface IPrepaidServiceProviderProductsDetail {
  amountValue: number;
  bundleList: string;
  bundleValue: number;
}

export interface IPrepaidLimitDetail {
  limitType: string;
  dailyLimit: number;
  userAvailableDailyLimit: number;
  maxDailyLimit: number;
  isTempLimit: boolean;
  maxTmpDateRangeLimit: number;
}

export interface IPrepaidAccountDetail {
  itemAccountId: string;
  accountNumber: string;
  productCode: string;
  productDescription: string;
  isPlastic: boolean;
  accountType: string;
  nickname: string;
  sourceSystem: string;
  currency: string;
  availableBalance: number;
  currentBalance: number;
  profileAccountState: string;
  accountLevel: string;
  viewAvailBal: boolean;
  viewStmnts: boolean;
  isRestricted: boolean;
  viewCurrBal: boolean;
  viewCredLim: boolean;
  viewMinAmtDue: boolean;
  isAlternateAccount: boolean;
  allowCredits: boolean;
  allowDebits: boolean;
  accountRules: {
    instantPayFrom: boolean;
    onceOffPayFrom: boolean;
    futureOnceOffPayFrom: boolean;
    recurringPayFrom: boolean;
    recurringBDFPayFrom: boolean;
    onceOffTransferFrom: boolean;
    onceOffTransferTo: boolean;
    futureTransferFrom: boolean;
    futureTransferTo: boolean;
    recurringTransferFrom: boolean;
    recurringTransferTo: boolean;
    onceOffPrepaidFrom: boolean;
    futurePrepaidFrom: boolean;
    recurringPrepaidFrom: boolean;
    onceOffElectricityFrom: boolean;
    onceOffLottoFrom: boolean;
    onceOffiMaliFrom: boolean;
  };
}

export interface IUser {
  username?: string;
  password?: string;
  appliesTo?: string;
  secretType?: string;
  token?: string;
}
export interface ILoanDebitOrderDetails {
  accountNumber: string;
  currentBalance: string;
  assetDetails: IAssetDetails;
  interestRate: number;
  paymentFrequency: string;
  totalInstallment: number;
  nextInstallmentDate: string;
  paymentMethod: string;
  bankName: string;
  bankBranchCode: number;
  bankAccNumber: string;
  bankAccountType: string;
  similarAccounts: ISimilarAccounts[];
  minimumInstallment?: number;
  paymentDay?: string;
  expiryDate?: string;
  effectiveDate?: string;
}
export interface IAssetDetails {
  description: string;
  chassisNumber: string;
  engineNumber: string;
}
export interface ISimilarAccounts {
  itemAccountId: string;
  accountNumber: string;
  currentBalance: number;
  selected?: boolean;
}

export interface INoticeDetails {
  noticeContent?: string;
  versionDate?: string;
}

export interface ITermsAndConditions {
  noticeTitle?: string;
  noticeType?: string;
  versionNumber?: number;
  newVersionNumber?: number;
  acceptedDateTime?: string;
  noticeDetails?: INoticeDetails;
}

export interface ITermsAccept {
  noticeType: string;
  versionNumber: number;
  newVersionNumber: number;
  acceptedDateTime: string;
  noticeDetails: INoticeDetails;
  accepted: boolean;
}
export interface ITermsNedbankId {
  content: string;
}
export interface INedIDTermsAccept {
  Version: INedIDTermsVersion;
  AcceptedDateTime: string;
}
export interface INedIDTermsVersion {
  VersionNumber: number;
  VersionDate: string;
}
export interface IBank {
  category?: string;
  bankCode: string;
  bankName: string;
  rTC: boolean;
  universalCode?: string;
  acceptsRealtimeAVS?: boolean;
  acceptsBatchAVS?: boolean;
  branchCodes?: IBranch[];
}

export interface IPaymentReason {
  code: string;
  name: string;
}

export interface IBranch {
  branchName: string;
  branchCode: string;
  displayName?: string;
  acceptsRealtimeAVS?: boolean;
}

export interface IPaymentReoccuranceInfo {
  reoccurrenceFrequency: string;
  reoccurrenceOccur?: number;
  reoccSubFreqVal: string;
  reoccurrenceToDate?: string;
}
export interface IPaymentDetailWithGUID {
  requestId: string;
  payments: IPaymentDetail[];
}
export interface IPrepaidDetailWithGUID {
  requestId: string;
  prepaids: IPaymentDetail[];
}
export interface IPaymentDetail {
  transactionID?: string;
  startDate?: string;
  bFName?: string;
  bank?: string;
  beneficiaryID?: string;
  sortCode?: string;
  myDescription?: string;
  beneficiaryDescription?: string;
  amount?: number;
  instantPayment?: boolean;
  nextTransDate?: string;
  favourite?: boolean;
  fromAccount?: IPaymentAccount;
  toAccount?: IPaymentAccount;
  notificationDetails?: IPaymentNotification | IPaymentNotification[];
  saveBeneficiary?: boolean;
  destinationNumber?: string;
  isVoucherAmount?: boolean;
  reoccurrenceItem?: IPaymentReoccuranceInfo;
  remittanceCharge?: string;
  beneficiaryAmount?: string;
  paymentExchangeRate?: string;
  totalPaymentAmount?: string;
  beneficiaryCurrency?: string;
  remittanceInstruction?: IRemittanceInstruction;
  execEngineRef?: string;
  BFType?: string;
}

export interface IRemittanceInstruction {
  beneficiaryInfo: IBeneficiaryInfo;
  senderInfo: ISenderInfo;
  paymentInfo: IPaymentInfo;
}

export interface ISenderInfo {
  senderAccount: string;
  senderAccountName: string;
  residentialStatus: string;
}

export interface IAccountLists {
  accountList: ILinkedAccount[];
}

export interface ILinkedAccount {
  itemAccountId: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  enabled: boolean;
  RewardsProgram?: string;
  IsAlternateAccount?: boolean;
  AccountStatusCode?: string;
  balanceNotPaidOut?: number;
  registeredAmount?: number;
  accruedInterest?: number;
  custTypeCode?: string;
  isFreezed?: boolean;
}

export interface IPaymentInfo {
  paymentNarration: string;
  paymentAmount: Number;
  paymentCurrency: string;
  paymentExchangeRate: string;
  balanceOfPaymentCategory: string;
  beneficiaryNarration: string;
}
export interface IBeneficiaryInfo {
  beneficiaryAccount: string;
  beneficiaryCountry: string;
  beneficiaryInstitution: string;
  beneficiaryName: string;
  beneficiarySurname: string;
  beneficiaryIdentification: string;
  beneficiaryAmount: string;
  beneficiaryCurrency: string;
  checkReference: string;
  physicalAddress: {
    addressLine1: string;
    addressLine2: string;
    suburb: string;
    city: string;
    province: string;
    postCode: string;
    country: string;
  };
  beneficiaryGender: string;
}

export interface IPaymentNotification {
  notificationType: string;
  notificationAddress: string;
  notificationDefaultInd?: boolean;
  instantPayment?: boolean;
}

export interface IPaymentAccount {
  accountNumber?: string;
  accountType?: string;
}

export interface IPaymentMetaData {
  resultData: IPaymentResultData[];
}

export interface IPaymentResultData {
  batchID?: string;
  transactionID?: string;
  execEngineRef?: string;
  resultDetail: IPaymentResultDetail[];
}

export interface IPaymentResultDetail {
  operationReference?: string;
  result?: string;
  status?: string;
  reason?: string;
}

export interface IRemittanceAvailabilityStatus {
  data?: {
    availability: boolean,
    cutOffTime: string
  };
  metadata?: {
    page: number,
    pageSize: number,
    pageLimit: number,
    resultData: [{
      batchID: string,
      transactionID: string,
      recInstrID: string,
      resultDetail: [{
        operationReference: string,
        result: string,
        status: string,
        reason: string
      }],
      execEngineRef: string
    }]
  };
}

export interface IDashboardAccount {
  AccountName: string;
  Balance: number;
  AvailableBalance: number;
  AccountNumber: number;
  AccountType: string;
  AccountIcon: string;
  NewAccount: boolean;
  LastUpdate: string;
  InstitutionName: string;
  Currency: string;
  SiteId: string;
  ItemAccountId: string;
  InterestRate: number;
  AccountStatusCode?: string;
  IsShow?: boolean;
  RewardsProgram?: string;
  isEditInProcess?: boolean;
  IsProfileAccount?: boolean;
  ProductType?: string;
  settlementAmt?: number;
  Pockets?: any[];
  FirstAvailableWithdrawalDate?: Date;
  MaintainOptions?: IMaintainOptions;
  kebabOpen?: boolean;
}

export interface IMaintainOptions {
  PlaceNotice: string;
  DeleteNotice: string;
}

export interface ITravelcardPriority {
   currency: string;
   amount: number;
}

export interface ITravelCardPriorityDetails {
   currency: ITravelcardPriority;
   priority: number;
}

export interface IDashboardAccounts {
  ContainerName: string;
  Accounts: IDashboardAccount[];
  ContainerIcon: string;
  Assets: number;
}

export interface ITransferAccount {
  accountNumber: string;
  accountType: string;
}

export interface ITransferDetailsDoublePayment {
  requestId: string;
  transfers: ITransferDetail[];
}

export interface ITransferDetail {
  transactionID?: string;
  startDate: string;
  amount: number;
  fromAccount: ITransferAccount;
  toAccount: ITransferAccount;
  favourite: boolean;
  nextTransDate?: string;
  reoccurrenceItem: IReoccurenceModel;
  errorMessage?: string;
  execEngineRef?: string;
}

export interface ITransferMetaData {
  resultData: ITransferResultData[];
}

export interface ITransferResultData {
  batchID?: string;
  transactionID?: string;
  execEngineRef?: string;
  resultDetail: ITransferResultDetail[];
}

export interface ITransferResultDetail {
  operationReference?: string;
  result?: string;
  status?: string;
  reason?: string;
}

export interface ITransactionDetail {
  TransactionId: string;
  Description: string;
  Amount: number;
  Debit: boolean;
  Account: string;
  PostedDate: string;
  CategoryId: number;
  ChildTransactions: ITransactionDetail[];
  OriginalCategoryId: number;
  RunningBalance: number;
  Currency?: string;
  ShortDescription?: string;
  StatementDate?: string;
  StatementLineNumber?: number;
  StatementNumber?: number;
}

export interface IServiceProvider {
  serviceProviderCode: string;
  serviceProviderName: string;
}

export interface IPlasticCard {
  image?: string;
  actionListItem?: ICardActionListsData[];
  plasticId?: number;
  plasticNumber?: string;
  plasticStatus?: string;
  plasticType?: string;
  dcIndicator?: string;
  plasticCustomerRelationshipCode?: string;
  plasticStockCode?: string;
  plasticCurrentStatusReasonCode?: string;
  plasticBranchNumber?: string;
  nameLine?: string;
  expiryDate?: string;
  issueDate?: string;
  plasticDescription?: string;
  cardAccountNumber?: string;
  owner?: boolean;
  availableBalance?: number;
  allowATMLimit?: boolean;
  allowBranch?: boolean;
  allowBlock?: boolean;
  allowReplace?: boolean;
  linkedAccountNumber?: string;
  isCardFreeze?: boolean;
  F2FBranch?: string;
  ItemAccountId?: string;
  plasticStatusCode?: string;
  isInitialCard?: boolean;
}

export interface ICardFreeze {
  Result?: boolean;
  ResponseCode?: string;
  PreviousStatus?: string;
  NewStatus?: string;
}

export interface IReoccurenceModel {
  reoccurrenceFrequency: string;
  reoccurrenceOccur?: Number;
  reoccSubFreqVal: string;
  reoccurrenceToDate?: string;
}

export interface IBuyPrepaidDetail {
  transactionID?: string;
  startDate: string;
  amount: number;
  fromAccount: ITransferAccount;
  destinationNumber: string;
  myDescription: string;
  productCode: string;
  serviceProvider: string;
  favourite: boolean;
  isVoucherAmount: boolean;
  beneficiaryID?: number;
  reoccurrenceItem?: IReoccurenceModel;
  secureTransaction?: ISecureTransaction;
  saveBeneficiary?: boolean;
  bFName?: String;
  notificationDetails?: IPaymentNotification[];
}

export interface IPrepaidMetaData {
  resultData: IPrepaidResultData[];
}

export interface IPrepaidResultData {
  batchID?: string;
  transactionID?: string;
  execEngineRef?: string;
  resultDetail: IPrepaidResultDetail[];
}

export interface IPrepaidResultDetail {
  operationReference?: string;
  result?: string;
  status?: string;
  reason?: string;
}

export interface IPublicHoliday {
  date: string;
  dayName: string;
  description: string;
}

export interface IBankDefinedBeneficiary {
  bDFID: string;
  bDFName: string;
  sortCode: number;
}

export interface IContactCard {
  contactCardID?: number;
  contactCardName: string;
  contactCardNotifications?: IContactCardNotification[];
  contactCardDetails?: IContactCardDetail[];
  beneficiaryRecentTransactDetails?: IBeneficiaryRecentTransactDetail[];
  secureTransaction?: ISecureTransaction;
}

export interface IContactCardDetail {
  accountType: string;
  beneficiaryID?: number;
  beneficiaryName: string;
  accountNumber: string;
  bankCode?: string;
  branchCode?: string;
  bankName?: string;
  instantPaymentAvailable?: boolean;
  beneficiaryType: string;
  myReference?: string;
  beneficiaryReference?: string;
  valid?: boolean;
  isDeleted?: boolean;
  branch?: IBranch;
}

export interface IContactCardNotification {
  notificationAddress: string;
  notificationType: string;
  notificationDefault?: boolean;
  notificationParents?: INotificationParent[];
  isDeleted?: boolean;
}

export interface INotificationParent {
  beneficiaryID: number;
  beneficiaryType: string;
  notificationID: number;
}

export interface IBeneficiaryRecentTransactDetail {
  paymentDate: Date;
  paymentAmount: number;
  acctNumber: string;
  paymentDRNarration: string;
  paymentCRNarration: string;
  execEngineRef: string;
  beneficiaryID: number;
  beneficiarytype: string;
}
export interface IBuyElectricityAccountDetail {
  itemAccountId: string;
  accountNumber: string;
  productCode: string;
  productDescription: string;
  isPlastic: boolean;
  accountType: string;
  nickname: string;
  sourceSystem: string;
  currency: string;
  availableBalance: number;
  currentBalance: number;
  profileAccountState: string;
  accountLevel: string;
  viewAvailBal: boolean;
  viewStmnts: boolean;
  isRestricted: boolean;
  viewCurrBal: boolean;
  viewCredLim: boolean;
  viewMinAmtDue: boolean;
  isAlternateAccount: boolean;
  allowCredits: boolean;
  allowDebits: boolean;
  accountRules: {
    instantPayFrom: boolean;
    onceOffPayFrom: boolean;
    futureOnceOffPayFrom: boolean;
    recurringPayFrom: boolean;
    recurringBDFPayFrom: boolean;
    onceOffTransferFrom: boolean;
    onceOffTransferTo: boolean;
    futureTransferFrom: boolean;
    futureTransferTo: boolean;
    recurringTransferFrom: boolean;
    recurringTransferTo: boolean;
    onceOffPrepaidFrom: boolean;
    futurePrepaidFrom: boolean;
    recurringPrepaidFrom: boolean;
    onceOffElectricityFrom: boolean;
    onceOffLottoFrom: boolean;
    onceOffiMaliFrom: boolean;
  };
}

export interface IBuyElectricityDetail {
  transactionID?: string;
  startDate?: string;
  amount?: number;
  fromAccount?: ITransferAccount;
  destinationNumber: string;
  myDescription?: string;
  productCode: string;
  serviceProvider: string;
  beneficiaryID?: number;
}
export interface IBuyElectricityDetailWithGUID {
  requestId: string;
  prepaids: IBuyElectricityDetail[];
}
export interface IBuyElectricityMetaData {
  resultData: IBuyElectricityResultData[];
}

export interface IBuyElectricityResultData {
  batchID?: string;
  transactionID?: string;
  execEngineRef?: string;
  resultDetail: IBuyElectricityResultDetail[];
}

export interface IBuyElectricityResultDetail {
  operationReference?: string;
  result?: string;
  status?: string;
  reason?: string;
}

export interface IBuyElectricityLimitDetail {
  limitType: string;
  dailyLimit: number;
  userAvailableDailyLimit: number;
  maxDailyLimit: number;
  isTempLimit: boolean;
  maxTmpDateRangeLimit: number;
}

export interface IBuyElectricityVoucherDetail {
  meterNumber: string;
  distributor: string;
  customerName: string;
  customerAddress: string;
  serviceProvider: string;
  nedbankReferenceNr: string;
  amount: number;
  globalReceiptNr: string;
  taxInvoiceNr: string;
  supplyGroupCode: number;
  keyRevisionNr: number;
  tarrifIndexCode: number;
  algorithmCode: number;
  tokenTechnologyCode: number;
  tokenDetail: IElectricityTokenDetail[];
  enquiries: string;
}

export interface IElectricityTokenDetail {
  normalSaleToken: string;
  electricityAmount: number;
  vat: number;
  electricityUnits: number;
}
// validation

export interface IBuyElectricityMeterValidationDetails {
  transactionID?: string;
  startDate?: string;
  nextTransDate?: string;
  destinationNumber: string;
  productCode: string;
  serviceProvider: string;
  electricityMeterDetails?: {
    Municipality: string;
  };
}
export interface IBuyElectricityAmountInArrearsDetails {
  transactionID?: string;
  startDate?: string;
  nextTransDate?: string;
  destinationNumber: string;
  productCode: string;
  serviceProvider: string;
  electricityMeterDetails?: {
    Municipality: string;
  };
  electricityAmountInArrears?: number;
}
export interface IBuyElectricityMeterValidationDetailsWithGUID {
  requestId: string;
  prepaids: IBuyElectricityMeterValidationDetails[];
}
export interface IBuyElectricityBillDetails extends IBuyElectricityMeterValidationDetails {
  electricityAmountInArrears: number;
}
export interface IBuyElectricityAmountInArrearsDetailsWithGUID {
  requestId: string;
  prepaids: IBuyElectricityAmountInArrearsDetails[];
}

export interface IBuyElectricityMeterValidationMetaData {
  resultData: IBuyElectricityMeterValidationResultData[];
}

export interface IBuyElectricityMeterValidationResultData {
  transactionID?: string;
  resultDetail: IBuyElectricityMeterValidationResultDetail[];
}

export interface IBuyElectricityMeterValidationResultDetail {
  operationReference?: string;
  result?: string;
  status?: string;
  reason?: string;
}

export interface IBeneficiaryData {
  bankDefinedBeneficiary?: IBankDefinedBeneficiary;
  contactCard?: IContactCard;
  contactCardDetails?: {
    isPrepaid?: boolean,
    isAccount?: boolean,
    isElectricity?: boolean,
    cardDetails: IContactCardDetail;
  };
  schedulePayments?: IScheduledTransactionType[];
  isEmptyState?: Boolean;
  selectedTransaction?: IBeneficiaryRecentTransactDetail;
}

export interface IRadioButtonItem {
  label: string;
  value: string;
  subTitle?: string;
  isToolTipEnabled?: boolean;
  isTooltipActive?: boolean;
}

export interface INavigationModel {
  label: string;
  url: string;
}

export interface INotificationModel {
  type: NotificationTypes;
  message: string;
  sectionName: string;
  serviceErrorMessage?: string;
}

export interface IGameCutOffTIme {
  dayNumber: number;
  dayName: string;
  time: string;
}

export interface IGameMetadata {
  gameType: string;
  gameTypeName: string;
  cutOffTimes: IGameCutOffTIme[];
}

export interface IJackpotInfo {
  game: string;
  nextDrawDate: string;
  drawNumber: number;
  jackpotAmount: number;
}

export interface IGamesMetadata {
  data: IJackpotInfo[];
}

export interface ITransactionMetaData {
  resultData: ITransactionResultData[];
}
export interface IMarker {
  longitude: Number;
  latitude: Number;
  name?: string;
  address?: string;
}

export interface IBranchDetail {
  longitude: string;
  latitude: string;
  code: number;
  clearingCode: number;
  name: string;
  bank: string;
  type: string;
  generatorInd: string;
  forexService: string;
  telephone: string;
  fax: string;
  email: string;
  address: string;
  suburb: string;
  town: string;
  province: string;
  postalCode: number;
  operatingHours: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  cardUplift: string;
}
export interface IATMDetail {
  id: string;
  name: string;
  brand: string;
  type: string;
  depositIndicator: string;
  longitude: string;
  latitude: string;
  address: string;
  suburb: string;
  town: string;
  province: string;
}

export interface ITransactionResultData {
  batchID?: string;
  transactionID?: string;
  execEngineRef?: string;
  resultDetail: ITransactionResultDetail[];
}

export interface ITransactionResultDetail {
  operationReference?: string;
  result?: string;
  status?: string;
  reason?: string;
}

export interface IAuthorizeResponse {
  MetaData: MetaData;
  Data?: { TokenValue: string };
}

export interface MetaData {
  ResultCode: string;
  Message: string;
  InvalidFieldList?: any;
}

export interface IScheduledTransaction {
  batchID?: number;
  transactionID: number;
  capturedDate?: string;
  startDate: string;
  nextTransDate: string;
  beneficiaryID?: number;
  sortCode?: string;
  bFName?: string;
  myDescription?: string;
  beneficiaryDescription?: string;
  fromAccount: IPaymentAccount;
  toAccount: IPaymentAccount;
  amount: number;
  reoccurrenceItem?: IReoccurrenceItem;
  destinationNumber?: string;
  serviceProvider?: string;
  serviceProviderName?: string;
  notificationDetail?: IPaymentNotification;
  requestId?: string;
  notificationDetails?: [IPaymentNotification];
}

export interface IReoccurrenceItem {
  reoccurrenceFrequency: string;
  recInstrID: number;
  reoccurrenceOccur: number;
  reoccOccurrencesLeft: number;
  reoccurrenceToDate: string;
  reoccSubFreqType: string;
  reoccSubFreqVal: string;
}

export interface IClientPreferences {
  preferenceKey: string;
  preferenceValue: string;
}
export interface IClientDetails {
  CisNumber: number;
  FirstName: string;
  SecondName: string;
  Surname: string;
  FullNames: string;
  oldFullNames?: string;
  CellNumber: string;
  EmailAddress: string;
  BirthDate: string;
  FicaStatus: number;
  SegmentId: string;
  IdOrTaxIdNo: number;
  SecOfficerCd: string;
  PassportNo?: string;
  AdditionalPhoneList?: IAdditionalPhoneList[];
  Address: IAddress;
  PreferredName?: string;
  DefaultAccountId?: string;
  Resident?: string;
  ClientType?: string;
  MaritalStatus?: string;
  MarriageType?: string;
}
export interface IAdditionalPhoneList {
  AdditionalPhoneType: string;
  AdditionalPhoneNumber: string;
}
export interface IAddress {
  AddressLines: IAddressLine[];
  AddressCity?: string;
  AddressPostalCode?: string;
}
export interface IAddressLine {
  AddressLine: string;
}
export interface IClientPreferenceDetails {
  PreferenceKey: string;
  PreferenceValue: string;
}
export interface IProfileDetails {
  FullNames: string;
  CellNumber: string;
  EmailAddress: string;
  Address: IAddress;
}

export interface IScheduledTransactionType {
  type: string;
  iconClass: string;
  transaction: IScheduledTransaction;
}
export interface IDebitOrdersDetail {
  AcctNumber: string;
  TranDate: string;
  TranCode: string;
  Amount: number;
  Narrative: string;
  StatementNumber: number;
  StatementLineNumber: number;
  StatementDate: string;
  MandateReferenceNo: string;
  ChargeAmount: number;
  MandateStatus?: string;
}
export interface IDebitOrder {
  accountDebited: string;
  chargeAmount: number;
  contractReferenceNr?: string;
  creditorName: string;
  debitOrderType: string;
  disputed: boolean;
  stopped?: boolean;
  frequency?: string;
  installmentAmount: number;
  itemAccountId: string;
  lastDebitDate?: string;
  statementDate: string;
  statementLineNumber: number;
  statementNumber: number;
  subTranCode?: string;
  tranCode?: string;
  stoppedDate?: string;
  sequenceNumber?: number;
}
export interface IDebitOrderReasons {
  channelTechType?: string;
  code: string;
  description: string;
}
export interface IDebitOrderReasonsData {
  data: IDebitOrderReasons[];
}
export interface IMandateOrdersDetail {
  DebtorName: string;
  DebtorAccountNumber: string;
  CreditorName: string;
  MandateInitiationDate: string;
  MandateStatus: string;
  MandateReferenceNumber: string;
  MandateIdentifier: string;
  ContractReference: string;
  InstalmentAmount: number;
  MandateAuthenticationDate: string;
}

export interface ISelectGameNotification {
  notificationType: string;
  notificationAddress: string;
}

export interface IPurchaseAccount {
  AccountNumber: string;
  accountType: string;
  AccountName?: string;
  ItemAccountId?: string;
}

export interface IGameData {
  transactionID?: string;
  ClientRequestedDate?: string;
  FromAccount: IPurchaseAccount;
  Game?: string;
  GameType?: string;
  DrawNumber?: number;
  DrawDate?: string;
  DrawsPlayed?: number;
  BoardsPlayed?: number;
  IsLottoPlus?: Boolean;
  IsLottoPlusTwo?: Boolean;
  MyDescription?: string;
  Favourite?: boolean;
  BoardDetails?: IBoard[];
  notificationDetails?: ISelectGameNotification[];
  failureReason?: string;
  secureTransaction?: ISecureTransaction;
}
export interface ILottoMetaData {
  resultData: ILottoResultData[];
}

export interface ILottoResultData {
  batchID?: string;
  transactionID?: string;
  execEngineRef?: string;
  resultDetail: ILottoResultDetail[];
}

export interface ILottoResultDetail {
  operationReference?: string;
  result?: string;
  status?: string;
  reason?: string;
}

export interface ILinkableAccounts {
  Balance: number;
  AvailableBalance: number;
  AccountNumber: string;
  AccountType: string;
  Status: string;
  NewAccount: boolean;
  LastUpdate: string;
  Currency: string;
  SiteId: number;
  InterestRate: number;
}

export interface ILinkAccount {
  AccountNickname: string;
  AccountNumber: string;
  AccountType: string;
  Status: string;
}

export interface IRefreshAccountsResult {
  resultCode: number;
  resultMessage: string;
}

export interface IRefreshAccountsApiResult {
  result: IRefreshAccountsResult;
}
export interface IDisputeOrderPost {
  transactionReference: string;
  installmentAmount: number;
  lastDebitDate: string;
  reason: string;
  description: string;
  subTranCode: string;
}

export interface IStopOrderPost {
  lastDebitDate: string;
  tranCode: string;
  installmentAmount: number;
  creditorName: string;
  statementNumber: number;
  statementLineNumber: number;
  statementDate: string;
  reasonCode: string;
  contractReferenceNr: string;
  chargeAmount: number;
  subTranCode: string;
}

export interface ICancelStopOrderPost {
  installmentAmount: number;
  tranCode: string;
  lastDebitDate: string;
  sequenceNumber: number;
}

export interface IManagePaymentDetailsPost {
  installmentAmount?: number;
  paymentDate?: string;
  bankName: string;
  bankBranchCode: number;
  bankAccNumber: string;
  accountType?: string;
  additionalAccounts?: ISimilarAccounts[];
  totalInstallment?: number;
  nextInstallmentDate?: string;
  bankAccountType?: string;
  similarAccounts?: ISimilarAccounts[];
}

export interface IUpdateLoanPayment {
  isYourBankAccount: boolean;
  applyDetailsToAll: boolean;
  authNedbank: boolean;
  acceptTerms: boolean;
}
export interface IAccountRename {
  NickName: string;
}

export interface IRenameAccount {
  AccountNumber: string;
  AccountNickName: string;
}

export interface IFeedbackDetail {
  FeedbackType?: string;
  Description?: string;
  BrowserType?: string;
  WebVersion?: string;
  feedbackType?: string;
  description?: string;
  browserType?: string;
  webVersion?: string;
}
export interface ICallbackDetail {
  MobileNo: string;
  CallbackTime: string;
  Description: string;
  BrowserType: string;
  WebVersion: string;
}

export interface IFeedbackResult {
  MetaData?: IFeedbackResultMetaData;
  Data?: string;
  metadata?: ITransactionMetaData;
  data?: string;
}
export interface IFeedbackResultMetaData {
  ResultCode: string;
  Message: string;
  InvalidFieldList: string;
  result: {
    resultCode: number;
    resultMessage: string;
  };
}

export interface IDeviceInfo {
  browser: string;
  browser_version: string;
  device: string;
  os: string;
  os_version: string;
  userAgent: string;
}

export interface ITransactionStatus {
  isValid: boolean;
  reason: string;
  status?: string;
  result?: string;
}

export interface IResultStatus {
  isValid: boolean;
  reason: string;
  status?: string;
}

export interface IGameTicketData {
  batchID: number;
  capturedDate: string;
  clientRequestedDate: string;
  purchaseDate: string;
  ticketRequestedTime: string;
  myDescription: string;
  fromAccount: IPurchaseAccountDetail;
  amount: number;
  notificationDetails: any[];
  game: string;
  gameType: string;
  drawNumber: number;
  drawDate: string;
  drawsPlayed: number;
  boardsPlayed: number;
  isLottoPlus: boolean;
  isLottoPlusTwo: boolean;
  ticketStatus: string;
  purchaseReferenceNumber: string;
  boardDetails: BoardDetail[];
  isReplay: boolean;
  isViewMore: boolean;
}

export interface IPurchaseAccountDetail {
  accountNumber: string;
  accountType: string;
}

export interface BoardDetail {
  boardNumber: string;
  numbersPlayed: string;
  BoardNumber: string;
  NumbersPlayed: string;
}

export interface IGameWinningNumbersData {
  drawName: string;
  drawDate: string;
  nextDrawDate: string;
  drawNumber: number;
  ballDetails: IGameBallDetail[];
  winnerDetails: IGameWinnerDetail[];
  rolloverAmount: number;
  rolloverNumber: number;
  totalPrizePoolAmount: number;
  totalSalesAmount: number;
  estimatedJackpotAmount: number;
  guaranteedJackpotAmount: number;
  drawMachineName: string;
  ballSetNumber: string;
  provincialWinners: IGameprovincialWinner;
}

export interface IGameBallDetail {
  sequenceNumber: string;
  ballNumber: number;
}

export interface IGameWinnerDetail {
  divisionNumber: number;
  payoutAmount: number;
  numberOfWinners: number;
}

export interface IGameprovincialWinner {
  wCWinners: number;
  nCWinners: number;
  eCWinners: number;
  mPWinners: number;
  lPWinners: number;
  fSWinners: number;
  kZNWinners: number;
  nWWinners: number;
}

export interface IVerifyProfile {
  Profile: string;
  PIN: string;
  Password: string;
}

export interface IVerifyProfileData {
  TemporaryID: number;
  MobileNumber: string;
  Title: string;
  FirstName: string;
  Surname: string;
  Username: string;
}

export interface ICheckUsername {
  username?: string;
}

export interface GeneralInfo {
  FirstName?: string;
  Surname?: string;
  EmailAddress?: string;
  Title?: string;
  Gender?: string;
  DateOfBirth?: string;
  EnterpriseCustomerNumber?: number;
  Password: string;
  Username: string;
}

export interface IUpdateUser {
  TemporaryID: number;
  GeneralInfo: GeneralInfo;
  TermsAndConditionsAccepted: boolean;
}

export interface IApproveITInfo {
  ApproveITMethod: string;
  ApproveITVerificationID: number;
  OTP: number;
}

export interface IApprove {
  TemporaryID: number;
  ApproveITInfo: IApproveITInfo;
}

export interface IApproveResponse {
  MetaData: MetaData;
  Data: IApprove;
}

export interface ISecurityStatuData {
  TemporaryID: number;
  ApproveITInfo: IApproveITInfo;
}

export interface ILinkProfile {
  Action: string;
  ProfileInfo: {
    Profile: string;
    PIN: string;
    Password: string;
  };
  ApproveItInfo: IApproveITInfo;
}

export interface ILogContent {
  content: string;
  isError: boolean;
  token: string;
}

export interface INedbankUser {
  uniqueuserid: number;
  partnerid: number;
}

export interface INedbankAlias {
  SupportedPartnerID: number;
  Alias: string;
}

export interface INedbankAliasResponse {
  MetaData: MetaData;
  Data: INedbankAlias[];
}

export interface IOutOfBandResponse {
  data?: any[];
  metadata?: IOutOfBandMetaData;
}

export interface IOutOfBandRequest {
  verificationReferenceId: string;
  transactionVerificationCode: string;
}

export interface IOutOfBandMetaData {
  resultData?: IOutOfBandResultData[];
}

export interface IOutOfBandResultData {
  batchID?: number;
  transactionID?: string;
  resultDetail?: IOutOfBandResultDetail[];
  execEngineRef?: string;
}

export interface IOutOfBandResultDetail {
  operationReference?: string;
  result?: string;
  status?: string;
  Reason?: string;
}

export interface ISecureTransaction {
  verificationReferenceId: string;
}
export interface IReplaceCardPayload {
  cardnumber: string;
  reason: string;
  branchcode: string;
  branchName: string;
  isCourier?: boolean;
  allowBranch?: boolean;
}
export interface IParentOperation {
  isSaveRecipient?: boolean;
  isValid?: boolean;
  isSaveLoading?: boolean;
}

export interface IGaEvent {
  category?: String;
  label?: String;
  action?: String;
  value?: String;
  fieldsObject?: any;
}

export interface ILoaderProperties {
  isShown?: boolean;
  color?: string;
}

export interface ILottoFromAccountType {
  accountNumber: string;
  accountType: string;
}

export interface IGaPageTracking {
  page_path: string;
  page_title: string;
  custom_map?: IGADimensionMap;
}

export interface IGADimensionMap {
  dimension1: string;
}

export interface ILottoFromAccount {
  AccountNumber: string;
  AccountType: string;
}

export interface ILottoHistoryData {
  ClientRequestedDate?: string;
  PurchaseDate?: string;
  TicketRequestedTime?: string;
  FromAccount: ILottoFromAccount;
  Amount?: number;
  Game?: string;
  GameType?: string;
  DrawNumber?: number;
  DrawDate?: string;
  DrawsPlayed?: number;
  BoardsPlayed?: number;
  IsLottoPlus?: Boolean;
  IsLottoPlusTwo?: Boolean;
  MyDescription?: string;
  NotificationDetails?: ISelectGameNotification[];
  TicketStatus?: string;
  PurchaseReferenceNumber?: string;
  game?: string;
  isLottoPlus?: Boolean;
  isLottoPlusTwo?: Boolean;
  fromAccount?: ILottoFromAccountType;
  drawsPlayed?: number;
}

export interface IPreferenceDetail {
  PreferenceKey: string;
  PreferenceValue: string;
}

export interface CountryDetail {
  countryName: string;
  isoCountry: string;
  destinationCountry: string;
  destinationEntity: string;
}
export interface IDefaultAccounts {
  AccountName: string;
  Balance: number;
  AvailableBalance: number;
  AccountNumber: number;
  AccountType: string;
  AccountIcon: string;
  NewAccount: boolean;
  LastUpdate: string;
  InstitutionName: string;
  Currency: string;
  SiteId: string;
  ItemAccountId: string;
  InterestRate: number;
  radioList?: any[];
}
export interface IAccountBalanceDetail {
  currentBalance?: number;
  movementsDue?: number;
  unclearedEffects?: number;
  accruedFees?: number;
  pledgedAmount?: number;
  crInterestDue?: number;
  crInterestRate?: number;
  dbInterestDue?: number;
  dbInterestRate?: number;
  overdraftLimit?: number;
  investmentAccountType?: string;
  accruedInterest?: number;
  accountType?: string;
  investmentDetailsList?: IInvestmentDetailsList[];
  availableBalance?: number;
  currency?: string;
  currencyCode?: string;
  isShowSettlement?: boolean;
  isShowSettlementAmount?: boolean;
  accountHolderName?: string;
  paymentDueDate?: string;
  accountName?: string;
  accountNumber?: string;
  interestRate?: number;
  loanAmount?: number;
  nextInstallmentAmount?: number;
  paymentTerm?: string;
  termRemaining?: string;
  balloonAmount?: number;
  isSingleBond?: boolean;
  PropertyAddress?: string;
  nameAndSurname?: string;
  contactNumber?: string;
  email?: string;
  balanceNotPaidOut?: number;
  outstandingBalance?: number;
  amountInArrears?: number;
  nextPaymentDue?: number;
  nextPaymentDate?: string;
  registeredAmount?: number;
  isJointBond?: boolean;
  loanDescription?: string;
  isShowHLSettlement?: boolean;
  loanCancellationDate?: string;
  loanCancellationNoticeExpiryDate?: string;
  loanExpectedClosureDate?: string;
}

export interface IFicaResult {
  isFica: boolean;
}

export interface IInvestmentDetailsList {
  additionalDeposit: number;
  availableBalance: number;
  availableWithdrawal: number;
  bonusPercentage: number;
  currency: string;
  currentBalance: number;
  dateOfOpening: string;
  depositFrequency: number;
  initialDeposit: number;
  interestFrequency: string;
  interestRate: number;
  investmentAccountType: string;
  investmentNumber: string;
  investmentProductName: string;
  investmentProductType: string;
  investmentTerm: string;
  payOutDate: string;
  reservedForRelease: number;
  termRemaining: string;
  totalInterestPaid: number;
  withdrawalFrequency: number;
}
export interface IResultDetail {
  operationReference: string;
  result: string;
  status: string;
  reason?: string;
}

export interface IResultData {
  resultDetail: IResultDetail[];
}

export interface IMetaData {
  resultData: IResultData[];
}

export interface ITypeDataTransactionData {
  GameType?: string;
  GameName?: string;
}
export interface ITransactionData extends ITransactionDetail {
  AccountNumber: string;
  TransactionType: string;
  TransactionDescription: string;
  TransactionAmount: number;
  TransactionDate: string;
  ReferenceNumber: string;
  ErrorCode: string;
  TypeData: {
    type: string,
    data?: ITypeDataTransactionData;
  };
}
export interface ITransactionDetailIS {
  data?: ITransactionData;
  metadata?: IMetaData;
}

export interface IBalanceDetailsChangeLabel {
  label: string[];
}
export interface ICrossBorderQuoteCalculateResult {
  beneficiaryAmount: string;
  cutOffTime: string;
  deliveryTimeInHour: string;
  maximumRemittanceAmount: string;
  paymentExchangeRate: string;
  remittanceCharge: string;
  totalPaymentAmount: string;
}

export interface ICrossBorderQuoteCalculate {
  beneficiaryCountry: string;
  beneficiaryCurrency: string;
  paymentCurrency: string;
  residentialStatus: string;
  transactionID: string;
  beneficiaryAmount?: number;
  paymentAmount?: number;
}

export interface IShareAccountReq {
  channel: string;
  sharedAccountDetails: ISharedAccount[];
  sharedRecipientDetails: ISharedRecipient[];
  sharedCustomerDetails: ISharedCustomer[];
}

export interface ISharedAccount {
  accountNumber: string;
  accountName: string;
  accountType: string;
  branchCode: string;
}

export interface ISharedRecipient {
  partyName: string;
  contactDetail: ISharedContact[];
}

export interface ISharedContact {
  id: number;
  emailId: string;
  phoneNumber?: string;
  isValidEmail?: boolean;
}

export interface ISharedCustomer {
  identifierType: string;
  identifier: string;
}

export interface IUniversalBranchCode {
  accountType: string;
  branchCode: string;
}
export interface ITransactionDetailsData {
  itemAccountId: number;
  balance: number;
  accountContainers: IDashboardAccounts[];
}

export interface INotification {
  message: string;
  showMessage: boolean;
  isSuccess: number;
}

export interface IPropertyLabelsDetailedBalances {
  prop: string;
  append: string;
}
export interface IPropertyToApplyFilter {
  date?: string[];
  rate?: string[];
  noFilter?: string[];
}
export interface IKeyValueMapResultSequence {
  key: string;
  value: string;
  id: string;
}

export interface IOverdraftAttempts {
  remainingTime: string;
  overdraftAttempts: number;
}

export interface IChangeOverdraftLimitRequest {
  requestType: string;
  itemAccountId: string;
  newOverdraftLimit: number;
  currentOverdraftLimit: number;
  email: string;
  phoneNumber: string;
  reason: string;
}

export interface IPhoneNumber {
  phoneNumber: string;
  isValid: boolean;
}

export interface IValidationSetting {
  validationKey: string;
  validationValue: string;
}

export interface IValidation {
  validationType: string;
  setting: IValidationSetting[];
}

export interface IReportComponent {
  reportData: any;
}

export interface IChatUser {
  name: string;
  email: string;
}

export interface IChatFeedback {
  rating: number;
  questionNumber: number;
}

export interface ITripCountry {
  countryCde: string;
  countryDesc: string;
}

export interface IChatDetails {
  AgentFirstName: string;
  Message: string;
  WriteTime: string;
  Type: string;
}

export interface IReportComponent {
  reportData: any;
}

export interface IResultData {
  resultDetail: IResultDetail[];
}

export interface IMetaData {
  resultData: IResultData[];
}

export interface IStatementPreferences {
  itemAccountId?: string;
  accountNumber: string;
  frequency: string;
  deliveryMode: string;
  paymentMethod?: string;
  email: string[];
  postalAddress: {
    addrLines: string[];
    postalCd: string;
    city: string;
  };
  physicalAddress?: any;
}

export interface IStatementDetails {
  accountType: string;
  isGroupDisabled: boolean;
  inProgress: boolean;
}

export interface IPostalCode {
  city: string;
  postalCode: string;
  suburb: string;
  postalCodeType: string;
}

export interface IErrorEmitterResponse {
  type: string;
  data?: object;
}
export interface ISystemErrorModel {
  error?: object | string;
  callbackEmitter?: EventEmitter<IErrorEmitterResponse>;
}

export interface ISettlementDetail {
  settlementAmt: number;
  settlementDate?: string;
  accountToTransfer?: IDashboardAccount;
  beneficiaryData?: IBeneficiaryData;
  yourReference?: string;
  theirReference?: string;
  loanAccountNumber?: number;
  typeOfProduct?: string;
  lastPaymentAmount?: string;
  lastPaymentDate?: string;
  article?: string;
  loanSettled?: boolean;
  quoteRequestedOn?: string;
  quoteValidUntil?: string;
}

export interface ISettlementQuote {
  itemAccountId: string;
  emailId: string;
}

export interface ISettlementFeatureVisibleProps {
  showAmount: boolean;
  showSettleLoanBtn: boolean;
  showSettlementQuoteBtn: boolean;
  showError: boolean;
  isLoading: boolean;
}

export interface IClientAccountDetail extends IApiResponse {
  AccountHolderName?: string;
  IsAlternateAccount?: boolean;
  AccountName?: string;
  AccountNumber?: string;
  AccountType?: string;
}

export interface ICustomerEnrolmentReq {
  iDNumber: string;
  customerNo: string;
  rewardsProgram: string;
  activateEarnOnSpend: boolean;
}

export interface IRewardsAccountItem {
  rewardsAccountNumber: string;
  rewardsAccountType: string;
  rewardsProgram: string;
  rewardsAccountStatus: string;
  rewardsAccountBalance: string;
  rewardsAccountCurrency: string;
}

export interface ICustomerEnrolment {
  enrolReferenceNumber: string;
  rewardsAccountList: IRewardsAccountItem[];
}

export interface IRewardsRedemptionReq {
  rewardsAccountNumber: string;
  customerNo: string;
  redemptionReferenceNumber: string;
  productList: IProductItem[];
}

export interface IProductItem {
  productReferenceNumber: string;
  supplierCode: string;
  supplierName: string;
  productCount: number;
  productCode: string;
  productCategory: string;
  productName: string;
  productCostPoints: number;
  productCostRands: number;
  productPropertyList: IProductPropertyItem[];
}

export interface IProductPropertyItem {
  propertyName: string;
  propertyValue: string;
}

export interface IRewardsRedemption {
  redemptionReferenceNumber: string;
  rewardsAccountCurrency: string;
  randBalance: number;
  rewardsAccountBalance: string;
  redemptionList: IRedemptionItem[];
}

export interface IRedemptionItem {
  productReferenceNumber: string;
  purchaseOrderNumber: string;
  supplierCode: string;
  supplierName: string;
  productCount: number;
  productCode: string;
  productName: string;
  productCostPoints: number;
  productPropertyList: IProductPropertyItem[];
}

export interface IGetRateReq {
  programmeId: string;
}

export interface IRate {
  programmeRate: number;
}

export interface INedIDTermsAccept {
  Version: INedIDTermsVersion;
  AcceptedDateTime: string;
}

export interface IDormancyRequest {
  secureTransaction: {
    verificationStatusEnum: string;
    verificationReferenceId: number;
    customId: string;
  };
}

export interface IValidationSetting {
  validationKey: string;
  validationValue: string;
}

export interface IValidation {
  validationType: string;
  setting: IValidationSetting[];
}

export interface IBalanceDetailProps {
  itemAccountId: number;
  accountType: string;
  containerName: string;
  isDormantAccount: boolean;
}
// online Investment
export interface IInvestmentNotice {
  investmentNumber: string;
  noticeDate: string;
  noticeAmount: number;
}

export interface INoticeDetail extends ICapitalDisposalAccount, IInvestmentNotice {
  sortCode?: number;
  benificiaryRefrence?: string;
  beneficiaryIndicator?: string;
}

export interface IInvestmentList {
  investmentProductType: string;
  investmentProductName: string;
}

export interface IProductDetails {
  investmentDetailsList: IInvestmentList[];
}

export interface ICapitalDisposalAccount {
  accountNumber: number;
  accountType: string;
}

export interface INotice extends IInvestmentNotice {
  SortCode?: number;
  BeneficiaryReferenceNumber?: string;
  capitalDisposalAccount: ICapitalDisposalAccount;
  beneficiaryIndicator?: string;
}

export interface INoticePayload {
  requestId: string;
  notices: INotice[];
}

export interface IViewNoticeDetails {
  noticeID?: string;
  noticeDate?: string;
  noticeAmount?: number;
  capitalDisposalAccount?: ICapitalDisposalAccount;
  beneficiaryIndicator?: string;
  nickname?: string;
}

export interface IRecurringPayment {
  recurringDay: number;
  recurringFromAccType: string;
  recurringFromAcc: string;
  recurringAmount: number;
  recurringFreq: string;
}

export interface IOpenNewAccountPayload extends IOpenNewAccountPayloadForFixedDeposit {
   recurringPaymentDetail: IRecurringPayment[];
}

export interface IBranches {
  accountType: string;
  branchName: string;
  branchCode: number;
  displayName?: string;
  beneficiaryReference?: string;
}

export interface IAccountInfo {
  AccountNumber: string;
  AvailableBalance: number;
  AccountType: string;
  itemAccountId?: string;
}

export interface IAccount {
   nickname: string;
   accountType?: string;
   accountNumber: number;
   availableBalance?: number;
}
export interface IDeposit {
   name: string;
   noticeDeposit?: string;
   realtimerate?: number;
   frequency1?: string;
   productType?: number;
}
export interface IDepositDetails {
  investorNumber: number;
  Amount: number;
  depositAccount: string;
  Months: number;
  depositAccountType: string;
  frequency1?: string;
  productType?: number;
  depositAccountNumber?: string;
}
export interface IPayoutDetails {
  payoutOption?: string;
  payoutDay?: number;
  payoutAccount?: string;
  payoutAccountType?: string;
  nickname?: string;
  Account?: string;
}

export interface IDepositAccount {
   investorNumber: string;
   Amount: number;
   depositAccount: string;
   Months: number;
}

export interface IRecurringDetails {
   Frequency: string;
   Day: string;
   Amount: number;
   Account: string;
   isRecurringYes?: boolean;
   recurringAccountType?: string;
   accountNumber?: string;
}

export interface IOpenNewAccountPayloadForFixedDeposit {
   requestID: string;
   investorNumber: number;
   investmentType: number;
   depositFromAccType: string;
   depositFromAcc: string;
   investmentTerm: number;
   currentInterestRate: number;
   interestFrequency: string;
   interestDay: number;
   interestDisposalAccType: string;
   interestDisposalAcc: string;
   capitalDisposalAccType: string;
   capitalDisposalAcc: string;
   depositAmount: number;
}

export interface IInterestInfo {
   accountName: string;
   accountNumber: number;
}

export interface IFrequency {
   frequency1: string;
}

export interface IConnectProperties {
  connectionId: ISignalRConnection;
  agentName: string;
  chatHistory: any;
  chatsFE: any;
  yesClicked: boolean;
  connectionEstablished?: boolean;
  agentDisconnected?: boolean;
  question: any;
  yesClickedLoggedIn?: boolean;
  connected?: boolean;
  showNps?: boolean;
  isTyping?: boolean;
}

export interface IChatProperties {
  chatActive?: boolean;
}

export interface IChatData {
  chatsFE?: any[];
  chatsFEHistory?: any[];
  chats?: any[];
  questionNumber?: number;
  nedBankLogo?: boolean;
  yesClicked?: boolean;
  fillDetails?: boolean;
  agentDisconnected?: boolean;
  agentName?: string;
  connectionEstablished?: boolean;
  yesClickedLoggedIn?: boolean;
  connectionId?: ISignalRConnection;
  showNps?: boolean;
  showSecondQuestion?: boolean;
  questions?: IChatQuestion;
}

export interface IChatQuestion {
  questionOne: string;
  questionTwo: string;
}

export interface IChatStar {
  state: string;
  counter: number;
}
export interface IUnilateralIndicator {
  unilateralLimitIndicator: boolean;
  isAvailable: boolean;
  plastics: IPlasticCard[];
  AccountName: string;
}

export interface IBankerDetail {
  firstName: string;
  lastName: string;
  workNumber: string;
  cellPhoneNumber: string;
  emailAddress: string;
  isDefaultBanker: boolean;
  bankerPicture: string;
}

export interface IDcarRange {
  minValue: number;
  maxValue: number;
}

export interface IDcarRangeDetails {
  clusterName: string;
  division: string;
  segment: string;
  displayContactDetail: boolean;
  range: IDcarRange[];
}

export interface IButtonGroup {
  label: string;
  value: string;
}

export interface IToggleButtonGroup {
  buttonGroup: IButtonGroup[];
  groupName?: string;
  isGroupDisabled: boolean;
  buttonGroupWidth?: number;
}

export interface IReportSuspicious {
  incidentDate: string;
  accountNumber?: string;
  totalAmount?: number;
  thirdPartyAccountNumber?: string;
  thirdPartyBankName?: string;
  incidentDescription: string;
  emailId: string;
}

export interface IAlertMessage {
  showSuccess?: boolean;
  showError?: boolean;
  alertMessage?: string;
  showAlert?: boolean;
  displayMessageText?: string;
  linkDisplayText?: string;
  action?: AlertActionType;
  alertType?: AlertMessageType;
}

export interface IReportAttempts {
  attempts: number;
  remainingTime: string;
  attemptsCompletedFlag: boolean;
}

export interface IBuyprepaidDetailsWithGUID {
  requestId: string;
  prepaids: IBuyPrepaidDetail[];
}

export interface ICheckboxValuesOtn {
  isChecked: boolean;
  accounts: IPlasticCard;
}

export interface ICountrycodes {
  code: string;
  description: string;
}

export interface ICountryListCheckboxDetails {
  isChecked: boolean;
  countries: ICountrycodes;
}
export interface IOverseasTravelDetails {
  fromDate: string;
  toDate: string;
  plasticId: string[];
  countries: string[];
  primaryNumber: string;
  alteranteNumber: string;
  email: string;
  contactNumber: string;
  overseasContactPerson: IContactPerson;
  localContactPerson: IContactPerson;
}

export interface ICountriesSelected {
  description: string;
  isChecked: boolean;
}
export interface ICardsSelected {
  isChecked: boolean;
  plasticId: string;
}
export interface IDocumentList {
  documentDescription: string;
  documentType: string;
  isDocumentClick: boolean;
}

export interface IDocumentSendRequest {
  documentType: string;
  itemAccountId: string;
  emailId: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface IActionSuccess {
  isSuccess: boolean;
}

export interface ISetAlertMessage {
  message: string;
  alertAction: AlertActionType;
  alertType: AlertMessageType;
}

export interface ITransactionAccountDetails {
  accountType: string;
  parentSkeleton: boolean;
  itemAccountId: number;
  searchEnabled?: boolean;
}
export interface IDriverDetails {
  id?: number;
  name: string;
  surname: string;
  driverLicenseNumber: string;
  idOrPassportNumber: string;
}

export interface ICountries {
  name: string;
}

export interface ICrossBorder {
  countries: ICountries[];
  dateOfLeaving: string;
  dateOnReturn: string;
  licensePlateNumber: string;
  insuranceCompanyName: string;
  insurancePolicyNumber: string;
  driverDetails: IDriverDetails[];
}

export interface ICrossBorderRequest extends IDocumentSendRequest {
  crossBorder: ICrossBorder;
}

export interface ICountrycodes {
  code: string;
  description: string;
}

export interface IOverseasTravelDetails {
  fromDate: string;
  toDate: string;
  plasticId: string[];
  countries: string[];
  primaryNumber: string;
  alteranteNumber: string;
  email: string;
  contactNumber: string;
  overseasContactPerson: IContactPerson;
  localContactPerson: IContactPerson;
}

export interface ICardDetails {
  cardName: string;
  plasticNumber: string;
  ownerName: string;
}

export interface IContactPerson {
  name: string;
  number: string;
}

export interface IStatementDownloadDetails {
  date: string;
  download: boolean;
  month: string;
  year: string;
}

export interface IStatementDownload {
  resultCode: string;
  resultMessage: string;
  documentSearchResultRowList: IStatementSearchRow[];
}

export interface IStatementSearchRow {
  accountNumber: string;
  startDate: Date;
  documentClass1: string;
  documentClass2: string;
  documentType: string;
  effectiveDate: string;
  effectiveTime: string;
  documentStatus: string;
  documentUrl: string;
}

export interface IActivateCardEmitObj {
  result: string;
  reason: string;
}
export interface ICreditLimitMaintenance {
  plasticId: number;
  grossMonthlyIncome: number;
  netMonthlyIncome: number;
  otherIncome: number;
  monthlyCommitment: number;
  monthlyDebt: number;
  bankName: string;
  branchNumber: string;
  selectedAccount?: IAccountDetail;
  accountNumber: string;
  preferContactNumber: string;
  primaryClientDebtReview: string;
  spouseDebtReview: string;
  statementRetrival: boolean;
}

export interface IIncomeTaxResponseData {
  resultCode?: string;
  resultMessage?: string;
  documentSearchResultRowList: IIncomeTaxResponse[];
}

export interface IIncomeTaxResponse {
  accountNumber?: number;
  partyNumber?: number;
  documentClass1?: string;
  documentClass2?: string;
  documentClass3?: string;
  documentType?: string;
  documentTitle?: string;
  effectiveDate?: Date;
  effectiveTime?: Date;
  documentStatus?: string;
  documentUrl?: string;
}

export interface IClientType {
   ClientType: string;
}

export interface IHomeLoanStatus {
  isJointBondEnabled: boolean;
  isLoanPaidUp: boolean;
  isManageLoanEnabled: boolean;
  isNinetyDaysNoticeEnabled: boolean;
}

export interface ILoanCancelRequest {
  itemaccountid: string;
  emailid?: string;
}

export interface IStatusDetail {
   title: string;
   description?: string;
   description2?: string;
   description3?: string;
}

export interface ITripData {
  tripReferenceNumber: string;
  clientEmail: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  modeOfTransport: string;
  borderPost: string;
  tripStatus: string;
  clientReferenceNumber: string;
}

  export interface ClientIdType {
      code: string;
      description: string;
  }

  export interface ClientEnterpriseNumber {
      clientIdentifier: string;
      clientIdType: ClientIdType;
  }

  export interface ClientRsaId {
      clientIdentifier: string;
      clientIdType: ClientIdType;
  }

  export interface PhoneNumber {
      countryCode: string;
      areaCode: string;
      phoneNumber: string;
  }

  export interface ClientContactDetails {
      firstName: string;
      lastName: string;
      phoneNumber: PhoneNumber;
      eMail: string;
  }

  export interface ClientAddress {
      streetNumber: string;
      streetName: string;
      building: string;
      floor: string;
      complex: string;
      unit: string;
      suburb: string;
      city: string;
      postalCode: string;
  }

  export interface ClientId {
      clientIdentifier: string;
      clientIdType: ClientIdType;
  }

  export interface ITrip {
      clientEnterpriseNumber: ClientEnterpriseNumber;
      clientRsaId: ClientRsaId;
      clientContactDetails: ClientContactDetails;
      departureDate: string;
      destination: string;
      passportExpiryDate: string;
      passportNumber: string;
      returnDate: string;
      ticketNumber: string;
      topupAllowed: string;
      transactionReference: string;
      tripStatus: string;
      borderPost: string;
      clientReference: string;
      clientAddress: ClientAddress;
      clientId: ClientId;
  }

  export interface ITripsResponse {
      validTripLoaded: string;
      trips: ITrip[];
  }

export interface IFrequencyNoticeAccount {
   stopOrderFreq1: string;
   stopOrderFreq2: number;
}

export interface IFrequencyFixedAccount {
   stopOrderFreq1: number;
   stopOrderFreq2: number;
}

export interface IFrequencyAccount {
   stopOrderFreq1: number;
   stopOrderFreq2: string;
}

export interface IChangedLimitDetail {
   limitDetail: ILimitDetail;
   status: string;
}
export interface IValidLimits {
   limitDetail: ILimitDetail;
   isValid: string;
}

export interface IChangedLimits {
   limits: IChangedLimitDetail[];
   transactionId: string;
}

export interface IMultipleLimitPayload {
   limits: ILimitDetail[];
}

export interface IAccountDetails {
  nickname: string;
  accountType?: string;
  accountNumber?: string;
}
export interface IPreApprovedResponse {
   data: IPreApprovedOffers[];
}
export interface IPreApprovedOffers {
        id: number;
        shortMessage: string;
        message: string;
        status: string;
        amount: number;
}

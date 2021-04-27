import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Constants } from '../utils/constants';
import {
   IAccountDetail, ILimitDetail, IBank, IPaymentDetail, IDashboardAccounts, IPrepaidAccountDetail,
   IPrepaidLimitDetail, ITransferDetail, IServiceProvider, IPrepaidServiceProviderProducts, IPlasticCard,
   IBuyPrepaidDetail, IUser, ITermsAndConditions, IPublicHoliday, IBankDefinedBeneficiary, IContactCard,
   IBuyElectricityMeterValidationDetails, IBuyElectricityDetail, IBuyElectricityVoucherDetail, IGamesMetadata, IGameData,
   IScheduledTransaction, ITravelCardPriorityDetails,
   IDebitOrdersDetail, IRemittanceAvailabilityStatus,
   IMandateOrdersDetail, IFeedbackDetail, ICallbackDetail,
   ILinkableAccounts, ILinkAccount, IRefreshAccountsApiResult, IClientDetails, IClientPreferenceDetails, ICustomerEnrolmentReq,
   ICheckUsername, IUpdateUser, IApprove, IGetRateReq, IRewardsRedemptionReq,
   ILinkProfile, ILogContent, ITermsNedbankId, INedIDTermsAccept, INedbankUser, IOutOfBandRequest,
   ILottoHistoryData, IGameTicketData, IGameWinningNumbersData,
   IAccountBalanceDetail, ITransactionDetailIS, IAccountRename, IApiResponse,
   ILinkedAccount, IAccountLists, IOverdraftAttempts, IChangeOverdraftLimitRequest, IValidation, IDormancyRequest,
   IUniversalBranchCode, IClientAccountDetail, ISettlementDetail, ISettlementQuote, IStatementPreferences, IPostalCode,
   INoticePayload, IReportSuspicious, IReportAttempts,
   IBuyprepaidDetailsWithGUID, IBuyElectricityDetailWithGUID, IPaymentDetailWithGUID,
   IPrepaidDetailWithGUID, ITransferDetailsDoublePayment, IBankerDetail, IDcarRangeDetails,
   IDebitOrderReasonsData, IDisputeOrderPost, IStopOrderPost, ILoanDebitOrderDetails, IManagePaymentDetailsPost,
   IBuyElectricityMeterValidationDetailsWithGUID, IDocumentSendRequest, ICountrycodes, IOverseasTravelDetails,
   ICreditLimitMaintenance, IStatementDownload, IIncomeTaxResponseData, ICrossBorderRequest, IHomeLoanStatus, ILoanCancelRequest,
   ITripsResponse, IPayoutDetails, IMultipleLimitPayload, IPreApprovedResponse
} from './models';
import { IDrawResult } from '../../buy/game/models';
import { ICardActionLists, ICardLimitInfo } from './../../cards/models';
import { IBuildingLoanPayout } from '../../payout/payout.models';
import { IAutoPayDetail, IAvsCheck } from '../../cards/apo/apo.model';
import { ILoanInformationData } from '../../pre-approved-offers/pre-approved-offers.model';

@Injectable()
export class ApiService {

   constructor(private http: HttpClient) { }

   apiUrl = environment.apiUrl;
   nedbankApiUrl = environment.nedbankApiUrl;
   logApiUrl = environment.logApiUrl;
   downloadStatementUrl = environment.downloadStatementUrl;

   // payment
   PaymentAccounts = new Api<IAccountDetail>(this.http, this.apiUrl + 'payments/v3/accounts');
   PaymentLimits = new Api<ILimitDetail>(this.http, this.apiUrl
      + 'preferences/v1/limits?limittypes=payment&limittypes=instantpayment&limittypes=sendimali');
   MakeAccountPayment = new Api<IPaymentDetailWithGUID>(this.http, this.apiUrl + 'payments/v3/transactions');
   MakeMobilePayment = new Api<IPrepaidDetailWithGUID>(this.http, this.apiUrl + 'prepaids/v3/moneysend');
   MakeforeignPayment = new Api<IPaymentDetail>(this.http, this.apiUrl + 'payments/v2/internationalremittances');
   ScheduledMobileTrasactions = new Api<IScheduledTransaction[]>(this.http, this.apiUrl + 'prepaids/v3/transactions');
   ScheduledPayment = new Api<IScheduledTransaction[]>(this.http, this.apiUrl + 'payments/v3/transactions');
   PrepaidStatus = new Api<number>(this.http, this.apiUrl + 'prepaids/v3/transactions/:verificationId/status');
   PaymentStatus = new Api<number>(this.http, this.apiUrl + 'payments/v3/transactions/:verificationId/status');
   OutOfBandOtpStatus = new Api<IOutOfBandRequest>(this.http, this.apiUrl + 'securetransactions/v1/onetimepins');
   RecipientStatus = new Api<number>(this.http, this.apiUrl + 'contactcards/v1/contactcardsdetails/:verificationId/status');
   PreferenceStatus = new Api<number>(this.http, this.apiUrl + 'preferences/v1/transactions/:verificationId/status');
   // Cross-Border-Payment
   NowStatus = new Api<number>(this.http, this.apiUrl + 'investments/v1/notices/:verificationId/status');
   RemittanceAvailabilityCheck = new Api<IRemittanceAvailabilityStatus>(this.http, this.apiUrl +
      'payments/v2/internationalremittances/availability');
   CountryList = new Api<number>(this.http, this.apiUrl + 'referencedata/v1/remittancecountries');
   InternationalBeneficiaryAccount = new Api<number>(this.http, this.apiUrl + 'payments/v2/internationalremittances/beneficiaryaccount');
   QuoteCalculation = new Api<number>(this.http, this.apiUrl + 'payments/v2/internationalremittances/quotecalculations');
   casaAccounts = new Api<IAccountDetail>(this.http, this.apiUrl + 'payments/v2/accounts?remittance=true');
   // Dashboard Accounts
   DashboardAccounts = new Api<IDashboardAccounts>(this.http, this.apiUrl + 'accounts/v4/accounts');
   // added to get accounts transactions from mvp1 api
   AccountTransactions = new Api<ITransferDetail[]>(this.http, this.apiUrl + 'transactions/v3/statemententries/:itemAccountId');
   GraphTransactions = new Api<ITransferDetail[]>(this.http, this.apiUrl + 'transactions/v2/statemententries/:itemAccountId');
   TransactionDetails = new Api<ITransactionDetailIS>(this.http, this.apiUrl +
      'transactions/v3/statemententries/:itemAccountId/transactions/:transactionId');
   LinkableAccounts = new Api<ILinkableAccounts[]>(this.http, this.apiUrl + 'clients/accounts/linkableaccounts');
   linkAccounts = new Api<ILinkAccount[]>(this.http, this.apiUrl + 'clients/accounts');
   refreshAccounts = new Api<IRefreshAccountsApiResult>(this.http, this.apiUrl + 'accounts/v4/accounts/refresh');
   RenameAccount = new Api<IAccountRename>(this.http, this.apiUrl + 'accounts/v4/accounts/:itemAccountId/accountnickname');
   // Travel Card
   TravelCardGraphTransactions = new Api<ITransferDetail[]>(this.http, this.apiUrl + 'transactions/v3/statemententries/:itemAccountId');
   TravelCardCurrencyPockets = new Api<ITravelCardPriorityDetails[]>(this.http, this.apiUrl +
      'foreignexchange/travelcardfunds/v1/cards/:cardNumber/pockets');
   // Load trip
   getAllTripsByCardNumber = new Api<any>(this.http,
      this.apiUrl + 'foreignexchange/travelcardfunds/v1/cards/:cardNumber/trips');
   GetAllTripCountries = new Api<any>(this.http, this.apiUrl + 'referencedata/v1/travelreferencedata/countries');
   GetAllTripBorderPosts = new Api<any>(this.http, this.apiUrl + 'referencedata/v1/travelreferencedata/borderposts');
   loadNewTrip = new Api<any>(this.http, this.apiUrl + 'foreignexchange/travelcardfunds/v1/cards/:cardNumber/trips');
   getAllCurrencies = new Api<any>(this.http, this.apiUrl + 'referencedata/v1/travelreferencedata/currencies');
   getCurrencyConversionRates = new Api<any>(this.http, this.apiUrl + 'foreignexchange/travelcardfunds/v1/cards/:cardNumber/quotations');
   getAllPaymentLimits = new Api<any>(this.http, this.apiUrl + 'foreignexchange/travelcardfunds/v1/cards/:cardNumber/clientlimits');
   fundTrip = new Api<any>(this.http, this.apiUrl + 'foreignexchange/travelcardfunds/v1/cards/:cardNumber/funds');
   getOperatingHours = new Api<any>(this.http, this.apiUrl + 'referencedata/v1/travelreferencedata/operatinghours');
   dailyPaymentLimit = new Api<number>(this.http, this.apiUrl + 'preferences/v1/limits?limittypes=payment');
   // Providers
   ServiceProviders = new Api<IServiceProvider[]>(this.http, this.apiUrl + 'referencedata/v1/serviceproviders');
   ServiceProvidersProducts = new Api<IPrepaidServiceProviderProducts[]>(this.http, this.apiUrl +
      'referencedata/v1/serviceproviders/:provider/products');

   // transfer
   TransferAccounts = new Api<IAccountDetail>(this.http, this.apiUrl + 'transfers/v2/accounts');
   TransferLimits = new Api<ILimitDetail>(this.http, this.apiUrl + 'preferences/v1/limits?limittypes=transfer&limittypes=payment');
   MakeTransfer = new Api<ITransferDetailsDoublePayment>(this.http, this.apiUrl + 'transfers/v2/transactions');
   ScheduledTransfer = new Api<IScheduledTransaction[]>(this.http, this.apiUrl + 'transfers/v2/transactions');
   AccountDebitOrders = new Api<IDebitOrdersDetail[]>(this.http, this.apiUrl + 'retail/debitorders/v1/accounts/:accountId');
   AccountMandateOrders = new Api<IMandateOrdersDetail[]>(this.http, this.apiUrl + 'clients/accounts/mandates');
   ManageMandateOrders = new Api<IMandateOrdersDetail[]>(this.http, this.apiUrl + 'clients/accounts/mandates/:mandateId/authorisations');
   DisputeanOrder = new Api<IDisputeOrderPost>(this.http, this.apiUrl + 'retail/debitorders/v1/accounts/:accountId/debitorderdisputes');
   StopDebitOrder = new Api<IStopOrderPost[]>(this.http, this.apiUrl + 'retail/debitorders/v1/accounts/:accountId/stoppayments');
   CancelStopOrder = new Api<IDebitOrdersDetail[]>(this.http, this.apiUrl + 'retail/debitorders/v1/accounts');
   DebitOrderReasons = new Api<IDebitOrderReasonsData>(this.http, this.apiUrl + 'referencedata/v1/:reasonType');
   LoanDebitOrders = new Api<ILoanDebitOrderDetails[] | IManagePaymentDetailsPost>(this.http, this.apiUrl +
      'retail/debitorders/v1/accounts/:accountId/debitorderdetails');
   // Reference Data
   Banks = new Api<IBank>(this.http, this.apiUrl + 'referencedata/v1/banks');

   // Cards
   PlasticCards = new Api<IPlasticCard>(this.http, this.apiUrl + 'plasticmanagement/v1/plastics?bypassCRDFilter=true');
   PlasticCardsWithId = new Api<IPlasticCard>(this.http, this.apiUrl + 'plasticmanagement/v1/plastics/:accountId/details');
   BlockCard = new Api<IPlasticCard>(this.http, this.apiUrl + 'plasticmanagement/v1/plastics/:plasticId/block');
   CreditCardAtmLimit = new Api<ICardLimitInfo>(this.http, this.apiUrl + 'plasticmanagement/v1/plastics/:plasticId/atmlimits');
   DebitCardAtmLimit = new Api<IPlasticCard>(this.http, this.apiUrl + 'clients/accounts/atmlimit/:accountId');
   ReplaceCard = new Api<IPlasticCard>(this.http, this.apiUrl + 'plasticmanagement/v1/plastics/:plasticId/replace');
   UpdateCardActionList = new Api<ICardActionLists>(this.http, this.apiUrl + 'plasticmanagement/v1/plastics/:plasticId/:actionRequest');

   // Logging
   LogEntry = new Api<ILogContent>(this.http, this.logApiUrl + 'api/Logging/LogEntry');

   // Terms and conditions
   TermsAndConditions =
   new Api<ITermsAndConditions>(this.http, this.apiUrl + 'termsandconditions/v1/termsandconditionsitems');
   AcceptTermsAndConditions =
   new Api<ITermsAndConditions>(this.http, this.apiUrl + 'termsandconditions/v1/termandcoindition');
   DownloadTermsAndConditions = new Api(this.http, Constants.links.termsAndConditions);
   NedbankIdTermsAndConditions =
   new Api<ITermsNedbankId>(this.http, this.apiUrl + 'interactionenablers/v1/infonotices/channels/84/brands/NED/types/NID');
   AcceptTermsAndConditionsResult =
   new Api<ITermsAndConditions>(this.http, this.apiUrl + 'termsandconditions/v1/termandcoindition/LTO?versioncontent=latest');
   TermsAndConditionsItem =
   new Api<ITermsAndConditions>(this.http, this.apiUrl + 'termsandconditions/v1/termandcoindition/:noticeType');
   NedbankIdTermsAndConditionsLatest =
   new Api<ITermsNedbankId>(this.http, this.apiUrl +
      'interactionenablers/v1/infonotices/channels/84/brands/NED/types/NID/users/:profile/summary');
   NedbankIdTermsAndConditionsAccept =
   new Api<INedIDTermsAccept>(this.http, this.apiUrl +
      'interactionenablers/v1/infonotices/channels/84/brands/NED/types/NID/users');
   AcceptTermsAndConditionsForOpenNewAccount =
   new Api<ITermsAndConditions>(this.http, this.apiUrl + 'termsandconditions/v2/termsandconditions/fai');
   SarbTermsAndCondition =
   new Api<ITermsAndConditions>(this.http, this.apiUrl + 'termsandconditions/v1/termandcoindition/OOO');

   // Prepaid accounts
   PrepaidAccounts = new Api<IPrepaidAccountDetail>(this.http, this.apiUrl + 'prepaids/v3/accounts');
   PrepaidLimit = new Api<IPrepaidLimitDetail>(this.http, this.apiUrl + 'preferences/v1/limits?limittypes=prepaid&limittypes=payment');
   BuyPrepaid = new Api<IBuyprepaidDetailsWithGUID>(this.http, this.apiUrl + 'prepaids/v3/transactions');

   // Public Holidays
   PublicHolidays = new Api<IPublicHoliday[]>(this.http, this.apiUrl + 'referencedata/v1/sapublicholidays');
   // Games
   LottoJackpot = new Api<IGamesMetadata>(this.http, this.apiUrl + 'referencedata/v1/lotto/jackpot');
   LottoList = new Api<IGameData[]>(this.http, this.apiUrl + 'lotto/v2/transactions');

   // Bank approved beneficiaries
   BankDefinedBeneficiaries = new Api<IBankDefinedBeneficiary[]>(this.http, this.apiUrl + 'referencedata/v1/bankdefinedbeneficiaries');
   // Contact cards
   ContactCards = new Api<IContactCard[]>(this.http, this.apiUrl + 'contactcards/v1/contactcardsdetails?pagesize=4000');

   // electricity
   BuyElectricityMeterValidation =
   new Api<IBuyElectricityMeterValidationDetailsWithGUID>(this.http, this.apiUrl + 'prepaids/v3/transactions');
   MakeElectricityPayment = new Api<IBuyElectricityDetailWithGUID>(this.http, this.apiUrl + 'prepaids/v3/transactions');
   ElectricityMeterVouchers = new Api<IBuyElectricityVoucherDetail>(this.http, this.apiUrl +
      'prepaids/v3/electricitymetervouchers/:transactionID');
   // Settings
   Limits = new Api<ILimitDetail[]>(this.http, this.apiUrl + 'preferences/v1/limits');
   IndividualLimits = new Api<ILimitDetail[]>(this.http, this.apiUrl + 'preferences/v1/limits/:type');
   UpdateLimits = new Api<IMultipleLimitPayload>(this.http, this.apiUrl + 'preferences/v1/limits');
   // game
   GameAccounts = new Api<IAccountDetail>(this.http, this.apiUrl + 'prepaids/v3/accounts');
   GameDraws = new Api<any>(this.http, this.apiUrl + 'referencedata/v1/lotto/drawresults');
   GameMetaData = new Api<any>(this.http, this.apiUrl + 'referencedata/v1/lotto/metadata');
   GameStatus = new Api<number>(this.http, this.apiUrl + 'lotto/v2/transactions/:verificationId/status');
   GameLimits = new Api<number>(this.http, this.apiUrl + 'preferences/v1/limits?limittypes=payment&limittypes=lotto');
   // scheduled transactions
   ScheduledTransferDetail = new Api<IScheduledTransaction>(this.http, this.apiUrl + 'transfers/v2/transactions/:transactionID');
   ScheduledPaymentDetail = new Api<IScheduledTransaction>(this.http, this.apiUrl + 'payments/v3/transactions/:transactionID');
   ScheduledPrepaidDetail = new Api<IScheduledTransaction>(this.http, this.apiUrl + 'prepaids/v3/transactions/:transactionID');

   RemoveScheduledPaymentDetail = new Api<IScheduledTransaction>(this.http, this.apiUrl + 'payments/v3/transactions');

   // Clients
   clientDetails = new Api<IClientDetails>(this.http, this.apiUrl + 'clients/clientdetails');
   clientPreferences = new Api<any>(this.http, this.apiUrl + 'clients/clientpreferences');

   // Contact Cards
   ContactCard = new Api<IContactCard>(this.http, this.apiUrl + 'contactcards/v1/contactcard');
   AddContactCard = new Api<IContactCard>(this.http, this.apiUrl + 'contactcards/v1/contactcardsdetails');

   // Preferences
   UnilateralLimitIndicatorDetails = new Api<IApiResponse>(this.http, this.apiUrl + 'preferences/v1/clients/unilateralindicators');
   UnilateralLimitIndicatorUpdate = new Api<IApiResponse>(this.http, this.apiUrl + 'preferences/v1/clients/unilateralindicators');
   UnilateralLimitIndicatorStatus
   = new Api<IApiResponse>(this.http, this.apiUrl + 'preferences/v1/clients/unilateral/:verificationReferenceId/status');

   // Feedback
   Feedback = new Api<IFeedbackDetail>(this.http, this.apiUrl + 'clients/feedback');
   CandCsFeedback = new Api<IFeedbackDetail>(this.http, this.apiUrl + 'complaintsandcompliments/v1/feedback/individual');
   Callback = new Api<ICallbackDetail>(this.http, this.apiUrl + 'clients/clientcallback');

   // Lotto
   LottoTicketDetails = new Api<IGameTicketData>(this.http, this.apiUrl + 'lotto/v1/lottobatches');
   LottoDrawDetails = new Api<IDrawResult[]>(this.http, this.apiUrl + 'referencedata/v1/lotto/drawresults');
   // lotto history list
   LottoHistoryList = new Api<IGameData[]>(this.http, this.apiUrl + 'lotto/v2/transactions');
   WinningNumbersList = new Api<IGameWinningNumbersData[]>(this.http, this.apiUrl + 'referencedata/v1/lotto/drawresults');

   // get next lotto draw details
   LottoNextDrawDetails = new Api<IGameData[]>
      (this.http, this.apiUrl + 'referencedata/v1/lotto/drawresults');

   // Share account information via recipients email
   ShareAccount = new Api<any>(this.http, this.apiUrl + 'accountverification/v1/proofofaccounts');

   // Universal branch codes
   UniversalBranchCodes = new Api<IUniversalBranchCode[]>(this.http, this.apiUrl + 'referencedata/v1/defaultbranchcodes');

   // Uplift dormancy
   UpliftDormantAccount = new Api<IDormancyRequest>(this.http, this.apiUrl + 'accounts/v4/accounts/:itemAccountId/upliftdormancy');
   UpliftDormantAccountStatus
   = new Api<string>(this.http, this.apiUrl + 'accounts/v4/accounts/:verificationReferenceId/upliftdormancy/status');
   // Electronic profile show hide accounts
   UpdateEnableAccount = new Api<IAccountLists>(this.http, this.apiUrl + 'preferences/v1/accountlists/:prefKey');
   LinkedHideShowAccounts = new Api<ILinkedAccount[]>(this.http, this.apiUrl + 'preferences/v1/accountlists/hidden');
   // Account Balance Details
   AccountBalanceDetails = new Api<IAccountBalanceDetail>(this.http, this.apiUrl + 'accounts/v4/accounts/:itemAccountId/balancedetails');
   // Account  Details
   AccountDetails = new Api<IClientAccountDetail>(this.http, this.apiUrl + 'accounts/v4/accounts/:itemAccountId');

   EnrolGreenbacks = new Api<ICustomerEnrolmentReq>(this.http, this.apiUrl + 'rewards/v1/enrolments');
   RewardsRedemption = new Api<IRewardsRedemptionReq>(this.http, this.apiUrl + 'rewards/v1/redemptions');
   GetRewardsRate = new Api<IGetRateReq>(this.http, this.apiUrl + 'referencedata/v1/rewardrates');
   GetChargesAndFees = new Api<any>(this.http, this.apiUrl + 'referencedata/v1/rewardsproducts');
   DomicileBranchNumber = new Api<any>(this.http, this.apiUrl + 'accounts/v4/accounts/:itemAccountId/details');
   // Get overdraft limit attempts
   AccountOverdraftAttempts = new Api<IOverdraftAttempts>(this.http, this.apiUrl + 'overdrafts/v1/accounts/:itemAccountId/attempts');

   // Update overdraft limit
   AccountOverdraftLimit = new Api<IChangeOverdraftLimitRequest>(this.http, this.apiUrl + 'overdrafts/v1/limitrequests');

   // Settlement details
   SettlementDetails = new Api<ISettlementDetail>(this.http, this.apiUrl + 'retail/clientloansettlement/v1/settlementvalues');

   // Settlement quote
   SettlementQuotes = new Api<ISettlementQuote>(this.http, this.apiUrl + 'retail/clientloansettlement/v1/settlementquotes');

   // Overdraft validations
   OverdraftValidations = new Api<IValidation[]>(this.http, this.apiUrl + 'referencedata/v1/validationsettings');
   PartWithdrawalAmount = new Api<IApiResponse>(this.http, this.apiUrl + 'referencedata/v1/productcatalogue/investments/:type');
   FicaStatus = new Api<IBankDefinedBeneficiary[]>(this.http, this.apiUrl + 'investments/v1/isfica');
   LinkedAccounts = new Api<any>(this.http, this.apiUrl + 'investments/v1/accounts');
   NoticeDetails = new Api<INoticePayload>(this.http, this.apiUrl + 'investments/v1/notices');
   DeleteNotice = new Api<any>(this.http, this.apiUrl + 'investments/v1/notice');
   // Banker Details
   BankerDetails = new Api<IBankerDetail>(this.http, this.apiUrl
      + 'rolesandrelations/relationshipmanager/v1/dcar/:secOfficerCd/contactdetails');

   // Dcar Range Details
   DcarRange = new Api<IDcarRangeDetails>(this.http, this.apiUrl + 'referencedata/v1/dcarrange?dcarnumber=:dcarNumber');

   // building loan payout
   BuildingLoanPayout = new Api<IBuildingLoanPayout>(this.http, this.apiUrl +
      'retail/buildingloans/v1/loans/:itemAccountId/payoutrequests');
   // statement preferences
   AccountStatementPreferences = new Api<IApiResponse>(this.http, this.apiUrl +
      'accountpreferences/v1/statementdeliveryoptions/:itemAccountId');

   UpdateStatementPreferences = new Api<IStatementPreferences>(this.http, this.apiUrl +
      'accountpreferences/v1/statementdeliveryoptions/:itemAccountId');
   StatementPreferencesStatus = new Api<IApiResponse>(this.http, this.apiUrl +
      'accountpreferences/v1/statementdeliveryoptions/:verificationReferenceId/status');
   PostalCodes = new Api<IPostalCode>(this.http, this.apiUrl + 'referencedata/v1/postalcodes');

   // Report suspicious
   ReportSuspiciousAttempts = new Api<IReportAttempts>(this.http, this.apiUrl + 'financialcrime/suspiciousactivity/v1/reportattempts');
   ReportFraud = new Api<IReportSuspicious>(this.http, this.apiUrl + 'financialcrime/suspiciousactivity/v1/reports');

   // statement and document
   // document
   DocumentRequest = new Api<IDocumentSendRequest>(this.http, this.apiUrl + 'retail/adhocaccountdocuments/v1/documenttypes');

   // Overseas travel Notification
   CountryListDetails = new Api<ICountrycodes>(this.http, this.apiUrl + 'referencedata/v1/countrycodes');
   OverseasTravelNotification = new Api<IOverseasTravelDetails>(this.http, this.apiUrl + 'plasticmanagement/v1/travelnotifications');

   // APO
   APOCardDetails = new Api<IApiResponse>(this.http, this.apiUrl + 'retail/paymentorders/v1/plastics/:plasticId');
   DeleteAPOCardDetails = new Api<IAutoPayDetail>(this.http, this.apiUrl + 'retail/paymentorders/v1/plastics');
   AVSCheck = new Api<IAvsCheck>(this.http, this.apiUrl + 'accountverification/v1/accountverificationtypes');

   // statement download
   StatementDownload = new Api<any>(this.http, this.apiUrl +
      'documentsearch/v1/documents?queryName=statementsForAccountByDate');
   StartDateStatement = new Api<any>(this.http, this.downloadStatementUrl + 'ecs-service-viewer-1.0/viewer');

   // ActivateCard
   UpdateActivateCard = new Api<ICardActionLists>(this.http, this.apiUrl + 'plasticmanagement/v1/plastics/:plasticId/:actionRequest');

   // Credit Limit Increase
   RequestCreditLimitIncrease = new Api<ICreditLimitMaintenance>(this.http, this.apiUrl +
      'plasticmanagement/v1/creditlimitincreaserequests');

   // IT3B download
   IncomeTaxYears = new Api<IIncomeTaxResponseData>(this.http,
      this.apiUrl + 'documentsearch/v1/documents?queryName=taxcertsForAccountByYear');

   // Cross border
   CrossBorderRequest = new Api<ICrossBorderRequest>(this.http, this.apiUrl + 'retail/adhocaccountdocuments/v1/crossborder');

   // Open New Account API
   EntryAmount = new Api<any>(this.http, this.apiUrl + 'referencedata/v1/productcatalogue/investments/minimumentryamount');
   AllProductsDetails = new Api<any>(this.http, this.apiUrl + 'referencedata/v1/productcatalogue');
   Investor = new Api<any>(this.http, this.apiUrl + 'investments/v1/investors');
   DepositDetails = new Api<IPayoutDetails[]>(this.http, this.apiUrl + 'investments/v1/accounts');
   InterestRate = new Api<IApiResponse>(this.http, this.apiUrl +
      'referencedata/v1/productcatalogue/investments/:productType');

   OpenAccount = new Api<IApiResponse>(this.http, this.apiUrl + 'investments/v1/investments');
   // Manage loan
   HomeLoanStatus = new Api<IHomeLoanStatus>(this.http, this.apiUrl + 'loanproductsmanagement/v1/loanoptions');
   CancelLoan = new Api<ILoanCancelRequest>(this.http, this.apiUrl + 'loanproductsmanagement/v1/:cancelLoanType');

   // Pre approved offers
   offers = new Api<IPreApprovedResponse>(this.http, this.apiUrl + 'offermanagement/v1/offers');
   allOfferStatus = new Api<any>(this.http, this.apiUrl + 'offermanagement/v1/offers/status');
   offerStatus = new Api<any>(this.http, this.apiUrl + 'offermanagement/v1/offers/:offerid/status');
   screenContent = new Api<any>(this.http, this.apiUrl + 'offermanagement/v1/offers/:offerid/content/:screen');
   involvedParties = new Api<any>(this.http, this.apiUrl + 'offermanagement/v1/offers/:offerid/involvedparties');
   screenMessage = new Api<any>(this.http, this.apiUrl + 'offermanagement/v1/offers/:offerid/messages/:screen');
   loanInformation = new Api<ILoanInformationData>(this.http, this.apiUrl + 'offermanagement/v1/offers/:offerid/loaninformation');
   disclosureContent = new Api<ILoanInformationData>(this.http, this.apiUrl +
      'offermanagement/v1/offers/:offerid/content/disclosures_screen');

}

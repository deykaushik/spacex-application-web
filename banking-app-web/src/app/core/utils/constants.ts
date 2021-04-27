import { IDropdownItem, ITransactionFrequency, IBranchLocatorOptions, IButtonGroup } from './models';

import { IPlasticCard, INavigationModel } from './../services/models';
import { ILimitWidgetModel } from '../../settings/profile-limits/profile-limits.models';

export class Constants {
   public static CardImages = {
      resolution: 'high/',
      default: 'default'
   };
   public static popularBanks = [
      { bankCode: '009', bankName: 'ABSA BANK', order: 2 },
      { bankCode: '020', bankName: 'CAPITEC BANK', order: 3 },
      { bankCode: '008', bankName: 'FNB SOUTH AFRICA', order: 4 },
      { bankCode: '001', bankName: 'STANDARD BANK SOUTH AFRICA', order: 5 },
      { bankCode: '003', bankName: 'NEDBANK', order: 1 }
   ];

   public static PopularCategory = 'POPULAR';
   public static currencies = {
      'USD': {
         fullName: 'United States Dollar',
         symbol: '$'
      },
      'EUR': {
         fullName: 'Euro',
         symbol: '€'
      },
      'GBP': {
         fullName: 'British Pound',
         symbol: '£'
      },
      'CAD': {
         fullName: 'Canadian Dollar',
         symbol: '$'
      },
      'AUD': {
         fullName: 'Australian Dollar',
         symbol: '$'
      },
      'JPY': {
         fullName: 'Japanese Yen',
         symbol: '¥'
      },
      'HKD': {
         fullName: 'Hong Kong Dollar',
         symbol: '$'
      },
      'ILS': {
         fullName: 'Israeli Shekel',
         symbol: '₪'
      },
   };
   public static labels = {
      enterCountryName: 'Please enter the country name',
      termsAndConditions: 'Terms and Conditions',
      acceptTncCrossborderPayment: 'By clicking below, you are accepting the relevant Cross-border payment',
      BenificiaryErrorMsg: 'Beneficiary not saved',
      nextText: 'Next',
      editText: 'Edit',
      saveText: 'Save',
      cancelText: 'Cancel',
      doneText: 'Done',
      submitText: 'Submit',
      confirmText: 'Confirm',
      activateText: 'Activate',
      menuAnnualCreditReview: 'Annual credit review',
      menuHideAndShow: 'Hide and show accounts',
      payFrom: 'Pay from:',
      payTo: 'Pay to:',
      transferFrom: 'Transfer from:',
      transferTo: 'Transfer to:',
      transferRepeatPayment: 'Repeat:',
      transferRepeatNo: 'No of repeats:',
      amount: 'Amount:',
      paymentDate: 'Payment date',
      saveRecipient: 'Save recipient:',
      transferDate: 'Transfer date:',
      repeat: 'Repeat:',
      payToTitle: 'Whom would you like to pay?',
      payAmountTitle: 'How much would you like to pay?',
      payAmountCrossPaymentTitle: 'Get a quote',
      payForTitle: 'What is the payment for?',
      payReviewTitle: 'Review payment details',
      payReview: 'Review Payment Details',
      transferDoneText: 'Transfer',
      yourReference: 'Your reference',
      myReference: 'My reference',
      theirReference: 'Their reference',
      notification: 'Notification type',
      enterNumber: 'Enter number',
      cellphoneNumber: 'Cellphone number',
      enterEmail: 'Enter email',
      reference: 'Reference',
      howMuchYouLikeToTransfer: 'How much would you like to transfer?',
      reviewTransfer: 'Review transfer details',
      reviewTransaction: 'Review transaction details',
      transactionSuccess: 'Transaction successful',
      transactionFailed: 'Transaction unsuccessful',
      paymentSuccess: 'Payment successful',
      paymentFailed: 'Payment unsuccessful',
      somethingWentWrong: 'Something went wrong',
      purchaseSuccess: 'Ticket requested',
      purchaseFailed: 'Purchase unsuccessful',
      transferSuccess: 'Transfer successful',
      transferFailed: 'Transfer unsuccessful',
      transferAmountTitle: 'How much would you like to transfer ?',
      transferReviewTitle: 'Confirm transfer details',
      accounts: 'Accounts',
      currentBalance: 'Current balance',
      availableBalance: 'Available balance',
      priorityCurrency: 'Priority currency',
      changeCurrencyPriority: 'Change currency priority',
      reasonDamage: 'damaged',
      statusBlocked: 'Blocked',
      lastUsedCurrency: 'Last used currency',
      settlementAmount: 'Settlement amount',
      futureBalance: 'Future balance',
      outstandingBalance: 'Outstanding balance',
      balanceNotPaidOut: 'Balance not paid out',
      interimInterest: 'Interim interest',
      registeredAmount: 'Registered amount',
      dashboardBankAccountTitle: 'Everyday banking',
      dashboardCardAccountTitle: 'Credit cards',
      dashboardLoanAccountTitle: 'Loans',
      dashboardInvestmentAccountTitle: 'Investments',
      dashboardClubAccountsTitle: 'Club Accounts',
      dashboardForexAccountTitle: 'Foreign Currencies',
      statementPreferencesTitle: 'Statement delivery preferences',
      placeNotice: 'Y',
      dashboardTravelCardAccountTitle: 'Travel Card',
      travelCardAccountTypeShortName: 'TC',
      creditCardAccountTypeShortName: 'CC',
      foreignAccountContainerName: 'Foreign',
      travelCardDefaultName: 'Travel Card',
      clubAccountText: 'ClubAccount',
      availableBal: 'Available Balance',
      myCurrencyPockets: 'My currencies',
      myCurrencyPocket: 'My currency',
      transactions: 'Transactions',
      mytrips: 'My trips',
      loadtrip: 'Load trip',
      features: 'Features',
      debitOrders: 'Debit orders',
      scheduledPayments: 'Scheduled payments',
      cardManagement: 'Card management',
      requestCreditLimitIncrease: 'Request credit limit increase',
      // creating a constant for Rewards container header
      dashboardRewardsAccountTitle: 'Rewards',
      rewardsBalance: 'Rewards balance',
      amexrewardsBalance: 'Amex Membership rewards balance',
      amextype: 'MR',
      gbtype: 'GB',
      getTripServiceUnavailableErrorCode: 'R99',
      greenbacks: 'Greenbacks',
      gbrewardsBalance: 'Greenbacks balance',
      randValue: 'Rand value',
      defaultAccountDetails: 'Below are transaction details for your ',
      marketValue: 'Market value',
      points: 'Points',
      pay: 'Pay',
      transfer: 'Transfer',
      newTransfer: 'New transfer',
      cancelTransfer: 'Cancel Transfer',
      cancelPayment: 'Cancel Payment',
      cancelPurchase: 'Cancel Purchase',
      cancelRedeem: 'Cancel Redeem',
      buy: 'Buy',
      browserRefreshText: 'Changes you made may not be saved.',
      garageCardLabel: ['BG1', 'GPP', 'G1C', 'G1D', 'G2C',
         'G2D', 'G3D', 'G4D', 'G5C', 'G5D', 'G7D', 'PPG', 'YCG', 'YDG', 'GQC', 'GQD', 'PPG'],
      headerMenuLables: {
         profile: 'Profile'
      },
      activeCardsReasonCodes: ['AAA', 'AOA', 'B1D', 'B2D', 'B3D', 'B4D', 'B1A', 'DLA', 'DLD', 'OTD', 'OVD', 'O1D', 'OLA'],
      damagedCardThreeDaysMessage: 'A damaged card will take 3 days to be blocked.',
      blockCardSecondMessage: 'You can still use your secondary card or visit your nearest Forex branch to replace your cards.',
      transactionGraphNoDataMessage: 'Once you have transacted on this account, you can view a transactional' +
         ' graph detailing your account balance on a weekly basis.',
      paymentGuardMessage: 'Going somewhere else? Your progress will be lost.',
      currencySymbol: 'R',
      transferRetryMessage: 'Your transfer cannot be processed right now. Please try again later.',
      repeatTransferErrorMessage: 'A transfer for today\'s date can\'t be repeated.',
      repeatTransferWeekMessage: 'A transfer can be repeated on a weekly or monthly basis for up to one year.',
      apiStatus201To299ErrorMsg: 'Error',
      apiStatus300To500ErrorMsg: 'Connection Failed',
      repeatPaymentErrorMessage: 'A payment for today\'s date can\'t be repeated.',
      futureTransferWarning: 'A future dated transfer may not be made {0} this account',
      repeatTransferWarning: 'A future dated or repeat transfer may not be made {0} this account',
      repeatPurchaseErrorMessage: 'A purchase  for today\'s date can\'t be repeated.',
      repeatPaymentdisableMessage: 'Buying this type of bundle can\'t be future-dated or repeated.',
      repeatPaymentwithRecurringDisabledMessage: 'Buying this type of bundle can\'t be repeated.',
      mobilePayNoSchedule: 'Scheduling not available when paying to a cellphone number.',
      mobilePayWarningNotification: `Please double-check the cellphone number. Nedbank Send-iMali payments can't be refunded or reversed.`,
      accountPaymentWarningNotification: `Please double-check the account number.
                                          Nedbank doesn\'t validate account numbers or refund you if you give the wrong information.`,
      replaceCardRetryMessage: 'Your replace card cannot be processed right now. Please try again later.',
      paymentRetryMessage: 'Your payment cannot be processed right now. Please try again later.',
      purchaseRetryMessage: 'Your purchase cannot be processed right now. Please try again later.',
      repeatPaymentCreditCardMessage: 'You are unable to make repeat payments to credit cards.',
      priorityUpdateSuccessfulMessage: 'Your currency priority list has been updated successfully.',
      tryAgain: 'Try Again',
      dismiss: 'Dismiss',
      goOverview: 'Go to overview',
      finish: 'Finish',
      newPurchase: 'New Purchase',
      newRedeem: 'New Redeem',
      noRecordsFound: 'You have no more accounts available to link to your profile.',
      notify: 'Notification:',
      genderMale: 'Male',
      genderFemale: 'Female',
      amountValidateMessage: 'Amount entered is below minimum of R150.00',
      minimumDailyLimit: 'Amount is under daily limit (R150)',
      paymentReason: 'Reason for payment',
      getQuoteText: 'Get quote',
      selectReasonMessage: 'Please select a reason.',
      featureTitle: 'Features',
      newFeatureTitle: 'New features coming',
      newFeatureSubTitle: 'We’ll be adding more features to the investments section soon. \
      You can still complete your investment related tasks on the',
      oldBanking: 'old Internet Banking',
      site: ' site.',
      activeCardReasonCode: 'AAA',
      activateCardLabels: {
         pleaseActivateCardText: 'Please activate your card to enable all transactions',
         activateCardTitle: 'Activate card',
         yourCardWillBeText: 'Your card will be activated.',
         activateDormantAlertText: 'Please make a card transaction within 24hrs to activate your card',
         forSecurityPurposesText: 'For security purposes, please make sure that you have the card with you before you activate.',
         sorryUnableToActiveText: 'Sorry, we are unable to activate your card. Please try again later.',
         successYourCardActivatedText: 'Success! Your card has been activated',
         somethingWentWrongText: 'Sorry, we are unable to proceed. Please try again later',
         actionRequest: 'ACTIVATE',
         errorCode: 'R01',
         dormantCreditCardReasonCode: 'IAD',
         newCreditCardReasonCode: 'F2F',
         responseReasonMessages: {
            accountIsDormant: 'CASA account is dormant, requested card should not be proceed',
            success: 'Success',
            failure: 'Failure'
         },
         activateCardErrorMessages: {
            adverseAccount: `The card cannot be activated as the linked account is in adverse status. Please
                contact customer care at 0860 555 111 for more information`,
            casaDormant: `The card cannot be activated as the linked account is dormant. Please activate the
                 account from account management to activate this card`
         }
      },
      buyLabels: {
         buyAmountTitle: 'What are you buying?',
         buyToTitle: 'For whom would you like to buy prepaid?',
         ownAccount: 'Own Account',
         buyAmountLabels: {
            ownAmount: 'Own Amount',
            AirtimeProductCode: 'PAI',
            DailyBundleProductCode: 'PDN',
            ALLInOneProductCode: 'PCB',
            Prepaid: 'Prepaid',
            Bundle: 'Bundle',
            AirtimeBundleList: 'R'
         },
         tlkProviderCode: 'TLK',
         buyForTitle: 'What is this purchase for?',
         buyReviewBtnText: 'Buy',
         buyReviewHeader: 'Review your purchase',
         racipientName: 'Recipient:',
         mobileProvider: 'Mobile provider:',
         serviceProvider: 'Service provider:',
         fromAccount: 'From account',
         notify: 'Notification:',
         buySuccess: 'Purchase successful',
         buyFailed: 'Purchase unsuccessful',
         yourReference: 'Your reference:',
         buyRepeatPayment: 'Repeat payment',
         CurrencyOnly: 'CurrencyOnly',
         buyPrepaidWarningNotification: `Please double-check the cellphone number and product information. Prepaids can't be refunded.`,
         multipleBundle: [
            {
               providerCode: 'CLC', allowedBundle:
                  [
                     { amountValue: 49, bundleAmountLiteral: '100SMS and 100MB' },
                     { amountValue: 89, bundleAmountLiteral: '200SMS and 200MB' },
                     { amountValue: 199, bundleAmountLiteral: '500SMS and 500MB' }
                  ]
            }
         ],
         ProductAmountandFormat: [
            { providerCode: 'VDC', productCode: 'PBB', ProductFormat: 'CurrencyOnly', productsIncluded: null },
            { providerCode: 'VDC', productCode: 'PBS', ProductFormat: 'CurrencyOnly', productsIncluded: null }
         ],
         prepaiConfigurationOptions:
            [{ providerCode: 'CLC', productCode: 'PCB', futureDate: true, recurring: false, notificationmessage: '' },
            { providerCode: 'CLC', productCode: 'PDN', futureDate: false, recurring: false, notificationmessage: '' },
            { providerCode: 'MTN', productCode: 'PDN', futureDate: false, recurring: false, notificationmessage: '' },
            { providerCode: '8TA', productCode: 'PFB', futureDate: false, recurring: false, notificationmessage: '' },
            {
               providerCode: 'VDC', productCode: 'PBB', futureDate: true, recurring: false,
               notificationmessage:
                  ' Please note: This voucher is worth R75 per month for 12 months.'
            },
            { providerCode: 'VDC', productCode: 'PBS', futureDate: true, recurring: true, notificationmessage: '' },
            { providerCode: 'VDC', productCode: 'PDB', futureDate: false, recurring: false, notificationmessage: '' },
            { providerCode: 'VDC', productCode: 'PDW', futureDate: false, recurring: false, notificationmessage: '' },
            { providerCode: 'VDC', productCode: 'PVB', futureDate: false, recurring: false, notificationmessage: '' }
            ]
      },
      payLabels: {
         greenbacksValue: 'Greenbacks value'
      },
      accountListStatus: {
         insufficient: 'Insufficient funds',
         available: 'Available'
      },
      weeklyRecurrenceInvalidError: 'A maximum of 52 weekly repeat payments can be made.',
      monthlyRecurrenceInvalidError: 'A maximum of 12 monthly repeat payments can be made.',
      localeString: 'en-ZA',
      instantPay: {
         bankErrorMessage: 'Instant Pay is not available for this bank.',
         timeErrorMessage: 'Instant Pay is not available at this time.',
         accountErrorMessage: 'Instant Pay is not available from the selected account'
      },
      buyElectricityLabels: {
         buyToTitle: 'For whom would you like to buy electricity?',
         buyAmountTitle: 'How much would you like to buy?',
         buyForTitle: 'For whom is the electricity?',
         buyReview: 'Review electricity purchase.'
      },
      myTripLabels: {
         destinationCountryiText: 'Destination',
         departureDateText: 'Departure date',
         returnDateText: 'Return date',
         tripStatusText: 'Trip status',
         tripStatusActive: 'ACTV',
         tripStatusFutureYes: 'FUTY',
         tripStatusFutureNo: 'FUTN',
         buyCurrencyText: 'Buy currency',
         statusActive: 'Active',
         statusFuture: 'Upcoming trip',
         statusreInactive: 'Inactive',
         addTripHeading: 'You can easily load your trips now.',
         addTripSubHeading: 'Tap "LOAD TRIP" to start the activation process for your trip.',
         tripLoadText: 'Loading',
         serviceUnavailableText: `This service is unavailable currently, please try again later
          or contact your nearest Forex branch for assistance.`,
         forexHelpDeskText: 'Forex help desk:',
         forexHelpDeskNumber: '+27 860 555 111'
      },
      loadTripLabels: {
         tncAcceptedLabel: 'accepted',
         tncLatestLabel: 'latest',
         myTripsText: 'My trips',
         loadTripText: 'Load trip',
         emailText: 'Email address',
         emailRequiredText: 'Please enter an email.',
         validEmailText: 'Please enter a valid email.',
         travelingToText: 'Where are you travelling to?',
         startDateGreaterText: 'Your return date cannot occur before the departure date.',
         countryRequiredText: 'Please select a country.',
         howTravelText: 'How will you be travelling?',
         travelModeAirText: 'Air',
         travelModeRailText: 'Rail',
         travelModeSeaText: 'Sea',
         travelModeRoadText: 'Road',
         travelModeNotAvailableText: 'Your mode of transport is not applicable to the destination country. Please check your selection.',
         flightTicketText: 'A copy of your flight ticket will be needed. Please keep a copy nearby.',
         trainTicketText: 'A copy of your train ticket will be needed. Please keep a copy nearby.',
         cruiseTicketText: 'A copy of your cruise ticket will be needed. Please keep a copy nearby.',
         selectBorderPostText: 'Select a border post',
         departureDateText: 'Departure date',
         returnDateText: 'Return date',
         borderPostText: 'Border post',
         loadTripSuccessText: 'Load trip completed',
         headingTopText: 'Thank you for submitting your details. Your reference number is:',
         whatsNextText: 'What\'s next?',
         nextActionText: 'We\'ll send you a confirmation email shortly.',
         verifyActionText: 'Please reply to the email with the required documents. We\'ll then verify them and update your trip.',
      },
      fundTripLabels: {
         minutesToServiceShutDown: 15,
         operatingHourHeadingText: 'You can only buy currency during Nedbank operating hours.',
         operatingHourSubHeadingText: 'Sundays and public holidays are outside Nedbank operating hours',
         chooseCurrencyText: 'Choose currency',
         RandCurrencySymbol: 'R',
         payButtonText: 'Pay',
         termsPdfLink: 'http://www.nedbank.co.za/content/dam/nedbank/site-assets/Terms/NedbankTravelCardTsCs_Sep18.pdf',
         payingInZarText: 'Amount in ZAR',
         randCurrencyCode: 'ZAR',
         exceedsDailyLimitText: 'This amount exceeds your daily payment limit',
         whichCurrencyHeadingText: 'Which foreign currency do you want to buy?',
         selectCurrencyText: 'Please select a currency',
         enterAmountText: 'Enter an amount',
         howMuchBuyText: 'How much do you want to buy?',
         estimatedRateText: 'Indicative rate', // Subject to change
         estimateDetailsText: 'Estimate details',
         randAmountText: 'Rand amount',
         commissionText: 'Commission',
         vatIncludedText: 'Including VAT',
         youWillPayText: 'You will pay',
         commissionIncludedText: 'Commission included',
         disclaimerText: 'Disclaimer',
         disclaimerDescriptionText: `The quoted exchange rate is only an indication of the rate at that time and will not
         be binding on Nedbank unless confirmed in writing. Nedbank will not be laible for any claim,
         loss and/or damage due to delays caused by exchange control producers.`,
         dailyLimitText: 'daily limit remaining',
         paymentForText: 'What is this payment for?',
         getQuoteTitle: 'Get an estimate',
         paymentDetails: 'Payment details',
         reviewPaymentDetails: 'Review payment',
         confirmText: 'You confirm that your personal details are true and correct',
         paymentDate: 'Payment date',
         payFrom: 'Pay from',
         fromAccount: 'From Account',
         acountNumber: 'Account number',
         paymentAmount: 'Payment amount',
         payToAccount: 'Pay to account',
         toAccount: 'To Account',
         amount: 'Amount',
         yourReference: 'Your reference',
         yourReferenceErrorMessage: 'Please enter your reference',
         personalDetails: 'Personal details',
         cellphoneNumber: 'Cellphone number',
         email: 'Email',
         homeAddress: 'Home address',
         rsaIdNumber: 'RSA ID Number',
         termsAndCondition: 'Terms and conditions',
         referenceNumber: 'Reference number',
         acceptTncText: 'You\'ve read, understood and accept the',
         acceptSarbTncText: 'SARB Declaration',
         travelCardTncAcceptText: 'Travel Card terms and conditions',
         activeTripStatus: 'ACTV'
      },
      unSavedPopup: {
         title: 'Going somewhere else?',
         text: 'Your progress will be lost if you choose to leave this page.',
         okbutton: 'Stay on this page',
         cancelbutton: 'Cancel this transaction'
      },
      unSavedPopupRegister: {
         title: 'Going somewhere else?',
         text: 'Your progress will be lost if you choose to leave this page.',
         okbutton: 'Stay on this page',
         cancelbutton: 'Leave this page'
      },
      fbeClaimSuccessful: 'FBE claim successful',
      fbeClaimUnSuccessful: 'FBE claim unsuccessful',
      fbeRedeem: 'Redeem',
      lottoLabels: {
         pickBallsMessage: 'Pick {0} numbers',
         quickPick: 'Quick Pick',
         pickNumbers: 'Pick own numbers',
         bouncePowerballNumber: 5,
         lottoBallGroup: 'group',
         powerBallGroup: 'powerball-board-1',
         powerBallGroupFour: 'powerball-board-2',
         lottoDrawDetail: 'LOTTO draw details',
         payoutsDrawDetail: 'Payouts (per winner)',
         drawDetails: 'Draw details',
         totalSales: 'Total sales',
         totalPrizePool: 'Total prize pool',
         drawMachine: 'Draw machine',
         ballSet: 'Ball set',
         lottoGame: 'Game',
         numberOfWinner: 'winner',
         numberOfWinners: 'winners',
         winningNumber: 'Winning numbers',
         winningNumbersGameLotto: 'Lotto',
         winningNumbersGameLottoPlus: 'LottoPlus',
         winningNumbersGameLottoPlus2: 'LottoPlus2',
         winningNumbersGamePowerBall: 'PowerBall',
         winningNumbersGamePowerBallPlus: 'PowerBallPlus',
         winningNumbersTitle: 'LOTTO winning numbers',
         winningNumbersDrawDate: 'Draw date',
         winningNumbersBonusBall: 'BonusBall',
         winningNumberPowerball: 'PowerBall PLUS',
         lottoPurchaseDetails: 'LOTTO ticket details',
         lottoTicketInformation: 'Ticket information',
         lottoBoards: 'Boards',
         lottoReplayBtn: 'Replay',
         lottoTicketReferenceNumber: 'Purchase reference number',
         lottoNumberOfBoards: 'Number of boards',
         lottoCost: 'Cost',
         lottoPurchaseDate: 'Purchase date',
         lottoNumberOfDraws: 'Number of draws',
         lottoDrawNumbers: 'Draw numbers',
         lottoTitle: 'LOTTO',
         powerballTitle: 'PowerBall',
         lottoPlusOneTitle: 'PLUS 1',
         lottoPlusTwoTitle: 'PLUS 2',
         IsGameTypeLotto: 'LOT',
         pickBallsError: 'Please select {0} numbers',
         pickPowerBallError: 'Please select {0} number from PowerBall board',
         noBallSelectedError: 'Please select numbers from each board',
         powerBallBothBoardsInvalid: 'You can select five numbers from Board {0} and one number from PowerBall board',
         selectGameTitle: 'Which game would you like to play?',
         selectNumbersTitle: 'Pick your own numbers',
         selectBoardsTitle: 'How many boards ?',
         selectPowerBallTitle: 'Pick your PowerBall',
         selectGameForTitle: 'What’s this purchase for?',
         selectGameReviewTitle: 'Review your purchase',
         reviewDescription: 'LOTTO after accepting T\'s and C\'s',
         IsLottoPlusOne: 'LOTTO PLUS 1',
         IsLottoPlusTwo: 'LOTTO PLUS 2',
         selectDeselectBalls: 'Click on a number to select and de-select it.',
         IsPowerBallPlus: 'PowerBall PLUS',
         incompleteBoardsError: 'Please complete or remove the remaining boards',
         lottoReference: 'LOTTO Purchase',
         powerBallReference: 'PowerBall Purchase',
         drawNameTitle: ' draw details',
         limitExceedError: 'Amount exceeds the daily LOTTO limit',
         winningLottoText: `Repeat your boards for multiple draws and add a second and third chance to win
                  on every draw with LOTTO PLUS 1 and LOTTO PLUS 2 at R{0} extra per board.`,
         winningPowerBallText: `Repeat your boards for multiple draws and add a second chance to win
         on every draw with PowerBall PLUS at R{0} extra per board.`,
         colorsLabel: 'colors',
         correctBallsLabel: 'correctballs',
         purchaseHeadingLabel: 'are paid directly into your account. We’ll contact you for any winnings over ',
         winningLabel: `You'll be able to see your ticket in your LOTTO history as soon as it's processed.`,
         winningUnderLabel: 'Winnings under ',
         timeOutNote: 'Note:',
         lottoTableText1: 'On draw days the closing time for purchases is',
         lottoTableText2: 'LOTTO, LOTTO PLUS 1 and LOTTO PLUS 2 draw days are',
         pwbTableText: 'PowerBall and PowerBall PLUS draw days are',
         replayTimeOutBtn: 'Go to tickets',
         timeoutTitleDetails: 'Tickets can be bought on Nedbank channels from',
         timeoutTableInfo: 'For more details see the table below:'
      },
      updateAtmLimit: {
         success: 'ATM limit changed successfully',
         fail: 'ATM limit update unsuccessful'
      },
      buyTitle: 'Redeem for Unit Trusts',
      redeemForChargesAndFees: 'Charges and Fees',
      headingRedemption: 'redemption',
      toAccount: 'To account',
      fromText: 'From',
      toText: 'To',
      totalValue: 'Total value',
      totalRandValue: 'Total Rand value',
      totalGBValue: 'Total Greenbacks value',
      gbValue: 'Greenbacks value',
      allocation: 'Allocation',
      requestDate: 'Request date',
      referenceNumber: 'Reference number',
      linkAccountLabels: {
         linkSuccessfulCode: 'R00',
         linkButtonText: 'Link',
         preferencesTextHidden: 'hidden',
         successMessage: 'Great! Your accounts were linked successfully.',
         errorMessage: 'We were unable to link your accounts.',
         tryAgainMessage: 'Try again',
         alreadyLinkedAccountsHeading: 'Linked accounts',
         hideAndShowAccounts: 'Hide and show accounts',
         linkedAccountValidateHeading: 'One account must always be visible.',
         hideAndShowAccountSubHeading: `The accounts below are linked to your online banking.
                                        You can hide or show accounts for your overview. One account must always be visible.`,
         alreadyLinkedAccountSubHeading: 'These are the accounts that are already linked to your profile.',
         linkableAccountsHeading: 'Linkable accounts',
         linkableAccountsSubHeading: 'Please note that after you’ve linked an account it can’t be delinked.'
      },
      annualCreditReviewLabels: {
         annualCreditReviewSuccessfulCode: 'R00',
         annualCreditReviewSuccessText: 'Success',
         annualCreditReviewOperationReference: 'Annual limit adjustment opt-in/opt-out',
         thankYouWeWillReviewText: ' Thank you. We’ll review your credit limit(s) every year.',
         thankYouWeHaveUpdatedText: '   Thank you. We’ve updated your selection.',
         title: 'Annual credit review',
         titleDescription1: 'Your limits will be adjusted annually.',
         titleDescription2: 'Choose the accounts on which you want a credit increase.',
         masterToggleHeader: 'Off',
         optInOrOutForIndividualAccountsText: 'Opt in or out for individual accounts',
         benefitsTitle: 'Benefits',
         containerSubHeader: 'This will affect all your credit card accounts.',
         adjustYourLimitsText: 'Your limits will be increased automatically.',
         noPaperWorkText: `You don't need to do any paperwork.`,
         noCallingText: `You don't have to call or visit a branch.`,
         yourCreditLimitText: `When we increase your credit limit, we'll let you know immediately.`,
         manageYourCreditCardText: 'Manage your credit limit effortlessly.',
         noCreditCardNoticeText: `We see that you don't have a credit card account with us.
                                 If you decide to get one you can come back to this page and choose
                                 whether you'd like an annual credit limit review for it.`,
         weWillReviewYourLimitsText: `We'll review your limits once a year,
                                     saving you the effort of visiting a branch and filling out forms.`
      },
      defaultAccount: {
         defaultAccountKey: 'DefaultAccount',
         linkSuccessfulCode: 'R00',
         defaultButtonText: 'Set as default',
         successMessage: 'Success! Your default account has been set.',
         errorMessage: 'Sorry, we couldn\'t set your default account. Please try again.',
         tryAgainMessage: 'Try again',
         alreadyDefaulAccountsHeading: 'Set default account',
         alreadyDefaultAccountSubHeading: 'This is the account you use for everyday banking and includes debit orders and transactions.',
         eligibleAccountsHeading: 'Choose your default bank account:',
         eligibleAccountsSubHeading: '',
         noRecordsFound: 'No accounts available.',
         nodefaultMessage: 'No default account added yet.'
      },
      updateAtmLimitValidations: {
         divisibleMsg: '*Please enter a value in multiples of',
         maximumMsg: '*Please enter a value less than or equal to the maximum limit',
         requiredMsg: '*Amount is required.',
         minAmountMsg: `*Amount should be greater than 100.`
      },
      sessionTimeoutPopup: {
         title: 'To keep you safe, your session will timeout in:',
         minutes: 'Minutes',
         seconds: 'Seconds',
         continuebutton: 'Continue',
         logoutbutton: 'Log out',
         timeoutMilliSeconds: 120000,
         pingMilliSeconds: 180000
      },
      gameTimeout: {
         lotoNotAvailable: 'LOTTO entries are now closed.',
         powerballNotAvailable: 'PowerBall entries are now closed.',
         bothGameNotAvailable: 'LOTTO and PowerBall entries are now closed.',
         bothGameNotAvailableReplay: 'Entries are now closed.'
      },
      greeting: {
         greet: 'Hi {0}, welcome.'
      },
      browserBackPopup: {
         title: 'Are you sure you want to log out?',
         text: 'For your safety, you will be logged out of your banking if you use the back button on your internet browser.',
         okbutton: 'Stay on this page',
         cancelbutton: 'Log out',
         logoff: 'auth/logoff',
         splitIndex: 1
      },
      cardManageConstants: {
         cardSettingText: 'Card settings',
         blockCardText: 'Block card',
         replaceCardText: 'Replace card',
         cardLimitsText: 'Card limits',
         useCardOverseasText: 'Use card overseas',
         updateATMlimitsText: 'Update ATM limits',
         errorScenarioMessage: 'Sorry, we are unable to proceed. Please try again later',
         successStatusCode: 'R00',
         nextBtnText: 'Next',
         cancelBtnText: 'Cancel',
         canSoftBlockLabel: 'canSoftBlock',
         canContactlessLabel: 'canContactLess',
         canInternetPurchaseLabel: 'canInternetPurchase',
         activateCardLabel: 'ActivateCard',
         freezeCard: {
            freezeCardLabel: 'Freeze card',
            cardFreezeActivated: 'Card frozen successfully',
            cardFreezeDeactivated: 'Un-freeze card successful',
            cardFreeze: 'freeze-card',
            deactivateFreezeCard: {
               header: 'Do you want to unfreeze your card?',
               title: 'Your card will be enabled for all transactions.',
               subTitle: '',
               type: 'freeze-card',
               typeParam: 'unblock',
               value: true
            },
            activateFreezeCard: {
               header: 'Do you want to freeze your card?',
               title: 'Please note that certain transactions will be restricted until you unfreeze your card.',
               subTitle: 'If your card is lost or stolen, block your card.',
               type: 'freeze-card',
               typeParam: 'softblock',
               value: false
            }
         },
         tapAndGo: {
            useTapGoLabel: 'Use tap and go',
            tapAndGoActivated: 'Tap and go is now active.',
            tapAndGoDeactivated: 'Tap and go has been deactivated.',
            tapGo: 'tap-go',
            deactivateTapAndGo: {
               header: 'Deactivate tap and go?',
               title: 'This will take effect only after you’ve inserted your card into an ATM or card machine.',
               subTitle: 'Click ‘Next’ if you’d like to continue.',
               type: 'tap-go',
               typeParam: 'CONTACTOFF',
               value: false
            },
            activateTapAndGo: {
               header: 'Activate tap and go?',
               title: 'This will take effect only after you’ve inserted your card into an ATM or card machine.',
               subTitle: 'Click ‘Next’ if you’d like to continue.',
               type: 'tap-go',
               typeParam: 'CONTACTON',
               value: true
            }
         },
         internetPurchases: {
            onlinePurchasesLabel: 'Online purchases',
            internetPurchasesActivated: 'Online purchases are now active.',
            internetPurchasesDeactivated: 'Online purchases have been deactivated.',
            internetPurchasesLabel: 'internet-purchase',
            errorMsg: 'Sorry, we are unable to proceed. Please try again later.',
            deactivateInternetPurchases: {
               header: 'Deactivate online purchases?',
               title: `You won't be able to pay online with your card, including Scan to Pay and other QR code payments.`,
               subTitle: '',
               type: 'internet-purchase',
               typeParam: 'INTPUROFF',
               value: false
            },
            activateInternetPurchases: {
               header: 'Activate online purchases?',
               title: 'You will be able to pay online with your card, including Scan to Pay and other QR code payments.',
               subTitle: '',
               type: 'internet-purchase',
               typeParam: 'INTPURON',
               value: true
            }
         },
         automaticPaymentOrder: 'Automatic payment order',
      },
      browserBackPopupRegister: {
         title: 'Are you sure you want to go back?',
         text: 'If you go back or refresh during registration you’ll have to restart the process for your own security.',
         okbutton: 'Cancel',
         cancelbutton: 'Yes, I want to go back',
         logoff: 'auth/logoff',
         splitIndex: 1
      },
      termAndConditionPopup: {
         title: 'Please review our new terms and conditions',
         couldNotRetrieved: 'Terms and Conditions could not be retrieved',
         text: `By selecting to continue you accept the relevant `,
      },
      // Create constants for Notice Of Withdrawal and Dashboard Lite feature
      nowLabels: {
         nowTitle: 'Notice of withdrawal',
         withdraw: 'You can withdraw up to',
         accNumber: 'Account number',
         investmentAcc: 'Investment account',
         withdrawMsg: 'How much would you like to withdraw?',
         amountWithdraw: 'Amount you\'re withdrawing',
         amount: 'You can withdraw up to ',
         valid: 'Please choose an amount under ',
         amountRange: 'You should have minimum balance of R500. Please change the amount or withdraw the full balance',
         withdrawUpto: 'You need to either withdraw the full amount or leave a balance of at least',
         yourAccount: ' in your account ',
         paidOut: 'When would you like it paid out?',
         withdrawDate: 'Date your withdrawal will be paid out',
         accountPaid: 'Account it will be paid into',
         paidAccount: 'Which account should it be paid into?',
         submit: 'Submit',
         benificiary: 'Search recipient',
         withdrawDetails: 'Your notice of withdrawal details:',
         confirm: 'Confirm',
         currentAccount: 'current accounts.',
         savingAccount: 'saving accounts.',
         investmentAccount: 'investment accounts.',
         homeLoan: 'home loans.',
         creditCard: 'credit cards.',
         doneBtnText: 'Done',
         recipientMsg: 'Recipient account it will be paid to',
         deleteHeader: 'Delete notice of withdrawal',
         deleteSubHeader: 'Are you sure you want to delete this notice of withdrawal?',
         deleteSuccess: 'We\'ve deleted your notice of withdrawal',
         backToOverview: 'Back to overview',
         deleteError: 'We couldn\'t delete your notice of withdrawal',
         errorMessage: 'Please call 0860 555 111 for help.',
         tryAgain: 'Try again.',
         cancelHeader: 'Going somewhere else?',
         cancelSubHeader: 'Your progress will be lost if you choose to leave this page.',
         updateNotice: 'Update',
         deleteNotice: 'Delete',
         edit: 'Edit',
         editNotice: 'We\'ve updated your notice withdrawal details.',
         yes: 'Yes',
         no: 'No',
         cancelTransaction: 'Cancel this Transaction',
         stayOnThisPage: 'Stay on this page',
         beneficiary: 'Which beneficiary should it be paid to?',
         isRecipient: 'Recipient',
         selectAccountLabel: 'Select account',
         viewNoticeTitle: 'Notice of withdrawals submitted',
         payAccount: 'Account to be paid',
         payDate: 'Payout date',
         submitDate: 'Date submitted',
         viewDetails: 'View Details',
         accountTypeBdf: 'BDF',
         accountTypeU0: 'U0',
         submitNotice: 'Submit notice',
         openNewAccount: 'Open a new account',
         viewNotice: 'View submitted notices',
         apply: 'Apply',
         noticePayout: 'noticepayout',
         noticeAmount: 'Amount',
         minimumAmount: 'Please enter an amount of at least '
      },
      recipient: 'recipient',
      uiSwitchBackgroundColor: '#bbbbbb',
      account: {
         balanceDetailLabels: {
            titles: {
               view: 'VIEW MORE BALANCES',
               collapse: 'COLLAPSE MORE BALANCES'
            },

            fieldLabels: {
               movementsDue: 'Movements due',
               unclearedEffects: 'Uncleared effects',
               accruedFees: 'Accrued fees',
               pledgedAmount: 'Pledged amount',
               crInterestDue: 'Credit interest due',
               crInterestRate: 'crInterestRate',
               dbInterestDue: 'Debit interest due',
               dbInterestDueProperty: 'dbInterestDue',
               dbInterestRate: 'dbInterestRate',
               overdraftLimit: 'Overdraft limit',
               overdraftLink: 'Manage',
               totalInterestPaidKey: 'totalInterestPaid',
               totalInterestPaid: 'Interest paid in current tax year',
               interestPaidToDate: 'Interest paid to date',
               reservedForRelease: 'Reserved for release',
               accruedInterest: 'Accrued interest',
               dateOfOpening: 'Account open date',
               interestRate: 'Interest rate',
               maturityDate: 'Maturity date',
               interestFrequency: 'Interest frequency',
               investmentTerm: 'Term',
               termRemaining: 'Term remaining',
               availableWithdrawal: 'Available withdrawal',
               bonusPercentage: 'Bonus percentage',
               payOutDate: 'Payout date',
               payOutDateKey: 'payOutDate',
               additionalDeposit: 'Additional deposit',
               interestPaymentDate: 'Interest payment date',
               initialDeposit: 'Initial deposit',
               percentageSymbol: '%',
               dateFilter: 'dateFilter',
               noFilter: 'noFilter',
               rateFilter: 'rateFilter',
               maturityDateKey: 'maturityDate',
               interestPaidToDateKey: 'interestPaidToDate',
               fundFolioNumber: 'Fund number',
               quantity: 'Total units',
               availableUnits: 'Available units',
               cededAmount: 'Ceded units',
               unclearedAmount: 'Uncleared units',
               percentage: 'Percentage allocation',
               unitPrice: 'Price per unit',
               nextInstallmentAmount: 'Instalment amount',
               amountInArrears: 'Amount in arrears',
               nextPaymentDue: 'Next payment due',
               nextPaymentDate: 'Next payment date',
               loanAmount: 'Loan amount',
               paymentTerm: 'Original term',
               currency: 'Currency',
               interestReceivable: 'Credit interest',
               estimatedRandValue: 'Rand value (estimated)',
               exchangeRateBuy: 'Exchange rate',
               currencyCode: 'currencyCode',
               creditLimit: 'Limit',
               outstandingBalance: 'Pending transactions',
               paymentDueDate: 'Payment due date',
               paymentDueDateKey: 'paymentDueDate',
               minimumPaymentDue: 'Minimum payment due',
               latestStatementDate: 'Latest statement date',
               latestStatementBalance: 'Latest statement balance',
               lastPaymentDate: 'Last payment date',
               lastPaymentAmount: 'Last payment amount',
               balloonAmount: 'Balloon amount',
               balloonPaymentDueDateKey: 'balloonPaymentDueDate',
               balloonPaymentDueDate: 'Balloon payment due date'
            },
            investmentType: {
               fixedInv: 'FIX',
               linkedInv: 'LNK',
               noticeInv: 'NTC',
               callDfInv: 'CALL',
               fixedDfInv: 'FIXED',
               cfoDfInv: 'CFO',
               noticeDfInv: 'NOTICE'
            },
            defaultDate: new Date('0001-01-01T00:00:00'),
            defaultExpiryDate: new Date('1900-01-01T02:00:00+02:00')
         }
      },
      selectCurrency: 'Select currency value',
      trasactionFee: 'Transaction fees',
      totalCost: 'Total amount to be debited',
      fromAccount: 'From account',
      recipientReference: `Recipient's reference`,
      accountDetails: 'Account details',
      accountShare: {
         recipientFormTitle: 'Share proof of account',
         recipientFormSubTitle: 'Your bank certified proof of account will be sent via email',
         enterDefaultEmail: 'Enter recipient email',
         enterAnotherEmail: 'Enter another recipient email',
         addEmail: 'Add another email',
         send: 'Send',
         closeButtonText: 'Close',
         cancelButtonText: 'Cancel',
         emailShareLink: 'Share proof of account via email',
         successInfo: 'Your recipient(s) will receive a certified proof of account.',
         errorInfo: 'Due to a system error your proof of account could not be sent.',
         recipient: 'Recipient:',
         tryAgain: 'Try again',
         accountName: 'Account holder:',
         accountNumber: 'Account number:',
         accountType: 'Account type:',
         branchCode: 'Branch code:',
         shareDetails: 'Share details',
         accountDetails: 'Account details'
      },
      expiresOn: 'Expires on {0}',
      settlement: {
         quoteRequest: {
            getQuoteBtn: 'Get settlement quote',
            title: 'Email settlement quote',
            subTitle: 'Your bank certified settlement quote will be sent via email',
            enterEmail: 'Email',
            send: 'Send',
            recipient: 'Recipient :',
            successInfo: 'Your recipient will receive a bank certified settlement quote.',
            errorInfo: 'Due to a system error your settlement quote could not be sent.',
            tryAgain: 'Try again',
            settlementQuote: 'Settlement quote',
            settlementAmount: 'Settlement amount',
            validateDateInfo: `Quote valid until : {0} (T&C’s apply)`,
            detailedQuoteInfo: 'A detailed settlement quote with the figure captured above has been sent to your registered email address.',
            sendQuoteToAnotherEmailLink: 'Send quote to another email address',
            viewTCLink: 'View loan settlement terms and conditions',
            settleLoan: 'Settle Loan',
            loading: 'Loading…',
            almostDone: 'Almost done!',
            requestIsInProgress: 'Request is in progress',
            placeHolder: 'Your email address',
            dismiss: 'Dismiss',
            accountHolder: 'Account holder(s)',
            accountNumber: 'Account number',
            homeLoanFor: 'Home loan for ',
            quoteRequestedOn: 'Quote requested on: {0}',
            quoteValidUntil: 'Quote valid until: {0}',
            sendQuoteToEmailLink: 'Send quote to an email address',
            viewHLTCLink: 'View home loan settlement terms and conditions',
            HL: {
               errorInfo: 'Something went wrong on our side and we couldn’t send your quote.',
            }
         },
         directPay: {
            title: 'Settle loan',
            subTitle: 'Settlement amount as at today',
            feeInfoMsg: 'The settlement amount is inclusive of daily interest and fees',
            readMore: '…read more',
            wayToPay: 'Ways to pay',
            transferNow: 'Transfer now',
            cashDeposit: 'Cash deposit',
            orEFT: 'or EFT',
            getQuote: 'Get a settlement quote',
            mfc: {
               subTitle: 'Below are ways to settle your loan based on the figure you received as part of the quote.',
               payNow: 'Pay now',
               loanClosure: 'Please note that loan closure process will take 5 to 7 business days after settlement.',
               paidUpLetter: 'A paid up letter will be made available upon loan closure.'
            },
            hl: {
               title: 'Settle your loan',
               subTitle: 'Below are ways to settle your loan based on the figure you received as part of the quote.',
               loanCancelInfo: 'Please note that settling your loan doesn’t automatically cancel it.'
            }
         },
         terms: {
            title: 'Settlement amount terms',
            term1: [`The settlement amount is inclusive of daily interest and fees.The amount quoted is conditional
                     on payment being received on or before `,
               `{0}.`],
            term2: 'The amount takes into account all payments received and assumes that no cheques or debit orders ' +
               'will be referred back to us by your bank.',
            term3: 'The confirmation of the settlement amount is given without prejudice to any rights that ' +
               'Nedbank may have. If, at any stage, it should become clear that Nedbank, for whatever reason, ' +
               'has made a miscalculation or any other error, you will still be liable for the unpaid amount ' +
               'not reflected in this settlement.',
            termsInfo: 'could save you money and improve your cash flow every single month. To apply for a further ' +
               'Nedbank Personal Loan simply dial *120*5616# or visit',
            termsInfoInBold: 'consolidating your debt the responsible way with a further Nedbank Personal Loan ',
            termsInfoRememberText: 'Remember, ',
            homePageLink: 'www.nedbank.co.za',
            MFC: {
               title: 'Loan settlement terms and conditions',
               term1: [`The settlement amount includes daily interest and courier fee, inclusive of VAT.
                       The amount quoted is conditional on payment being received on or before `,
                  `{0}.`],
               term2: [`This amount takes into account all payments received on settlement date including the payment on `,
                  `{0}`,
                  `for the amount of `,
                  `<b>{0}</b>`,
                  ` and assume no cheques/debit orders will be referred back to us by your bank.`],
               term3: `Should the settlement payment be returned the settlement figure would have to be revised.
                       This settlement amount includes all arrears or advances on the account at date of settlement quotation.`,
               term4: `Please note that the right of ownership of the article shall still vest in MFC until the outstanding amount is paid,
                       either in cash or per bank guaranteed cheque, and that the relevant article may not be sold on behalf of MFC.`,
               term5: `This confirmation of the settlement amount occurs without prejudice to any rights, which MFC may have. If,
                       at any stage, it should become clear that MFC, for whatever reason, has made a calculation or any other error,
                       the unpaid amounts will still be due to MFC by yourself.`
            },
            HL: {
               title: 'Loan settlement terms and conditions',
               term1: `Your settlement amount will be valid for seven days only, as daily interest, fees and
                       outstanding transactions will affect the settlement amount quoted. This amount includes all payments
                       credited to your account to date and assumes that your bank will not return any payments. Should this
                       happen, this quoted settlement will no longer be valid.`,
               term2: `The confirmation of your settlement is given without prejudice to the rights of the bank.
                       Should it appear that the bank for whatsoever reason committed an error regarding the calculation of
                       the amount or any other matter, you are still liable to the bank for any unpaid amounts or further
                       debits to your account (e.g. homeowner’s cover, loan protection assurance, life assurance, fees and reversals).`
            }
         },
         otherPaymentModes: {
            title: 'Pay loan via cash deposit or EFT payment',
            cashDepositTitle: 'Cash deposits',
            cashDepositDesc: 'Please visit your nearest Nedbank branch and use {0} as reference',
            eftPaymentsTitle: 'EFT payments',
            eftPaymentsDesc: 'Please use the following details when paying to your Nedbank personal loan account',
            eftPayments: {
               nedBank: 'Nedbank',
               standardBank: 'Standard Bank',
               absaAndFnb: 'ABSA and FNB',
               otherBank: 'ABSA,Capitec or FNB',
               accountType: 'Account type:',
               personalLoanAccountType: 'Nedbank personal loan',
               accountNumber: 'Account number:',
               branchCode: 'Branch code:'
            },
            contactDetails: {
               description: 'Please forward your proof of payment to :',
            },
            loanClosure: 'Please note that loan closure process will be initiated after settlement payment has been received.',
            paidUpLetter: 'A paid up letter will be made available upon loan closure.',
            MFC: {
               title: 'Pay loan by cash deposit or EFT payment',
               cashDepositInfo: 'For cash or cheque deposits visit your nearest Nedbank branch and make the payment at a teller.',
               cashDepositRefNumber: 'Please use {0} as the reference number',
               eftPaymentsDesc: `When making an EFT payment, select MFC, a division of Nedbank' on the bank-approved beneficiary
                                 list on your internet banking website. You must use {0} as the beneficiary reference when
                                 making the payment.`,
               contactInfo: `or fax on {0} as well as share your home or work address for the original registration
                             documents to be sent via courier.`

            },
            HL: {
               title: 'Pay loan via cash deposit or EFT payment',
               cashDepositInfo: `For cash or cheque deposits visit your nearest Nedbank branch and make the payment at a teller.
                                 Note that cheque deposits are subject to a clearance period of seven working days.`,
               cashDepositRefNumber: `Please use {0} as the reference number.`,
               eftPaymentsDesc: 'Please use the following details when settling your Nedbank home loan account.',
               eftPayments: {
                  nedbank: {
                     paymentType: 'Payment type : Once-off',
                     accountType: 'Account type: Nedbank home loan',
                     accountNumber: 'Account number: Bond account number'
                  },
                  absaAndFnb: {
                     paymentType: 'Payment type : Once-off',
                     accountType: 'Account type: Current account',
                     accountNumber: 'Account number: Bond account number',
                     clearingCode: 'Clearing code: 170305',
                     reference: 'Reference: Bond account number'
                  },
                  standardBank: {
                     paymentType: 'Payment type : Funds transfer',
                     accountType: 'Account type: Use \'creditor/debtor details\' option and complete relevant fields.',
                     accountNumber: 'Account number: Bond account number',
                     branchCode: 'Branch code: 170305',
                  }
               }
            }
         },
         transferNow: {
            title: 'Transfer now',
            description: 'Make direct transfer to your personal loan account from your other linked Nedbank account',
            processInfo: 'Please note that loan closure process will be initiated after settlement payment has been received.',
            paidUpLetterInfo: 'A paid up letter will be made available upon loan closure.'
         },
         buttons: {
            proceed: 'Proceed',
            close: 'Close',
            cancel: 'Cancel'
         }
      },
      upliftDormancy: {
         accountIsDormant: 'Account is dormant',
         headerInfo: 'Your account is dormant',
         activate: 'Activate',
         ficaInfo: `Your account is dormant due to inactivity. To transact with this
          account you need to take your FICA documents to your nearest branch.`,
         locateBranchInfo: `Your account is dormant due to inactivity. To transact with this account
           you need to activate it at your nearest branch.`,
         dormantInfo: `Your account is dormant due to inactivity. To transact
          with this account you need to activate it.`,
         fundTransferMsg: `Your account is dormant due to inactivity.
          To transact with this account you need to {0} at least {1} into it or visit your nearest branch.`,
         transferLabel: 'transfer',
         deposit: 'deposit',
         locateBranch: 'Locate branch',
         transfer: 'Transfer',
         dormant: 'Dormant',
         successMessage: 'Your account is now active again. Please ensure that you transact with this account  to avoid dormancy again.',
         errorMessage: `You can not perform any sensitive transactions because your cellphone number is not activated for SMS authorisation.
         You will need to re-activate this at a Nedbank branch.`
      },
      overdraft: {
         header: 'Manage your overdraft',
         currentLimit: 'Current limit',
         debitInterest: 'Debit interest',
         usedAmount: 'Used overdraft amount',
         availableLimit: 'Available overdraft amount',
         changeLimit: 'Change limit',
         cancelLimit: 'Cancel overdraft',
         currentOverdraftLimit: 'Current overdraft limit',
         newLimit: 'New limit',
         cancel: 'Cancel',
         close: 'Close',
         requestToChange: 'Request to change limit',
         changeOverdraftTitle: 'Please let us know reason for cancelling your overdraft.',
         changeOverdraftReason: 'Reason for cancelling overdraft',
         contact: 'Contact details',
         contactMsg: `Please confirm your contact details below and one of our
             consultants will be in touch within 1 business working day.`,
         phoneNumber: 'Phone number',
         phoneMsg: 'This is only the number we will contact you on, it will not change your registered number.',
         email: 'Email address',
         submitBtn: 'Submit request',
         successTitle: 'Request sent successfully',
         successMessage: 'One of our consultants will be in touch within 1 business working day.',
         FICATitle: 'FICA not compliant',
         FICAComplaintMsg: 'Your request can not be processed as you are not FICA compliant.',
         FICAContactMsg: 'For more information, please visit your nearest branch or contact us on',
         FICAContactNumber: '0860 555 111.',
         overdraftAttempt: 'Request submitted. You can make a new request after {0} {1}.',
         hours: 'hours',
         hour: 'hour'
      },
      smsNotificationTo: 'Send my SMS Notifications to?',
      buildingLoan: {
         requestPayment: 'Request payment',
         steps: ['Payment type', 'Payment details', 'Contact person', 'Summary'],
         validKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
         summary: 'Summary',
         propertyAddress: 'Property address',
         payoutType: 'Payment type',
         payout: 'payment',
         payoutDetails: 'Payment details',
         recipientName: 'Recipient name:',
         bank: 'Bank:',
         accountType: 'Account type:',
         accountNumber: 'Account number:',
         contactPersonCamelCase: 'Contact Person',
         nameAndSurName: 'Name and surname:',
         contactNumber: 'Contact number:',
         byClickingTermsAndConditions: 'By clicking ‘Request payment’ you accept the',
         termAndConditionLabel: 'terms and conditions.',
         requestPayout: 'Request payment',
         edit: 'Edit',
         myself: 'Myself',
         specifyPerson: 'Specify person',
         email: 'Email:',
         payoutTermsTitle: 'Building loan payment terms and conditions',
         confirm: 'Confirm',
         close: 'close',
         max: 'Max',
         maxAmount: 'Max. amount',
         final: 'Final',
         progress: 'Progress',
         print: 'Print',
         continue: 'Continue',
         initiatePayment: {
            title: 'Building loan payment',
            subtitle: 'Request a payment from your building loan.',
            pleaseNote: 'Please note',
            getStarted: 'Get started'
         },
         paymentType: {
            selectPaymentTitle: 'Select payment type',
            propertyAddress: 'Property address',
            progressPayment: 'Progress payment',
            finalPayment: 'Final payment',
            progress: 'Progress',
            next: 'Next',
            final: 'Final',
            pleaseNote: 'Please note',
            close: 'close',
            confirm: 'Confirm'
         },
         paymentDetail: {
            title: 'Payment details',
            amount: 'Amount',
            recipientName: 'Recipient name',
            bank: 'Bank',
            accountType: 'Account type',
            accountNumber: 'Account number',
            radioGroupName: 'bank-acc-type',
            nextBtn: 'Next',
            max: 'Max',
            close: 'close',
            backspace: 'Backspace',
            radioValues: {
               amountType: [{ label: 'Maximum amount', value: 'Max' },
               { label: 'Specify amount', value: 'Specify amount' }],
            }
         },
         contactPerson: {
            title: 'Contact person',
            subtitle: 'Whom should the property assessor contact to inspect the property?',
            nameAndSurName: 'Name and surname',
            contactNumber: 'Contact number',
            emailAddress: 'Email address',
            contactType: 'bank-acc-type',
            backspace: 'Backspace',
            close: 'close',
            next: 'Next',
            contactPersonType: [
               {
                  label: 'Me',
                  value: 'MYSELF'
               },
               {
                  label: 'Specify person',
                  value: 'SPECIFICPERSON'
               }
            ],
            phoneNumberLength: 12
         },
         donePage: {
            contactUs: 'Contact us',
            mailTo: 'mailto: buildingloansrp@nedbank.co.za?subject=',
            gotToAccount: 'Go to account',
            sendDocuments: 'Email these documents to',
            weNeedYour: 'We need your',
            submitDocuments: 'Submit documents',
            emailUsDocuments: 'Email us your documents.',
            howToSendDocuments: 'How to send your documents',
            onlineApplication: 'Online application',
            youAreDone: 'You\'re done',
            youAreAlmostDone: 'You\'re almost done',
            final: 'final',
            contact: {
               email: 'buildingloansrp@nedbank.co.za.',
               phoneNumber: '011 495 8911.'
            }
         }
      },
      debitOrder: {
         doneBtnText: 'Done',
         cancelBtnText: 'Cancel',
         closeBtnText: 'Close',
         other: 'Other',
         cancelStopBtnText: 'Cancel stop debit order',
         debitOrdersToApprove: 'Debit orders to approve',
         activeDebitOrders: 'Active debit orders',
         stoppedDebitOrders: 'Stopped debit orders',
         initialDate: 'Initial date',
         description: 'Description',
         amount: 'Amount',
         creditorName: 'Name of creditor',
         installmentAmount: 'Instalment amount',
         accountDebited: 'Account debited',
         lastDebitDate: 'Date of last debit',
         stoppedDate: 'Stopped date',
         frequency: 'Frequency',
         contractRefNr: 'Contract reference number',
         reverseDebitOrderLink: 'REVERSE DEBIT ORDER',
         stopDebitOrderLink: 'STOP DEBIT ORDER',
         cancelStopLink: 'CANCEL STOP DEBIT ORDER',
         viewDetails: 'View details',
         reversed: 'Reversed',
         stopDebitOrderTitle: 'Stop debit order',
         reasonTitle: 'Reason',
         tellUsMore: 'Tell us more about your dispute',
         selectReason: 'Please select',
         reverseDebitOrder: 'Reverse debit order'
      },
      reportFraud: {
         header: 'Report fraud',
         fraudReport: 'Tell us about the fraud',
         dateOfFraud: 'When did this happen?',
         includeAccount: 'Include your account and third-party details (optional).',
         whichAccount: 'On which account?',
         totalAmount: 'Total amount.',
         TPAccountNum: 'Third-party account number.',
         TPBankName: 'Third-party bank name.',
         tellUs: 'Tell us what happened.',
         email: 'Your email address.',
         buttonLabel: 'Report fraud',
         slash: '/',
         cardOperation: 'You can block or freeze your card from the cards section on the app.',
         reverseOrder: 'You can reverse debit orders on your account by selecting the suspicious debit order.',
         cardInfo: `For card-related fraud, please call `,
         cardInfoNumber: '011 667 2999',
         cardMoreInfo: '. You can block or freeze your card from the cards section on the app.',
         cardMessage: 'You can reverse debit orders on your account by selecting the suspicious debit order.',
         attemptHeader: `You’ve already reported 5 fraud incidents today.`,
         errorHeader: `We couldn't send your fraud report`,
         errorInfo: `Something went wrong and we couldn’t send you report. If you continue to experience a problem,
          please contact 0800 110 929 to report your fraud.`,
         tryAgain: 'Try again',
         info: `Please note that all fraud reports submitted through the Money Web are attended to between the hours
          of 07:00 am and 18:00 pm, Mondays to Fridays (excluding public holidays). For urgent assistance, please call `,
         infoNumber: '0800 110 929.',
         defaultAccount: 'Not account related',
         close: 'Close',
         placeholder: {
            totalAmount: 'R0.00',
            accountNumber: 'Account to which funds were deposited.',
            bankName: 'Bank that received fraudulent funds.'
         },
         feedbackTypes: <IButtonGroup[]>[
            { label: 'Feedback', value: 'FEEDBACK' },
            { label: 'Report', value: 'REPORT' }
         ]
      },
      feedback: {
         topHeading: `We're here to help, contact us today.`,
         contactUs: 'Contact Us',
         supportTiming: 'Our support team is available Monday to Friday from 08:00 to 17:00 (GMT+2).',
         SAcontactCenter: '(South African contact centre)',
         INcontactCenter: '(International contact centre)',
         reportFraud: '(Report fraud)',
         publicHoliday: '(After-hours or public holidays)',
         contactEmail: 'contactcentre@Nedbank.co.za',
         tryAgain: 'Please try again',
         feedback: 'Feedback',
         feedbackHeading: 'Feel free to give us feedback.',
         complimentMessage: 'That’s great! Tell us what we got right.',
         queryMessage: 'Thank you. How can we improve our service?',
         complaintMessage: 'Thank you. How can we improve your experience?',
         callbackHeading: 'Would you like a consultant to call you back?',
         chooseTime: 'Choose contact time',
         slash: '/',
         submitFeedback: 'Submit feedback',
         querySuggestion: 'QuerySuggestion',
         queryOrSuggestion: 'Query or suggestion',
         SAcontactCenterNumber: '0860 555 111',
         INcontactCenterNumber: '+27 11 710 4000',
         reportFraudNumber: '+27 11 295 9555',
         publicHolidayNumber: '0800 110 929',
         callMeBackBtn: 'Call me back',
         giveFeedbackBtn: 'Give us your feedback',
         reportFraudBtn: 'Report fraud',
         placeholder: {
            sendFeedbackInfo: 'What is your feedback?',
            callMeBackInfo: 'What\'s this about?'
         }
      },
      statementAndDocument: {
         title: 'Statements and documents',
         statement: { label: 'Statements', value: 'STATEMENT' },
         document: { label: 'Documents', value: 'DOCUMENTS' },
         preference: { label: 'Preferences', value: 'PREFERENCES' },
         documents: {
            subtitle: 'Document types',
            email: 'Email',
            from: 'From',
            to: 'To',
            plInfo: 'Please note that this paid up letter may take up to 72 hours to be sent.',
            hlInfo: 'Please note that this {0} will be sent to you within 1 business day.',
            mfcInfo: 'Please note that a {0} will be sent to you within 24 business hours.',
            send: 'Send',
            mfc: {
               steps: ['Travel information', 'Driver information', 'Email'],
               travelInformation: {
                  title: 'Cross border letter',
                  countryYouAreVisiting: 'Country or countries you are visiting',
                  addAnotherCountry: 'Add another country',
                  addCountry: 'Add another country',
                  leavingDate: 'Date you are leaving on',
                  retuningDate: 'Date you are returning on',
                  plate: 'License plate number',
                  name: 'Insurance company name',
                  number: 'Insurance policy number',
                  next: 'Next',
                  defaultCountry: 'Choose one'
               },
               driverInformation: {
                  title: 'Cross border letter',
                  nominate: 'Do you have a nominated driver?',
                  info: 'A \'nominated driver\' is someone who has permission to sometimes drive your car',
                  next: 'Next',
                  name: 'Name',
                  surname: 'Surname',
                  licence: 'Drivers licence number',
                  id: 'ID or passport number',
                  addDriver: 'Add another driver',
                  nominateDriver: <IButtonGroup[]>[
                     { label: 'Yes', value: 'YES' },
                     { label: 'No', value: 'NO' }
                  ]
               },
               email: {
                  title: 'Cross border letter',
                  emailInfo: 'Email address we should send letter to',
                  emailAddress: 'Email address',
                  acknowledgment: 'Acknowledgment and confirmation',
                  info: `You have read and understood your policy’s terms and conditions.
                   Your policy is active and your insurer covers your vehicle for traveling to your selected destination.
                   Your insurance company will insure your vehicle for the duration of your stay in the destination.
                   You may not take your vehicle outside the Republic of South Africa without first obtaining
                   our written consent to do so. If you do not take out and maintain any insurance or
                   do not comply with the conditions of your policy, you will be in material breach of your finance agreement.`,
                  acknowledgmentCheck: 'I have read and I agree with the acknowledgment.',
                  request: 'Request',
               },
               error: {
                  title: 'Your cross border could not be requested',
                  errorInfo: 'Due to a system error your cross border letter could not be requested.',
                  tryAgain: 'Try again'
               },
               errorMsg: {
                  title: `We couldn\'t generate your cross border letter`,
                  errorInfo: `Something went wrong on our side and we couldn\'t generate your cross border letter.`,
                  tryAgain: 'Try again'
               },
               success: {
                  title: 'Your cross border letter has been requested',
                  info: 'Your cross border letter will be emailed to you within 24 business hours.',
                  close: 'Close'
               }
            }
         },
         statements: {
            form: 'From',
            to: 'To',
            email: 'Email address',
            send: 'Send',
            infoForPl: 'Please note that this statement may take up to 72 hours to be sent.',
            infoForHl: 'Please note that this statement will be sent to you within 1 business day.',
            mfcTitle: 'Latest statement',
            infoForMfc: 'Please note that this statement may take up to 24 business hours to be sent.',
         },
      },
      viewBanker: {
         yourBanker: 'Your banker',
         bankerFailed: 'Failed to load your banker.',
         retryMsg: 'Please click to retry.',
         warningMsg: 'To find out your banker’s information please call us on',
         retry: 'Retry',
         emailToText: ' or send an email to',
         defaultPhone: '+27 84 334 2313',
         defaultEmail: 'contactcentre@nedbank.co.za'
      },
      loanDebitOrder: {
         managePaymentDetails: 'Manage payment details',
         viewPaymentDetails: 'View payment details',
         sectionTitle: 'Payment details',
         mfcName: 'MFC',
         personalLoan: 'Personal loan',
         homeLoan: 'Home loan',
         chassisNumber: 'Chassis number ',
         engineNumber: 'Engine number ',
         interestRate: 'Interest rate ',
         frequency: 'Frequency of payment ',
         dealInfo: 'Deal Information',
         loanInfo: 'Loan Information',
         instalmentAmount: 'Instalment amount',
         debitOrderAmount: 'Debit order amount',
         nextInstalmentDate: 'Next Instalment Date',
         freq: 'Frequency',
         paymentMethod: 'Payment Method',
         bankingDetails: 'Banking Details',
         bankName: 'Bank Name',
         universalBranchCode: 'Universal branch code',
         branchCode: 'Branch name or code',
         accountNumber: 'Account Number',
         accountType: 'Account Type',
         editDebitOrder: 'Edit Debit Order',
         paymentMethodCash: 'Cash',
         newDebitOrderDate: 'New debit order date',
         applyToAllAccounts: 'Apply banking details and date change to all my active MFC accounts',
         accountNumberInline: 'Acc num ',
         applyChanges: 'Apply changes',
         emailUploadNow: 'Email now',
         continuebutton: 'Continue',
         details: 'Details',
         mailTo: 'mailto:',
         minimumInstalment: 'Minimum instalment',
         instalment: 'Instalment',
         paymentDay: 'Payment day',
         doneBtnText: 'Done',
         debitOrderDate: 'Debit order date',
         description: 'Description',
         amount: 'Amount',
         expiryDate: 'Valid until ',
         lastUpdated: 'Last updated',
         print: 'Print',
         tnc: 'Terms and conditions',
         universalCode: 'universalCode',
         displayName: 'displayName',
         zeroValue: 0,
         oneValue: 1
      },
      transactionSearch: {
         searchLabel: 'Search',
         filter: 'Filter',
         amountFrm: 'Amount from',
         amountUpTo: 'Amount up to',
         period: 'Period',
         txnDateFrom: 'Transaction date from',
         txnDateTo: 'Transaction date to',
         from: 'from',
         upTo: 'up to',
         amountFrom: 'amountFrom',
         amountTo: 'amountTo',
         placeholderDate: 'Please select',
         placeholderText: 'Type something',
         cancelBtn: 'Cancel',
         submitBtn: 'Submit',
         groupName: 'transactionSearch',
         points: 'Points ',
         amount: 'Amount '
      },
      transactionHistory: {
         date: 'Date',
         description: 'Description',
         balance: 'Balance',
         points: 'Points',
         rewardsType: 'Rewards'
      },
      statementDownload: {
         groupName: 'statementDownload',
         download: 'Download'
      },
      it3b: {
         taxCertificate: 'Tax certificates',
         taxYear: 'Tax year',
         download: 'Download',
         noCertificates: 'There are currently no certificates available for this account.',
         fileName: 'TaxCertificate_',
         fileExt: '.pdf'
      },
      manageYourLoan: 'Manage your loan',
      chargesAndFees: {
         selectChargesAndFees: 'Select charges or fees',
         bankCharges: 'Bank Charges',
         linkageFees: 'Linkage Fees',
         cardFees: 'Card Fees',
         toWhichAccount: 'To which account?',
         amount: 'Amount',
         randRequired: 'Rand value is required',
         referenceQueries: 'Please keep your reference number safe for future queries.',
         accountErrorMsg: 'You need atleast one Current Account or Savings Account to make use of this feature.',
         openAccount: 'Open an everyday banking account at ',
         redeemTitle: 'Redeem for Charges and Fees',
         errorTitle: 'You don’t have a qualifying product.'
      }
   };
   public static disablePoupMin = {
      height: 700,
      width: 700
   };
   public static dropdownDefault = {
      displayText: 'Please select',
      value: ''
   };
   public static VariableValues = {
      cancelButtonText: 'Cancel',
      creditCardLengths: { min: 15, max: 16 },
      lottoAgeLimit: 18,
      defaultZoomLevel: 16,
      smsMinLength: 10,
      smsMaxLength: 10,
      referenceMaxLength: 30,
      maximumPaymentAttempts: 3,
      maximumTransferAttempts: 3,
      maximumReplaceCardAttempts: 3,
      maximumDebitReverseAttempts: 3,
      loadTripReferenceMaxLength: 30,
      unknownAccountType: 'U0',
      countryDetails: 'Country details',
      recipientBankDetails: 'Bank Details',
      forexServiceNotAvailable: 'FOREX service not available',
      forexServiceNotAvailableSubHeading: 'You can\'t pay foreign recipients at the moment. Please try again.',
      filterNonTransferAccounts: ['INV', 'TD', 'DS', 'NC', 'IS', 'HL', 'PL', 'CFC', 'Rewards', 'TC'],
      removePayBuyTransferTags: ['Investment', 'Loan', 'ClubAccount', 'Foreign', 'Rewards', 'TravelCard'],
      gameHurryTime: -30,
      courierCode: 9163,
      countryCode: '+27',
      phoneNumberLength: 9,
      spaceKeyCode: 32,
      ViewOffer: 'View Offer',
      gameDayCodes: {
         MON: <IDropdownItem>{ text: 'monday', code: 'MON' },
         TUE: <IDropdownItem>{ text: 'tuesday', code: 'TUE' },
         WED: <IDropdownItem>{ text: 'wednesday', code: 'WED' },
         THU: <IDropdownItem>{ text: 'thursday', code: 'THU' },
         FRI: <IDropdownItem>{ text: 'friday', code: 'FRI' },
         SAT: <IDropdownItem>{ text: 'saturday', code: 'SAT' },
         SUN: <IDropdownItem>{ text: 'sunday', code: 'SUN' },
         NORM: <IDropdownItem>{ text: 'normal', code: 'NORM' },
         DRAW: <IDropdownItem>{ text: 'draw', code: 'DRAW' },
      },
      clubAccount: { productType: '33' },
      accountTypes:
      {
         currentAccountType: { text: 'Current account', code: 'CA', sortCode: 198765, isShownPaytoBank: true },
         savingAccountType: { text: 'Savings account', code: 'SA', sortCode: 198765, isShownPaytoBank: true },
         creditCardAccountType: { text: 'Credit Card account', code: 'CC' },
         investmentAccountType: { text: 'Investment account', code: 'DS', sortCode: 198765, isShownPaytoBank: true },
         homeLoanAccountType: {
            text: 'Home loan account', code: 'HL', sortCode11Digits: 170305,
            sortCode13Digits: 760005, isShownPaytoBank: true
         },
         personalLoanAccountType: {
            text: 'Personal loan account', code: 'PL',
            /* as per Heins suggestion, Personal Loan and home loan will have same account Type */
            sortCode11Digits: 170305, sortCode13Digits: 760005, isShownPaytoBank: true
         },
         mfcvafLoanAccountType: { text: 'Mfc/VAF loan account', code: 'IS' },
         rewardsAccountType: { text: 'Rewards', code: 'Rewards' },
         treasuryInvestmentAccountType: { text: 'Treasury Investment account', code: 'TD' },
         unitTrustInvestmentAccountType: { text: 'NGI Investment account', code: 'INV' },
         foreignCurrencyAccountType: { text: 'Foreign currency account', code: 'CFC' },
         travelCardAccountType: { text: 'Travel card account', code: 'TC' }
      },
      paymentRecurrenceFrequency: {
         none: <ITransactionFrequency>{ text: 'Never', code: null, maxValue: 0 },
         weekly: <ITransactionFrequency>{ text: 'Weekly', code: 'Weekly', maxValue: 52, duration: 'Week' },
         monthly: <ITransactionFrequency>{ text: 'Monthly', code: 'Monthly', maxValue: 12, duration: 'Month' }
      },
      cardBlockingReasong: {
         lost: <IDropdownItem>{ text: 'Lost', code: 'lost' },
         stolen: <IDropdownItem>{ text: 'Stolen', code: 'stolen' },
         retain: <IDropdownItem>{ text: 'Swallowed by the ATM', code: 'retain' },
         damaged: <IDropdownItem>{ text: 'Damaged', code: 'damaged' },
      },
      statementPreferenceTypes: <IButtonGroup[]>[
         { label: 'Email', value: 'EMAIL' },
         { label: 'Post', value: 'POST' },
         { label: 'Do not send', value: 'DONOTSEND' }
      ],
      searchTransactionsDateRange: <IButtonGroup[]>[
         { label: '30 days', value: '30' },
         { label: '60 days', value: '60' },
         { label: '90 days', value: '90' },
         { label: 'Custom', value: 'custom' }
      ],
      disputeOrderReasons: {
         paidoff: <IDropdownItem>{ text: 'I haven\'t authorized this debit on my account', code: 'paidoff' },
         fraud: <IDropdownItem>{ text: 'I was debited more than I agreed to', code: 'fraud' },
         cancelledPolicy: <IDropdownItem>{ text: 'I have cancelled the service', code: 'cancelledPolicy' },
         other: <IDropdownItem>{ text: 'Other', code: 'other' }
      },
      mandateStatus: { Active: 'Active', Pending: 'Pending', Disputed: 'Disputed' },
      gameTypes: {
         LOT: <IDropdownItem>{ text: 'LOTTO', code: 'LOT' },
         PWB: <IDropdownItem>{ text: 'PowerBall', code: 'PWB' }
      },
      cardTypes: {
         debit: <IDropdownItem>{ text: 'Debit Card', code: 'd' },
         credit: <IDropdownItem>{ text: 'Credit Card', code: 'c' }
      },
      playMethods: {
         pick: <IDropdownItem>{ text: 'Pick numbers', code: 'p' },
         quickPick: <IDropdownItem>{ text: 'Quick Pick', code: 'a' }
      },
      lotto: {
         maxValue: 52,
         numberOfValues: 6,
         notifyWinLimit: '50000'
      },
      nedBankDefaults:
      {
         bankName: 'NedBank',
         branch: {
            branchName: 'NEDBANK SOUTH AFRICA',
            branchCode: '198765'
         },
         acceptsRealtimeAVS: true,
         acceptsBatchAVS: true,
         accountType: ''
      },
      bluffCarouselCard: <IPlasticCard>{
         CamsPlasNbr: '0',
         CamsPlasStatus: 'Active',
         DCIndicator: 'C',
         CardPlCustRelCd: '',
         CamsPlasStockCode: '',
         PlCurStatRsnCd: '',
         PlasBranchNumber: '',
         CamsNameLn: '',
         PlasExpiryDate: '2020-11-12 12:00:00 AM',
         PlasIssueDate: '',
         PlasticTypeDescrip: '',
         AllowBlock: false,
         AllowReplace: false
      },
      branchLocator: {
         atm: <IBranchLocatorOptions>{ text: 'ATM', code: 'atm' },
         branch: <IBranchLocatorOptions>{ text: 'Branch', code: 'branch' },
         forexBranch: <IBranchLocatorOptions>{ text: 'Forex Branch', code: 'forex-branch' }
      },
      deliveryOptions: {
         nedbankBranch: <IDropdownItem>{ text: 'Nedbank branch', code: 'nedbankbranch' },
         courier: <IDropdownItem>{ text: 'Courier', code: 'courier' }
      },
      endDateRepeatType: 'endDate',
      occurencesRepeatType: 'occurences',
      repeatType: { endDate: 'End date', occurences: 'Occurrences' },
      settings: {
         title: 'Settings',
         messageHideTimeout: 5000,
         navMenus: <INavigationModel[]>[
            { label: 'Profile limits', url: 'profile-limits' },
            { label: 'Set default account', url: 'default-account' },
            { label: 'Link accounts', url: 'link-accounts' },
            { label: 'Hide and show accounts', url: 'account-visibility' },
            { label: 'Annual credit review', url: 'annual-credit-review' }
         ],
         updateStatus: {
            Success: 'SUCCESS',
            Failure: 'FAILURE',
            Partial: 'PARTIAL',
            SuccessSingle: 'SUCCESSSINGLE'
         },
         limitTypes: { Permanent: 'Permanent', Temporary: 'Temporary' },
         widgetTypes: {
            payment: 'payment',
            transfer: 'transfer',
            instantpayment: 'instantpayment',
            prepaid: 'prepaid',
            sendimali: 'sendimali',
            lotto: 'lotto'
         },
         labels: {
            transactionLimitchange: 'You\'ve made changes to your profile limits',
            ProfileLimitRoute: 'profile-limits',
            successfullyUpdated: 'Your profile limits was successfully updated ',
            partialResponse: 'Some of your profile limits couldn\'t be updated',
            FailureResponse: 'We couldn\'t update your profile limits ',
            changedLimitText: 'You\'ve made changes to your ',
            SuccessfullyUpdated: 'Successfully updated',
            FAILURE: 'FAILURE',
            Failed: 'Failed',
            Success: 'SUCCESS',
            Temporary: 'Temporary',
            Permanent: 'Permanent',
            Pending: 'PENDING',
            Invalid: 'Invalid'
         },
         extraErrorMsgs: {
            forPayment: '*Your Payment Limit cannot be less than your current limits for Send iMali, Lotto, Prepaid or Instant Payment',
            forOthers: {
               instantpayment: '*Instant Payment limit cannot be more than the defined Payment limit.',
               sendimali: '*Send iMali limit cannot be more than the defined Payment limit.',
               prepaid: '*Prepaid limit cannot be more than the defined Payment limit.',
               lotto: '*Lotto limit cannot be more than the defined Payment limit.'
            }
         },
         widgetsDetails: <ILimitWidgetModel[]>[
            { type: 'payment', headerText: 'Payment limit', limitTypeSelected: '' },
            { type: 'transfer', headerText: 'Transfer limit', limitTypeSelected: '' },
            { type: 'instantpayment', headerText: 'Instant payment limit', limitTypeSelected: '' },
            { type: 'prepaid', headerText: 'Prepaid limit', limitTypeSelected: '' },
            { type: 'sendimali', headerText: 'Send iMali limit', limitTypeSelected: '' },
            { type: 'lotto', headerText: 'Lotto limit', limitTypeSelected: '' }
         ]
      },
      profile: {
         title: 'Your profile',
         debounceTime: 1500,
         messageHideTimeout: 5000,
         navMenus: <INavigationModel[]>[
            { label: 'Profile details', url: 'profile-details' },
            { label: 'Change password', url: 'change-password' },
            { label: 'Your banker', url: 'view-banker' }

         ],
         viewBankerNav: <INavigationModel>{ label: 'Your banker', url: 'view-banker' },
         limitDetailMapper: [
            { limitType: 'payment', displayValue: 'Payment' },
            { limitType: 'transfer', displayValue: 'Transfer' },
            { limitType: 'lotto', displayValue: 'Lotto' },
            { limitType: 'sendimali', displayValue: 'Send Imali' },
            { limitType: 'prepaid', displayValue: 'Prepaid' },
            { limitType: 'instantpayment', displayValue: 'Instant payment' }]
      },
      notificationCharges: {
         SMS: 1.00,
         Email: 0.70,
         Fax: 5.00
      },
      gameMethod: {
         p: 'OWN',
         a: 'QPK'
      },
      debitReverseHelplineText: 'Please call 0860 555 111 or +27 11 710 4000 (international) for further assitance.',
      maxDebitCardATMLimit: 5000,
      accountContainers: {
         bank: 'Bank',
         investment: 'Investment',
         loan: 'Loan',
         rewards: 'Rewards',
         card: 'Card'
      },
      shareAccountTypes: {
         currentAccountType: { text: 'Current account', code: 'CA' },
         savingAccountType: { text: 'Savings account', code: 'SA' },
         creditCardAccountType: { text: 'Credit Card account', code: 'CC' },
         investmentAccountType: { text: 'Investment account', code: 'DS' },
         homeLoanAccountType: { text: 'Home loan', code: 'HL' },
         personalLoanAccountType: { text: 'Personal loan', code: 'PL' },
         rewardsAccountType: { text: 'Rewards', code: 'Rewards' },
         treasuryInvestmentAccountType: { text: 'Treasury investment', code: 'TD' },
         vehicleFinanceLoanAccountType: { text: 'Vehicle finance', code: 'IS' },
         nedCreditAccountType: { text: 'NedCredit account', code: 'NC' },
         ngiAccountType: { text: 'NGI investment account', code: 'INV' },
         cfcAccountType: { text: 'Customer foreign currency account', code: 'CFC' },
         npAccountType: { text: 'Nedmatic profile account', code: 'NP' },
         onlAccountType: { text: 'Over night loan / Nedmatic profile', code: 'NP' }
      },
      accountShare: {
         maxNumberOfRecipients: 10,
         tryAgainLimit: 2,
         channel: 'Email',
         identifierType: 'CIS',
      },
      overdraft: {
         maxOverdraftLimit: 250000,
         changeRequestType: 'MODIFY',
         cancelRequestType: 'CANCEL',
         newOverdraftLimitValue: 1000,
         successCode: 'R00',
         ficaCode: 'HV05',
         maxCharacter: 120
      },
      sytemErrorMessages: {
         defaultMessage: 'defaultMessage',
         transactionMessage: 'transactionMessage'
      },
      settlement: {
         quoteRequest: {
            tryAgainLimit: 2,
            numberForContactMFC: '0860 879 900',
            faxNumberForContactMFC: '0860 035 466',
            emailForContactMFC: 'care@mfc.co.za',
            emailForContactPL: 'pladmin@nedbank.co.za',
            emailSubject: 'Proof of payment'
         },
         navigateFromDirectPay: 'DIRECT-PAY',
         navigateFromRequestQuote: 'REQUEST-QUOTE',
         bankDefinedBeneficiary: {
            id: '0000009287',
            name: 'MFC DIVISION OF NEDBANK',
            sortCode: 195705,
            yourReference: 'MFC Loan settlement'
         },
         closureMinAmount: -300,
         closureMaxAmount: 300,
         termsSearchQuery: 'terms and conditions'
      },
      upliftDormancy: {
         dormantAccountStatus: '10',
         accountBalance: 50000.00,
         ficaCode: [700, 701, 800],
         dormancyRequest: {
            secureTransaction: {
               verificationStatusEnum: 'APPROVED',
               verificationReferenceId: 0,
               customId: ''
            }
         },
         containerName: ['Bank', 'Card'],
         dormancySuccessfulCode: 'R00',
      },
      email: {
         mailTo: 'mailto:',
         subject: '&subject='
      },
      reportFraud: {
         empty: '',
         hours: 'hours',
         hour: 'hour',
         one: '1',
         minDays: 1825,
         maxDay: 0,
         currency: 'R',
         zero: '0',
         maxLimit: {
            reason: 1000,
            totalAmount: 15,
            accountNumber: 35,
            bankName: 50,
         },
         accountsOrder: ['current', 'savings', 'credit-card', 'loan', 'investment', 'foreign', 'default']
      },
      feedback: {
         maxLimit: 4000,
         empty: '',
         FeedbackTypes: ['Compliment', 'QuerySuggestion', 'Complaint'],
         feedbackCallTimings: ['Morning', 'Afternoon', 'Evening', 'All day']
      },
      statementAndDocument: {
         mfc: 'mfc',
         months: 'months',
         mfcTaxCertificate: 'mfctaxcertificate',
         mfcCrossBorderLetter: 'mfccrossborderletter',
         hlDocumentType: 'hlstatement',
         plDocumentType: 'plstatement',
         mfcDocumentType: 'mfcstatement',
         statement: 'Statement',
         minYears: 5,
         minMonth: 1,
         showStatementDocument: ['Personal loan', 'PL', 'HL'],
         hlPlAccount: ['PL', 'HL'],
         documents: {
            mfc: {
               countries: ['Botswana', 'Mozambique', 'Zimbabwe', 'Swaziland', 'Lesotho', 'Namibia'],
               noOfDriverInfo: 4
            }
         },
         tryAgainLimit: 2,
         crossBorderLetter: 'cross border letter'
      },
      debitOrder: {
         subTranCode: {
            eft: '00',
            naedo: '10'
         },
         tranCode: '1460',
         orderType: {
            existing: 'EXE',
            stopped: 'STP'
         },
         installmentAmountValue: 100,
         channelTechType: '100',
         otherReasonCode: '14',
         otherReasonCharLength: 120,
         reasonOrderType: {
            reversePaymentReasons: 'disputedebitorderreasons',
            stopPaymentReasons: 'stoppaymentreasons'
         }
      },
      loanDebitOrder: {
         sendDocsMailId: 'care@mfc.co.za',
         daysAfter: 7,
         days: 'days',
         uptoMonths: 2,
         months: 'months',
         accountTypes: {
            currentAccountType: <IDropdownItem>{ text: 'Current account', code: 'CA' },
            savingAccountType: <IDropdownItem>{ text: 'Savings', code: 'SA' },
            chequeAccountType: <IDropdownItem>{ text: 'Cheque', code: 'CA' }
         },
         accountTypesHlPl: {
            currentAccountType: <IDropdownItem>{ text: 'Current account', code: 'CA' },
            savingAccountType: <IDropdownItem>{ text: 'Savings', code: 'SA' },
            trnAccountType: <IDropdownItem>{ text: 'Transmission', code: 'TRN' }
         },
         nextInstallmentDate: 'nextInstallmentDate',
         bankingDetailsFields: ['bankName', 'bankAccNumber', 'bankBranchCode', 'bankAccountType']
      },
      transactionSearch: {
         patternForAmount: '[0-9]+(\.[0-9][0-9]*)?',
         contextualSearchMaxLength: 11,
         zeroValue: '0',
         zeroDecValue: '0.00',
         twoValue: 2,
         emptyValue: '',
         days: 'days',
         year: -365,
         threeMonths: -90,
         thirty: 30,
         sixty: 60,
         ninety: 90,
         contextualSearchStart: 2
      },
      statementDownload: {
         downloadLabel: 'Download',
         noStatementAvailabelMonth: 'There is no statement available for this month',
         noStatementAvailabel: 'There are currently no statements available for this account.',
         footerNotificationMessage: 'For statements older than 3 months please visit your nearest branch or call 0860 555 111.',
         fromDateError: `'From' date can't be later than 'To' date`,
         noDownloadErroMessageForCSV: 'There are no transactions available for this date range.',
         sheetName: 'Statement_',
         optionDate: 'Date',
         optionTransactions: 'Transactions',
         optionAmount: 'Amount',
         fileExt: '.pdf'
      },
      openNewAccount: {
         yes: 'Y',
         selectedAccount: 'BD'
      },
      statementDownloadTypes: <IButtonGroup[]>[
         { label: 'PDF statements', value: 'PDF' },
         { label: 'Transaction list (CSV)', value: 'CSV' }
      ],
      noticeOfWithdrawalValues: {
         sixValue: 6,
         one: '1',
         two: '2'
      },
      rewardsProductCategories: {
         bankCharges: { code: 'BankFees', description: 'Bank Charges' },
         linkageFees: { code: 'RewardsFees', description: 'Linkage Fees' },
         cardFees: { code: 'CardFees', description: 'Card Fees' }
      },
      redeemProductTypes: {
         CC: { code: 'CC', desc: 'Credit card' },
         CA: { code: 'CA', desc: 'Current account' },
         SA: { code: 'SA', desc: 'Savings account' }
      }
   };
   public static patterns = {
      // TO-Do, lengthy lines to be manages for Tslint
      // tslint:disable:max-line-length
      email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/,
      // tslint:enable:max-line-length
      mobile: /^(?:(?:\+27|0|27)\d{9}|[1-9]\d{9})$/,
      internationalMobile: /^(?:(?:\+)\d{9,15}|[0-9]\d{9,15})$/,
      alphabet: /^[a-zA-Z]+$/,
      number: /^[0-9]\d*$/,
      name: /^[a-zA-Z @!#\$\^%&*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\?]+$/,
      alphaNumericWithSpace: /^[a-zA-Z0-9 ]+$/,
      alphaNumeric: /^[a-zA-Z0-9]+$/,
      split: /\B(?=(\d{3})+(?!\d))/g,
      amountOnly: /[^0-9.]/g,
      removeDecimal: /\./g,
      invalidCharacters: /[°"§%()\[\]{}=\\?´`'#<>|,;.:+_-]+/g,
      recipientsAllowedChars: /[^A-Za-z0-9 ()_-]/g,
      replaceSpace: /\s/g,
      initialNonZero: /^[0-9]+(\.[0-9]{0,2})?$/,
      replaceSplittedNumberWithoutSpace: /[^0-9]/g,
      splitNumberByFourDigits: /(\d{4}(?!\s))/g
   };
   public static messages = {
      enterNumber: 'Please enter the number.',
      enterMobileNumber: 'Please enter the mobile number.',
      requiredField: 'This is a required field.',
      maxRefLimit: 'Cannot be longer than 30 characters.',
      invalidEmail: 'Please enter a valid email address.',
      invalidNumber: 'Please enter a valid mobile number.',
      invalidFaxNumber: 'Please enter a valid fax number.',
      requiredtheirReference: 'Please enter their reference.',
      validEmail: 'Please enter an email address.',
      requiredReference: 'Please enter a reference.',
      statementPreferences: {
         emailRequired: 'This field cannot be empty',
         invalidEmail: 'Invalid email address'
      },
      accountShare: {
         success: 'Your proof of account has been sent',
         error: 'Your proof of account could not be sent',
         invalidEmail: 'Invalid email address format.',
      },
      settlement: {
         quoteRequest: {
            success: 'Your settlement quote has been sent',
            error: 'Your settlement quote could not be sent',
            invalidEmail: 'Invalid email address',
            generateError: 'Settlement quote error',
            generateErrorInfo: 'A settlement quote cannot be generated on this account. To get a quote contact MFC on  : ',
            closureProcess: 'Closure process is underway',
            closureProcessInfo: `Please note that the loan closure process takes 5 to 7 business days after settlement.
                                 For more information contact MFC on :`,
            technicalError: 'Settlement quote could not be generated',
            technicalErrorDesc: 'Something went wrong on our side and we couldn\'t generate your quote.',
            HL: {
               error: 'We couldn\'t send your settlement quote'
            }
         },
         unableToLoad: 'Unable to load',
         balLoadError: 'Some balances could not be loaded'
      },
      invalidPhone: 'Please enter a valid phone number',
      invalidOverdraftAmount: 'Update between R100 and R250 000 only in multiples of 100',
      notMultipleOfHundredAmount: 'Please enter in multiples of R100',
      sameOverdraftAmount: 'You cannot enter the same amount as your current limit',
      transactionHistory: {
         noMoreTransactions: 'No more transactions found',
         transactionListingFailed: 'Something is wrong',
         viewMoreTransactions: 'View more transactions'
      },
      buildingLoan: {
         specifyMessage: 'Specify who the property assessor should contact to inspect the property.',
         discardChanges: 'Discard changes?',
         discardMessage: 'You’re about to leave this page without saving your changes, are you sure you want to continue?',
         initiatePayment: {
            applicationDuration: 'This application should take less than 10 minutes.',
            interestDate: 'Interest is charged on the outstanding loan balance and payable on the 1st of every month.',
            inspectProperty: 'A property assessor will call you to inspect the property.',
            maximumPayment: 'A maximum of four payments can be made from this loan.',
            certificates: 'You\'ll need electrical and occupancy certificates on the final payment.'
         },
         paymentType: {
            descriptionLine1: 'Once you’ve submitted your request, please email your electrical and occupancy certificates for processing.',
            descriptionLine2: 'Email details will be provided at the end of this request.'
         },
         paymentDetail: {
            tooltipMessage: `If you choose ‘maximun amount’ we will give you the maximum amount available
                    based on our updated property assessment. All payments will be subject to an updated property assessment.`,
            errorMessages: {
               enterAmount: '*Please enter an amount.',
               amountExceed: '*Amount exceeds the remaining Loan amount',
               enterRecipientName: '*Please enter a recipient name.',
               selectBank: '*Please select a bank.',
               selectAccountType: '*Please select an account type.',
               enterAccountNumber: '*Please enter an account number.',
               selectAmountType: '*Please select maximum or specific amount.'
            }
         },
         contactPerson: {
            enterName: '*Please enter a name and surname.',
            enterContactNumber: '*Please enter a contact number.',
            enterContactEmail: '*Please enter an email address.',
            enterValidContactNumber: '*Please enter a valid contact number.'
         },
         donePage: {
            weContactYou: 'We\'ll contact you',
            weContactProcessed: 'We\'ll contact you once your request has been processed.',
            subjectLine1: 'The subject line must read: ',
            subjectLine2: 'Building loan account no ',
            subjectLine3: ' electrical and occupancy certificates.',
            trackRequest: 'To track the status of your payment request, please call the Building Loans Team on',
            youHaveCompleted: 'You’ve completed the online application.',
            needDocuments: 'We’ve received your payment request, but still need your documents.',
            receivedPayment: 'We’ve received your payment request and will contact you once it’s processed.',
            completedApplication: 'You’ve completed the online application.'
         }
      },
      debitOrders: {
         noDebitOrders: 'No available debit orders',
         noDebitOrdersDescription: 'There are no debit orders linked to this specific account',
         cancelStopOrder: {
            cancelStopDisclaimer: `I acknowledge that the debit order will automatically be reinstated
          upon me cancelling the stop payment instruction`,
            cancelStopSuccessDisclaimer: 'The debit order will not be displayed as one of your monthly debit orders',
            cancelStopSuccessful: 'Debit order stop cancelled'
         },
         stopDebitOrder: {
            title: `Your instruction to the bank in terms of this request to stop payment on
            your debit order shall be valid for a period of three (3) months only`,
            disclaimer: ['Any debit order presented to the bank after this period of three (3) months has lapsed will be paid by the bank',
               `Under no circumstances shall you have the right to hold the bank liable to any debit order payment made to the bank after
               the period of three months has lapsed`,
               'It is your obligation to cancel your debit order instruction with the beneficiary.'],
            stopDebitOrderSuccessDisclaimer: `Your stop has been captured.
         A consultant will be in contact with you soon.`,
            stopDebitOrderSuccessful: 'Debit order stopped successfully.'
         },
         reverseDebitOrder: {
            title: 'When reversing a debit order, make sure that you:',
            disclaimer: ['are reversing the debit order for a valid reason',
               'supply true and correct information',
               'advise the recipient of your reversal',
               'know that lodging a reverse may give you a bad credit rating',
               'complete a stop payment request; and',
               'know that you won’t have a claim against Nedbank in this respect.'],
            reverseDebitOrderSuccessDisclaimer: 'The debit order will not be displayed as one of your monthly debit orders',
            reverseDebitOrderSuccessful: 'Debit order reversed successfully.',
         },
         requiredField: 'This field is required.'
      },
      reportFraud: {
         emailRequired: 'Invalid email address',
         invalidDetail: 'Special characters are not allowed',
         successMsg: `You've successfully reported your fraud incident. We’ll send you an email with your reference number shortly.`,
         attemptMsg: `If you'd like to report another fraud incident, please wait {0}
          {1} or contact 0800 110 929 to report your fraud.`,
      },
      feedback: {
         cellphoneRequired: 'Cellphone number is required.',
         incorrectCellPhoneNumber: 'Incorrect cellphone number.',
         successMessageFeedback: 'Thank you, for your feedback.',
         successMessageCallback: 'Success! Your callback request has been sent. A consultant will get back to you within 24 hours.',
         failureMessage: 'Your feedback couldn\'t be sent. Looks like someting\'s wrong on our side.',
         failureCallback: 'Your callback couldn\'t be sent. Looks like something\'s wrong on our side.',
      },
      statementAndDocument: {
         documents: {
            emailRequired: 'Invalid email address',
            plSuccess: 'Your paid-up letter has been requested and will be emailed to you within 72 hours.',
            plError: 'Your request for a paid-up letter could unfortunately not be processed',
            hlSuccess: 'Your {0} have been requested and will be emailed to you within 1 business day.',
            hlError: 'Your request for a {0} could unfortunately not be processed',
            mfcSuccess: 'Your {0} have been requested and will be emailed to you within 24 business hours.',
            mfcError: 'Your request for a {0} could unfortunately not be processed.'
         },
         statement: {
            emailRequired: 'Invalid email address',
            toDateError: `'To' date can't be later than current date`,
            fromDateError: `'From' date can't be later than 'To' date.`,
            hlStatementSuccess: 'Your statement have been requested and will be emailed to you within 1 business day.',
            plStatementSuccess: 'Your statement has been requested and will be emailed to you within 72 hours.',
            mfcStatementSuccess: 'Your copy of statement has been requested and will be emailed to you within 24 business hours.',
            plHlStatementError: 'Your request for statement could unfortunately not be processed.'
         }
      },
      loanDebitOrder: {
         invalidInstalmentAmount: 'Please note that you cannot enter an instalment amount less than the minimum instalment',
         mfcSuccessMsg: `Your request to change certain details on this debit order has been submitted,
         we\'ll let you know when the changes have been made.`,
         mfcFailureMsg: 'Technical error has occured',
         enterAmount: 'Please enter an amount.',
         enterAccountNumber: 'Please enter a account number.',
         selectAccountType: 'Please select an account type.',
         isThisYourBankAccount: 'Is this your bank account?',
         bankAccountDisclaimer: `Please note : If this is not your bank account details
          we will need you to provide us with relevant documents`,
         authoriseDisclaimer: `You authorise Nedbank to make the changes you\'ve asked for.`,
         acceptThe: 'You accept the',
         termsAndCondition: 'terms and conditions',
         pleaseEmailDocs: 'Please email supporting documents',
         docsDisclaimer: `We have noticed you have added a 3rd party’s banking details.
          Please email your affidavit letter of consent to `,
         closedLoan: 'This loan is closed',
         noPaymentDetails: 'There are no payment details for this loan.',
         infoMessage: `Please note: You\'ll see multiple debit orders listed where additional monthly payments are loaded on your account.`
      },
      transactionSearch: {
         numericError: 'Only numeric values are allowed',
         fromError: '{0}from should be less than {0}up to',
         toError: '{0}up to should be greater than {0}from',
         blankToAmtError: 'Please enter {0}up to',
         noMatchingLine1: 'No transactions match your search criteria,',
         noMatchingLine2: 'please refine your search and try again.',
         errorMessageLine1: 'Transactions failed to load',
         errorMessageLine2: 'Something is wrong on our side'
      },
      noticeWithdrawal: {
         note: 'Please note',
         approveMsg: 'You\'ll need to accept an Approve-it™ message on your cellphone to authorise the withdrawal.',
         deviceReady: 'Please have your cellphone ready.',
         instruction: 'We need 2 business days to process payments to ',
         almostDone: 'You’re almost done!',
         checkInfo: 'Please check the information you\'re about to submit.',
         instructionMessage: 'business day to carry out instructions on',
         viewNoticeErrorMsg: 'There is no notice available for this account.',
         weNeed: 'We need',
         recipient: 'It may take up to 2 business days to process payments to recipients.',
         thankyou: 'Thank you!',
         receivedMsg: 'We\'ve received your notice of withdrawal.',
         business: 'business days for your money to be paid out.',
         oneBusinessDay: 'business day to process your payment.',
         moneyMsg: 'It may take up to ',
         recipientNote: 'Every month you can make one free payment to a recipient.\
        If you’d like to make more payments to a recipient, it’ll cost you R25.00, \
        which will be deducted from the amount that you’re withdrawing.',
         nonFica: 'You’re currently not FICA compliant',
         visitFica: 'Please visit a branch with your ID and proof of residence, or call 0860 555 111 for help.',
      },
   };
   public static routeUrls = {
      payLanding: '/payment',
      paymentStatus: '/payment/status',
      transferLanding: '/transfer',
      transferStatus: '/transfer/status',
      dashboard: '/dashboard',
      buy: '/buy',
      buyStatus: '/buy/status',
      buyElectricity: '/buyElectricity',
      buyElectricityStatus: '/buyElectricity/status',
      gameLanding: '/game',
      gameStatus: '/game/status',
      unitTrusts: '/unitTrusts',
      unitTrustsStatus: '/unitTrusts/status',
      chargesAndFees: '/chargesAndFees',
      chargesAndFeesStatus: '/chargesAndFees/status',
      locateBranch: '/dashboard/account/upliftdormancy/branchlocator',
      overdraftView: '/dashboard/account/overdraft/limit-view/',
      accountDetail: '/dashboard/account/detail/',
      recipient: '/recipient',
      recipientPaymentStatus: '/recipient/payment/status',
      settlement: {
         directPay: '/dashboard/account/settlement/direct-pay/',
         requestQuote: '/dashboard/account/settlement/request-quote/{0}',
      },
      gameHistory: '/game/lotto/history',
      transfer: '/transfer',
      payout: '/payout/',
      payoutDone: '/payout/done/',
      stopPayment: '/stoppayments',
      accountViewMoreDetail: '/dashboard/account/detail/{0}/view-more',
      fundTripStatus: '/fundtrip/status',
      statementDocument: '/dashboard/account/statement-document/',
      crossBorder: '/dashboard/account/statement-document/cross-border/',
      cards: '/cards',
      overseasTravelNotificationSuccess: '/overseastravel/success/',
      requestCreditLimitIncrease: 'dashboard/account/credit/limit/',
      manageLoan: '/manageloan/',
      placeNotice: '/manageloan/placenotice/',
      cancelLoan: '/manageloan/cancelloan/',
      openNewAccount: '/open-account',
      offers: '/offers/'
   };
   public static metadataKeys = {
      transaction: 'TRANSACTION',
      success: 'SUCCESS',
      beneficiarySaved: 'BENEFICIARYSAVED',
      secureTransaction: 'SECURETRANSACTION',
      pending: 'PENDING',
      failure: 'FAILURE',
      emailSent: 'POA',
      settlementQuote: 'Settlement Quote',
      disputeDebitOrder: 'DisputeDebitOrder',
      stopDebitOrder: 'AddStopPayments',
      cancelStopOrder: 'DeleteStoppedPayments',
      feedback: 'FEEDBACK',
      upadteMfcPaymentDetails: 'ArrangementChg',
      debitOrderEnquiry: 'DebitOrderEnquiry',
      dealInfoEnq: 'DealInfoEnq',
      statementPrefrencesDelivery: 'Maintain Statement Preferences Delivery',
      crossBorderLetter: 'mfccrossborderletter',
      loanProductsManagement: 'LoanProductsManagement'
   };

   public static formats = {
      date: 'yyyy/MM/dd',
      DDMMYYYY: 'DD/MM/YYYY',
      ddMMYYYY: 'dd/MM/yyyy',
      ddmmyyyy: 'DD-MM-YYYY',
      yyyyMMdd: 'yyyy-MM-dd',
      apiDateFormat: 'yyyy-MM-dd',
      hhmm: 'hh:mm',
      HHmm: 'HH:mm',
      fullDate: 'dddd, DD MMMM YYYY',
      monthFormat: 'MMMM YYYY',
      yyyyMMddhhmmssA: 'yyyy-MM-dd hh:mm:ss A',
      YYYYMMDDhhmmssA: 'YYYY-MM-DD hh:mm:ss A',
      yyyyMMddTHHmmssZ: 'yyyy-MM-ddTHH:mm:ss.000',
      YYYYMMDDTHHmmssZ: 'YYYY-MM-DDTHH:mm:ss.000',
      momentYYYYMMDD: 'YYYY-MM-DD',
      momentDDMMMYYYY: 'DD MMM YYYY',
      YYYYMMDDNoDash: 'YYYYMMDD',
      ddMMMMyyyy: 'dd MMMM yyyy',
      ddMMMyyyy: 'dd MMM yyyy',
      ddmmyyyywithdash: 'dd-MM-yyyy',
      fullDateChat: 'dd MMMM yyyy, EEEE',
      momentDDMMMMYYYY: 'DD MMMM YYYY'
   };

   public static links = {
      termsAndConditions: '../../../assets/pdf/TermsAndConditions.pdf',
      termsAndConditionsProfile:
         'https://www.nedbank.co.za/content/dam/nedbank/Forms/Terms%20and%20Conditions/' +
         'Personal/Self%20Service/TERMS_AND_CONDITIONS_OF_USE_OF_Self_Service_Banking.pdf',
      termsAndConditionsNedId:
         'https://www.nedbank.co.za/content/dam/nedbank/site-assets/Terms/NedbankID_TC.pdf',
      termsAndConditionsPage: 'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/aboutus/legal/terms-conditions.html',
      nedBankEmptyStatePage: 'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/personal.html',
      crossBorderPaymentTnC: 'https://www.nedbank.co.za/content/dam/nedbank/Forms/Terms%20and%20Conditions/Other/EcobankCrossBorderTC.pdf',
      nedBankHomeLink: 'https://nedbank.co.za',
      lottoTermsAndConditions:
         'https://www.nedbank.co.za/content/dam/nedbank/site-assets/Terms/Final_' +
         'Amended%20Lotto%20Terms%20and%20Conditions%20Ned%20co.za%2021%20May%202018%20NR%2027963.pdf',
      ElectricityTermsAndConditions:
         'https://www.nedbank.co.za/content/dam/nedbank/site-assets/Terms/prepaid-electricity.pdf'
   };

   public static httpErrorCodes = {
      unauthorized: 401,
      forbidden: 403,
      internalServerError: 500
   };

   public static defaultValues = {
      minDate: '0001-01-01',
      minDateTime: '0001-01-01 12:00:00 AM'
   };

   public static fileNames = {
      termsAndConditions: 'TermsAndConditions.pdf',
      taxCertificate: 'TaxCertificate'
   };

   public static mimeTypes = {
      applicationPDF: 'application/pdf',
      applicationXML: 'application/xml',
      applicationXHTMLXML: 'application/xhtml+xml',
      textPLAIN: 'text/plain',
      textHTML: 'text/html',
      textCSS: 'text/css'
   };

   public static responseTypes = {
      json: 'json',
      blob: 'blob'
   };

   public static statusDescriptions = {
      successful: 'Successful',
      OK: 'OK',
      unSuccessful: 'Unsuccessful',
      failed: 'Failed'
   };

   public static profile = {
      OK: 'OK',
      PreferredName: 'PreferredName',
      DefaultAccount: 'DefaultAccount'
   };

   public static amountPipeSettings = {
      amountWithLabelAndSign: {
         isLabel: true,
         showSign: true
      },
      amountWithLabelAndSignRewards: {
         isLabel: false,
         showSign: true,
         noDecimal: true,
         hidePrefix: false,
         isSpaceRequire: true
      },
      amountWithLabel: {
         isLabel: true,
         showSign: false
      },
      amountWithPrefix: {
         hidePrefix: false,
         isLabel: true,
         showSign: false,
         noDecimal: false
      },
      amountWithNoDecimal: {
         noDecimal: true
      }
   };

   public static uiBreakPoints = {
      lg: 1440,
      md: 1024,
      sm: 768,
      xs: 375
   };

   public static notificationTypes = {
      email: 'Email',
      SMS: 'SMS',
      none: 'None',
      Fax: 'Fax'
   };

   public static residentialStatus = {
      resident: 'resident',
      nonresident: 'nonresident'
   };

   public static paymentReasonTypes = {
      other: { name: 'Other', code: 'Other' },
      gift: { name: 'Gift', code: '401' },
      migrantWorker: { name: 'Migrant Worker', code: '416' },
      foreignNational: { name: 'Foreign National', code: '417' }
   };

   public static days = {
      allDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      saturday: 'Saturday',
      sunday: 'Sunday'
   };

   public static instantPay = {
      saturdayEndHour: 14, // 3:00 PM
      weekDayStartHour: 4, // 5:00 AM
      weekDayEndHour: 18 // 7:00 PM
   };

   public static rechargeTypesAccepted = {
      'Cell C': ['Airtime', 'Data', 'SMS', 'All in One', 'Daily Bundle'],
      'MTN': ['Airtime', 'Data', 'SMS', 'Daily Bundle'],
      'Telkom Prepaidfone': ['Airtime'],
      'Telkom Mobile': ['Airtime', 'Data', 'FreeMe DATA'],
      'Vodacom': ['Airtime', 'Data', 'SMS', 'Big Bonus Voucher', 'BIS', 'Power DATA', 'WI-FI Data', 'Power Voice'],
      'Virgin': ['Airtime']
   };
   public static changeDisplayBundel = { 'Data': 'Data', 'SMS': 'SMS' };
   public static allMonths = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

   public static SchedulePaymentType = {
      transfer: {
         name: 'Transfer',
         icon: 'transfer-icon',
         heading: 'Transfer'
      },
      payment: {
         name: 'Payment',
         icon: 'pay-icon',
         heading: 'Pay'
      },
      prepaid: {
         name: 'Mobile',
         icon: 'buy-icon',
         heading: 'Recharge'
      }
   };
   public static buyElectricityVariableValues = {
      amountMinValue: 10,
      amountMaxValue: 3000
   };

   public static payMinimumVariableValues = {
      amountMinValue: 1
   };

   public static payPrepaidVariableValues = {
      amountMinValue: 5,
      amountMaxValue: 1000
   };

   public static prepaidRechargeType = {
      airtime: 'Airtime'
   };

   public static prepaidBundleType = {
      ownAmount: 'Own Amount'
   };

   public static editPaymentRecurrenceFrequency = {
      weekly: <ITransactionFrequency>{ text: 'Weekly', code: 'Weekly', maxValue: 52 },
      monthly: <ITransactionFrequency>{ text: 'Monthly', code: 'Monthly', maxValue: 12 }
   };
   public static environmentNames = {
      dev: 'dev',
      ete: 'ete',
      qa: 'qa',
      prod: 'prod',
      devPilot: 'devPilot',
      etePilot: 'etePilot',
      qaPilot: 'qaPilot',
      prodPilot: 'prodPilot',
      mock: 'mock'
   };

   public static viewSchedulePaymentLabels = {
      title: 'View scheduled payments',
      editSuccessMsg: 'Payment details have been saved successfully.',
      recipient: 'Recipient',
      bank: 'Bank',
      amount: 'Amount',
      transferDetail: 'Transfer Detail',
      transferTo: 'Transfer To',
      paymentDetails: 'Payment details',
      payFrom: 'Pay from',
      scheduledPayment: 'Scheduled payment',
      NrOfRepeats: 'No. of repeats',
      paymentDate: 'Next payment date',
      notifications: 'Notifications',
      yourRef: 'Your ref',
      theirRef: 'Their ref',
      transactionNr: 'Transaction no',
      payDate: 'Pay date',
      deleteBtnText: 'Delete scheduled payment',
      transfer: 'Transfer',
      paymentFailedMsg: 'Payment delete unsuccessful.',
      paymentRetryfailedMsg: 'Payment delete unsuccessful. Please try again later.'
   };

   public static mapVariables = {
      defaultGeoCoords: {
         latitude: -26.102160,
         longitude: 28.059132
      },
      defaultRadiusInkm: 2,
      defaultZoomLevel: 16
   };
   public static MandateOrders = {
      AcceptanceCode: 'AAUT',
      RejectionCode: 'NAUT'
   };

   public static Recipient = {
      errorMessage: 'Apologies! Your recipient details couldn’t be saved.',
      successMessage: 'Success! Your recipient details have been saved.',
      deleteErrorMessage: 'So sorry! The recipient couldn’t be deleted.',
      deleteSuccessMessage: 'Success! The recipient has been deleted.',
      limitExceededErrorCode: 'R13',
      status: {
         deleteSuccess: -1,
         reset: Math.random(),
         cancel: -2,
         error: -3
      },
      bankApprovedAccountType: 'BDF',
      saveButtonText: 'Save',
      saveAsRecipientText: 'Save to my recipients',
      addFlag: 'add',
      paymentNotificationMsg: 'You’ve already paid this recipient the same amount within the past 24 hours.',
      contactCardDetails: 'contactCardDetails',
      bankDefinedBeneficiary: 'bankDefinedBeneficiary'
   };

   public static renameAccountMsg = {
      error: 'Your account could not be renamed at this time.',
      success: 'Your account has been renamed successfully.'
   };

   public static BeneficiaryType = {
      Prepaid: 'PPD',
      Electricity: 'PEL',
      Account: 'ACC',
      Email: 'Email',
      Sms: 'Sms',
      Fax: 'Fax',
      CreditCard: 'CC',
      External: 'BNFEXT',
      Internal: 'BNFINT'
   };
   public static decimalPipeSettings = {
      numberPrecisionFormat: '1.2-2'
   };

   public static recurrenceFrequency = {
      weekly: 'Weekly',
      monthly: 'Monthly'
   };

   public static chartFontFamily = {
      markpro: 'MarkPro, Century Gothic, Helvetica, Arial, Any Sans Serif font',
      markproMedium: 'MarkProMedium, Century Gothic, Helvetica, Arial, Any Sans Serif font'
   };
   public static CardTypes = {
      CreditCard: 'C',
      DebitCard: 'D'
   };

   public static accountTypeCssClasses = {
      current: 'current',
      savings: 'savings',
      clubAccount: 'club-accounts',
      creditCard: 'credit-card',
      loan: 'loan',
      investment: 'investment',
      foreign: 'foreign',
      rewards: 'rewards',
      travelCard: 'travel-card',
      other: 'default'
   };

   public static accountTypesForEvents = {
      current: 'Current?',
      savings: 'Savings?',
      creditCard: 'Credit?'
   };

   public static browserBack = ['transfer', 'payment', 'buy', 'buyElectricity', 'game'];
   public static noAutoFocusDevice = ['ipad', 'iphone'];

   public static path = {
      recipientSchedulePayments: '/recipient/scheduled/{0}/{1}',
      recipientEditSchedulePayments: '/recipient/scheduled/{0}/{1}/edit',
      schedulePayment: '/dashboard/account/scheduled/{0}',
      recipient: '/recipient',
      winningNumbersList: '/game/lotto/history',
      winningNumbersDetail: '/game/winning/numbers'
   };
   public static transactionDetailsLabels = {
      transactionTypeConstants: {
         EFTPay: 'Payment (EFT)',
         EFTTran: 'Transfer (EFT)',
         EFTDepo: 'Deposit(EFT)',
         STO: 'Payment (Stop Order)',
         DOI: 'Payment (Debit Order)',
         PPP: 'Purchase (Pre-Paid)',
         PPE: 'Purchase (Pre-Paid Electricity)',
         LOT: 'PURCHASE (LOTTO)',
         IMA: 'Transfer (iMali)',
         DOE: 'Payment (Debit Order)',
         TC: 'Travel Card(TC)'
      },
      gameTypeTitles: {
         lotto: 'Lotto',
         lot: 'LOT',
         powerball: 'Powerball'
      },
      transactionDetailTemplates: {
         stopOrderEftDebitOrderInternal: 'stopOrderEftDebitOrderInternal',
         iMali: 'iMaliTemplate',
         lotto: 'lottoTemplate',
         electricity: 'prepaidElectricityTemplate',
         airtime: 'prepaidAirtimeTemplate',
         travelCard: 'travelCardTemplate'
      },
      fieldLabels: {
         description: 'Description',
         accNumber: 'Account number',
         dateLabel: 'Date',
         transDate: 'Transaction date',
         amount: 'Amount',
         points: 'Points',
         transType: 'Transaction type',
         refNumber: 'Reference number',
         recpAccNumber: 'Recipient\'s account number',
         recpBankName: 'Recipient\'s bank name',
         recpTransDescp: 'Recipient\'s transaction description',
         cellphoneNumber: 'Cellphone number',
         gameType: 'Game type',
         prepaidType: 'Prepaid type',
         meterNumber: 'Meter number',
         serviceProvider: 'Service provider',
         transAmount: 'Transaction amount',
         invNumber: 'Investor number',
         valueDate: 'Value date',
         totalUnits: 'Total units',
         pricePerUnit: 'Price per unit',
         currentBalance: 'Current balance',
         processDate: 'Process date',
         fromAccount: 'From account',
         transactionFee: 'Transaction fee',
         country: 'Country',
         cardNumber: 'Card number'
      }
   };

   public static truncateDescCharLimit = {
      charLimit: 25,
      truncateLimit: 22
   };

   public static ballBorderColor = {
      ballRedBorder: 'ball-border-red',
      ballYellowBorder: 'ball-border-yellow',
      ballGreenBorder: 'ball-border-green',
      ballBlueBorder: 'ball-border-blue',
   };
   public static divisionCorrectBalls = {
      divisionOne: 'Six correct balls',
      divisionTwo: 'Five correct balls + bonus ball',
      divisionThree: 'Five correct balls',
      divisionFour: 'Four correct balls + bonus ball',
      divisionFive: 'Four correct balls',
      divisionSix: 'Three correct balls + bonus ball',
      divisionSeven: 'Three correct balls',
      divisionEight: 'Two correct balls + bonus ball'
   };

   public static divisionCorrectBallsPwb = {
      divisionOne: 'Five correct balls + PowerBall',
      divisionTwo: 'Five correct balls',
      divisionThree: 'Four correct balls + PowerBall',
      divisionFour: 'Four correct balls',
      divisionFive: 'Three correct balls + PowerBall',
      divisionSix: 'Three correct balls',
      divisionSeven: 'Two correct balls + PowerBall',
      divisionEight: ' One correct balls + PowerBall',
      divisionNine: 'Match PowerBall'
   };

   public static lottoConst = {
      lottoType: 'LOT',
      pwbType: 'PWB',
      ownType: 'OWN',
      qpkType: 'QPK',
      emptyString: '',
      spaceString: ' ',
      lottoPlus1: 'LOTTO PLUS 1 ticket',
      lottoPlus2: 'LOTTO PLUS 2 ticket',
      pwbTicket: 'PowerBall ticket',
      pwbPlus: 'PowerBall PLUS ticket',
      lottoTicket: 'LOTTO ticket',
      prevTicketMsg: 'Loading previous tickets',
      lottoLable: 'LOTTO',
      pwbLable: 'PowerBall',
      pwbNumber: 842,
      isLottoPlus: 'isLottoPlus',
      isLottoPlusTwo: 'isLottoPlus2',
      threeRecords: 3,
      nineRecords: 9,
      board1PowerBallClass: 'powerball-board-1',
      board2PowerBallClass: 'powerball-board-2',
      lottoGroup: 'group',
      playingText: 'Playing ',
      trueText: 'true',
      quickPick: 'a',
      pickNumbers: 'p',
      nextDrawIs: 'The next draw is ',
      buyLottoTicket: 'Buy LOTTO ticket',
      viewWinningNumbers: 'View winning numbers',
      ticketPurchases: 'LOTTO tickets',
      dateLabel: 'Date',
      descriptionLabel: 'Description',
      amountLabel: 'Amount',
      viewMoreTicketsLabel: 'View more tickets ',
      viewMoreTicketsHistoryLabel: 'VIEW MORE TICKETS',
      nedAccountLabel: 'Nedbank ',
      forLabel: ' for ',
      boardsLabel: ' boards',
      drawLabelWithS: ' draws',
      drawLabel: ' draw',
      startLabel: 'starting at ',
      onLabel: ' on ',
      purchaseLabel: ' purchase '
   };

   public static lottoErrorCode = {
      errorUnderEighteen: 412
   };

   public static lottoParams = {
      isLottoPlus: 'isLottoPlus',
      isLottoPlusTwo: 'isLottoPlusTwo',
      boardsPlayed: 'boardsPlayed',
      drawsPlayed: 'drawsPlayed',
      drawNumber: 'drawNumber',
      totalCost: 'totalCost',
      fromAccount: 'fromAccountReplay',
      isValid: 'isValid',
      game: 'game',
      drawDate: 'drawDate',
      accountNumberFromDashboard: 'fromAccountReplay',
      method: 'gameType',
      isReplay: 'isReplay',
      code: 'game',
      boardDetails: 'boardDetails',
      isViewMore: 'isViewMore'
   };

   public static keyCode = {
      delete: 46
   };

   public static GADimensionMap = {
      dimension1: 'event_value'
   };

   public static GAEventList = {
      crash: { category: 'Crash', label: 'Crash' },
      selectAtm: { category: 'select_atm_or_branch_google_map', label: 'ATM Location' },
      searchAtm: { category: 'search_atm_location_google_map', label: 'Find ATM or Branch' },
      searchBranch: { category: 'search_branch_location_google_map', label: 'Branch Location' },
      settlement: {
         MFC: {
            settlementQuote: { action: 'click_on_settlement_quote', label: 'Get settlement quote', category: 'Settlement - MFC' },
            settleLoan: { action: 'click_on_settle_loan', label: 'Settle loan', category: 'Settlement - MFC' },
            payNow: { action: 'click_on_pay_now', label: 'Pay now', category: 'Settlement - MFC' },
            paymentReview: { action: 'click_on_back_from_payment_review_page', label: 'Payment review page', category: 'Settlement - MFC' },
            selectRecipient: {
               action: 'click_on_back_from_payment_select_recipient_name', label: 'Payment Recipient selection page',
               category: 'Settlement - MFC'
            },
            sentEmailQuote: { action: 'success_email_quote_sent', label: 'Email quote sent', category: 'Settlement - MFC' },
         }
      },
      reportFraud: {
         event: {
            tapSelected: 'report_suspicious_tab_selected',
            toggleOn: 'report_suspicious_toggle_on',
            accountSelected: 'report_suspicious_account_selected',
            amount: 'report_suspicious_amount_added',
            thirdPartyAccount: 'report_suspicious_third_party_account_selected',
            thirdPartyBank: 'report_suspicious_third_party_bank_selected',
            reportSubmitted: 'report_suspicious_report_as_fraud_attempted'
         },
         label: {
            tapSelected: 'Report suspicious selected',
            toggleOn: 'Third party details',
            accountSelected: 'Accont selected',
            amount: 'Amount enter',
            thirdPartyAccount: 'Third party account number',
            thirdPartyBank: 'Third party bank name',
            reportSubmitted: 'Report submited'
         }
      },
      category: {
         reportFraud: 'Report Suspicious'
      },
      click: {
         requestPayOut: 'click_request_pay_out'
      },
      myPocket: 'poc',
      clubAccount: 'club'
   };
   public static Statuses = {
      Yes: 'YES',
      No: 'NO'
   };
   public static forex = {
      foreign: 'Foreign',
      dollar: '&#x24;',
      euro: '&#x20ac;',
      pound: '&#xa3;'
   };

   public static cardGaflow = {
      changeAtmLimit: { page: 'change-atm-limit' },
      changeAtmLimitStatus: { page: 'change-atm-limit-status' },
      blockCard: { page: 'block-card' },
      blockCardStatus: { page: 'block-card-status' },
      replaceCard: { page: 'replace-card' },
      replaceCardBranchLocator: { page: 'replace-card-branch-locator' },
      replaceCardStatus: { page: 'replace-card-status' }
   };

   public static balanceDetailTemplate = {
      currentAcOverdraft: {
         templateDetails: ['movementsDue', 'unclearedEffects', 'accruedFees', 'pledgedAmount', 'crInterestDue', 'dbInterestDue'],
         propertyLabels: [{ prop: 'crInterestDue', append: 'crInterestRate' }, { prop: 'dbInterestDue', append: 'dbInterestRate' }]
      },
      currentAcNonOverdraft: {
         templateDetails: ['movementsDue', 'unclearedEffects', 'accruedFees', 'pledgedAmount', 'crInterestDue'],
         propertyLabels: [{ prop: 'crInterestDue', append: 'crInterestRate' }]
      },
      savingsAc: {
         templateDetails: ['movementsDue', 'unclearedEffects', 'accruedFees', 'pledgedAmount', 'crInterestDue'],
         propertyLabels: [{ prop: 'crInterestDue', append: 'crInterestRate' }]
      },
      clubAccount: {
         templateDetails: ['crInterestDue', 'movementsDue'],
         propertyLabels: [{ prop: 'crInterestDue', append: 'crInterestRate' }]
      },
      investmentFixedDs: {
         templateDetails: ['totalInterestPaid', 'reservedForRelease', 'accruedInterest', 'dateOfOpening', 'interestRate',
            'payOutDate', 'interestFrequency', 'investmentTerm', 'termRemaining', 'availableWithdrawal', 'bonusPercentage'],
         filterToBeApplied: {
            date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate', 'bonusPercentage'],
            noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
         }
      },
      investmentLinkedDs: {
         templateDetails: ['dateOfOpening', 'payOutDate', 'interestRate', 'interestFrequency', 'investmentTerm', 'termRemaining',
            'reservedForRelease', 'totalInterestPaid', 'additionalDeposit', 'availableWithdrawal'],
         filterToBeApplied: {
            date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate'],
            noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
         }
      },
      investmentNoticeDs: {
         templateDetails: ['dateOfOpening', 'interestRate', 'payOutDate', 'totalInterestPaid', 'reservedForRelease'],
         filterToBeApplied: { date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate'] }
      },
      investmentCallDf: {
         templateDetails: ['interestRate', 'interestFrequency', 'interestPaymentDate', 'dateOfOpening', 'accruedInterest',
            'totalInterestPaid', 'initialDeposit'],
         filterToBeApplied: { date: ['interestPaymentDate', 'dateOfOpening'], rate: ['interestRate'], noFilter: ['interestFrequency'] }
      },
      investmentNoticeDf: {
         templateDetails: ['totalInterestPaid', 'reservedForRelease', 'accruedInterest', 'dateOfOpening', 'interestRate',
            'payOutDate'],
         filterToBeApplied: { date: ['dateOfOpening', 'payOutDate'], rate: ['interestRate'] }
      },
      investmentFixedDf: {
         templateDetails: ['totalInterestPaid', 'accruedInterest', 'dateOfOpening', 'interestRate', 'maturityDate', 'interestFrequency',
            'interestPaymentDate', 'investmentTerm', 'termRemaining', 'initialDeposit'],
         filterToBeApplied: {
            date: ['dateOfOpening', 'maturityDate', 'interestPaymentDate'], rate: ['interestRate'],
            noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
         }
      },
      investmentCfoDf: {
         templateDetails: ['totalInterestPaid', 'reservedForRelease', 'accruedInterest', 'dateOfOpening', 'interestRate', 'maturityDate',
            'interestFrequency', 'interestPaymentDate', 'investmentTerm', 'termRemaining', 'availableWithdrawal', 'initialDeposit'],
         filterToBeApplied: {
            date: ['dateOfOpening', 'maturityDate', 'interestPaymentDate'], rate: ['interestRate'],
            noFilter: ['interestFrequency', 'investmentTerm', 'termRemaining']
         }
      },
      investmentUnitTrust: {
         templateDetails: ['fundFolioNumber', 'quantity', 'availableUnits', 'unitPrice', 'cededAmount', 'unclearedAmount', 'percentage'],
         filterToBeApplied: {
            rate: ['percentage'], noFilter: ['fundFolioNumber', 'quantity', 'availableUnits',
               'cededAmount', 'unclearedAmount']
         }
      },
      foreignCurrencyAccount: {
         templateDetails: ['currency', 'interestReceivable', 'estimatedRandValue', 'exchangeRateBuy'],
         propertyLabels: [{ prop: 'interestReceivable', append: 'crInterestRate' },
         { prop: 'currency', append: 'currencyCode', applyOnValue: 'yes' }]
      },
      loan: {
         templateDetails: ['nextInstallmentAmount', 'loanAmount', 'interestRate', 'paymentTerm', 'termRemaining'],
         filterToBeApplied: {
            rate: ['interestRate'], noFilter: ['paymentTerm', 'termRemaining']
         }
      },
      mfcvafLoanAccount: {
         templateDetails: ['nextInstallmentAmount', 'termRemaining', 'loanAmount', 'interestRate', 'balloonAmount', 'paymentDueDate',
            'paymentTerm'],
         filterToBeApplied: {
            rate: ['interestRate'], noFilter: ['paymentTerm', 'termRemaining'], date: ['paymentDueDate']
         }
      },
      creditCard: {
         templateDetails: ['creditLimit', 'outstandingBalance', 'paymentDueDate', 'minimumPaymentDue', 'latestStatementDate',
            'latestStatementBalance', 'lastPaymentDate', 'lastPaymentAmount'],
         filterToBeApplied: {
            date: ['paymentDueDate', 'latestStatementDate', 'lastPaymentDate']
         }
      }
   };
   public static defaultCrossPlatformCurrency = {
      name: 'ZAR '
   };

   public static chatMessages = {
      chatHeading: 'Chat',
      hubName: 'chatHub',
      userName: 'Donald',
      emptyString: '',
      messageTypeFromAgent: 1,
      clientIdAgent: 5,
      agentNameHeading: 'Chatting to',
      agentInitialMessage: `Welcome to Nedbank Live Chat. Please wait for one of our friendly agents to assist you.`,
      submitLabel: 'Submit',
      startTime: 'Today at',
      todayLabel: 'Today',
      yesterdayLabel: 'Yesterday',
      nameLabel: 'Name',
      emailLabel: 'Email',
      dayLabel: 'days',
      lottiePath: 'assets/typing-effect.json',
      svgType: 'svg',
      statusPending: 'Pending',
      statusDelivered: 'Delivered',
      messageDiv: 'chatbot-message-content',
      detailsDiv: 'chatbot-details-content',
      rateChatSession: 'RateChatSession',
      platformWeb: 'web',
      initiationType: 'Client clicked on a button',
      startChatSession: 'StartChatSession',
      nedbankCustomerMessage: 'NedbankCustomerMessage2',
      customerIsTyping: 'CustomerIsTyping',
      requestChatHistory: 'RequestChatHistory',
      chatHistory: 'ChatHistory',
      requestNpsQuestions: 'RequestNpsQuestions',
      npsQuestions: 'NpsQuestions',
      messageFromNedbank: 'MessageFromNedbankContactCentre',
      ackFromNedbank: 'AckMessageFromNedbankContactCentre',
      chatQueuedFromNedbank: 'ChatQueuedToNedbankContactCentre',
      agentConnectedFromNedbank: 'NedbankContactCentreAgentConnected',
      agentDisconnectedFromNedbank: 'NedbankContactCentreAgentDisconnected',
      inactivityTimeout: 'InactivityTimeout',
      chatTransferred: 'ChatTransferred',
      failedToConnectChat: 'FailedToConnectChatSession',
      ackNedbankCustomerMessage: 'AckNedbankCustomerMessage',
      agentIsTyping: 'AgentIsTyping',
      endChatSession: 'EndChatSession',
      messageRegex: /["\\"]/g,
      questionHeader: 'Please take a moment to rate your experience',
      noThanks: 'No thanks',
      disableStatus: 'disabled',
      activeStatus: 'active',
      star: 'star',
      questionOne: '1 of 2',
      questionTwo: '2 of 2',
      termsAndCondition: `Terms & conditions`,
      agentFirstMessage: `To best assist you in the event of a connection failure,
      please provide us your name and cellphone number OR e-mail address
      to start a chat with a live agent`,
      agentLiveMessage: `Welcome to Nedbank Chat! Please give us your name and
      email address to start chatting with one of our team members.`,
      requiredField: 'This is a required field.',
      nameRequiredMesaage: 'Please enter your name.',
      emailRequiredMessage: 'Please enter your e-mail.',
      emailInvalidMessage: 'Please enter a valid e-mail address.',
      incorrectFormat: 'Incorrect Format',
      startChat: 'Type to start a chat.',
      TermsGeneralHtml: 'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/aboutus/legal/terms-conditions.html'
   };
   public static showHideAccountsMsg = {
      error: 'Cannot hide account. At least one account must remain visible.',
      success: 'Account visibility updated successfully',
      networkError: 'Visibility update unsuccessful.',
   };

   public static visibilityNotification = {
      success: 'SUCCESS',
      error: 'ERROR',
      networkError: 'NETWORK_ERROR'
   };
   public static unilateralRequest = {
      indicatorType: 'card',
      unilateralLimitIndicator: true,
      plasticId: '',
      UnilateralIndicatorToAll: true,
      secureTransaction: {
         message: '',
         transactionVerificationCode: 0,
         responseOptions: [
            {
               clientResponseOption: '',
               responseMessage: ''
            }
         ],
         fallBackMessage: '',
         verificationReferenceId: 0,
         status: 'APPROVED',
         customId: ''
      }
   };

   public static myPockets = {
      productType: 25
   };

   public static statusCode = {
      successCode: 'R00',
      errorCodeR11: 'R11',
      errorCodeR10: 'R10',
      errorCodeR02: 'R02',
      errorCodeR04: 'R04',
      errorCodeR03: 'R03',
      errorCodeR01: 'R01',
      errorCodeR05: 'R05'
   };

   public static accountRenameConst = {
      accountType: 'Rewards',
      preferredName: 'Preferred account name',
      maximumCharacter: 'Maximum of 21 characters.',
      validSpecialCharacter: 'No special characters. Valid characters include A-z, 0-9.',
      beAlphanumeric: 'Be alphanumeric (Aa-Zz or 0-9); and',
      noSpecialCharacter: 'Do not include special characters: @+-().',
      confirmBtn: 'Confirm',
      cancelBtn: 'Cancel'
   };

   public static fullScreenModalConfig = {
      class: 'modal-full-screen'
   };

   public static accountStatus = {
      open: 'Open'
   };

   public static countries = {
      za: {
         name: 'South Africe',
         code: 'za'
      }
   };

   public static MTNRechargeType = {
      MTN: 'MTN',
      MTNDailyBundle: 'Daily Bundle'
   };
   public static symbols = {
      colon: ':',
      percentage: '%',
      spaceString: ' ',
      hyphen: ' - ',
      hyphenWithoutSpace: '-',
      blankSpace: ''
   };
   public static overseasTravel = {
      steps: ['Select card/s', 'Select dates', 'Select countries', 'Contact details', 'Summary'],
      labels: {
         selectCardsHeading: `Please choose the cards you’d like to use overseas.`,
         activeCards: 'Active card/s',
         selectCards: 'Select card/s',
         selectDatesHeading: 'When are you travelling?',
         selectDate: 'Select Date',
         startDate: 'Select your start date',
         endDate: 'Select your end date',
         selectCountriesHeading: `Which countries will you be travelling to?`,
         selectCountries: 'Select from the list',
         chooseCountry: 'Choose country',
         addMoreCountries: 'Add more countries',
         selectedCountries: 'Selected countries',
         removeAll: 'Remove all',
         contactDetailsHeading: 'Enter your contact details',
         contactDetailsHeading1: 'What are your contact details?',
         primaryNumber: 'Primary cellphone number',
         secondaryNumber: 'Secondary cellphone number',
         emailAddress: 'Email address',
         contactNumber: 'Contact number while overseas',
         mandatory: 'Mandatory',
         optional: 'Optional',
         emergencyContactOptional: 'Emergency contact details (optional)',
         emergencyContact: 'Emergency contact details',
         emergencyContent: 'We’ll use these details to contact you if we think fraud is being committed on your card account(s).',
         overseaContactPerson: 'Overseas contact person',
         localContactPerson: 'Local contact person',
         foreignContactPersonName: 'Foreign contact person name',
         foreignContactPersonNumber: 'Foreign contact person number',
         localContactPersonName: 'Local contact person name',
         localContactPersonNumber: 'Local contact person number',
         cancel: 'Cancel',
         done: 'Done',
         summary: 'Summary',
         requestDetails: 'Your overseas travel request details',
         cards: 'Cards',
         edit: 'Edit',
         travelDates: 'Travel dates',
         destinationCountries: 'Destination countries ',
         countries: 'Countries',
         contactDetails: 'Contact details',
         from: 'From',
         to: 'To',
         personalDetails: 'Personal details',
         foreignContactPerson: 'Foreign contact person',
         youAreDone: 'You’re done',
         interested: 'You might also be interested in the following: ',
         travelCard: 'Travel card',
         travelInsurance: 'Travel insurance',
         travelCardInfo: 'You can apply for a travel card at your nearest forex branch.',
         travelInsuranceInfo: 'You can contact Bryte Insurance using the details below.',
         branchLocator: 'Branch locator',
         viewContacts: 'View contacts',
         nedBankCard: 'Nedbank Card: 0860 885 501',
         nedBankTravelEmail: 'nedbanktravel@brytesa.com',
         saaVoyagerCard: 'SAA Voyager Cards: 0860 885 502',
         saaTravelEmail: 'saatravel@brytesa.com',
         americanExpressCard: 'American Express Cards: 0860 885 503',
         amexTravelEmail: 'amextravelinsurance@brytesa.com',
         centurionCard: 'Centurion Cards: 0860 885 504',
         centurionCardEmail: 'centuriontravel@brytesa.com',
         southAfrica: 'SOUTH AFRICA',
         backspace: 'Backspace',
         nameFormatErrorMsg: 'Name should contain only letter or number',
         nameMinLengthErrorMsg: 'Please enter a valid name',
      },
      contactDetails: {
         contactNoMinlength: 10,
         contactNoMaxlength: 15,
         emailMaxlength: 75
      },
      dates: {
         count: 1,
         maxStartDate: 179,
         years: 'years',
         days: 'days',
      }
   };

   public static instantPayAllowedAccounts = ['CA', 'SA'];

   public static AriaMessages = {
      setDefaultAccountSucessMsg: 'Your default account has been set successfully.',
      setDefaultAccountErrorMsg: 'Your default account was not set.Please try again.',
      recipient: {
         accountNumber: 'Account number is required.',
         yourReference: 'Your reference number is required.',
         theirReference: 'Their reference number is required.',
         cellphone: 'Cellphone number is required.',
         meterNumber: 'Meter number is required.',
         creditCard: 'Credit card number is required.',
         saveButton: 'A recipient cannot be saved until all information has been captured'
      }
   };
   public static preApprovedOffers = {
      labels: {
         notification: 'Notifications',
         agentMobile: 'mobile',
         offerScreen: {
            HEADING: 'Your offer',
            SUB_HEADING: 'It looks like you qualify for:',
            LOAN_AMOUNT: 'Loan amount',
            LOAN_AMOUNT_INFO: `over {0} months at an interest rate of {1}%.`,
            ERROR_TEXT: 'Please enter a loan amount within the range we’ve offered you.',
            SLIDER_TITLE: 'Change your loan amount.',
            SLIDER_MIN: 'Min {0}',
            SLIDER_MAX: 'Max {0}',
            SELECT_TERM: 'Select your term (months)',
            SELECT_OPTION: 'Select an option',
            MONTHLY_REPAYMENT: 'Your monthly repayment will be',
            PLEASE_NOTE: 'Please note',
            NOTE_TEXT: 'You\'ve made some changes.',
            NOTE_SUBTEXT: 'Please recalculate your monthly repayment amount.'
         },
         reviewScreen: {
            HEADING: 'Review',
            SUB_HEADING: 'Please check the information you\'re about to submit.',
            NOTE: 'Note',
            LIFE_INSURANCE: 'Credit life insurance',
            LIFE_INSURANCE_TEXT: `If you take out a personal loan, you need credit life insurance to ensure that
                                        your loan is covered in the event of your death, disablement or retrenchment.
                                        Please call 0860 263 543 for more information.`,
            LIFE_INSURANCE_SUB_TEXT: `We’ve included <span><a href="{0}"
                                        target="_blank">Nedbank credit insurance</a>
                                        </span> in our offer.The cover is subject to<span>
                                        <a href="{1}" target="_blank">exclusions</a>
                                        </span>, which we’ll email to you.`,
            ACCEPT_CREDIT: 'Accept Nedbank credit insurance?',
            YES: 'Yes',
            NO: 'No',
            PLEASE_NOTE: 'Please note',
            TOOLTIP_TEXTLINE_ONE: 'If you choose to use your own insurance, this online application will end.',
            TOOLTIP_TEXTLINE_TWO: `We’ll have to call you to help you with your personal-loan
                         application. As a result the process may take longer.`,
            TOOLTIP_TEXTLINE_THREE: 'Would you like to continue, using your own insurance?'
         },
         disclosureScreen: {
            EMAIL: 'Email',
            PLEASE_NOTE: 'Please Note'
         },
         doneScreen: {
            HEADING: 'Success!',
            SUB_HEADING: 'Your loan has been approved.'
         },
         feedbackScreen: {
            HEADING: 'Care to give us feedback?',
            SUB_HEADING: 'Please tell us why you’re leaving.'
         },
         getStartedScreen: {
            HEADING: 'Let\'s get started'
         },
         informationScreen: {
            HEADING: 'Your Nedbank information',
            NOTE: 'Please Note'
         },
         wrongInformationScreen: {
            HEADING: 'Wrong information?'
         }
      },
      offerStatus: {
         OFFER_PRESENTED: 'Offer Presented',
         NOTIFICATION_READ: 'Notification Read',
         LOAN_OFFER_READ: 'Offer Read',
         CLIENT_DETAILS_ACCEPTED: 'Client Details Accepted',
         LOAN_OFFER_ACCEPTED: 'Loan Offer Accepted',
         CLIENT_OWN_INSURANCE: 'Client Has Own Insurance',
         LOAN_DETAILS_ACCEPTED: 'Loan Details Accepted',
         APPLICATION_COMPLETED: 'Application Completed',
         NEW_OFFER: null
      },
      ScreenIdentifiers: {
         DASHBOARD_SCREEN: 'dashboard_screen',
         NOTIFICATIONS_SCREEN: 'notification_screen',
         CLIENT_DETAILS_SCREEN: 'client_details_screen',
         LOAN_OFFER_SCREEN: 'loan_offer',
         REPAYMENT_REVIEW_SCREEN: 'repayment_review_screen',
         DISCLOSURES_SCREEN: 'disclosures_screen',
         DONE_SCREEN: 'done_screen',
         DROP_OFF_REASONS: 'reasons_screen',
         INFORMATION_INCORRECT_SCREEN: 'information_incorrect_screen',
         NOTIFICATIONS_MORE_SCREEN: 'notifications_more_screen',
         EDUCATIONAL_SCREEN: 'educational_screen'
      },
      DisclosureScreen: {
         DISCLOSURE: 'disclosures',
         DROPDOWN: 'dropdown',
         DISCLAMERS: 'disclaimers',
         LINK: 'link',
         TEXT: 'text',
         EMAIL: 'email',
         OPTION: 'option'
      },
      steps: ['Information', 'Offer', 'Review', 'Disclosures'],
   };
}

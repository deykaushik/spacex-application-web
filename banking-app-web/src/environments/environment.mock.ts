import * as data from './../assets/data.json';
import { Constants } from '../app/core/utils/constants';

export const environment = {
   envName: Constants.environmentNames.mock,
   production: true,
   nedbankApiUrl: 'https://dev-nedbankscp.nednet.co.za/ClientsTest/',
   logApiUrl: 'http://dvnpknmapiweb01:4321/',
   apiUrl: 'http://10.127.128.123:10010/api/services/v1/',
   signalRUrl: 'https://dcchat-e.nedsecure.co.za/signalr/hubs',
   downloadStatementUrl: 'https://q-ecs.nedbank.co.za/',
   cardImageUrl: 'https://q-nedmoncontent.nedbank.co.za/assets/png/card-images/',
   password: 'admin',
   logoutOnRefresh: false,
   rapportSetting: {
      popup: true,
      showcount: 4,
      popupdurationms: 60000
   },
   session: {
      idleTime: 300,
      timeOutWarning: 180,
      tokenExpiryMessageDisplayTime: 60
   },
   features: {
      dashboard: true,
      payment: true,
      transfer: true,
      buy: true,
      cards: true,
      instantPayment: true,
      settings: true,
      buyElectricity: true,
      branchlocator: true,
      game: true,
      feedback: true,
      pppEnrolment: true,
      forgotDetails: true,
      crossBorderPayment: true,
      lottoPallet: true,
      upliftDormancy: true,
      cardFreeze: true,
      accountsShowHideFeature: true,
      cardContactless: true,
      cardInternetPurchases: true,
      statementPreferences: true,
      rewardsFeature: true,
      greenbackEnrolment: true,
      redemption: true,
      chargesAndFeeToggle: true,
      balanceDetail: true,
      transactionDetail: true,
      accountRename: true,
      maintainOverdraft: true,
      accountShare: true,
      travelCardAccount: true,
      travelCardManagement: true,
      travelCardTrips: true,
      travelCardPriority: true,
      settlement: true,
      overseasTravelNotification: true,
      activateCreditCard: true,
      chat: true,
      garageCardInternetPurchase: true,
      requestBuildingLoanPayment: true,
      reportSuspicious: true,
      statementsDocuments: true,
      plHlStatementsDocument: true,
      stopDebitOrder: true,
      cancelStopOrder: true,
      settlementMfc: true,
      viewBanker: true,
      loanPaymentDetails: true,
      mfcPaymentDetails: true,
      mfcUpdatePaymentDetails: true,
      noticeOfWithdrawal: true,
      annualCreditReview: true,
      statementPreferencesMFC: true,
      transactionSearch: true,
      garageCardAtmLimits: true,
      settlementHl: true,
      automaticPaymentOrder: true,
      trusteer: true,
      requestCreditLimitIncrease: true,
      openNewAccount: true,
      manageLoan: true,
      it3bDocuments: true,
      statementsCASA: true,
      preApprovedOffers: true,
   },
   audience: 'https://newmoneyweb/',
   headers: [
      {
         'environment': 'mock',
         'token': {
            'Authorization': 'test',
            'X-IBM-Client-Id': '1234',
            'RoleName': 'test',
            'Content-Type': 'application/json'
         }
      }],
   googleMapApiKey: 'AIzaSyCn3nYFFV9US6jl6yT0Bqk70oAuj9WiwII',
   gaTrackingId: 'UA-109164958-1'
};
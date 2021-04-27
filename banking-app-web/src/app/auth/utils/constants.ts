import { IDropdownItem } from '../../core/utils/models';
import { AlertActionType, AlertMessageType } from '../../shared/enums';

export class AuthConstants {
   public static links = {
      entrustProfileLink:
      'https://www.entrust.net/customer/profile.cfm?domain=secured.nedbank.co.za',
      iTunesLink:
      'https://itunes.apple.com/us/app/nedbank-money/id1260981758?ls=1&mt=8',
      googlePlayLink:
      'https://play.google.com/store/apps/details?id=za.co.nedbank',
      helpLink:
      'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/supplimentary/MoneyWeb.html',
      moneyAppLink:
      'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/personal/nedbank-money.html'
   };

   public static images = {
      login:
      './assets/png/NedbankLogin.png',
      easy:
      './assets/svg/login-easy.svg',
      fast:
      './assets/svg/login-fast.svg',
      secure:
      './assets/svg/login-secure.svg'
   };

   public static constantValues = {
      maxNumberOfLoginTries: 3,
      contactCentreEmail: 'contactcentre@nedbank.co.za',
      contactCentrePhone: '0860 555 111'
   };

   public static messages = {
      technicalError: `So sorry! Looks like something's wrong on our side.`,
      invalidUser: 'Invalid user credentials.',
      requiredField: 'This is a required field.',
      incorrectFormat: 'Incorrect Format',
      usernameMandatory: 'Please enter your username',
      userNameValidationText:
      'At least 7 alphanumerical characters (A-Z, a-z, 0-9)',
      userNameHelpText: '',
      passwordMandatory: 'Please enter your password',
      passwordValidationText:
      'At least 8 alphanumerical characters (A-Z, a-z, 0-9)',
      passwordHelpText: '',
      lottoListError: 'LOTTO purchases, draw information and winning numbers are not available right now. Please come back later.',
      nextLottoPalletError: 'LOTTO purchases, draw information and winning numbers are not available right now. Please come back later.',
      noLottoTicketsFound: 'NO MORE TICKETS'
   };

   public static errorMessages = {
      systemError: {
         message: `So sorry! Looks like something's wrong on our side.`,
         alertType: AlertMessageType.Error,
         linkText: 'Try Again',
         alertAction: AlertActionType.TryAgain
      },
      loginInvalidDetails: {
         message: `Sorry, the details you have provided are incorrect. Please revise and try again.`,
         alertType: AlertMessageType.Error,
         linkText: '',
         alertAction: AlertActionType.None
      },
      loginDetailsDontMatch: {
         message: `Hmm, your username and password don’t match.`,
         alertType: AlertMessageType.Error,
         linkText: 'Forgot your details?',
         alertAction: AlertActionType.ForgotDetails
      },
      loginDetailsDontMatchRetry: {
         message: `Your username and password don't match. Please try again.`,
         alertType: AlertMessageType.Error,
         linkText: 'Forgot your details?',
         alertAction: AlertActionType.ForgotDetails
      },
      loginInvalidUsername: {
         message: `Sorry, we could not find you based on the details you have provided. Please revise your details and try again.`,
         alertType: AlertMessageType.Error,
         linkText: 'Forgot your details?',
         alertAction: AlertActionType.ForgotDetails
      },
      loginDetailsDontMatchResolve: {
         message: `Nedbank ID credentials have been locked out.`,
         alertType: AlertMessageType.Lock,
         linkText: 'Help',
         alertAction: AlertActionType.ForgotDetails
      },
      invalidDetails: {
         message: `Sorry, the details you have provided are incorrect. Please revise and try again.`,
         alertType: AlertMessageType.Error,
         linkText: '',
         alertAction: AlertActionType.None
      },
      duplicateIdentity: {
         message: `So sorry! Looks like something's wrong on our side.`,
         alertType: AlertMessageType.Error,
         linkText: '',
         alertAction: AlertActionType.None
      },
      invalidCustomerDetails: {
         message: `Your profile details are not complete and we are unable to verify your identity.
          Please update your details at the branch.`,
         alertType: AlertMessageType.Error,
         linkText: '',
         alertAction: AlertActionType.None
      },
      loginSuccess: {
         message: `You have successfully logged into online banking.`,
         alertType: AlertMessageType.Success,
         linkText: '',
         alertAction: AlertActionType.None
      }
   };

   public static secretTypes = {
      password: 'PWD'
   };

   public static staticNames = {
      loggedOnUser: 'loggedOnUser'
   };

   public static countryList = {
      za: <IDropdownItem>{ text: 'South Africa', code: 'za' },
      na: <IDropdownItem>{ text: 'Namibia', code: 'na' }
   };

   public static urlValues = {
      infoNoticeNedId: 'interactionenablers/v1/infonotices/channels/84/brands/NED/types/NID',
      aliasProfile: 'users/alias/profile',
      salute: 'users/salut',
      authenticate: 'users/authenticate'
   };

   public static gaEvents = {
      downloadMoney: {category: 'Logon', eventAction: 'clicked_on_download_money_app', label: 'Download Money App'},
      enterNedIdAndPassword: {category: 'Logon', eventAction: 'enters_nedid_and_password', label: 'Enters Nedid and Password'},
      clickLogonButton: {category: 'Logon', eventAction: 'clicked_on_logon_button', label: 'Clicked on Logon Button'},
      selectForgotDetails: {category: 'Logon', eventAction: 'selected_forgot_your_details_tab', label: 'Forgot Details'},
      needAssistance: { category: 'Logon', eventAction: 'selected_need_some_assistance', label: 'Need Assistance' },
      clickedTandCs: { category: 'Logon', eventAction: 'clicked_on_t_and_c_above_logon_tab', label: 'Clicked on TandCs' },
      registerUsingPPP: { category: 'Logon', eventAction: 'register_for_nedid_clicked_on_ppp', label: 'Register for Nedbank Id' },
      clickedOnChatAuth: { category: 'Auth', eventAction: 'click_on_the_chat_icon', label: 'Client clicks chat' },
      clickedOnChatUnAuth: { category: 'UnAuth', eventAction: 'click_on_the_chat_icon', label: 'Client clicks chat' },
      minimiseChatAuth: { category: 'Auth', eventAction: 'client_minimised_active_chage', label: 'Client uses minimize feature.' },
      minimiseChatUnAuth: { category: 'UnAuth', eventAction: 'client_minimised_active_chage', label: 'Client uses minimize feature' },
      chatSessionStartedAuth: { category: 'Auth', eventAction: 'start_chat_authenticated', label: 'Client Initiates a chat' },
      chatSessionStartedUnAuth: { category: 'UnAuth', eventAction: 'start_chat_unauthenticated', label: 'Client Initiates a chat' },
      chatTerminatedAuth: { category: 'Auth', eventAction: 'client_terminated_chat', label: 'Client terminates chat' },
      chatTerminatedUnAuth: { category: 'UnAuth', eventAction: 'client_terminated_chat', label: 'Client terminates chat' },
      chatNPSQuestioneOneAuth:
         { category: 'Auth', eventAction: 'client_supplied_NPS_rating_first_question', label: 'NPS Questions Submitted' },
      chatNPSQuestioneOneUnAuth:
         { category: 'UnAuth', eventAction: 'client_supplied_NPS_rating_first_question', label: 'NPS Questions Submitted' },
      chatNPSQuestioneTwoAuth:
         { category: 'Auth', eventAction: 'client_supplied_NPS_rating_Second_question', label: 'NPS Questions Submitted' },
      chatNPSQuestioneTwoUnAuth:
         { category: 'UnAuth', eventAction: 'client_supplied_NPS_rating_Second_question', label: 'NPS Questions Submitted' },
      chatNoThanksClickedAuth:
         { category: 'Auth', eventAction: 'NPS_rating_not_submitting', label: 'NPS Questions Not Submitted' },
      chatNoThanksClickedUnAuth:
         { category: 'UnAuth', eventAction: 'NPS_rating_not_submitting', label: 'NPS Questions Not Submitted' }
   };
}

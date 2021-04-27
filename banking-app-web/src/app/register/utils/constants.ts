import { View } from './enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';

export class ConstantsRegister {
  public static messages = {
    technicalError: 'A technical error has ocurred.',
    invalidUser: 'Invalid user credentials.',
    communicationError: 'An error has ocurred while communicating with Nedbank.',
    invalidOTP: 'This OTP is incorrect.',
    invalidCredentials: 'Invalid credentials',
    usernameNotAvailable: 'The username selected is not available.',
    headingCongrats: 'Congrats!',
    requiredField: 'This is a required field.',
    incorrectFormat: 'Incorrect Format',
    usernameMandatory: 'Please enter your username',
    userNameValidationText: 'At least 7 alphanumerical characters (A-Z, a-z, 0-9)',
    userNameHelpText: '',
    passwordMandatory: 'Please enter your password',
    passwordValidationText: 'At least 8 alphanumerical characters (A-Z, a-z, 0-9)',
    passwordHelpText: '',
    profileMandatory: 'Please enter your 10-digit profile number.',
    profilePattern: 'You need 10 digits.',
    pinMandatory: 'Please enter your 4-digit profile PIN.',
    pinPattern: 'You need 4 digits.',
    profilePasswordMandatory: 'Please enter your 6-10 digit profile password.',
    profilePasswordPattern: 'You need 6-10 alphanumerical characters (A–Z, a–z, 0–9).',
    invalidNumber: 'Numbers only, please.',
    cellphoneFormatMessage: 'Your cellphone number is too short. Use the format +27821234567 or 0821234567.'
  };

  public static errorMessages = {
    systemError: {
      message: `So sorry! Looks like something's wrong on our side.`,
      alertType: AlertMessageType.Error,
      linkText: 'Try Again',
      alertAction: AlertActionType.TryAgain
    },
    PPPDetailsDontMatch: {
      message: `Hmm, your profile, PIN and password don't match.`,
      alertType: AlertMessageType.Error,
      linkText: 'Need help?',
      alertAction: AlertActionType.Help
    },
    PPPInvalidUsername: {
      message: `Sorry, we could not find you based on the details you have provided. Please revise your details and try again.`,
      alertType: AlertMessageType.Error,
      linkText: '',
      alertAction: AlertActionType.None
    },
    PPPBusinessEntry: {
      message: `This is a business profile number. Please enter your personal profile number.`,
      alertType: AlertMessageType.Error,
      linkText: '',
      alertAction: AlertActionType.None
    },
    PPPDetailsDontMatchResolve: {
      message: `Sorry, your account has been locked because of too many failed login attempts.`,
      alertType: AlertMessageType.Lock,
      linkText: 'Need help?',
      alertAction: AlertActionType.Help
    },
    NedIDUserNameExists: {
      message: `Somebody's already using this name. How about using your email address?`,
      alertType: AlertMessageType.Lock,
      linkText: '',
      alertAction: AlertActionType.None
    },
    invalidDetails: {
      message: `Sorry, the details you have provided are incorrect. Please revise and try again.`,
      alertType: AlertMessageType.Error,
      linkText: '',
      alertAction: AlertActionType.None
    },
    resetPWInvalidUsername: {
      message: `We don't recognise that username.`,
      alertType: AlertMessageType.Error,
      linkText: 'Try again',
      alertAction: AlertActionType.TryAgain
    },
    resetPWUserLocked: {
      message: `Sorry, your account has been locked because of too many failed login attempts.`,
      alertType: AlertMessageType.Lock,
      linkText: '',
      alertAction: AlertActionType.None
    },
    resetPWSystemError: {
      message: `So sorry! Looks like something's wrong on our side.`,
      alertType: AlertMessageType.Error,
      linkText: 'Try again',
      alertAction: AlertActionType.TryAgain
    },
    resetPWUserInvalid: {
      message: `Sorry, we don't recognise that username.`,
      alertType: AlertMessageType.Error,
      linkText: 'Resend my username',
      alertAction: AlertActionType.ResendDetails
    },
    resetPWSecretPolicyViolation: {
      message: `Password policy violation. Please revise and try again.`,
      alertType: AlertMessageType.Error,
      linkText: '',
      alertAction: AlertActionType.None
    },
    loginInvalidDetails: {
      message: `Sorry, the details you have provided are incorrect. Please revise and try again.`,
      alertType: AlertMessageType.Error,
      linkText: '',
      alertAction: AlertActionType.None
    },
    inputValidationError: {
      message: `Sorry, we could not find you based on the details you have provided. Please revise your details and try again.`,
      alertType: AlertMessageType.Error,
      linkText: '',
      alertAction: AlertActionType.None
    },
    linkAliasError: {
      message: `So sorry! It seems we are having trouble linking your banking profile.`,
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
    invalidFeature: {
      message: `Sorry, you do not have access to the feature you are trying to access.
       Please contact the call centre on 0860 555 111 or your closest Branch for assistance.`,
      alertType: AlertMessageType.Error,
      linkText: '',
      alertAction: AlertActionType.None
    },
  };

  public static errorCode = {
    r00: 'R00',
    r01: 'R01',
    r02: 'R02',
    r03: 'R03',
    r04: 'R04',
    r05: 'R05',
    r06: 'R06',
    r07: 'R07',
    r08: 'R08',
    r09: 'R09',
    r10: 'R10',
    r11: 'R11',
    r12: 'R12',
    r13: 'R13',
    r14: 'R14',
    r15: 'R15',
    r16: 'R16',
    r17: 'R17',
    r18: 'R18',
    r19: 'R19',
    r20: 'R20',
    r21: 'R21',
    r22: 'R22',
    r23: 'R23',
    r24: 'R24',
    r25: 'R25',
    r26: 'R26',
    r27: 'R27',
    r28: 'R28',
    r29: 'R29',
    r30: 'R30',
    r31: 'R31',
    r32: 'R32',
    r33: 'R33',
    r34: 'R34',
    r35: 'R35',
    r36: 'R36',
    r37: 'R37',
    r38: 'R38',
    r39: 'R39',
    r40: 'R40',
    r73: 'R73',
    r76: 'R76',
    r77: 'R77',
    r78: 'R78',
    r125: 'R125',
    r137: 'R137'
  };

  public static ViewDetails = {
    ProfilePinPassword: {
      type: View.ProfilePinPassword,
      image: 'NedbankLogin_v2'
    },
    NedIdCreate: {
      type: View.NedIdCreate,
      image: 'NedbankLogin_v4'
    },
    NedIdDelayed: {
      type: View.NedIdDelayed,
      image: 'NedbankLogin_v13'
    },
    NedIdHelp: {
      type: View.NedIdHelp,
      image: 'NedbankLogin_v2'
    },
    NedIdExist: {
      type: View.NedIdExist,
      image: 'NedbankLogin_v3'
    },
    NedIdState: {
      type: View.NedIdState,
      image: 'NedbankLogin_v10'
    },
    NedIdComplete: {
      type: View.NedIdComplete,
      image: 'NedbankLogin_v12'
    },
    NedIdLogin: {
      type: View.NedIdLogin,
      image: 'NedbankLogin_v3'
    },
    NedIdNotFederated: {
      type: View.NedIdNotFederated,
      image: 'NedbankLogin_v7'
    },
    ForgotPwdResetoptions: {
      type: View.ForgotPwdResetoptions,
      image: 'NedbankLogin_v7'
    },
    ForgotPwdGetusername: {
      type: View.ForgotPwdGetusername,
      image: 'NedbankLogin_v4'
    },
    ForgotPwdCreatepwd: {
      type: View.ForgotPwdCreatepwd,
      image: 'NedbankLogin_v6'
    },
    ForgotPwdCreatepwdComplete: {
      type: View.ForgotPwdCreatepwdComplete,
      image: 'NedbankLogin_v14'
    },
    ForgotPwdGetidentity: {
      type: View.ForgotPwdGetidentity,
      image: 'NedbankLogin_v4'
    },
    ForgotPwdShowUsername: {
      type: View.ForgotPwdShowUsername,
      image: 'NedbankLogin_v5'
    }
  };

  public static gaEvents = {
   entersPPP: {category: 'Register',
               eventAction: 'entered_profile_pin_and_password',
               label: 'Enter PPP'},
   incorrectPPP: {category: 'Register',
                  eventAction: 'failure_due_to_incorrect_ppp_info_entered',
                  label: 'Incorrect PPP credentials'},
   passwordIconPPP: {category: 'Register',
                     eventAction: 'users_that_uses_the_eye_icon_to_see_ppp_password',
                     label: 'Use Eye Icon to see Password'},
   haveNedbankId: {category: 'Register',
                  eventAction: 'users_that_has_been_informed_they_already_have_existing_nedid',
                  label: 'Already have Nedbank Id'},
   createdNedbankIdUser: {category: 'Register',
                           eventAction: 'users_that_created_a_nedbank_id_username',
                           label: 'Create a Nedbank Id Username'},
   createdPassword: {category: 'Register',
                     eventAction: 'users_that_created_a_password',
                     label: 'Created a Password'},
   passwordIconNedbankId: {category: 'Register',
                           eventAction: 'users_that_clicked_on_the_eye_icon_to_see_password',
                           label: 'Use Eye Icon to see Password'},
   passwordViolation: {category: 'Register',
                        eventAction: 'users_couldnt_create_password_due_to_password_restrictions',
                        label: 'Password Violation'},
   rejectedApproveIt: {category: 'Register',
                        eventAction: 'clients_rejected_approveit_to_confirm_nedid_username',
                        label: 'Rejected Approve It'},
   acceptApproveIt: {category: 'Register',
                     eventAction: 'clients_accepted_approveit_to_confirm_nedid_username',
                     label: 'Accepted Approve It'}
   };
}

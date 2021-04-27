export class StatementPreferencesConstants {
   public static labels = {
      title: 'Statement delivery preferences',
      statementDeliveryModes: 'How would you like us to send your statement?',
      postalAddress: 'Postal address',
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2',
      addressLine3: 'Address Line 3',
      suburbAndCity: 'Suburb and City',
      postalCode: 'Postal Code',
      primaryEmail: 'Your email address',
      alternativeEmail: 'Alternative email',
      addSecondaryEmail: 'Add an alternative email address',
      secondaryEmail: 'Alternative email',
      statementFrequency: 'Statement frequency',
      save: 'Save',
      emailPlaceholder: 'abc@mail.com',
      editAddress: 'Edit address',
      addressLineThreeText: 'Suburb',
      cityText: 'City',
      errorMessage: 'This field cannot be empty',
      addressLine1RequiredText: ' address line 1 is required',
      addressLine2RequiredText: ' address line 2 is required',
      addressLine3RequiredText: ' suburb is required'
   };
   public static values = {
      comma: ',',
      monthly: 'Monthly',
      month: 'MTH',
      halfyearly: 'Halfyearly',
      quarterly: 'Quarterly',
      quarter: 'QRT',
      biMonthly: 'Bimonthly',
      biMonth: 'BIM',
      never: 'Never',
      unknown: 'Unknown',
      doNotSend: 'DONOTSEND',
      holdAtCounter: 'HOLD AT COUNTER',
      groupName: 'statementPreferences',
      success: 'success',
      error: 'error',
      responseSuccess: 'R00',
      debitOrderPayer: 'DEBO',
      frequency: ['QRT', 'MTH'],
      street: 'STREET'
   };
   public static messages = {
      updateSuccess: 'Success! Your updated statement delivery information will be effective from the next billing cycle.',
      updateFail: `Something went wrong and we couldn't update your delivery information. Please try again later.`,
      emailRequired: 'This field cannot be empty',
      invalidEmail: 'Invalid email address',
      sameAlternativeEmail: 'Alternative email should not be same as primary email'
   };
   public static informations = {
      postalDisclaimer: 'You can only make changes to your postal address by visiting a branch or by calling our call centre on',
      callCenterNumber: '0860 555 111.',
      frequencyDisclaimer: 'You can only make changes to your statement frequency by visiting a branch or by calling our call centre on',
      callCenterNumberMFC: '0860 879 900.',
      frequencyDisclaimerMFC: 'You can only change how often you get your statement by calling our MFC call centre on',
      frequencyDisclaimerMFCOld: 'You can only make changes to your statement frequency by calling our MFC call centre on',
      emailDisclaimerUnitTrust: 'To change your delivery address or to switch to email delivery please call us on',
      emailDisclaimerUnitTrustSecond: 'or email us at',
      callCenterEmail: 'clientservices@nedgroupinvestment.co.za',
      helplineNumber: '0860 123 263',
      emailDisclaimerUnitTrustLast: 'If you switch to email, you can come back to this screen to update your email address at any time.',
      unitTrustConfirmationPopupText: 'Please note that these changes will be made for all your unit trust investments'
   };
   public static variableValues = {
      maximumButtonWidthForTwoButtons: 199,
      maximumButtonWidthForThreeButtons: 133,
      maximumButtonWidthForTwoButtonsInMobile: 170,
      maximumButtonWidthForThreeButtonsInMobile: 110,
      three: 3,
      two: 2,
      one: 1,
      zero: 0
   };
}

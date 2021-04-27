export class ApoConstants {
   public static apo = {

      selectLabels: {
         selectAccount: 'Select account',
         selectAmount: 'Select amount',
         selectPaymentDate: 'Select payment date',
         selectSummary: 'Summary'
      },
      values: {
         dateFormat: 'MM/DD/YYYY',
         monthFormat: 'DD',
         month: 'MM',
         monthString: 'MMMM',
         year: 'YYYY',
         day: 29,
         currentAccount: 'CA',
         savingAccount: 'SA',
         amountPrefix: 'R',
         creditCard: 'C',
         plasticRelationshipCode: 'PRI',
         gs: 'GS',
         gc: 'GC',
         one: '1',
         two: '2',
         three: '3',
         edit: 'edit',
         add: 'add',
         zero: '00',
         avsCheck: 'Y',
         twentyFive: '25',
         twentyFour: '24',
         twentyThree: '23',
         length: '13',
         minimum: 'M',
         total: 'F',
         preferred: 'A',
         preferredContent: 'preferred',
         minimumContent: 'minimum',
         aac: 'AAC',
         latest: 'latest',
         accepted: 'accepted',
         emptyString: '',
         suffixSt: 'st',
         suffixNd: 'nd',
         suffixRd: 'rd',
         suffixTh: 'th',
         the: 'The',
         everyMonth: 'of every month',
         statementDate: 'Statement date',
         paymentDueDate: 'Payment due date',
         dueDateOfEveryMonth: 'The due date of every month',
         dueDate: 'due date',
         accounts: ['CA', 'SA'],
         currentAccountTypes: ['CA', '1', 'GC'],
         currentAccountName: 'Current Account',
         savingAccountName: 'Saving Account',
         selectedDayForOne: [30, 31, 1],
         selectedDayForTwo: [31, 1, 2],
         after24: '24 days after statement date',
         after23: '23 days after statement date',
         cases: [1, 2, 3],
         branchCode: '198765',
         att: 'ATT',
         paymentOrder23: 'Your automatic payment order will be made 23 days after your statement date.',
         paymentOrder24: 'Your automatic payment order will be made 24 days after your statement date.',
         paymentOrder25: 'Please check your statement for the payment due date and make sure you have enough funds in your account.',
         bank: 'Bank',
         accountStatusCode: ['00', '0'],
         maxLimit: 14,
         minLimit: 11
      },
      nedBankFlexcube: ['NEDBANK NAMIBIA', 'NEDBANK LESOTHO LIMITED', 'NEDBANK SWAZILAND LIMITED', 'NEDBANK MALAWI'],
      steps: ['Pay from', 'Payment amount', 'Payment date', 'Summary'],
      routeUrls: {
         autopay: '/autopay/',
         cards: '/cards',
         success: '/cards/apo/success'
      },
      autopayLabels: {
         payFromTitle: 'Pay from',
         wouldYouLikeNedbank: 'Do you want to pay from your Nedbank account?',
         specifyYourAccount: 'Specify your bank account details',
         chooseNedbankBefore: 'Please choose your Nedbank account',
         bankName: 'Bank name',
         accountType: 'Account type',
         accountNumber: 'Account number',
         selectBankNameErrorMsg: 'Please select the bank name.',
         selectAccountTypeErrorMsg: 'Please select the account type.',
         enterAccountNumberErrorMsg: 'Please enter your account number.',
         preferredAmountErrorMsg: 'Please enter a valid preferred amount',
         paymentDateTitle: 'Payment date',
         whenWouldYouLikeToPay: 'When would you like to pay?',
         selectPreferredDate: 'Choose a payment date',
         latestStatementDate: 'Latest statement date:',
         latestDueDate: 'Payment due date:',
         paymentAmountTitle: 'Payment amount',
         howMuchWouldYouLikeToPay: 'How much would you like to pay?',
         preferredAmountMsg: 'Note: If the minimum amount due is greater than the preferred amount, then minimum amount will be debited.',
         summaryFormTitle: 'Summary',
         youAutoPaymentOrderDetailsText: 'Automatically pay my credit card each month as follows:',
         payTo: 'Pay to:',
         payFrom: 'Pay from:',
         paymentAmount: 'Payment amount:',
         paymentDate: 'Payment date:',
         branchOrCode: 'Branch name or code',
         monthlyPayment: 'Monthly payment:',
         startingFrom: '(starting from {0})',
      },
      errorMessages: {
         noBankName: 'Please enter the bank name.',
         noAccountNumber: 'Please enter a account number.',
         noAccountType: ' Please select an account type.',
         noBranchOrCode: 'Please enter the branch name or code.'
      },
      messages: {
         okay: 'Okay',
         yes: 'Yes',
         no: 'No',
         exit: 'Exit',
         success: 'Success!',
         cancel: 'Cancel',
         next: 'Next',
         delete: 'Delete',
         submit: 'Submit',
         autoPayOrder: 'Automatic payment order',
         ownAmount: 'Own amount',
         deleteSuccess: 'Success! Your Automatic payment order request has been deleted.',
         autoPayDetails: 'Your Automatic payment order details',
         creditCardBills: 'Pay your credit card bills on time.',
         setAutoPay: 'An automatic payment order lets you set automatic payments for your credit card.',
         noEditAndDelete: 'You unfortunately can’t edit or delete this automatic payment order.',
         deleteAutoPay: 'Delete your automatic payment order',
         paymentDue1: 'Your credit card payment is due on ',
         paymentDue2: '. Do you want to delete your automatic payment order?',
         manualPayment: `Remember to make a manual payment once your automatic payment order has been deleted to
            ensure your account doesn’t go into arrears.`,
         lastUpdate: 'Last updated:',
         print: 'Print',
         callCenter: 'Nedbank Call Centre  - 0860 555 111',
         contactUs: 'Contact us',
         hasBeenSetUp: 'Your automatic payment order has been set up.',
         whatHappenNext: 'What happens next?',
         willReceive: `You will receive a notification from your bank asking you  to confirm this addition/ change to
            your automatic payment order.`,
         termsAndConditions1: 'You understand and accept the',
         termsAndConditions2: 'terms and conditions',
         termsAndConditions3: 'for an automatic payment order.',
         couldNotAddAccount: ' We couldn’t add this account',
         apoTerms: 'Automatic payment order terms and conditions',
         pleaseNote: 'Please note:',
         phoneNumber: '0860 555 111.',
         minimumAmountDue: `Note: You can't choose to pay less than the minimum amount due -
            we'll always debit at least the minimum amount.`,
         warningMessage: `If someone else will be paying your credit card and you would like to add their account
            details, please contact us on `
      },
      paymentAmountOptions: {
         total: {
            type: 'F',
            label: 'Total amount due',
            value: 'total',
            tooltip: 'This is the total amount you owe on your credit card as shown on your statement. '
         },
         minimum: {
            type: 'M',
            label: 'Minimum amount due',
            value: 'minimum',
            tooltip: 'This is the minimum amount you owe on your credit card as shown on your statement.'
         },
         preferred: {
            type: 'A',
            label: 'Choose amount',
            value: 'preferred',
            tooltip: 'This is a fixed amount that you choose to pay every month. It must be higher than your minimum amount due.'
         }
      },
      defaultDropDownOption: {
         default: { text: '', code: 'default' },
      },
      bankNames: {
         snb: { text: 'SNB Bank', code: 'snb' },
         absa: { text: 'Absa Bank', code: 'absa' },
         capital: { text: 'Capital Bank', code: 'capital' }
      }
   };
   public static inRangeDateSelector = {
      apo: {
         warningMsg: 'Please note that you can only select a preferred date between your statement date and due date range.',
         days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      }
   };
   public static statusMessage = {
      success: 'Success! Your automatic payment order has been deleted.'
   };
}

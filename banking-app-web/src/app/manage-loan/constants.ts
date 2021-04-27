export class ManageLoanConstants {
   public static labels = {
      manageLoan: {
         manageYourLoan: 'Manage your loan',
         place: 'Place a',
         ninetyDayNotice: '90 day notice',
         cancelLoan: 'Cancel your home loan'
      },
      placeNotice: {
         title: 'Place a 90 day notice',
         earlyTermination: 'What\'s a 90 day (early termination) notice?',
         noticeTerm1: `It\'s a notice given by a home loan holder who plans on cancelling their home loan before the
                      agreed upon term as prescribed by the National Credit Act.`,
         noticeTerm2: 'It lets the home loan holder avoid early termination fees.',
         noticeTerm3: 'The notice is valid for a year and can be cancelled at any time.',
         placeNoticeButton: 'Place notice'
      },
      cancelLoan: {
         title: 'Cancel your home loan',
         homeLoanNotPayed: 'Your home loan isn\'t paid up yet.',
         already90DaysNotice: 'There\'s already a 90 day (early termination) notice on your home loan.',
         noticeDetails: 'Notice details:',
         earlyTermination: 'Please note that an early termination and attorney cancellation fees will apply.',
         attorneyLabel: 'Please note that attorney',
         attorneyFeeCancellation: 'Please note that attorney cancellation fees will apply.',
         proceedLoanCancellation: `In order to proceed with the loan cancellation process
                         the following will be required from you:`,
         yourEmail: 'Your email',
         receivedCancellationRequest: 'We\'ve received your home loan cancellation request and we\'re busy processing it.',
         homeLoanCancellationProcessBusy: 'We\'re busy processing your home loan cancellation request.',
         throughOutProcess: 'Through out the process the Nedbank assigned attorney will be in contact with you.',
         whatHappensNext: 'What happens next?',
         receiveCancellationAmoutNotification: `You\'ll receive an email with the cancellation amounts within 2-4 business days.
                         An attorney that has been assigned to you will contact you for further processing.`,
         cancelLoanEmailId: 'retailcancellations@nedbank.co.za',
         mobileNumber: '0860 555 111',
         paidUpMsg: 'Congratulations! Your home loan is paid up.',
         sendRequestToCancelLoan: 'You can now send a request to cancel your home loan.',
         attorneyCancelationFee: 'Please note that an attorney cancellation fees will apply on cancellation.',
         confirmationForJointParty: `You hereby confirm that the joint party for this bond has
                         consented to this cancellation request.`,
         youAreDone: 'You\'re done',
         placedBondCancellationRequest: 'You\'ve successfully placed a bond cancellation request on your home loan.',
         placedCancellationRequest: 'You\'ve successfully placed a request to cancel your home loan.',
         requestProcessedIn2Days: 'Please note that your request will be processed within 2 business days.',
         cancelBondAgainstProperty: `An attorney assigned by Nedbank will contact you and initiate the process
                         to cancel the bond against your property at the deeds office.`,
         contactUs: 'Contact us:',
         couldNotCancelHL: 'We couldn\'t cancel your home loan.',
         cancelYourLoanWith90DayNotice: `If you plan on selling your property or want to cancel your home loan for any other reason,
                         we\'ll need a 90 day notice or an early-termination fee will apply.`,
         likeToPlace90DayNotice: 'Would you like to place a 90 day notice?',
         placeNoticeNow: 'Place notice now',
         cancelHomeLoanWithoutNotice: 'Or proceed to place a request to cancel your home loan without notice',
         placedRequestForCancelLoan: 'You\'ve successfully placed a request to cancel your home loan.',
         cancelWithoutNotice: 'Cancel without notice',
         placeRequest: 'Place request'
      },
      noticeDetails: {
         noticePlacedInfo: 'There\'s already a 90 day (early termination) notice on your home loan.',
         noticeDetails: 'Notice details : ',
         noticePlacedOn: 'Notice placed on : ',
         noticeValidUntil: 'Notice valid until : ',
         noEarlyTerminationFee: 'No early termination fee after : '
      },
      status: {
         contactUsOn: 'For more information contact us on:'
      },
      confirmModal: {
         yesButton: 'Yes',
         noButton: 'No',
         cancelLoanTitle: 'Are you sure you want to cancel your loan?',
         placeNoticeTitle: 'Are you sure you want to place a 90 day notice?',
         jbActMessage: 'By selecting \'Yes\' you hereby confirm that all the joint parties have given consent.'
      }
   };
   public static messages = {
      placeNotice: {
         success: {
            title: 'You\'ve successfully placed a 90 day (early termination) notice on your home loan',
            description: 'Please note, your notice will be processed within 2 business days.'
         },
         error: {
            title: 'We couldn\'t place your 90 day (early termination) notice.',
         },
         noticeInProgress: `We have received your request to place your home loan on a 90 day notice and we are still processing it.`,
      },
      cancelLoan: {
         error: {
            title: 'We couldn\'t cancel your home loan.',
         },
         invalidEmail: 'Invalid email address'
      }
   };
   public static values = {
      actions: {
         tryAgain: 'Try Again'
      },
      cancelLoanTypes: {
         cancelNotices: 'cancellationnotices',
         cancellationRequests: 'cancellationrequests'
      },
      tryAgainLimit: 2,
      contactNo: '0860 555 111',
      cancellationFeeTextQuery: 'cancellation fees will apply',
      cancellationsEmail: 'retailcancellations@nedbank.co.za'
   };
}


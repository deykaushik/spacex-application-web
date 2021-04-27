export class GAEvents {
   public static shareAccount = {
      selectAccountDetails: {
         category: 'Share account', eventAction: 'SAD_Select_Account_Details',
         label: 'Select account details tab'
      },
      selectShareProofOfAccEmail: {
         category: 'Share account', eventAction: 'SAD_Select_Share_Proof_of _acc_email',
         label: 'Select share proof of account via email option'
      },
      amountEmailsEntered: {
         category: 'Share account', eventAction: 'SAD_Amount_emails_entered',
         label: 'Show amount of emails entered'
      },
      selectSend: {
         category: 'Share account', eventAction: 'SAD_Select_send',
         label: 'Show amount of time send button selected'
      },
      selectCancel: {
         category: 'Share account', eventAction: 'SAD_Select_cancel',
         label: 'Show amount of time cancel button selected'
      }
   };

   public static manageOverdraft = {
      select: {
         category: 'Manage Overdraft', eventAction: 'Manage_Overdraft_option_select',
         label: 'Manage overdraft option'
      },
      cancel: {
         category: 'Manage Overdraft', eventAction: 'Manage_Overdraft_Cancel',
         label: 'Manage overdraft cancel'
      },
      change: {
         category: 'Manage Overdraft', eventAction: 'Manage_Overdraft_Change_Overdraft',
         label: 'Manage overdraft change'
      },
      increase: {
         category: 'Manage Overdraft', eventAction: 'Manage_Overdraft_Increase',
         label: 'Manage overdraft increase'
      },
      decrease: {
         category: 'Manage Overdraft', eventAction: 'Manage_Overdraft_Decrease',
         label: 'Manage overdraft decrease'
      },
      submit: {
         category: 'Manage Overdraft', eventAction: 'Manage_Overraft_Submit',
         label: 'Manage overdraft submit'
      }
   };

   public static personalLoanSettlement = {
      settlementQuoteFromFeatures: {
         category: 'Personal Loan Settlement', eventAction: 'PL_SL_Settlement_Quote_Features',
         label: 'settlement quote from features'
      },
      settlementQuoteFromSettleLoan: {
         category: 'Personal Loan Settlement', eventAction: 'PL_SL_Settlement_Quote_Settle_Loan',
         label: 'settlement quote from Settle Loan screen'
      },
      settleLoan: {
         category: 'Personal Loan Settlement', eventAction: 'PL_SL_Settle_Loan',
         label: 'settle loan'
      },
      transferNow: {
         category: 'Personal Loan Settlement', eventAction: 'PL_SL_Settle_Loan_Transfer_Now',
         label: 'Immediate transfer from CASA'
      },
      settlementQuoteSuccess: {
         category: 'Personal Loan Settlement', eventAction: 'PL_SL_Settlement_Quote_Success',
         label: 'settlement quote is successfully sent to client'
      }
   };

   public static dormantAccount = {
      view: {
         category: 'Dormant Account', eventAction: 'dormantaccount_usagedetails',
         label: 'View dormant account'
      },
      activate: {
         category: 'Dormant Account', eventAction: 'dormantaccount_activation',
         label: 'Activate dormant account'
      }
   };
   public static cardFeatures = {
      onlinePurchase: {
         toggleOn: { action: 'toggle_on_online_purchase', label: 'cards_tab_interpurchase_toggle', category: 'Online Purchase' },
         toggleOff: { action: 'toggle_off_online_purchase', label: 'cards_tab_interpurchase_toggle', category: 'Online Purchase' }

      },
      tapAndGo: {
         toggleOn: { action: 'toggle_on_tapAndGo', label: 'cards_tab_tapgo_toggle', category: 'Tap and Go' },
         toggleOff: { action: 'toggle_off_tapAndGo', label: 'cards_tab_tapgo_toggle', category: 'Tap and Go' }
      },
      freezeCard: {
         toggleOn: { action: 'toggle_on_freezeCard', label: 'cards_tab_freeze_card_toggle', category: 'Freeze card' },
         toggleOff: { action: 'toggle_off_freezeCard', label: 'cards_tab_freeze_card_toggle', category: 'Freeze card' }

      },
      cardsTabAccessProdtype: {
         action: 'cards_tab_carousel_accessed_prod_type',
         label: 'Get Product Type', value: '', category: 'Card Management'
      }
   };

   public static activateCard = {
      activatingNewCreditCard: {
         action: 'confirmactivate_new_creditcard', label: 'Activate New Credit Card',
         value: 'confirmactivate_new_creditcard'
      },
      activatingDormantCreditCard: {
         action: 'confirmactivate_dormant_creditcard', label: 'Activate Dormant Credit Card',
         value: 'confirmactivate_dormant_creditcard'
      },
      cancelActivateNewCreditCard: {
         action: 'cancelactivate_new_creditcard', label: 'Cancel Activate New Credit Card',
         value: 'cancelactivate_new_creditcard'
      },
      cancelActivateDormantCreditCard: {
         action: 'cancelactivate_dormant_creditcard', label: 'Cancel Activate Dormant Credit Card',
         value: 'cancelactivate_dormant_creditcard'
      },
      activatingNewDebitChequeCard: {
         eventAction: 'click_on_confactnewchqdebitcard_screen', label: 'Confirm Activate New Debit/Cheque Card'
      },
      activatingDormantDebitChequeCard: {
         eventAction: 'click_on_confactdormchqdebitcard_screen', label: 'Confirm Activate Dormant Debit/Cheque Card'
      },
      cancelActivateNewDebitChequeCard: {
         eventAction: 'click_on_cancactnewchqdebitcard_screen', label: 'Cancel Activate New Debit/Cheque Card'
      },
      cancelActivateDormantDebitChequeCard: {
         eventAction: 'click_on_cancactdormchqdebitcard_screen', label: 'Cancel Activate Dormant Debit/Cheque Card'
      },
      viewActivateNewCreditCard: {
         action: 'viewactivate_new_creditcard', label: 'View Activate New Credit Card',
         value: 'viewactivate_new_creditcard'
      },
      viewActivateDormantCreditCard: {
         action: 'viewactivate_dormant_creditcard', label: 'View Activate Dormant Credit Card',
         value: 'viewactivate_dormant_creditcard'
      },
      clickActivateNewDebitChequeCard: {
         eventAction: 'confirmactivate_new_debit_cheque_card', label: 'Click Activate button for New Debit/Cheque Card'
      },
      clickActivateDormantDebitChequeCard: {
         eventAction: 'confirmactivate_dormant_debit_cheque_card', label: 'Click Activate button for Dormant Debit/Cheque Card'
      },
      category: 'Activate Credit Card',
      categoryDebitChequeCard: 'Activate Debit/Cheque Card'
   };
   public static annualCreditReview = {
      clickAnnualCreditReview: { action: 'click_on_Annualcreditreview_screen', label: 'Set Annual Credit Review' },
      AnnualCreditReviewOptIn: { action: 'click_on_AnnualcreditreviewOptIn_action', label: 'Opt In For Annual Credit Review' },
      AnnualCreditReviewOptOut: { action: 'click_on_AnnualcreditreviewOptOut_action', label: 'Opt Out For Annual Credit Review' },
      AnnualCreditReviewOptInPerCreditCardProductType: {
         action: 'click_on_OptInperCreditCard_screen',
         label: 'Opt In For Annual Credit Review Per Credit Card Product Type', value: 'click_on_OptInperCreditCard_screen'
      },
      AnnualCreditReviewOptOutPerCreditCardProductType: {
         action: 'click_on_OptOutperCreditCard_screen',
         label: 'Opt Out For Annual Credit Review Per Credit Card Product Type', value: 'click_on_OptOutperCreditCard_screen'
      },
      category: 'Unilateral Limit increase'
   };

   public static hideAndShow = {
      accountManagement: {
         category: 'Hide Show account', eventAction: 'hide_show_account',
         label: 'number of users who select hide and show tag'
      },
      success: {
         category: 'Hide Show account', eventAction: 'hide_show_account_update_success',
         label: 'hide and show account success'
      },
      failed: {
         category: 'Hide Show account', eventAction: 'hide_show_account_update_failed',
         label: 'hide and show account Failed'
      },
   };


   public static accountRename = {
      renameButtonClick: {
         category: 'Rename your account', eventAction: 'rename_account_action',
         label: 'User clicked on the pencil icon'
      },
      success: {
         category: 'Rename your account', eventAction: 'rename_account_update_success',
         label: 'Number of success while renaming the account'
      },
      failure: {
         category: 'Rename your account', eventAction: 'rename_account_update_failed',
         label: 'Number of failure while renaming the account'
      }
   };

   public static viewBanker = {
      viewBankerButtonclick: {
         category: 'View banker', eventAction: 'viewbanker', value: null,
         label: 'Number of clients trying to tap the "Your Banker" option_'
      },
      success: {
         category: 'View banker', eventAction: 'viewbanker_action_success', value: null,
         label: 'Number of clients successful in retriving banker information_'
      },
      failure: {
         category: 'View banker', eventAction: 'viewbanker_action_failure', value: null,
         label: 'Number of clients who failed in retriving banker information_'
      },
      emailAddressClick: {
         category: 'View banker', eventAction: 'viewbanker_emailaddress', value: null,
         label: 'Number of clients who clicked the email link_'
      }
   };

   public static hlSettlement = {
      clickQuote: {
         category: 'Home Loan Settlement', eventAction: 'HL_SL_Settlement_Quote',
         label: 'settlement quote from features'
      },
      settleLoan: {
         category: 'Home Loan Settlement', eventAction: 'HL_SL_Settle_Loan',
         label: 'Request settle loan'
      },
      transferNow: {
         category: 'Home Loan Settlement', eventAction: 'HL_SL_Settle_Loan_Transfer_Now',
         label: 'Request transfer now'
      },
      quoteEmailSuccess: {
         category: 'Personal Loan Settlement', eventAction: 'HL_SL_Settlement_Quote_Success',
         label: 'Send quote to recipient'
      }
   };
   public static debitOrder = {
      cancelButtonClickedAction: {
         category: 'Debit Order', eventAction: 'click_on_cancelstop_debit_order_action',
         label: 'Cancel stop button clicked_'
      },
      cancelButtonClickedScreen: {
         category: 'Debit Order', eventAction: 'click_on_cancelstop_debit_order_screen',
         label: 'Cancel stop link clicked from stop order details_'
      },
      stopDebitOrderSuccessPage: {
         category: 'Debit Order', eventAction: 'click_on_stopdebitorder_from_reverse_success',
         label: 'Stop debit order button clicked from debit order success page_'
      },
      stopDebitOrderScreen: {
         category: 'Debit Order', eventAction: 'click_on_stopdebitorder_screen',
         label: 'Stop debit order link clicked from active debit order details_'
      },
      stopDebitOrderButton: {
         category: 'Debit Order', eventAction: 'click_on_stopdebitorder_action',
         label: 'Stop debit order button clicked_'
      },
      cancelStopDebitOrder: {
         category: 'Debit Order', eventAction: 'click_on_cancelstopdebitorder_screen_dropoff',
         label: 'Clicked on cancel stop button but did not complete_'
      },
      stopDebitOrder: {
         category: 'Debit Order', eventAction: 'click_on_stopdebitorder_screen_dropoff',
         label: 'Clicked on stop debit order button but did not complete_'
      },
      debitOrderClicked: {
         category: 'Debit Order', eventAction: 'click_on_viewdebit_order_screen',
         label: 'Debit order clicked_'
      }
   };

   public static balanceEnquiry = {
      viewMoreBalance: {
         category: 'Balance Enquiry', eventAction: 'click_on_view_more_balances_product_account_screen ',
         label: 'View more balances clicked_'
      }
   };

   public static transactionHistory = {
      transactionDetails: {
         category: 'Transaction History', eventAction: 'click_on_transaction_details_product_account_screen',
         label: 'Transaction clicked_'
      }
   };

   public static managePaymentDetails = {
      personalLoanDetails: {
         category: 'Manage Payment Details', eventAction: 'click_on_personalloanpaymentdetails_screen',
         label: 'View payment details clicked for PL'
      },
      homeLoanDetails: {
         category: 'Manage Payment Details', eventAction: 'click_on_homeloanpaymentdetails_screen',
         label: 'View payment details clicked for HL'
      },
      mfcPaymentDetailsFailure: {
         category: 'Manage Payment Details', eventAction: 'click_on_mfcpaymentdetails_screen_dropoff',
         label: 'Clicked on Edit but did not apply changes'
      },
      mfcPaymentDetailsSuccess: {
         category: 'Manage Payment Details', eventAction: 'click_on_mfcpaymentdetails_update_action',
         label: 'Click on apply changes'
      },
      mfcPaymentDetailsClicked: {
         category: 'Manage Payment Details', eventAction: 'click_on_mfcpaymentdetails_screen',
         label: 'Manage payment details clicked'
      },
      mfcPaymentDropOff: {
         category: 'Manage Payment Details', eventAction: 'click_on_mfcpaymentdetails_screen_dropoff',
         label: 'Clicked on Edit but did not apply changes'
      }
   };

   public static transactionSearch = {
      contextualSearch: {
         category: 'Transaction Search', eventAction: 'click_on_contextual_search',
         label: 'Selected transaction search option'
      },

      onFilterClick: {
         category: 'Transaction Search', eventAction: 'click_on_filter_button',
         label: 'Clicked on Advanced search option'
      }
   };

   public static overseasTravelNotification = {
      category: 'Overseas Travel Notification',
      viewUseCardOverseas: {
         label: 'View Overseas Travel Notification', value: 'view otn_screen',
         eventAction: 'View Use card overseas option under card settings'
      },
      submitUseCardOverseas: {
         label: 'submit Overseas Travel Notification', value: 'create otn_action',
         eventAction: 'Submit Overseas Travel Notification Details'
      },
      dropOffSelectCard: {
         label: 'overseas travel notification_drop off_select card', value: 'otn_select card_drop off_action',
         eventAction: 'exit from Select card step'
      },
      dropOffSelectDates: {
         label: 'overseas travel notification_drop off_travel details', value: 'otn_travel details_drop off_action',
         eventAction: 'exit from Select dates step'
      },
      dropOffSelectCountries: {
         label: 'overseas travel notification_drop off_travel details', value: 'otn_travel details_drop off_action',
         eventAction: 'exit from Select countries step'
      },
      dropOffContactDetails: {
         label: 'overseas travel notification_drop off_contact details', value: 'otn_contact details_drop off_action',
         eventAction: 'exit from Contact details step'
      },
      dropOffSummary: {
         label: 'overseas travel notification_drop off_summary', value: 'otn_summary_drop off_action',
         eventAction: 'exit from Summary step'
      }

   };

   public static requestPaymentAction = {
      summaryPageExit: {
         category: 'Request Building Loan Payment', eventAction: 'request_payment_action_summary_detail_exit',
         label: 'Number of RBLP clients intiating payment but exiting on "Summary Details" screen'
      },
      getStartedPageExit: {
         category: 'Request Building Loan Payment', eventAction: 'request_payment_action_get_started_exit',
         label: 'Number of RBLP clients intiating payment but exiting on "Get Started" screen'
      },
      paymentDetailsPageExit: {
         category: 'Request Building Loan Payment', eventAction: 'request_payment_action_payment_details_exit',
         label: 'Number of RBLP clients intiating payment but exiting on "Payment Details" screen'
      },
      paymentRequestInitiated: {
         category: 'Request Building Loan Payment', eventAction: 'request_payment_action_initiated',
         label: 'Number of RBLP clients intiating payment request'
      },
      paymentRequestSubmitted: {
         category: 'Request Building Loan Payment', eventAction: 'request_payment_action_submitted',
         label: 'Number of RBLP clients successfully submitting the request'
      }
   };

   public static statementDeliveryPreference = {
      sdpView: {
         category: 'Statement delivery preference', eventAction: 'sdp_view',
         label: 'Number of clients accessing the Statement delivery preference for_'
      },
      sdpUpdate: {
         category: 'Statement delivery preference', eventAction: 'sdp_update',
         label: 'Number of users who have updated delivery method_'
      },
      sdpPostalAddressView: {
         category: 'Statement delivery preference', eventAction: 'sdp_postal_address_view',
         label: 'Number of_MFC_clients accessing the Statement delivery preference edit address'
      },
      sdpPostalAddressAbort: {
         category: 'Statement delivery preference', eventAction: 'sdp_postal_address_abort',
         label: 'Number of_MFC_users aborting the process of edit address'
      }
   };

   public static gameSection = {
      lottoClick: {
         category: 'Buy section', eventAction: 'select_lotto',
         label: 'Number of customers who use the LOTTO option'
      },
      viewHistory: {
         category: 'View History', eventAction: 'view_history_lotto',
         label: 'Number of customers who opted to view their ticket history'
      },
      viewWiningNumbers: {
         category: 'View Winning Numbers', eventAction: 'view_winning_number_lotto',
         label: 'Number of customers who opted to view the Winning Numbers of the previous draw'
      },
      replayTicketScreen: {
         category: 'Ticket Screen', eventAction: 'replay_lotto',
         label: 'Number of customers who opted to replay their tickets'
      },
      replay: {
         category: 'Finish Screen', eventAction: 'finish_replay_lotto',
         label: 'Number of customers who have completed LOTTO purchase on replay'
      },
      newPurchase: {
         category: 'Finish Screen', eventAction: 'finish_lotto',
         label: 'Number of customers who have completed LOTTO New purchase'
      }
   };
   public static AutomaticPaymentOrder = {
      fromCardsTap: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOfromCardstab_screen',
         label: 'Using APO feature from cards tap'
      },
      fromAccountView: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOfromAccountsview_screen',
         label: 'Using APO feature from accounts view'
      },
      functionalityWise: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOfunctionalitywise_screen',
         label: 'Use APO for add, delete, view and edit'
      },
      cancelInAddApo: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOCancelfirststep_screen',
         label: 'Clicking cancel in add APO'
      },
      nextInAddApo: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOproceedonfirststep_screen',
         label: 'Clicking next in add APO'
      },
      fromOwnNedbank: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOfromOwnNedbank_screen',
         label: 'Selecting YES and set up APO from own account'
      },
      fromOtherBank: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOfromOtherbank_screen',
         label: 'Selecting NO and set up APO from other bank account'
      },
      timeTakenOnPayFromScreen: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOtimetakenonPayfrom_screen',
         label: 'Time taken by a user on selecting either Nedbank or Non-Nedbank account for APO'
      },
      totalAmount: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOTotalamount_screen',
         label: 'users setting APO using Total amount due'
      },
      minimumAmount: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOMinimumamount_screen',
         label: 'users setting APO using Minimum amount due'
      },
      chooseAmount: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOChooseamount_screen',
         label: 'users setting APO using choose amount'
      },
      timeTakenOnAmountScreen: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOtimetakenonAmount_screen',
         label: 'Time taken by a user on selecting a Payment amount'
      },
      timeTakenOnDateScreen: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOtimetakenonDate_screen',
         label: 'Time taken by a user on selecting a Payment Date'
      },
      termsAndConditionConsent: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOConsentforT&C_screen',
         label: 'giving consent for the Terms and Conditions while Adding APO '
      },
      timeTakenOnAPOScreen: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOtimetakenforAPO_screen',
         label: 'Time taken by a user to complete setting up the APO from start to end'
      },
      cancelInDeleteApo: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APOCancelDelete_screen',
         label: 'users clicking on Cancel in the pop up for Delete APO'
      },
      dropOff: {
         category: 'Automatic Payment Order', eventAction: 'click_on_APO_screen_dropoff',
         label: 'users dropping off from the service without completing the flow'
      },
      dropOffFromPayFrom: {
         category: 'Automatic Payment Order', eventAction: 'click_on_payfromscreen_dropoff',
         label: 'Number of users dropping off from the service without completing the flow from Pay from screen'
      },
      dropOffFromPaymentAmount: {
         category: 'Automatic Payment Order', eventAction: 'click_on_paymentamountscreen_dropoff',
         label: 'Number of users dropping off from the service without completing the flow from Payment amount screen'
      },
      dropOffFromPaymentDate: {
         category: 'Automatic Payment Order', eventAction: 'click_on_paymentdatescreen_dropoff',
         label: 'Number of users dropping off from the service without completing the flow from Payment date screen'
      },
      addNewApo: {
         category: 'Automatic Payment Order', eventAction: 'click_on_submitapo_add_sceen',
         label: 'Number of clients who have clicked on Submit button and added New APO'
      },
      editApo: {
         category: 'Automatic Payment Order', eventAction: 'click_on_submitapo_edit_sceen',
         label: 'Number of clients who have clicked on Submit button and perform editing APO'
      },
      deleteApo: {
         category: 'Automatic Payment Order', eventAction: 'click_on_deleteapo_screen',
         label: 'Number of clients who have clicked on the second and the final Delete button and confirm deleting APO'
      }
   };

   public static RequestCreditLimitIncrease = {
      viewCreditLimitIncrease: {
         category: 'Request Credit Limit Increase', eventAction: 'view_credit_limit_increase_screen',
         label: ''
      },
      createCreditLimitIncrease: {
         category: 'Request Credit Limit Increase', eventAction: 'create_credit_limit_increase_action',
         label: 'i can view "credit limit increase" usage report so that I can track and monitor traffic for this feature'
      },
      dropOffFromIncomeAndExpenses: {
         category: 'Request Credit Limit Increase', eventAction: 'credit_limit_increase_income_expenses_drop_off_action',
         label: 'users dropping off from the income and expenses option without completing the flow'
      },
      dropOffFromDocumentConsent: {
         category: 'Request Credit Limit Increase', eventAction: 'credit_limit_increase_document_consent_drop_off_action',
         label: 'users dropping off from the document consent option without completing the flow'
      },
      dropOffFromBankDetails: {
         category: 'Request Credit Limit Increase', eventAction: 'credit_limit_increase_bank_details_drop_off_action',
         label: 'users dropping off from the bank details option without completing the flow'
      },
      dropOffFromContactDetails: {
         category: 'Request Credit Limit Increase', eventAction: 'credit_limit_increase_contact_details_drop_off_action',
         label: 'users dropping off from the conatct details option without completing the flow'
      },
      dropOffFromSummary: {
         category: 'Request Credit Limit Increase', eventAction: 'credit_limit_increase_summary_drop_off_action',
         label: 'users dropping off from the summary option without completing the flow'
      }
   };

   public static statementsAndDocuments = {
      request: {
         category: 'request_doc_{0}_statements_and_documents', eventAction: 'request_doc_{0}_{1}',
         label: 'On click of requesting if the paidup letter'
      },
      success: {
         category: 'request_doc_{0}_statements_and_documents', eventAction: 'request_doc_{0}_{1}_success',
         label: 'On successfull response of the request'
      }
   };

   public static it3b = {
      downloadIT3B: {
         category: 'Features tax certificate', eventAction: 'taxcertificate_view',
         label: 'Number of clients downloading tax certificates for each product_'
      }
   };
   public static statementDownload = {
      statementAction: {
         category: 'Statement Download', eventAction: 'statement_action',
         label: 'Number of users who select the statements tag'
      },
      statementScreenPdf: {
         category: 'Statement Download', eventAction: 'statement_screen_pdf',
         label: 'Number of users who select PDF tab - screen view(PDF)'
      }
   };

}

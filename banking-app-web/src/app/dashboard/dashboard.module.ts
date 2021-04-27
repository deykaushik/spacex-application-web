import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LandingComponent } from './landing/landing.component';
import { GreetingComponent } from './greeting/greeting.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountWidgetComponent } from './account-widget/account-widget.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountPocketsComponent } from './account-pockets/account-pockets.component';
import { PocketDetailComponent } from './pocket-detail/pocket-detail.component';
import { AccountService } from './account.service';
import { PaymentService } from './../payment/payment.service';
import { SharedModule } from './../shared/shared.module';
import { AccountCardComponent } from './account-card/account-card.component';
import { AccountTransactionsComponent } from './account-transactions/account-transactions.component';
import { ScheduledPaymentsComponent } from './scheduled-payments/scheduled-payments.component';
import { ScheduledCardComponent } from './scheduled-card/scheduled-card.component';
import { QuickpayComponent } from './quickpay/quickpay.component';
import { DebitOrdersComponent } from './debit-orders/debit-orders.component';
import { ReverseOrderComponent } from './debit-orders/reverse-order/reverse-order.component';
import { ReverseOrderStatusComponent } from './debit-orders/reverse-order-status/reverse-order-status.component';
import { UpliftDormancyComponent } from './uplift-dormancy/uplift-dormancy.component';
import { GameModule } from '../buy/game/game.module';
import { StatementPreferencesComponent } from './statement-preferences/statement-preferences.component';
import {
   StatementPreferencesEmailComponent
} from './statement-preferences/statement-preferences-email/statement-preferences-email.component';
import {
   StatementPreferencesPostalComponent
} from './statement-preferences/statement-preferences-postal/statement-preferences-postal.component';
import { AccountViewMoreDetailComponent } from './account-view-more-detail/account-view-more-detail.component';
import { AccountShareComponent } from './account-share/account-share.component';
import { AccountShareStatusComponent } from './account-share/account-share-status/account-share-status.component';
import { AddRecipientsComponent } from './account-share/add-recipients/add-recipients.component';
import { JoinGreenbacksComponent } from './enrolment/join-greenbacks/join-greenbacks.component';
import { GreenbacksConfirmationComponent } from './enrolment/greenbacks-confirmation/greenbacks-confirmation.component';
import { LocateBranchComponent } from './uplift-dormancy/locate-branch/locate-branch.component';
import { BranchLocatorModule } from '../branch-locator/branch-locator.module';
import { AccountBalanceDetailComponent } from './account-balance-detail/account-balance-detail.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AccountTransactionDetailsComponent } from './account-transaction-details/account-transaction-details.component';
import { DirectPayComponent } from './settlement/direct-pay/direct-pay.component';
import { SettlementTermsComponent } from './settlement/direct-pay/settlement-terms/settlement-terms.component';
import { OtherPaymentModesComponent } from './settlement/direct-pay/other-payment-modes/other-payment-modes.component';
import { TransferNowComponent } from './settlement/direct-pay/transfer-now/transfer-now.component';
import { RequestQuoteComponent } from './settlement/request-quote/request-quote.component';
import { RequestQuoteEmailComponent } from './settlement/request-quote/request-quote-email/request-quote-email.component';
import { OverdraftLimitViewComponent } from './overdraft/overdraft-limit-view/overdraft-limit-view.component';
import { OverdraftLimitCancelComponent } from './overdraft/overdraft-limit-cancel/overdraft-limit-cancel.component';
import { OverdraftLimitChangeComponent } from './overdraft/overdraft-limit-change/overdraft-limit-change.component';
import { OverdraftLimitSuccessComponent } from './overdraft/overdraft-limit-success/overdraft-limit-success.component';
import { OverdraftLimitFicaComponent } from './overdraft/overdraft-limit-fica/overdraft-limit-fica.component';
import { RequestQuoteStatusComponent } from './settlement/request-quote/request-quote-status/request-quote-status.component';

import { ProfileService } from '../profile/profile.service';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { DebitOrderDetailComponent } from './debit-orders/debit-order-detail/debit-order-detail.component';
import { CancelStopOrderComponent } from './debit-orders/cancel-stop-order/cancel-stop-order.component';
import { StopDebitOrderComponent } from './debit-orders/stop-debit-order/stop-debit-order.component';
import {
   EditPostalAddressComponent
} from './statement-preferences/statement-preferences-postal/edit-postal-address/edit-postal-address.component';
import { StatementsDocumentsComponent } from './statements-documents/statements-documents.component';
import { DocumentsComponent } from './statements-documents/documents/documents.component';
import { StatementComponent } from './statements-documents/statement/statement.component';
import { StatementCasaComponent } from './statements-documents/statement/statements-CASA/statement-casa.component';
import { PreferencesComponent } from './statements-documents/preferences/preferences.component';
import { DocumentEmailComponent } from './statements-documents/documents/document-email/document-email.component';
import { IncomeTaxDetailsComponent } from './statements-documents/documents/document-IT3B/income-tax-details.component';
import { BuyService } from '../buy/buy-prepaid/buy.service';
import { ButtonsModule } from 'ngx-bootstrap';
import { PocketTripsComponent } from './pocket-trips/pocket-trips.component';
import { MyTripsComponent } from './my-trips/my-trips.component';
import { LoadTripComponent } from './load-trip/load-trip.component';
import { LoadTripStatusComponent } from './load-trip-status/load-trip-status.component';
import { DataService } from './fund-trip/data.service';
import { ManagePaymentDetailsComponent } from './manage-payment-details/manage-payment-details.component';
import { WorkflowService } from '../core/services/stepper-work-flow-service';
import { UpdateLoanDetailsComponent } from './manage-payment-details/update-loan-details/update-loan-details.component';
import { LoanDetailsComponent } from './manage-payment-details/loan-details/loan-details.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionSearchComponent } from './transaction-search/transaction-search.component';
import { CreditLandingComponent } from './credit-limit-increase/credit-landing/credit-landing.component';
import { ContactDetailsComponent } from './credit-limit-increase/contact-details/contact-details.component';
import { CreditDocumentsComponent } from './credit-limit-increase/documents/documents.component';
import { CreditSummaryComponent } from './credit-limit-increase/summary/summary.component';
import { CreditSuccessComponent } from './credit-limit-increase/success/success.component';
import { RequestCreditLimitComponent } from './credit-limit-increase/request-credit-limit/request-credit-limit.component';
import { IncomeExpensesComponent } from './credit-limit-increase/income-expenses/income-expenses.component';
import { ReviewComponent } from './credit-limit-increase/review/review.component';
import { CreditLimitService } from './credit-limit-increase/credit-limit.service';
import { MfcLandingComponent } from './statements-documents/documents/document-mfc/mfc-landing/mfc-landing.component';
import { TravelInformationComponent } from './statements-documents/documents/document-mfc/travel-information/travel-information.component';
import { DriverInformationComponent } from './statements-documents/documents/document-mfc/driver-information/driver-information.component';
import { EmailComponent } from './statements-documents/documents/document-mfc/email/email.component';
import { StatusComponent } from './statements-documents/documents/document-mfc/status/status.component';

// Online Investment Changes
import { AccountWithdrawalComponent } from './account-withdrawal/account-withdrawal.component';
import { ViewNoticesComponent } from './view-notices/view-notices.component';
import { ApplyNewAccountComponent } from './apply-new-account/apply-new-account.component';
@NgModule({
   imports: [
      CommonModule,
      SharedModule,
      DashboardRoutingModule,
      GameModule,
      BranchLocatorModule,
      CollapseModule.forRoot(),
      SortableModule.forRoot(),
      ButtonsModule.forRoot()
   ],
   declarations: [LandingComponent, GreetingComponent, AccountsComponent, AccountWidgetComponent,
      AccountDetailComponent, QuickpayComponent, AccountCardComponent, AccountTransactionsComponent, ScheduledPaymentsComponent,
      ScheduledCardComponent, DebitOrdersComponent, ReverseOrderComponent,
      ReverseOrderStatusComponent, UpliftDormancyComponent, LocateBranchComponent,
      AccountBalanceDetailComponent, AccountTransactionDetailsComponent, OverdraftLimitViewComponent,
      OverdraftLimitCancelComponent, OverdraftLimitChangeComponent, OverdraftLimitSuccessComponent, OverdraftLimitFicaComponent,
      JoinGreenbacksComponent, GreenbacksConfirmationComponent, AccountViewMoreDetailComponent, PocketDetailComponent,
      AccountShareComponent, AddRecipientsComponent, AccountShareStatusComponent, DirectPayComponent, AccountPocketsComponent,
      RequestQuoteComponent, SettlementTermsComponent, RequestQuoteEmailComponent, OtherPaymentModesComponent, TransferNowComponent,
      StatementPreferencesComponent, StatementPreferencesEmailComponent, StatementPreferencesPostalComponent, EditPostalAddressComponent,
      RequestQuoteStatusComponent, DebitOrderDetailComponent, CancelStopOrderComponent, StopDebitOrderComponent,
      PocketTripsComponent, MyTripsComponent, LoadTripComponent, LoadTripStatusComponent,
      ManagePaymentDetailsComponent, UpdateLoanDetailsComponent, LoanDetailsComponent, AccountWithdrawalComponent, ViewNoticesComponent,
      StatementsDocumentsComponent, DocumentsComponent, StatementComponent, PreferencesComponent, DocumentEmailComponent,
      TransactionListComponent, TransactionSearchComponent, CreditLandingComponent, CreditSummaryComponent, CreditSuccessComponent,
      ContactDetailsComponent, CreditDocumentsComponent, RequestCreditLimitComponent, IncomeExpensesComponent,
      ReviewComponent, StatementCasaComponent, IncomeTaxDetailsComponent, EmailComponent, MfcLandingComponent, TravelInformationComponent,
      DriverInformationComponent, StatementCasaComponent, StatusComponent, ApplyNewAccountComponent],
   providers: [AccountService, PaymentService, ProfileService, BuyService, WorkflowService, CreditLimitService, DataService, DecimalPipe],
   entryComponents: [
      JoinGreenbacksComponent, GreenbacksConfirmationComponent, CreditLandingComponent, CreditSummaryComponent, CreditSuccessComponent,
      ContactDetailsComponent, CreditDocumentsComponent, RequestCreditLimitComponent, IncomeExpensesComponent,
      ReviewComponent, EmailComponent, MfcLandingComponent, TravelInformationComponent,
      DriverInformationComponent, MyTripsComponent]
})
export class DashboardModule { }

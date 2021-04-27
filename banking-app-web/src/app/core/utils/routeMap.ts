export class Mapping {
   public static Routes = [
      { 'page': 'payment', category: 'pay', label: 'Accounts' },
      { 'page': 'payment/status', category: 'pay', label: 'Confirmation' },
      { 'page': 'payment/[0-9]+', category: 'pay', label: 'Accounts' },
      { 'page': 'buy', category: 'Buy Prepaid', label: 'Recipient and Provider' },
      { 'page': 'buy/status', category: 'Buy Prepaid', label: 'Confirmation' },
      { 'page': 'cards', category: 'Card Management', label: 'Card Management' },
      { 'page': 'recipient', category: 'Recipients', label: 'Add recipients' },
      { 'page': 'buyElectricity', category: 'Buy Electricity', label: 'Recipient and meter number' },
      { 'page': 'game', category: 'Buy Lotto', label: 'How to play' },
      { 'page': 'dashboard', category: 'Dashboard', label: 'Accounts' },
      { 'page': 'transfer', category: 'Transfer', label: 'Amount and Account' },
      { 'page': 'profile', category: 'My Profile', label: 'Your profile' },
      { 'page': 'dashboard/account/detail/[0-9]+', category: 'Account Detail', label: 'Account card' },
      { 'page': 'dashboard/account/scheduled/[0-9]+', category: 'Scheduled Payments', label: 'View scheduled payments' },
      { 'page': 'profile/profile-details', category: 'My Profile', label: 'Your profile' },
      { 'page': 'profile/change-password', category: 'My Profile', label: 'Change password' },
      { 'page': 'branchlocator', category: 'Finid Atm and Branch', label: 'Find ATM' },
      { 'page': 'dashboard/account/detail/[0-9]+/debit-orders', category: 'Debit orders', label: 'Reverse debit order' },
      { 'page': 'settings/profile-limits', category: 'Settings', label: 'Profile Limits' },
      { 'page': 'settings/link-accounts', category: 'Settings', label: 'Link Accounts' },
      { 'page': 'settings/account-visibility', category: 'Settings', label: 'Hide and show accounts' },
      { 'page': 'feedback', category: 'Feedback', label: 'Web Feedback' },
   ];
   public static SubRoutes = [
      // payment
      { 'component': 'PayToComponent', 'page': 'payment-recipient', label: 'Recipient details' },
      { 'component': 'PayAmountComponent', 'page': 'payment-amount', label: 'Amount and Account' },
      { 'component': 'PayForComponent', 'page': 'payment-notification', label: 'Notification' },
      { 'component': 'PayReviewComponent', 'page': 'payment-review', label: 'Review' },
      // transfer
      { 'component': 'TransferAmountComponent', 'page': 'transfer-amount', label: 'Amount and Account' },
      { 'component': 'TransferReviewComponent', 'page': 'transfer-review', label: 'Review' },
      { 'component': 'TransferStatusComponent', 'page': 'transfer-confirmation', label: 'Confirmation' },
      // buy prepaid
      { 'component': 'BuyToComponent', 'page': 'buy-prepaid-to', label: 'Recipient and Provider' },
      { 'component': 'BuyAmountComponent', 'page': 'buy-prepaid-amount', label: 'Bundle type and account' },
      { 'component': 'BuyForComponent', 'page': 'buy-prepaid-for', label: 'Notification' },
      { 'component': 'BuyReviewComponent', 'page': 'buy-prepaid-review', label: 'Review' },
      { 'component': 'BuyStatusComponent', 'page': 'buy-prepaid-confirmation', label: 'Confirmation' },
      // buy electricity
      { 'component': 'BuyElectricityToComponent', 'page': 'buy-electricity-to', label: 'Recipient and meter number' },
      { 'component': 'BuyElectricityAmountComponent', 'page': 'buy-electricity-amount', label: 'Amount and Account' },
      { 'component': 'BuyElectricityForComponent', 'page': 'buy-electricity-for', label: 'Notification' },
      { 'component': 'BuyElectricityReviewComponent', 'page': 'buy-electricity-review', label: 'Review' },
      { 'component': 'BuyElectricityStatusComponent', 'page': 'buy-electricity-confirmation', label: 'Confirmation' },
      // buy lotto
      { 'component': 'SelectGameComponent', 'page': 'buy-lotto-to', label: 'How to play' },
      { 'component': 'SelectNumbersComponent', 'page': 'buy-lotto-amount', label: 'How many boards' },
      { 'component': 'SelectGameForComponent', 'page': 'buy-lotto-for', label: 'Notification' },
      { 'component': 'SelectGameReviewComponent', 'page': 'buy-lotto-review', label: 'Review' }
   ];
}

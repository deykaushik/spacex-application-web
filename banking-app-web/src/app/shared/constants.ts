import { ISubmenu } from './models';
import { TermsAndConditionsConstants } from './terms-and-conditions/constants';

export class SharedConstants {
   public static TrusteerMessages = {
      protectMessage: 'Protect your personal information and bank account against identity theft and fraud.',
      antivirusMessage: 'Works with antivirus solutions, stopping threats they can’t protect you from.',
      rapportMessage: 'Trusteer Rapport is effective, easy to use, and won’t slow down your computer.'
   };
}
export class SubmenuConstants {
   public static VariableValues = {
      buySubmenu: [
         {
            id: 'prepaid',
            text: 'Prepaid',
            termsText: null,
            iconCls: 'mobile',
            path: 'buy',
            disable: false,
            termsTypes: [],
            eventAction: 'click_on_buy_prepaid_header'
         },
         {
            id: 'prepaidelec',
            text: 'Electricity',
            termsText: 'electricity',
            iconCls: 'electricity',
            path: 'buyElectricity',
            disable: false,
            termsTypes: TermsAndConditionsConstants.includeTermsPrepaid,
            eventAction: 'click_on_buy_electricity_header'
         },
         {
            id: 'lotto',
            text: 'LOTTO',
            termsText: 'LOTTO and Powerball',
            iconCls: 'lotto',
            path: 'game',
            disable: false,
            termsTypes: TermsAndConditionsConstants.includeTermsLotto
         }
      ],
      logoutMenu: [{ text: 'Logout', iconCls: 'menu-logoff', path: 'auth/logoff', activeRoutes: ['auth/logoff'] }],
      profileSubMenu: [
         { text: 'Profile', iconCls: 'new-recipient', path: 'profile' },
         { text: 'Settings', iconCls: 'menu-settings', path: 'settings' }
      ]
   };
}


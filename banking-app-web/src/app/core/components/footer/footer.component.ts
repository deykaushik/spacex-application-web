import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { BaseComponent } from '../base/base.component';
import { WindowRefService } from '../../../core/services/window-ref.service';

@Component({
   selector: 'app-footer',
   templateUrl: './footer.component.html',
   styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends BaseComponent {

   isAuthenticated: Boolean;
   constructor(private router: Router, private authservice: AuthGuardService,
      private windowrefservice: WindowRefService,
      injector: Injector) {
      super(injector);
      authservice.isAuthenticated.subscribe(isAuthenticated => {
         let footerItem = null;
         this.isAuthenticated = isAuthenticated;
         footerItem = this.footerItems.find(x => x.text === 'Terms and Conditions');

         if (footerItem) {
            if (isAuthenticated) {
               footerItem.link = 'https://www.nedbank.co.za/content/dam/nedbank/Forms/Terms%20and%20Conditions/' +
                  'Personal/Self%20Service/TERMS_AND_CONDITIONS_OF_USE_OF_Self_Service_Banking.pdf';
            } else {
               footerItem.link = 'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/aboutus/legal/terms-conditions.html';
            }
         }
      });

   }

   public footerItems: Array<any> = [
      {
         iconCls: 'contact',
         text: 'Contact',
         pathLink: ['feedback', 'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/aboutus/contact-us.html'],
         eventAction: 'click_on_contact',
         target: '_blank',
         key: 'contact'
      },
      {
         iconCls: 'icon-location',
         text: 'Find an ATM or branch',
         path: 'branchlocator',
         eventAction: 'click_on_branch_atm_locator_footer',
         key: 'branchlocator'
      },
      {
         iconCls: 'icon-help',
         text: 'Help',
         link: 'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/supplimentary/MoneyWeb.html',
         target: '_blank',
         eventAction: 'click_on_help_footer',
         key: 'help'
      },
      {
         iconCls: 'TnC',
         text: 'Terms and conditions',
         link: 'https://www.nedbank.co.za/content/nedbank/desktop/gt/en/aboutus/legal/terms-conditions.html',
         target: '_blank',
         eventAction: 'click_on_terms_and_conditions_footer',
         key: 'tnc'
      }
   ];

   onItemClick(item) {
      if (item.eventAction) {
         this.sendEvent(item.eventAction, 'Footer', null, 'Footer');
      }
      if (item.link) {
         this.windowrefservice.nativeWindow.open(item.link, item.target);
      } else if (item.path) {
         this.router.navigate(['/' + this.isAuthenticated ? item.path : item.path]);
      } else if (item.pathLink) {
         if (this.isAuthenticated) {
            this.router.navigate(['/' + item.pathLink[0]]);
         } else {
            this.windowrefservice.nativeWindow.open(item.pathLink[1], item.target);
         }
      }
   }
}

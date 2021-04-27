import { Component, Inject, Injector, EventEmitter, Output, ViewChildren, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';

import { Constants } from '../../utils/constants';
import { SubmenuConstants } from '../../../shared/constants';
import { IClientDetails, IPreApprovedOffers } from '../../services/models';
import { IHeaderMenuModel } from '../../../shared/models';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { ClientProfileDetailsService } from '../../services/client-profile-details.service';
import { CommonUtility } from '../../utils/common';
import { HeaderMenuService } from '../../services/header-menu.service';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { BaseComponent } from '../base/base.component';
import { environment } from '../../../../environments/environment';
import { BsDropdownDirective } from 'ngx-bootstrap';
import { PreApprovedOffersService } from '../../services/pre-approved-offers.service';

@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.scss']
})

export class HeaderComponent extends BaseComponent {
   showBellIcon: boolean;
   showPulsatingIcon: boolean;
   @Output() togglePreApprovedOffers = new EventEmitter<boolean>();
   unreadOffers: IPreApprovedOffers[] = [];
   notificationIconCliked: boolean;
   mobileMenuOpened = false;
   selectedMenuItem: any;
   isAuthenticated = false;
   currentUrl = '';
   buySubMenuOptions = SubmenuConstants.VariableValues.buySubmenu;
   profileSubMenuOptions = SubmenuConstants.VariableValues.profileSubMenu;
   logoutMenu = SubmenuConstants.VariableValues.logoutMenu[0];
   profileMenu = Constants.labels.headerMenuLables.profile;
   notificationTitle = Constants.preApprovedOffers.labels.notification;
   agentMobile = Constants.preApprovedOffers.labels.agentMobile;
   settingsSubMenuOptions: Array<any>;
   clientInitials: string;
   clientFullName: string;
   routeUrls = Constants.routeUrls;
   selectedUserMenu: any;
   selectedBuyMenu: any;
   submenuindex = -1;
   showAnnualCreditReview = environment.features.annualCreditReview;
   menusLabel = Constants.VariableValues.settings.navMenus;
   annualCreditReviewLabel = Constants.labels.menuAnnualCreditReview;
   chatActive = false;
   @ViewChildren('topMenu') menu;
   showPreApprovedOffers = environment.features.preApprovedOffers;
   isPreApprovedOffersEnabled = environment.features.preApprovedOffers;
   /* main menu items shown on top */

   @Output()
   change: EventEmitter<boolean> = new EventEmitter<boolean>();

   public settingsMenuObj: IHeaderMenuModel = {
      iconCls: 'menu-settings', text: 'Settings', path: 'settings', mobOnly: true, subMenu:
      (this.showAnnualCreditReview ? this.menusLabel : this.menusLabel.filter(menu => menu.label !== this.annualCreditReviewLabel))
         .map((m) => {
            return {
               text: m.label,
               path: ('settings/' + m.url),
               iconCls: ''
            };
         }),
      eventAction: 'click_on_settings_icon_header'
   };
   public profileMenuObj: IHeaderMenuModel = {
      iconCls: 'new-recipient', text: this.profileMenu, path: 'profile', mobOnly: true, subMenu:
      Constants.VariableValues.profile.navMenus
         .map((m) => {
            return {
               text: m.label,
               path: ('profile/' + m.url),
               iconCls: ''
            };
         }),
      eventAction: 'click_on_profile_icon_header'
   };
   public contactsMenuObj: IHeaderMenuModel = {
      iconCls: 'menu-contact-us',
      text: 'Contact us', path: 'feedback', mobOnly: true, activeRoutes: ['/feedback'],
      eventAction: 'click_on_feedback_icon_header'
   };

   public mainMenuItems: IHeaderMenuModel[] = [
      {
         iconCls: 'menu-apply-icon', text: 'Apply', path: 'open-account', mobOnly: true,
         activeRoutes: ['/open-account'], eventAction: 'click_on_apply_header'
      },
      { iconCls: 'menu-overview', text: 'Overview', path: 'dashboard', mobOnly: false, activeRoutes: ['/dashboard'] },
      {
         iconCls: 'menu-pay-icon', text: 'Pay', path: 'payment', mobOnly: false,
         activeRoutes: ['/payment'], eventAction: 'click_on_pay_header'
      },
      {
         iconCls: 'menu-transfer', text: 'Transfer', path: 'transfer', mobOnly: false,
         activeRoutes: ['/transfer'], eventAction: 'click_on_transfer_header'
      },
      {
         iconCls: 'menu-buy-icon', text: 'Buy', subMenu: this.buySubMenuOptions, path: null, mobOnly: false,
         activeRoutes: ['/buyElectricity', '/buy']
      },
      {
         iconCls: 'menu-cards-icon', text: 'Cards', path: 'cards', mobOnly: false,
         activeRoutes: ['/cards'], eventAction: 'click_on_cards_header'
      },
      {
         iconCls: 'menu-recipient-icon', text: 'Recipients', path: 'recipient', mobOnly: false,
         activeRoutes: ['/recipient'], eventAction: 'click_on_recipients_header'
      },
      this.settingsMenuObj,
      {
         iconCls: 'menu-logoff', text: 'Logout', path: 'auth/logoff',
         mobOnly: true
      }
   ];

   constructor( @Inject(DOCUMENT) private document: Document, private router: Router,
      private authservice: AuthGuardService,
      private clientProfileDetailsService: ClientProfileDetailsService,
      private headerMenuService: HeaderMenuService,
      private beneficiaryService: BeneficiaryService,
      private preApprovedOffersService: PreApprovedOffersService,
      injector: Injector) {
      super(injector);
      this.selectedMenuItem = { subMenu: [] };
      authservice.isAuthenticated.subscribe(myIsAuthenticated => {
         this.isAuthenticated = myIsAuthenticated;
      });
      this.subscribeRouteEvents();
      this.subscribeClientProfileObserver();
      this.subscribeClientDetails();
      this.subscribeHeaderOpen();
      this.subscribePreApprovedOffers();
   }

   chekActiveRout() {
      let temp = false;
      this.mainMenuItems.forEach((item: IHeaderMenuModel): boolean => {
         item.active = false;
         if (item && item.activeRoutes && item.activeRoutes && item.activeRoutes.length) {
            if (item.activeRoutes.indexOf(this.currentUrl) > -1) {
               item.active = true;
               temp = true;
            }
         }
         return true;
      });
      return temp;
   }

   subscribeClientDetails() {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe((data: IClientDetails) => {
         if (data && data.BirthDate) {
            this.checkAge(data.BirthDate);
         }
      });
   }
   subscribeHeaderOpen() {
      this.headerMenuService.headerMenuOpener().subscribe((menuText?: string) => {
         if (menuText) {
            const combinedMenu = [...this.mainMenuItems, { ...this.profileMenuObj }].find(m => m.text === menuText);
            this.toggleMobileMenu();
            this.onMenuItemClick(combinedMenu);
         } else {
            this.toggleMobileMenu();
         }
      });
   }

   checkAge(date) {
      const lottoItem = this.buySubMenuOptions.find(x => x.id === 'lotto');
      if (lottoItem) {
         const age = moment.duration(moment().diff(date)).years();
         if (age < Constants.VariableValues.lottoAgeLimit) {
            this.buySubMenuOptions.splice(2, 1);
         }
      }
   }

   toggleMobileMenu() {
      this.mobileMenuOpened = !this.mobileMenuOpened;
      if (this.mobileMenuOpened) {
         this.document.body.classList.add('no-scroll');
      } else {
         this.document.body.classList.remove('no-scroll');
      }
   }

   onMenuItemClick(item) {
      if (item.path === Constants.labels.recipient) {
         this.beneficiaryService.selectedBeneficiary.next(null);
      }
      if (item.path) {
         this.router.navigate(['/' + item.path]);
      }
      if (this.mobileMenuOpened && !item.subMenu) {
         this.toggleMobileMenu();
      }
      this.selectedMenuItem = item;
      if (item.eventAction) {
         this.sendEvent(item.eventAction, 'Header', null, 'Header');
      }
   }

   onSubMenuItemClick(item) {
      if (this.mobileMenuOpened && !item.subMenu) {
         this.toggleMobileMenu();
         this.closeSubMenu();
      }
   }
   closeSubMenu() {
      this.selectedMenuItem = { subMenu: [] };
   }
   onSubMenuOpened(event: any) {
      this.selectedBuyMenu = this.buySubMenuOptions.find(m => this.router.url.split('/').indexOf(m.path) !== -1);
   }
   onProfileMenuOpened(event: any) {
      this.selectedUserMenu = this.profileSubMenuOptions.find(m => this.router.url.split('/').indexOf(m.path) !== -1);
   }
   private subscribeClientProfileObserver() {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe(response => {
         if (response) {
            this.clientFullName = (response.PreferredName || response.FirstName);
            this.clientInitials = CommonUtility.getAcronymName(response.FullNames);
         } else {
            this.clientInitials = '';
         }
      });
   }
   private subscribeRouteEvents() {
      this.router.events.subscribe((event) => {
         if (event instanceof NavigationEnd) {
            this.currentUrl = event.url;
            this.checkForDashboard();
            this.chekActiveRout();
         }
      });
   }
   private subscribePreApprovedOffers() {
      this.preApprovedOffersService.offersObservable.subscribe(offers => {
         this.unreadOffers = this.preApprovedOffersService.unreadOffers;
         this.showPulsatingIcon = this.unreadOffers.length > 0 && !this.preApprovedOffersService.notificationSliderStatus;
         this.showBellIcon = !this.showPulsatingIcon;
      }
      );
   }

   chatBoxOpen() {
      this.chatActive = !this.chatActive;
      this.change.emit(this.chatActive);
   }
   handleSubmenu(el?: BsDropdownDirective) {
      if (this.menu._results.length) {
         this.menu._results.forEach(element => {
            if (element !== el) {
               element.hide();
            }
         });
      }
   }
   public onNotificationClicked(agent?: string) {
      this.showBellIcon = true;
      if (agent === this.agentMobile) {
         this.toggleMobileMenu();
         this.router.navigateByUrl('/offers');
      } else {
         this.preApprovedOffersService.toggleSlider();
      }
   }
   checkForDashboard() {
      this.showPreApprovedOffers = this.currentUrl === Constants.routeUrls.dashboard || this.currentUrl === '/';
   }
}

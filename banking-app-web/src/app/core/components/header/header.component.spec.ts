import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsDropdownModule, BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';

import { assertModuleFactoryCaching } from './../../../test-util';
import { DpArrowNavigationDirective } from './../../../shared/directives/dp-arrow-navigation.directive';
import { ClientProfileDetailsService } from '../../services/client-profile-details.service';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { TokenManagementService } from '../../services/token-management.service';
import { TokenRenewalService } from '../../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { HeaderMenuService } from '../../services/header-menu.service';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { GaTrackingService } from '../../services/ga.service';
import { WindowRefService } from '../../services/window-ref.service';
import { HeaderComponent } from './header.component';
import { PreApprovedOffersService } from '../../services/pre-approved-offers.service';

const mainMenuItems: Array<any> = [
   { iconCls: 'menu-overview', text: 'Overview', path: 'dashboard' },
   { iconCls: 'menu-pay-icon', text: 'Pay', path: 'payment' },
   { iconCls: 'menu-transfer', text: 'Transfer', path: 'transfer' },
   { iconCls: 'menu-buy-icon', text: 'Buy', subMenu: this.buySubMenuOptions },
   { iconCls: 'menu-cards-icon', text: 'Cards', path: 'cards' },
   { iconCls: 'menu-finance-icon', text: 'Finances', path: 'finances' }
];

const clientDetailsObserver = new Subject();
const responseMock = {
   FullNames: 'ruth test',
   BirthDate: '1947-09-21T22:00:00Z'
};

const routerTestingParam = [
   { path: 'abc', component: HeaderComponent },
   { path: 'settings', component: HeaderComponent },
   { path: 'profile', component: HeaderComponent },
   { path: 'feedback', component: HeaderComponent },
   { path: 'dashboard', component: HeaderComponent },
   { path: 'payment', component: HeaderComponent },
   { path: 'transfer', component: HeaderComponent },
   { path: 'cards', component: HeaderComponent },
   { path: 'recipient', component: HeaderComponent },
   { path: 'auth/logoff', component: HeaderComponent },
];

const beneficiaryServiceStub = {
   selectedBeneficiary: new Subject()
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
const preApprovedOffersServiceStub = {
   offersObservable: new Subject(),
   toggleSlider: jasmine.createSpy('toggleSlider'),
   unreadOffers: [1]
};
const mockOfferData = [{
   'id': 12345,
   'shortMessage': 'A personal loan is available',
   'message': 'You could qualify for a personal loan of up to<br><b>R50 000</b>, with a monthly instalment of R340.',
   'status': null,
   amount: 1000
}];
describe('HeaderComponent', () => {
   let component: HeaderComponent;
   let fixture: ComponentFixture<HeaderComponent>;
   let de: DebugElement;
   let el: HTMLElement;
   let body: HTMLElement;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam),
         BsDropdownModule.forRoot()],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [HeaderComponent, DpArrowNavigationDirective],
         providers: [
            AuthGuardService, TokenRenewalService,
            BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService,
            ModalBackdropComponent, ModalModule,
            { provide: Document },
            { provide: ElementRef },
            {
               provide: ClientProfileDetailsService, useValue: {
                  clientDetailsObserver: clientDetailsObserver
               }
            },
            TokenManagementService, HeaderMenuService,
            { provide: BeneficiaryService, useValue: beneficiaryServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            WindowRefService,
            { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub }
         ],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         de = fixture.debugElement.query(By.css('ul'));
         el = de.nativeElement;
         body = component['document'].body;
      });
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('body should have no-scroll class', () => {
      component.mobileMenuOpened = false;
      component.toggleMobileMenu();
      expect(body.classList.toString()).toContain('no-scroll');
   });
   it('body should have no-scroll class', inject([AuthGuardService], (authservice: AuthGuardService) => {
      authservice.isAuthenticated.emit(true);
      expect(component.isAuthenticated).toEqual(true);
   }));

   it('body should not have no-scroll class', () => {
      component.mobileMenuOpened = true;
      component.toggleMobileMenu();
      const classes = body.classList.toString().split(' ');
      classes.forEach(element => {
         expect(element).not.toBe('no-scroll');
      });
   });

   it('should invoke toggleMobileMenu on menu item click on mobile device', () => {
      component.mobileMenuOpened = true;
      component.onMenuItemClick(mainMenuItems);
      expect(component.mobileMenuOpened).toEqual(false);

      component.onMenuItemClick({ path: 'abc' });
      expect(component.mobileMenuOpened).toEqual(false);
   });

   it('should not invoke toggleMobileMenu on menu item click on mobile device', () => {
      component.mobileMenuOpened = false;
      component.onMenuItemClick(mainMenuItems);
      expect(component.mobileMenuOpened).toEqual(false);
   });

   it('should handle mobile sub-menu click', () => {
      component.mobileMenuOpened = false;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onSubMenuItemClick(mainMenuItems[0]);
         expect(component.selectedMenuItem).toBeTruthy();
      });

      component.mobileMenuOpened = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onSubMenuItemClick(mainMenuItems[3]);
         expect(component.selectedMenuItem.subMenu.length).toEqual(0);
      });

      component.mobileMenuOpened = true;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onSubMenuItemClick(mainMenuItems[0]);
         expect(component.selectedMenuItem).toBeTruthy();
      });
   });

   it('navigate to "search" takes you to /', inject([Router, Location], (router: Router, location: Location) => {
      router.navigate(['/']);
      expect(location.path()).toEqual('');
   }));

   it('should show active route if matches current URL', inject([Router, Location], (router: Router, location: Location) => {
      component.currentUrl = '/dashboard';
      expect(component.chekActiveRout()).toBe(true);
   }));

   it('should listen to Client observer', () => {
      clientDetailsObserver.next(null);
      clientDetailsObserver.next(responseMock);
   });
   it('should Hide lotto when age is less then 18', () => {
      responseMock.BirthDate = '2015-09-21T22:00:00Z';
      clientDetailsObserver.next(responseMock);
      expect(component.buySubMenuOptions.length).toBe(2);
   });
   it('should open menu from header', inject([HeaderMenuService], (service: HeaderMenuService) => {
      service.openHeaderMenu('Settings');
      expect(component.selectedMenuItem).toBeDefined();
   }));
   it('should open menu from header', inject([HeaderMenuService], (service: HeaderMenuService) => {
      service.openHeaderMenu(null);
      expect(component.selectedMenuItem.subMenu.length).toBe(0);
   }));
   it('should reset the selected beneficiary observer when the path is recipient',
      inject([HeaderMenuService], (service: HeaderMenuService) => {
         component.onMenuItemClick({ path: 'recipient' });
         clientDetailsObserver.subscribe(data => {
            expect(data).toBeNull();
         });
      }));
   it('should handle sub menu on buy or profile ', inject([HeaderMenuService], (service: HeaderMenuService) => {
      component.onSubMenuOpened(null);
      expect(component.selectedBuyMenu).toBeUndefined();
      component.onProfileMenuOpened(null);
      expect(component.selectedUserMenu).toBeUndefined();
   }));
   it('should toggle chatbox on chat icon click', () => {
      component.chatActive = false;
      component.chatBoxOpen();
      expect(component.chatActive).toBe(true);
   });
   it('should hide submenu on mouse enter', () => {
      component.isAuthenticated = true;
      fixture.detectChanges();
      const element = component.menu._results[3];
      element.show();
      component.handleSubmenu(element);
      expect(element.isOpen).toBeTruthy();
   });
it('should set showNotificationIcon when there are offers ', () => {
      preApprovedOffersServiceStub.offersObservable.next(mockOfferData);
      expect(component.showPulsatingIcon).toBeTruthy();
      preApprovedOffersServiceStub.offersObservable.next(null);
      expect(component.unreadOffers.length).toEqual(1);
   });
   it('should set showBellIcon when clicked on show notifcation', () => {
      component.onNotificationClicked();
      expect(component.showBellIcon).toBeTruthy();
      expect(preApprovedOffersServiceStub.toggleSlider).toHaveBeenCalled();
   });
});

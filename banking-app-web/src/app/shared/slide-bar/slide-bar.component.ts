import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPreApprovedOffers } from '../../core/services/models';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { preApprobedLoanOfferDummy } from '../../core/data/skeleton-data';
import { Constants } from '../../core/utils/constants';
import { Router } from '@angular/router';
import { IPayload } from '../../pre-approved-offers/pre-approved-offers.model';

@Component({
   selector: 'app-slide-bar',
   templateUrl: './slide-bar.component.html',
   styleUrls: ['./slide-bar.component.scss']
})
export class SlideBarComponent implements OnInit {
   showNotification: boolean;
   labels = Constants.preApprovedOffers.offerStatus;
   offers: IPreApprovedOffers[] = preApprobedLoanOfferDummy;
   skeletonMode = true;
   @Input() show: boolean;
   @Input() title: string;
   @Output() triggerSlider = new EventEmitter<boolean>();
   @Output() slideItemClick = new EventEmitter<IPreApprovedOffers>();
   @Input() hide: boolean;
   @Output() notificationClosed = new EventEmitter();

   constructor(private preApprovedOffersService: PreApprovedOffersService, private router: Router) { }

   ngOnInit() {
      this.preApprovedOffersService.offersObservable.subscribe(result => {
         this.offers = result || [];
         this.skeletonMode = false;
      });
      this.preApprovedOffersService.clickObserver.subscribe(click => {
         this.triggerSlider.emit(click);
         this.showNotification = click;
         this.skeletonMode = click;
      });
   }

   closeSlider(value) {
      if (this.hide) {
         this.preApprovedOffersService.getOffers(true);
         this.notificationClosed.emit();
      } else {
         this.preApprovedOffersService.toggleSlider();
         this.offers = preApprobedLoanOfferDummy;
      }
   }
   readNotification(value: IPreApprovedOffers) {
      const payLoad: IPayload = {
         status: Constants.preApprovedOffers.offerStatus.LOAN_OFFER_READ, reason: '',
         screen: Constants.preApprovedOffers.ScreenIdentifiers.DASHBOARD_SCREEN
      };
      this.preApprovedOffersService.changeOfferStatusById(payLoad, value.id).subscribe(response => {
         this.preApprovedOffersService.toggleSlider();
         this.preApprovedOffersService.InitializeWorkFlow();
         this.router.navigateByUrl('/offers/' + value.id);
      });
   }

}

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IPreApprovedOffers, IDashboardAccounts } from './models';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../environments/environment';
import { Constants } from '../utils/constants';
import { Subject } from 'rxjs/Subject';
import { GetStarted, Information, IWorkFlowSteps, IGetStarted, IInformation, ILoanInformation, Offer, IOffer
, Review, IDisclosure, Disclosure } from '../../pre-approved-offers/pre-approved-offers.model';

@Injectable()
export class PreApprovedOffersService {
   offerCode = Constants.VariableValues.accountContainers.loan;
   workflowSteps: IWorkFlowSteps;
   offerId: number;
   unreadOffers: IPreApprovedOffers[] = [];
   notificationSliderStatus: boolean;
   isPreApprovedOffersActive = environment.features.preApprovedOffers;
   feedbackPayload = [];

   offersObservable: BehaviorSubject<IPreApprovedOffers[]> = new BehaviorSubject<IPreApprovedOffers[]>(null);
   clickObserver: Subject<boolean> = new Subject<boolean>();

   constructor(private apiService: ApiService) { }

   public InitializeWorkFlow() {
      this.workflowSteps = {
         getStarted: new GetStarted(),
         information: new Information(),
         offer: new Offer(),
         review: new Review(),
         disclosure: new Disclosure()
      };
   }

   public getGetStartedVm() {
      return this.workflowSteps.getStarted;
   }

   public updateGetStartedVm(getStarted: IGetStarted) {
      this.workflowSteps.getStarted = getStarted;
   }
   public getGetInformationVm() {
      return this.workflowSteps.information;
   }

   public updateInformationVm(vm: IInformation) {
      this.workflowSteps.information = vm;
   }

   public getGetOfferVm() {
      return this.workflowSteps.offer;
   }

   public updateOfferVm(vm: IOffer) {
      this.workflowSteps.offer = vm;
   }

      public getGetReviewVm() {
            return this.workflowSteps.review;
      }

      public getGetDisclosureVm() {
            return this.workflowSteps.disclosure;
      }

   public getOffers(updateStatus?: boolean) {
      this.apiService.offers.getAll().subscribe(response => {
         const offers = response ? response.data : [];
         this.updatePresentedOffers(offers);
         if (updateStatus && this.unreadOffers.length > 0) {
            this.changeOfferStatus();
         }
      }, error => {
            console.log(error);
      }
      );
   }

   private updatePresentedOffers(offers: IPreApprovedOffers[]) {
      this.unreadOffers = this.getUnreadOffers(offers);
      this.offersObservable.next(offers);
   }

   public getUnreadOffers(offers: IPreApprovedOffers[]) {
      return offers ? offers.filter(offer => offer.status === Constants.preApprovedOffers.offerStatus.NEW_OFFER
         || offer.status === Constants.preApprovedOffers.offerStatus.OFFER_PRESENTED) : [];

   }
   private getPersonalLoanOffers() {
      return this.unreadOffers.filter(offer => offer.status === Constants.preApprovedOffers.offerStatus.NEW_OFFER);
   }
   getPreApprovedPersonalLoan() {
      const preApprovedPersonalLoans = this.getPersonalLoanOffers();
      if (preApprovedPersonalLoans.length === 0) {
         return undefined;
      }
      let maxIndex = 0;
      let maxLoanAmount = 0;
      preApprovedPersonalLoans.map((loan, index) => {
         const loanAmount = loan.amount;
         if (loanAmount  > maxLoanAmount) {
            maxLoanAmount = loanAmount;
            maxIndex = index;
         }
      });
      return { id: preApprovedPersonalLoans[maxIndex].id, loanAmount: maxLoanAmount };
   }

   getScreenContent(offerId: number, screenName: string) {
      return this.apiService.screenContent.getAll({}, { offerid: offerId, screen: screenName })
         .map(content => content ? content.data : []);
   }

   getScreenMessage(offerId: number, screenName: string) {
      return this.apiService.screenMessage.getAll({}, { offerid: offerId, screen: screenName })
         .map(content => content ? content.data : []);
   }

   changeOfferStatus(): any {
      this.apiService.allOfferStatus.update({
         status: Constants.preApprovedOffers.offerStatus.NOTIFICATION_READ,
         reason: '', screen: Constants.preApprovedOffers.ScreenIdentifiers.DASHBOARD_SCREEN
      }).subscribe(response => {
      });
   }

   changeOfferStatusById(payLoad, offerId) {
      this.offerId = offerId as number;
      return this.apiService.offerStatus.update(payLoad, {}, { offerid: offerId });
   }
   toggleSlider() {
      this.notificationSliderStatus = !this.notificationSliderStatus;
      if (this.notificationSliderStatus) {
         this.getOffers(true);
      }
      this.clickObserver.next(this.notificationSliderStatus);
   }
   sendUserContent(payload, offerId, screenName) {
      return this.apiService.screenContent.update(payload, {}, { offerid: offerId, screen: screenName });
   }
   getInvolvedParties(offerId) {
      return this.apiService.involvedParties.getAll({}, { offerid: offerId })
      .map(content => content ? content.data : []);
   }
   getLoanInformation(offerId, queryParam?): Observable<ILoanInformation> {
      if (!queryParam) {
         queryParam = {};
      }
      return this.apiService.loanInformation.getAll(queryParam, { offerid: offerId })
         .map(content => content ? content.data as ILoanInformation : undefined);
   }
      getDisclosureContent(offerId, queryParam?): Observable<IDisclosure> {
            if (!queryParam) {
                  queryParam = {};
            }
            return this.apiService.disclosureContent.getAll(queryParam, { offerid: offerId })
                  .map(content => content ? content as IDisclosure : undefined);
      }
   updateForPreApproveOffers(accountContainers: IDashboardAccounts[]): IDashboardAccounts[] {
      const offer = this.getPreApprovedPersonalLoan();
      if (offer) {
         const offerData = {
            AccountName: 'Personal Loan',
            Balance: offer.loanAmount,
            AvailableBalance: 0,
            AccountNumber: '',
            IsShow: true,
            AccountType: this.offerCode,
            isPreApprovedOffer: true,
         };
         const loanConatiner = accountContainers.find(ac => ac.ContainerName === this.offerCode);
         if (loanConatiner) {
            loanConatiner.Accounts.push(offerData as any);
         } else {
            accountContainers.push({
               ContainerName: this.offerCode,
               Accounts: [offerData as any]
            } as IDashboardAccounts);
         }
      }
      return accountContainers;
   }

}

import { TestBed, inject } from '@angular/core/testing';

import { PreApprovedOffersService } from './pre-approved-offers.service';
import { ApiService } from './api.service';
import { GetStarted, Information, Offer, Review, Disclosure } from '../../pre-approved-offers/pre-approved-offers.model';
import { Subject, Observable } from '../../../../node_modules/rxjs';
import { IPreApprovedOffers, IDashboardAccounts } from './models';

const offesData = [
   { id: 1, shortMessage: '', message: '', status: null },
   { id: 1, shortMessage: '', message: '', status: null },
   { id: 1, shortMessage: '', message: '', status: 'Offer Presented' },
   { id: 1, shortMessage: '', message: '', status: 'Offer Presented' }

];
const testData = [{ id: 1, shortMessage: '<b>R approved</b>', message: '<b>R 100000</b>', status: null, amount: 100000 },
{ id: 1, shortMessage: '<b>R approved</b>', message: '<b>R 500000</b>', status: null, amount: 100000 },
{ id: 1, shortMessage: '<b>R approved</b>', message: '<b>R 300000</b>', status: null, amount: 100000 },
{ id: 1, shortMessage: '<b>R approved</b>', message: '<b>R 1000000</b>', status: null, amount: 100000 },
{ id: 1, shortMessage: '<b>R approved</b>', message: '<b>R 200000</b>', status: null, amount: 100000 }];

let getAllBool = false;
let screenContent = false;
let offerstatus = false;
const apiServiceStub = {
   offers: {
      getAll: jasmine.createSpy('getAll').and.callFake(() => {
         getAllBool = true;
         return Observable.create(obs => {
            obs.next({ data: offesData });
            obs.complete();
         });
      })
   },
   allOfferStatus: {
      update: jasmine.createSpy('update').and.callFake((obj) => {
         return Observable.create(obs => {
            obs.next();
            obs.complete();
         });
      })
   },
   offerStatus: {
      update: jasmine.createSpy('update').and.callFake((payload, obj1, obj2) => {
         offerstatus = true;
         return;
      })
   },
   screenContent: {
      getAll: jasmine.createSpy('getAll').and.callFake((obj1, obj2) => {
         screenContent = true;
         return [{ data: [] }, { data: [] }];
      }),
      update: jasmine.createSpy('update').and.callFake((payload, obj1, obj2) => {
         offerstatus = true;
         return;
      })
   },

   involvedParties: {
      getAll: jasmine.createSpy('getAll').and.callFake((payload, offerId) => {
         getAllBool = true;
         return [{ data: { id: 1, shortMessage: '', message: '' } }, { data: { id: 1, shortMessage: '', message: '' } }];
      })
   },
   screenMessage: {
      getAll: jasmine.createSpy('getAll').and.callFake((obj1, obj2) => {
         return Observable.create(obs => {
            obs.next({ data: [] });
            obs.complete();
         });
      })
   }
};

const accountContainer: IDashboardAccounts[] = [
   { ContainerName: 'Loan', Accounts: [], ContainerIcon: 'ContainerIcon1', Assets: 1 },
   { ContainerName: 'Loan', Accounts: [], ContainerIcon: 'ContainerIcon2', Assets: 2 },
   { ContainerName: 'ContainerName3', Accounts: [], ContainerIcon: 'ContainerIcon3', Assets: 3 }
];

describe('PreApprovedOffersService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [PreApprovedOffersService,
            { provide: ApiService, useValue: apiServiceStub }
         ]
      });
   });

   it('should be created', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      expect(service).toBeTruthy();
   }));

   it('should initialize work flow', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      service.InitializeWorkFlow();
      expect(service.workflowSteps).not.toBeUndefined();
   }));
   it('should handle the getGetStartedVm', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      service.workflowSteps = {
         getStarted: new GetStarted(),
         information: new Information(),
         offer: new Offer(),
         review: new Review(),
         disclosure: new Disclosure()
      };
      const g: GetStarted = service.getGetStartedVm();
      expect(g.screen.length).toEqual(0);
   }));

   it('should handle the updateGetStartedVm', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const getStarted: GetStarted = new GetStarted();
      getStarted.screen.push({ id: 1, content: [], type: '' });
      getStarted.screen.push({ id: 2, content: [], type: '' });
      service.workflowSteps = {
         getStarted: new GetStarted(),
         information: new Information(),
         offer: new Offer(),
         review: new Review(),
         disclosure: new Disclosure()
      };
      const g: GetStarted = service.getGetStartedVm();
      // service.updateGetStartedVm(getStarted);
      service.updateGetStartedVm(getStarted);
      expect(service.workflowSteps.getStarted.screen.length).toEqual(2);
   }));


   it('should handle the getGetInformationVm', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {

      service.workflowSteps = {
         getStarted: new GetStarted(),
         information: new Information(),
         offer: new Offer(),
         review: new Review(),
         disclosure: new Disclosure()
      };
      service.workflowSteps.information.screen.push({ name: '', value: '', subText: '' });
      const g: GetStarted = service.getGetStartedVm();
      const info: Information = service.getGetInformationVm();
      expect(info.screen.length).toEqual(1);
   }));

   it('should handle the updateInformationVm', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const information: Information = new Information();
      information.screen.push({ name: '', value: '', subText: '' });
      information.screen.push({ name: 'a', value: 'b', subText: 'c' });
      service.workflowSteps = {
         getStarted: new GetStarted(),
         information: new Information(),
         offer: new Offer(),
         review: new Review(),
         disclosure: new Disclosure()
      };
      service.updateInformationVm(information);
      expect(service.workflowSteps.information.screen.length).toEqual(2);
   }));

   it('should handle the getOffers', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      service.getOffers(true);
      expect(service.unreadOffers.length).toBeGreaterThan(0);
   }));

   it('should handle the getScreenContent', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const offers = service.getScreenContent(2, 'screenname');
      expect(offers[0].length).toEqual(0);
   }));


   it('should handle the changeOfferStatusById', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const offers = service.changeOfferStatusById({ data: [] }, 2);
      expect(offerstatus).toBeTruthy();
   }));

   it('should handle the toggleSlider', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const offers = service.toggleSlider();
      expect(getAllBool).toBeTruthy();
   }));

   it('should handle the sendUserContent', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const offers = service.sendUserContent({ data: [] }, 2, 'abcd');
      expect(offerstatus).toBeTruthy();
   }));

   it('should handle the getInvolvedParties', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const offers = service.getInvolvedParties(2);
      expect(getAllBool).toBeTruthy();
   }));

   it('should handle the getScreenMessage', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const offers = service.getScreenMessage(2, 'Screen Name');
      offers.subscribe(content => {
         expect(content.length).toBe(0);
      });

   }));

   it('should handle the getPreApprovedPersonalLoan', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const offers = service.getPreApprovedPersonalLoan();
      expect(offers).toBeUndefined();
      service.unreadOffers = testData;
      const offer = service.getPreApprovedPersonalLoan();
      const maxLoanAmount = offer.loanAmount;
      expect(maxLoanAmount).toBe(100000);
   }));

   it('should handle the updateForPreApproveOffers', inject([PreApprovedOffersService], (service: PreApprovedOffersService) => {
      const aContainer = service.updateForPreApproveOffers(accountContainer);

      expect(aContainer.length).toEqual(3);
      service.unreadOffers = testData;
      const acContainer = service.updateForPreApproveOffers(accountContainer);
      expect(aContainer.length).toEqual(3);
      accountContainer[0].ContainerName = 'new1';
      accountContainer[1].ContainerName = 'new2';

      const accContainer = service.updateForPreApproveOffers(accountContainer);
      expect(aContainer.length).toEqual(4);
   }));

});

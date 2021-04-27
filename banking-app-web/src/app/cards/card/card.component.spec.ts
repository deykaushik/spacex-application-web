import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../test-util';
import { CardMaskPipe } from './../../shared/pipes/card-mask.pipe';
import { TruncateDescriptionPipe } from './../../shared/pipes/truncate-description.pipe';

import { IPlasticCard } from './../../core/services/models';
import { CardComponent } from './card.component';

const mockCard: IPlasticCard = {
   plasticId: 1,
   plasticNumber: '377104 60000 8960',
   plasticStatus: 'Active',
   plasticType: 'AK1',
   dcIndicator: 'D',
   plasticCustomerRelationshipCode: 'PRI',
   plasticStockCode: 'AK1',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '950',
   nameLine: 'MRS ANNASTASIA K',
   expiryDate: '2019-04-30 12:00:00 AM',
   issueDate: 'To be issued',
   plasticDescription: 'AMEX PROCUREMENT CARD',
   cardAccountNumber: '376800 000998618 9',
   owner: true,
   availableBalance: 0,
   allowATMLimit: true,
   allowBranch: true,
   allowBlock: true,
   allowReplace: false,
   isInitialCard: true,
   linkedAccountNumber: '376800 000998515 7',
   actionListItem: [{ action: 'canSoftBlock', result: false },
   { action: 'canContactLess', result: false },
   { action: 'canInternetPurchase', result: true },
   { action: 'ActivateCard', result: false }
   ]
};

const mockCardForOtherDCIndicator: IPlasticCard = {
   plasticId: 1,
   plasticNumber: '377104 60000 8960',
   plasticStatus: 'Active',
   plasticType: 'AK1',
   dcIndicator: 'Charge',
   plasticCustomerRelationshipCode: 'PRI',
   plasticStockCode: 'AK1',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '950',
   nameLine: 'MRS ANNASTASIA K',
   expiryDate: '2019-04-30 12:00:00 AM',
   issueDate: 'To be issued',
   plasticDescription: 'AMEX PROCUREMENT CARD',
   cardAccountNumber: '376800 000998618 9',
   owner: true,
   availableBalance: 0,
   allowATMLimit: true,
   allowBranch: true,
   allowBlock: true,
   allowReplace: false,
   linkedAccountNumber: '376800 000998515 7',
   actionListItem: [{ action: 'canSoftBlock', result: false },
   { action: 'canContactLess', result: false },
   { action: 'canInternetPurchase', result: true },
   { action: 'ActivateCard', result: false }
   ]
};

describe('CardComponent', () => {
   let component: CardComponent;
   let fixture: ComponentFixture<CardComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            CardComponent,
            TruncateDescriptionPipe,
            CardMaskPipe
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CardComponent);
      component = fixture.componentInstance;
      component.card = mockCard;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
      component.ngOnChanges();
      expect(new Date(component.expiryDate).getUTCDate()).toBe(30);
   });

   it('should draw the card', () => {
      component.card.image = 'default';
      component.hideDetail = false;
      component.defaultImage = true;
      component.ImageLoading = false;
      fixture.detectChanges();
      const plasticCardDescription = fixture.debugElement.query(By.css('.card .card-detail .name')).nativeElement;
      expect(plasticCardDescription.textContent).toContain(mockCard.plasticDescription);
   });

   it('should have no expiry date if input is not defined', () => {
      component.card.expiryDate = undefined;
      component.ngOnChanges();
      expect(component.expiryDate).toBeUndefined();
   });

   it('should return true if card dc indicator is neither d or c', () => {
      component.card = mockCardForOtherDCIndicator;
      component.getCardInactiveStatus();
      expect(component.getCardInactiveStatus()).toBe(true);
   });

   it('should return cardstatus', () => {
      component.card = mockCardForOtherDCIndicator;
      component.card.isCardFreeze = true;
      component.getStatus();
      expect(component.cardStatusText).toEqual('Frozen');
   });
   it('should rotate the card', () => {
      component.isActive = true;
      component.rotated = false;
      component.isLoaded = false;
      component.onCardClick();
      component.isLoaded = true;
      component.onCardClick();
      expect(component.rotated).toBeFalsy();
   });
   it('should re-rotate the card already loaded', () => {
      component.isActive = true;
      component.isLoaded = true;
      component.frontCard.nativeElement.classList.add('actual');
      component.backCard.nativeElement.classList.add('rotate');
      component.onCardClick();
      expect(component.rotated).toBeTruthy();
   });
   it('should set hide detail and imageloading in profress to false on image loaded', () => {
      component.hideDetail = false;
      component.ImageLoading = true;
      component.imageLoaded(true);
      expect(component.hideDetail).toBeTruthy();
      expect(component.ImageLoading).toBeFalsy();
   });
   it('should set defaultimage indicator if card image is default', () => {
      component.card.expiryDate = undefined;
      component.card.image = 'default';
      component.URL = '';
      component.defaultImage = false;
      component.ngOnChanges();
      expect(component.defaultImage).toBeTruthy();
      expect(component.URL).toBe('');
   });
   it('should set defaultimage indicator and image URL if card image is not default', () => {
      component.card.expiryDate = undefined;
      component.card.image = 'Gold';
      component.URL = '';
      component.defaultImage = false;
      component.ngOnChanges();
      expect(component.defaultImage).toBeFalsy();
      expect(component.URL).not.toBe('');
   });
   it('should reset the card if not active', () => {
      component.toReset = true;
      component.isActive = false;
      component.ngOnChanges();
      expect(component.isLoaded).toBeFalsy();
   });
});

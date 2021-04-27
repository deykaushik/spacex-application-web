import {
   Component, OnInit, Input, EventEmitter, HostListener, Inject,
   ViewChild, ElementRef, OnChanges, Output, Renderer, OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { ClickScrollDirective } from './../../../shared/directives/click-scroll.directive';
import { BeneficiaryService } from './../../../core/services/beneficiary.service';
import { Constants } from './../../../core/utils/constants';
import { IBankDefinedBeneficiary, IContactCard, IContactCardDetail, IBeneficiaryData } from './../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';

@Component({
   selector: 'app-search-recipients',
   templateUrl: './search-recipients.component.html',
   styleUrls: ['./search-recipients.component.scss']
})
export class SearchRecipientsComponent implements OnInit, OnChanges, OnDestroy {
   isErrorOcuured: boolean;
   @Input() isOverlay;
   @Input() options;
   @Input() onPage;
   @Input() refreshContactCardId;
   @Input() alphabetScroll;
   @Input() forcedTab;
   groupedBankApprovedData = [];
   groupedContactCardData = [];
   isShowContactCards = false;
   isEmptyState = false;
   isShowBankApproved = false;
   alphabetsHeight: number;
   activeTab = 1;
   activeCard: IContactCard | IBankDefinedBeneficiary = null;
   isClicked = false;
   contactFilter: String = '';
   bankFilter: String = '';
   filter: String = '';
   beneficiaryData = [];
   showLoader: Boolean;
   greenSpin: Boolean;
   @ViewChild('tabContent') tabContent: ElementRef;

   bankApprovedAlphabetsList = [];
   contactCardAlphabetsList = [];

   @Output() onBeneficiaryDataSelection = new EventEmitter<IBeneficiaryData>();
   @Output() onBeneficiaryListHidden = new EventEmitter();
   @Output() sendBeneficiaryData = new EventEmitter();

   documentClickFunc;
   keyboardEventFunc;
   isAddState = false;
   constructor(private beneficiaryService: BeneficiaryService,
      private element: ElementRef,
      @Inject(DOCUMENT) private document: Document,
      private renderer: Renderer, public router: Router,
      private route: ActivatedRoute) {
      this.route.params.subscribe(params => {
         if (params && params.action === Constants.Recipient.addFlag) {
            this.isAddState = true;
         }
      });
   }

   ngOnInit() {
      // beneficiary data
      this.showLoader = true;
      this.loadRecipients();
   }

   ngOnChanges() {
      this.filter = this.contactFilter;
      this.activeTab = this.forcedTab || 1;
      this.forcedTab = undefined;
      this.setHostEvents();
      if (this.isOverlay && !this.onPage) {
         this.document.body.classList.add('search-recipients-no-scroll');
         if (this.document.getElementById('scroll-page')) {
            this.document.getElementById('scroll-page').classList.add('overlay-shadow-container');
         }
      }
      this.refreshContactCards();
   }

   @HostListener('scroll', ['$event'])
   onScroll(el) {
      const tabScroll = this.document.getElementById('tabs-content').scrollTop;
      const tabScrollHeight = this.document.getElementById('tabs-content').clientHeight;
      const tabScrollWidth = this.document.getElementById('tabs-content').clientWidth;
      const recipientsListHeight = this.document.getElementById('recipients-list').clientHeight;
      this.alphabetsHeight = this.document.getElementById('alphabets-list').scrollHeight;
      if ((recipientsListHeight > this.alphabetsHeight) && (tabScroll > (this.alphabetsHeight - tabScrollHeight))) {
         this.document.getElementById('alphabets-list').classList.add('fixed');
         if (this.alphabetsHeight > tabScrollHeight) {
            this.document.getElementById('alphabets-list').classList.add('bottom');
         }
         this.document.getElementById('alphabets-list').style.height = tabScrollHeight + 'px';
         this.document.getElementById('alphabets-list').style.left = (tabScrollWidth - 20) + 'px';
      } else {
         if (tabScroll === 0) {
            this.document.getElementById('alphabets-list').classList.remove('bottom');
         }
         this.document.getElementById('alphabets-list').style.height = 'auto';
      }
   }

   loadRecipients() {
      const bankApproved = this.beneficiaryService.getBankApprovedBeneficiaries();
      const contactCards = this.beneficiaryService.getContactCards();
      const requestArray = [];
      this.greenSpin = true;
      if (this.options && (this.options.isPrepaid || this.options.isElectricity)) {
         requestArray.push(contactCards);
      } else {
         requestArray.push(bankApproved, contactCards);
      }
      Observable.forkJoin(requestArray).subscribe(results => {
         this.setBeneficiaryData(results);
         this.sendBeneficiaryData.emit(this.beneficiaryData);
         if (!this.beneficiaryData[1].length) {
            // Empty state of recipients
            if (!this.isAddState) {
               this.isEmptyState = true;
            } else {
               this.isEmptyState = false;
            }
         }
         this.groupBeneficiaryData();

         if (this.onPage) {
            this.emitFirstContactCard();
         }
         this.showLoader = false;
         this.isErrorOcuured = false;
      }, err => {
         this.isErrorOcuured = true;
         this.showLoader = false;
         this.greenSpin = false;
      });
   }

   refreshContactCards() {
      // handle Math.rand and delete cases
      if (this.refreshContactCardId && (this.refreshContactCardId >= 1 ||
         this.refreshContactCardId === Constants.Recipient.status.deleteSuccess)) {
         this.contactFilter = '';
         this.filter = '';
         this.beneficiaryService.getContactCards().subscribe((data) => {
            this.beneficiaryData[1] = data;
            this.groupContactCardData(this.beneficiaryData[1]);
            this.setAlphabetLists();

            const contactCard = this.getContactCardById(this.refreshContactCardId);
            if (contactCard) {
               this.activeCard = contactCard;
               this.onBeneficiaryDataSelection.emit({
                  contactCard: contactCard
               });
            } else {
               this.tabContent.nativeElement.scrollTop = 0;
               this.emitFirstContactCard();
            }
         });
      } else if (this.refreshContactCardId === Constants.Recipient.status.error) {
         this.tabContent.nativeElement.scrollTop = 0;
         this.emitFirstContactCard();
      }
   }

   emitFirstContactCard() {
      const contactCard = this.getFirstContactCard();
      this.activeCard = contactCard;
      const firstContactCard = {
         contactCard: contactCard,
         isEmptyState: this.isEmptyState
      };
      if (contactCard && contactCard.contactCardDetails && contactCard.contactCardDetails.length > 0) {
         firstContactCard[Constants.Recipient.contactCardDetails] = {
            cardDetails: contactCard.contactCardDetails[0],
            isAccount: true
         };
         firstContactCard[Constants.Recipient.bankDefinedBeneficiary] = null;
      }
      this.onBeneficiaryDataSelection.emit(firstContactCard);
   }

   getContactCardById(contactCardId) {
      return this.beneficiaryData[1].find((contactCard) => {
         return contactCard.contactCardID === contactCardId;
      });
   }

   ngOnDestroy() {
      this.hideSearchRecipients();
      if (this.documentClickFunc) {
         this.documentClickFunc();
      }

      if (this.keyboardEventFunc) {
         this.keyboardEventFunc();
      }
   }

   setHostEvents() {
      // register host events only when component is opened in overlay mode
      if (!this.onPage) {
         this.keyboardEventFunc = this.renderer.listenGlobal('window', 'keydown', (event) => {
            this.handleKeyboardEvent(event);
         });
         this.documentClickFunc = this.renderer.listenGlobal('document', 'click', (event) => {
            this.handleDocumentEvent(event);
         });
      }
   }

   handleDocumentEvent(event) {
      if (this.document.getElementById('scroll-page') === event.target && !this.onPage) {
         this.hideSearchRecipients();
      }
      event.stopPropagation();
   }

   handleKeyboardEvent(event) {
      // keycode 27 for ESC
      if (event.keyCode === 27 && !this.onPage) {
         this.hideSearchRecipients();
      }
      event.stopPropagation();
   }

   // filter contacts based on pay/buy-prepaid/buy-electricity
   setBeneficiaryData(beneficiaryData) {
      let data = [];
      if (this.options && this.options.isPrepaid) {
         data[0] = [];
         data[1] = this.getPrepaidContacts(beneficiaryData[0]);
      } else if (this.options && this.options.isElectricity) {
         data[0] = [];
         data[1] = this.getElectricityContacts(beneficiaryData[0]);
      } else if (this.options && this.options.isPay) {
         data[0] = beneficiaryData[0];
         data[1] = this.getPayContacts(beneficiaryData[1]);
      } else {
         data = beneficiaryData;
      }

      this.beneficiaryData = data;
   }

   hideSearchRecipients() {
      this.isOverlay = false;
      if (this.document.body) {
         this.document.body.classList.remove('search-recipients-no-scroll');
      }
      if (this.document.getElementById('scroll-page')) {
         this.document.getElementById('scroll-page').classList.remove('overlay-shadow-container');
      }
      this.onBeneficiaryListHidden.emit();
   }

   selectTab(value) {
      this.activeTab = value;
      if (this.activeTab === 1) {
         this.filter = this.contactFilter;
      } else {
         this.filter = this.bankFilter;
      }
      this.tabContent.nativeElement.scrollTop = 0;
   }

   toggle(contactCardID: number) {
      const elem = this.element.nativeElement.querySelector('#contact-card-' + contactCardID);
      if (elem) {
         if (!elem.classList.contains('clicked')) {
            elem.classList.add('clicked');
         } else {
            elem.classList.remove('clicked');
         }
      }
   }

   groupBeneficiaryData() {
      this.groupBankApprovedData(this.beneficiaryData[0]);
      this.groupContactCardData(this.beneficiaryData[1]);
      this.setAlphabetLists();
   }

   filterContent(): boolean {
      const tempFilter = this.filter.trim().toLocaleLowerCase();
      if (this.activeTab === 1) {
         this.contactFilter = this.filter;
         if (!this.beneficiaryData.length) {
            return false;
         }
         let filteredContact = this.beneficiaryData[1];
         if (tempFilter) {
            filteredContact = this.filterContactData(this.beneficiaryData[1], tempFilter);
         }
         this.groupContactCardData(filteredContact);
         this.setAlphabetLists();
      } else {
         this.bankFilter = this.filter;
         if (!this.beneficiaryData.length) {
            return false;
         }
         let filteredBank = this.beneficiaryData[0];
         if (tempFilter) {
            filteredBank = this.filterBankData(this.beneficiaryData[0], tempFilter);
         }
         this.groupBankApprovedData(filteredBank);
         this.setAlphabetLists();
      }
      return true;
   }

   filterBankData(bankData, filter): boolean {
      return bankData.filter(data => data.bDFName.toLocaleLowerCase().indexOf(filter) > -1);
   }

   filterContactData(cardData, filter) {
      return cardData.filter(data => {
         if (data.contactCardName.toLocaleLowerCase().indexOf(filter.toLowerCase()) > -1) {
            return true;
         }
         for (const each in data.contactCardDetails) {
            const temp = data.contactCardDetails[each];
            if (temp.accountNumber.indexOf(filter) > -1 || temp.beneficiaryName.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
               return true;
            }
         }
         return false;
      });
   }

   groupBankApprovedData(bankApprovedData) {
      this.groupedBankApprovedData = [];
      this.isShowBankApproved = bankApprovedData && bankApprovedData.length;
      bankApprovedData = CommonUtility.sortByKey(bankApprovedData, 'bDFName');
      bankApprovedData.forEach((beneficiary) => {
         const firstLetter = beneficiary.bDFName.charAt(0);
         if (this.groupedBankApprovedData[firstLetter.toUpperCase()] === undefined) {
            this.groupedBankApprovedData[firstLetter.toUpperCase()] = [];
         }
         this.groupedBankApprovedData[firstLetter.toUpperCase()].push(beneficiary);
      });
   }


   groupContactCardData(contactCardData) {
      this.groupedContactCardData = [];
      const hashkeySymbol = 35;
      const hashkey = String.fromCharCode(hashkeySymbol);
      this.isShowContactCards = contactCardData && contactCardData.length;
      contactCardData = CommonUtility.sortByKey(contactCardData, 'contactCardName');
      this.groupedContactCardData[hashkey.toUpperCase()] = [];
      contactCardData.forEach((contactCard) => {
         const firstLetter = contactCard.contactCardName.charAt(0);
         if (this.groupedContactCardData[firstLetter.toUpperCase()] === undefined) {
            this.groupedContactCardData[firstLetter.toUpperCase()] = [];
         }
         if (isFinite(firstLetter)) {
            this.groupedContactCardData[hashkey.toUpperCase()].push(contactCard);
         } else {
            this.groupedContactCardData[firstLetter.toUpperCase()].push(contactCard);
         }
      });
   }

   getFirstContactCard() {
      const start = 65;
      const end = 90;
      const hashkeySymbol = 35;
      const hashkey = String.fromCharCode(hashkeySymbol);
      let contactCard;
      if (this.groupedContactCardData[hashkey] && this.groupedContactCardData[hashkey].length) {
         contactCard = this.groupedContactCardData[hashkey][0];
         return contactCard;
      }
      for (let charCode: number = start; charCode <= end; charCode++) {
         const key = String.fromCharCode(charCode);
         if (this.groupedContactCardData[key] && this.groupedContactCardData[key].length) {
            contactCard = this.groupedContactCardData[key][0];
            break;
         }
      }
      return contactCard;
   }

   setAlphabetLists() {
      const hashkeySymbol = 35;
      const hashkey = String.fromCharCode(hashkeySymbol);
      const start = 65;
      const end = 90;
      const charsList: {
         key: string;
         isEnabled: boolean;
      }[] = [];
      this.bankApprovedAlphabetsList = [];
      this.contactCardAlphabetsList = [];
      this.contactCardAlphabetsList.push({
         key: hashkey,
         isEnabled: this.groupedContactCardData[hashkey] && this.groupedContactCardData[hashkey].length
      });
      for (let charCode: number = start; charCode <= end; charCode++) {
         const key = String.fromCharCode(charCode);

         this.contactCardAlphabetsList.push({
            key: key,
            isEnabled: this.groupedContactCardData[key] && this.groupedContactCardData[key].length
         });

         this.bankApprovedAlphabetsList.push({
            key: key,
            isEnabled: this.groupedBankApprovedData[key] && this.groupedBankApprovedData[key].length
         });
      }
   }

   isElectricityContact(contactCard: IContactCard): boolean {
      const contactCardDetails = contactCard.contactCardDetails && contactCard.contactCardDetails.filter((contactCardDetail) => {
         return this.isElectricityContactCard(contactCardDetail);
      });
      return contactCardDetails.length > 0;
   }

   isPrepaidContact(contactCard: IContactCard): boolean {
      const contactCardDetails = contactCard.contactCardDetails && contactCard.contactCardDetails.filter((contactCardDetail) => {
         return this.isPrepaidContactCard(contactCardDetail);
      });
      return contactCardDetails.length > 0;
   }

   isAccountContact(contactCard: IContactCard): boolean {
      const contactCardDetails = contactCard.contactCardDetails && contactCard.contactCardDetails.filter((contactCardDetail) => {
         return this.isBankAccountContactCard(contactCardDetail);
      });
      return contactCardDetails.length > 0;
   }

   isCreditCardContact(contactCard: IContactCard): boolean {
      const contactCardDetails = contactCard.contactCardDetails && contactCard.contactCardDetails.filter((contactCardDetail) => {
         return this.isCreditCardContactCard(contactCardDetail);
      });
      return contactCardDetails.length > 0;
   }

   isBankAccountContactCard(contactCardDetail: IContactCardDetail) {
      return !this.isPrepaidContactCard(contactCardDetail) && !this.isElectricityContactCard(contactCardDetail) &&
         !this.isCreditCardContactCard(contactCardDetail);
   }

   isPrepaidContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType === 'PPD';
   }

   isElectricityContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.beneficiaryType === 'PEL';
   }

   isCreditCardContactCard(contactCardDetail: IContactCardDetail) {
      return contactCardDetail.accountType === Constants.VariableValues.accountTypes.creditCardAccountType.code;
   }

   isMultiplePayment(contactCard: IContactCard) {
      return contactCard.contactCardDetails && contactCard.contactCardDetails.length > 1;
   }

   isSinglePayment(contactCard: IContactCard) {
      return contactCard.contactCardDetails && contactCard.contactCardDetails.length === 1;
   }

   onBankApprovedSelection(beneficiaryData: IBankDefinedBeneficiary) {
      this.activeCard = beneficiaryData;
      this.onBeneficiaryDataSelection.emit({
         bankDefinedBeneficiary: beneficiaryData
      });
      this.hideSearchRecipients();
   }

   onContactCardSelection(contactCard: IContactCard) {
      this.activeCard = contactCard;
      if (this.isSinglePayment(contactCard) || this.onPage) {
         this.onBeneficiaryDataSelection.emit({
            contactCard: contactCard,
            contactCardDetails: {
               cardDetails: contactCard.contactCardDetails[0],
               isAccount: this.isAccountContact(contactCard) || this.isCreditCardContact(contactCard),
               isPrepaid: this.isPrepaidContact(contactCard),
               isElectricity: this.isElectricityContact(contactCard)
            }
         });
         this.hideSearchRecipients();
      } else {
         this.toggle(contactCard.contactCardID);
      }
   }

   onPrepaidContactCardSelection(contactCardDetail: IContactCardDetail) {
      this.onBeneficiaryDataSelection.emit({
         contactCardDetails: {
            cardDetails: contactCardDetail,
            isPrepaid: true
         },
         bankDefinedBeneficiary: null
      });
      this.hideSearchRecipients();
   }

   onElectricityContactCardSelection(contactCardDetail: IContactCardDetail) {
      this.onBeneficiaryDataSelection.emit({
         contactCardDetails: {
            cardDetails: contactCardDetail,
            isElectricity: true
         },
         bankDefinedBeneficiary: null
      });
      this.hideSearchRecipients();
   }

   onAccountContactCardSelection(contactCardDetail: IContactCardDetail) {
      this.onBeneficiaryDataSelection.emit({
         contactCardDetails: {
            cardDetails: contactCardDetail,
            isAccount: true
         },
         bankDefinedBeneficiary: null
      });
      this.hideSearchRecipients();
   }

   onCreditCardContactCardSelection(contactCardDetail: IContactCardDetail) {
      this.onBeneficiaryDataSelection.emit({
         contactCardDetails: {
            cardDetails: contactCardDetail,
            isAccount: true
         },
         bankDefinedBeneficiary: null
      });
      this.hideSearchRecipients();
   }

   getPrepaidContacts(contacts: IContactCard[]): IContactCard[] {
      const filteredContacts = [];

      contacts.forEach((contact) => {
         const prepaidContactCardDetails = contact.contactCardDetails.filter((contactCardDetail) => {
            return this.isPrepaidContactCard(contactCardDetail);
         });

         if (prepaidContactCardDetails && prepaidContactCardDetails.length) {
            contact.contactCardDetails = prepaidContactCardDetails;
            filteredContacts.push(contact);
         }
      });

      return filteredContacts;
   }

   getElectricityContacts(contacts: IContactCard[]): IContactCard[] {
      const filteredContacts = [];

      contacts.forEach((contact) => {
         const electricityContactCardDetails = contact.contactCardDetails.filter((contactCardDetail) => {
            return this.isElectricityContactCard(contactCardDetail);
         });

         if (electricityContactCardDetails && electricityContactCardDetails.length) {
            contact.contactCardDetails = electricityContactCardDetails;
            filteredContacts.push(contact);
         }
      });

      return filteredContacts;
   }

   getPayContacts(contacts: IContactCard[]): IContactCard[] {
      const filteredContacts = [];

      contacts.forEach((contact) => {
         const payContactCardDetails = contact.contactCardDetails.filter((contactCardDetail) => {
            return !this.isElectricityContactCard(contactCardDetail);
         });

         if (payContactCardDetails && payContactCardDetails.length) {
            contact.contactCardDetails = payContactCardDetails;
            filteredContacts.push(contact);
         }
      });

      return filteredContacts;
   }
   navigationWithReload(link: string, subLink?: string) {
      this.router.navigate([link + '/' + subLink]);
   }
}

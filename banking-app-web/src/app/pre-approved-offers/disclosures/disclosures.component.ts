import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { IDisclosure, IDisclosureData } from '../pre-approved-offers.model';
import { IRadioButtonItem } from '../../core/services/models';
import { IButtonGroup } from '../../core/utils/models';
import { CommonUtility } from '../../core/utils/common';
import { Constants } from '../../core/utils/constants';

@Component({
  selector: 'app-disclosures',
  templateUrl: './disclosures.component.html',
  styleUrls: ['./disclosures.component.scss']
})
export class DisclosuresComponent implements OnInit {
  showDoneScreen: boolean;
  offerId: number;
  limitTypes: IRadioButtonItem[] = [];
  limitType = '';
  disclosureVm: IDisclosure;
  disclosureScreen = Constants.preApprovedOffers.labels.disclosureScreen;
  email = this.disclosureScreen.EMAIL;
  pleaseNote = this.disclosureScreen.PLEASE_NOTE;
  disclosureScreenContent = Constants.preApprovedOffers.DisclosureScreen;
  text = this.disclosureScreenContent.TEXT;
  option = this.disclosureScreenContent.OPTION;
  selectOption = Constants.preApprovedOffers.labels.offerScreen.SELECT_OPTION;
  constructor(private workflowService: WorkflowService, private preApprovedOffersService: PreApprovedOffersService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.offerId = params.offerid as number;
    });
   }

  ngOnInit() {
    this.disclosureVm = this.preApprovedOffersService.getGetDisclosureVm();
    if (this.disclosureVm.data.length <= 0) {
      this.preApprovedOffersService.getDisclosureContent(this.offerId).subscribe(data => {
        this.setDisclosureVm(data);
        this.setLimitTypes(this.disclosureVm.data);
      });
    }else {
      this.setLimitTypes(this.disclosureVm.data);
    }
  }

  setDisclosureVm(data) {
    // need to improve this
    this.disclosureVm.data = data.data;
    this.disclosureVm.metadata = data.metadata;
    const disclosuredata = this.disclosureVm.data.find(content =>
      content.name.toLocaleLowerCase() === Constants.preApprovedOffers.DisclosureScreen.DISCLOSURE);
    const dropdowndata = disclosuredata.content.find(content => content.type === Constants.preApprovedOffers.DisclosureScreen.DROPDOWN);
    this.disclosureVm.dropDownTitle = dropdowndata.title;
    this.disclosureVm.dropDownTerms = dropdowndata.content;

    const disclaimersdata = this.disclosureVm.data.find(content =>
      content.name.toLocaleLowerCase() === Constants.preApprovedOffers.DisclosureScreen.DISCLAMERS);
    this.disclosureVm.toolTipText = (disclaimersdata.content.find(content =>
      content.type === Constants.preApprovedOffers.DisclosureScreen.LINK).errorText).substring(1);
    this.disclosureVm.viewAndAcceptText = disclaimersdata.content.find(content =>
      content.type === Constants.preApprovedOffers.DisclosureScreen.LINK).title;
    this.disclosureVm.emailText = disclaimersdata.content.find(content =>
      content.type === this.text).content[0];
    this.disclosureVm.errorText = (disclaimersdata.content.find(content =>
      content.type === Constants.preApprovedOffers.DisclosureScreen.EMAIL).errorText).substring(1);
    this.disclosureVm.disclosureContent = disclosuredata.content;
  }

  setLimitTypes(data: IDisclosureData[]) {
    const limitdata = data.find(content =>
      content.name.toLowerCase() === Constants.preApprovedOffers.DisclosureScreen.DISCLOSURE).content.find(content =>
      content.type.toLowerCase() === Constants.preApprovedOffers.DisclosureScreen.OPTION);
    limitdata.content.forEach((element, index) => {
      this.limitTypes.push({label: element, value: index.toString()});
    });
  }
  onLimitTypeChange(limitType: IRadioButtonItem) {
    this.disclosureVm.selectedType = limitType.value;
  }

  onTermChange(term) {
    this.disclosureVm.selectedTerm = term;
    if (!!this.disclosureVm.email) {
      const isemailValid = CommonUtility.isValidEmail(this.disclosureVm.email);
      this.disclosureVm.allIsValid = (isemailValid && !!this.disclosureVm.selectedTerm) ? true : false;
    }
  }
  next() {
    this.disclosureVm.showPage = true;
  }

  TermAndCondtions(bool: boolean) {
    this.disclosureVm.termAndCondtions = bool;
    this.disclosureVm.confirm = bool;
    this.disclosureVm.showPage = false;
  }

  emailCheck(event) {
    const isemailValid = CommonUtility.isValidEmail(event.target.value);
    this.disclosureVm.allIsValid = (isemailValid && !!this.disclosureVm.selectedTerm);
    this.disclosureVm.errorTextBool = !isemailValid;
    this.disclosureVm.email = isemailValid ? event.target.value : '';
  }

  confirm() {
    const payLoad = {
      status: Constants.preApprovedOffers.offerStatus.CLIENT_DETAILS_ACCEPTED, reason: '',
      screen: Constants.preApprovedOffers.ScreenIdentifiers.DISCLOSURES_SCREEN
      };
    this.preApprovedOffersService.changeOfferStatusById(payLoad, this.offerId).subscribe(response => {
      this.disclosureVm.showDoneScreen = true;
      });
  }
}

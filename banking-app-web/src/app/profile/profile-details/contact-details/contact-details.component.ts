import { Component, OnInit, Input } from '@angular/core';
import { IAddressLine } from '../../../core/services/models';

@Component({
   selector: 'app-contact-details',
   templateUrl: './contact-details.component.html',
   styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {
   @Input() profileDetails;
   fullAddress = '';

   constructor() { }

   ngOnInit() {
      if (this.profileDetails) {
         this.getAddress(this.profileDetails.Address.AddressLines);
      }
   }

   private getAddress(address: IAddressLine[]) {
      address.forEach((element) => {
         this.fullAddress += element.AddressLine + ' ';
      });
   }

   displayRsaPassportNo() {
      if (this.profileDetails && this.profileDetails.Resident != null) {
          if (this.profileDetails.Resident === 'ZA') {
            return (this.profileDetails && this.profileDetails.RsaId) ? this.profileDetails.RsaId : null;
          } else {
            return (this.profileDetails && this.profileDetails.PassportNumber) ? this.profileDetails.PassportNumber : null;
          }
      }
   }
}

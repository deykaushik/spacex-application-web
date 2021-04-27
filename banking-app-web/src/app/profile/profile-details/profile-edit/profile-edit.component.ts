import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { ProfileService } from '../../profile.service';
import { IClientPreferenceDetails } from '../../../core/services/models';
import { ClientPreferences, IEditClientProfileEmitter } from '../../profile.models';
import { Constants } from '../../../core/utils/constants';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-profile-edit',
   templateUrl: './profile-edit.component.html',
   styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent extends BaseComponent implements OnInit {
   @Input() preferredName;
   @Input() clientInitials;
   @Input() actualName;
   @Output() isPreferredNameUpdated = new EventEmitter<IEditClientProfileEmitter>();
   isButtonLoader = false;
   public clientPreference: ClientPreferences;
   public viewPreferredNameWidget = true;
   public updatePreferredNameWidget = false;
   constructor(private profileService: ProfileService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
   }

   onUpdateClick(updatedName: string) {
      if (updatedName.length === 0) {
         return ;
      }
      this.isButtonLoader = true;
      if (!this.clientPreference) {
         this.clientPreference = new ClientPreferences;
      }
      this.clientPreference.PreferenceKey = 'PreferredName';
      this.clientPreference.PreferenceValue = updatedName;
      this.profileService.saveClientPreferenceName(this.clientPreference).subscribe(data => {
         if (data === Constants.profile.OK) {
            this.isPreferredNameUpdated.emit({ Status: true, PreferredName: updatedName });
            this.isButtonLoader = false;
            this.updatePreferredNameWidget = false;
            this.viewPreferredNameWidget = true;
         } else {
            this.isPreferredNameUpdated.emit({ Status: false, PreferredName: this.preferredName });
            this.isButtonLoader = false;
            this.updatePreferredNameWidget = false;
            this.viewPreferredNameWidget = true;
         }
      });
   }
   onCancelClick() {
      this.updatePreferredNameWidget = false;
      this.viewPreferredNameWidget = true;
   }
   onEditClick() {
      this.viewPreferredNameWidget = false;
      this.updatePreferredNameWidget = true;
   }
   disabledSubmit(updatedName: string) {
      if (updatedName) {
         return updatedName.trim().length <= 0;
      } else {
         return true;
      }
   }

}

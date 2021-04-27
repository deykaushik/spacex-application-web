import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from './../../core/utils/constants';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Subscription } from 'rxjs/Subscription';
import { CommonUtility } from '../../core/utils/common';

@Component({
   selector: 'app-greeting',
   templateUrl: './greeting.component.html',
   styleUrls: ['./greeting.component.scss']
})
export class GreetingComponent implements OnInit, OnDestroy {

   constructor(private clientProfileDetailsService: ClientProfileDetailsService) { }
   clientDeatilSubscription: Subscription;
   vm = {
      userName: '',
      loginDateTime: Date.now(),
      isNewUser: true,
      msgNewUser: 'Welcome!',
      msgOldUser: 'Welcome back!',
      msgLastLogin: 'Last Login'
   };
   format = {
      date: Constants.formats.ddMMYYYY,
      time: Constants.formats.hhmm
   };
   skeletonMode = true;
   greeting: string;
   ngOnInit() {
      this.clientDeatilSubscription = this.clientProfileDetailsService.clientDetailsObserver
         .subscribe(response => {
            if (response) {
               this.vm.userName = response.PreferredName ? response.PreferredName : response.FirstName;
               this.skeletonMode = false;
               this.vm.userName = CommonUtility.getCapitalizeText(this.vm.userName);
               this.greeting = CommonUtility.format(Constants.labels.greeting.greet, this.vm.userName);
            }
         });
   }

   ngOnDestroy() {
      if (!!this.clientDeatilSubscription) {
         this.clientDeatilSubscription.unsubscribe();
      }
   }

}

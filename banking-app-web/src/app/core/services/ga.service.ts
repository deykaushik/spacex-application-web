import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Constants } from '../utils/constants';
import { environment } from '../../../environments/environment';
import { IGaEvent, IGaPageTracking } from './models';
import { Mapping } from '../utils/routeMap';

import { WindowRefService } from './window-ref.service';
import { ClientProfileDetailsService } from './client-profile-details.service';
import { SystemErrorService } from './system-services.service';

@Injectable()
export class GaTrackingService {
   label: string;
   category: string;
   notifySectionChange = new Subject();
   datalayer: any;
   gtag;
   username: string;
   constructor(winRefr: WindowRefService, public router: Router,
      private clientProfileDetailsService: ClientProfileDetailsService, public service: SystemErrorService) {
      this.gtag = winRefr.nativeWindow.gtag;
      this.gtag('create', environment.gaTrackingId, { 'send_page_view': false });


      this.clientProfileDetailsService.clientDetailsObserver.subscribe(clientDetails => {
         if (clientDetails != null) {
            this.username = clientDetails.FullNames;
         }
      });
      this.notifySectionChange.subscribe(comp => {
         const section = Mapping.SubRoutes.find(cmp => cmp.component === comp);
         if (section) {
            this.label = section.label;
            this.trackPage({
               page_path: `/${section.page}`,
               page_title: section.page,
               custom_map: Constants.GADimensionMap
            });
         }
      });
      this.router.events.subscribe(event => {
         if (event instanceof NavigationEnd) {
            let page_title = '';
            const section = Mapping.Routes.find(route => this.stringToRegex(route.page).test(event.urlAfterRedirects));
            if (section) {
               this.category = section.category;
               page_title = section.category;
               this.label = section.label;
            }
            this.trackPage({
               page_path: event.urlAfterRedirects,
               page_title: page_title,
               custom_map: Constants.GADimensionMap
            });
         }
      });

      this.service.getError().subscribe((err: any) => {
         this.sendEvent({
            category: Constants.GAEventList.crash.category,
            label: Constants.GAEventList.crash.label,
            value: err.url
         });
      });
   }
   sendEvent(eventObject: IGaEvent) {
      const event = {
         event_category: eventObject.category || this.category,
         event_label: eventObject.label || this.label,
         event_value: eventObject.value || ' ',
      };

      this.gtag('event', eventObject.action, event);
   }

   changeCategory(categoryName: string) {
      this.category = categoryName;
   }

   private stringToRegex(input: string): RegExp {
      let flags;
      // could be any combination of 'g', 'i', and 'm'
      flags = 'g';
      return new RegExp('^\/' + input + '$', flags);
   }

   trackPage(pageInfo: IGaPageTracking) {
      pageInfo.custom_map = Constants.GADimensionMap;
      this.gtag('config', environment.gaTrackingId, pageInfo);
   }
}

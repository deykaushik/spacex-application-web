import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { SharedModule } from './../shared/shared.module';
import { BranchLocatorRoutingModule } from './branch-locator-routing.module';
import { BranchLocatorComponent } from './branch-locator.component';

import { environment } from './../../environments/environment';

@NgModule({
   imports: [
      AgmCoreModule.forRoot({
         apiKey: environment.googleMapApiKey, // "YOUR KEY GOES HERE",
      }),
      FormsModule,
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      BranchLocatorRoutingModule,
      AgmSnazzyInfoWindowModule,
      AgmJsMarkerClustererModule
   ],
   declarations: [BranchLocatorComponent],
   exports: [BranchLocatorComponent],
   entryComponents: [BranchLocatorComponent]
})

export class BranchLocatorModule { }

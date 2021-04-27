import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { CommingSoonRoutingModule } from './comming-soon-routing.module';
import { CommingSoonComponent } from './comming-soon.component';

@NgModule({
   imports: [
      FormsModule,
      CommonModule,
      SharedModule,
      CommingSoonRoutingModule
   ],
   declarations: [CommingSoonComponent],
   entryComponents: [CommingSoonComponent]
})

export class CommingSoonModule { }

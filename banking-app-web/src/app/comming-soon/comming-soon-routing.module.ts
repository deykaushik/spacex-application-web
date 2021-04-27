import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommingSoonComponent } from './comming-soon.component';

const routes: Routes = [
   { path: '', component: CommingSoonComponent },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class CommingSoonRoutingModule { }

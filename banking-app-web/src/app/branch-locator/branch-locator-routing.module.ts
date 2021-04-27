import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BranchLocatorComponent } from './branch-locator.component';

const routes: Routes = [
   { path: '', component: BranchLocatorComponent },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class BranchLocatorRoutingModule { }

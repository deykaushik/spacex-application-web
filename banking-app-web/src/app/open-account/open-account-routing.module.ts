import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoBackGuard } from '../core/guards/go-back-guard.service';
import { OpenNewAccountComponent } from './open-new-account/open-new-account.component';

const routes: Routes = [
   { path: '', component: OpenNewAccountComponent , canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   ];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class OpenAccountRoutingModule { }

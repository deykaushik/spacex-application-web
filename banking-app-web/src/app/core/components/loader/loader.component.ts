import { Component, OnInit } from '@angular/core';

import { LoaderService } from '../../services/loader.service';
import { ILoaderProperties } from '../../services/models';
import { SystemErrorService } from '../../services/system-services.service';

@Component({
   selector: 'app-loader',
   templateUrl: './loader.component.html',
   styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {

   isLoading = true;
   color = 'green';

   constructor(private loader: LoaderService, private systemErrorService: SystemErrorService) { }

   ngOnInit() {
      this.loader.getLoader().subscribe((properties: ILoaderProperties) => {
         this.isLoading = properties.isShown;
         this.color = properties.color;
      });
      this.systemErrorService.getError().subscribe(() => {
         this.isLoading = false;
      });
   }
}

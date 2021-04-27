import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
   loadGA();
   enableProdMode();
}
function loadGA() {
   const scriptId = 'google-analytics';
   const gaScript = document.createElement('script') as any;
   gaScript.type = 'text/javascript';
   gaScript.id = scriptId;
   gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaTrackingId}`;


   const loadGAScript = document.createElement('script') as any;
   loadGAScript.type = 'text/javascript';
   loadGAScript.innerText = `window.dataLayer = window.dataLayer || [];
   function gtag(){dataLayer.push(arguments);}
   gtag('js', new Date());`;
   document.getElementsByTagName('body')[0].appendChild(gaScript);
   document.getElementsByTagName('body')[0].appendChild(loadGAScript);

}
platformBrowserDynamic().bootstrapModule(AppModule);

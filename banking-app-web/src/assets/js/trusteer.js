var trusteerLink = "";

(function () {
   var snippetID = '71524',
      host = 'www.splash-screen.net',
      sn = document.createElement('script');
   sn.setAttribute('async', true);
   sn.setAttribute('type', 'text/javascript');
   sn.setAttribute('src', (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//' + host + '/' + snippetID + '/' + 'rapi.js?f=trusteerCheck');
   var s = document.getElementsByTagName('script')[0];
   s.parentNode.insertBefore(sn, s);
})();

function trusteerCheck(obj, str, signature) {
   //console.log('1');   
   if (obj.v4.rapport_running) {
      
      // Rapport is running
      localStorage.setItem('TrusteerInstalled', 'true');
   }
   else {
      // Rapport is not running.
      // Is Rapport compatible with browser & OS?
      localStorage.setItem('TrusteerInstalled', 'false');
      if (obj.v4.compatible && obj.v4.download_link) {
         // Rapport is compatible; If download_link is not "null" then
         // it is OK to use the "download link" attribute
         // and redirect the user to the download location.
         // window.location = obj.v4.download_link;
         trusteerLink = obj.v4.download_link;
         //console.log('3');
      }
      else {
         // Rapport is not 
         //console.log('4');
      }
   }
}
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export class Api {

  constructor(private http: HttpClient, private actionUrl: string) { }

  getAll(query: {}, routeParams?: any): Observable<any> {
    const params = this.createQueryParams(query);
    const routeURL = this.createRouteURL(routeParams);
    const req = this.http.get(routeURL, { params });
    return req;
  }

  private createQueryParams(query: any): HttpParams {
    let params = new HttpParams();
    for (const key in query) {
      params = params.append(key, query[key]);
    }
    return params;
  }

  private createRouteURL(routeParams: any): string {
    let urlResult = this.actionUrl;
    if (routeParams) {
      for (const param in routeParams) {
        const myRegExp = new RegExp(':' + param);
        urlResult = urlResult.replace(myRegExp, routeParams[param]);
      }
    }
    return urlResult;
  }
}
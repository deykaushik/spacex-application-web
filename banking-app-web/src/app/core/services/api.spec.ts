import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { IApiResponse } from './models';
import { Constants } from '../utils/constants';

const urlEndPoint = 'test';
const mockTestData: ITest = {
   id: 1,
   accountNumber: '123456789'
};

interface ITest {
   id: number;
   accountNumber: string;
}

class Test implements ITest {
   constructor(public id: number, public accountNumber: string) { }
}

function getMethodTest(api, httpMock, mockData) {
   api.get(mockData.data.id)
      .subscribe((response: IApiResponse) => {
         expect(response.data.id).toEqual(mockData.data.id);
      });
}

function getAllMethodTest(api, httmpMock, mockData, query, routeParams?) {
   if (query) {
      api.getAll(query, routeParams)
         .subscribe((response: IApiResponse) => {
            expect(response.data.length).toEqual(1);
            expect(response.data[0].id).toEqual(mockData.data[0].id);
         });
   } else {
      api.getAll()
         .subscribe((response: IApiResponse) => {
            expect(response.data.length).toEqual(1);
            expect(response.data[0].id).toEqual(mockData.data[0].id);
         });
   }
}

function getBlobMethodTest(api, httmpMock, mockData, query) {
   if (query) {
      api.getBlob(mockData.fileType, query).subscribe((response: any) => {
         expect(response).toBeDefined();
      });
   } else {
      api.getBlob(mockData.fileType).subscribe((response: any) => {
         expect(response).toBeDefined();
      });
   }
}

function createMethodTest(api, httpMock, mockData, query, routeParams?) {
   if (query) {
      api.create(mockData, query, routeParams)
         .subscribe((response: IApiResponse) => {
            expect(response.data[0].id).toEqual(mockData.data[0].id);
         });
   } else {
      api.create(mockData)
         .subscribe((response: IApiResponse) => {
            expect(response.data[0].id).toEqual(mockData.data[0].id);
         });
   }
}

function updateMethodTest(api, httpMock, mockData, query, routeParams) {
   if (query) {
      api.update(mockData, query, routeParams)
         .subscribe((response: IApiResponse) => {
            expect(response.data[0].id).toEqual(mockData.data[0].id);
         });
   } else {
      api.update(mockData)
         .subscribe((response: IApiResponse) => {
            expect(response.data[0].id).toEqual(mockData.data[0].id);
         });
   }
}

function updateByIdMethodTest(api, httpMock, id, mockData) {
   api.updateById(id, mockData)
      .subscribe((response: IApiResponse) => {
         expect(response.metadata.resultData[0].id).toEqual(mockData.data.id);
      });
}

function removeMethodTest(api, httpMock, mockData) {
   api.remove(mockData.data.id)
      .subscribe((response: IApiResponse) => {
         expect(response.metadata.resultData[0].id).toEqual(mockData.data.id);
      });
}

describe('Api Class', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [HttpClient]
      });
   });

   describe('get request', () => {
      it('should get the response with model',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint, Test);
            const mockData = {
               data: mockTestData,
               metadata: {}
            };

            getMethodTest(api, httpMock, mockData);

            const req = httpMock.expectOne(`${urlEndPoint}/${mockData.data.id}`);
            expect(req.request.method).toEqual('GET');
            req.flush(mockData);
         }));

      it('should get the response without model',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint);
            const mockData = {
               data: mockTestData,
               metadata: {}
            };

            getMethodTest(api, httpMock, mockData);

            const req = httpMock.expectOne(`${urlEndPoint}/${mockData.data.id}`);
            expect(req.request.method).toEqual('GET');
            req.flush(mockData);
         }));
   });

   describe('getAll request', () => {
      it('should get response without query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint, Test);

            const mockData = {
               data: [
                  mockTestData
               ],
               metadata: {}
            };

            getAllMethodTest(api, httpMock, mockData, null, null);

            const req = httpMock.expectOne(urlEndPoint);
            expect(req.request.method).toEqual('GET');
            req.flush(mockData);
         }));

      it('should get response with query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint, Test);

            const mockData = {
               data: [
                  mockTestData
               ],
               metadata: {}
            };
            const query = { type: 'credit' };

            getAllMethodTest(api, httpMock, mockData, query);

            const req = httpMock.expectOne(`${urlEndPoint}?type=credit`);
            expect(req.request.method).toEqual('GET');
            req.flush(mockData);
         }));
   });

   describe('getAll request without model', () => {
      it('should get response without query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint);

            const mockData = {
               data: [
                  mockTestData
               ],
               metadata: {}
            };

            getAllMethodTest(api, httpMock, mockData, {});

            const req = httpMock.expectOne(urlEndPoint);
            expect(req.request.method).toEqual('GET');
            req.flush(mockData);
         }));

      it('should get response with query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint);

            const mockData = {
               data: [
                  mockTestData
               ],
               metadata: {}
            };
            const query = { type: 'credit' };

            getAllMethodTest(api, httpMock, mockData, query);

            const req = httpMock.expectOne(`${urlEndPoint}?type=credit`);
            expect(req.request.method).toEqual('GET');
            req.flush(mockData);
         }));
      it('should get response with route params string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint + '/:id');

            const mockData = {
               data: [
                  mockTestData
               ],
               metadata: {}
            };
            const query = { type: 'credit' };
            const routeParams = { id: 1 };

            getAllMethodTest(api, httpMock, mockData, query, routeParams);

            const req = httpMock.expectOne(`${urlEndPoint}/1?type=credit`);
            expect(req.request.method).toEqual('GET');
            req.flush(mockData);
         }));
   });

   describe('getBlob request', () => {
      it('should get response without query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api = new Api(http, urlEndPoint);
            const mockData = {
               data: [
                  mockTestData
               ],
               metadata: {},
               fileType: Constants.mimeTypes.applicationPDF
            };

            getBlobMethodTest(api, httpMock, mockData, null);

            const req = httpMock.expectOne(urlEndPoint);
            expect(req.request.method).toEqual('GET');
            req.flush(new Blob([mockTestData], {
               type: Constants.mimeTypes.applicationPDF
            }));
         }));

      it('should get response with query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api = new Api(http, urlEndPoint);

            const mockData = {
               data: [
                  mockTestData
               ],
               metadata: {},
               fileType: Constants.mimeTypes.applicationPDF
            };

            const query = { type: 'credit' };

            getBlobMethodTest(api, httpMock, mockData, query);

            const req = httpMock.expectOne(`${urlEndPoint}?type=credit`);
            expect(req.request.method).toEqual('GET');
            req.flush(new Blob([mockTestData], {
               type: Constants.mimeTypes.applicationPDF
            }));
         }));
   });

   describe('create request', () => {
      it('should post payload to server without query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint, Test);
            const mockData = {
               data: [mockTestData],
               metadata: {}
            };

            createMethodTest(api, httpMock, mockData, null, null);

            const req = httpMock.expectOne(urlEndPoint);
            expect(req.request.method).toEqual('POST');
            req.flush(mockData);
         }));

      it('should post payload to server with query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint, Test);
            const mockData = {
               data: [mockTestData],
               metadata: {}
            };
            const query = { type: 'credit' };
            createMethodTest(api, httpMock, mockData, query);

            const req = httpMock.expectOne(`${urlEndPoint}?type=credit`);
            expect(req.request.method).toEqual('POST');
            req.flush(mockData);
         }));

      it('should post payload to server with query string and route parameters',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint + '/:id', Test);
            const mockData = {
               data: [mockTestData],
               metadata: {}
            };
            const query = { type: 'credit' };
            const routeParams = { id: 1 };

            createMethodTest(api, httpMock, mockData, query, routeParams);

            const req = httpMock.expectOne(`${urlEndPoint}/1?type=credit`);
            expect(req.request.method).toEqual('POST');
            req.flush(mockData);
         }));
   });

   describe('update request', () => {
      it('should put payload to server without query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint, Test);
            const mockData = {
               data: [mockTestData],
               metadata: {}
            };

            updateMethodTest(api, httpMock, mockData, null, null);

            const req = httpMock.expectOne(urlEndPoint);
            expect(req.request.method).toEqual('PUT');
            req.flush(mockData);
         }));

      it('should put payload to server with query string',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint, Test);
            const mockData = {
               data: [mockTestData],
               metadata: {}
            };
            const query = { type: 'credit' };

            updateMethodTest(api, httpMock, mockData, query, null);

            const req = httpMock.expectOne(`${urlEndPoint}?type=credit`);
            expect(req.request.method).toEqual('PUT');
            req.flush(mockData);
         }));

      it('should put payload to server with query string and route parameters',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint + '/:id', Test);
            const mockData = {
               data: [mockTestData],
               metadata: {}
            };
            const query = { type: 'credit' };
            const routeParams = { id: 1 };

            updateMethodTest(api, httpMock, mockData, query, routeParams);

            const req = httpMock.expectOne(`${urlEndPoint}/1?type=credit`);
            expect(req.request.method).toEqual('PUT');
            req.flush(mockData);
         }));
   });

   describe('update by id request', () => {
      it('should put payload to server',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint, Test);
            const mockData = {
               data: mockTestData,
               metadata: {
                  resultData: [
                     {
                        id: 1
                     }
                  ]
               }
            };

            updateByIdMethodTest(api, httpMock, mockTestData.id, mockData);

            const req = httpMock.expectOne(`${urlEndPoint}/${mockTestData.id}`);
            expect(req.request.method).toEqual('PUT');
            req.flush(mockData);
         }));
   });

   describe('delete request', () => {
      it('should delete resource on server',
         inject([HttpTestingController, HttpClient], (httpMock: HttpTestingController, http: HttpClient) => {
            const api: Api<ITest> = new Api<ITest>(http, urlEndPoint, Test);
            const mockData = {
               data: mockTestData,
               metadata: {
                  resultData: [
                     {
                        id: 1
                     }
                  ]
               }
            };

            removeMethodTest(api, httpMock, mockData);

            const req = httpMock.expectOne(`${urlEndPoint}/${mockData.data.id}`);
            expect(req.request.method).toEqual('DELETE');
            req.flush(mockData);
         }));
   });

   afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
      httpMock.verify();
   }));
});

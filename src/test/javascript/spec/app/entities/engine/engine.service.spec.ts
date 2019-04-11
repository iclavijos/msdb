/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { EngineService } from 'app/entities/engine/engine.service';
import { IEngine, Engine } from 'app/shared/model/engine.model';

describe('Service Tests', () => {
    describe('Engine Service', () => {
        let injector: TestBed;
        let service: EngineService;
        let httpMock: HttpTestingController;
        let elemDefault: IEngine;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(EngineService);
            httpMock = injector.get(HttpTestingController);

            elemDefault = new Engine(0, 'AAAAAAA', 'AAAAAAA', 0, 'AAAAAAA', 0, false, false, false, false, 'image/png', 'AAAAAAA');
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign({}, elemDefault);
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a Engine', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0
                    },
                    elemDefault
                );
                const expected = Object.assign({}, returnedFromService);
                service
                    .create(new Engine(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Engine', async () => {
                const returnedFromService = Object.assign(
                    {
                        name: 'BBBBBB',
                        manufacturer: 'BBBBBB',
                        capacity: 1,
                        architecture: 'BBBBBB',
                        debutYear: 1,
                        petrolEngine: true,
                        dieselEngine: true,
                        electricEngine: true,
                        turbo: true,
                        image: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign({}, returnedFromService);
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of Engine', async () => {
                const returnedFromService = Object.assign(
                    {
                        name: 'BBBBBB',
                        manufacturer: 'BBBBBB',
                        capacity: 1,
                        architecture: 'BBBBBB',
                        debutYear: 1,
                        petrolEngine: true,
                        dieselEngine: true,
                        electricEngine: true,
                        turbo: true,
                        image: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign({}, returnedFromService);
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a Engine', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});

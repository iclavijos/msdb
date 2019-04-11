/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { DriverService } from 'app/entities/driver/driver.service';
import { IDriver, Driver } from 'app/shared/model/driver.model';

describe('Service Tests', () => {
    describe('Driver Service', () => {
        let injector: TestBed;
        let service: DriverService;
        let httpMock: HttpTestingController;
        let elemDefault: IDriver;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(DriverService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new Driver(0, 'AAAAAAA', 'AAAAAAA', currentDate, 'AAAAAAA', currentDate, 'AAAAAAA', 'image/png', 'AAAAAAA');
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        birthDate: currentDate.format(DATE_FORMAT),
                        deathDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a Driver', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        birthDate: currentDate.format(DATE_FORMAT),
                        deathDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        birthDate: currentDate,
                        deathDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new Driver(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a Driver', async () => {
                const returnedFromService = Object.assign(
                    {
                        name: 'BBBBBB',
                        surname: 'BBBBBB',
                        birthDate: currentDate.format(DATE_FORMAT),
                        birthPlace: 'BBBBBB',
                        deathDate: currentDate.format(DATE_FORMAT),
                        deathPlace: 'BBBBBB',
                        portrait: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        birthDate: currentDate,
                        deathDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of Driver', async () => {
                const returnedFromService = Object.assign(
                    {
                        name: 'BBBBBB',
                        surname: 'BBBBBB',
                        birthDate: currentDate.format(DATE_FORMAT),
                        birthPlace: 'BBBBBB',
                        deathDate: currentDate.format(DATE_FORMAT),
                        deathPlace: 'BBBBBB',
                        portrait: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        birthDate: currentDate,
                        deathDate: currentDate
                    },
                    returnedFromService
                );
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

            it('should delete a Driver', async () => {
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

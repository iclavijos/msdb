/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { EventEditionService } from 'app/entities/event-edition/event-edition.service';
import { IEventEdition, EventEdition } from 'app/shared/model/event-edition.model';

describe('Service Tests', () => {
    describe('EventEdition Service', () => {
        let injector: TestBed;
        let service: EventEditionService;
        let httpMock: HttpTestingController;
        let elemDefault: IEventEdition;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(EventEditionService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new EventEdition(0, 0, 'AAAAAAA', 'AAAAAAA', currentDate);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        eventDate: currentDate.format(DATE_FORMAT)
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

            it('should create a EventEdition', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        eventDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        eventDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new EventEdition(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a EventEdition', async () => {
                const returnedFromService = Object.assign(
                    {
                        editionYear: 1,
                        shortEventName: 'BBBBBB',
                        longEventName: 'BBBBBB',
                        eventDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        eventDate: currentDate
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

            it('should return a list of EventEdition', async () => {
                const returnedFromService = Object.assign(
                    {
                        editionYear: 1,
                        shortEventName: 'BBBBBB',
                        longEventName: 'BBBBBB',
                        eventDate: currentDate.format(DATE_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        eventDate: currentDate
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

            it('should delete a EventEdition', async () => {
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

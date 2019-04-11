/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { EventSessionService } from 'app/entities/event-session/event-session.service';
import { IEventSession, EventSession } from 'app/shared/model/event-session.model';

describe('Service Tests', () => {
    describe('EventSession Service', () => {
        let injector: TestBed;
        let service: EventSessionService;
        let httpMock: HttpTestingController;
        let elemDefault: IEventSession;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(EventSessionService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new EventSession(0, 'AAAAAAA', 'AAAAAAA', currentDate, 0);
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        sessionStartTime: currentDate.format(DATE_TIME_FORMAT)
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

            it('should create a EventSession', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        sessionStartTime: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        sessionStartTime: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new EventSession(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a EventSession', async () => {
                const returnedFromService = Object.assign(
                    {
                        name: 'BBBBBB',
                        shortname: 'BBBBBB',
                        sessionStartTime: currentDate.format(DATE_TIME_FORMAT),
                        duration: 1
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        sessionStartTime: currentDate
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

            it('should return a list of EventSession', async () => {
                const returnedFromService = Object.assign(
                    {
                        name: 'BBBBBB',
                        shortname: 'BBBBBB',
                        sessionStartTime: currentDate.format(DATE_TIME_FORMAT),
                        duration: 1
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        sessionStartTime: currentDate
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

            it('should delete a EventSession', async () => {
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

import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(EventSessionService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new EventSession(0, 'AAAAAAA', 'AAAAAAA', currentDate, 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            sessionStartTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a EventSession', () => {
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
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a EventSession', () => {
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
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of EventSession', () => {
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
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a EventSession', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

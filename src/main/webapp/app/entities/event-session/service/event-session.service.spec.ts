import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEventSession, EventSession } from '../event-session.model';

import { EventSessionService } from './event-session.service';

describe('EventSession Service', () => {
  let service: EventSessionService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventSession;
  let expectedResult: IEventSession | IEventSession[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventSessionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      shortname: 'AAAAAAA',
      sessionStartTime: currentDate,
      duration: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          sessionStartTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a EventSession', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          sessionStartTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          sessionStartTime: currentDate,
        },
        returnedFromService
      );

      service.create(new EventSession()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventSession', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          shortname: 'BBBBBB',
          sessionStartTime: currentDate.format(DATE_TIME_FORMAT),
          duration: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          sessionStartTime: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EventSession', () => {
      const patchObject = Object.assign(
        {
          shortname: 'BBBBBB',
          sessionStartTime: currentDate.format(DATE_TIME_FORMAT),
        },
        new EventSession()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          sessionStartTime: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EventSession', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          shortname: 'BBBBBB',
          sessionStartTime: currentDate.format(DATE_TIME_FORMAT),
          duration: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          sessionStartTime: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

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

    describe('addEventSessionToCollectionIfMissing', () => {
      it('should add a EventSession to an empty array', () => {
        const eventSession: IEventSession = { id: 123 };
        expectedResult = service.addEventSessionToCollectionIfMissing([], eventSession);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventSession);
      });

      it('should not add a EventSession to an array that contains it', () => {
        const eventSession: IEventSession = { id: 123 };
        const eventSessionCollection: IEventSession[] = [
          {
            ...eventSession,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventSessionToCollectionIfMissing(eventSessionCollection, eventSession);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventSession to an array that doesn't contain it", () => {
        const eventSession: IEventSession = { id: 123 };
        const eventSessionCollection: IEventSession[] = [{ id: 456 }];
        expectedResult = service.addEventSessionToCollectionIfMissing(eventSessionCollection, eventSession);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventSession);
      });

      it('should add only unique EventSession to an array', () => {
        const eventSessionArray: IEventSession[] = [{ id: 123 }, { id: 456 }, { id: 29986 }];
        const eventSessionCollection: IEventSession[] = [{ id: 123 }];
        expectedResult = service.addEventSessionToCollectionIfMissing(eventSessionCollection, ...eventSessionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventSession: IEventSession = { id: 123 };
        const eventSession2: IEventSession = { id: 456 };
        expectedResult = service.addEventSessionToCollectionIfMissing([], eventSession, eventSession2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventSession);
        expect(expectedResult).toContain(eventSession2);
      });

      it('should accept null and undefined values', () => {
        const eventSession: IEventSession = { id: 123 };
        expectedResult = service.addEventSessionToCollectionIfMissing([], null, eventSession, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventSession);
      });

      it('should return initial array if no EventSession is added', () => {
        const eventSessionCollection: IEventSession[] = [{ id: 123 }];
        expectedResult = service.addEventSessionToCollectionIfMissing(eventSessionCollection, undefined, null);
        expect(expectedResult).toEqual(eventSessionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

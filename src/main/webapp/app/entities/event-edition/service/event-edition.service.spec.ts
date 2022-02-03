import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEventEdition, EventEdition } from '../event-edition.model';

import { EventEditionService } from './event-edition.service';

describe('EventEdition Service', () => {
  let service: EventEditionService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventEdition;
  let expectedResult: IEventEdition | IEventEdition[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventEditionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      editionYear: 0,
      shortEventName: 'AAAAAAA',
      longEventName: 'AAAAAAA',
      eventDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          eventDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a EventEdition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          eventDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          eventDate: currentDate,
        },
        returnedFromService
      );

      service.create(new EventEdition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventEdition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          editionYear: 1,
          shortEventName: 'BBBBBB',
          longEventName: 'BBBBBB',
          eventDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          eventDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EventEdition', () => {
      const patchObject = Object.assign(
        {
          editionYear: 1,
          longEventName: 'BBBBBB',
          eventDate: currentDate.format(DATE_FORMAT),
        },
        new EventEdition()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          eventDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EventEdition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          editionYear: 1,
          shortEventName: 'BBBBBB',
          longEventName: 'BBBBBB',
          eventDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          eventDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a EventEdition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventEditionToCollectionIfMissing', () => {
      it('should add a EventEdition to an empty array', () => {
        const eventEdition: IEventEdition = { id: 123 };
        expectedResult = service.addEventEditionToCollectionIfMissing([], eventEdition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventEdition);
      });

      it('should not add a EventEdition to an array that contains it', () => {
        const eventEdition: IEventEdition = { id: 123 };
        const eventEditionCollection: IEventEdition[] = [
          {
            ...eventEdition,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventEditionToCollectionIfMissing(eventEditionCollection, eventEdition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventEdition to an array that doesn't contain it", () => {
        const eventEdition: IEventEdition = { id: 123 };
        const eventEditionCollection: IEventEdition[] = [{ id: 456 }];
        expectedResult = service.addEventEditionToCollectionIfMissing(eventEditionCollection, eventEdition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventEdition);
      });

      it('should add only unique EventEdition to an array', () => {
        const eventEditionArray: IEventEdition[] = [{ id: 123 }, { id: 456 }, { id: 67308 }];
        const eventEditionCollection: IEventEdition[] = [{ id: 123 }];
        expectedResult = service.addEventEditionToCollectionIfMissing(eventEditionCollection, ...eventEditionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventEdition: IEventEdition = { id: 123 };
        const eventEdition2: IEventEdition = { id: 456 };
        expectedResult = service.addEventEditionToCollectionIfMissing([], eventEdition, eventEdition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventEdition);
        expect(expectedResult).toContain(eventEdition2);
      });

      it('should accept null and undefined values', () => {
        const eventEdition: IEventEdition = { id: 123 };
        expectedResult = service.addEventEditionToCollectionIfMissing([], null, eventEdition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventEdition);
      });

      it('should return initial array if no EventEdition is added', () => {
        const eventEditionCollection: IEventEdition[] = [{ id: 123 }];
        expectedResult = service.addEventEditionToCollectionIfMissing(eventEditionCollection, undefined, null);
        expect(expectedResult).toEqual(eventEditionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

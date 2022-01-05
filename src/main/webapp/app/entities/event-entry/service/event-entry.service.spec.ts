import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEventEntry, EventEntry } from '../event-entry.model';

import { EventEntryService } from './event-entry.service';

describe('EventEntry Service', () => {
  let service: EventEntryService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventEntry;
  let expectedResult: IEventEntry | IEventEntry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventEntryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      teamName: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a EventEntry', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EventEntry()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventEntry', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          teamName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EventEntry', () => {
      const patchObject = Object.assign(
        {
          teamName: 'BBBBBB',
        },
        new EventEntry()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EventEntry', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          teamName: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a EventEntry', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventEntryToCollectionIfMissing', () => {
      it('should add a EventEntry to an empty array', () => {
        const eventEntry: IEventEntry = { id: 123 };
        expectedResult = service.addEventEntryToCollectionIfMissing([], eventEntry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventEntry);
      });

      it('should not add a EventEntry to an array that contains it', () => {
        const eventEntry: IEventEntry = { id: 123 };
        const eventEntryCollection: IEventEntry[] = [
          {
            ...eventEntry,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventEntryToCollectionIfMissing(eventEntryCollection, eventEntry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventEntry to an array that doesn't contain it", () => {
        const eventEntry: IEventEntry = { id: 123 };
        const eventEntryCollection: IEventEntry[] = [{ id: 456 }];
        expectedResult = service.addEventEntryToCollectionIfMissing(eventEntryCollection, eventEntry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventEntry);
      });

      it('should add only unique EventEntry to an array', () => {
        const eventEntryArray: IEventEntry[] = [{ id: 123 }, { id: 456 }, { id: 72494 }];
        const eventEntryCollection: IEventEntry[] = [{ id: 123 }];
        expectedResult = service.addEventEntryToCollectionIfMissing(eventEntryCollection, ...eventEntryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventEntry: IEventEntry = { id: 123 };
        const eventEntry2: IEventEntry = { id: 456 };
        expectedResult = service.addEventEntryToCollectionIfMissing([], eventEntry, eventEntry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventEntry);
        expect(expectedResult).toContain(eventEntry2);
      });

      it('should accept null and undefined values', () => {
        const eventEntry: IEventEntry = { id: 123 };
        expectedResult = service.addEventEntryToCollectionIfMissing([], null, eventEntry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventEntry);
      });

      it('should return initial array if no EventEntry is added', () => {
        const eventEntryCollection: IEventEntry[] = [{ id: 123 }];
        expectedResult = service.addEventEntryToCollectionIfMissing(eventEntryCollection, undefined, null);
        expect(expectedResult).toEqual(eventEntryCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

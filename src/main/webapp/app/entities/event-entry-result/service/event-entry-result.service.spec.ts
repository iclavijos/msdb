import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEventEntryResult, EventEntryResult } from '../event-entry-result.model';

import { EventEntryResultService } from './event-entry-result.service';

describe('EventEntryResult Service', () => {
  let service: EventEntryResultService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventEntryResult;
  let expectedResult: IEventEntryResult | IEventEntryResult[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventEntryResultService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      finalPosition: 0,
      totalTime: 0,
      bestLapTime: 0,
      lapsCompleted: 0,
      retired: false,
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

    it('should create a EventEntryResult', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EventEntryResult()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventEntryResult', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          finalPosition: 1,
          totalTime: 1,
          bestLapTime: 1,
          lapsCompleted: 1,
          retired: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EventEntryResult', () => {
      const patchObject = Object.assign(
        {
          totalTime: 1,
          bestLapTime: 1,
          retired: true,
        },
        new EventEntryResult()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EventEntryResult', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          finalPosition: 1,
          totalTime: 1,
          bestLapTime: 1,
          lapsCompleted: 1,
          retired: true,
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

    it('should delete a EventEntryResult', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventEntryResultToCollectionIfMissing', () => {
      it('should add a EventEntryResult to an empty array', () => {
        const eventEntryResult: IEventEntryResult = { id: 123 };
        expectedResult = service.addEventEntryResultToCollectionIfMissing([], eventEntryResult);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventEntryResult);
      });

      it('should not add a EventEntryResult to an array that contains it', () => {
        const eventEntryResult: IEventEntryResult = { id: 123 };
        const eventEntryResultCollection: IEventEntryResult[] = [
          {
            ...eventEntryResult,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventEntryResultToCollectionIfMissing(eventEntryResultCollection, eventEntryResult);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventEntryResult to an array that doesn't contain it", () => {
        const eventEntryResult: IEventEntryResult = { id: 123 };
        const eventEntryResultCollection: IEventEntryResult[] = [{ id: 456 }];
        expectedResult = service.addEventEntryResultToCollectionIfMissing(eventEntryResultCollection, eventEntryResult);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventEntryResult);
      });

      it('should add only unique EventEntryResult to an array', () => {
        const eventEntryResultArray: IEventEntryResult[] = [{ id: 123 }, { id: 456 }, { id: 84779 }];
        const eventEntryResultCollection: IEventEntryResult[] = [{ id: 123 }];
        expectedResult = service.addEventEntryResultToCollectionIfMissing(eventEntryResultCollection, ...eventEntryResultArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventEntryResult: IEventEntryResult = { id: 123 };
        const eventEntryResult2: IEventEntryResult = { id: 456 };
        expectedResult = service.addEventEntryResultToCollectionIfMissing([], eventEntryResult, eventEntryResult2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventEntryResult);
        expect(expectedResult).toContain(eventEntryResult2);
      });

      it('should accept null and undefined values', () => {
        const eventEntryResult: IEventEntryResult = { id: 123 };
        expectedResult = service.addEventEntryResultToCollectionIfMissing([], null, eventEntryResult, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventEntryResult);
      });

      it('should return initial array if no EventEntryResult is added', () => {
        const eventEntryResultCollection: IEventEntryResult[] = [{ id: 123 }];
        expectedResult = service.addEventEntryResultToCollectionIfMissing(eventEntryResultCollection, undefined, null);
        expect(expectedResult).toEqual(eventEntryResultCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

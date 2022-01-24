import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRacetrack, Racetrack } from '../racetrack.model';

import { RacetrackService } from './racetrack.service';

describe('Racetrack Service', () => {
  let service: RacetrackService;
  let httpMock: HttpTestingController;
  let elemDefault: IRacetrack;
  let expectedResult: IRacetrack | IRacetrack[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RacetrackService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      location: 'AAAAAAA',
      logoContentType: 'image/png',
      logo: 'AAAAAAA',
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

    it('should create a Racetrack', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Racetrack()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Racetrack', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          location: 'BBBBBB',
          logo: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Racetrack', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          location: 'BBBBBB',
          logo: 'BBBBBB',
        },
        new Racetrack()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Racetrack', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          location: 'BBBBBB',
          logo: 'BBBBBB',
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

    it('should delete a Racetrack', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRacetrackToCollectionIfMissing', () => {
      it('should add a Racetrack to an empty array', () => {
        const racetrack: IRacetrack = { id: 123 };
        expectedResult = service.addRacetrackToCollectionIfMissing([], racetrack);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(racetrack);
      });

      it('should not add a Racetrack to an array that contains it', () => {
        const racetrack: IRacetrack = { id: 123 };
        const racetrackCollection: IRacetrack[] = [
          {
            ...racetrack,
          },
          { id: 456 },
        ];
        expectedResult = service.addRacetrackToCollectionIfMissing(racetrackCollection, racetrack);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Racetrack to an array that doesn't contain it", () => {
        const racetrack: IRacetrack = { id: 123 };
        const racetrackCollection: IRacetrack[] = [{ id: 456 }];
        expectedResult = service.addRacetrackToCollectionIfMissing(racetrackCollection, racetrack);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(racetrack);
      });

      it('should add only unique Racetrack to an array', () => {
        const racetrackArray: IRacetrack[] = [{ id: 123 }, { id: 456 }, { id: 74502 }];
        const racetrackCollection: IRacetrack[] = [{ id: 123 }];
        expectedResult = service.addRacetrackToCollectionIfMissing(racetrackCollection, ...racetrackArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const racetrack: IRacetrack = { id: 123 };
        const racetrack2: IRacetrack = { id: 456 };
        expectedResult = service.addRacetrackToCollectionIfMissing([], racetrack, racetrack2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(racetrack);
        expect(expectedResult).toContain(racetrack2);
      });

      it('should accept null and undefined values', () => {
        const racetrack: IRacetrack = { id: 123 };
        expectedResult = service.addRacetrackToCollectionIfMissing([], null, racetrack, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(racetrack);
      });

      it('should return initial array if no Racetrack is added', () => {
        const racetrackCollection: IRacetrack[] = [{ id: 123 }];
        expectedResult = service.addRacetrackToCollectionIfMissing(racetrackCollection, undefined, null);
        expect(expectedResult).toEqual(racetrackCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

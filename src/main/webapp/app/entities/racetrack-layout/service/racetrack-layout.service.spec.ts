import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRacetrackLayout, RacetrackLayout } from '../racetrack-layout.model';

import { RacetrackLayoutService } from './racetrack-layout.service';

describe('RacetrackLayout Service', () => {
  let service: RacetrackLayoutService;
  let httpMock: HttpTestingController;
  let elemDefault: IRacetrackLayout;
  let expectedResult: IRacetrackLayout | IRacetrackLayout[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RacetrackLayoutService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      length: 0,
      yearFirstUse: 0,
      layoutImageContentType: 'image/png',
      layoutImage: 'AAAAAAA',
      active: false,
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

    it('should create a RacetrackLayout', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new RacetrackLayout()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RacetrackLayout', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          length: 1,
          yearFirstUse: 1,
          layoutImage: 'BBBBBB',
          active: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RacetrackLayout', () => {
      const patchObject = Object.assign(
        {
          length: 1,
          layoutImage: 'BBBBBB',
        },
        new RacetrackLayout()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RacetrackLayout', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          length: 1,
          yearFirstUse: 1,
          layoutImage: 'BBBBBB',
          active: true,
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

    it('should delete a RacetrackLayout', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRacetrackLayoutToCollectionIfMissing', () => {
      it('should add a RacetrackLayout to an empty array', () => {
        const racetrackLayout: IRacetrackLayout = { id: 123 };
        expectedResult = service.addRacetrackLayoutToCollectionIfMissing([], racetrackLayout);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(racetrackLayout);
      });

      it('should not add a RacetrackLayout to an array that contains it', () => {
        const racetrackLayout: IRacetrackLayout = { id: 123 };
        const racetrackLayoutCollection: IRacetrackLayout[] = [
          {
            ...racetrackLayout,
          },
          { id: 456 },
        ];
        expectedResult = service.addRacetrackLayoutToCollectionIfMissing(racetrackLayoutCollection, racetrackLayout);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RacetrackLayout to an array that doesn't contain it", () => {
        const racetrackLayout: IRacetrackLayout = { id: 123 };
        const racetrackLayoutCollection: IRacetrackLayout[] = [{ id: 456 }];
        expectedResult = service.addRacetrackLayoutToCollectionIfMissing(racetrackLayoutCollection, racetrackLayout);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(racetrackLayout);
      });

      it('should add only unique RacetrackLayout to an array', () => {
        const racetrackLayoutArray: IRacetrackLayout[] = [{ id: 123 }, { id: 456 }, { id: 12267 }];
        const racetrackLayoutCollection: IRacetrackLayout[] = [{ id: 123 }];
        expectedResult = service.addRacetrackLayoutToCollectionIfMissing(racetrackLayoutCollection, ...racetrackLayoutArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const racetrackLayout: IRacetrackLayout = { id: 123 };
        const racetrackLayout2: IRacetrackLayout = { id: 456 };
        expectedResult = service.addRacetrackLayoutToCollectionIfMissing([], racetrackLayout, racetrackLayout2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(racetrackLayout);
        expect(expectedResult).toContain(racetrackLayout2);
      });

      it('should accept null and undefined values', () => {
        const racetrackLayout: IRacetrackLayout = { id: 123 };
        expectedResult = service.addRacetrackLayoutToCollectionIfMissing([], null, racetrackLayout, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(racetrackLayout);
      });

      it('should return initial array if no RacetrackLayout is added', () => {
        const racetrackLayoutCollection: IRacetrackLayout[] = [{ id: 123 }];
        expectedResult = service.addRacetrackLayoutToCollectionIfMissing(racetrackLayoutCollection, undefined, null);
        expect(expectedResult).toEqual(racetrackLayoutCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

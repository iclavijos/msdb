import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPointsSystem, PointsSystem } from '../points-system.model';

import { PointsSystemService } from './points-system.service';

describe('PointsSystem Service', () => {
  let service: PointsSystemService;
  let httpMock: HttpTestingController;
  let elemDefault: IPointsSystem;
  let expectedResult: IPointsSystem | IPointsSystem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PointsSystemService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      points: 'AAAAAAA',
      pointsMostLeadLaps: 0,
      pointsFastLap: 0,
      pointsPole: 0,
      pointsLeadLap: 0,
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

    it('should create a PointsSystem', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PointsSystem()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PointsSystem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          points: 'BBBBBB',
          pointsMostLeadLaps: 1,
          pointsFastLap: 1,
          pointsPole: 1,
          pointsLeadLap: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PointsSystem', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          pointsMostLeadLaps: 1,
          pointsFastLap: 1,
          pointsPole: 1,
        },
        new PointsSystem()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PointsSystem', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          points: 'BBBBBB',
          pointsMostLeadLaps: 1,
          pointsFastLap: 1,
          pointsPole: 1,
          pointsLeadLap: 1,
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

    it('should delete a PointsSystem', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPointsSystemToCollectionIfMissing', () => {
      it('should add a PointsSystem to an empty array', () => {
        const pointsSystem: IPointsSystem = { id: 123 };
        expectedResult = service.addPointsSystemToCollectionIfMissing([], pointsSystem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pointsSystem);
      });

      it('should not add a PointsSystem to an array that contains it', () => {
        const pointsSystem: IPointsSystem = { id: 123 };
        const pointsSystemCollection: IPointsSystem[] = [
          {
            ...pointsSystem,
          },
          { id: 456 },
        ];
        expectedResult = service.addPointsSystemToCollectionIfMissing(pointsSystemCollection, pointsSystem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PointsSystem to an array that doesn't contain it", () => {
        const pointsSystem: IPointsSystem = { id: 123 };
        const pointsSystemCollection: IPointsSystem[] = [{ id: 456 }];
        expectedResult = service.addPointsSystemToCollectionIfMissing(pointsSystemCollection, pointsSystem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pointsSystem);
      });

      it('should add only unique PointsSystem to an array', () => {
        const pointsSystemArray: IPointsSystem[] = [{ id: 123 }, { id: 456 }, { id: 69753 }];
        const pointsSystemCollection: IPointsSystem[] = [{ id: 123 }];
        expectedResult = service.addPointsSystemToCollectionIfMissing(pointsSystemCollection, ...pointsSystemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pointsSystem: IPointsSystem = { id: 123 };
        const pointsSystem2: IPointsSystem = { id: 456 };
        expectedResult = service.addPointsSystemToCollectionIfMissing([], pointsSystem, pointsSystem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pointsSystem);
        expect(expectedResult).toContain(pointsSystem2);
      });

      it('should accept null and undefined values', () => {
        const pointsSystem: IPointsSystem = { id: 123 };
        expectedResult = service.addPointsSystemToCollectionIfMissing([], null, pointsSystem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pointsSystem);
      });

      it('should return initial array if no PointsSystem is added', () => {
        const pointsSystemCollection: IPointsSystem[] = [{ id: 123 }];
        expectedResult = service.addPointsSystemToCollectionIfMissing(pointsSystemCollection, undefined, null);
        expect(expectedResult).toEqual(pointsSystemCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChassis, Chassis } from '../chassis.model';

import { ChassisService } from './chassis.service';

describe('Chassis Service', () => {
  let service: ChassisService;
  let httpMock: HttpTestingController;
  let elemDefault: IChassis;
  let expectedResult: IChassis | IChassis[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChassisService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      manufacturer: 'AAAAAAA',
      debutYear: 0,
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

    it('should create a Chassis', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Chassis()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Chassis', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          manufacturer: 'BBBBBB',
          debutYear: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Chassis', () => {
      const patchObject = Object.assign(
        {
          manufacturer: 'BBBBBB',
        },
        new Chassis()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Chassis', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          manufacturer: 'BBBBBB',
          debutYear: 1,
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

    it('should delete a Chassis', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChassisToCollectionIfMissing', () => {
      it('should add a Chassis to an empty array', () => {
        const chassis: IChassis = { id: 123 };
        expectedResult = service.addChassisToCollectionIfMissing([], chassis);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chassis);
      });

      it('should not add a Chassis to an array that contains it', () => {
        const chassis: IChassis = { id: 123 };
        const chassisCollection: IChassis[] = [
          {
            ...chassis,
          },
          { id: 456 },
        ];
        expectedResult = service.addChassisToCollectionIfMissing(chassisCollection, chassis);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Chassis to an array that doesn't contain it", () => {
        const chassis: IChassis = { id: 123 };
        const chassisCollection: IChassis[] = [{ id: 456 }];
        expectedResult = service.addChassisToCollectionIfMissing(chassisCollection, chassis);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chassis);
      });

      it('should add only unique Chassis to an array', () => {
        const chassisArray: IChassis[] = [{ id: 123 }, { id: 456 }, { id: 52738 }];
        const chassisCollection: IChassis[] = [{ id: 123 }];
        expectedResult = service.addChassisToCollectionIfMissing(chassisCollection, ...chassisArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chassis: IChassis = { id: 123 };
        const chassis2: IChassis = { id: 456 };
        expectedResult = service.addChassisToCollectionIfMissing([], chassis, chassis2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chassis);
        expect(expectedResult).toContain(chassis2);
      });

      it('should accept null and undefined values', () => {
        const chassis: IChassis = { id: 123 };
        expectedResult = service.addChassisToCollectionIfMissing([], null, chassis, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chassis);
      });

      it('should return initial array if no Chassis is added', () => {
        const chassisCollection: IChassis[] = [{ id: 123 }];
        expectedResult = service.addChassisToCollectionIfMissing(chassisCollection, undefined, null);
        expect(expectedResult).toEqual(chassisCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

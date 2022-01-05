import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDriverPointsDetails, DriverPointsDetails } from '../driver-points-details.model';

import { DriverPointsDetailsService } from './driver-points-details.service';

describe('DriverPointsDetails Service', () => {
  let service: DriverPointsDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IDriverPointsDetails;
  let expectedResult: IDriverPointsDetails | IDriverPointsDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DriverPointsDetailsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a DriverPointsDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new DriverPointsDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DriverPointsDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DriverPointsDetails', () => {
      const patchObject = Object.assign({}, new DriverPointsDetails());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DriverPointsDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a DriverPointsDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDriverPointsDetailsToCollectionIfMissing', () => {
      it('should add a DriverPointsDetails to an empty array', () => {
        const driverPointsDetails: IDriverPointsDetails = { id: 123 };
        expectedResult = service.addDriverPointsDetailsToCollectionIfMissing([], driverPointsDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(driverPointsDetails);
      });

      it('should not add a DriverPointsDetails to an array that contains it', () => {
        const driverPointsDetails: IDriverPointsDetails = { id: 123 };
        const driverPointsDetailsCollection: IDriverPointsDetails[] = [
          {
            ...driverPointsDetails,
          },
          { id: 456 },
        ];
        expectedResult = service.addDriverPointsDetailsToCollectionIfMissing(driverPointsDetailsCollection, driverPointsDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DriverPointsDetails to an array that doesn't contain it", () => {
        const driverPointsDetails: IDriverPointsDetails = { id: 123 };
        const driverPointsDetailsCollection: IDriverPointsDetails[] = [{ id: 456 }];
        expectedResult = service.addDriverPointsDetailsToCollectionIfMissing(driverPointsDetailsCollection, driverPointsDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(driverPointsDetails);
      });

      it('should add only unique DriverPointsDetails to an array', () => {
        const driverPointsDetailsArray: IDriverPointsDetails[] = [{ id: 123 }, { id: 456 }, { id: 76608 }];
        const driverPointsDetailsCollection: IDriverPointsDetails[] = [{ id: 123 }];
        expectedResult = service.addDriverPointsDetailsToCollectionIfMissing(driverPointsDetailsCollection, ...driverPointsDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const driverPointsDetails: IDriverPointsDetails = { id: 123 };
        const driverPointsDetails2: IDriverPointsDetails = { id: 456 };
        expectedResult = service.addDriverPointsDetailsToCollectionIfMissing([], driverPointsDetails, driverPointsDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(driverPointsDetails);
        expect(expectedResult).toContain(driverPointsDetails2);
      });

      it('should accept null and undefined values', () => {
        const driverPointsDetails: IDriverPointsDetails = { id: 123 };
        expectedResult = service.addDriverPointsDetailsToCollectionIfMissing([], null, driverPointsDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(driverPointsDetails);
      });

      it('should return initial array if no DriverPointsDetails is added', () => {
        const driverPointsDetailsCollection: IDriverPointsDetails[] = [{ id: 123 }];
        expectedResult = service.addDriverPointsDetailsToCollectionIfMissing(driverPointsDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(driverPointsDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFuelProvider, FuelProvider } from '../fuel-provider.model';

import { FuelProviderService } from './fuel-provider.service';

describe('FuelProvider Service', () => {
  let service: FuelProviderService;
  let httpMock: HttpTestingController;
  let elemDefault: IFuelProvider;
  let expectedResult: IFuelProvider | IFuelProvider[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FuelProviderService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
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

    it('should create a FuelProvider', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FuelProvider()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FuelProvider', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should partial update a FuelProvider', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new FuelProvider()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FuelProvider', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should delete a FuelProvider', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFuelProviderToCollectionIfMissing', () => {
      it('should add a FuelProvider to an empty array', () => {
        const fuelProvider: IFuelProvider = { id: 123 };
        expectedResult = service.addFuelProviderToCollectionIfMissing([], fuelProvider);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fuelProvider);
      });

      it('should not add a FuelProvider to an array that contains it', () => {
        const fuelProvider: IFuelProvider = { id: 123 };
        const fuelProviderCollection: IFuelProvider[] = [
          {
            ...fuelProvider,
          },
          { id: 456 },
        ];
        expectedResult = service.addFuelProviderToCollectionIfMissing(fuelProviderCollection, fuelProvider);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FuelProvider to an array that doesn't contain it", () => {
        const fuelProvider: IFuelProvider = { id: 123 };
        const fuelProviderCollection: IFuelProvider[] = [{ id: 456 }];
        expectedResult = service.addFuelProviderToCollectionIfMissing(fuelProviderCollection, fuelProvider);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fuelProvider);
      });

      it('should add only unique FuelProvider to an array', () => {
        const fuelProviderArray: IFuelProvider[] = [{ id: 123 }, { id: 456 }, { id: 96467 }];
        const fuelProviderCollection: IFuelProvider[] = [{ id: 123 }];
        expectedResult = service.addFuelProviderToCollectionIfMissing(fuelProviderCollection, ...fuelProviderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fuelProvider: IFuelProvider = { id: 123 };
        const fuelProvider2: IFuelProvider = { id: 456 };
        expectedResult = service.addFuelProviderToCollectionIfMissing([], fuelProvider, fuelProvider2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fuelProvider);
        expect(expectedResult).toContain(fuelProvider2);
      });

      it('should accept null and undefined values', () => {
        const fuelProvider: IFuelProvider = { id: 123 };
        expectedResult = service.addFuelProviderToCollectionIfMissing([], null, fuelProvider, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fuelProvider);
      });

      it('should return initial array if no FuelProvider is added', () => {
        const fuelProviderCollection: IFuelProvider[] = [{ id: 123 }];
        expectedResult = service.addFuelProviderToCollectionIfMissing(fuelProviderCollection, undefined, null);
        expect(expectedResult).toEqual(fuelProviderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

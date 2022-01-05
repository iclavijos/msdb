import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITyreProvider, TyreProvider } from '../tyre-provider.model';

import { TyreProviderService } from './tyre-provider.service';

describe('TyreProvider Service', () => {
  let service: TyreProviderService;
  let httpMock: HttpTestingController;
  let elemDefault: ITyreProvider;
  let expectedResult: ITyreProvider | ITyreProvider[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TyreProviderService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      logoContentType: 'image/png',
      logo: 'AAAAAAA',
      letterColor: 'AAAAAAA',
      backgroundColor: 'AAAAAAA',
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

    it('should create a TyreProvider', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TyreProvider()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TyreProvider', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          logo: 'BBBBBB',
          letterColor: 'BBBBBB',
          backgroundColor: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TyreProvider', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          logo: 'BBBBBB',
          backgroundColor: 'BBBBBB',
        },
        new TyreProvider()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TyreProvider', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          logo: 'BBBBBB',
          letterColor: 'BBBBBB',
          backgroundColor: 'BBBBBB',
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

    it('should delete a TyreProvider', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTyreProviderToCollectionIfMissing', () => {
      it('should add a TyreProvider to an empty array', () => {
        const tyreProvider: ITyreProvider = { id: 123 };
        expectedResult = service.addTyreProviderToCollectionIfMissing([], tyreProvider);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tyreProvider);
      });

      it('should not add a TyreProvider to an array that contains it', () => {
        const tyreProvider: ITyreProvider = { id: 123 };
        const tyreProviderCollection: ITyreProvider[] = [
          {
            ...tyreProvider,
          },
          { id: 456 },
        ];
        expectedResult = service.addTyreProviderToCollectionIfMissing(tyreProviderCollection, tyreProvider);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TyreProvider to an array that doesn't contain it", () => {
        const tyreProvider: ITyreProvider = { id: 123 };
        const tyreProviderCollection: ITyreProvider[] = [{ id: 456 }];
        expectedResult = service.addTyreProviderToCollectionIfMissing(tyreProviderCollection, tyreProvider);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tyreProvider);
      });

      it('should add only unique TyreProvider to an array', () => {
        const tyreProviderArray: ITyreProvider[] = [{ id: 123 }, { id: 456 }, { id: 14462 }];
        const tyreProviderCollection: ITyreProvider[] = [{ id: 123 }];
        expectedResult = service.addTyreProviderToCollectionIfMissing(tyreProviderCollection, ...tyreProviderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tyreProvider: ITyreProvider = { id: 123 };
        const tyreProvider2: ITyreProvider = { id: 456 };
        expectedResult = service.addTyreProviderToCollectionIfMissing([], tyreProvider, tyreProvider2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tyreProvider);
        expect(expectedResult).toContain(tyreProvider2);
      });

      it('should accept null and undefined values', () => {
        const tyreProvider: ITyreProvider = { id: 123 };
        expectedResult = service.addTyreProviderToCollectionIfMissing([], null, tyreProvider, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tyreProvider);
      });

      it('should return initial array if no TyreProvider is added', () => {
        const tyreProviderCollection: ITyreProvider[] = [{ id: 123 }];
        expectedResult = service.addTyreProviderToCollectionIfMissing(tyreProviderCollection, undefined, null);
        expect(expectedResult).toEqual(tyreProviderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

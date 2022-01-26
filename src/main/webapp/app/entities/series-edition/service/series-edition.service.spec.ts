import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISeriesEdition, SeriesEdition } from '../series-edition.model';

import { SeriesEditionService } from './series-edition.service';

describe('SeriesEdition Service', () => {
  let service: SeriesEditionService;
  let httpMock: HttpTestingController;
  let elemDefault: ISeriesEdition;
  let expectedResult: ISeriesEdition | ISeriesEdition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SeriesEditionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      period: 'AAAAAAA',
      singleChassis: false,
      singleEngine: false,
      singleTyre: false,
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

    it('should create a SeriesEdition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SeriesEdition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SeriesEdition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          period: 'BBBBBB',
          singleChassis: true,
          singleEngine: true,
          singleTyre: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SeriesEdition', () => {
      const patchObject = Object.assign({}, new SeriesEdition());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SeriesEdition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          period: 'BBBBBB',
          singleChassis: true,
          singleEngine: true,
          singleTyre: true,
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

    it('should delete a SeriesEdition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSeriesEditionToCollectionIfMissing', () => {
      it('should add a SeriesEdition to an empty array', () => {
        const seriesEdition: ISeriesEdition = { id: 123 };
        expectedResult = service.addSeriesEditionToCollectionIfMissing([], seriesEdition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(seriesEdition);
      });

      it('should not add a SeriesEdition to an array that contains it', () => {
        const seriesEdition: ISeriesEdition = { id: 123 };
        const seriesEditionCollection: ISeriesEdition[] = [
          {
            ...seriesEdition,
          },
          { id: 456 },
        ];
        expectedResult = service.addSeriesEditionToCollectionIfMissing(seriesEditionCollection, seriesEdition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SeriesEdition to an array that doesn't contain it", () => {
        const seriesEdition: ISeriesEdition = { id: 123 };
        const seriesEditionCollection: ISeriesEdition[] = [{ id: 456 }];
        expectedResult = service.addSeriesEditionToCollectionIfMissing(seriesEditionCollection, seriesEdition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(seriesEdition);
      });

      it('should add only unique SeriesEdition to an array', () => {
        const seriesEditionArray: ISeriesEdition[] = [{ id: 123 }, { id: 456 }, { id: 43943 }];
        const seriesEditionCollection: ISeriesEdition[] = [{ id: 123 }];
        expectedResult = service.addSeriesEditionToCollectionIfMissing(seriesEditionCollection, ...seriesEditionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const seriesEdition: ISeriesEdition = { id: 123 };
        const seriesEdition2: ISeriesEdition = { id: 456 };
        expectedResult = service.addSeriesEditionToCollectionIfMissing([], seriesEdition, seriesEdition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(seriesEdition);
        expect(expectedResult).toContain(seriesEdition2);
      });

      it('should accept null and undefined values', () => {
        const seriesEdition: ISeriesEdition = { id: 123 };
        expectedResult = service.addSeriesEditionToCollectionIfMissing([], null, seriesEdition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(seriesEdition);
      });

      it('should return initial array if no SeriesEdition is added', () => {
        const seriesEditionCollection: ISeriesEdition[] = [{ id: 123 }];
        expectedResult = service.addSeriesEditionToCollectionIfMissing(seriesEditionCollection, undefined, null);
        expect(expectedResult).toEqual(seriesEditionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

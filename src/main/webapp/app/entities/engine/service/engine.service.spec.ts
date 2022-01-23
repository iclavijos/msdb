import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEngine, Engine } from '../engine.model';

import { EngineService } from './engine.service';

describe('Engine Service', () => {
  let service: EngineService;
  let httpMock: HttpTestingController;
  let elemDefault: IEngine;
  let expectedResult: IEngine | IEngine[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EngineService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      manufacturer: 'AAAAAAA',
      capacity: 0,
      architecture: 'AAAAAAA',
      debutYear: 0,
      petrolEngine: false,
      dieselEngine: false,
      electricEngine: false,
      turbo: false,
      imageContentType: 'image/png',
      image: 'AAAAAAA',
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

    it('should create a Engine', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Engine()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Engine', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          manufacturer: 'BBBBBB',
          capacity: 1,
          architecture: 'BBBBBB',
          debutYear: 1,
          petrolEngine: true,
          dieselEngine: true,
          electricEngine: true,
          turbo: true,
          image: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Engine', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          manufacturer: 'BBBBBB',
          dieselEngine: true,
          turbo: true,
          image: 'BBBBBB',
        },
        new Engine()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Engine', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          manufacturer: 'BBBBBB',
          capacity: 1,
          architecture: 'BBBBBB',
          debutYear: 1,
          petrolEngine: true,
          dieselEngine: true,
          electricEngine: true,
          turbo: true,
          image: 'BBBBBB',
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

    it('should delete a Engine', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEngineToCollectionIfMissing', () => {
      it('should add a Engine to an empty array', () => {
        const engine: IEngine = { id: 123 };
        expectedResult = service.addEngineToCollectionIfMissing([], engine);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(engine);
      });

      it('should not add a Engine to an array that contains it', () => {
        const engine: IEngine = { id: 123 };
        const engineCollection: IEngine[] = [
          {
            ...engine,
          },
          { id: 456 },
        ];
        expectedResult = service.addEngineToCollectionIfMissing(engineCollection, engine);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Engine to an array that doesn't contain it", () => {
        const engine: IEngine = { id: 123 };
        const engineCollection: IEngine[] = [{ id: 456 }];
        expectedResult = service.addEngineToCollectionIfMissing(engineCollection, engine);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(engine);
      });

      it('should add only unique Engine to an array', () => {
        const engineArray: IEngine[] = [{ id: 123 }, { id: 456 }, { id: 39382 }];
        const engineCollection: IEngine[] = [{ id: 123 }];
        expectedResult = service.addEngineToCollectionIfMissing(engineCollection, ...engineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const engine: IEngine = { id: 123 };
        const engine2: IEngine = { id: 456 };
        expectedResult = service.addEngineToCollectionIfMissing([], engine, engine2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(engine);
        expect(expectedResult).toContain(engine2);
      });

      it('should accept null and undefined values', () => {
        const engine: IEngine = { id: 123 };
        expectedResult = service.addEngineToCollectionIfMissing([], null, engine, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(engine);
      });

      it('should return initial array if no Engine is added', () => {
        const engineCollection: IEngine[] = [{ id: 123 }];
        expectedResult = service.addEngineToCollectionIfMissing(engineCollection, undefined, null);
        expect(expectedResult).toEqual(engineCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

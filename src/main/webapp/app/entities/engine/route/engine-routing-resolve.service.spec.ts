jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEngine, Engine } from '../engine.model';
import { EngineService } from '../service/engine.service';

import { EngineRoutingResolveService } from './engine-routing-resolve.service';

describe('Engine routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EngineRoutingResolveService;
  let service: EngineService;
  let resultEngine: IEngine | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(EngineRoutingResolveService);
    service = TestBed.inject(EngineService);
    resultEngine = undefined;
  });

  describe('resolve', () => {
    it('should return IEngine returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEngine = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEngine).toEqual({ id: 123 });
    });

    it('should return new IEngine if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEngine = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEngine).toEqual(new Engine());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Engine })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEngine = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEngine).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

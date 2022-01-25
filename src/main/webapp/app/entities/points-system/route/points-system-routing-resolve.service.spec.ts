jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPointsSystem, PointsSystem } from '../points-system.model';
import { PointsSystemService } from '../service/points-system.service';

import { PointsSystemRoutingResolveService } from './points-system-routing-resolve.service';

describe('PointsSystem routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PointsSystemRoutingResolveService;
  let service: PointsSystemService;
  let resultPointsSystem: IPointsSystem | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(PointsSystemRoutingResolveService);
    service = TestBed.inject(PointsSystemService);
    resultPointsSystem = undefined;
  });

  describe('resolve', () => {
    it('should return IPointsSystem returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPointsSystem = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPointsSystem).toEqual({ id: 123 });
    });

    it('should return new IPointsSystem if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPointsSystem = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPointsSystem).toEqual(new PointsSystem());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PointsSystem })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPointsSystem = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPointsSystem).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

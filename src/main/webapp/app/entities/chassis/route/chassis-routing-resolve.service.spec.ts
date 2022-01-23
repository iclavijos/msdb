jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IChassis, Chassis } from '../chassis.model';
import { ChassisService } from '../service/chassis.service';

import { ChassisRoutingResolveService } from './chassis-routing-resolve.service';

describe('Chassis routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ChassisRoutingResolveService;
  let service: ChassisService;
  let resultChassis: IChassis | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ChassisRoutingResolveService);
    service = TestBed.inject(ChassisService);
    resultChassis = undefined;
  });

  describe('resolve', () => {
    it('should return IChassis returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChassis = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChassis).toEqual({ id: 123 });
    });

    it('should return new IChassis if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChassis = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChassis).toEqual(new Chassis());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Chassis })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChassis = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChassis).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

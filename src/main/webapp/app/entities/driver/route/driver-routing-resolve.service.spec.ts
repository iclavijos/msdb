jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDriver, Driver } from '../driver.model';
import { DriverService } from '../service/driver.service';

import { DriverRoutingResolveService } from './driver-routing-resolve.service';

describe('Driver routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DriverRoutingResolveService;
  let service: DriverService;
  let resultDriver: IDriver | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(DriverRoutingResolveService);
    service = TestBed.inject(DriverService);
    resultDriver = undefined;
  });

  describe('resolve', () => {
    it('should return IDriver returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDriver = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDriver).toEqual({ id: 123 });
    });

    it('should return new IDriver if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDriver = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDriver).toEqual(new Driver());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Driver })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDriver = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDriver).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

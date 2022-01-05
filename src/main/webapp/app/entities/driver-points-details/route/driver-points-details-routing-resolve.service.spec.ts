jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDriverPointsDetails, DriverPointsDetails } from '../driver-points-details.model';
import { DriverPointsDetailsService } from '../service/driver-points-details.service';

import { DriverPointsDetailsRoutingResolveService } from './driver-points-details-routing-resolve.service';

describe('DriverPointsDetails routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DriverPointsDetailsRoutingResolveService;
  let service: DriverPointsDetailsService;
  let resultDriverPointsDetails: IDriverPointsDetails | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(DriverPointsDetailsRoutingResolveService);
    service = TestBed.inject(DriverPointsDetailsService);
    resultDriverPointsDetails = undefined;
  });

  describe('resolve', () => {
    it('should return IDriverPointsDetails returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDriverPointsDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDriverPointsDetails).toEqual({ id: 123 });
    });

    it('should return new IDriverPointsDetails if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDriverPointsDetails = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDriverPointsDetails).toEqual(new DriverPointsDetails());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as DriverPointsDetails })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDriverPointsDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDriverPointsDetails).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

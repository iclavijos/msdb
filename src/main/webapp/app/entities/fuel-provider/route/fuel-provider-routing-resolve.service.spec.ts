jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFuelProvider, FuelProvider } from '../fuel-provider.model';
import { FuelProviderService } from '../service/fuel-provider.service';

import { FuelProviderRoutingResolveService } from './fuel-provider-routing-resolve.service';

describe('FuelProvider routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FuelProviderRoutingResolveService;
  let service: FuelProviderService;
  let resultFuelProvider: IFuelProvider | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(FuelProviderRoutingResolveService);
    service = TestBed.inject(FuelProviderService);
    resultFuelProvider = undefined;
  });

  describe('resolve', () => {
    it('should return IFuelProvider returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFuelProvider = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFuelProvider).toEqual({ id: 123 });
    });

    it('should return new IFuelProvider if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFuelProvider = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFuelProvider).toEqual(new FuelProvider());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FuelProvider })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFuelProvider = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFuelProvider).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

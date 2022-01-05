jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITyreProvider, TyreProvider } from '../tyre-provider.model';
import { TyreProviderService } from '../service/tyre-provider.service';

import { TyreProviderRoutingResolveService } from './tyre-provider-routing-resolve.service';

describe('TyreProvider routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TyreProviderRoutingResolveService;
  let service: TyreProviderService;
  let resultTyreProvider: ITyreProvider | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(TyreProviderRoutingResolveService);
    service = TestBed.inject(TyreProviderService);
    resultTyreProvider = undefined;
  });

  describe('resolve', () => {
    it('should return ITyreProvider returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTyreProvider = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTyreProvider).toEqual({ id: 123 });
    });

    it('should return new ITyreProvider if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTyreProvider = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTyreProvider).toEqual(new TyreProvider());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TyreProvider })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTyreProvider = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTyreProvider).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

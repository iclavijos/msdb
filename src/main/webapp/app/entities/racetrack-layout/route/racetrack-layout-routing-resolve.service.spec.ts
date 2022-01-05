jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRacetrackLayout, RacetrackLayout } from '../racetrack-layout.model';
import { RacetrackLayoutService } from '../service/racetrack-layout.service';

import { RacetrackLayoutRoutingResolveService } from './racetrack-layout-routing-resolve.service';

describe('RacetrackLayout routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: RacetrackLayoutRoutingResolveService;
  let service: RacetrackLayoutService;
  let resultRacetrackLayout: IRacetrackLayout | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(RacetrackLayoutRoutingResolveService);
    service = TestBed.inject(RacetrackLayoutService);
    resultRacetrackLayout = undefined;
  });

  describe('resolve', () => {
    it('should return IRacetrackLayout returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRacetrackLayout = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRacetrackLayout).toEqual({ id: 123 });
    });

    it('should return new IRacetrackLayout if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRacetrackLayout = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultRacetrackLayout).toEqual(new RacetrackLayout());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as RacetrackLayout })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRacetrackLayout = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRacetrackLayout).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

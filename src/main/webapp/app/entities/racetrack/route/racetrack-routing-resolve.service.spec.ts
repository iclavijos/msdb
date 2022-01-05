jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRacetrack, Racetrack } from '../racetrack.model';
import { RacetrackService } from '../service/racetrack.service';

import { RacetrackRoutingResolveService } from './racetrack-routing-resolve.service';

describe('Racetrack routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: RacetrackRoutingResolveService;
  let service: RacetrackService;
  let resultRacetrack: IRacetrack | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(RacetrackRoutingResolveService);
    service = TestBed.inject(RacetrackService);
    resultRacetrack = undefined;
  });

  describe('resolve', () => {
    it('should return IRacetrack returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRacetrack = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRacetrack).toEqual({ id: 123 });
    });

    it('should return new IRacetrack if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRacetrack = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultRacetrack).toEqual(new Racetrack());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Racetrack })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRacetrack = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRacetrack).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

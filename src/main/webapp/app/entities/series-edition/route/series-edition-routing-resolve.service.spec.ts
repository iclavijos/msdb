jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISeriesEdition, SeriesEdition } from '../series-edition.model';
import { SeriesEditionService } from '../service/series-edition.service';

import { SeriesEditionRoutingResolveService } from './series-edition-routing-resolve.service';

describe('SeriesEdition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SeriesEditionRoutingResolveService;
  let service: SeriesEditionService;
  let resultSeriesEdition: ISeriesEdition | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(SeriesEditionRoutingResolveService);
    service = TestBed.inject(SeriesEditionService);
    resultSeriesEdition = undefined;
  });

  describe('resolve', () => {
    it('should return ISeriesEdition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSeriesEdition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSeriesEdition).toEqual({ id: 123 });
    });

    it('should return new ISeriesEdition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSeriesEdition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSeriesEdition).toEqual(new SeriesEdition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SeriesEdition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSeriesEdition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSeriesEdition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

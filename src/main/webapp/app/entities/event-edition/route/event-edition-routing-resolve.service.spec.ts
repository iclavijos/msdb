jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEventEdition, EventEdition } from '../event-edition.model';
import { EventEditionService } from '../service/event-edition.service';

import { EventEditionRoutingResolveService } from './event-edition-routing-resolve.service';

describe('EventEdition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EventEditionRoutingResolveService;
  let service: EventEditionService;
  let resultEventEdition: IEventEdition | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(EventEditionRoutingResolveService);
    service = TestBed.inject(EventEditionService);
    resultEventEdition = undefined;
  });

  describe('resolve', () => {
    it('should return IEventEdition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventEdition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventEdition).toEqual({ id: 123 });
    });

    it('should return new IEventEdition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventEdition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEventEdition).toEqual(new EventEdition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EventEdition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventEdition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventEdition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

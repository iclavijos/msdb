jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEventEntry, EventEntry } from '../event-entry.model';
import { EventEntryService } from '../service/event-entry.service';

import { EventEntryRoutingResolveService } from './event-entry-routing-resolve.service';

describe('EventEntry routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EventEntryRoutingResolveService;
  let service: EventEntryService;
  let resultEventEntry: IEventEntry | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(EventEntryRoutingResolveService);
    service = TestBed.inject(EventEntryService);
    resultEventEntry = undefined;
  });

  describe('resolve', () => {
    it('should return IEventEntry returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventEntry = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventEntry).toEqual({ id: 123 });
    });

    it('should return new IEventEntry if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventEntry = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEventEntry).toEqual(new EventEntry());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EventEntry })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEventEntry = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEventEntry).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

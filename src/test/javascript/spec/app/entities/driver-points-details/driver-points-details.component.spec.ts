import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { DriverPointsDetailsComponent } from 'app/entities/driver-points-details/driver-points-details.component';
import { DriverPointsDetailsService } from 'app/entities/driver-points-details/driver-points-details.service';
import { DriverPointsDetails } from 'app/shared/model/driver-points-details.model';

describe('Component Tests', () => {
  describe('DriverPointsDetails Management Component', () => {
    let comp: DriverPointsDetailsComponent;
    let fixture: ComponentFixture<DriverPointsDetailsComponent>;
    let service: DriverPointsDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [DriverPointsDetailsComponent],
        providers: []
      })
        .overrideTemplate(DriverPointsDetailsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DriverPointsDetailsComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DriverPointsDetailsService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new DriverPointsDetails(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.driverPointsDetails[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

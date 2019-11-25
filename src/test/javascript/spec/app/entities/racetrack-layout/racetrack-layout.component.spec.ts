import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { RacetrackLayoutComponent } from 'app/entities/racetrack-layout/racetrack-layout.component';
import { RacetrackLayoutService } from 'app/entities/racetrack-layout/racetrack-layout.service';
import { RacetrackLayout } from 'app/shared/model/racetrack-layout.model';

describe('Component Tests', () => {
  describe('RacetrackLayout Management Component', () => {
    let comp: RacetrackLayoutComponent;
    let fixture: ComponentFixture<RacetrackLayoutComponent>;
    let service: RacetrackLayoutService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MotorsportsDatabaseTestModule],
        declarations: [RacetrackLayoutComponent],
        providers: []
      })
        .overrideTemplate(RacetrackLayoutComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RacetrackLayoutComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RacetrackLayoutService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new RacetrackLayout(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.racetrackLayouts[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});

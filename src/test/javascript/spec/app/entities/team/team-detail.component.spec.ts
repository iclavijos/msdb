/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MotorsportsDatabaseTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { TeamDetailComponent } from '../../../../../../main/webapp/app/entities/team/team-detail.component';
import { TeamService } from '../../../../../../main/webapp/app/entities/team/team.service';
import { Team } from '../../../../../../main/webapp/app/entities/team/team.model';

describe('Component Tests', () => {

    describe('Team Management Detail Component', () => {
        let comp: TeamDetailComponent;
        let fixture: ComponentFixture<TeamDetailComponent>;
        let service: TeamService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MotorsportsDatabaseTestModule, RouterTestingModule],
                declarations: [TeamDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    TeamService,
                    JhiEventManager
                ]
            }).overrideTemplate(TeamDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TeamDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TeamService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Team(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.team).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});

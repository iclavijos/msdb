import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils } from 'ng-jhipster';
import { EventManager, JhiLanguageService } from 'ng-jhipster';
import { MockLanguageService } from '../../../helpers/mock-language.service';
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
                declarations: [TeamDetailComponent],
                providers: [
                    MockBackend,
                    BaseRequestOptions,
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    {
                        provide: Http,
                        useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    {
                        provide: JhiLanguageService,
                        useClass: MockLanguageService
                    },
                    TeamService,
                    EventManager,
                    {
                        provide: Router,
                        useClass: class { navigate = jasmine.createSpy("navigate"); }
                    }
                ]
            }).overrideComponent(TeamDetailComponent, {
                set: {
                    template: ''
                }
            }).compileComponents();
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
            expect(comp.team).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});

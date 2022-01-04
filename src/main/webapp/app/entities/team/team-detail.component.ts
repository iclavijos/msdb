import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ITeam } from '../../shared/model/team.model';

@Component({
  selector: 'jhi-team-detail',
  templateUrl: './team-detail.component.html'
})
export class TeamDetailComponent implements OnInit {
  team: ITeam;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ team }) => {
      this.team = team;
      this.titleService.setTitle(team.name);
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}

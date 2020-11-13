import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { IEngine } from 'app/shared/model/engine.model';
import { EngineService } from './engine.service';

interface EngineNode {
  expandable: boolean;
  engine: IEngine;
  level: number;
}

@Component({
  selector: 'jhi-engine-detail',
  templateUrl: './engine-detail.component.html'
})
export class EngineDetailComponent implements OnInit {
  treeControl = new FlatTreeControl<EngineNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    (node: IEngine, nodeLevel: number) => {
      return {
        expandable: !!node.evolutions && node.evolutions.length > 0,
        engine: node,
        level: nodeLevel
      };
    },
    node => node.level,
    node => node.expandable,
    node => node.evolutions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  engine: IEngine;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    protected engineService: EngineService,
    private titleService: Title
  ) {}

  hasChild = (_: number, node: EngineNode) => node.expandable;

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ engine }) => {
      this.engine = engine;
      this.titleService.setTitle(engine.manufacturer + ' ' + engine.name);
      this.engineService.getEvolutions(engine.id).subscribe(evolutions => {
        this.engine.evolutions = evolutions.body;
        this.dataSource.data = evolutions.body;
      });
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { IEngine } from '../engine.model';
import { EngineService } from '../service/engine.service';
import { DataUtils } from 'app/core/util/data-util.service';

interface EngineNode {
  expandable: boolean;
  engine: IEngine;
  level: number;
}

@Component({
  selector: 'jhi-engine-detail',
  templateUrl: './engine-detail.component.html',
})
export class EngineDetailComponent implements OnInit {
  treeControl = new FlatTreeControl<EngineNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    (node: IEngine, nodeLevel: number) => ({
        expandable: !!node.evolutions && node.evolutions.length > 0,
        engine: node,
        level: nodeLevel
    }),
    node => node.level,
    node => node.expandable,
    node => node.evolutions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  engine: IEngine | null = null;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected engineService: EngineService
  ) {}

  hasChild = (_: number, node: EngineNode): boolean => node.expandable;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ engine }) => {
      this.engine = engine;
      this.engineService.getEvolutions(engine.id).subscribe(evolutions => {
        this.engine!.evolutions = evolutions.body ?? [];
        this.dataSource.data = evolutions.body ?? [];
      });
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}

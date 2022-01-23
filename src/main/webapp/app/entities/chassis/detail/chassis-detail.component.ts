import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { IChassis } from '../chassis.model';
import { ChassisService } from '../service/chassis.service';
import { DataUtils } from 'app/core/util/data-util.service';

interface ChassisNode {
  expandable: boolean;
  chassis: IChassis;
  level: number;
}

@Component({
  selector: 'jhi-chassis-detail',
  templateUrl: './chassis-detail.component.html',
})
export class ChassisDetailComponent implements OnInit {
  treeControl = new FlatTreeControl<ChassisNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    (node: IChassis, nodeLevel: number) => ({
        expandable: !!node.evolutions && node.evolutions.length > 0,
        chassis: node,
        level: nodeLevel
    }),
    node => node.level,
    node => node.expandable,
    node => node.evolutions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  chassis: IChassis | null = null;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected chassisService: ChassisService
  ) {}

  hasChild = (_: number, node: ChassisNode): boolean => node.expandable;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chassis }) => {
      this.chassis = chassis;
      this.chassisService.getEvolutions(chassis.id).subscribe(evolutions => {
        this.chassis!.evolutions = evolutions.body ?? [];
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

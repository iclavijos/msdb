import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { IChassis } from '../../shared/model/chassis.model';
import { ChassisService } from './chassis.service';

interface ChassisNode {
  expandable: boolean;
  chassis: IChassis;
  level: number;
}

@Component({
  selector: 'jhi-chassis-detail',
  templateUrl: './chassis-detail.component.html'
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

  chassis: IChassis;

  constructor(
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    protected chassisService: ChassisService,
    private titleService: Title
  ) {}

  hasChild = (_: number, node: ChassisNode) => node.expandable;

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ chassis }) => {
      this.chassis = chassis;
      this.titleService.setTitle(`${chassis.manufacturer as string} ${chassis.name as string}`);
      this.chassisService.getEvolutions(chassis.id).subscribe(evolutions => {
        this.chassis.evolutions = evolutions.body;
        this.dataSource.data = this.chassis.evolutions;
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

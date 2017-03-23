import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { DataUtils, JhiLanguageService, AlertService } from 'ng-jhipster';
import { Router, ActivatedRoute } from '@angular/router';

import { Imports } from './';
import { ImportsService } from './imports.service';

@Component({
    selector: 'jhi-imports',
    templateUrl: './imports.component.html'
})

export class ImportsComponent implements OnInit {
    imports: Imports;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private route: ActivatedRoute,
        private router: Router,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private importsService: ImportsService
    ) {
        this.jhiLanguageService.setLocations(['imports']);
        this.imports = new Imports();
    }

    ngOnInit() {
        this.imports.importType = this.route.snapshot.data['importType'];
    }

    setFileData($event) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
//            if (!/^excel\//.test($file.type)) {
//                return;
//            }
            this.dataUtils.toBase64($file, (base64Data) => {
                this.imports.csvContents = base64Data;
            });
        }
    }

    uploadFile() {
        this.importsService.importCSV(this.imports)
            .map((res: Response) => res)
            .subscribe(
                (res: Response) => this.success(),
                (res: Response) => this.fail());
    }

    success() {
        this.alertService.success('global.messages.info.imports.success', null);
    }

    fail() {
        this.alertService.success('global.messages.info.imports.fail', null);
    }

    cancel() {
        this.router.navigate(['/']);
    }
}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MotorsportsDatabaseCategoryModule } from './category/category.module';
import { MotorsportsDatabaseChassisModule } from './chassis/chassis.module';
import { MotorsportsDatabaseDriverModule } from './driver/driver.module';
import { MotorsportsDatabaseEngineModule } from './engine/engine.module';
import { MotorsportsDatabaseEventModule } from './event/event.module';
import { MotorsportsDatabaseEventEditionModule } from './event-edition/event-edition.module';
import { MotorsportsDatabaseEventEntryModule } from './event-entry/event-entry.module';
import { MotorsportsDatabaseEventEntryResultModule } from './event-entry-result/event-entry-result.module';
import { MotorsportsDatabaseEventSessionModule } from './event-session/event-session.module';
import { MotorsportsDatabaseFuelProviderModule } from './fuel-provider/fuel-provider.module';
import { MotorsportsDatabasePointsSystemModule } from './points-system/points-system.module';
import { MotorsportsDatabaseRacetrackModule } from './racetrack/racetrack.module';
import { MotorsportsDatabaseRacetrackLayoutModule } from './racetrack-layout/racetrack-layout.module';
import { MotorsportsDatabaseSeriesModule } from './series/series.module';
import { MotorsportsDatabaseSeriesEditionModule } from './series-edition/series-edition.module';
import { MotorsportsDatabaseTeamModule } from './team/team.module';
import { MotorsportsDatabaseDriverPointsDetailsModule } from './driver-points-details/driver-points-details.module';
import { MotorsportsDatabaseTyreProviderModule } from './tyre-provider/tyre-provider.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        MotorsportsDatabaseCategoryModule,
        MotorsportsDatabaseChassisModule,
        MotorsportsDatabaseDriverModule,
        MotorsportsDatabaseEngineModule,
        MotorsportsDatabaseEventModule,
        MotorsportsDatabaseEventEditionModule,
        MotorsportsDatabaseEventEntryModule,
        MotorsportsDatabaseEventEntryResultModule,
        MotorsportsDatabaseEventSessionModule,
        MotorsportsDatabaseFuelProviderModule,
        MotorsportsDatabasePointsSystemModule,
        MotorsportsDatabaseRacetrackModule,
        MotorsportsDatabaseRacetrackLayoutModule,
        MotorsportsDatabaseSeriesModule,
        MotorsportsDatabaseSeriesEditionModule,
        MotorsportsDatabaseTeamModule,
        MotorsportsDatabaseDriverPointsDetailsModule,
        MotorsportsDatabaseTyreProviderModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEntityModule {}

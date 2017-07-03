import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MotorsportsDatabaseRacetrackModule } from './racetrack/racetrack.module';
import { MotorsportsDatabaseRacetrackLayoutModule } from './racetrack-layout/racetrack-layout.module';
import { MotorsportsDatabaseDriverModule } from './driver/driver.module';
import { MotorsportsDatabaseTyreProviderModule } from './tyre-provider/tyre-provider.module';
import { MotorsportsDatabaseFuelProviderModule } from './fuel-provider/fuel-provider.module';
import { MotorsportsDatabaseCategoryModule } from './category/category.module';
import { MotorsportsDatabaseChassisModule } from './chassis/chassis.module';
import { MotorsportsDatabaseEngineModule } from './engine/engine.module';
import { MotorsportsDatabaseTeamModule } from './team/team.module';
import { MotorsportsDatabaseSeriesModule } from './series/series.module';
import { MotorsportsDatabaseSeriesEditionModule } from './series-edition/series-edition.module';
import { MotorsportsDatabaseEventModule } from './event/event.module';
import { MotorsportsDatabaseEventSessionModule } from './event-session/event-session.module';
import { MotorsportsDatabaseEventEditionModule } from './event-edition/event-edition.module';
import { MotorsportsDatabaseEventEntryModule } from './event-entry/event-entry.module';
import { MotorsportsDatabaseEventEntryResultModule } from './event-entry-result/event-entry-result.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        MotorsportsDatabaseRacetrackModule,
        MotorsportsDatabaseRacetrackLayoutModule,
        MotorsportsDatabaseDriverModule,
        MotorsportsDatabaseTyreProviderModule,
        MotorsportsDatabaseFuelProviderModule,
        MotorsportsDatabaseCategoryModule,
        MotorsportsDatabaseChassisModule,
        MotorsportsDatabaseEngineModule,
        MotorsportsDatabaseTeamModule,
        MotorsportsDatabaseSeriesModule,
        MotorsportsDatabaseSeriesEditionModule,
        MotorsportsDatabaseEventModule,
        MotorsportsDatabaseEventSessionModule,
        MotorsportsDatabaseEventEditionModule,
        MotorsportsDatabaseEventEntryModule,
        MotorsportsDatabaseEventEntryResultModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEntityModule {}

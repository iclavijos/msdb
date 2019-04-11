import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'event-session',
                loadChildren: './event-session/event-session.module#MotorsportsDatabaseEventSessionModule'
            },
            {
                path: 'category',
                loadChildren: './category/category.module#MotorsportsDatabaseCategoryModule'
            },
            {
                path: 'driver',
                loadChildren: './driver/driver.module#MotorsportsDatabaseDriverModule'
            },
            {
                path: 'team',
                loadChildren: './team/team.module#MotorsportsDatabaseTeamModule'
            },
            {
                path: 'engine',
                loadChildren: './engine/engine.module#MotorsportsDatabaseEngineModule'
            },
            {
                path: 'event',
                loadChildren: './event/event.module#MotorsportsDatabaseEventModule'
            },
            {
                path: 'event-edition',
                loadChildren: './event-edition/event-edition.module#MotorsportsDatabaseEventEditionModule'
            },
            {
                path: 'event-entry',
                loadChildren: './event-entry/event-entry.module#MotorsportsDatabaseEventEntryModule'
            },
            {
                path: 'event-entry-result',
                loadChildren: './event-entry-result/event-entry-result.module#MotorsportsDatabaseEventEntryResultModule'
            },
            {
                path: 'chassis',
                loadChildren: './chassis/chassis.module#MotorsportsDatabaseChassisModule'
            },
            {
                path: 'fuel-provider',
                loadChildren: './fuel-provider/fuel-provider.module#MotorsportsDatabaseFuelProviderModule'
            },
            {
                path: 'points-system',
                loadChildren: './points-system/points-system.module#MotorsportsDatabasePointsSystemModule'
            },
            {
                path: 'racetrack',
                loadChildren: './racetrack/racetrack.module#MotorsportsDatabaseRacetrackModule'
            },
            {
                path: 'racetrack-layout',
                loadChildren: './racetrack-layout/racetrack-layout.module#MotorsportsDatabaseRacetrackLayoutModule'
            },
            {
                path: 'series',
                loadChildren: './series/series.module#MotorsportsDatabaseSeriesModule'
            },
            {
                path: 'series-edition',
                loadChildren: './series-edition/series-edition.module#MotorsportsDatabaseSeriesEditionModule'
            },
            {
                path: 'tyre-provider',
                loadChildren: './tyre-provider/tyre-provider.module#MotorsportsDatabaseTyreProviderModule'
            },
            {
                path: 'driver-points-details',
                loadChildren: './driver-points-details/driver-points-details.module#MotorsportsDatabaseDriverPointsDetailsModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEntityModule {}

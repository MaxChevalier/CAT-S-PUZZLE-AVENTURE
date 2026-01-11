import { LevelComponent } from './widgets/game/level/level.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', component: LevelComponent},
    { path: '**', redirectTo: '' }
];

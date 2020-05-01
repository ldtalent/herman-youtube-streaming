import { Routes, RouterModule } from '@angular/router';
import { LiveStreamComponent } from './LiveStream.component';

const routes: Routes = [
  {path: '', component: LiveStreamComponent},
];

export const LiveStreamRoutingRoutes = RouterModule.forChild(routes);

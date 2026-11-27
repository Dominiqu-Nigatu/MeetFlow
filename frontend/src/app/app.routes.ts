import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { MeetingList } from './features/meetings/meeting-list/meeting-list';
import { MeetingDetail } from './features/meetings/meeting-detail/meeting-detail';
import { TranscriptUpload } from './features/meetings/transcript-upload/transcript-upload';
import { ActionItems } from './features/action-items/action-items/action-items';
import { Settings } from './features/settings/settings/settings';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'meetings',
        component: MeetingList,
      },
      {
        path: 'meetings/upload',
        component: TranscriptUpload,
      },
      {
        path: 'meetings/:id',
        component: MeetingDetail,
      },
      {
        path: 'action-items',
        component: ActionItems,
      },
      {
        path: 'settings',
        component: Settings,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
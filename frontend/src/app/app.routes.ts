import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { MeetingList } from './features/meetings/meeting-list/meeting-list';
import { MeetingDetail } from './features/meetings/meeting-detail/meeting-detail';
import { TranscriptUpload } from './features/meetings/transcript-upload/transcript-upload';
import { ActionItems } from './features/action-items/action-items/action-items';

import { Account } from './features/account/account/account';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'account', component: Account },
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
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

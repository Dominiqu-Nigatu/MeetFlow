import { Component, computed, inject, signal } from '@angular/core';
import { WorkspaceStore } from '../../../core/services/workspace-store';
import { RouterLink } from '@angular/router';
import {
  DashboardStats,
  DashboardStat,
} from '../../../shared/components/organisms/dashboard-stats/dashboard-stats';
import {
  MeetingUploadPanel,
  MeetingUploadData,
} from '../../../shared/components/organisms/meeting-upload-panel/meeting-upload-panel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardStats, RouterLink, MeetingUploadPanel],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  userName = signal('John');
  activeTab = signal<'meetings' | 'actions'>('meetings');

  onTabKeydown(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tab =
      event.key === 'Home'
        ? 'meetings'
        : event.key === 'End'
          ? 'actions'
          : this.activeTab() === 'meetings'
            ? 'actions'
            : 'meetings';
    this.activeTab.set(tab);
    const button = event.currentTarget as HTMLButtonElement;
    button.parentElement
      ?.querySelector<HTMLButtonElement>(
        tab === 'meetings' ? '#recent-meetings-tab' : '#action-items-tab',
      )
      ?.focus();
  }

  readonly store = inject(WorkspaceStore);
  readonly stats = computed<DashboardStat[]>(() => [
    { label: 'Total Meetings', value: this.store.meetings().length, description: '', icon: '' },
    { label: 'Action Items', value: this.store.actions().length, description: '', icon: '' },
    {
      label: 'Completed Tasks',
      value: this.store.actions().filter((a) => a.completed).length,
      description: '',
      icon: '',
    },
    {
      label: 'Overdue Tasks',
      value: this.store.actions().filter((a) => this.store.isOverdue(a)).length,
      description: '',
      icon: '',
    },
  ]);
  readonly meetings = computed(() => this.store.meetings().slice(0, 4));
  readonly actionItems = computed(() => this.store.actions().slice(0, 4));
  onActionItemCompleted(event: { id: string; completed: boolean }): void {
    const action = this.store.actions().find((a) => a.id === event.id);
    if (action) this.store.completeAction(action.meetingId, action.id, event.completed);
  }
  onUploadMeeting(_data: MeetingUploadData): void {
    /* Upload panel owns saving. Signals update automatically. */
  }
}

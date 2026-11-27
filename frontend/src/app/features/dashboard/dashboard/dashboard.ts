import { Component, computed, inject, signal } from '@angular/core';
import { LocalMeetings } from '../../../core/services/local-meetings';
import { RouterLink } from '@angular/router';
import {
  DashboardStats,
  DashboardStat,
} from '../../../shared/components/organisms/dashboard-stats/dashboard-stats';
import { RecentMeeting } from '../../../shared/components/organisms/recent-meetings/recent-meetings';
import { PanelActionItem } from '../../../shared/components/organisms/action-items-panel/action-items-panel';
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

  stats = signal<DashboardStat[]>([
    {
      label: 'Total Meetings',
      value: '24',
      description: 'Meetings recorded · +4 this week',
      icon: '▤',
      trend: 'up',
    },
    {
      label: 'Action Items',
      value: '38',
      description: 'Tasks identified · 8 pending',
      icon: '☑',
      trend: 'neutral',
    },
    {
      label: 'Completed Tasks',
      value: '29',
      description: 'Tasks completed · 76% completion',
      icon: '✓',
      trend: 'up',
    },
    {
      label: 'Meeting Hours',
      value: '12.5',
      description: 'Time spent in meetings · This month',
      icon: '◷',
      trend: 'neutral',
    },
  ]);

  private readonly localMeetings = inject(LocalMeetings);
  readonly meetings = computed(() =>
    [...this.localMeetings.cards(), ...this.sampleMeetings()].slice(0, 4),
  );
  sampleMeetings = signal<RecentMeeting[]>([
    {
      id: '1',
      title: 'Product Strategy Meeting',
      date: '25 Nov 2026',
      duration: '45 min',
      summaryStatus: 'completed',
      actionItemCount: 4,
    },
    {
      id: '2',
      title: 'Frontend Sprint Planning',
      date: '24 Nov 2026',
      duration: '60 min',
      summaryStatus: 'completed',
      actionItemCount: 6,
    },
    {
      id: '3',
      title: 'Marketing Weekly Sync',
      date: '23 Nov 2026',
      duration: '30 min',
      summaryStatus: 'processing',
      actionItemCount: 3,
    },
    {
      id: '4',
      title: 'Client Feedback Review',
      date: '22 Nov 2026',
      duration: '50 min',
      summaryStatus: 'pending',
      actionItemCount: 5,
    },
  ]);

  actionItems = signal<PanelActionItem[]>([
    {
      id: '1',
      description: 'Prepare the product roadmap presentation',
      owner: 'John Doe',
      dueDate: '28 Nov 2026',
      completed: false,
    },
    {
      id: '2',
      description: 'Review the frontend design system',
      owner: 'Sarah',
      dueDate: '27 Nov 2026',
      completed: false,
    },
    {
      id: '3',
      description: 'Send meeting notes to the team',
      owner: 'John Doe',
      dueDate: '26 Nov 2026',
      completed: true,
    },
    {
      id: '4',
      description: 'Finalise API documentation',
      owner: 'Michael',
      dueDate: '30 Nov 2026',
      completed: false,
    },
  ]);

  onActionItemCompleted(event: { id: string; completed: boolean }): void {
    this.actionItems.update((items) =>
      items.map((item) => (item.id === event.id ? { ...item, completed: event.completed } : item)),
    );
  }

  onMeetingSelected(meetingId: string): void {
    console.log('Meeting selected:', meetingId);
    // Meeting details navigation will be connected through routing.
  }

  onViewAllMeetings(): void {
    console.log('View all meetings clicked');
    // Navigation will be connected through routing.
  }

  onViewAllActionItems(): void {
    console.log('View all action items clicked');
    // Navigation will be connected through routing.
  }

  onUploadMeeting(data: MeetingUploadData): void {
    console.log('Meeting upload submitted:', {
      title: data.title,
      fileName: data.file.name,
    });
  }
}

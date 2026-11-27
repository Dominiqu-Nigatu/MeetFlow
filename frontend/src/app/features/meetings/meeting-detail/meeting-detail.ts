import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { LocalMeetings } from '../../../core/services/local-meetings';
import { Badge } from '../../../shared/components/atoms/badge/badge';
import { ActionItemRow } from '../../../shared/components/molecules/action-item-row/action-item-row';

export interface MeetingDetailActionItem {
  id: string;
  description: string;
  owner: string | null;
  dueDate: string | null;
  completed: boolean;
}

@Component({
  selector: 'app-meeting-detail',
  standalone: true,
  imports: [Badge, ActionItemRow],
  templateUrl: './meeting-detail.html',
  styleUrl: './meeting-detail.scss',
})
export class MeetingDetail {
  readonly localMeetings = inject(LocalMeetings);
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly router = inject(Router, { optional: true });
  private readonly params = toSignal(this.route?.paramMap ?? of(null));
  readonly isLocal = computed(() => this.params()?.get('id')?.startsWith('local-') ?? false);
  readonly localMeeting = computed(() =>
    this.localMeetings.uploads().find((meeting) => meeting.id === this.params()?.get('id')),
  );

  meetingTitle = signal('Product Strategy Meeting');
  meetingDate = signal('25 November 2026');
  meetingDuration = signal('45 minutes');
  meetingStatus = signal<'completed' | 'processing' | 'pending'>('completed');

  activeTab = signal<'summary' | 'transcript'>('summary');

  summary = signal(
    'The team discussed the upcoming product roadmap, reviewed current development progress and aligned on priorities for the next sprint. The discussion focused on improving the user experience, refining the meeting workflow and identifying areas that require further investigation.',
  );

  keyPoints = signal<string[]>([
    'The next sprint will focus on improving the meeting experience.',
    'The dashboard design will be prioritised before additional features.',
    'The team agreed to review the current development timeline.',
    'Feedback from the previous product review will be incorporated.',
  ]);

  decisions = signal<string[]>([
    'Prioritise the dashboard improvements for the next sprint.',
    'Use a consistent design system across the application.',
    'Review feature progress during the next weekly sync.',
  ]);

  actionItems = signal<MeetingDetailActionItem[]>([
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

  transcript = signal<string[]>([
    'John: Welcome everyone. Today we are reviewing our product strategy and the priorities for the next sprint.',
    'Sarah: I think the dashboard improvements should be our first priority. The current layout needs a clearer overview of meetings and tasks.',
    'Michael: Agreed. We should also make sure that the design system is consistent across all the pages.',
    'John: Great. Let us prioritise the dashboard, then review the meeting workflow and API documentation.',
    'Sarah: I will review the frontend design system before our next meeting.',
    'Michael: I will finalise the API documentation by the end of the month.',
    'John: Perfect. I will prepare the roadmap presentation and send the notes to everyone.',
  ]);

  completedActionCount = computed(() => this.actionItems().filter((item) => item.completed).length);

  remainingActionCount = computed(
    () => this.actionItems().filter((item) => !item.completed).length,
  );

  progressPercentage = computed(() => {
    const total = this.actionItems().length;
    if (total === 0) return 0;

    return Math.round((this.completedActionCount() / total) * 100);
  });

  onTabChange(tab: 'summary' | 'transcript'): void {
    this.activeTab.set(tab);
  }

  onActionItemCompleted(event: { id: string; completed: boolean }): void {
    this.actionItems.update((items) =>
      items.map((item) => (item.id === event.id ? { ...item, completed: event.completed } : item)),
    );
  }

  onBack(): void {
    void this.router?.navigate(['/meetings']);
  }

  onDownload(): void {
    console.log('Download meeting summary');
  }
}

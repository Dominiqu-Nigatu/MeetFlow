import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalMeetings } from '../../../core/services/local-meetings';
import { MeetingSearch } from '../../../core/services/meeting-search';
import { MeetingCard } from '../../../shared/components/molecules/meeting-card/meeting-card';

import {
  MeetingUploadPanel,
  MeetingUploadData,
} from '../../../shared/components/organisms/meeting-upload-panel/meeting-upload-panel';

export interface MeetingListItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  summaryStatus: 'completed' | 'processing' | 'pending';
  actionItemCount: number;
}

@Component({
  selector: 'app-meeting-list',
  standalone: true,
  imports: [MeetingCard, MeetingUploadPanel],
  templateUrl: './meeting-list.html',
  styleUrl: './meeting-list.scss',
})
export class MeetingList {
  readonly localMeetings = inject(LocalMeetings);
  private readonly router = inject(Router);
  searchQuery = inject(MeetingSearch).query;
  readonly uploadDialog = viewChild.required<ElementRef<HTMLDialogElement>>('uploadDialog');
  readonly uploadOpen = signal(false);
  readonly uploadNotice = signal('');

  meetings = signal<MeetingListItem[]>([
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
    {
      id: '5',
      title: 'Design Review',
      date: '21 Nov 2026',
      duration: '40 min',
      summaryStatus: 'completed',
      actionItemCount: 2,
    },
    {
      id: '6',
      title: 'Engineering Stand-up',
      date: '20 Nov 2026',
      duration: '20 min',
      summaryStatus: 'completed',
      actionItemCount: 3,
    },
    {
      id: '7',
      title: 'Client Onboarding',
      date: '19 Nov 2026',
      duration: '55 min',
      summaryStatus: 'processing',
      actionItemCount: 7,
    },
    {
      id: '8',
      title: 'Monthly Retrospective',
      date: '18 Nov 2026',
      duration: '60 min',
      summaryStatus: 'pending',
      actionItemCount: 4,
    },
  ]);

  filteredMeetings = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    return [...this.localMeetings.cards(), ...this.meetings()].filter((meeting) =>
      meeting.title.toLowerCase().includes(query),
    );
  });

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onMeetingSelected(meetingId: string): void {
    void this.router.navigate(['/meetings', meetingId]);
  }

  onUploadMeeting(): void {
    this.uploadOpen.set(true);
    this.uploadDialog().nativeElement.showModal();
  }
  closeUpload(): void {
    this.uploadDialog().nativeElement.close();
    this.uploadOpen.set(false);
  }

  onUploadBackdropClick(event: MouseEvent): void {
    const dialog = this.uploadDialog().nativeElement;
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      this.closeUpload();
    }
  }

  onTranscriptSubmitted(_data: MeetingUploadData): void {
    this.searchQuery.set('');
    this.uploadNotice.set('Transcript saved in this browser. Select your meeting to read it.');
    this.closeUpload();
  }
}

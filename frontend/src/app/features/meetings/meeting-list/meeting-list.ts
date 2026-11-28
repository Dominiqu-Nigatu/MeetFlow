import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalMeetings } from '../../../core/services/local-meetings';
import { WorkspaceStore } from '../../../core/services/workspace-store';
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

  readonly workspace = inject(WorkspaceStore);
  readonly meetings = computed(() =>
    this.workspace.meetings().map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      date: new Date(meeting.meetingDate + 'T12:00:00').toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      duration: 'Not recorded',
      sample: meeting.sample,
      summaryStatus: (this.workspace.analysis()[meeting.id]?.status === 'loading'
        ? 'processing'
        : this.workspace.notes(meeting.id).summary
          ? 'completed'
          : 'pending') as 'processing' | 'completed' | 'pending',
      actionItemCount: this.workspace.notes(meeting.id).actions.length,
    })),
  );
  readonly filteredMeetings = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    return this.meetings().filter((meeting) => meeting.title.toLowerCase().includes(query));
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

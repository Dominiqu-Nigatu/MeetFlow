import { Component, computed, inject, signal } from '@angular/core';
import { MeetingSearch } from '../../../core/services/meeting-search';
import { SearchBar } from '../../../shared/components/molecules/search-bar/search-bar';
import { MeetingCard } from '../../../shared/components/molecules/meeting-card/meeting-card';

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
  imports: [SearchBar, MeetingCard],
  templateUrl: './meeting-list.html',
  styleUrl: './meeting-list.scss',
})
export class MeetingList {
  searchQuery = inject(MeetingSearch).query;
  activeFilter = signal<'all' | 'completed' | 'processing' | 'pending'>('all');

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
    const filter = this.activeFilter();

    return this.meetings().filter((meeting) => {
      const matchesSearch = meeting.title.toLowerCase().includes(query);
      const matchesFilter = filter === 'all' || meeting.summaryStatus === filter;

      return matchesSearch && matchesFilter;
    });
  });

  completedCount = computed(
    () => this.meetings().filter((meeting) => meeting.summaryStatus === 'completed').length,
  );

  processingCount = computed(
    () => this.meetings().filter((meeting) => meeting.summaryStatus === 'processing').length,
  );

  pendingCount = computed(
    () => this.meetings().filter((meeting) => meeting.summaryStatus === 'pending').length,
  );

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onFilterChange(filter: 'all' | 'completed' | 'processing' | 'pending'): void {
    this.activeFilter.set(filter);
  }

  onMeetingSelected(meetingId: string): void {
    console.log('Selected meeting:', meetingId);
  }

  onUploadMeeting(): void {
    console.log('Upload meeting clicked');
  }
}

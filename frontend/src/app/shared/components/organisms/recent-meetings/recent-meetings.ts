import { Component, input, output } from '@angular/core';
import { MeetingCard } from '../../molecules/meeting-card/meeting-card';

export interface RecentMeeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  summaryStatus: 'completed' | 'processing' | 'pending';
  actionItemCount: number;
}

@Component({
  selector: 'app-recent-meetings',
  standalone: true,
  imports: [MeetingCard],
  templateUrl: './recent-meetings.html',
  styleUrl: './recent-meetings.scss',
})
export class RecentMeetings {
  meetings = input<RecentMeeting[]>([]);

  meetingSelected = output<string>();
  viewAllClicked = output<void>();

  onMeetingSelected(id: string): void {
    this.meetingSelected.emit(id);
  }

  onViewAll(): void {
    this.viewAllClicked.emit();
  }
}
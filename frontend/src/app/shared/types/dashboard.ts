export interface RecentMeeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  summaryStatus: 'completed' | 'processing' | 'pending';
  actionItemCount: number;
}

export interface PanelActionItem {
  id: string;
  description: string;
  owner: string | null;
  dueDate: string | null;
  completed: boolean;
}

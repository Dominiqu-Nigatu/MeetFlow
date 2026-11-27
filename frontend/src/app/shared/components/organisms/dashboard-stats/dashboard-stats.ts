import { Component, input } from '@angular/core';

export interface DashboardStat {
  label: string;
  value: string | number;
  description: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.scss',
})
export class DashboardStats {
  stats = input<DashboardStat[]>([
    {
      label: 'Total Meetings',
      value: 24,
      description: 'Meetings recorded',
      icon: '▤',
      trend: 'up',
    },
    {
      label: 'Action Items',
      value: 38,
      description: 'Tasks identified',
      icon: '☑',
      trend: 'neutral',
    },
    {
      label: 'Completed Tasks',
      value: 29,
      description: 'Tasks completed',
      icon: '✓',
      trend: 'up',
    },
    {
      label: 'Hours Saved',
      value: '12.5',
      description: 'Time saved with AI',
      icon: '◷',
      trend: 'up',
    },
  ]);
}

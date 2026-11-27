import { Component, input, output } from '@angular/core';
import { Badge } from '../../atoms/badge/badge';

@Component({
  selector: 'app-meeting-card',
  standalone: true,
  imports: [Badge],
  templateUrl: './meeting-card.html',
  styleUrl: './meeting-card.scss',
})
export class MeetingCard {
  title = input.required<string>();
  date = input.required<string>();
  duration = input.required<string>();
  summaryStatus = input<'completed' | 'processing' | 'pending'>('pending');
  actionItemCount = input(0);

  selected = output<void>();

  onSelect(): void {
    this.selected.emit();
  }
}

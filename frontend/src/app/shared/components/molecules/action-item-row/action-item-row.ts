import { Component, input, output } from '@angular/core';
import { Checkbox } from '../../atoms/checkbox/checkbox';
import { Badge } from '../../atoms/badge/badge';

@Component({
  selector: 'app-action-item-row',
  standalone: true,
  imports: [Checkbox, Badge],
  templateUrl: './action-item-row.html',
  styleUrl: './action-item-row.scss',
})
export class ActionItemRow {
  id = input.required<string>();
  description = input.required<string>();
  owner = input<string | null>(null);
  dueDate = input<string | null>(null);
  completed = input(false);

  completedChange = output<boolean>();

  onCompletedChange(value: boolean): void {
    this.completedChange.emit(value);
  }
}
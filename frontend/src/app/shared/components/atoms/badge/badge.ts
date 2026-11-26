
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  label = input.required<string>();

  variant = input<
    'success' | 'warning' | 'danger' | 'info' | 'neutral'
  >('neutral');

  size = input<'sm' | 'md' | 'lg'>('md');

  pill = input(false);
}

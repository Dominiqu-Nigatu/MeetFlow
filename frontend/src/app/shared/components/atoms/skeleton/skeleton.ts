
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
})
export class Skeleton {
  variant = input<'text' | 'circular' | 'rectangular'>('text');
  width = input<string | null>(null);
  height = input<string | null>(null);
  animated = input(true);
}

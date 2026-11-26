
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {
  size = input<'sm' | 'md' | 'lg'>('md');
  message = input<string | null>(null);
}

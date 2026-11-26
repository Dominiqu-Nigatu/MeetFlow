
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  templateUrl: './toggle.html',
  styleUrl: './toggle.scss',
})
export class Toggle {
  id = input.required<string>();
  label = input('');
  description = input<string | null>(null);
  checked = input(false);
  disabled = input(false);

  checkedChange = output<boolean>();

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checkedChange.emit(target.checked);
  }
}

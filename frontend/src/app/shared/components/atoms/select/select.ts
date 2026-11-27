import { Component, input, output } from '@angular/core';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  id = input.required<string>();
  label = input('');
  placeholder = input('Select an option');
  options = input<SelectOption[]>([]);
  value = input('');
  disabled = input(false);
  required = input(false);
  hint = input<string | null>(null);
  error = input<string | null>(null);

  valueChange = output<string>();

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.valueChange.emit(target.value);
  }
}

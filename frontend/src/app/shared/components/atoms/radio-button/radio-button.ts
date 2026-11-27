import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  standalone: true,
  templateUrl: './radio-button.html',
  styleUrl: './radio-button.scss',
})
export class RadioButton {
  id = input.required<string>();
  name = input.required<string>();
  value = input.required<string>();
  label = input('');
  description = input<string | null>(null);
  checked = input(false);
  disabled = input(false);
  required = input(false);

  valueChange = output<string>();

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}

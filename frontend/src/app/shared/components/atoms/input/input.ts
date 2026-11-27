import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {
  id = input.required<string>();
  label = input<string>('');
  type = input<'text' | 'email' | 'password' | 'search' | 'number' | 'date'>('text');

  placeholder = input('');
  value = input('');
  disabled = input(false);
  required = input(false);
  hint = input<string | null>(null);
  error = input<string | null>(null);

  valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}

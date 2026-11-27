
import { Component, input, output } from '@angular/core';
import { Input } from '../../atoms/input/input';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [Input],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {
  id = input.required<string>();
  label = input('');
  type = input<
    'text' | 'email' | 'password' | 'search' | 'number' | 'date'
  >('text');
  placeholder = input('');
  value = input('');
  hint = input<string | null>(null);
  error = input<string | null>(null);
  required = input(false);
  disabled = input(false);

  valueChange = output<string>();

  onValueChange(value: string): void {
    this.valueChange.emit(value);
  }
}

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-textarea',
  standalone: true,
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
})
export class Textarea {
  id = input.required<string>();
  label = input('');
  placeholder = input('');
  value = input('');
  rows = input(4);
  disabled = input(false);
  required = input(false);
  maxLength = input<number | null>(null);
  minLength = input<number | null>(null);
  hint = input<string | null>(null);
  error = input<string | null>(null);
  autoResize = input(false);

  valueChange = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;

    this.valueChange.emit(target.value);

    if (this.autoResize()) {
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    }
  }
}

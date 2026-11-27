import { Component, input, output, linkedSignal } from '@angular/core';
import { Input } from '../../atoms/input/input';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [Input],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  placeholder = input('Search...');
  initialValue = input('');
  disabled = input(false);
  showLabel = input(true);

  search = output<string>();

  query = linkedSignal(() => this.initialValue());

  onValueChange(value: string): void {
    if (this.disabled()) return;

    this.query.set(value);
    this.search.emit(value.trim());
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.disabled()) return;

    this.search.emit(this.query().trim());
  }
}

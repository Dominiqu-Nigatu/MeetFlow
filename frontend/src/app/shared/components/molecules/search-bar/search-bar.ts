
import { Component, input, output, signal } from '@angular/core';
import { Input } from '../../atoms/input/input';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [Input, Button],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  placeholder = input('Search...');
  initialValue = input('');
  disabled = input(false);
  showLabel = input(true);

  search = output<string>();

  query = signal('');

  onValueChange(value: string): void {
    this.query.set(value);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    const searchValue = this.query().trim() || this.initialValue().trim();

    if (searchValue) {
      this.search.emit(searchValue);
    }
  }
}

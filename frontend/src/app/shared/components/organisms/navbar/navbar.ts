import { Component, input, output } from '@angular/core';
import { Avatar } from '../../atoms/avatar/avatar';
import { SearchBar } from '../../molecules/search-bar/search-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [Avatar, SearchBar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  pageTitle = input('Dashboard');
  userName = input('John Doe');
  userRole = input('Member');
  avatarSrc = input<string | null>(null);
  showSearch = input(true);
  searchQuery = input('');
  searchPlaceholder = input('Search meetings...');

  menuClicked = output<void>();
  profileClicked = output<void>();
  searchSubmitted = output<string>();

  onMenuClick(): void {
    this.menuClicked.emit();
  }

  onProfileClick(): void {
    this.profileClicked.emit();
  }

  onSearch(value: string): void {
    this.searchSubmitted.emit(value);
  }
}

import { Component, input, output } from '@angular/core';
import { Avatar } from '../../atoms/avatar/avatar';
import { Button } from '../../atoms/button/button';
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

  menuClicked = output<void>();
  notificationClicked = output<void>();
  profileClicked = output<void>();
  searchSubmitted = output<string>();

  onMenuClick(): void {
    this.menuClicked.emit();
  }

  onNotificationClick(): void {
    this.notificationClicked.emit();
  }

  onProfileClick(): void {
    this.profileClicked.emit();
  }

  onSearch(value: string): void {
    this.searchSubmitted.emit(value);
  }
}

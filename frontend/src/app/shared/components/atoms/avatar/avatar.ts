
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  name = input('User');
  src = input<string | null>(null);

  size = input<'sm' | 'md' | 'lg'>('md');
  shape = input<'circle' | 'square'>('circle');

  initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return 'U';
    }

    return parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  });
}

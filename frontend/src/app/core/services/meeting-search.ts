import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MeetingSearch {
  readonly query = signal('');
}

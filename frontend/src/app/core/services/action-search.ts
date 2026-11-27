import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActionSearch {
  readonly query = signal('');
}

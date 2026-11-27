import { Injectable, computed, signal } from '@angular/core';

export interface LocalMeeting {
  id: string;
  title: string;
  fileName: string;
  transcript: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class LocalMeetings {
  readonly uploads = signal<LocalMeeting[]>([]);
  readonly loaded = signal(false);
  readonly loadError = signal('');
  readonly cards = computed(() =>
    this.uploads().map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      date: new Date(meeting.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      duration: 'Not recorded',
      summaryStatus: 'pending' as const,
      actionItemCount: 0,
    })),
  );
  readonly ready = this.load();

  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(
          new Error('Browser storage is unavailable. Please allow site storage and try again.'),
        );
        return;
      }
      const request = indexedDB.open('meetflow-local', 1);
      request.onupgradeneeded = () =>
        request.result.createObjectStore('meetings', { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(
          new Error('Could not open browser storage. Please allow site storage and try again.'),
        );
      request.onblocked = () => reject(new Error('Close other MeetFlow tabs and try again.'));
    });
  }

  private async load(): Promise<void> {
    try {
      const db = await this.open();
      const records = await new Promise<LocalMeeting[]>((resolve, reject) => {
        const transaction = db.transaction('meetings', 'readonly');
        const request = transaction.objectStore('meetings').getAll();
        transaction.oncomplete = () => resolve(request.result);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      }).finally(() => db.close());
      this.uploads.set(records.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch (error) {
      this.loadError.set(error instanceof Error ? error.message : 'Could not load saved meetings.');
    } finally {
      this.loaded.set(true);
    }
  }

  async save(title: string, file: File): Promise<LocalMeeting> {
    if (!title.trim()) throw new Error('Please enter a meeting title.');
    if (!/\.(txt|vtt|md)$/i.test(file.name))
      throw new Error('Please choose a TXT, VTT or MD transcript.');
    if (file.size > 10 * 1024 * 1024) throw new Error('The transcript must be smaller than 10 MB.');
    const transcript = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Could not read this file. Please select it again.'));
      reader.readAsText(file);
    });
    if (!transcript.trim())
      throw new Error('This transcript is empty. Please choose a file containing text.');
    await this.ready;
    const meeting: LocalMeeting = {
      id: `local-${crypto.randomUUID()}`,
      title: title.trim(),
      fileName: file.name,
      transcript,
      createdAt: new Date().toISOString(),
    };
    const db = await this.open();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('meetings', 'readwrite');
      transaction.objectStore('meetings').put(meeting);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(new Error('Could not save the transcript. Browser storage may be full.'));
      transaction.onabort = () => reject(new Error('Saving was interrupted. Please try again.'));
    }).finally(() => db.close());
    this.uploads.update((meetings) => [meeting, ...meetings]);
    this.loadError.set('');
    return meeting;
  }
}
